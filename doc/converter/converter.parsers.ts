import {
  getLinkToReflection,
  getTags,
  mapReflectionKindToNodeKind,
  extractParameterWithGeneric,
  replaceDescriptionLinks,
  sortNodes,
  externalTypes,
  logError,
} from './converter.utils.ts';
import { JSONOutput, Models, ReflectionKind } from 'typedoc';
import type {
  AnyTypableReflection,
  VoxNode,
  NodeParameter,
  ParserOptions,
  FlatNodes,
  VoxNodeKind,
} from './converter.types.ts';
import {
  isArrayType,
  isDeclarationReflection,
  isIndexedAccessType,
  isIntersectionType,
  isIntrinsicType,
  isLiteralType,
  isReferenceType,
  isReflectionType,
  isTemplateLiteralType,
  isUnionType,
  isUnknownType,
  isMappedType,
  isTypableReflection,
} from './converter.guards.ts';

const buildGenericMap = (
  typeParameters: JSONOutput.TypeParameterReflection[] | undefined,
  typeArguments: JSONOutput.SomeType[] | undefined
): Record<string, JSONOutput.SomeType> => {
  const map: Record<string, JSONOutput.SomeType> = {};

  typeParameters?.forEach((typeParameter, index) => {
    const resolved = typeArguments?.[index] ?? typeParameter.default;
    if (resolved) {
      map[typeParameter.name] = resolved;
    }
  });

  return map;
};

const substituteTypeParameters = (
  type: JSONOutput.SomeType,
  bindings: Record<string, JSONOutput.SomeType>
): JSONOutput.SomeType => {
  if (
    isReferenceType(type) &&
    type.refersToTypeParameter &&
    bindings[type.name]
  ) {
    return substituteTypeParameters(bindings[type.name], bindings);
  }

  if (isUnionType(type)) {
    return {
      ...type,
      types: type.types.map((item) => substituteTypeParameters(item, bindings)),
    };
  }

  if (isIntersectionType(type) && type.types) {
    return {
      ...type,
      types: type.types.map((item) => substituteTypeParameters(item, bindings)),
    };
  }

  if (isArrayType(type)) {
    return {
      ...type,
      elementType: substituteTypeParameters(type.elementType, bindings),
    };
  }

  if (isReferenceType(type) && type.typeArguments?.length) {
    return {
      ...type,
      typeArguments: type.typeArguments.map((item) =>
        substituteTypeParameters(item, bindings)
      ),
    };
  }

  return type;
};

export const parseComments = (
  reflection: AnyTypableReflection,
  options: ParserOptions
): string => {
  const comment = reflection.comment;
  if (!comment) return '';

  const summary = comment.summary?.map((item) => item?.text).join('\n') ?? '';
  const tags =
    comment.blockTags
      ?.reduce<string[]>((acc, tagItem) => {
        if (tagItem.tag.toLowerCase() === '@see') {
          const content = tagItem.content
            ?.map((content) => content.text)
            .filter(Boolean)
            .join('\n');
          const str = `\n\n**See:** ${content}`;
          acc.push(str);
        }
        return acc;
      }, [])

      .join('\n') ?? '';

  const descriptionRaw = [summary, tags].filter(Boolean).join('\n');
  const description = replaceDescriptionLinks(descriptionRaw, options);
  return description;
};

