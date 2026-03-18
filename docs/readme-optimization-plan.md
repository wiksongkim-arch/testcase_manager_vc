# README 优化计划

## 目标
优化 testcase-manager 的 README.md，使其包含：
1. 清晰的项目介绍
2. 详细的快速启动指南（macOS/Linux/Windows）
3. VS Code 插件使用说明
4. 中英文双语内容

## 结构规划

### 1. 头部区域
- 项目名称和 Logo（可选）
- 一句话描述
- 技术栈徽章
- 快速链接（文档、演示等）

### 2. 功能特性（Features）
- 中英文对照
- 核心功能列表

### 3. 快速开始（Quick Start）
#### 3.1 环境要求
#### 3.2 macOS 快速启动
#### 3.3 Linux 快速启动
#### 3.4 Windows 快速启动

### 4. VS Code 插件使用（VS Code Extension）
- 安装方法
- 配置说明
- 使用步骤

### 5. 项目结构
### 6. 开发指南
### 7. 贡献指南
### 8. 许可证

## 内容草稿

```markdown
# TestCase Manager | 测试用例管理器

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

> A modern, Git-based test case management system with Excel-like editing experience.
> 一个现代化的、基于 Git 的测试用例管理系统，提供类 Excel 的编辑体验。

---

## ✨ Features | 功能特性

- 📊 **Excel-like Editing** | 类 Excel 表格编辑
  - Intuitive spreadsheet interface powered by Handsontable
  - 由 Handsontable 提供的直观电子表格界面

- 🔄 **Git Version Control** | Git 版本控制
  - Full Git integration for test case versioning
  - 完整的 Git 集成，实现测试用例版本管理

- 🔀 **Conflict Resolution** | 冲突解决
  - Smart merge conflict resolution for collaborative editing
  - 智能合并冲突解决，支持协作编辑

- 📁 **Project Management** | 项目管理
  - Organize test cases by projects and suites
  - 按项目和测试套件组织测试用例

- 📥📤 **Excel Import/Export** | Excel 导入导出
  - Seamless data exchange with Excel files
  - 与 Excel 文件无缝数据交换

- 🔌 **VS Code Extension** | VS Code 插件
  - Manage test cases directly in your IDE
  - 在 IDE 中直接管理测试用例

---

## 🚀 Quick Start | 快速开始

### Prerequisites | 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**
- **Docker** (optional, for containerized deployment)

---

### macOS

```bash
# 1. Clone the repository | 克隆仓库
git clone <repository-url>
cd testcase-manager

# 2. Install dependencies | 安装依赖
npm install

# 3. Start development server | 启动开发服务器
npm run dev

# 4. Or use Docker | 或使用 Docker
./scripts/deploy.sh dev
```

Access the application | 访问应用:
- Web UI: http://localhost:3000
- API: http://localhost:3001

---

### Linux (Ubuntu/Debian)

```bash
# 1. Clone the repository | 克隆仓库
git clone <repository-url>
cd testcase-manager

# 2. Install dependencies | 安装依赖
npm install

# 3. Build packages | 构建包
npm run build

# 4. Start services | 启动服务
npm run dev

# Or use Docker Compose | 或使用 Docker Compose
./scripts/deploy.sh dev
```

---

### Windows

#### Option 1: Using PowerShell | 方式一：使用 PowerShell

```powershell
# 1. Clone the repository | 克隆仓库
git clone <repository-url>
cd testcase-manager

# 2. Install dependencies | 安装依赖
npm install

# 3. Build packages | 构建包
npm run build

# 4. Start development server | 启动开发服务器
npm run dev
```

#### Option 2: Using WSL2 (Recommended) | 方式二：使用 WSL2（推荐）

```bash
# In WSL2 terminal | 在 WSL2 终端中
wsl

