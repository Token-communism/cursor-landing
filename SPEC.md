# Cursor 精灵官网落地页 · 实现规格（自包含）

> 唯一目标：让访客在 10 秒内理解这是什么，并下载到适配自己系统的最新客户端安装包。

## 0. 目标与成功标准

| 项 | 内容 |
|---|---|
| 唯一转化动作 | 点击下载按钮，拿到当前系统对应的最新安装包 |
| 首屏要求 | 不滚动即可看到：产品名、一句话说明、主下载按钮、版本号与体积 |
| 硬指标 | 发新版后无需改代码、无需重新部署，页面自动指向新版本 |
| 语言 | 简体中文（zh-CN）单语言。英文版不在本期范围 |
| 配色 | 深色（产品本体就是深色应用，官网保持一致） |

## 1. 交付物与技术约束

### 1.1 站点放在哪

落地页是一个独立仓库，仓库根目录就是站点根目录。纯静态站点，`public/` 会被原样拷贝进 `dist/`。客户端源码不在本仓库内，落地页对它零依赖。

```
.
├── index.html
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── scripts/
│   └── make-og.py               # 生成 og.png 的脚本
├── public/
│   ├── logo.png / logo.webp     # 站点图标与 Hero logo
│   ├── og.png / og.webp         # 社交分享图，1200×630
│   ├── demo-screenshot.webp     # 产品演示区截图，820×558
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── release.ts               # 精灵最新版本与安装包解析（第 3 节，全站最关键的逻辑）
    ├── cursor.ts                # 官方 Cursor 最新版下载直链解析（3.7）
    ├── ReleaseContext.tsx       # 预取数据 + 运行时刷新（精灵 + 官方 Cursor）
    ├── platform.ts              # 访客系统识别
    ├── components/              # 跨屏复用的下载按钮与图标
    ├── sections/                # 每屏一个组件：Hero（精灵下载）、CursorDownload（官方 Cursor 下载）、Footer
    └── styles/                  # 设计令牌与全局样式
```

### 1.2 技术栈

跟桌面端保持一致，不要引入新体系：Vite 8 + React 19 + TypeScript + SCSS Modules。纯静态构建，无服务端、无数据库、无后端接口（下载信息全部来自 GitHub 公开 API）。不要引入 Next.js、Tailwind、UI 组件库、动画库。样式手写 SCSS，动画用 CSS。脚本：dev / build / preview。

## 2. 产品上下文

### 2.1 这是什么

Cursor 精灵是一个桌面应用。用户用一把接入密钥（形如 `sk-xxxxxx`）登录后，它会以独立的用户数据目录启动一份官方 Cursor 桌面版，并把这份 Cursor 指向号池网关；登录态由网关签发，模型请求由网关代为完成。

一句话卖点：一把密钥，一键启动一份已登录的官方 Cursor。

### 2.2 它不做什么（核心信任点，首屏之后要显眼讲清楚）

- 不修改 Cursor 的安装文件，不改用户的 Cursor 设置
- 不安装任何证书
- 不在本机跑代理
- 用户自己日常使用的 Cursor 完全不受影响，两份可以同时打开

### 2.3 主要功能

| 功能 | 说明 |
|---|---|
| 一键启动 | 自动找到本机安装的 Cursor，用独立 profile 打开并完成登录 |
| 导入本机 Cursor | 把日常 Cursor 的设置、快捷键、代码片段、聊天记录一键复制到独立 profile |
| 用量与额度 | 按日 / 近一周 / 近一个月 / 累计查看请求数、Token、费用，以及账户额度余量 |
| 调用明细 | 逐条查看每次调用的模型、Token、费用、耗时、状态，以及计费档位（高级 / AUTO） |
| 桌面体验 | 系统托盘、开机自启、静默启动、Dock 图标开关、自动更新 |

### 2.4 数据流转（「工作原理」一节直接用这张图）

```
Cursor 精灵（本机桌面应用 + 本地管理服务）
    │
    ├─ 登录校验 / 用量 / 账单 ────────────► 号池供应商 API
    │
    └─ 启动官方 Cursor（--user-data-dir 独立目录）
             │
             └─ 登录态、Agent、Tab 等全部请求 ───► 号池网关
```

本机只保存三样东西，都在 `~/.cursor-byok-v3/`：接入密钥与桌面设置（`cursor-byok.db`）、独立 Cursor profile（`cursor-relay/user-data/`）、日志。

### 2.5 使用前提