export const parseTypes = (
  type: JSONOutput.SomeType | undefined,
  options: ParserOptions
): string[] => {
  if (!type) return [];
  const { flatNodes } = options;

  if (isMappedType(type)) {
    // TODO: target name to parse
    // Currently mapped types act as Record, couse the only PlainStyles is mapped for now
    //  possibly need to make it more generic

    const keyTarget = parseTypes(type.parameterType.target, options)[0];
    const keyString = `${type.parameterType.operator} ${keyTarget}`;
    const valueTypeString = parseTypes(type.templateType, options);
    return [`Record<${keyString}, ${valueTypeString}>`];
  }

  if (isIndexedAccessType(type)) {
    const index = type.indexType.value;
    const obj = parseTypes(type.objectType, options)[0];

    const isLink = obj.match(/\[.+\]\(.+\)/);
    // for external use subpage, internal with anchor
    const isInternalLink = obj.match(/\[.+\]\(\/.+\)/);
    const linkSeparator = isInternalLink ? '#' : '/';
    const withInjectedIndex = index
      ? obj.replace(/\[(.+)\]/, (_, title) => {
          return `[${title}.${index}]`;
        })
      : obj;

    const extendedIndex = isLink
      ? `${withInjectedIndex.slice(0, -1)}${linkSeparator}${index})`
      : `${withInjectedIndex}.${index}`;

    return [extendedIndex];
  }

  if (isIntrinsicType(type) || isUnknownType(type)) {
    return [type.name];
  }

  if (isLiteralType(type)) {
    return typeof type.value === 'string'
      ? [`"${String(type.value)}"`]
      : [String(type.value)];
  }

  if (isTemplateLiteralType(type)) {
    const typeString = type.tail
      .flatMap((tailItem) => {
        const typePart = tailItem.map((mayBeCompoundType) => {
          if (mayBeCompoundType && typeof mayBeCompoundType === 'object')
            return `\${${parseTypes(mayBeCompoundType, options)}}`;
          return mayBeCompoundType;
        });
        return typePart;
      })
      .join('');

    return [typeString];
  }

  if (isUnionType(type)) {
    const union = type.types.flatMap((typeItem: JSONOutput.SomeType) =>
      parseTypes(typeItem, options)
    );
    return [union.map(String).join(' | ')];
  }

  if (isIntersectionType(type) && type.types) {
    return [
      type.types
        .flatMap((typeItem: JSONOutput.SomeType) =>
          parseTypes(typeItem, options)
        )
        .join(' & '),
    ];
  }

  if (isArrayType(type)) {
    const innerTypes = parseTypes(type.elementType, options);
    const formattedInnerTypes =
      innerTypes.length > 1 ? `${innerTypes.join(' | ')}` : innerTypes[0];
    const isArrayOfTypes = formattedInnerTypes.match(/[|&]/);
    return [
      `${isArrayOfTypes ? `(${formattedInnerTypes})` : formattedInnerTypes}[]`,
    ];
  }

  if (isReferenceType(type)) {
    /**
     * Hack. Add link to Watchable and ReadonlyWatchable types and links to generic parameters
     */
    if (type.name === 'Watchable') {
      const linkedReflection = flatNodes['Shared.Watchable.Watchable'];
      const link = linkedReflection
        ? getLinkToReflection(linkedReflection as AnyTypableReflection, options)
        : type.name;
      const args = type.typeArguments
        ?.map((genericType) => {
          return parseTypes(genericType, options);
        })
        .join(' | ');

      return [`${link}<${args}>`];
    }

    if (type.name === 'ReadonlyWatchable') {
      const linkedReflection = flatNodes['Shared.Watchable.Watchable'];
      const link = linkedReflection
        ? getLinkToReflection(linkedReflection as AnyTypableReflection, options)
        : type.name;
      const args = type.typeArguments
        ?.map((genericType) => {
          return parseTypes(genericType, options);
        })
        .join(' | ');

      return [`${link}<${args}>`];
    }

    /**
     * Hack. Inject union instead of mapper
     */
    if (type.name === 'StreamHelperMapper') {
      const linkedReflection = flatNodes['Stream.AnyStreamHelper'];
      if (linkedReflection)
        return [
          getLinkToReflection(
            linkedReflection as AnyTypableReflection,
            options
          ),
        ];
    }

    /**
     * Hack. Replace external types
     */
    const externalType = externalTypes.find(
      (external) => external.name === type.name
    );
    if (externalType) {
      return [`[${externalType.name}](${externalType.url})`];
    }

    if (type.name === 'Object') return ['Object'];
    if (['Array'].includes(type.name) && type.typeArguments)
      return [
        `${type.typeArguments
          .map((item) => parseTypes(item, options))
          .join(' | ')}[]`,
      ];

    if (['Set', 'Promise'].includes(type.name) && type.typeArguments)
      return [
        `${type.name}<${type.typeArguments
          .map((arg) => parseTypes(arg, options))
          .join(' | ')}>`,
      ];

    if (['Map', 'Record'].includes(type.name) && type.typeArguments) {
      const genericParams = type.typeArguments.map((arg) => {
        const formattedType = parseTypes(arg, options);
        return isUnionType(arg) ? formattedType.join(' | ') : formattedType;
      });

      return [`${type.name}<${genericParams.join(', ')}>`];
    }

    if (type.name === 'Extract' && type.typeArguments?.length) {
      return parseTypes(type.typeArguments[0], options);
    }

    const referencedReflection = flatNodes[Number(type.target)];
    if (!referencedReflection) {
      return [type.name];
    }

    // // Following code inlines type references directly instead on using links
    // // Possibly useless, leave it commented for now

    // // const referencedReflectionParent = flatNodes[Number(referencedReflection.parentId)];
    // // if (
    // //   referencedReflection &&
    // //   isTypableReflection(referencedReflection) &&
    // //   referencedReflectionParent?.kind !== ReflectionKind.Enum
    // // )
    // //   return parseTypes(referencedReflection.type, options);

    // if (referencedReflection)
    //   return [getLinkToReflection(referencedReflection, options)];

    const tags = getTags(referencedReflection);

    if (
      referencedReflection.kind === ReflectionKind.TypeAlias &&
      tags.internal &&
      isTypableReflection(referencedReflection) &&
      referencedReflection.type
    ) {
      const bindings = buildGenericMap(
        referencedReflection.typeParameters,
        type.typeArguments
      );
      const resolvedType = substituteTypeParameters(
        referencedReflection.type,
        bindings
      );

      return parseTypes(resolvedType, options);
    }

    return [getLinkToReflection(referencedReflection, options)];
  }

  if (isReflectionType(type)) {
    const declaration = type.declaration;

    if (isDeclarationReflection(declaration)) {
      if (declaration.signatures) {
        const { types } = parseSignature(declaration, {
          ...options,
          isFunctionChild: true,
        });
        return types;
      }

      return parseObject(declaration, options);
    }
  }
};

