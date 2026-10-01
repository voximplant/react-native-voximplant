import fs from 'node:fs';
import path from 'node:path';
import {
  collectTypesFromImports,
  escapeRegExp,
  extractTypeName,
  isWithinPackagesDir,
  readSource,
  resolveTransitiveTypes,
} from './collect-types.mts';
import {
  CONFIG,
  GENERIC_RETURN_WRAPPERS,
  INLINE,
  PATHS,
  REGEX,
} from './config.mts';
import { log } from './log.mts';
import type {
  CodegenPrimitive,
  ExtractedImports,
  PreparedSpec,
  ResolutionContext,
  TypeBlocks,
  TypeCategory,
} from './types.mts';
import { stripComments } from './utils.mts';

function containsWord(str: string, word: string): boolean {
  return new RegExp(`\\b${escapeRegExp(word)}\\b`).test(str);
}

function toPascalCase(str: string): string {
  return str
    .replace(REGEX.cleanup.PASCAL_CASE, (_, c: string) => c.toUpperCase())
    .replace(REGEX.cleanup.HYPHEN, '');
}

function getPackageDirFromInputFile(inputFile: string): string {
  return path.dirname(path.dirname(path.dirname(inputFile)));
}

function getTypeNames(blocks: string[]): Set<string> {
  return new Set(
    blocks.map(extractTypeName).filter((name): name is string => name !== null)
  );
}

function getTypeCategory(block: string): TypeCategory {
  if (REGEX.declaration.ENUM.test(block)) return 'enum';
  if (REGEX.declaration.PRIMITIVE_ALIAS.test(block)) return 'alias';
  return 'object';
}

function getEnumPrimitive(block: string): CodegenPrimitive {
  return REGEX.declaration.ENUM_STRING_LITERAL.test(block)
    ? 'string'
    : 'number';
}

function getTypePrimitive(block: string): CodegenPrimitive {
  if (REGEX.declaration.ENUM.test(block)) return getEnumPrimitive(block);
  const m = REGEX.declaration.PRIMITIVE_ALIAS.exec(block);
  if (m?.[1] === 'string' || m?.[1] === 'number' || m?.[1] === 'boolean') {
    return m[1];
  }
  return 'Object';
}

function getTypeAliasRhs(block: string): string | null {
  const m = REGEX.declaration.TYPE_ALIAS_RHS.exec(block.trim());
  return m?.[1]?.trim() ?? null;
}

function isTerminalObjectRhs(rhs: string): boolean {
  const t = rhs.trim();
  return t === 'Object' || REGEX.declaration.RECORD_ANGLE.test(t);
}

function buildEnumNames(blocks: string[]): Set<string> {
  return new Set(
    blocks
      .filter((b) => getTypeCategory(b) === 'enum')
      .map(extractTypeName)
      .filter((n): n is string => n !== null)
  );
}

function buildPrimitiveAliasMap(
  blocks: string[]
): Map<string, CodegenPrimitive> {
  const map = new Map<string, CodegenPrimitive>();
  for (const block of blocks) {
    if (getTypeCategory(block) !== 'alias') continue;
    const name = extractTypeName(block);
    if (name) map.set(name, getTypePrimitive(block));
  }
  return map;
}

function buildEnumDerivedAliasMap(
  blocks: string[],
  enumNames: Set<string>
): Map<string, CodegenPrimitive> {
  const map = new Map<string, CodegenPrimitive>();
  for (const block of blocks) {
    const name = extractTypeName(block);
    if (!name || getTypeCategory(block) === 'enum') continue;
    const rhs = getTypeAliasRhs(block);
    if (!rhs) continue;
    const simple = REGEX.alias.SIMPLE_RHS.exec(rhs);
    if (!simple?.[1] || !enumNames.has(simple[1])) continue;
    const enumBlock = blocks.find((b) => extractTypeName(b) === simple[1]);
    map.set(name, enumBlock ? getEnumPrimitive(enumBlock) : 'string');
  }
  return map;
}

function buildResolutionContext(rawBlocks: string[]): ResolutionContext {
  const enumNames = buildEnumNames(rawBlocks);
  return {
    knownTypeNames: getTypeNames(rawBlocks),
    rawBlocks,
    enumNames,
    primitiveAliases: buildPrimitiveAliasMap(rawBlocks),
    enumDerivedAliases: buildEnumDerivedAliasMap(rawBlocks, enumNames),
  };
}

