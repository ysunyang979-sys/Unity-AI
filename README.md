# Unity AI 代码助手 🎮

基于 Cloudflare Workers 的 Unity 开发 AI 助手，专注于帮助开发者快速实现 Unity 功能。

## ✨ 特性

- 🏗️ **架构优先** - 遵循 SOLID 原则，自动模块化拆分代码，拒绝"上帝类"
- 💬 **智能追问** - 分析需求后提出架构相关问题，确保代码设计合理
- 📖 **代码叙事者** - 用生动的比喻解释复杂代码逻辑
- 🌙 **深色/浅色主题** - 支持主题切换，保护眼睛
- 💾 **对话持久化** - 云端保存对话历史（登录用户）
- 🎨 **现代 UI** - 玻璃拟态设计，流畅的动画效果

## 🚀 部署

### 前置要求

- [Node.js](https://nodejs.org/) 16+
- [Cloudflare 账号](https://dash.cloudflare.com/)

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/ysunyang979-sys/Unity-AI.git
cd Unity-AI
```

2. 安装依赖

```bash
npm install
```

3. 配置 Cloudflare

```bash
npx wrangler login
```

4. 创建 D1 数据库

```bash
npx wrangler d1 create unity-ai-db
```

5. 更新 `wrangler.toml` 中的数据库 ID

6. 初始化数据库表

```bash
npx wrangler d1 execute unity-ai-db --command "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, password TEXT, created_at TEXT);"
npx wrangler d1 execute unity-ai-db --command "CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY, user_id TEXT, title TEXT, messages TEXT, created_at TEXT, updated_at TEXT);"
```

7. 部署

```bash
npx wrangler deploy
```

## 🔧 本地开发

```bash
npm run dev
```

访问 http://localhost:8787

## 📁 项目结构

```
Unity-AI/
├── src/
│   └── index.js      # 主代码文件（包含前端和后端）
├── wrangler.toml     # Cloudflare Workers 配置
├── package.json      # 项目依赖
└── README.md         # 说明文档
```

## 💡 使用方法

1. 描述你想实现的 Unity 功能（如"背包系统"、"角色控制器"）
2. AI 会分析需求并提出架构相关问题
3. 回答问题确认需求
4. 输入 **OOK** 触发完整代码生成
5. 获取模块化的 C# 代码

## 🛠️ 技术栈

- **运行时**: Cloudflare Workers
- **AI 模型**: Qwen 2.5 Coder 32B
- **数据库**: Cloudflare D1
- **前端**: 原生 HTML/CSS/JS
- **Markdown 渲染**: marked.js
- **代码高亮**: highlight.js

## 📝 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