export const parseObject = (
  declaration: JSONOutput.DeclarationReflection,
  options: ParserOptions
): string[] => {
  const fields = [];

  if (declaration.children) {
    declaration.children.forEach((child: AnyTypableReflection) => {
      const field = `${child.name}: ${parseTypes(child.type, options)}`;
      fields.push(field);
    });
  }

  if (declaration.indexSignatures) {
    declaration.indexSignatures.forEach((child) => {
      const index = `[${child.parameters[0].name}: ${parseTypes(
        child.parameters[0].type,
        options
      )}]: ${parseTypes(child.type, options)}`;
      fields.push(index);
    });
  }

  return [`{ ${fields.join(', ')} }`];
};

export const parseSignature = (
  reflection: AnyTypableReflection,
  options: ParserOptions
): { types: string[]; returns: string[]; params: NodeParameter[] } => {
  if (!reflection.signatures.length)
    throw new Error(`Function without signature ${reflection.nodePathName}`);

  // TODO: signature overloading is not supported now
  const signature = reflection.signatures[0] as JSONOutput.SignatureReflection;

  const exchangeTypeWithGeneric = (
    parameter: Models.ParameterReflection,
    typeParameters: Models.TypeParameterReflection[]
  ): Models.SomeType => {
    if (!parameter.type.refersToTypeParameter) return parameter.type;
    const typeParameter = typeParameters?.find(
      (tp) => tp.name === parameter.type.name
    )?.type;

    if (!typeParameter) {
      const skipUnmapedParametersForPath = [
        'Watchable.OnValueChangeCallback',
        'Watchable.WatchOptions.guard.__type',
        'WatchOptions.T',
      ];
      if (
        skipUnmapedParametersForPath.some(
          (path) =>
            parameter.nodePathName?.includes(path) ||
            parameter.name?.includes(path) ||
            parameter.type.qualifiedName?.includes(path)
        )
      ) {
        return parameter.type;
      }

      logError('Failed to exchange type with generic', parameter);
      throw new Error(
        `Failed to exchange type with generic: ${parameter.name}`
      );
      return parameter.type;
    }
    return typeParameter;
  };

  const tags = getTags(reflection);

  const params: NodeParameter[] = (
    signature.parameters as Models.ParameterReflection[]
  )?.map<NodeParameter>((signatureParameter) => {
    const typeToParse = exchangeTypeWithGeneric(
      signatureParameter,
      signature.typeParameters
    );
    const refTo = options.flatNodes[signatureParameter.type?.target];

    const types =
      (tags.preventExpand === signatureParameter.name && refTo) ||
      (options.isFunctionChild && refTo)
        ? [getLinkToReflection(refTo, options)]
        : parseTypes(typeToParse, options);
    return {
      fqdn: `${options.baseFqdn}.${
        signatureParameter.nodePathName?.toLowerCase() ??
        signatureParameter.name?.toLowerCase()
      }`,
      title: signatureParameter.name,
      description: parseComments(signatureParameter, options),
      optional: Boolean(signatureParameter.flags?.isOptional),
      types,
    } satisfies NodeParameter;
  });

  const paramsString =
    params?.map((param) =>
      param.types ? `${param.title}: ${param.types[0]}` : ''
    ) ?? [];

  const returnType = parseTypes(signature.type, options);
  const types = [`(${paramsString.join(', ')}) => ${returnType}`];
  return { types, returns: returnType, params };
};

