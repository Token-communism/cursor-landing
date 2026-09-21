import { DownloadIcon } from "../components/Icons";
import { useRelease } from "../ReleaseContext";
import { CURSOR_SITE, groupByOs, visitorOs, type CursorOsGroup } from "../cursor";
import styles from "./CursorDownload.module.scss";

function OsCard({ group, highlighted }: { group: CursorOsGroup; highlighted: boolean }) {
  return (
    <li className={`${styles.card} ${highlighted ? styles.cardActive : ""}`}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>{group.label}</h3>
        {highlighted ? <span className={styles.badge}>你的系统</span> : null}
      </div>
      <ul className={styles.list}>
        {group.installers.map((installer) => (
          <li key={installer.key} className={styles.row}>
            <span className={styles.rowLabel}>{installer.label}</span>
            <a
              className={styles.rowLink}
              href={installer.downloadUrl}
              rel="noopener noreferrer"
            >
              <DownloadIcon width={16} height={16} />
              下载
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function CursorDownload() {
  const { cursor, platform } = useRelease();
  const highlight = visitorOs(platform);

  return (
    <section id="cursor-download" className={styles.section}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>前置条件</p>
          <h2 className={styles.title}>先安装官方 Cursor</h2>
          <p className={styles.desc}>
            Cursor 精灵不附带、不代替 Cursor。请先安装官方 Cursor 桌面版，再安装上面的 Cursor 精灵。
            以下为官方安装包直链。
          </p>
          {cursor ? (
            <p className={styles.meta}>
              最新版本 v{cursor.version} · {cursor.date}
            </p>
          ) : null}
        </div>

        {cursor ? (
          <ul className={styles.cards}>
            {groupByOs(cursor.installers).map((group) => (
              <OsCard
                key={group.os}
                group={group}
                highlighted={group.os === highlight}
              />
            ))}
          </ul>
        ) : (
          <a className={styles.fallback} href={CURSOR_SITE} rel="noopener noreferrer">
            <DownloadIcon />
            前往 cursor.com 下载
          </a>
        )}
      </div>
    </section>
  );
}
