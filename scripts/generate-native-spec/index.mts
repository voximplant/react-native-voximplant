import { CONFIG, PATHS } from './config.mts';
import {
  cleanAllOutputDirs,
  cleanOutputDir,
  findSpecFilesInDir,
  findSpecFilesInPackage,
  processComponentSpec,
  processSpec,
  resolvePkgDirFromArg,
} from './generate.mts';
import { log } from './log.mts';

function main(): void {
  try {
    const pkgPathArg = process.argv[2];
    const pkgDir = resolvePkgDirFromArg(pkgPathArg);

    const specFiles = pkgDir
      ? findSpecFilesInPackage(pkgDir, CONFIG.specs.inputSuffix)
      : findSpecFilesInDir(PATHS.PACKAGES_DIR, CONFIG.specs.inputSuffix);
    const componentSpecFiles = pkgDir
      ? findSpecFilesInPackage(pkgDir, CONFIG.specs.componentInputSuffix)
      : findSpecFilesInDir(
          PATHS.PACKAGES_DIR,
          CONFIG.specs.componentInputSuffix
        );

    if (pkgDir) cleanOutputDir(pkgDir);
    else cleanAllOutputDirs();

    specFiles.forEach(processSpec);
    componentSpecFiles.forEach(processComponentSpec);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    log.warn('gen:spec failed:', message);
    if (stack) log.warn(stack);
    process.exit(1);
  }
}

main();
