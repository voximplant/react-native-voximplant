import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

type ReleaseMode = 'stable' | 'candidate';

type Workspace = {
  name: string;
  location: string;
  pkgPath: string;
};

const USAGE = `Usage: yarn release <semver>

  yarn release 2.0.0                 → tag v2.0.0
  yarn release:candidate 2.0.0-rc.1  → commit, no tag`;

const VERSION_REGEXP: Record<ReleaseMode, RegExp> = {
  stable: /^\d+\.\d+\.\d+$/,
  candidate: /^\d+\.\d+\.\d+-rc\.\d+$/,
};
const NATIVE_VERSION_REGEXP = /(?<=react-)\d+\.\d+\.\d+/g;

const NATIVE_VERSION_FILES = [
  path.join('packages/core/ios/CoreModule/CoreImpl.swift'),
  path.join(
    'packages/core/android/src/main/java/com/voximplant/reactnative/core/CoreModuleImpl.kt'
  ),
];

const run = (cmd: string): void => {
  execSync(cmd, { stdio: 'inherit' });
};

const toTag = (version: string): string => `v${version}`;

const isReleaseMode = (value: string): value is ReleaseMode =>
  value === 'stable' || value === 'candidate';

const getVersionFromArgs = (
  args: string[]
): { mode: ReleaseMode; version: string } => {
  const cliArgs = args.slice(2);

  if (cliArgs.some((arg) => arg.startsWith('-'))) {
    throw new Error(`Flags are not supported.\n\n${USAGE}`);
  }

  const [mode, version, ...rest] = cliArgs;

  if (!mode || !isReleaseMode(mode) || !version || rest.length > 0) {
    throw new Error(USAGE);
  }

  if (!VERSION_REGEXP[mode].test(version)) {
    throw new Error(`Invalid version format "${version}".\n\n${USAGE}`);
  }

  return { mode, version };
};

const assertTagAvailable = (tag: string): void => {
  const localTag = execSync(`git tag -l "${tag}"`, { encoding: 'utf8' }).trim();
  if (localTag === tag) {
    throw new Error(`Tag ${tag} already exists`);
  }

  try {
    execSync(`git ls-remote --exit-code --tags origin "refs/tags/${tag}"`, {
      stdio: 'inherit',
    });
  } catch (err: unknown) {
    const status =
      err && typeof err === 'object' && 'status' in err
        ? (err as { status: number }).status
        : undefined;
    if (status === 2) return;
    throw err;
  }

  throw new Error(`Tag ${tag} already exists on origin`);
};

const assertCleanWorktree = (): void => {
  const status = execSync('git status --porcelain', {
    encoding: 'utf8',
  }).trim();
  if (status) {
    throw new Error('Working tree is dirty; commit or stash first');
  }
};

const findPublicWorkspaces = (): Workspace[] =>
  execSync('yarn workspaces list --json --no-private', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const parsed = JSON.parse(line) as { name: string; location: string };
      return {
        name: parsed.name,
        location: parsed.location,
        pkgPath: path.join(parsed.location, 'package.json'),
      };
    });

const bumpWorkspaceVersions = (
  workspaces: Workspace[],
  version: string
): void => {
  workspaces.forEach(({ name, pkgPath }) => {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const previous = pkg.version;
    pkg.version = version;
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    console.log(`${name}: ${previous} → ${version}`);
  });
};

const bumpNativeVersions = (version: string): void => {
  NATIVE_VERSION_FILES.forEach((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    const matches = source.match(NATIVE_VERSION_REGEXP) ?? [];
    if (matches.length !== 1) {
      throw new Error(`Expected one native version string in ${filePath}`);
    }
    const previous = matches[0];
    fs.writeFileSync(filePath, source.replace(NATIVE_VERSION_REGEXP, version));
    console.log(`${filePath}: react-${previous} → react-${version}`);
  });
};

const commit = (files: string[], version: string): void => {
  const paths = files.map((filePath) => `"${filePath}"`).join(' ');
  run(`git add ${paths}`);

  run(`git commit -m "release: ${version}"`);
};

const releaseStable = (version: string): void => {
  const tag = toTag(version);
  assertTagAvailable(tag);
  assertCleanWorktree();

  const workspaces = findPublicWorkspaces();
  bumpWorkspaceVersions(workspaces, version);
  bumpNativeVersions(version);
  commit(
    [...workspaces.map(({ pkgPath }) => pkgPath), ...NATIVE_VERSION_FILES],
    version
  );

  run(`git tag "${tag}"`);
  console.log(`Created tag ${tag}`);
  console.log(`Push with: git push && git push origin ${tag}`);
};

const releaseCandidate = (version: string): void => {
  assertCleanWorktree();

  const workspaces = findPublicWorkspaces();
  bumpWorkspaceVersions(workspaces, version);
  commit(
    workspaces.map(({ pkgPath }) => pkgPath),
    version
  );

  console.log('Push with: git push');
};

const releaseByMode: Record<ReleaseMode, (version: string) => void> = {
  stable: releaseStable,
  candidate: releaseCandidate,
};

const main = (): void => {
  try {
    const { mode, version } = getVersionFromArgs(process.argv);
    releaseByMode[mode](version);
  } catch (err: unknown) {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
};

main();
