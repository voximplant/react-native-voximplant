import { ReflectionKind, JSONOutput, type ReflectionId } from 'typedoc';
import type {
  AnyTypableReflection,
  VoxNode,
  VoxNodeKind,
  FlatNodes,
  ParserOptions,
} from './converter.types.ts';

export const logError = (...args: unknown[]): void => {
  console.error('\x1b[31m[error]\x1b[0m', ...args);
};

const isExtendedError = (node: AnyTypableReflection, flatNodes: FlatNodes) => {
  if (!node?.extendedTypes) return false;
  if (node.kind !== ReflectionKind.Class) return false;
  if (
    node.extendedTypes.some(
      (extendedType) =>
        extendedType?.name === 'Error' && extendedType.package === 'typescript'
    )
  )
    return true;

  if (
    node.extendedTypes.some((extendedType) => {
      const refNode = flatNodes[extendedType.target];
      return isExtendedError(refNode, flatNodes);
    })
  )
    return true;

  return false;
};

export const mapReflectionKindToNodeKind = (
  reflection: AnyTypableReflection,
  flatNodes: FlatNodes
): VoxNodeKind => {
  if (isExtendedError(reflection, flatNodes)) return 'error_class';

  if (getTags(reflection).method) return 'method';

  if (
    getTags(reflection).interface &&
    reflection.kind === ReflectionKind.Variable
  ) {
    return 'interface';
  }
  // type alias to function with tag @interface interpret as function
  if (reflection.kind === ReflectionKind.Interface && reflection.signatures)
    return 'function';

  if (reflection.kind === ReflectionKind.Reference) {
    // get node kind from ref
    const refNode = flatNodes[reflection.target];
    if (!refNode) {
      logError(
        `Failed to map reflection kind of ${reflection.name} - reference not found`
      );
      throw new Error(
        `Failed to map reflection kind of ${reflection.name} - reference not found`
      );
    }
    return mapReflectionKindToNodeKind(refNode, flatNodes);
  }

  // TODO: full reflection kinds
  const nodeKinds: Record<ReflectionKind | string, VoxNodeKind> = {
    [ReflectionKind.Project]: 'module',
    [ReflectionKind.Module]: 'module',
    [ReflectionKind.Namespace]: 'ref_folder',
    [ReflectionKind.Enum]: 'enum',
    [ReflectionKind.EnumMember]: 'constants',
    [ReflectionKind.Variable]: 'const',
    [ReflectionKind.Function]: 'function',
    [ReflectionKind.Class]: 'class',
    [ReflectionKind.Interface]: 'interface',
    [ReflectionKind.Constructor]: 'constructor',
    [ReflectionKind.Property]: 'prop',
    [ReflectionKind.Method]: 'method',
    [ReflectionKind.Accessor]: 'prop',
    [ReflectionKind.Event]: 'events',
    [ReflectionKind.TypeAlias]: 'typedef',
    [ReflectionKind.ObjectLiteral]: 'enum',
  };

  const kind = nodeKinds[reflection.kind];
  if (!kind) {
    logError(
      `Unmapped reflection kind: "${ReflectionKind[reflection.kind]}", name: "${
        reflection.name
      }"`
    );
    throw new Error(
      `Unmapped reflection kind: "${ReflectionKind[reflection.kind]}", name: "${
        reflection.name
      }"`
    );
  }
  return kind;
};

