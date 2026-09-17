import { RELEASES_PAGE, REPO } from "../release";
import styles from "./Footer.module.scss";

const GITHUB = `https://github.com/${REPO}`;
const ISSUES = `${GITHUB}/issues`;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <nav className={styles.links} aria-label="页脚">
          <a href={GITHUB} rel="noopener noreferrer">
            GitHub 仓库
          </a>
          <a href={ISSUES} rel="noopener noreferrer">
            提交问题
          </a>
          <a href={RELEASES_PAGE} rel="noopener noreferrer">
            最新版本
          </a>
          <span>MIT</span>
        </nav>
        <p className={styles.disclaimer}>
          本项目是独立项目，与 Cursor 或其开发者没有关联，也未获得其认可。号池按用量计费，额度以登录后首页显示为准。
        </p>
      </div>
    </footer>
  );
}
