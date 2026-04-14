/**
 * Showtime Claim Pool — Worker Isolation for Checkout Tests (ADR-0018 Phase 2)
 *
 * Routes each Playwright worker to a distinct set of preferred rooms,
 * preventing seat selection collisions when running checkout tests in parallel.
 *
 * Each worker gets an exclusive subset of rooms. When selecting a showtime,
 * the worker only considers showtimes in its assigned rooms, ensuring no two
 * workers enter the same showtime simultaneously.
 *
 * @example
 * ```typescript
 * const workerIndex = test.info().parallelIndex;
 * const criteria = getShowtimeSelectionForWorker(workerIndex);
 * await cinemaDetail.selectFilmAndShowtimeByFormatAndRoom(criteria);
 * ```
 *
 * @see docs/adrs/0018-checkout-showtime-isolation.md
 */

export interface WorkerShowtimeConfig {
  requiredFormat: 'normal' | 'dbox' | 'any';
  preferredRooms: string[];
  workerIndex: number;
  fallbackToAnyRoom?: boolean;
}

/**
 * Room assignments per worker.
 *
 * Oasiz has rooms Sala 1–12 (standard) plus IMAX and special rooms.
 * Distributing 4 rooms per worker supports up to 3 parallel workers
 * without overlap.
 *
 * If more workers are needed, reduce rooms-per-worker or add more cinemas.
 */
const ROOM_POOLS: string[][] = [
  ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4'],
  ['Sala 5', 'Sala 6', 'Sala 7', 'Sala 8'],
  ['Sala 9', 'Sala 10', 'Sala 11', 'Sala 12'],
];

/**
 * Returns showtime selection criteria scoped to a specific worker.
 *
 * Uses modular arithmetic so worker count can exceed pool size safely
 * (workers wrap around, though collision risk re-appears).
 *
 * @param workerIndex - `test.info().parallelIndex` (0-based)
 * @param format - Showtime format to target. Defaults to 'any'
 * @returns Selection criteria with worker-exclusive rooms
 */
export function getShowtimeSelectionForWorker(
  workerIndex: number,
  format: 'normal' | 'dbox' | 'any' = 'any'
): WorkerShowtimeConfig {
  const poolIndex = workerIndex % ROOM_POOLS.length;
  return {
    requiredFormat: format,
    preferredRooms: ROOM_POOLS[poolIndex],
    workerIndex,
    fallbackToAnyRoom: true,
  };
}

/**
 * Total number of worker slots available without room overlap.
 * Use this to validate `--workers` count doesn't exceed pool capacity.
 */
export const MAX_ISOLATED_WORKERS = ROOM_POOLS.length;