用户必须先自行安装官方 Cursor 桌面版。Cursor 精灵不附带、不代替 Cursor。这一点要在首屏下载按钮附近就提示到，并用一个独立板块给出官方 Cursor 安装包的下载直链（见 3.7 与 4.2），不要只丢一个 cursor.com 链接，也不要把它和精灵的下载按钮混在一起。

### 2.6 必须出现的免责声明

> 本项目是独立项目，与 Cursor 或其开发者没有关联，也未获得其认可。号池按用量计费，额度以登录后首页显示为准。

页脚必须原样保留这段话。整站不得使用 Cursor 官方 Logo、不得暗示官方合作或授权、不得把产品称作「Cursor 官方工具」。

### 2.7 已知链接

| 用途 | 地址 |
|---|---|
| 下载 / Release 仓库 | https://github.com/Token-communism/cursor-jingling |
| 最新 Release 页 | https://github.com/Token-communism/cursor-jingling/releases/latest |
| 提交问题 | https://github.com/Token-communism/cursor-jingling/issues |
| 官方 Cursor | https://cursor.com（仅在拿不到下载直链时作为兜底） |
| 官方 Cursor 下载直链数据源 | https://raw.githubusercontent.com/worryzyy/awesome-cursor-download/master/cursor-version-archive.json |
| 开源协议 | MIT |
| 获取密钥 | 待补充。未提供前不要渲染「获取密钥」按钮，不要编造地址 |

⚠️ 对外只暴露 cursor-jingling，页面任何位置都不要出现其他仓库地址。awesome-cursor-download 只在代码里作为数据源被请求，页面上不渲染它的地址；页面展示的官方 Cursor 下载链接全部指向 downloads.cursor.com。

## 3. 下载逻辑（最关键的一节）

### 3.1 铁律

绝对不要硬编码带版本号的下载直链。公开仓库只保留 Latest 一个 Release，旧 Release 连同 tag 会在每次发版后被自动删除，而资产文件名里含版本号。

### 3.2 数据来源

```ts
const REPO = "Token-communism/cursor-jingling";
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
const RELEASES_PAGE = `https://github.com/${REPO}/releases/latest`;
```

api.github.com 返回 `access-control-allow-origin: *`，浏览器可直接 fetch。未认证请求限流 60 次/小时/IP，必须有降级方案（3.5）。

### 3.3 真实响应形态（v0.1.4 实测）

```json
{
  "tag_name": "v0.1.4",
  "name": "Cursor 精灵 v0.1.4",
  "published_at": "2026-09-16T13:58:19Z",
  "assets": [
    { "name": "Cursor._0.1.4_aarch64.dmg", "label": "Cursor 精灵_0.1.4_aarch64.dmg", "size": 12437852,
      "browser_download_url": "https://github.com/Token-communism/cursor-jingling/releases/download/v0.1.4/Cursor._0.1.4_aarch64.dmg" },
    { "name": "Cursor._0.1.4_x64-setup.exe", "label": "Cursor 精灵_0.1.4_x64-setup.exe", "size": 11073155,
      "browser_download_url": "https://github.com/Token-communism/cursor-jingling/releases/download/v0.1.4/Cursor._0.1.4_x64-setup.exe" },
    { "name": "Cursor._0.1.4_aarch64.app.tar.gz",     "size": 12524379 },
    { "name": "Cursor._0.1.4_aarch64.app.tar.gz.sig", "size": 412 },
    { "name": "Cursor._0.1.4_x64-setup.exe.sig",      "size": 424 },
    { "name": "latest.json",                          "size": 2549 }
  ]
}
```

`name` 里的中文被 GitHub 剥掉了，漂亮名字在 `label`。下载用 `browser_download_url`，界面展示用 `label`（缺失时回退 `name`）。

### 3.4 资产匹配规则

| 平台 | 匹配条件 | 展示名 |
|---|---|---|
| macOS（Apple 芯片） | `name.endsWith(".dmg")` | macOS · Apple 芯片 |
| Windows（x64） | `name.endsWith("-setup.exe")` | Windows 64 位 |

必须排除：`*.sig`、`*.app.tar.gz`（自动更新载荷，不是安装包）、`latest.json`、GitHub 自动附加的 Source code。

目前只发布 macos-aarch64 与 windows-x86_64。没有 macOS Intel 包，没有 Linux 包。页面不得暗示这两者可下载。

版本号 = `tag_name` 去掉开头的 v。发布时间 = `published_at`，展示为 YYYY-MM-DD。体积 = `size` 字节，1024 进制换算 MB 保留一位小数（如 11.9 MB）。

### 3.5 只信运行时结果，不展示旧版链接

发新版后 GitHub 上的旧版资产会被删除，所以任何构建时预取或本地缓存的精灵下载链接都可能已经 404。Cursor 精灵的下载链接**只**来自页面加载后对 API 的一次实时 fetch，不做构建时预取，不做 localStorage 缓存。

页面按三个状态渲染首屏下载区：

| 状态 | 首屏表现 |
| --- | --- |
| `loading` | 主按钮位置显示禁用态「正在获取最新版本…」 |
| `ready` | 正常渲染下载按钮、版本行与「其他平台」 |
| `failed`（超时、限流、网络不通） | 显示提示框：说明需要能访问 github.com（部分网络需代理）、页面不会展示历史链接以免下载到失效版本；提供「重试」按钮（重新 fetch）和「前往 GitHub Releases 页面」链接 |

失败态**不得**渲染任何具体安装包直链。

### 3.6 访客系统识别

```ts
navigator.userAgentData?.platform  // "macOS" | "Windows" | "Linux" | ...  优先 UA-CH，回退 UA 字符串
```

判定结果只有三种：`macos` / `windows` / `unknown`。

- macOS：主按钮给 .dmg。按钮下方必须有一行小字「仅支持 Apple 芯片（M 系列）」——不要猜测、不要弹警告
- Windows：主按钮给 -setup.exe
- unknown（含 Linux、移动端）：不显示主按钮，并排展示两个平台按钮，并附一行「暂未提供 Linux 安装包，可从源码自行构建」

无论识别结果如何，主按钮下方都要有一个「其他平台」次级入口，展开后列出全部可下载安装包（平台、展示名、体积）。

### 3.7 官方 Cursor 下载直链

官方 Cursor 的下载入口是首屏之下一个独立板块（4.2），与首屏的 Cursor 精灵下载严格分开，避免访客混淆「下载精灵」与「下载原版」。首屏的「需先安装官方 Cursor →」只是一个锚点链接跳到该板块。数据来自 awesome-cursor-download 仓库维护的 `cursor-version-archive.json`（GitHub Actions 每小时刷新一次，raw.githubusercontent.com 带 `access-control-allow-origin: *`，gzip 后约 40 KB）。

```ts
const CURSOR_ARCHIVE_URL =
  "https://raw.githubusercontent.com/worryzyy/awesome-cursor-download/master/cursor-version-archive.json";
