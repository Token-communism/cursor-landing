import { describe, expect, it } from "vitest";
import {
  displayAssetName,
  filterInstallerAssets,
  formatByteSize,
  formatPublishedDate,
  parseRelease,
  parseTagVersion,
  selectInstaller,
  type GithubAsset,
} from "./release";

const TAG = "v0.1.4";
const DOWNLOAD_HOST = "https://github.com/Token-communism/cursor-jingling";

function downloadUrl(fileName: string): string {
  return `${DOWNLOAD_HOST}/releases/download/${TAG}/${fileName}`;
}

const SPEC_ASSETS: GithubAsset[] = [
  {
    name: "Cursor._0.1.4_aarch64.dmg",
    label: "Cursor 精灵_0.1.4_aarch64.dmg",
    size: 12437852,
    browser_download_url: downloadUrl("Cursor._0.1.4_aarch64.dmg"),
  },
  {
    name: "Cursor._0.1.4_x64-setup.exe",
    label: "Cursor 精灵_0.1.4_x64-setup.exe",
    size: 11073155,
    browser_download_url: downloadUrl("Cursor._0.1.4_x64-setup.exe"),
  },
  { name: "Cursor._0.1.4_aarch64.app.tar.gz", size: 12524379 },
  { name: "Cursor._0.1.4_aarch64.app.tar.gz.sig", size: 412 },
  { name: "Cursor._0.1.4_x64-setup.exe.sig", size: 424 },
  { name: "latest.json", size: 2549 },
];

const SPEC_RELEASE = {
  tag_name: TAG,
  name: "Cursor 精灵 v0.1.4",
  published_at: "2026-09-16T13:58:19Z",
  assets: SPEC_ASSETS,
};

describe("parseRelease (SPEC 3.3)", () => {
  it("keeps only the two installer assets from six GitHub assets", () => {
    const filtered = filterInstallerAssets(SPEC_ASSETS);
    expect(filtered).toHaveLength(2);
    expect(filtered.map((asset) => asset.name)).toEqual([
      "Cursor._0.1.4_aarch64.dmg",
      "Cursor._0.1.4_x64-setup.exe",
    ]);

    const parsed = parseRelease(SPEC_RELEASE);
    expect(parsed).not.toBeNull();
    expect(parsed?.assets).toHaveLength(2);
  });

  it("selects the dmg for macOS and the setup exe for Windows", () => {
    const parsed = parseRelease(SPEC_RELEASE);
    expect(parsed).not.toBeNull();
    const dmg = selectInstaller(parsed!.assets, "macos");
    const exe = selectInstaller(parsed!.assets, "windows");
    expect(dmg?.name).toBe("Cursor._0.1.4_aarch64.dmg");
    expect(exe?.name).toBe("Cursor._0.1.4_x64-setup.exe");
  });

  it("formats installer size with 1024-based MB and one decimal", () => {
    expect(formatByteSize(12437852)).toBe("11.9 MB");
    const parsed = parseRelease(SPEC_RELEASE);
    expect(parsed?.assets[0]?.sizeLabel).toBe("11.9 MB");
    expect(parsed?.assets[1]?.sizeLabel).toBe("10.6 MB");
  });

  it("strips the leading v from tag_name", () => {
    expect(parseTagVersion(SPEC_RELEASE.tag_name)).toBe("0.1.4");
    expect(parseRelease(SPEC_RELEASE)?.version).toBe("0.1.4");
  });

  it("formats published_at as YYYY-MM-DD", () => {
    expect(formatPublishedDate(SPEC_RELEASE.published_at)).toBe("2026-09-16");
    expect(parseRelease(SPEC_RELEASE)?.publishedAt).toBe("2026-09-16");
  });

  it("falls back to name when label is missing", () => {
    const unnamed: GithubAsset = {
      name: "Cursor._0.1.4_aarch64.dmg",
      size: 12437852,
      browser_download_url: downloadUrl("Cursor._0.1.4_aarch64.dmg"),
    };
    expect(displayAssetName(unnamed)).toBe("Cursor._0.1.4_aarch64.dmg");
    expect(
      parseRelease({
        ...SPEC_RELEASE,
        assets: [unnamed],
      })?.assets[0]?.displayName,
    ).toBe("Cursor._0.1.4_aarch64.dmg");
  });

  it("returns null for an empty object so the UI can fall back", () => {
    expect(parseRelease({})).toBeNull();
  });
});
