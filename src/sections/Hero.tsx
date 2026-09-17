import { DownloadActions } from "../components/DownloadActions";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.copy}>
          <img
            className={styles.logo}
            src="/logo.webp"
            width={64}
            height={64}
            alt="Cursor 精灵"
          />
          <h1 className={styles.title}>Cursor 精灵</h1>
          <p className={styles.subtitle}>
            一键启动一份已登录的官方 Cursor
          </p>
          <DownloadActions />
        </div>

        <figure className={styles.window}>
          <div className={styles.titlebar}>
            <span className={styles.traffic} aria-hidden="true">
              <i className={styles.red} />
              <i className={styles.yellow} />
              <i className={styles.green} />
            </span>
            <span className={styles.winTitle}>Cursor 精灵</span>
          </div>
          <img
            className={styles.shot}
            src="/demo-screenshot.webp"
            width={820}
            height={558}
            alt="Cursor 精灵主界面截图，图中数据为演示数据"
          />
        </figure>
      </div>
    </header>
  );
}