function resolveRhs(
  rhs: string,
  ctx: ResolutionContext,
  visited: Set<string>
): string | null {
  const t = rhs.trim();
  if (isTerminalObjectRhs(t)) return 'Object';

  const simple = REGEX.alias.SIMPLE_RHS.exec(t);
  if (simple) {
    return resolveTypeRef(ctx, simple[1]!, visited);
  }

  const generic = REGEX.alias.GENERIC_RHS.exec(t);
  if (generic) {
    const name = generic[1]!;
    const def = ctx.rawBlocks.find((b) => extractTypeName(b) === name);
    const defRhs = def ? getTypeAliasRhs(def) : null;
    if (!defRhs) return null;
    if (isTerminalObjectRhs(defRhs) || REGEX.record.test(defRhs)) {
      return 'Object';
    }
    return resolveRhs(defRhs, ctx, visited);
  }

  return null;
}

function resolveTypeRef(
  ctx: ResolutionContext,
  typeName: string,
  visited: Set<string> = new Set()
): string | null {
  if (visited.has(typeName)) return null;
  visited.add(typeName);
  if (!ctx.knownTypeNames.has(typeName)) return null;

  const block = ctx.rawBlocks.find((b) => extractTypeName(b) === typeName);
  if (!block) return null;

  const cat = getTypeCategory(block);
  if (cat === 'enum') return getEnumPrimitive(block);
  if (cat === 'alias') return getTypePrimitive(block);

  const enumDerived = ctx.enumDerivedAliases.get(typeName);
  if (enumDerived) return enumDerived;

  const rhs = getTypeAliasRhs(block);
  if (!rhs) return null;
  if (isTerminalObjectRhs(rhs)) return 'Object';

  return resolveRhs(rhs, ctx, visited);
}

function buildObjectResolvableNames(ctx: ResolutionContext): Set<string> {
  const names = new Set<string>();
  for (const name of ctx.knownTypeNames) {
    if (resolveTypeRef(ctx, name) === 'Object') {
      names.add(name);
    }
  }
  return names;
}

function isNormalizableBlock(block: string, ctx: ResolutionContext): boolean {
  const cat = getTypeCategory(block);
  if (cat === 'enum' || cat === 'alias') return false;
  if (REGEX.declaration.INTERFACE.test(block)) return true;
  if (!REGEX.declaration.TYPE_ALIAS.test(block)) return false;
  const name = extractTypeName(block);
  if (!name) return false;
  return resolveTypeRef(ctx, name) !== 'Object';
}

function extractInterfaceBody(block: string): string | null {
  const m = REGEX.dto.INTERFACE_BODY.exec(block.trim());
  return m?.[1]?.trim() ?? null;
}

function parseInterfaceFields(body: string): Map<string, string> {
  const fields = new Map<string, string>();
  for (const m of body.matchAll(REGEX.dto.INTERFACE_FIELD)) {
    fields.set(m[2]!, m[0].trim());
  }
  return fields;
}

function mergeInterfaceFields(baseBody: string, overrideBody: string): string {
  const fields = parseInterfaceFields(baseBody);
  for (const [name, line] of parseInterfaceFields(overrideBody)) {
    fields.set(name, line);
  }
  return [...fields.values()].map((line) => `  ${line}`).join('\n');
}

function parseOmitKeys(keysPart: string): Set<string> {
  const keys = new Set<string>();
  for (const m of keysPart.matchAll(REGEX.dto.OMIT_KEY)) {
    keys.add(m[1]!);
  }
  return keys;
}

function omitInterfaceFields(body: string, omitKeys: Set<string>): string {
  const fields = parseInterfaceFields(body);
  for (const key of omitKeys) {
    fields.delete(key);
  }
  return [...fields.values()].map((line) => `  ${line}`).join('\n');
}

function applyDtoExpansion(
  blocks: string[],
  expanded: Map<string, string>,
  basesToDrop: Set<string>,
  dropDtoAliases: Set<string>
): string[] {
  if (expanded.size === 0) return blocks;

  const kept = blocks.filter((block) => {
    const name = extractTypeName(block);
    if (!name) return true;
    if (dropDtoAliases.has(name)) return false;
    if (basesToDrop.has(name)) return false;
    return true;
  });

  return [...kept, ...expanded.values()];
}