const rearrangeChildrenIntoFolders = (
  children: JSONOutput.DeclarationReflection[] | undefined
): JSONOutput.DeclarationReflection[] => {
  if (!children?.length) return children ?? [];

  const makeFolder = (
    name: string,
    folderChildren: JSONOutput.DeclarationReflection[]
  ): JSONOutput.DeclarationReflection => ({
    id: -1,
    children: folderChildren,
    name,
    variant: 'declaration',
    kind: ReflectionKind.Namespace,
    flags: {},
    nodePathName: '',
    parentId: -1,
  });

  const appendToFolderPath = (
    nodes: JSONOutput.DeclarationReflection[],
    folderParts: string[],
    item: JSONOutput.DeclarationReflection
  ): JSONOutput.DeclarationReflection[] => {
    const [head, ...tail] = folderParts;
    const existing = nodes.find(
      (node) => node.kind === ReflectionKind.Namespace && node.name === head
    );

    if (!tail.length) {
      if (existing) {
        return nodes.map((node) =>
          node === existing
            ? { ...node, children: [...(node.children ?? []), item] }
            : node
        );
      }
      return [...nodes, makeFolder(head, [item])];
    }

    if (existing) {
      return nodes.map((node) =>
        node === existing
          ? {
              ...node,
              children: appendToFolderPath(node.children ?? [], tail, item),
            }
          : node
      );
    }

    return [...nodes, makeFolder(head, appendToFolderPath([], tail, item))];
  };

  let result = children;

  for (const child of children) {
    const folderTag = getTags(child).folder;
    if (!folderTag) continue;

    const strippedChild = child.comment?.blockTags?.some(
      (tag) => tag.tag === '@folder'
    )
      ? {
          ...child,
          comment: {
            ...child.comment,
            blockTags: child.comment.blockTags.filter(
              (tag) => tag.tag !== '@folder'
            ),
          },
        }
      : child;

    result = result.filter((node) => node !== child);
    result = appendToFolderPath(
      result,
      folderTag.split('.').filter(Boolean),
      strippedChild
    );
  }

  return result;
};

export const getNodesFlatMap = (
  project: JSONOutput.ProjectReflection
): FlatNodes => {
  const flatMap = {};

  const flattenChild = (params: {
    parent?: AnyTypableReflection;
    current: AnyTypableReflection;
  }) => {
    const { parent, current } = params;

    const tags = getTags(current);
    const extraPath = tags.folder ?? '';

    const pathParts = [parent?.nodePathName, extraPath, current.name];
    const nodePathName = pathParts.filter(Boolean).join('.');

    current.nodePathName = nodePathName;
    if (parent) current.parentId = parent.id;
    flatMap[nodePathName] = current;
    flatMap[current.id] = current;

    const folderPath = [parent?.nodePathName, extraPath]
      .filter(Boolean)
      .join('.');
    if (!flatMap[folderPath])
      flatMap[folderPath] = {
        id: -1,
        name: folderPath,
        variant: 'declaration',
        kind: ReflectionKind.Namespace,
        flags: {},
        children: [],
      };

    current.parameters?.forEach((parameter) => {
      flattenChild({ parent: current, current: parameter });
    });

    current.signatures?.forEach((signature) => {
      flattenChild({ parent: current, current: signature });
    });

    current.children = rearrangeChildrenIntoFolders(current.children);

    current.children?.forEach((child) => {
      flattenChild({ parent: current, current: child });
    });
  };

  project.children?.forEach((child) => flattenChild({ current: child }));
  return flatMap;
};

export const externalTypes = [
  {
    name: 'PermissionState',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus/state',
  },
  {
    name: 'MediaStreamTrack',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack',
  },
  {
    name: 'MediaStream',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/MediaStream',
  },
  {
    name: 'HTMLAudioElement',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement',
  },
  {
    name: 'HTMLVideoElement',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement',
  },
  {
    name: 'CSSStyleDeclaration',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Properties',
  },
];

/**
 * replace string match to [Some.Path.To.Entity] with md link. Leave current links (i.e. [SomeTitle](https://example.com)) untouched
 */
