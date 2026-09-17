import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const API_URL =
  "https://api.github.com/repos/Token-communism/cursor-jingling/releases/latest";
const fallbackFile = fileURLToPath(
  new URL("./src/release.fallback.json", import.meta.url),
);

async function prefetchRelease(): Promise<void> {
  const empty = "{}\n";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(API_URL, {
      signal: controller.signal,
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "cursor-jingling-docs",
      },
    });
    clearTimeout(timer);
    if (!response.ok) {
      writeFileSync(fallbackFile, empty);
      return;
    }
    const data: unknown = await response.json();
    writeFileSync(fallbackFile, `${JSON.stringify(data, null, 2)}\n`);
  } catch {
    writeFileSync(fallbackFile, empty);
  }
}

export default defineConfig(async ({ command }) => {
  if (command === "build") {
    await prefetchRelease();
  }
  return {
    plugins: [
      react(),
      {
        name: "restore-release-fallback",
        apply: "build",
        closeBundle() {
          writeFileSync(fallbackFile, "{}\n");
        },
      },
    ],
  };
});
