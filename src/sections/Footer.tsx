import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={`wrap ${styles.disclaimer}`}>
        本项目是独立项目，与 Cursor 或其开发者没有关联，也未获得其认可。号池按用量计费，额度以登录后首页显示为准。
      </p>
    </footer>
  );
}