export const replaceDescriptionLinks = (
  text: string,
  options: ParserOptions
): string => {
  const { flatNodes } = options;
  const regex = /\[([A-Za-z0-9\.]+)\](?!\()/g;
  return text.replace(regex, (match: string, title: string, nextChar) => {
    const externalType = externalTypes.find(
      (external) => external.name === title
    );
    if (externalType) {
      return [`[${externalType.name}](${externalType.url})`];
    }

    const storedReflection = flatNodes[title];
    if (!storedReflection) {
      logError(
        `Reflection for ${title} not found. Check typos an make sure it is full path to reflection provided`
      );
      throw new Error(
        `Reflection for ${title} not found. Check typos an make sure it is full path to reflection provided`
      );
    }
    const link = getLinkToReflection(
      storedReflection as AnyTypableReflection,
      options
    );
    return link;
  });
};

export const getTags = (
  reflection: JSONOutput.SomeReflection
): Record<string, string> => {
  const blockTags = reflection.comment?.blockTags?.length
    ? reflection.comment?.blockTags.reduce((tagMap, tag) => {
        tagMap[tag.tag.replace('@', '')] = tag.content[0]?.text ?? ' ';
        return tagMap;
      }, {})
    : {};

  const modifierTags = reflection.comment?.modifierTags?.length
    ? reflection.comment?.modifierTags.reduce((tagMap, tag) => {
        tagMap[tag.replace('@', '')] = ' '; // no description for modifier
        return tagMap;
      }, {})
    : {};
  return { ...blockTags, ...modifierTags };
};

export const extractParameterWithGeneric = (
  text: string
): { parameter: string; generics: string[] } => {
  const regex = /^([\w\.]+)(\<.+\>)?\s?/;
  const match = text.match(regex);
  const [_, parameter, genericsRaw] = match;
  const generics = genericsRaw
    ? genericsRaw
        .replaceAll('<', '')
        .replaceAll('>', '')
        .split(',')
        .filter(Boolean)
        .map((element) => element.trim())
    : [];

  return { parameter, generics };
};

const sortPriority: VoxNodeKind[] = [
  'ref_folder',
  'module',
  'class',
  'constructor',
  'interface',
  'function',
  'method',
  'prop',
  'getter',
  'setter',
  'event',
  'error_class',
  'enum',
  'constants',
  'const',
  'typedef',
];

const stringCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

// sort by priority then by title
export const sortNodes = (node1: VoxNode, node2: VoxNode): number => {
  const priority1 = sortPriority.indexOf(node1.kind);
  const priority2 = sortPriority.indexOf(node2.kind);
  if (priority1 !== priority2) return priority1 - priority2;
  return stringCollator.compare(node1.title, node2.title);
};

export const getLinkToReflection = (
  reflection: AnyTypableReflection,
  options: ParserOptions
): string => {
  const { baseFqdn } = options;

  const isAnchorableLink = [
    ReflectionKind.Parameter,
    ReflectionKind.Property,
    ReflectionKind.EnumMember,
    ReflectionKind.Method,
    ReflectionKind.Constructor,
    ReflectionKind.Variable,
  ].includes(reflection.kind);

  const nameParts = reflection.nodePathName.split('.');
  const fqdnParts = baseFqdn.split('.');
  const url = isAnchorableLink
    ? [...fqdnParts, ...nameParts.slice(0, -1)].join('/') +
      `#${nameParts.slice(-1)}`
    : [...fqdnParts, ...nameParts].join('/');

  const linkTitle = isAnchorableLink
    ? nameParts.slice(-2).join('.')
    : nameParts.slice(-1)[0];
  return createLink(linkTitle, url);
};

export const createLink = (title: string, url: string): string =>
  `[${title}](/docs/${url.toLowerCase()})`;

export const showDocumentationSummary = (nodes: VoxNode[]): void => {
  const reducer = (acc: number, node: VoxNode): number => {
    const nextAcc = acc + (node.children?.length ?? 0);
    return nextAcc + (node.children?.reduce(reducer, 0) ?? 0);
  };
  const summary = nodes.reduce(reducer, 0);
  const totalInfo = `Total documentation entities created: ${summary}`;

  console.log('');
  console.log('==============================================');
  console.log('');
  console.log(`Documentation generated`);
  console.log(totalInfo);
  console.log('');
  console.log('==============================================');
  console.log('');
};
