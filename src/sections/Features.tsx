import {
  DesktopIcon,
  ImportIcon,
  LaunchIcon,
  LedgerIcon,
  UsageIcon,
} from "../components/Icons";
import styles from "./Features.module.scss";

const FEATURES = [
  {
    title: "一键启动",
    body: "自动找到本机安装的 Cursor，用独立 profile 打开并完成登录。",
    icon: LaunchIcon,
  },
  {
    title: "导入本机 Cursor",
    body: "把日常 Cursor 的设置、快捷键、代码片段、聊天记录一键复制到独立 profile。",
    icon: ImportIcon,
  },
  {
    title: "用量与额度",
    body: "按日 / 近一周 / 近一个月 / 累计查看请求数、Token、费用，以及账户额度余量。",
    icon: UsageIcon,
  },
  {
    title: "调用明细",
    body: "逐条查看每次调用的模型、Token、费用、耗时、状态，以及计费档位（高级 / AUTO）。",
    icon: LedgerIcon,
  },
  {
    title: "桌面体验",
    body: "系统托盘、开机自启、静默启动、Dock 图标开关、自动更新。",
    icon: DesktopIcon,
  },
] as const;

export function Features() {
  return (
    <section className="block" aria-labelledby="features-title">
      <div className="wrap">
        <h2 id="features-title">核心能力</h2>
        <ul className={styles.grid}>
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className={styles.card}>
                <span className={styles.icon}>
                  <Icon />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