```

响应形态（键为版本号，最新在前，但不要依赖键顺序，按语义化版本排序取最大者；忽略 `Unknown` 这类非版本键）：

```json
{
  "3.21.16": {
    "date": "2026-09-19",
    "platforms": {
      "windows":       { "url": "https://downloads.cursor.com/production/<hash>/win32/x64/system-setup/CursorSetup-x64-3.21.16.exe" },
      "windows_arm64": { "url": ".../win32/arm64/system-setup/CursorSetup-arm64-3.21.16.exe" },
      "mac":           { "url": ".../darwin/universal/Cursor-darwin-universal.dmg" },
      "mac_intel":     { "url": ".../darwin/x64/Cursor-darwin-x64.dmg" },
      "mac_arm64":     { "url": ".../darwin/arm64/Cursor-darwin-arm64.dmg" },
      "linux":         { "url": ".../linux/x64/Cursor-3.21.16-x86_64.AppImage" },
      "linux_arm64":   { "url": ".../linux/arm64/Cursor-3.21.16-aarch64.AppImage" }
    },
    "changelog": "N/A"
  }
}
```

| 平台键 | 所属卡片 | 展示名 |
|---|---|---|
| `mac` | macOS | 通用版（Intel 与 Apple 芯片） |
| `mac_arm64` | macOS | Apple 芯片（M 系列） |
| `mac_intel` | macOS | Intel |
| `windows` | Windows | x64 |
| `windows_arm64` | Windows | ARM64 |
| `linux` | Linux | x64 AppImage |
| `linux_arm64` | Linux | ARM64 AppImage |

降级链与 3.5 相同：构建时预取只写入最新一个版本到 `src/cursor.fallback.json`（不要把整份历史打进 bundle）→ 运行时 fetch 覆盖 → localStorage 缓存 30 分钟 → 都失败时板块只保留标题与说明，按钮退化为「前往 cursor.com 下载」。

## 4. 页面结构（单页滚动，屏间足够留白，不做整屏吸附）

### 4.1 首屏 Hero

```
[logo 64px]
Cursor 精灵
一把密钥，一键启动一份已登录的官方 Cursor