const REACT_PACKAGES = new Set(['react', '@types/react']);

const REACT_COMPONENT_TYPES = new Set([
  'FC',
  'FunctionComponent',
  'React.FC',
  'React.FunctionComponent',
]);

const isReactComponentType = (type: JSONOutput.ReferenceType): boolean => {
  const packageName = type.package ?? type.target?.packageName;
  if (!packageName || !REACT_PACKAGES.has(packageName)) return false;

  const qualifiedName =
    (typeof type.target === 'object' && type.target?.qualifiedName) ||
    type.name ||
    '';

  return REACT_COMPONENT_TYPES.has(qualifiedName);
};

const resolveReactComponentProps = (
  reflection: AnyTypableReflection,
  flatNodes: FlatNodes
): AnyTypableReflection | undefined => {
  const type = reflection.type;
  if (!type || !isReferenceType(type) || !type.typeArguments?.length) return;
  if (!isReactComponentType(type)) return;

  const propsType = type.typeArguments[0];
  if (!propsType || !isReferenceType(propsType)) return;

  if (typeof propsType.target === 'number') {
    return flatNodes[propsType.target] as AnyTypableReflection | undefined;
  }

  const modulePrefix = reflection.nodePathName
    ?.split('.')
    .slice(0, -1)
    .join('.');
  if (modulePrefix && propsType.name) {
    return flatNodes[`${modulePrefix}.${propsType.name}`] as
      | AnyTypableReflection
      | undefined;
  }

  return undefined;
};

const parseReflectionChildren = (
  source: AnyTypableReflection | undefined,
  options: ParserOptions
): VoxNode[] | undefined => {
  if (!source?.children?.length) return undefined;

  return source.children
    .filter((child) => !getTags(child).internal)
    .map((child) => parseReflection(child, options))
    .sort(sortNodes);
};

const remapChildrenFqdn = (
  children: VoxNode[] | undefined,
  parentFqdn: string
): VoxNode[] | undefined => {
  if (!children?.length) return undefined;

  return children.map((child) => ({
    ...child,
    fqdn: `${parentFqdn}.${child.title.toLowerCase()}`,
  }));
};

const parseReactPropsChildren = (
  reflection: AnyTypableReflection,
  options: ParserOptions,
  parentFqdn: string
): VoxNode[] | undefined => {
  const propsReflection = resolveReactComponentProps(
    reflection,
    options.flatNodes
  );
  if (!propsReflection) return undefined;

  const rawPropsChildren = parseReflectionChildren(propsReflection, options);
  return remapChildrenFqdn(rawPropsChildren, parentFqdn);
};

