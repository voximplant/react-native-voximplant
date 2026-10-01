import { ProjectReflection } from 'typedoc';
import {
  getNodesFlatMap,
  getTags,
  showDocumentationSummary,
  sortNodes,
} from './converter.utils.ts';
import { parseReflection } from './converter.parsers.ts';
import fs from 'node:fs';
import { config } from './converter.config.ts';

const sourceJson = JSON.parse(String(fs.readFileSync(config.srcFilePath))) as ProjectReflection;
const flatNodes = getNodesFlatMap(sourceJson);

const documentation = sourceJson.children
  .filter((child) => !getTags(child).internal)
  .map((child) => {
    const currentNode = parseReflection(child, { baseFqdn: config.baseFqdn, flatNodes });
    return currentNode;
  })
  .sort(sortNodes);

fs.writeFileSync(config.buildFilePath, JSON.stringify(documentation));
fs.writeFileSync(config.buildFilePath + '.flatNodes.json', JSON.stringify(flatNodes));

showDocumentationSummary(documentation);
