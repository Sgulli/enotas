/**
 * Waits for all promises to resolve and returns an array of their results.
 * @param promises - An array of promises to wait for.
 * @returns A promise that resolves to an array of the results of the promises.
 */
export function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
  return Promise.all(promises);
}

/**
 * Waits for all promises to settle and returns an array of their results.
 * @param promises - An array of promises to wait for.
 * @returns A promise that resolves to an array of the results of the promises.
 */
export async function promiseAllSettled<T>(promises: Promise<T>[]) {
  const results = await Promise.allSettled(promises);
  return results.map((result) => ({
    status: result.status,
    value: result.status === "fulfilled" ? result.value : undefined,
  }));
}
