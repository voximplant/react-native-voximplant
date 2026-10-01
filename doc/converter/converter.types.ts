import { DeclarationReflection, ReferenceReflection, JSONOutput } from 'typedoc';

export type VoxNodeKind =
  | 'ref_folder'
  | 'module'
  | 'class'
  | 'constructor'
  | 'interface'
  | 'function'
  | 'method'
  | 'prop'
  | 'getter'
  | 'setter'
  | 'event'
  | 'error_class'
  | 'enum'
  | 'constants'
  | 'const'
  | 'typedef';

export type NodeType = string;

export interface NodeParameter {
  fqdn: string;
  title: string;
  description: string;
  optional: boolean;
  types: NodeType[];
}

// TODO: possibly split into different subtypes - function node, generic etc
export interface VoxNode {
  fqdn: string;
  kind: VoxNodeKind;
  title: string;
  description: string;

  children?: VoxNode[];

  types?: NodeType[];
  returns?: string[];
  params?: NodeParameter[];
  attributes: Record<string, string>;
}

declare module 'typedoc' {
  // extra types for proper mapping
  namespace JSONOutput {
    interface DeclarationReflection {
      nodePathName: string;
      parentId: number;
    }

    interface ReferenceReflection {
      nodePathName: string;
      parentId: number;
    }
  }
}

// unique node name; contains `${parentNodeName}.${nodeName}`
export type ExtendedNodeName = string;
// Node or type id. Types are stored by id
export type NodeId = number;
export type FlatNodes = Record<ExtendedNodeName | NodeId, JSONOutput.SomeReflection>;
export type AnyTypableReflection =
  | JSONOutput.DeclarationReflection
  | JSONOutput.ReferenceReflection;

export interface ParserOptions {
  baseFqdn: string;
  flatNodes: FlatNodes;
  // is current reflection part of function or method parameters
  isFunctionChild?: boolean;
}
