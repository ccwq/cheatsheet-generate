# Streamlit 官方参考资源映射 (Refmap)

## 核心文档入口
- [Streamlit Docs Home](https://docs.streamlit.io/) - 官方文档首页
- [API Reference](https://docs.streamlit.io/develop/api-reference) - 全部 API 清单 (带搜索)
- [Official Cheat Sheet](https://docs.streamlit.io/develop/quick-reference/cheat-sheet) - 官方版精简速查 (v1.54.0)
- [App Gallery](https://streamlit.io/gallery) - 社区示例与灵感源泉

## 核心概念与原理
- [Execution Flow](https://docs.streamlit.io/get-started/fundamentals/main-concepts#run-your-app-from-top-to-bottom) - 理解 Streamlit 的“重跑”思维
- [Caching](https://docs.streamlit.io/develop/concepts/architecture/caching) - 性能优化核心：st.cache_data / st.cache_resource
- [Session State](https://docs.streamlit.io/develop/concepts/architecture/session-state) - 跨重跑的状态持久化
- [Widget Behavior](https://docs.streamlit.io/develop/concepts/architecture/widget-behavior) - 深入理解 Widget 的 key 与重跑逻辑

## 进阶与工程化
- [Multipage Apps](https://docs.streamlit.io/develop/concepts/multipage-apps) - 多页面应用结构与 st.navigation
- [App Testing](https://docs.streamlit.io/develop/api-reference/app-testing) - 使用 AppTest 编写单元测试
- [Configuration](https://docs.streamlit.io/develop/api-reference/configuration/config.toml) - config.toml 配置详单
- [Connect to Data](https://docs.streamlit.io/develop/api-reference/connections) - 数据库与外部 API 连接器 (st.connection)

## LLM & 聊天集成
- [Build Chat Apps](https://docs.streamlit.io/develop/tutorials/llms/build-conversational-apps) - 聊天机器人 UI 构建教程
- [Chat Elements API](https://docs.streamlit.io/develop/api-reference/chat) - st.chat_message / st.chat_input 参考
- [Streaming](https://docs.streamlit.io/develop/api-reference/write-magic/st.write_stream) - st.write_stream：流式文本展示

## 工具与生态
- [Command Line Reference](https://docs.streamlit.io/develop/api-reference/cli) - CLI 常用命令与 Flag
- [Components Gallery](https://streamlit.io/components) - 扩展 Streamlit 功能的三方组件
- [Streamlit Cloud](https://docs.streamlit.io/deploy/streamlit-community-cloud) - 免费部署与分享应用