function expandDtoOmitTypes(blocks: string[]): string[] {
  const expanded = new Map<string, string>();
  const basesToDrop = new Set<string>();
  const dropDtoAliases = new Set<string>();
  for (const block of blocks) {
    const trimmed = block.trim();
    if (REGEX.dto.OMIT_WITH_INTERSECTION.test(trimmed)) continue;
    const m = REGEX.dto.OMIT_ONLY.exec(trimmed);
    if (!m) continue;
    const dtoName = m[1]!;
    const baseName = m[2]!;
    const omitKeys = parseOmitKeys(m[3]!);
    if (omitKeys.size === 0) continue;
    const baseBlock = blocks.find((b) => extractTypeName(b) === baseName);
    if (!baseBlock || !REGEX.declaration.INTERFACE.test(baseBlock)) continue;
    const baseBody = extractInterfaceBody(baseBlock);
    if (!baseBody) continue;
    const merged = omitInterfaceFields(baseBody, omitKeys);
    expanded.set(dtoName, `interface ${dtoName} {\n${merged}\n}`);
    basesToDrop.add(baseName);
    dropDtoAliases.add(dtoName);
  }
  return applyDtoExpansion(blocks, expanded, basesToDrop, dropDtoAliases);
}

function expandDtoIntersections(blocks: string[]): string[] {
  const expanded = new Map<string, string>();
  const basesToDrop = new Set<string>();
  const dropDtoAliases = new Set<string>();
  for (const block of blocks) {
    const m = REGEX.dto.INTERSECTION.exec(block.trim());
    if (!m) continue;
    const dtoName = m[1]!;
    const baseName = m[2]!;
    const overrideBody = m[3]!;
    const baseBlock = blocks.find((b) => extractTypeName(b) === baseName);
    if (!baseBlock || !REGEX.declaration.INTERFACE.test(baseBlock)) continue;
    const baseBody = extractInterfaceBody(baseBlock);
    if (!baseBody) continue;
    const merged = mergeInterfaceFields(baseBody, overrideBody);
    expanded.set(dtoName, `interface ${dtoName} {\n${merged}\n}`);
    basesToDrop.add(baseName);
    dropDtoAliases.add(dtoName);
  }
  return applyDtoExpansion(blocks, expanded, basesToDrop, dropDtoAliases);
}

function normalizeBlockText(
  block: string,
  ctx: ResolutionContext,
  objectResolvableNames: Set<string>
): string {
  let text = block;
  text = text.replace(REGEX.spec.ENUM_MEMBER_ACCESS, 'string');
  text = replaceRecordTypes(text);

  for (const name of ctx.enumNames) {
    text = text.replace(
      new RegExp(`\\b${escapeRegExp(name)}\\b`, 'g'),
      'string'
    );
  }
  for (const [name, prim] of ctx.primitiveAliases) {
    text = text.replace(new RegExp(`\\b${escapeRegExp(name)}\\b`, 'g'), prim);
  }
  for (const [name, prim] of ctx.enumDerivedAliases) {
    text = text.replace(new RegExp(`\\b${escapeRegExp(name)}\\b`, 'g'), prim);
  }
  for (const name of objectResolvableNames) {
    text = text.replace(
      new RegExp(`\\b${escapeRegExp(name)}\\b`, 'g'),
      'Object'
    );
  }
  return text;
}

function normalizeBlocks(blocks: string[], ctx: ResolutionContext): string[] {
  const objectResolvableNames = buildObjectResolvableNames(ctx);
  return blocks.map((block) => {
    if (!isNormalizableBlock(block, ctx)) return block;
    return normalizeBlockText(block, ctx, objectResolvableNames);
  });
}

function simplifyEventEmitterArg(
  typeArg: string,
  ctx: ResolutionContext
): string {
  const t = typeArg.trim();
  if (t === 'void') return 'void';
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  if (t.startsWith('{')) return 'Object';

  const arrayMatch = REGEX.spec.ARRAY_TYPE_SUFFIX.exec(t);
  if (arrayMatch) {
    return `${simplifyEventEmitterArg(arrayMatch[1]!, ctx)}[]`;
  }

  if (ctx.enumNames.has(t)) return 'string';
  if (ctx.enumDerivedAliases.has(t)) return 'string';

  const resolved = resolveTypeRef(ctx, t);
  if (
    resolved === 'string' ||
    resolved === 'number' ||
    resolved === 'boolean'
  ) {
    return resolved;
  }

  if (REGEX.spec.PASCAL_CASE_START.test(t)) return 'Object';
  return t;
}

