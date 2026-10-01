import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repoRoot = path.resolve(__dirname, '../..');
const packagesDir = path.join(repoRoot, 'packages');
const sharedSrc = path.join(packagesDir, 'shared/src');

export const PATHS = {
  REPO_ROOT: repoRoot,
  PACKAGES_DIR: packagesDir,
  SHARED_SRC: sharedSrc,
} as const;

export const CONFIG = {
  DEBUG: false,

  specs: {
    inputSubdir: path.join('src', 'specs'),
    outputSubdir: path.join('src', 'specs', 'generated'),
    inputSuffix: '.native-spec.ts',
    componentInputSuffix: '.native-component-spec.ts',
    moduleOutputPrefix: 'Native',
    componentOutputSuffix: 'NativeComponent.ts',
    outputHeader: `// @generated — do not edit manually, run 'yarn gen:spec'\n\n`,
  },

  packages: {
    indexFilename: 'index.ts',
    reactNative: 'react-native',
    aliases: {
      '@voximplant/react-native-shared': sharedSrc,
    } satisfies Record<string, string>,
    runtimeImports: ['TurboModuleRegistry', 'NativeModules'] as const,
  },
} as const;

export const BUILTIN_TYPE_NAMES = new Set<string>([
  'Promise',
  'Array',
  'Object',
  'string',
  'number',
  'boolean',
  'void',
  'null',
  'undefined',
]);

export const GENERIC_RETURN_WRAPPERS = [
  'Promise',
  'EventEmitter',
  'CodegenTypes\\.EventEmitter',
] as const;

export const REGEX = {
  collect: {
    TYPE_DECLARATION: /(?:interface|type|enum)\s+(\w+)/,
    EXPORT_STAR: /export \* from '([^']+)'/g,
    EXPORT_NAMED: /export \{([^}]+)\} from '([^']+)'/g,
    TRAVERSABLE_FILE: /\.(types|events|internal|dto)\.ts$/,
    STRIP_EXPORT: /^\s*export\s+/,
  },

  import: {
    ANY_NAMED: /import\s+(?:type\s*)?\{([^}]+)\}\s*from\s*'([^']+)';?/gm,
    TYPE_ONLY: /^import\s+type\s*\{/,
    STRIP_TYPE_ONLY: /import\s+type\s*\{[^}]+\}\s*from\s*'[^']+';?/g,
    NAMED: /import\s*\{([^}]*)\}\s*from\s*'([^']+)'\s*;?/g,
    STATEMENT: /import\b[\s\S]*?from\s+'[^']+';/g,
    REACT_NATIVE: /import\s*\{([\s\S]*?)\}\s*from\s*'react-native'\s*;/,
    INLINE_TYPE_PREFIX: /^type\s+/,
  },

  util: {
    TWO_ARGS:
      /\b(?:Exclude|Extract|Omit|Pick)\s*<\s*([A-Za-z_][\w.]*)\s*,[^<>]*>/g,
    ONE_ARG:
      /\b(?:Partial|Required|Readonly|NonNullable)\s*<\s*([A-Za-z_][\w.]*)\s*>/g,
  },

  record: /\bRecord\s*<[^>]+>/g,

  declaration: {
    ENUM: /^enum\s/m,
    PRIMITIVE_ALIAS: /^type\s+\w+\s*=\s*(string|number|boolean)\b/m,
    TYPE_ALIAS_RHS: /^type\s+\w+(?:<[^>]*>)?\s*=\s*(.+?)\s*;?\s*$/s,
    INTERFACE: /^interface\s/,
    TYPE_ALIAS: /^type\s+\w+\s*=/,
    ENUM_STRING_LITERAL: /=\s*['"`]/,
    RECORD_ANGLE: /^Record\s*</,
  },

  dto: {
    INTERSECTION: /^type\s+(\w+DTO)\s*=\s*(\w+)\s*&\s*\{([\s\S]*)\}\s*;?\s*$/m,
    OMIT_ONLY:
      /^type\s+(\w+DTO)\s*=\s*Omit\s*<\s*(\w+)\s*,\s*([\s\S]+?)>\s*;?\s*$/m,
    OMIT_WITH_INTERSECTION: /Omit\s*<[\s\S]+>\s*&/,
    OMIT_KEY: /'([^']+)'/g,
    INTERFACE_BODY:
      /^interface\s+\w+(?:\s+extends\s+[^{]+)?\s*\{([\s\S]*)\}\s*$/m,
    INTERFACE_FIELD: /^\s*((?:readonly\s+)?)(\w+)(\??)\s*:\s*([^;]+);\s*$/gm,
  },

  alias: {
    SIMPLE_RHS: /^([A-Z][a-zA-Z0-9]*)$/,
    GENERIC_RHS: /^([A-Z][a-zA-Z0-9]*)\s*<[^>]+>$/,
  },

  spec: {
    TYPE_NAME_REF: /\b([A-Z][a-zA-Z0-9]*)\b/g,
    ENUM_MEMBER_ACCESS: /\b[A-Z][a-zA-Z0-9]*\.[A-Z][a-zA-Z0-9]*\b/g,
    PASCAL_CASE_START: /^[A-Z]/,
    ARRAY_TYPE_SUFFIX: /^(?:readonly\s+)?(.+)\[\]$/,
    PROP_TYPE: /(\w+\s*\??\s*:\s*)([A-Z][a-zA-Z0-9]*)/g,
    ARRAY_TYPE: /\b([A-Z][a-zA-Z0-9]*)\[\]/g,
  },

  inline: {
    MODULE_NAME_CONST:
      /^[ \t]*const\s+MODULE_NAME\s*=\s*['"]([^'"]+)['"]\s*;[ \t]*\r?\n?/m,
    MODULE_NAME_REF: /\bMODULE_NAME\b/g,
    RESOLVE_NATIVE_MODULE:
      /resolveNativeModule<Spec>\(\s*['"]([^'"]+)['"]\s*\)/g,
    IS_NEW_ARCH_ENABLED: /\bisNewArchEnabled\(\)/g,
  },

  cleanup: {
    BLOCK_COMMENT: /\/\*[\s\S]*?\*\//g,
    LINE_COMMENT: /\/\/.*$/gm,
    EMPTY_LINE: /^\s*$/gm,
    MULTI_NEWLINE: /\n{2,}/g,
    TRIPLE_NEWLINE: /\n{3,}/g,
    PASCAL_CASE: /(?:^|-)(\w)/g,
    HYPHEN: /-/g,
  },
} as const;

export const INLINE = {
  IS_NEW_ARCH_ENABLED:
    "(typeof globalThis.nativeFabricUIManager === 'object' && globalThis.nativeFabricUIManager !== null)",

  resolveNativeModuleCall(nativeKey: string): string {
    return `(isNewArchEnabled() ? TurboModuleRegistry.getEnforcing<Spec>('${nativeKey}') : NativeModules['${nativeKey}'] as Spec)`;
  },
} as const;
