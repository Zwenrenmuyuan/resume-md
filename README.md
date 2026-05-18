# ResumeMD

ResumeMD 是一个纯前端简历编辑工具，支持 Markdown 编辑和表单编辑两种模式。编辑内容默认保存在当前浏览器中，可导出 Markdown、JSON 或通过浏览器打印为 PDF。

在线访问：<https://zwenrenmuyuanzyj.me/resume-md/>

该地址来自用户站点仓库的 GitHub Pages 自定义域名配置：`username.github.io` 绑定了 `zwenrenmuyuanzyj.me`，本项目作为子路径发布到 `/resume-md/`。

## 功能特性

- Markdown 模式：使用 Markdown 编写简历，支持 GFM 表格、列表、链接等语法。
- 表单模式：通过表单维护个人信息、教育经历、实习经历、项目经历和自由内容区块。
- 实时预览：左侧编辑，右侧实时生成简历预览。
- 头像支持：支持上传 JPG、PNG、WebP 图片，并自动压缩处理。
- 主题与排版：支持主题色、区块间距、段落间距、列表项间距和行高调整。
- 导入导出：Markdown 模式支持 `.md`，表单模式支持 `.json`。
- PDF 导出：基于浏览器打印功能生成 PDF。
- 本地保存：内容自动保存到浏览器 `localStorage`。

## 隐私说明

ResumeMD 是静态前端应用，不需要登录，也不会将简历内容上传到服务器。公开访问的页面和 GitHub 仓库只包含工具本身，不包含浏览器中填写的简历内容。

为了避免数据丢失，建议定期使用“下载 .md”或“下载 .json”导出备份。更换设备、清理浏览器数据、使用隐私模式，或浏览器存储异常时，本地内容可能无法恢复。

## 技术栈

- React 18
- TypeScript
- Vite
- CodeMirror
- react-markdown
- remark-gfm
- react-resizable-panels

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

默认开发地址：

```text
http://localhost:7788/resume-md/
```

## 构建与预览

生产构建：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

## GitHub Pages 部署

项目已配置 GitHub Actions 自动部署。推送到 `main` 分支后，会执行：

```bash
npm ci
npm run build
```

构建产物 `dist/` 会发布到 GitHub Pages。由于用户站点仓库 `username.github.io` 已绑定自定义域名，本项目的访问地址不是 `https://username.github.io/resume-md/`，而是：

```text
https://zwenrenmuyuanzyj.me/resume-md/
```

其中 `zwenrenmuyuanzyj.me` 来自用户站点仓库的自定义域名配置，`/resume-md/` 对应当前仓库的 Pages 发布路径。

当前 Vite 配置使用：

```ts
base: '/resume-md/'
```

这个配置用于确保构建后的 CSS 和 JS 资源从 `/resume-md/assets/...` 加载，避免在子路径部署时出现资源 404。如果后续部署到域名根路径，需要将 `base` 改为 `/`。
