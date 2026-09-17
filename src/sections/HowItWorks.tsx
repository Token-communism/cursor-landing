import { CheckIcon } from "../components/Icons";
import styles from "./HowItWorks.module.scss";

const PROMISES = [
  "不修改 Cursor 的安装文件和用户设置",
  "不安装证书",
  "不在本机做代理",
  "你日常使用的 Cursor 不受影响，两份可以同时打开",
];

export function HowItWorks() {
  return (
    <section className="block" aria-labelledby="how-title">
      <div className="wrap">
        <h2 id="how-title">工作原理</h2>
        <div className={styles.layout}>
          <div className={styles.diagram} tabIndex={0}>
            <div className={styles.app}>Cursor 精灵（本机桌面应用 + 本地管理服务）</div>
            <div className={styles.branches}>
              <div className={styles.branch}>
                <span className={styles.arrow}>登录校验 / 用量 / 账单</span>
                <div className={styles.box}>号池供应商 API</div>
              </div>
              <div className={styles.branch}>
                <span className={styles.arrow}>启动官方 Cursor（独立 --user-data-dir）</span>
                <div className={styles.nested}>
                  <span className={styles.arrow}>登录态、Agent、Tab 等全部请求</span>
                  <div className={styles.box}>号池网关</div>
                </div>
              </div>
            </div>
          </div>
          <ul className={styles.promises}>
            {PROMISES.map((item) => (
              <li key={item}>
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.local}>
          本机只保存三样东西，都在{" "}
          <code>~/.cursor-byok-v3/</code>
          ：接入密钥与桌面设置、独立 Cursor profile、日志。
        </p>
      </div>
    </section>
  );
}
