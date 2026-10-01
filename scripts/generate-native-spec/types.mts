export interface Log {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
}

export type CodegenPrimitive = 'string' | 'number' | 'boolean' | 'Object';

export interface PreparedSpec {
  outputDir: string;
  imports: string;
  specSource: string;
  rawBlocks: string[];
  outputBlocks: string[];
}

export interface ExtractedImports {
  imports: string;
  specSource: string;
}

export interface ResolutionContext {
  knownTypeNames: Set<string>;
  rawBlocks: string[];
  enumNames: Set<string>;
  primitiveAliases: Map<string, CodegenPrimitive>;
  enumDerivedAliases: Map<string, CodegenPrimitive>;
}

export interface TypeBlocks {
  rawBlocks: string[];
  outputBlocks: string[];
}

export type TypeCategory = 'enum' | 'alias' | 'object';
