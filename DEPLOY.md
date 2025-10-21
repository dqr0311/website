# 部署指南 - Vercel + Convex

## 📋 部署前准备

确保你已经：
- ✅ 修复了所有代码 bug
- ✅ 本地测试运行成功
- ✅ 有 GitHub 账号
- ✅ 有 Vercel 账号
- ✅ 有 Convex 账号

---

## 🚀 完整部署步骤

### 第一步：推送代码到 GitHub

1. **初始化 Git 仓库（如果还没有）**
   ```bash
   cd /Users/qiranduan/Documents/project1/ai-tools-dir
   git init
   git add .
   git commit -m "Initial commit - AI Tools Directory"
   ```

2. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 仓库名称：`ai-tools-directory` (或你喜欢的名字)
   - 设置为 Public 或 Private
   - 不要勾选 "Add README" (因为我们已经有了)
   - 点击 "Create repository"

3. **推送代码到 GitHub**
   ```bash
   # 替换下面的 YOUR_USERNAME 为你的 GitHub 用户名
   git remote add origin https://github.com/YOUR_USERNAME/ai-tools-directory.git
   git branch -M main
   git push -u origin main
   ```

---

### 第二步：部署 Convex 后端

1. **安装 Convex CLI（如果还没安装）**
   ```bash
   npm install -g convex
   ```

2. **登录 Convex**
   ```bash
   npx convex login
   ```
   - 会打开浏览器让你登录/注册
   - 登录成功后回到终端

3. **初始化 Convex 项目**
   ```bash
   npx convex dev
   ```
   - 第一次运行会提示创建新项目或选择已有项目
   - 选择 "Create a new project"
   - 输入项目名称，例如：`ai-tools-directory`
   - 等待部署完成

4. **复制 Convex URL**
   - 部署成功后，终端会显示类似：
     ```
     ✔ Deployed functions to https://your-project-123.convex.cloud
     ```
   - **复制这个 URL，待会要用**

5. **创建本地环境变量文件**
   ```bash
   echo "NEXT_PUBLIC_CONVEX_URL=https://your-project-123.convex.cloud" > .env.local
   ```
   - **注意**：把 `https://your-project-123.convex.cloud` 替换为你实际的 URL

6. **测试 Convex 是否正常**
   - 保持 `npx convex dev` 运行
   - 新开一个终端窗口
   - 运行 `npm run dev`
   - 访问 http://localhost:3000/admin
   - 点击 "Import Sample Data" 测试

---

### 第三步：部署到 Vercel

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入 GitHub 项目**
   - 点击 "Add New..." → "Project"
   - 选择你刚才创建的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   
   **Framework Preset**: Next.js (自动检测)
   
   **Root Directory**: `./` (默认)
   
   **Build Command**: `npm run build` (默认)
   
   **Install Command**: `npm install` (默认)

4. **⚠️ 重要：配置环境变量**
   
   在 "Environment Variables" 部分：
   
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_CONVEX_URL` | `https://your-project-123.convex.cloud` |
   
   - **注意**：使用你在第二步复制的 Convex URL
   - 点击 "Add" 添加这个环境变量

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 2-3 分钟）

6. **访问你的网站**
   - 部署成功后，Vercel 会给你一个 URL
   - 例如：`https://your-project.vercel.app`
   - 点击访问

---

### 第四步：配置 Convex 生产环境

**重要**：你需要为 Vercel 生产环境配置单独的 Convex 部署

1. **创建生产环境部署**
   ```bash
   npx convex deploy
   ```
   - 这会创建一个**生产环境**的 Convex 部署
   - 会得到一个新的 URL（通常以 `.convex.cloud` 结尾）

2. **更新 Vercel 环境变量**
   - 回到 Vercel 项目设置
   - 点击 "Settings" → "Environment Variables"
   - 更新 `NEXT_PUBLIC_CONVEX_URL` 为生产环境的 URL
   - 点击 "Save"

3. **重新部署 Vercel**
   - 回到 "Deployments" 标签
   - 点击最新的部署
   - 点击右上角的 "..." → "Redeploy"
   - 选择 "Redeploy"

---

## 🔧 常见问题和解决方案

### ❌ 问题 1: importFromGithub 显示错误

**可能原因**：
- ✅ 环境变量未设置或错误
- ✅ Convex 后端未正确部署
- ✅ CORS 问题

**解决方案**：
1. 检查 Vercel 环境变量是否正确设置
2. 检查 Convex Dashboard (https://dashboard.convex.dev)
3. 查看浏览器控制台的具体错误信息
4. 确保使用的是生产环境的 Convex URL

### ❌ 问题 2: 构建失败

**错误信息**: `Module not found: Can't resolve 'convex/react'`

**解决方案**：
- Convex 已经移到 dependencies 中（我已修复）
- 如果还有问题，运行：
  ```bash
  npm install convex --save
  git add package.json package-lock.json
  git commit -m "Move convex to dependencies"
  git push
  ```

### ❌ 问题 3: 图片不显示

**错误信息**: `Invalid src prop`

**解决方案**：
- 已在 `next.config.ts` 中配置允许远程图片
- 如果特定域名不行，可以添加具体的 hostname

### ❌ 问题 4: 数据库为空

**解决方案**：
1. 访问 `https://your-site.vercel.app/admin`
2. 点击 "Import Sample Data" 导入示例数据
3. 或使用 "Import from GitHub" 导入真实数据

---

## 📊 验证部署成功

检查以下项目：

1. ✅ 访问主页 - 应该显示 "AI Tool Catalog"
2. ✅ 访问 `/admin` - 可以导入数据
3. ✅ 导入示例数据成功
4. ✅ 主页显示导入的工具
5. ✅ 搜索和过滤功能正常
6. ✅ 分页功能正常

---

## 🎯 下一步优化（可选）

1. **自定义域名**
   - Vercel Settings → Domains → 添加你的域名

2. **配置 Convex 生产模式**
   - 开发环境：`npx convex dev` (localhost)
   - 生产环境：`npx convex deploy` (Vercel)

3. **监控和日志**
   - Vercel Dashboard 查看访问日志
   - Convex Dashboard 查看函数调用

4. **性能优化**
   - 启用 Vercel Analytics
   - 配置 CDN 缓存

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Vercel 部署日志
2. 查看浏览器控制台错误
3. 查看 Convex Dashboard 的函数日志
4. 确认环境变量配置正确

---

**祝部署顺利！🚀**

