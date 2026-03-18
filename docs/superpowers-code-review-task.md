# Superpowers 代码审查任务

## 任务目标
使用 Superpowers 技能框架，对 TestCase Manager 项目进行全面代码审查。

## 审查范围
1. 检查 apps/ 和 services/ 目录结构
2. 验证所有源代码文件完整性
3. 检查 package.json workspaces 配置
4. 检查 API 路由配置
5. 检查类型定义一致性
6. 检查潜在 bug

## 需要检查的文件清单

### 根目录配置
- package.json - 检查 workspaces 配置
- turbo.json - 检查 pipeline 配置

### apps/ 目录
- apps/web/package.json
- apps/web/src/ 所有文件
- apps/vscode-extension/package.json
- apps/vscode-extension/src/ 所有文件

### services/ 目录
- services/api/package.json
- services/api/src/server.ts - 重点检查路由挂载
- services/api/src/routes/*.ts - 所有路由文件

### packages/ 目录
- packages/shared/src/types/*.ts - 类型定义
- packages/git-core/src/*.ts - Git 核心
- packages/excel-core/src/*.ts - Excel 功能

## 检查要点

### 1. Workspaces 配置
确认根 package.json 是否包含：
```json
"workspaces": [
  "apps/*",
  "packages/*", 
  "services/*"
]
```

### 2. API 路由挂载
检查 services/api/src/server.ts：
- projectsRouter 挂载路径
- excelRouter 挂载路径
- 是否有路径冲突

### 3. 类型定义一致性
对比计划书和实际代码：
- TestCaseMetadata 字段
- Project 字段
- 其他核心类型

### 4. 潜在 Bug
- 路由路径重复
- 类型不匹配
- 错误处理缺失

## 输出要求
生成详细的代码审查报告，包含：
1. 目录结构验证结果
2. 发现的问题清单（按优先级）
3. 修复建议
4. 代码质量评分
