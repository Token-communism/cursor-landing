import { useRelease } from "../ReleaseContext";
import { RELEASES_PAGE } from "../release";
import styles from "./DownloadCta.module.scss";

export function DownloadCta() {
  const { release } = useRelease();

  return (
    <section className="block" aria-labelledby="download-title">
      <div className="wrap">
        <div className={styles.head}>
          <h2 id="download-title">下载 Cursor 精灵</h2>
          <a className={styles.github} href={RELEASES_PAGE} rel="noopener noreferrer">
            在 GitHub 上查看全部版本
          </a>
        </div>

        {release ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>平台</th>
                  <th>文件名</th>
                  <th>体积</th>
                  <th>下载</th>
                </tr>
              </thead>
              <tbody>
                {release.assets.map((asset) => (
                  <tr key={asset.name}>
                    <td>{asset.platformLabel}</td>
                    <td>{asset.displayName}</td>
                    <td>{asset.sizeLabel}</td>
                    <td>
                      <a className={styles.dl} href={asset.downloadUrl} rel="noopener noreferrer">
                        下载
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.fallback}>
            暂时无法读取安装包列表，请
            <a href={RELEASES_PAGE} rel="noopener noreferrer">
              前往 GitHub 下载
            </a>
            。
          </p>
        )}
      </div>
    </section>
  );
}
