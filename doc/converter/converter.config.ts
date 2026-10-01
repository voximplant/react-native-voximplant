export interface ConverterConfig {
  srcFilePath: string;
  buildFilePath: string;
  baseFqdn: `references.${string}`;
  exclude: string[];
}

export const config: ConverterConfig = {
  srcFilePath: './doc/doc.json',
  buildFilePath: './doc/reactnative-v2.ad.json',
  baseFqdn: 'references.reactnative-v2',
  exclude: ['isPrivate'],
};