[ ↓ 下载 macOS 版 ]   其他平台 ▾
v0.1.4 · 11.9 MB · Apple 芯片 · 2026-09-16
需先安装官方 Cursor →        ← 锚点，跳到 4.2 板块
```

背景：深色 + 一团品牌绿（#00ec7e）的径向柔光，透明度 15%–22%，位置偏上。主按钮是全页唯一的实心高饱和按钮，用品牌蓝 #4489ff。「需先安装官方 Cursor →」是浅色小字锚点链接（`#cursor-download`），必须有。首屏只放 Cursor 精灵的下载，不要在这里混入官方 Cursor 的安装包。

### 4.2 安装官方 Cursor（首屏之下第一屏）

独立板块，`id="cursor-download"`，背景用 `--bg-surface` 与首屏区分开。三张系统卡片并排，访客系统对应的卡片高亮边框并打「你的系统」标记；unknown 不高亮。

```
前置条件
先安装官方 Cursor
Cursor 精灵不附带、不代替 Cursor。请先安装官方 Cursor 桌面版，再安装上面的 Cursor 精灵。以下为官方安装包直链。
最新版本 v3.21.16 · 2026-09-19

┌ macOS ─────── 你的系统 ┐ ┌ Windows ──────────┐ ┌ Linux ────────────────┐
│ 通用版（Intel 与 Apple 芯片） 下载 │ │ x64          下载 │ │ x64 AppImage     下载 │
│ Apple 芯片（M 系列）        下载 │ │ ARM64        下载 │ │ ARM64 AppImage   下载 │
│ Intel                      下载 │ │                   │ │                       │
└────────────────────────────────┘ └───────────────────┘ └───────────────────────┘
```

卡片里的「下载」是次级按钮样式（`--bg-subtle` 底 + 边框），不要用首屏主按钮的实心品牌蓝，保证全页只有一个实心高饱和按钮。窄屏（< 900px）三卡竖排。数据与降级见 3.7。

### 4.3 产品演示

展示一张登录后主界面的静态截图 `public/demo-screenshot.webp`。

- 外面套一个仿 macOS 窗口边框（圆角 10px、顶部三个交通灯圆点、深色标题栏写「Cursor 精灵」）
- 应用真实窗口尺寸 820×558，截图用这个宽高比（约 1.47:1），max-width: 920px，居中
- 给显式 width/height 与 `aspect-ratio`，避免加载时抖动
- 截图上方一行：「下面是应用的真实界面，图中数据为演示数据」
- 所有断点共用这一套，不做窄屏分支
- 不要嵌入可交互演示。本仓库不含客户端源码，也不接受客户端构建产物

### 4.4 核心能力

4–5 张卡片，两列网格（窄屏单列）。图标 + 标题 + 一到两句话。标题照抄 2.3：一键启动 / 导入本机 Cursor / 用量与额度 / 调用明细 / 桌面体验。

### 4.5 工作原理（信任屏）

左侧 2.4 的数据流转图（等宽 ASCII 或 div 重绘的三个盒子 + 箭头）。右侧四条否定式承诺，每条前一个对勾：

- 不修改 Cursor 的安装文件和用户设置
- 不安装证书
- 不在本机做代理
- 你日常使用的 Cursor 不受影响，两份可以同时打开

下方小字：「本机只保存三样东西，都在 ~/.cursor-byok-v3/：接入密钥与桌面设置、独立 Cursor profile、日志。」

### 4.6 快速开始（四步，横向编号步骤条，窄屏竖排）

1. 安装桌面版 Cursor
2. 下载并安装 Cursor 精灵
3. 打开 Cursor 精灵，输入接入密钥登录
4. 在「用量」页顶部的启动卡点击「一键启动」，会弹出一份已登录的独立 Cursor 窗口

### 4.7 常见问题（原生 `<details>`）

- **会影响我现在用的 Cursor 吗？** 不会。Cursor 精灵用独立的用户数据目录启动一份新的 Cursor，不碰你原来的安装和设置，两份可以同时开着。
- **支持哪些系统？** 目前提供 macOS（Apple 芯片）和 Windows 64 位安装包。Linux 可以从源码自行构建。
- **怎么更新？** 应用内置自动更新，有新版本会提示下载安装，不需要再回到官网。
- **我的数据存在哪？** 全部在本机 ~/.cursor-byok-v3/，包含接入密钥与设置、独立 Cursor profile、日志。
- （「接入密钥从哪来？」待补充，链接确定前不要放）

