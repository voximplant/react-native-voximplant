import * as td from 'typedoc';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tsconfigPath = path.join(__dirname, 'tsconfig.json');

const interfacePropertyDeclarationConverter = path.join(
  __dirname,
  'interfacePropertyDeclarationConverter.mjs'
);

const createModulePaths = (moduleNames) =>
  moduleNames.map((moduleName) => `packages/${moduleName}/src/index.ts`);

const modules = createModulePaths([
  'core',
  'calls',
  'shared'
]);

const app = await td.Application.bootstrapWithPlugins({
  tsconfig: tsconfigPath,
  excludeExternals: true,
  externalPattern: '**/node_modules/**',
  skipErrorChecking: true,
  plugin: [interfacePropertyDeclarationConverter],
  entryPoints: modules,
  // entryPoints: ['doc/converter/testProject/test.ts'], // For test purposes
  blockTags: [
    ...td.OptionDefaults.blockTags,
    '@folder',
    '@cast',
    '@description',
    '@reinterpret',
    '@android',
    '@ios'
  ],
});

// May be undefined if errors are encountered.
const project = await app.convert();

if (project) {
  await app.generateJson(project, 'doc/doc.json');
}