export const parseReflection = (
  reflection: AnyTypableReflection,
  options: ParserOptions
): VoxNode => {
  const { baseFqdn, flatNodes } = options;

  const nodeFqdn = reflection.nodePathName
    ? reflection.nodePathName.toLowerCase()
    : reflection.name.toLowerCase();
  const fullFqdn = `${baseFqdn}.${nodeFqdn}`;
  const tags = getTags(reflection);

  if (tags.reinterpret) {
    const reintepreted = flatNodes[tags.reinterpret];
    if (!reintepreted) {
      logError('Reintepreted reflection not found', tags.reinterpret);
      throw new Error(`Reintepreted reflection not found: ${tags.reinterpret}`);
    }

    if (reintepreted) {
      return {
        ...parseReflection(reintepreted, options),
        fqdn: fullFqdn,
        title: reflection.name,
        kind: mapReflectionKindToNodeKind(reflection, flatNodes),
        description: parseComments(reintepreted, options),
      };
    }
  }

  let castedParams: NodeParameter[];
  if (tags.cast) {
    const { parameter: reference } = extractParameterWithGeneric(tags.cast);
    const castTo = flatNodes[reference];

    if (castTo) {
      castedParams = parseReflection(castTo, options)?.children;
    }
  }

  const parseDescriptionByReflectionType = (
    reflection: AnyTypableReflection
  ): string => {
    if (reflection.getSignature)
      return parseComments(reflection.getSignature, options);

    if (reflection.signatures?.length && reflection.signatures[0]?.comment)
      return parseComments(reflection.signatures[0], options);

    return parseComments(reflection, options);
  };

  const description = parseDescriptionByReflectionType(reflection);
  const isFunctionLike = reflection.signatures?.length;

  const functionInfo = isFunctionLike
    ? parseSignature(reflection, options)
    : {
        types: undefined,
        returns: undefined,
        params: undefined,
      };

  // TODO: split type parser by switch-case function
  const primitiveType = parseTypes(reflection.type, options);
  const getterType =
    reflection.getSignature &&
    parseTypes(reflection.getSignature.type, options);
  const types = isFunctionLike
    ? functionInfo.types
    : getterType ?? primitiveType;
  const params = castedParams ?? functionInfo.params;
  const returns = isFunctionLike ? functionInfo.returns : undefined;

  const attributes = parseAttributes(reflection, options);

  const children = parseReflectionChildren(reflection, options);
  const propsChildren = parseReactPropsChildren(reflection, options, fullFqdn);

  const kind: VoxNodeKind = propsChildren?.length
    ? 'interface'
    : mapReflectionKindToNodeKind(reflection, flatNodes);

  return {
    fqdn: fullFqdn,
    kind,
    description,
    title: reflection.name,
    optional: Boolean(reflection.flags?.isOptional),
    children: propsChildren ?? children,
    types,
    params,
    returns,
    attributes,
  };
};

export const parseAttributes = (
  reflection: AnyTypableReflection,
  options: ParserOptions
): Record<string, string> => {
  const tags = reflection?.comment?.blockTags;

  const attributes = ['@deprecated', '@since', '@beta', '@hidden', '@see'];
  const platforms = [
    '@chrome',
    '@firefox',
    '@edge',
    '@safari',
    '@safari_ios', // TODO: tags with "_" not parsed by typedoc
    '@chrome_android',
    '@ios',
    '@android',
  ];
  const isMobile = (tag: string): boolean =>
    ['ios', 'android'].some((tagPart) => tag.includes(tagPart));
  const clearTag = (tag: string): string => tag.replace('@', '');

  const baseAttributes = tags?.reduce<
    Record<string, string | Record<string, string>>
  >((acc, { tag, content }) => {
    if (attributes.includes(tag)) {
      acc[clearTag(tag)] =
        replaceDescriptionLinks(content[0]?.text?.trim(), options) ?? '';
    }
    if (platforms.includes(tag)) {
      if (!acc.platform) acc.platform = {};
      acc.platform = {
        ...acc.platform,
        [clearTag(tag)]: content[0]?.text ?? '',
        kind: isMobile(tag) ? 'mobile' : 'web',
        // isMobile: isMobile(tag) ? 'mobile' : 'web',
      };
    }
    return acc;
  }, {});

  const throwsAttributes = parseThrows(reflection, options);

  return {
    ...baseAttributes,
    static: reflection.flags?.isStatic,
    throws: throwsAttributes,
  };
};

export const parseThrows = (
  reflection: AnyTypableReflection,
  options: ParserOptions
): string[] | undefined => {
  const tags = reflection?.comment?.blockTags;
  if (!tags) return;
  const throwTags = tags.filter((blockTag) => blockTag.tag === '@throws');
  const throwStr = throwTags
    .map((throwTag) =>
      replaceDescriptionLinks(throwTag.content[0]?.text?.trim(), options)
    )
    .filter(Boolean)
    .join('\n\n');
  return throwStr ? [throwStr] : undefined;
};
