import styles from "./Faq.module.scss";

const FAQS = [
  {
    q: "会影响我现在用的 Cursor 吗？",
    a: "不会。Cursor 精灵用独立的用户数据目录启动一份新的 Cursor，不碰你原来的安装和设置，两份可以同时开着。",
  },
  {
    q: "支持哪些系统？",
    a: "目前提供 macOS（Apple 芯片）和 Windows 64 位安装包。Linux 可以从源码自行构建。",
  },
  {
    q: "怎么更新？",
    a: "应用内置自动更新，有新版本会提示下载安装，不需要再回到官网。",
  },
  {
    q: "我的数据存在哪？",
    a: "全部在本机 ~/.cursor-byok-v3/，包含接入密钥与设置、独立 Cursor profile、日志。",
  },
];

export function Faq() {
  return (
    <section className="block" aria-labelledby="faq-title">
      <div className="wrap">
        <h2 id="faq-title">常见问题</h2>
        <div className={styles.list}>
          {FAQS.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