# Follow Linux instructions | 按照 Linux 说明操作
git clone <repository-url>
cd testcase-manager
npm install
npm run dev
```

#### Option 3: Using Docker Desktop | 方式三：使用 Docker Desktop

```powershell
# Start Docker Desktop first | 先启动 Docker Desktop

# Run deployment script | 运行部署脚本
.\scripts\deploy.sh dev
```

---

## 🔌 VS Code Extension | VS Code 插件

### Installation | 安装

#### Method 1: From VSIX | 方式一：从 VSIX 安装

1. Build the extension | 构建插件:
   ```bash
   cd apps/vscode-extension
   npm install
   npm run package
   ```

2. Install in VS Code | 在 VS Code 中安装:
   - Open VS Code | 打开 VS Code
   - Go to Extensions view | 进入扩展视图 (Ctrl+Shift+X)
   - Click "..." menu | 点击 "..." 菜单
   - Select "Install from VSIX" | 选择 "从 VSIX 安装"
   - Choose `testcase-manager-0.1.0.vsix` | 选择 `testcase-manager-0.1.0.vsix`

#### Method 2: From Marketplace (Future) | 方式二：从应用商店安装（未来）

Search "TestCase Manager" in VS Code Extensions marketplace.
在 VS Code 扩展应用商店中搜索 "TestCase Manager"。

### Configuration | 配置

1. Open Settings | 打开设置 (Ctrl+,)
2. Search for "TestCase Manager" | 搜索 "TestCase Manager"
3. Configure | 配置:
   - **API URL**: Backend service address | 后端服务地址 (default: http://localhost:3001)
   - **Default Author**: Git commit author | Git 提交作者

### Usage | 使用

1. **Open TestCase Manager** | 打开测试用例管理器
   - Press `Ctrl+Shift+P` | 按 `Ctrl+Shift+P`
   - Type "TestCase Manager: Open" | 输入 "TestCase Manager: Open"
   - Or click the TestCase Manager icon in sidebar | 或点击侧边栏的 TestCase Manager 图标

2. **Manage Projects** | 管理项目
   - View projects in the sidebar | 在侧边栏查看项目
   - Click to open a project | 点击打开项目
   - Use refresh button to update list | 使用刷新按钮更新列表

3. **Edit Test Cases** | 编辑测试用例
   - Use the spreadsheet interface | 使用电子表格界面
   - Edit cells directly | 直接编辑单元格
   - Use dropdown for priority/status | 使用下拉菜单选择优先级/状态

4. **Git Operations** | Git 操作
   - **Pull**: Fetch latest changes | 拉取最新更改
   - **Commit**: Save changes with message | 提交更改并添加消息
   - **Push**: Upload changes to remote | 推送更改到远程

---

## 📁 Project Structure | 项目结构

```
testcase-manager/
├── apps/                          # Applications | 应用程序
│   ├── web/                       # Web frontend (React + Vite) | Web 前端
│   └── vscode-extension/          # VS Code extension | VS Code 插件
├── packages/                      # Shared packages | 共享包
│   ├── shared/                    # Type definitions | 类型定义
│   ├── git-core/                  # Git operations | Git 操作
│   └── excel-core/                # Excel import/export | Excel 导入导出
├── services/                      # Backend services | 后端服务
│   └── api/                       # API server (Express) | API 服务器
├── scripts/                       # Deployment scripts | 部署脚本
├── docker-compose.yml             # Docker compose config | Docker 编排配置
└── README.md                      # This file | 本文件
```

---

## 🛠️ Development | 开发

### Build All | 构建全部

```bash
npm run build
```

### Run Tests | 运行测试

```bash
npm run test
```

### Development Mode | 开发模式

```bash
# Start all services in dev mode | 以开发模式启动所有服务
npm run dev
```

---

## 🤝 Contributing | 贡献

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.
欢迎贡献！请阅读我们的[贡献指南](CONTRIBUTING.md)了解详情。

---

## 📄 License | 许可证

[Apache-2.0](LICENSE)
```
