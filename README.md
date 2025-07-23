# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# 学生成绩排名系统

一个基于 React + TypeScript + Supabase 的学生成绩管理和排名展示系统。

## 功能特性

### 🎯 核心功能
- **游客查看排名**：无需登录即可查看学生成绩排名
- **教师认证登录**：安全的身份验证系统
- **学生信息管理**：添加和管理学生基本信息
- **成绩录入系统**：记录学生成绩和日期
- **成绩修改功能**：支持修改已录入的成绩记录

### 📱 技术特性
- **响应式设计**：完美适配桌面端和移动端
- **实时数据同步**：基于 Supabase 的实时数据库
- **现代化界面**：简洁美观的用户界面
- **类型安全**：完整的 TypeScript 类型定义

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **数据库**: Supabase (PostgreSQL)
- **身份认证**: Supabase Auth
- **样式**: 自定义 CSS + CSS Grid/Flexbox
- **图标**: Lucide React
- **路由**: React Router DOM

## 快速开始

### 1. 环境准备

确保你的系统已安装：
- Node.js (版本 16 或以上)
- npm 或 yarn

### 2. 克隆项目

```bash
git clone <your-repo-url>
cd stu-rank
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置 Supabase

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 复制项目的 URL 和 anon key
3. 复制 `.env` 文件并填入你的配置：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. 初始化数据库

在 Supabase SQL 编辑器中运行 `supabase-init.sql` 文件中的 SQL 脚本。

### 6. 创建教师账户

在 Supabase Authentication 页面手动创建教师账户，或在应用中注册。

### 7. 启动开发服务器

```bash
npm run dev
```

应用will在 `http://localhost:5173` 上运行。

## 项目结构

```
src/
├── components/          # React 组件
│   ├── Dashboard.tsx   # 教师管理面板
│   ├── Login.tsx       # 登录页面
│   ├── Ranking.tsx     # 学生排名页面
│   └── *.css          # 组件样式文件
├── contexts/           # React Context
│   └── AuthContext.tsx # 认证上下文
├── lib/               # 工具库
│   └── supabase.ts    # Supabase 配置和类型
├── App.tsx            # 主应用组件
├── App.css            # 应用样式
├── index.css          # 全局样式
└── main.tsx           # 应用入口
```

## 数据库结构

### students 表
- `id`: 主键
- `name`: 学生姓名
- `created_at`: 创建时间

### scores 表
- `id`: 主键
- `student_id`: 学生ID（外键）
- `score`: 成绩分数
- `date`: 成绩日期
- `created_at`: 创建时间
- `updated_at`: 更新时间

## 部署

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 添加环境变量
4. 部署

### 部署到 Netlify

1. 运行 `npm run build`
2. 将 `dist` 文件夹上传到 Netlify
3. 配置环境变量

## 使用说明

### 游客用户
1. 访问网站首页即可查看学生排名
2. 排名按最新成绩从高到低排序
3. 点击右上角"教师登录"按钮进行登录

### 教师用户
1. 点击"教师登录"进入登录页面
2. 使用邮箱和密码登录
3. 登录后可以：
   - 添加新学生
   - 为学生录入成绩
   - 查看和修改成绩记录

## 开发说明

### 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 ESLint

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 React Hooks 最佳实践
- 使用函数式组件和现代 React 特性
- CSS 采用 BEM 命名规范

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 支持

如有问题或建议，请创建 Issue 或联系开发者。

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
