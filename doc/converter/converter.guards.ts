import { JSONOutput } from 'typedoc';
import { type AnyTypableReflection } from './converter.types.ts';

// TODO: in typedoc defined with `variant: "declaration" | "reference"`
export const isDeclarationReflection = (
  type: JSONOutput.SomeReflection
): type is JSONOutput.DeclarationReflection => type.variant === 'declaration';

export const isArrayType = (type: JSONOutput.SomeType): type is JSONOutput.ArrayType =>
  type.type === 'array';

export const isConditionalType = (type: JSONOutput.SomeType): type is JSONOutput.ConditionalType =>
  type.type === 'conditional';

export const isIndexedAccessType = (
  type: JSONOutput.SomeType
): type is JSONOutput.IndexedAccessType => type.type === 'indexedAccess';

export const isInferredType = (type: JSONOutput.SomeType): type is JSONOutput.InferredType =>
  type.type === 'inferred';

export const isIntrinsicType = (type: JSONOutput.SomeType): type is JSONOutput.IntrinsicType =>
  type.type === 'intrinsic';

export const isIntersectionType = (
  type: JSONOutput.SomeType
): type is JSONOutput.IntersectionType => type.type === 'intersection';

export const isLiteralType = (type: JSONOutput.SomeType): type is JSONOutput.LiteralType =>
  type.type === 'literal';

export const isMappedType = (type: JSONOutput.SomeType): type is JSONOutput.MappedType =>
  type.type === 'mapped';

export const isNamedTupleMemberType = (
  type: JSONOutput.SomeType
): type is JSONOutput.NamedTupleMemberType => type.type === 'namedTupleMember';

export const isOptionalType = (type: JSONOutput.SomeType): type is JSONOutput.OptionalType =>
  type.type === 'optional';

export const isTemplateLiteralType = (
  type: JSONOutput.SomeType
): type is JSONOutput.TemplateLiteralType => type.type === 'templateLiteral';

export const isUnknownType = (type: JSONOutput.SomeType): type is JSONOutput.UnknownType =>
  type.type === 'unknown';

export const isPredicateType = (type: JSONOutput.SomeType): type is JSONOutput.PredicateType =>
  type.type === 'predicate';

export const isQueryType = (type: JSONOutput.SomeType): type is JSONOutput.QueryType =>
  type.type === 'query';

export const isReferenceType = (type: JSONOutput.SomeType): type is JSONOutput.ReferenceType =>
  type.type === 'reference';

export const isReflectionType = (type: JSONOutput.SomeType): type is JSONOutput.ReflectionType =>
  type.type === 'reflection';

export const isRestType = (type: JSONOutput.SomeType): type is JSONOutput.RestType =>
  type.type === 'rest';

export const isTupleType = (type: JSONOutput.SomeType): type is JSONOutput.TupleType =>
  type.type === 'tuple';

export const isTypeOperatorType = (
  type: JSONOutput.SomeType
): type is JSONOutput.TypeOperatorType => type.type === 'typeOperator';

export const isUnionType = (type: JSONOutput.SomeType): type is JSONOutput.UnionType =>
  type.type === 'union';

export const isTypableReflection = (
  reflection: JSONOutput.SomeReflection
): reflection is AnyTypableReflection => 'type' in reflection;
