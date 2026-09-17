import { DownloadIcon } from "./Icons";
import { useRelease } from "../ReleaseContext";
import {
  RELEASES_PAGE,
  selectInstaller,
  type InstallerAsset,
} from "../release";
import type { VisitorPlatform } from "../platform";
import styles from "./DownloadActions.module.scss";

function primaryLabel(platform: VisitorPlatform): string {
  if (platform === "macos") return "下载 macOS 版";
  if (platform === "windows") return "下载 Windows 版";
  return "前往 GitHub 下载";
}

function metaChip(asset: InstallerAsset): string {
  return asset.platform === "macos" ? "Apple 芯片" : "Windows 64 位";
}

function AssetRow({ asset }: { asset: InstallerAsset }) {
  return (
    <li className={styles.row}>
      <div>
        <div className={styles.rowPlatform}>{asset.platformLabel}</div>
        <div className={styles.rowName}>{asset.displayName}</div>
      </div>
      <span className={styles.size}>{asset.sizeLabel}</span>
      <a className={styles.rowLink} href={asset.downloadUrl} rel="noopener noreferrer">
        下载
      </a>
    </li>
  );
}

export function DownloadActions() {
  const { release, platform } = useRelease();
  const matched =
    release && platform !== "unknown"
      ? selectInstaller(release.assets, platform)
      : undefined;
  const fallback = !release || (platform !== "unknown" && !matched);
  const href = matched?.downloadUrl ?? RELEASES_PAGE;
  const label = fallback ? "前往 GitHub 下载" : primaryLabel(platform);

  return (
    <div className={styles.stack}>
      {platform === "unknown" && release && !fallback ? (
        <div className={styles.pair}>
          {release.assets.map((asset) => (
            <a
              key={asset.name}
              className={styles.secondary}
              href={asset.downloadUrl}
              rel="noopener noreferrer"
            >
              <DownloadIcon />
              下载 {asset.platform === "macos" ? "macOS" : "Windows"} 版
            </a>
          ))}
        </div>
      ) : (
        <a className={styles.primary} href={href} rel="noopener noreferrer">
          <DownloadIcon />
          {label}
        </a>
      )}

      {matched && release ? (
        <p className={styles.meta}>
          v{release.version} · {matched.sizeLabel} · {metaChip(matched)} ·{" "}
          {release.publishedAt}
        </p>
      ) : null}

      {platform === "macos" && matched ? (
        <p className={styles.note}>仅支持 Apple 芯片（M 系列）</p>
      ) : null}

      {platform === "unknown" ? (
        <p className={styles.note}>
          暂未提供 Linux 安装包，可从源码自行构建
        </p>
      ) : null}

      {release ? (
        <details className={styles.others}>
          <summary>其他平台</summary>
          <ul>
            {release.assets.map((asset) => (
              <AssetRow key={asset.name} asset={asset} />
            ))}
          </ul>
        </details>
      ) : null}

      <a className={styles.cursorLink} href="https://cursor.com" rel="noopener noreferrer">
        需先安装官方 Cursor →
      </a>
    </div>
  );
}