function simplifyPromiseArg(typeArg: string, ctx: ResolutionContext): string {
  const t = typeArg.trim();
  const resolved = resolveTypeRef(ctx, t);
  if (resolved) return resolved;
  if (REGEX.spec.PASCAL_CASE_START.test(t)) return 'Object';
  return t;
}

function simplifyGenerics(str: string, ctx: ResolutionContext): string {
  const wrappers = GENERIC_RETURN_WRAPPERS.join('|');
  const re = new RegExp(`(=>\\s*|:\\s*)(${wrappers})<([^>]+)>`, 'g');
  return str.replace(
    re,
    (
      _match: string,
      prefix: string,
      wrapper: string,
      typeArg: string
    ): string => {
      if (wrapper === 'Promise') {
        const inner = simplifyPromiseArg(typeArg, ctx);
        return `${prefix}Promise<${inner}>`;
      }
      const inner = simplifyEventEmitterArg(typeArg, ctx);
      return `${prefix}${wrapper}<${inner}>`;
    }
  );
}

function resolvePropTypes(str: string, ctx: ResolutionContext): string {
  return str.replace(
    REGEX.spec.PROP_TYPE,
    (match: string, prefix: string, typeName: string) => {
      const resolved = resolveTypeRef(ctx, typeName);
      return resolved ? `${prefix}${resolved}` : match;
    }
  );
}

function resolveArrayTypes(str: string, ctx: ResolutionContext): string {
  return str.replace(REGEX.spec.ARRAY_TYPE, (match, name: string) => {
    const resolved = resolveTypeRef(ctx, name);
    return resolved ? `${resolved}[]` : match;
  });
}

function resolveTypeRefs(str: string, ctx: ResolutionContext): string {
  return str.replace(REGEX.spec.TYPE_NAME_REF, (match, name: string) => {
    const resolved = resolveTypeRef(ctx, name);
    return resolved ?? match;
  });
}

function replaceRecordTypes(str: string): string {
  return str.replace(REGEX.record, 'Object');
}

function replaceUtilityTypes(str: string): string {
  let prev: string;
  let curr = str;
  do {
    prev = curr;
    curr = curr
      .replace(REGEX.util.TWO_ARGS, '$1')
      .replace(REGEX.util.ONE_ARG, '$1');
  } while (curr !== prev);
  return curr;
}

function selectOutputBlocks(
  blocks: string[],
  ctx: ResolutionContext
): string[] {
  return blocks.filter((block) => {
    if (getTypeCategory(block) !== 'object') return false;
    if (REGEX.declaration.INTERFACE.test(block)) return true;
    const name = extractTypeName(block);
    if (!name) return true;
    return resolveTypeRef(ctx, name) !== 'Object';
  });
}

function reachableFromSpec(blocks: string[], output: string): Set<string> {
  const blockNames = getTypeNames(blocks);
  const referenced = new Set<string>();
  const queue: string[] = [];

  for (const m of output.matchAll(REGEX.spec.TYPE_NAME_REF)) {
    const name = m[1]!;
    if (blockNames.has(name)) queue.push(name);
  }

  while (queue.length > 0) {
    const name = queue.pop()!;
    if (referenced.has(name)) continue;
    referenced.add(name);

    const block = blocks.find((b) => extractTypeName(b) === name);
    if (!block) continue;

    for (const m of block.matchAll(REGEX.spec.TYPE_NAME_REF)) {
      const ref = m[1]!;
      if (blockNames.has(ref) && !referenced.has(ref)) {
        queue.push(ref);
      }
    }
  }

  return referenced;
}

function pruneUnreachableBlocks(blocks: string[], output: string): string[] {
  const referenced = reachableFromSpec(blocks, output);
  return blocks.filter((block) => {
    const name = extractTypeName(block);
    if (!name) return true;
    return referenced.has(name);
  });
}

function extractImports(str: string): ExtractedImports {
  const imports: string[] = [];
  const specSource = str.replace(REGEX.import.STATEMENT, (m) => {
    if (!REGEX.import.TYPE_ONLY.test(m)) imports.push(m.trim());
    return '';
  });
  return {
    imports: imports.join('\n'),
    specSource: specSource.replace(REGEX.cleanup.MULTI_NEWLINE, '\n\n').trim(),
  };
}

