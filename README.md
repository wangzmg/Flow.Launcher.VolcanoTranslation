# Flow.Launcher.VolcanoTranslation


本插件为Flow Launcher提供火山引擎翻译API的集成，具有清晰的模块化结构和高效的API请求处理。

## 功能特点

- 基于火山引擎翻译API进行高质量翻译
- **支持中英自动互译**，无需指定源语言和目标语言
- 支持50+种语言的翻译（通过设置特定的目标语言）
- 简洁明了的用户界面
- 便捷的配置管理

## 技术架构

### 关注点分离

- **翻译服务**：专注于翻译功能，不涉及底层实现细节
- **配置数据**：API端点、区域等配置集中管理

### 安全与性能

- 使用官方SDK进行请求签名，确保安全性
- 模块化设计提高代码可维护性
- 优化的错误处理机制

## 使用方法

### 基本翻译

在Flow Launcher中输入：
```
y hello world
```
或
```
y 你好世界
```
系统会自动检测语言并翻译为对应的语言（中文翻译为英文，英文翻译为中文）。


```
y ja 你好世界
```
便捷设定目标语言


### 配置命令

- `y appid your-appid` - 设置火山引擎API ID
- `y key your-key` - 设置火山引擎API密钥
- `y dest zh` - 设置固定的目标语言（如果需要）
- `y dest ""` - 恢复自动中英互译模式
- `y url ""` - 配置在线翻译链接（浏览器跳转），使用'tr url 你的URL'进行设置，URL中用{q}表示搜索词，默认值`https://translate.volcengine.com/?text={q}`
## 支持的语言

支持火山引擎翻译API提供的所有语言，包括但不限于：

- 中文 (zh)
- 英语 (en)
- 日语 (ja)
- 韩语 (ko)
- 法语 (fr)
- 德语 (de)
- 俄语 (ru)
- 西班牙语 (es)

更多语言支持请参考[火山引擎翻译文档](https://www.volcengine.com/docs/4640/35107)。 