### 4.8 页尾下载区

再来一次 CTA，直接摊开完整安装包表格（平台 / 文件名 / 体积 / 下载按钮），不折叠。旁边「在 GitHub 上查看全部版本」次级链接。

### 4.9 页脚

GitHub 仓库链接、提交问题链接、MIT 协议、2.6 免责声明原文。

## 5. 视觉规范（复用桌面端设计令牌）

```scss
--bg-page:        #141414;
--bg-surface:     #1f1f1f;
--bg-sidebar:     #0f0f0f;
--bg-subtle:      #2a2a2a;
--fg:             #ffffffe6;
--fg-muted:       #ffffffb3;
--border:         #ffffff0a;
--border-strong:  #ffffff14;
--accent:         #4489ff;
--accent-hover:   #49b0ff;
--brand-green:    #00ec7e;
--success:        #22a45d;
--danger:         #d63a3a;
```

圆角：卡片 9px，小控件 7px，演示窗口 10px。阴影：`0 26px 64px rgb(0 0 0 / 46%)`（大卡片）、`0 12px 28px rgb(0 0 0 / 38%)`（浮层）。字号阶：12 / 13 / 14 / 16 / 18 / 20 / 30 px；Hero 主标题 44–56px 是唯一例外。字体：系统字体栈，中文优先 "PingFang SC", "Microsoft YaHei"，不引入 Web Font。Logo 取自桌面端应用图标，已落到 `public/logo.png`。`color-scheme: dark`，`<meta name="theme-color" content="#141414">`。

## 6. 文案（术语与应用内一致：接入密钥、号池、用量、明细、额度、一键启动、独立窗口）

| 位置 | 文案 |
|---|---|
| 标题 | Cursor 精灵 |
| 副标题 | 一把密钥，一键启动一份已登录的官方 Cursor |
| Hero 补充 | 不改你的 Cursor，不装证书，不走本地代理。两份可以同时开着。 |
| 主按钮（macOS） | 下载 macOS 版 |
| 主按钮（Windows） | 下载 Windows 版 |
| 主按钮（兜底） | 前往 GitHub 下载 |
| 前置提示 | 需先安装官方 Cursor → |
| 演示区标题 | 真实界面，一眼看懂 |
| `<title>` | Cursor 精灵 · 一把密钥，一键启动已登录的 Cursor |
| `<meta description>` | Cursor 精灵是一个桌面应用：输入接入密钥，一键以独立用户数据目录启动一份已登录的官方 Cursor。不修改你的 Cursor 安装与设置，两份可同时使用。支持 macOS 与 Windows。 |

## 7. 质量要求

- 响应式：断点 < 640px / 640–900px / > 900px。下载按钮全宽；数据流转图横向可滚动。
- 可访问性：语义标签；标题层级不跳级；键盘可达 + 可见焦点环（#49b0ff，3px 外发光）；对比度 ≥ 4.5:1；`prefers-reduced-motion: reduce` 关闭入场动画与柔光呼吸。
- 性能：首屏无阻塞第三方脚本；图片 WebP 并给显式 width/height；LCP < 2.0s（4G）。
- SEO 与分享：完整 Open Graph 与 Twitter Card（og:image 用 public/og.png）；canonical；robots.txt 与 sitemap.xml。
- 不要加统计脚本、Cookie 横幅、聊天挂件、邮件订阅框、弹窗。

## 8. 部署

```
npm install
npm run build        # 产出 dist/
```

发布目录 `dist`。站点按部署在域名根路径设计；若要部署到子路径，需同时设置 vite 的 `base` 并改掉 `index.html`、`robots.txt`、`sitemap.xml` 里的绝对地址。

## 9. 明确不要做的事

- 不要硬编码带版本号的下载直链
- 不要把 .app.tar.gz 或 latest.json 当成安装包
- 不要出现 macOS Intel 或 Linux 安装包的下载入口
- 不要在页面上提及或链接 cursor-jingling 以外的任何仓库（awesome-cursor-download 只作为代码里的数据源）
- 不要使用 Cursor 官方 Logo、配色标识，不要暗示与 Cursor 官方存在合作或授权
- 不要放任何真实接入密钥，示例一律 sk-xxxxxx
- 不要新建注册 / 登录 / 支付流程
- 不要把客户端源码或其构建产物搬进本仓库
