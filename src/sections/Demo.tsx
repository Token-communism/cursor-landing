import styles from "./Demo.module.scss";

export function Demo() {
  return (
    <section id="demo" className={`block ${styles.demo}`}>
      <div className="wrap">
        <p className={styles.kicker}>产品演示</p>
        <h2>真实界面，一眼看懂</h2>
        <p className={styles.lead}>下面是应用的真实界面，图中数据为演示数据</p>

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
            alt="Cursor 精灵主界面截图"
          />
        </figure>
      </div>
    </section>
  );
}
