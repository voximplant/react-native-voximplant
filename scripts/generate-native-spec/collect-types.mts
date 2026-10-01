import fs from 'node:fs';
import path from 'node:path';
import { BUILTIN_TYPE_NAMES, CONFIG, PATHS, REGEX } from './config.mts';
import { log } from './log.mts';
import { stripComments } from './utils.mts';

const sourceCache = new Map<string, string>();

/**
 * Backslash-escape regex metacharacters in `str` so they match literally.
 *
 * @example
 * new RegExp('foo.bar').test('fooXbar')                // → true  (wrong)
 * new RegExp(escapeRegExp('foo.bar')).test('fooXbar')  // → false (correct)
 *
 * new RegExp('foo(bar')                                // → SyntaxError: Unterminated group
 * new RegExp(escapeRegExp('foo(bar'))                  // → ok
 *
 * escapeRegExp('VideoView')                            // → 'VideoView'
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function readSource(file: string): string {
  const cached = sourceCache.get(file);
  if (cached !== undefined) return cached;
  const src = fs.readFileSync(file, 'utf8');
  sourceCache.set(file, src);
  return src;
}

export function isWithinPackagesDir(p: string): boolean {
  const rel = path.relative(PATHS.PACKAGES_DIR, p);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

export function extractTypeName(block: string): string | null {
  const m = REGEX.collect.TYPE_DECLARATION.exec(block);
  return m?.[1] ?? null;
}

function resolveImportPath(
  importPath: string,
  fromDir: string,
  srcDir: string
): string | null {
  let resolved = importPath;
  if (resolved.startsWith('@/')) {
    resolved = srcDir + '/' + resolved.slice(2);
  }
  for (const [pkg, real] of Object.entries(CONFIG.packages.aliases)) {
    if (resolved === pkg) return resolveImportPath(real, fromDir, srcDir);
    if (resolved.startsWith(pkg + '/')) {
      resolved = resolved.replace(pkg, real);
      break;
    }
  }
  const base = path.isAbsolute(resolved)
    ? resolved
    : path.resolve(fromDir, resolved);
  for (const ext of ['', '/index.ts', '.ts']) {
    const full = path.normalize(base + ext);
    if (
      isWithinPackagesDir(full) &&
      fs.existsSync(full) &&
      fs.statSync(full).isFile()
    ) {
      return full;
    }
  }
  return null;
}

function extractTypeAliasEnd(source: string, startIndex: number): number {
  const typeKeyword = source.indexOf('type', startIndex);
  if (typeKeyword === -1) return -1;

  let i = typeKeyword + 4;
  while (i < source.length && /\s/.test(source[i]!)) i++;
  while (i < source.length && /[\w$]/.test(source[i]!)) i++;
  while (i < source.length && /\s/.test(source[i]!)) i++;

  if (source[i] === '<') {
    let depth = 1;
    i++;
    while (i < source.length && depth > 0) {
      const ch = source[i]!;
      if (ch === '<') depth++;
      else if (ch === '>') depth--;
      i++;
    }
  }

  while (i < source.length && /\s/.test(source[i]!)) i++;
  if (source[i] !== '=') return -1;

  let braceDepth = 0;
  let angleDepth = 0;
  let parenDepth = 0;

  for (i++; i < source.length; i++) {
    const ch = source[i]!;
    if (ch === '{') braceDepth++;
    else if (ch === '}') braceDepth--;
    else if (ch === '<') angleDepth++;
    else if (ch === '>') angleDepth--;
    else if (ch === '(') parenDepth++;
    else if (ch === ')') parenDepth--;
    else if (
      ch === ';' &&
      braceDepth === 0 &&
      angleDepth === 0 &&
      parenDepth === 0
    ) {
      return i;
    }
  }
  return -1;
}

function extractTypeBlocks(source: string, names: Set<string>): string[] {
  const results: string[] = [];
  for (const name of names) {
    const startRe = new RegExp(
      `(?:^|\\n)(?:export\\s+)?(?:interface|type|enum)\\s+${escapeRegExp(
        name
      )}\\b`
    );
    const startMatch = startRe.exec(source);
    if (!startMatch) continue;

    const keyword = startMatch[0].match(/interface|type|enum/)?.[0];
    if (!keyword) continue;

    if (keyword === 'type') {
      const end = extractTypeAliasEnd(source, startMatch.index);
      if (end === -1) continue;
      results.push(source.slice(startMatch.index, end + 1).trim());
      continue;
    }

    const openIdx = source.indexOf('{', startMatch.index);
    if (openIdx === -1) continue;

    let depth = 0;
    let i = openIdx;
    for (; i < source.length; i++) {
      if (source[i] === '{') depth++;
      else if (source[i] === '}') {
        depth--;
        if (depth === 0) break;
      }
    }
    results.push(source.slice(startMatch.index, i + 1).trim());
  }
  return results;
}

function stripExport(block: string): string {
  return stripComments(block.replace(REGEX.collect.STRIP_EXPORT, ''));
}

function extractTypeNames(
  specifier: string,
  isTypeImport: boolean
): Set<string> {
  return new Set(
    specifier
      .split(',')
      .map((s) => s.trim())
      .filter((s) => isTypeImport || REGEX.import.INLINE_TYPE_PREFIX.test(s))
      .map((s) => s.replace(REGEX.import.INLINE_TYPE_PREFIX, ''))
      .filter(Boolean)
  );
}

function collectTypes(
  filePath: string,
  names: Set<string>,
  srcDir: string,
  collected: Set<string> = new Set()
): string[] {
  log.debug(
    `[collectTypes] ${path.relative(
      PATHS.PACKAGES_DIR,
      filePath
    )} looking for: ${[...names].join(', ')}`
  );
  const source = readSource(filePath);
  const results: string[] = [];

  for (const block of extractTypeBlocks(source, names)) {
    const name = extractTypeName(block);
    if (name) {
      if (collected.has(name)) {
        log.debug(`[collectTypes] SKIP duplicate: ${name}`);
        continue;
      }
      collected.add(name);
      log.debug(`[collectTypes] COLLECT: ${name}`);
    }
    results.push(stripExport(block));
  }

  const remaining = [...names].filter((n) => !collected.has(n));
  if (remaining.length === 0) return results;

  for (const m of source.matchAll(REGEX.collect.EXPORT_STAR)) {
    const exportPath = m[1];
    if (!exportPath) continue;
    const resolved = resolveImportPath(
      exportPath,
      path.dirname(filePath),
      srcDir
    );
    if (!resolved) continue;
    const isSharedFile = resolved.startsWith(PATHS.SHARED_SRC);
    const isTraversableFile = REGEX.collect.TRAVERSABLE_FILE.test(resolved);
    const isPackageIndex =
      !isSharedFile &&
      path.basename(resolved) === CONFIG.packages.indexFilename;
    if (isTraversableFile || isPackageIndex) {
      results.push(
        ...collectTypes(resolved, new Set(remaining), srcDir, collected)
      );
    }
  }

  for (const m of source.matchAll(REGEX.collect.EXPORT_NAMED)) {
    const exportedNamesRaw = m[1];
    const exportFrom = m[2];
    if (!exportedNamesRaw || !exportFrom) continue;
    const exportedNames = exportedNamesRaw.split(',').map((s) => s.trim());
    const matched = new Set(exportedNames.filter((n) => remaining.includes(n)));
    if (matched.size > 0) {
      const resolved = resolveImportPath(
        exportFrom,
        path.dirname(filePath),
        srcDir
      );
      if (resolved) {
        results.push(...collectTypes(resolved, matched, srcDir, collected));
      }
    }
  }

  return results;
}

function findTsFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((e) => {
    const full = path.normalize(path.join(dir, e.name));
    if (!isWithinPackagesDir(full)) return [];
    if (e.isDirectory()) return findTsFiles(full);
    if (e.isFile() && e.name.endsWith('.ts')) {
      if (
        full.startsWith(PATHS.SHARED_SRC) ||
        REGEX.collect.TRAVERSABLE_FILE.test(e.name)
      ) {
        return [full];
      }
    }
    return [];
  });
}

function findReferencedTypeNames(block: string): string[] {
  const matches = block.match(REGEX.spec.TYPE_NAME_REF) || [];
  return [...new Set(matches)].filter((n) => !BUILTIN_TYPE_NAMES.has(n));
}

export function resolveTransitiveTypes(
  inlinedBlocks: string[],
  searchRoots: string[],
  excludeFiles: Set<string> = new Set(),
  collected: Set<string> = new Set()
): string[] {
  const allInlinedNames = new Set<string>([
    ...collected,
    ...inlinedBlocks
      .map(extractTypeName)
      .filter((name): name is string => name !== null),
  ]);

  log.debug(
    `[resolveTransitiveTypes] seed names: ${[...allInlinedNames].join(', ')}`
  );

  const allTsFiles = searchRoots
    .flatMap(findTsFiles)
    .filter((f) => !excludeFiles.has(f));
  const extra: string[] = [];
  let changed = true;

  while (changed) {
    changed = false;
    const missing = [...inlinedBlocks, ...extra]
      .flatMap(findReferencedTypeNames)
      .filter((n) => !allInlinedNames.has(n));

    if (missing.length === 0) break;

    log.debug(
      `[resolveTransitiveTypes] resolving missing: ${missing.join(', ')}`
    );

    for (const file of allTsFiles) {
      const source = readSource(file);
      const found = extractTypeBlocks(source, new Set(missing));
      for (const block of found) {
        const name = extractTypeName(block);
        if (!name) continue;
        if (allInlinedNames.has(name)) {
          log.debug(
            `[resolveTransitiveTypes] SKIP duplicate: ${name} from ${path.relative(
              PATHS.PACKAGES_DIR,
              file
            )}`
          );
          continue;
        }
        log.debug(
          `[resolveTransitiveTypes] COLLECT: ${name} from ${path.relative(
            PATHS.PACKAGES_DIR,
            file
          )}`
        );
        allInlinedNames.add(name);
        extra.push(stripExport(block));
        changed = true;
      }
    }
  }

  return extra;
}

export function collectTypesFromImports(
  source: string,
  inputFile: string,
  srcDir: string,
  collected: Set<string>
): string[] {
  const blocks: string[] = [];
  for (const m of source.matchAll(REGEX.import.ANY_NAMED)) {
    const isTypeImport = REGEX.import.TYPE_ONLY.test(m[0]);
    const specifier = m[1];
    const modulePath = m[2];
    if (!specifier || !modulePath) continue;
    const names = extractTypeNames(specifier, isTypeImport);
    if (names.size === 0) continue;
    if (modulePath === CONFIG.packages.reactNative) continue;
    const resolved = resolveImportPath(
      modulePath,
      path.dirname(inputFile),
      srcDir
    );
    if (!resolved) {
      log.warn(`Could not resolve: ${modulePath}`);
      continue;
    }
    blocks.push(...collectTypes(resolved, names, srcDir, collected));
  }
  return blocks;
}
