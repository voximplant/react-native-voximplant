import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const USAGE = `Usage: yarn release <semver>

  yarn release 2.0.0        → tag v2.0.0
  yarn release 2.0.0-rc.3   → tag v2.0.0-rc.3`;

type Workspace = {
  name: string;
  location: string;
  pkgPath: string;
};

const run = (cmd: string): void => {
  execSync(cmd, { stdio: 'inherit' });
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
        pkgPath: path.resolve(parsed.location, 'package.json'),
      };
    });

const validateVersion = (version: string): void => {
  if (version.startsWith('v')) {
    throw new Error(`Invalid version format "${version}".\n\n${USAGE}`);
  }
};

const getVersionFromArgs = (args: string[]): string => {
  const cliArgs = args.slice(2);

  if (cliArgs.some((arg) => arg.startsWith('-'))) {
    throw new Error(`Flags are not supported.\n\n${USAGE}`);
  }

  const version = cliArgs[0];

  if (!version) {
    throw new Error(USAGE);
  }

  validateVersion(version);

  return version;
};

const assertCleanWorktree = (): void => {
  const status = execSync('git status --porcelain', {
    encoding: 'utf8',
  }).trim();
  if (status) {
    throw new Error('Working tree is dirty; commit or stash first');
  }
};

const bumpWorkspaceVersions = (
  workspaces: Workspace[],
  version: string
): void => {
  workspaces.forEach(({ name, pkgPath }) => {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    console.log(`${name}: ${pkg.version} → ${version}`);
    pkg.version = version;
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  });
};

const commitAndTag = (workspaces: Workspace[], version: string): void => {
  const tag = `v${version}`;
  const files = workspaces.map(({ pkgPath }) => `"${pkgPath}"`).join(' ');

  run(`git add ${files}`);
  run(`git commit -m "release: ${version}"`);
  run(`git tag "${tag}"`);
  console.log(`Created tag ${tag}`);
  console.log(`Push with: git push && git push origin ${tag}`);
};

const main = (): void => {
  try {
    const version = getVersionFromArgs(process.argv);
    assertCleanWorktree();
    const workspaces = findPublicWorkspaces();

    bumpWorkspaceVersions(workspaces, version);
    commitAndTag(workspaces, version);
  } catch (err: unknown) {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
};

main();
