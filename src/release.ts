export const REPO = "Token-communism/cursor-jingling";
export const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
export const RELEASES_PAGE = `https://github.com/${REPO}/releases/latest`;
export const CACHE_KEY = "cj-release-v1";
export const CACHE_TTL_MS = 30 * 60 * 1000;

export type InstallerPlatform = "macos" | "windows";

export interface GithubAsset {
  name: string;
  label?: string | null;
  size: number;
  browser_download_url?: string;
}

export interface GithubRelease {
  tag_name?: string;
  name?: string;
  published_at?: string;
  assets?: GithubAsset[];
}

export interface InstallerAsset {
  name: string;
  displayName: string;
  size: number;
  sizeLabel: string;
  downloadUrl: string;
  platform: InstallerPlatform;
  platformLabel: string;
}

export interface ParsedRelease {
  version: string;
  publishedAt: string;
  assets: InstallerAsset[];
}

export interface CacheEnvelope {
  savedAt: number;
  release: ParsedRelease;
}

const PLATFORM_LABEL: Record<InstallerPlatform, string> = {
  macos: "macOS · Apple 芯片",
  windows: "Windows 64 位",
};

export function formatByteSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function parseTagVersion(tagName: string | undefined): string {
  if (!tagName) return "";
  return tagName.replace(/^v/i, "");
}

export function formatPublishedDate(iso: string | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function isExcludedAssetName(name: string): boolean {
  const lower = name.toLowerCase();
  if (lower.endsWith(".sig")) return true;
  if (lower.endsWith(".app.tar.gz")) return true;
  if (lower === "latest.json") return true;
  if (lower.startsWith("source code")) return true;
  return false;
}

export function matchInstallerPlatform(name: string): InstallerPlatform | null {
  if (name.endsWith(".dmg")) return "macos";
  if (name.endsWith("-setup.exe")) return "windows";
  return null;
}

export function filterInstallerAssets(assets: GithubAsset[]): GithubAsset[] {
  return assets.filter((asset) => {
    if (isExcludedAssetName(asset.name)) return false;
    return matchInstallerPlatform(asset.name) !== null;
  });
}

export function displayAssetName(asset: GithubAsset): string {
  const label = asset.label?.trim();
  return label || asset.name;
}

export function toInstallerAsset(asset: GithubAsset): InstallerAsset | null {
  const platform = matchInstallerPlatform(asset.name);
  const downloadUrl = asset.browser_download_url?.trim();
  if (!platform || !downloadUrl) return null;
  return {
    name: asset.name,
    displayName: displayAssetName(asset),
    size: asset.size,
    sizeLabel: formatByteSize(asset.size),
    downloadUrl,
    platform,
    platformLabel: PLATFORM_LABEL[platform],
  };
}

export function parseRelease(payload: unknown): ParsedRelease | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as GithubRelease;
  if (!data.tag_name || !Array.isArray(data.assets)) return null;

  const assets = filterInstallerAssets(data.assets)
    .map(toInstallerAsset)
    .filter((asset): asset is InstallerAsset => asset !== null);

  if (assets.length === 0) return null;

  return {
    version: parseTagVersion(data.tag_name),
    publishedAt: formatPublishedDate(data.published_at),
    assets,
  };
}

export function selectInstaller(
  assets: InstallerAsset[],
  platform: InstallerPlatform,
): InstallerAsset | undefined {
  return assets.find((asset) => asset.platform === platform);
}

export function readCachedRelease(
  storage: Pick<Storage, "getItem">,
  now = Date.now(),
): ParsedRelease | null {
  try {
    const raw = storage.getItem(CACHE_KEY);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as CacheEnvelope;
    if (!envelope || typeof envelope.savedAt !== "number") return null;
    if (now - envelope.savedAt > CACHE_TTL_MS) return null;
    const parsed = parseRelease({
      tag_name: envelope.release?.version
        ? `v${envelope.release.version}`
        : undefined,
      published_at: envelope.release?.publishedAt,
      assets: envelope.release?.assets?.map((asset) => ({
        name: asset.name,
        label: asset.displayName,
        size: asset.size,
        browser_download_url: asset.downloadUrl,
      })),
    });
    return parsed;
  } catch {
    return null;
  }
}

export function writeCachedRelease(
  storage: Pick<Storage, "setItem">,
  release: ParsedRelease,
  now = Date.now(),
): void {
  const envelope: CacheEnvelope = { savedAt: now, release };
  storage.setItem(CACHE_KEY, JSON.stringify(envelope));
}

export async function fetchLatestRelease(
  fetcher: typeof fetch = fetch,
): Promise<ParsedRelease | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    const response = await fetcher(API_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return parseRelease(data);
  } catch {
    return null;
  }
}
