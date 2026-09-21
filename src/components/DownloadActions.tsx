import { DownloadIcon } from "./Icons";
import { useRelease } from "../ReleaseContext";
import {
  RELEASES_PAGE,
  selectInstaller,
  type InstallerAsset,
  type ParsedRelease,
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

function Loading() {
  return (
    <button type="button" className={styles.primary} disabled aria-busy="true">
      正在获取最新版本…
    </button>
  );
}

function Failed({ retry }: { retry: () => void }) {
  return (
    <div className={styles.failed} role="alert">
      <p className={styles.failedTitle}>暂时无法获取最新版本</p>
      <p className={styles.failedDesc}>
        安装包信息需要从 GitHub 实时读取。请确认当前网络可以访问 github.com（部分网络需要代理），然后重试。
        为避免下载到已失效的旧版本，页面不会显示历史链接。
      </p>
      <div className={styles.failedActions}>
        <button type="button" className={styles.secondary} onClick={retry}>
          重试
        </button>
        <a className={styles.cursorLink} href={RELEASES_PAGE} rel="noopener noreferrer">
          前往 GitHub Releases 页面 →
        </a>
      </div>
    </div>
  );
}

function Ready({ release, platform }: { release: ParsedRelease; platform: VisitorPlatform }) {
  const matched =
    platform !== "unknown" ? selectInstaller(release.assets, platform) : undefined;
  const fallback = platform !== "unknown" && !matched;
  const href = matched?.downloadUrl ?? RELEASES_PAGE;
  const label = fallback ? "前往 GitHub 下载" : primaryLabel(platform);

  return (
    <>
      {platform === "unknown" ? (
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

      {matched ? (
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

      <details className={styles.others}>
        <summary>其他平台</summary>
        <ul>
          {release.assets.map((asset) => (
            <AssetRow key={asset.name} asset={asset} />
          ))}
        </ul>
      </details>
    </>
  );
}

export function DownloadActions() {
  const { release, retryRelease, platform } = useRelease();

  return (
    <div className={styles.stack}>
      {release.status === "loading" ? <Loading /> : null}
      {release.status === "failed" ? <Failed retry={retryRelease} /> : null}
      {release.status === "ready" ? (
        <Ready release={release.release} platform={platform} />
      ) : null}
    </div>
  );
}
