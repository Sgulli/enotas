import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

export function loadEnvPackage(
  importMetaUrl: string,
  envFilePath = "../.env",
): void {
  const dir = dirname(fileURLToPath(importMetaUrl));
  const path = resolve(dir, envFilePath);

  if (!existsSync(path)) {
    console.warn(`[loadEnvPackage] Warning: .env file not found at ${path}`);
  }

  config({ path });
}
