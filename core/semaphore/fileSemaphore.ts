import * as fs from 'node:fs';
import * as path from 'node:path';

const LOCKS_DIR = path.resolve(process.cwd(), '.locks');
const STALE_THRESHOLD_MS = 120_000; // 120s — D-BOX tests take ~60-90s
const MIN_BACKOFF_MS = 200;
const MAX_BACKOFF_MS = 500;

/**
 * Acquires a file-system-based mutex lock using atomic `fs.mkdirSync`.
 * POSIX guarantees that mkdir is atomic — only one process succeeds when
 * multiple attempt the same path simultaneously.
 *
 * @param name - Logical lock name (e.g. 'dbox-showtime'). Creates `.locks/{name}.lock/`
 * @param timeoutMs - Maximum time to wait for the lock (default: 90s)
 * @returns A `release` function that removes the lock directory
 */
export async function acquireLock(
  name: string,
  timeoutMs: number = 90_000
): Promise<() => void> {
  const lockPath = path.join(LOCKS_DIR, `${name}.lock`);

  // Ensure .locks/ directory exists
  fs.mkdirSync(LOCKS_DIR, { recursive: true });

  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      // Atomic: fails with EEXIST if another worker already holds the lock
      fs.mkdirSync(lockPath);
      return () => {
        try {
          fs.rmdirSync(lockPath);
        } catch {
          // Lock already released or cleaned — safe to ignore
        }
      };
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
        // Lock held by another worker — check for stale lock
        try {
          const stat = fs.statSync(lockPath);
          if (Date.now() - stat.mtimeMs > STALE_THRESHOLD_MS) {
            fs.rmdirSync(lockPath);
            console.warn(
              `⚠️ [Semaphore] Removed stale lock: ${name} (age > ${STALE_THRESHOLD_MS / 1000}s)`
            );
            continue; // Retry immediately after removing stale lock
          }
        } catch {
          // Lock was released between our check — retry
          continue;
        }

        // Wait with random backoff before retrying
        const backoff =
          MIN_BACKOFF_MS + Math.random() * (MAX_BACKOFF_MS - MIN_BACKOFF_MS);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      } else {
        throw err; // Unexpected error — propagate
      }
    }
  }

  throw new Error(
    `[Semaphore] Timeout acquiring lock '${name}' after ${timeoutMs}ms`
  );
}