function dedupeBlocks(blocks: string[]): string[] {
  const seen = new Set<string>();
  return blocks.filter((block) => {
    const name = extractTypeName(block);
    if (!name) return true;
    if (seen.has(name)) {
      log.debug(`[dedupeBlocks] REMOVE duplicate: ${name}`);
      return false;
    }
    seen.add(name);
    return true;
  });
}

function stripTypeImports(source: string): string {
  return source.replace(REGEX.import.STRIP_TYPE_ONLY, '');
}

function prepareTypeBlocks(
  importedBlocks: string[],
  transitive: string[]
): TypeBlocks {
  const deduped = dedupeBlocks([...transitive, ...importedBlocks]);
  const afterOmit = expandDtoOmitTypes(deduped);
  const rawBlocks = afterOmit.map(replaceUtilityTypes);
  const ctx = buildResolutionContext(rawBlocks);
  const outputBlocks = normalizeBlocks(expandDtoIntersections(rawBlocks), ctx);
  return { rawBlocks, outputBlocks };
}

function prepareSpec(inputFile: string): PreparedSpec {
  const pkgDir = getPackageDirFromInputFile(inputFile);
  const srcDir = path.join(pkgDir, 'src');
  const outputDir = path.join(pkgDir, CONFIG.specs.outputSubdir);
  const source = readSource(inputFile);
  const collected = new Set<string>();

  const importedBlocks = collectTypesFromImports(
    source,
    inputFile,
    srcDir,
    collected
  );

  let body = stripTypeImports(source);
  body = stripComments(body);
  const { imports, specSource } = extractImports(body);

  const searchRoots = [...new Set([srcDir, PATHS.SHARED_SRC])].filter(
    fs.existsSync
  );
  const transitive = resolveTransitiveTypes(
    [...importedBlocks, specSource],
    searchRoots,
    new Set([inputFile]),
    collected
  );

  const { rawBlocks, outputBlocks } = prepareTypeBlocks(
    importedBlocks,
    transitive
  );
  return { outputDir, imports, specSource, rawBlocks, outputBlocks };
}

function writeSpec(
  outputFile: string,
  imports: string,
  outputBlocks: string[],
  specBody: string,
  ctx: ResolutionContext
): void {
  const filteredBlocks = pruneUnreachableBlocks(
    selectOutputBlocks(outputBlocks, ctx),
    specBody
  );
  const filteredImports = (imports || '')
    .replace(
      REGEX.import.NAMED,
      (full: string, inner: string, from: string) => {
        const parts = inner
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        const used = parts.filter((p: string) => {
          const name = p.replace(REGEX.import.INLINE_TYPE_PREFIX, '').trim();
          return containsWord(specBody, name);
        });
        if (used.length === 0) return '';
        if (used.length === parts.length) return full;
        return `import { ${used.join(', ')} } from '${from}';`;
      }
    )
    .replace(REGEX.cleanup.TRIPLE_NEWLINE, '\n\n')
    .trim();
  const parts = [filteredImports, filteredBlocks.join('\n\n'), specBody].filter(
    Boolean
  );
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(
    outputFile,
    CONFIG.specs.outputHeader + parts.join('\n\n') + '\n'
  );
  log.info('Generated:', path.relative(PATHS.REPO_ROOT, outputFile));
}

function extractModuleName(output: string): string | null {
  const match = REGEX.inline.MODULE_NAME_CONST.exec(output);
  return match?.[1] ?? null;
}

function inlineModuleNameConst(output: string): string {
  const moduleName = extractModuleName(output);
  if (!moduleName) return output;
  return output
    .replace(REGEX.inline.MODULE_NAME_CONST, '')
    .replace(REGEX.inline.MODULE_NAME_REF, `'${moduleName}'`);
}

function inlineResolveNativeModuleCall(output: string): string {
  return output.replace(
    REGEX.inline.RESOLVE_NATIVE_MODULE,
    (_match: string, nativeKey: string) =>
      INLINE.resolveNativeModuleCall(nativeKey)
  );
}

function inlineIsNewArchEnabledCall(output: string): string {
  return output.replace(
    REGEX.inline.IS_NEW_ARCH_ENABLED,
    () => INLINE.IS_NEW_ARCH_ENABLED
  );
}

