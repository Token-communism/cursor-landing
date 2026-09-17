import styles from "./QuickStart.module.scss";

const STEPS = [
  "安装桌面版 Cursor",
  "下载并安装 Cursor 精灵",
  "打开 Cursor 精灵，输入接入密钥登录",
  "在「用量」页顶部的启动卡点击「一键启动」，会弹出一份已登录的独立 Cursor 窗口",
];

export function QuickStart() {
  return (
    <section className="block" aria-labelledby="start-title">
      <div className="wrap">
        <h2 id="start-title">快速开始</h2>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step} className={styles.step}>
              <span className={styles.num} aria-hidden="true">
                {index + 1}
              </span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
