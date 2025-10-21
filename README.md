# AI Tools Directory

一个简单的 AI 工具目录应用，基于 Next.js 和 Convex 构建。

## ✨ 功能特性

- 🔍 搜索和过滤 AI 工具
- 🏷️ 按分类和标签浏览
- 📄 分页显示
- 📊 从 GitHub Awesome 列表导入数据
- 🎨 现代化 UI 设计

## 🚀 本地开发

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- Convex 账号

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd ai-tools-dir
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置 Convex**
   ```bash
   # 登录 Convex
   npx convex login
   
   # 启动 Convex 开发服务器（会自动创建 .env.local）
   npx convex dev
   ```

4. **启动开发服务器**
   
   打开新终端窗口：
   ```bash
   npm run dev
   ```

5. **访问应用**
   - 主页: http://localhost:3000
   - 管理页面: http://localhost:3000/admin

## 📦 部署到 Vercel

详细的部署指南请查看 [DEPLOY.md](./DEPLOY.md)

### 快速部署步骤

1. **部署 Convex**
   ```bash
   npx convex deploy
   ```
   复制得到的 Convex URL

2. **部署到 Vercel**
   - 推送代码到 GitHub
   - 在 Vercel 导入项目
   - 添加环境变量 `NEXT_PUBLIC_CONVEX_URL`
   - 点击部署

3. **导入数据**
   - 访问 `https://your-site.vercel.app/admin`
   - 点击 "Import Sample Data" 或 "Import from GitHub"

## 🛠️ 技术栈

- **前端**: Next.js 15 + React 19
- **后端**: Convex
- **样式**: Tailwind CSS 4
- **语言**: TypeScript
- **部署**: Vercel

## 📁 项目结构

```
ai-tools-dir/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理页面
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页
├── components/            # React 组件
│   ├── SearchBar.tsx      # 搜索栏
│   └── ToolCard.tsx       # 工具卡片
├── convex/                # Convex 后端
│   ├── schema.ts          # 数据库模式
│   └── tools.ts           # API 函数
├── lib/                   # 工具函数
│   ├── awesomeParser.ts   # Markdown 解析器
│   └── sampleData.ts      # 示例数据
└── public/                # 静态资源
```

## 🎯 使用指南

### 导入示例数据

访问 `/admin` 页面，点击 "Import Sample Data" 按钮。

### 从 GitHub 导入

1. 访问 `/admin` 页面
2. 输入 GitHub Awesome 列表的 raw URL
3. 默认: `https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md`
4. 点击 "Import from GitHub"

### 搜索和过滤

- 在搜索框输入关键词
- 选择分类下拉菜单
- 选择标签下拉菜单
- 可以组合使用多个过滤条件

## 🐛 常见问题

### 问题：importFromGithub 显示错误

**原因**：环境变量未配置或 Convex 未正确部署

**解决**：
1. 检查 `.env.local` 文件是否存在
2. 确认 `NEXT_PUBLIC_CONVEX_URL` 配置正确
3. 运行 `npx convex dev` 确保 Convex 正常运行

### 问题：图片不显示

**原因**：Next.js Image 需要配置远程图片域名

**解决**：已在 `next.config.ts` 中配置，允许所有 HTTPS 图片

### 问题：Vercel 部署失败

**原因**：环境变量未设置

**解决**：
1. 在 Vercel 项目设置中添加 `NEXT_PUBLIC_CONVEX_URL`
2. 使用生产环境的 Convex URL（通过 `npx convex deploy` 获取）

## 📝 开发说明

### 数据库模式

```typescript
tools: {
  name: string;           // 工具名称
  description: string;    // 描述
  url: string;           // 网址
  category: string;      // 分类
  tags: string[];        // 标签
  pricing: "free" | "freemium" | "paid";  // 定价
  image?: string;        // 图片 URL
  createdAt: number;     // 创建时间
  updatedAt: number;     // 更新时间
}
```

### API 端点

- `api.tools.list` - 获取工具列表（支持搜索、过滤、分页）
- `api.tools.categories` - 获取所有分类
- `api.tools.tags` - 获取所有标签
- `api.tools.upsertMany` - 批量导入工具

## 📄 License

MIT

## 🙏 致谢

- [mahseema/awesome-ai-tools](https://github.com/mahseema/awesome-ai-tools) - 数据源
- [Convex](https://convex.dev) - 后端服务
- [Vercel](https://vercel.com) - 部署平台