function ensureReactNativeImports(imports: string, output: string): string {
  const needed = CONFIG.packages.runtimeImports.filter((n) =>
    containsWord(output, n)
  );
  if (needed.length === 0) return imports;

  const existing = (imports || '').match(REGEX.import.REACT_NATIVE);

  if (existing) {
    const items = existing[1]
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
    for (const n of needed) {
      if (!items.includes(n)) items.push(n);
    }
    const merged = `import { ${items.join(', ')} } from '${
      CONFIG.packages.reactNative
    }';`;
    return imports.replace(REGEX.import.REACT_NATIVE, () => merged);
  }

  const line = `import { ${needed.join(', ')} } from '${
    CONFIG.packages.reactNative
  }';`;
  return imports ? `${imports}\n${line}` : line;
}

function collapseUnionTypes(str: string): string {
  return str.replace(/\b(string|number|boolean)\b(?:\s*\|\s*\1\b)+/g, '$1');
}

function transformSpecBody(specSource: string, ctx: ResolutionContext): string {
  let output = simplifyGenerics(specSource, ctx);
  output = resolvePropTypes(output, ctx);
  output = resolveArrayTypes(output, ctx);
  output = replaceRecordTypes(output);
  output = replaceUtilityTypes(output);
  output = resolveTypeRefs(output, ctx);
  output = collapseUnionTypes(output);
  return output;
}

export function processSpec(inputFile: string): void {
  const { outputDir, imports, specSource, rawBlocks, outputBlocks } =
    prepareSpec(inputFile);
  const pkgName = path
    .basename(inputFile)
    .replace(CONFIG.specs.inputSuffix, '');
  const outputFile = path.join(
    outputDir,
    `${CONFIG.specs.moduleOutputPrefix}${toPascalCase(pkgName)}.ts`
  );

  log.debug(`\n=== processSpec: ${pkgName} ===`);

  const ctx = buildResolutionContext(rawBlocks);
  let specBody = transformSpecBody(specSource, ctx);

  specBody = inlineModuleNameConst(specBody);
  specBody = inlineResolveNativeModuleCall(specBody);
  specBody = inlineIsNewArchEnabledCall(specBody);
  const finalImports = ensureReactNativeImports(imports, specBody);

  writeSpec(outputFile, finalImports, outputBlocks, specBody, ctx);
}

export function processComponentSpec(inputFile: string): void {
  const { outputDir, imports, specSource, rawBlocks, outputBlocks } =
    prepareSpec(inputFile);
  const componentName = path
    .basename(inputFile)
    .replace(CONFIG.specs.componentInputSuffix, '');
  const outputFile = path.join(
    outputDir,
    `${toPascalCase(componentName)}${CONFIG.specs.componentOutputSuffix}`
  );

  log.debug(`\n=== processComponentSpec: ${componentName} ===`);

  const ctx = buildResolutionContext(rawBlocks);
  const specBody = transformSpecBody(specSource, ctx);

  writeSpec(outputFile, imports, outputBlocks, specBody, ctx);
}

export function findSpecFilesInPackage(
  pkgDir: string,
  suffix: string
): string[] {
  const specsDir = path.join(pkgDir, CONFIG.specs.inputSubdir);
  if (!fs.existsSync(specsDir)) return [];
  return fs
    .readdirSync(specsDir)
    .filter((f) => f.endsWith(suffix))
    .map((f) => path.normalize(path.join(specsDir, f)));
}

export function findSpecFilesInDir(dir: string, suffix: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (!e.isDirectory()) return [];
    const pkgDir = path.normalize(path.join(dir, e.name));
    if (!isWithinPackagesDir(pkgDir)) return [];
    return findSpecFilesInPackage(pkgDir, suffix);
  });
}

export function resolvePkgDirFromArg(
  pkgPathArg: string | undefined
): string | null {
  if (!pkgPathArg) return null;
  const pkgDir = path.normalize(
    path.isAbsolute(pkgPathArg)
      ? pkgPathArg
      : path.resolve(process.cwd(), pkgPathArg)
  );
  return isWithinPackagesDir(pkgDir) ? pkgDir : null;
}

export function cleanOutputDir(pkgDir: string): void {
  const outDir = path.join(pkgDir, CONFIG.specs.outputSubdir);
  if (!fs.existsSync(outDir)) return;
  fs.rmSync(outDir, { recursive: true, force: true });
  log.info('Cleaned:', path.relative(PATHS.REPO_ROOT, outDir));
}

export function cleanAllOutputDirs(): void {
  for (const entry of fs.readdirSync(PATHS.PACKAGES_DIR, {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    cleanOutputDir(path.join(PATHS.PACKAGES_DIR, entry.name));
  }
}
