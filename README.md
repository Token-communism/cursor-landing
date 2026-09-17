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

三级降级：构建时预取写入 `src/release.fallback.json` → 运行时 fetch 覆盖 → 都失败时按钮降级为「前往 GitHub 下载」。发新版后页面自动指向新版本，不需要改代码或重新部署。

## 目录

```
.
├── index.html
├── vite.config.ts        # 构建时预取 latest release
├── public/               # 原样拷贝进 dist：logo、og 图、演示截图、robots、sitemap
├── scripts/make-og.py    # 生成 og.png
└── src/
    ├── release.ts        # 最新版本与安装包解析（全站最关键的逻辑）
    ├── ReleaseContext.tsx
    ├── platform.ts       # 访客系统识别
    ├── components/       # 下载按钮与图标
    ├── sections/         # 每屏一个组件
    └── styles/           # 设计令牌与全局样式
```

## 约束

本仓库只放落地页，不含客户端源码，也不接受客户端构建产物。其余硬性约束（免责声明原文、不得使用 Cursor 官方 Logo 等）见 SPEC.md 第 2.6 节与第 9 节。

## License

MIT
