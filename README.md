# cursor-landing

Cursor 精灵官网落地页。单页、深色、简体中文，唯一目标是让访客拿到适配自己系统的最新安装包。

技术栈：Vite 8 + React 19 + TypeScript + SCSS Modules，纯静态构建，无后端。

完整实现规格见 [SPEC.md](./SPEC.md)。

## 开发

```bash
npm install
npm run dev        # 本地开发
npm run build      # 产出 dist/
npm run preview    # 预览构建结果
npm run typecheck
npm test
```

## 下载信息从哪来

页面不硬编码任何带版本号的下载直链。安装包信息来自 GitHub 公开 API 的 latest release：

```
https://api.github.com/repos/Token-communism/cursor-jingling/releases/latest
```

精灵的下载链接只来自页面加载后的实时 fetch，不做构建时预取、不做本地缓存：发新版后旧资产会从 GitHub 删除，任何存下来的旧链接都会 404。拿不到最新版时（网络不通、超时、API 限流）首屏不显示任何直链，改为提示检查网络、提供「重试」和 GitHub Releases 页面链接。发新版后页面自动指向新版本，不需要改代码或重新部署。

首屏之下有一个独立的「先安装官方 Cursor」板块（与精灵下载分开，避免混淆），按 macOS / Windows / Linux 三张卡片给出官方安装包直链，数据来自 [awesome-cursor-download](https://github.com/worryzyy/awesome-cursor-download) 维护的版本归档（每小时刷新）：

```
https://raw.githubusercontent.com/worryzyy/awesome-cursor-download/master/cursor-version-archive.json
```

构建时只把最新一个版本写入 `src/cursor.fallback.json` → 运行时 fetch 覆盖 → 都失败时退回 https://cursor.com 链接。页面上展示的链接全部指向 downloads.cursor.com。

## 目录

```
.
├── index.html
├── vite.config.ts        # 构建时预取精灵 latest release + 官方 Cursor 最新版
├── public/               # 原样拷贝进 dist：logo、og 图、演示截图、robots、sitemap
├── scripts/make-og.py    # 生成 og.png
└── src/
    ├── release.ts        # 精灵最新版本与安装包解析（全站最关键的逻辑）
    ├── cursor.ts         # 官方 Cursor 最新版下载直链解析
    ├── ReleaseContext.tsx
    ├── platform.ts       # 访客系统识别
    ├── components/       # 下载按钮与图标
    ├── sections/         # 每屏一个组件：Hero（精灵下载）、CursorDownload（官方 Cursor 下载）、Footer
    └── styles/           # 设计令牌与全局样式
```

## 约束

本仓库只放落地页，不含客户端源码，也不接受客户端构建产物。其余硬性约束（免责声明原文、不得使用 Cursor 官方 Logo 等）见 SPEC.md 第 2.6 节与第 9 节。

## License

MIT
