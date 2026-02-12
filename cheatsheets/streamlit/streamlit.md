# Streamlit 速查表 (精简 Markdown 版)

> 面向初学者与资深用户，专注于核心 API、工程化实践与 LLM 集成。

## 1. 运行模型与页面骨架
- `st.set_page_config(page_title=..., layout="wide")`：必须放在脚本首行。
- **重跑机制**：任何 widget 交互或代码变动都会触发脚本自上而下重新执行。
- `st.stop()`：提前退出执行。
- `st.rerun()`：手动触发重跑。

```python
import streamlit as st
st.set_page_config(page_title="Dashboard", layout="wide")
st.title("My App")
```

## 2. 文本与“Magic”
- **Magic Commands**：单行变量/字符串会自动调用 `st.write()`。
- `st.write()`：万能渲染器，支持 Markdown、数据框、图表。
- `st.markdown()` / `st.latex()` / `st.code()` / `st.html()`。

## 3. 输入控件 Widgets
- **常用**：`st.button`, `st.download_button`, `st.checkbox`, `st.radio`, `st.selectbox`, `st.multiselect`, `st.slider`, `st.text_input`, `st.number_input`, `st.date_input`, `st.file_uploader`, `st.color_picker`。
- `key=`：跨重跑标识 widget，循环或动态 UI 必须显式指定且唯一。
- `on_change`/`on_click`：注册回调函数处理状态更新。

## 4. 布局与容器
- `st.sidebar`：侧边栏容器。
- `st.columns(n)`：水平分栏。
- `st.tabs(["Tab 1", ...])`：标签页切换。
- `st.expander("Label")`：可折叠区域。
- `st.container()` / `st.empty()`：占位容器，`st.empty` 可用于动态刷新同一位置内容。

## 5. Session State (跨重跑状态)
- `st.session_state`：像字典一样操作，持久化跨重跑的变量。
- **初始化**：`if "key" not in st.session_state: st.session_state.key = value`。
- **坑点**：不可通过 session_state 修改 `st.button` 或 `st.file_uploader` 的值。

## 6. 性能优化与缓存
- `@st.cache_data`：缓存函数输出结果（数据/序列化对象），支持 `ttl`, `max_entries`。
- `@st.cache_resource`：缓存单例资源（数据库连接/模型/客户端）。
- **参数前缀 `_`**：`def func(_db, param)` 中 `_db` 不参与 hash 校验。

## 7. 数据与图表 (含交互)
- **数据**：`st.dataframe()` (支持过滤/排序), `st.table()` (静态), `st.data_editor()` (可直接编辑并返回结果)。
- **原生图表**：`st.line_chart`, `st.area_chart`, `st.bar_chart`, `st.map`。
- **三方集成**：`st.plotly_chart`, `st.altair_chart`, `st.pydeck_chart`。
- **事件捕捉**：`on_select="rerun"` 参数可捕获图表选择事件。

## 8. 多页应用
- **新版方式**：使用 `st.Page` 定义页面，`st.navigation` 统一驱动。
- **目录方式**：在根目录创建 `pages/` 文件夹，放置 `*.py` 文件。
- `st.switch_page("pages/foo.py")`：代码跳转。
- `st.page_link("pages/foo.py", label="Go")`：生成页面链接。

## 9. LLM & Chat (大模型集成)
- `st.chat_message("user" | "assistant")`：创建对话容器。
- `st.chat_input("Prompt...")`：固定在底部的对话输入。
- `st.write_stream(generator)`：流式展示 LLM 生成的文本。

```python
# 最小对话范式
if prompt := st.chat_input():
    with st.chat_message("user"): st.write(prompt)
    with st.chat_message("assistant"):
        response = st.write_stream(my_llm_stream(prompt))
```

## 10. CLI 常用命令
- `streamlit run app.py`：运行应用。
- `streamlit config show`：查看所有配置。
- `streamlit cache clear`：清除本地磁盘缓存。
- `streamlit hello`：运行官方演示程序。
