import * as fs from 'node:fs';

/**
 * Helper to safely resolve storage state file path
 * Only returns the path if the file exists to avoid ENOENT errors
 */
export function getStorageStatePath(env?: string): string | undefined {
  const candidate =
    env === 'preprod'
      ? 'loggedInState.preprod.json'
      : env === 'lab'
        ? 'loggedInState.lab.json'
        : 'loggedInState.json';

  return fs.existsSync(candidate) ? candidate : undefined;
}

/**
 * UCI-specific storage state path resolver
 */
export function getUCIStorageStatePath(env?: string): string | undefined {
  const candidate =
    env === 'preprod'
      ? 'loggedInState.preprod.json'
      : env === 'lab'
        ? 'loggedInState.lab.json'
        : 'loggedInState.json';

  return fs.existsSync(candidate) ? candidate : undefined;
}

/**
 * Cinesa-specific storage state path resolver
 * Only for preprod/lab environments
 */
export function getCinesaStorageStatePath(env?: string): string | undefined {
  const candidate =
    env === 'preprod'
      ? 'loggedInState.preprod.json'
      : env === 'lab'
        ? 'loggedInState.lab.json'
        : undefined;

  return candidate && fs.existsSync(candidate) ? candidate : undefined;
}
