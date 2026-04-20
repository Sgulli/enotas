export type ShutdownFn = () => Promise<void>;

export interface RegisterShutdownHandlersOptions {
  /**
   * Signals that trigger `onShutdown` once each, then `process.exit`.
   * @default ["SIGINT", "SIGTERM"]
   */
  signals?: NodeJS.Signals[];
}
