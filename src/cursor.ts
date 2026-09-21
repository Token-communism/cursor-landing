import type { VisitorPlatform } from "./platform";

export const CURSOR_SITE = "https://cursor.com";
export const CURSOR_ARCHIVE_URL =
  "https://raw.githubusercontent.com/worryzyy/awesome-cursor-download/master/cursor-version-archive.json";
export const CURSOR_CACHE_KEY = "cursor-latest-v1";
export const CURSOR_CACHE_TTL_MS = 30 * 60 * 1000;

export type CursorPlatformKey =
  | "mac"
  | "mac_arm64"
  | "mac_intel"
  | "windows"
  | "windows_arm64"
  | "linux"
  | "linux_arm64";

export interface CursorArchiveEntry {
  date?: string;
  platforms?: Record<string, { url?: string }>;
}

export type CursorArchive = Record<string, CursorArchiveEntry>;

export type CursorOs = "macos" | "windows" | "linux";

export interface CursorInstaller {
  key: CursorPlatformKey;
  os: CursorOs;
  label: string;
  downloadUrl: string;
}

export interface CursorOsGroup {
  os: CursorOs;
  label: string;
  installers: CursorInstaller[];
}

export interface CursorRelease {
  version: string;
  date: string;
  installers: CursorInstaller[];
}

interface CursorCacheEnvelope {
  savedAt: number;
  release: CursorRelease;
}

const PLATFORM_ORDER: CursorPlatformKey[] = [
  "mac",
  "mac_arm64",
  "mac_intel",
  "windows",
  "windows_arm64",
  "linux",
  "linux_arm64",
];

const PLATFORM_META: Record<CursorPlatformKey, { os: CursorOs; label: string }> = {
  mac: { os: "macos", label: "通用版（Intel 与 Apple 芯片）" },
  mac_arm64: { os: "macos", label: "Apple 芯片（M 系列）" },
  mac_intel: { os: "macos", label: "Intel" },
  windows: { os: "windows", label: "x64" },
  windows_arm64: { os: "windows", label: "ARM64" },
  linux: { os: "linux", label: "x64 AppImage" },
  linux_arm64: { os: "linux", label: "ARM64 AppImage" },
};

const OS_ORDER: CursorOs[] = ["macos", "windows", "linux"];

const OS_LABEL: Record<CursorOs, string> = {
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
};

const VERSION_PATTERN = /^\d+(\.\d+)*$/;

export function compareVersionDesc(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (pb[i] ?? 0) - (pa[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function latestVersion(archive: CursorArchive): string | undefined {
  return Object.keys(archive)
    .filter((version) => VERSION_PATTERN.test(version))
    .sort(compareVersionDesc)[0];
}

export function parseCursorArchive(payload: unknown): CursorRelease | null {
  if (!payload || typeof payload !== "object") return null;
  const archive = payload as CursorArchive;
  const version = latestVersion(archive);
  if (!version) return null;
  const entry = archive[version];
  const platforms = entry?.platforms ?? {};

  const installers = PLATFORM_ORDER.flatMap((key) => {
    const url = platforms[key]?.url?.trim();
    return url ? [{ key, ...PLATFORM_META[key], downloadUrl: url }] : [];
  });
  if (installers.length === 0) return null;

  return { version, date: entry?.date ?? "", installers };
}

/** Three OS cards in fixed order; an OS with no installer is omitted. */
export function groupByOs(installers: CursorInstaller[]): CursorOsGroup[] {
  return OS_ORDER.flatMap((os) => {
    const own = installers.filter((installer) => installer.os === os);
    return own.length ? [{ os, label: OS_LABEL[os], installers: own }] : [];
  });
}

/** Which OS card to highlight for the visitor; `unknown` highlights none. */
export function visitorOs(platform: VisitorPlatform): CursorOs | null {
  return platform === "unknown" ? null : platform;
}

function toArchive(release: CursorRelease): CursorArchive {
  return {
    [release.version]: {
      date: release.date,
      platforms: Object.fromEntries(
        release.installers.map((installer) => [
          installer.key,
          { url: installer.downloadUrl },
        ]),
      ),
    },
  };
}

export function readCachedCursor(
  storage: Pick<Storage, "getItem">,
  now = Date.now(),
): CursorRelease | null {
  try {
    const raw = storage.getItem(CURSOR_CACHE_KEY);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as CursorCacheEnvelope;
    if (!envelope || typeof envelope.savedAt !== "number") return null;
    if (now - envelope.savedAt > CURSOR_CACHE_TTL_MS) return null;
    if (!envelope.release?.version || !Array.isArray(envelope.release.installers)) {
      return null;
    }
    return parseCursorArchive(toArchive(envelope.release));
  } catch {
    return null;
  }
}

export function writeCachedCursor(
  storage: Pick<Storage, "setItem">,
  release: CursorRelease,
  now = Date.now(),
): void {
  const envelope: CursorCacheEnvelope = { savedAt: now, release };
  storage.setItem(CURSOR_CACHE_KEY, JSON.stringify(envelope));
}

export async function fetchLatestCursor(
  fetcher: typeof fetch = fetch,
): Promise<CursorRelease | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    const response = await fetcher(CURSOR_ARCHIVE_URL, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return parseCursorArchive(data);
  } catch {
    return null;
  }
}
