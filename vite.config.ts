import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Only the official Cursor archive is prefetched. Cursor 精灵 links are never
// baked in: old assets are deleted from GitHub, so a build-time copy goes stale.
const CURSOR_ARCHIVE_URL =
  "https://raw.githubusercontent.com/worryzyy/awesome-cursor-download/master/cursor-version-archive.json";

const EMPTY = "{}\n";

const cursorFallback = fileURLToPath(
  new URL("./src/cursor.fallback.json", import.meta.url),
);

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json, application/vnd.github+json",
        "User-Agent": "cursor-jingling-docs",
      },
    });
    clearTimeout(timer);
    if (!response.ok) return null;
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function writeJson(file: string, data: unknown | null): void {
  writeFileSync(file, data ? `${JSON.stringify(data, null, 2)}\n` : EMPTY);
}

function compareVersionDesc(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pb[i] ?? 0) - (pa[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Keep only the newest entry so the bundle does not carry the full history. */
function pickLatestCursor(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;
  const archive = data as Record<string, unknown>;
  const version = Object.keys(archive)
    .filter((key) => /^\d+(\.\d+)*$/.test(key))
    .sort(compareVersionDesc)[0];
  return version ? { [version]: archive[version] } : null;
}

async function prefetch(): Promise<void> {
  const cursor = await fetchJson(CURSOR_ARCHIVE_URL);
  writeJson(cursorFallback, pickLatestCursor(cursor));
}

export default defineConfig(async ({ command }) => {
  if (command === "build") {
    await prefetch();
  }
  return {
    plugins: [
      react(),
      {
        name: "restore-fallbacks",
        apply: "build",
        closeBundle() {
          writeFileSync(cursorFallback, EMPTY);
        },
      },
    ],
  };
});
