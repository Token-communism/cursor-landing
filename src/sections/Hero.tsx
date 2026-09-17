import { DownloadActions } from "../components/DownloadActions";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <img
          className={styles.logo}
          src="/logo.webp"
          width={64}
          height={64}
          alt="Cursor 精灵"
        />
        <h1 className={styles.title}>Cursor 精灵</h1>
        <p className={styles.subtitle}>
          一把密钥，一键启动一份已登录的官方 Cursor
        </p>
        <p className={styles.aside}>
          不改你的 Cursor，不装证书，不走本地代理。两份可以同时开着。
        </p>
        <DownloadActions />
      </div>
    </header>
  );
}
