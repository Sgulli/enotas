import type {
  RegisterShutdownHandlersOptions,
  ShutdownFn,
} from "./shutdown.types.js";

/**
 * Registers `process.once` handlers so an async teardown runs before exit.
 * On success: `process.exit(0)`; on failure: logs and `process.exit(1)`.
 */
export function registerShutdownHandlers(
  onShutdown: ShutdownFn,
  options?: RegisterShutdownHandlersOptions,
): void {
  const defaultSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  const signals = options?.signals ?? defaultSignals;

  const run = (): void => {
    void onShutdown().then(
      () => {
        process.exit(0);
      },
      (err: unknown) => {
        console.error(err);
        process.exit(1);
      },
    );
  };

  for (const sig of signals) {
    process.once(sig, run);
  }
}
