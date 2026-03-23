# TestCase Manager for PyCharm

为 PyCharm 提供 Excel 风格的测试用例编辑体验。

## 功能特性

- 📊 Excel 风格的表格编辑界面
- 📝 YAML 测试用例文件解析与展示
- 🔄 双向同步（YAML ↔ Excel）
- 📁 Git 集成支持

## 安装

1. 下载插件包
2. 在 PyCharm 中打开 Settings → Plugins → Install from disk
3. 选择下载的插件包文件

## 使用

1. 打开任意 `.yaml` 或 `.yml` 文件
2. 编辑器会自动切换为 Excel 表格视图
3. 编辑完成后保存即可

## 开发

### 环境要求

- JDK 17+
- IntelliJ IDEA / PyCharm

### 构建

```bash
./gradlew build
```

### 运行

```bash
./gradlew runIde
```

## 许可证

MIT License
