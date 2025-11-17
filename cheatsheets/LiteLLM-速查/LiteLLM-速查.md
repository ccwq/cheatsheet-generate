# LiteLLM 完整配置速查

## 核心配置结构

- `litellm_settings`：核心运行时与日志设置
- `general_settings`：通用代理与安全设置
- `router_settings`：路由、重试与降级策略
- `model_list`：模型定义与成本信息
- `environment_variables`：环境变量映射
- `callback_settings`：回调服务特定配置

## 模型配置

### 基础模型定义
```yaml
model_list:
  - model_name: gpt-4o
    litellm_params:
      model: gpt-4o
      api_key: os.environ/OPENAI_API_KEY
      rpm: 60
  - model_name: claude-3-5-sonnet
    litellm_params:
      model: anthropic/claude-3-5-sonnet-20240620
      api_key: os.environ/ANTHROPIC_API_KEY
```

### Azure OpenAI 配置
```yaml
model_list:
  - model_name: azure-gpt4
    litellm_params:
      model: azure/gpt-4
      api_base: https://your-resource.openai.azure.com/
      api_key: os.environ/AZURE_API_KEY
      api_version: 2024-02-15-preview
```

## 路由与负载均衡

### 高级路由配置
```yaml
router_settings:
  routing_strategy: usage-based-routing-v2
  enable_pre_call_checks: true
  cooldown_time: 30
  disable_cooldowns: false
  retry_policy:
    AuthenticationErrorRetries: 3
    TimeoutErrorRetries: 3
  fallbacks: [{"gpt-3.5-turbo": ["gpt-4"]}]
  model_group_alias: {"gpt-4": "gpt-3.5-turbo"}
```

### 负载均衡配置
```yaml
router_settings:
  load_balancing:
    strategy: "weighted_round_robin"
    weights:
      - model_name: gpt-4
        weight: 0.7
      - model_name: claude-3-opus
        weight: 0.3
```

## 缓存系统

### Redis 缓存配置
```yaml
litellm_settings:
  cache: true
  cache_params:
    type: redis
    host: localhost
    port: 6379
    password: your_password
    namespace: litellm.caching.caching
    ttl: 600
    qdrant_semantic_cache_embedding_model: openai-embedding
    similarity_threshold: 0.8
```

### S3 缓存配置
```yaml
cache_params:
  type: s3
  s3_bucket_name: cache-bucket-litellm
  s3_region_name: us-west-2
  s3_aws_access_key_id: os.environ/AWS_ACCESS_KEY_ID
  s3_aws_secret_access_key: os.environ/AWS_SECRET_ACCESS_KEY
```

## 安全与认证

### 基础安全配置
```yaml
general_settings:
  master_key: sk-xxx
  enable_jwt_auth: false
  key_management_system: google_kms
  use_google_kms: true
  disable_master_key_return: false
  allowed_ips: ["192.168.1.0/24"]
  allowed_routes: ["/v1/chat/completions", "/v1/embeddings"]
  admin_only_routes: ["/model/list", "/key/list"]
```

### 虚拟密钥配置
```yaml
general_settings:
  database_url: "postgresql://user:pass@localhost:5432/litellm"
  max_parallel_requests: 50
  global_max_parallel_requests: 200
```

## 回调与监控

### 监控配置
```yaml
litellm_settings:
  success_callback: ["langfuse", "openmeter"]
  failure_callback: ["sentry"]
  callbacks: ["otel"]
  service_callbacks: ["datadog", "prometheus"]
  turn_off_message_logging: false
  redact_user_api_key_info: false
  set_verbose: false
  json_logs: true
```

### Langfuse 配置
```yaml
litellm_settings:
  langfuse_default_tags: ["cache_hit", "user_api_key_alias"]
  langfuse_public_key: os.environ/LANGFUSE_PUBLIC_KEY
  langfuse_secret_key: os.environ/LANGFUSE_SECRET_KEY
```

## 环境变量

### 核心 API 密钥
- `OPENAI_API_KEY`：OpenAI 服务
- `ANTHROPIC_API_KEY`：Anthropic 服务
- `AZURE_API_KEY` / `AZURE_API_VERSION`：Azure OpenAI
- `GOOGLE_API_KEY`：Google AI / Gemini
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`：AWS 服务
- `GROQ_API_KEY`：Groq 高速推理
- `COHERE_API_KEY`：Cohere 服务
- `REPLICATE_API_KEY`：Replicate 服务
- `HUGGINGFACE_API_KEY`：HuggingFace 服务
- `LANGFUSE_SECRET_KEY`：Langfuse 追踪
- `DD_API_KEY`：Datadog 监控

## 可靠性配置

### 容错与重试
```yaml
litellm_settings:
  default_fallbacks: ["claude-opus"]
  content_policy_fallbacks: [{"gpt-3.5-turbo": ["claude-opus"]}]
  context_window_fallbacks: [{"gpt-3.5-turbo": ["gpt-4"]}]
  request_timeout: 60
  force_ipv4: false
  num_retries: 3
```

### 健康检查配置
```yaml
general_settings:
  background_health_checks: true
  health_check_interval: 300
  disable_health_checks: false
```

## Docker 部署

### 容器化部署
```yaml
version: "3.9"
services:
  litellm:
    image: ghcr.io/berriai/litellm:main-stable
    ports:
      - "4000:4000"
    volumes:
      - ./config.yaml:/app/config.yaml
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/litellm
      - LITELLM_MASTER_KEY=sk-1234
    command: ["--config", "/app/config.yaml", "--port", "4000", "--num_workers", "8"]
    depends_on:
      - db
```

## 集成配置

### Claude Code 配置
```bash
export ANTHROPIC_BASE_URL="http://0.0.0.0:4000"
export ANTHROPIC_AUTH_TOKEN="$LITELLM_MASTER_KEY"
```

### GitHub Copilot 配置
```json
{
  "github.copilot.advanced": {
    "debug.overrideProxyUrl": "http://localhost:4000",
    "debug.testOverrideProxyUrl": "http://localhost:4000"
  }
}
```

### AutoGen 配置
```python
config_list=[{
    "model": "my-fake-model",
    "api_base": "http://localhost:4000",
    "api_type": "open_ai",
    "api_key": "NULL"
}]
```

## 性能优化

### 并发控制
- `max_parallel_requests`：每部署最大并发
- `global_max_parallel_requests`：全局最大并发
- `num_workers`：工作进程数量
- `request_timeout`：请求超时时间
- `background_health_checks`：后台健康检查

### 性能配置示例
```yaml
general_settings:
  max_parallel_requests: 100
  global_max_parallel_requests: 500
  proxy_batch_write_at: 10
  proxy_batch_polling_interval: 3600
```

## 告警配置

### Slack 与 Email 告警
```yaml
general_settings:
  alerting: ["slack", "email"]
  alerting_threshold: 300
  alerting_args:
    slack_webhook_url: "https://hooks.slack.com/services/xxx"
    alert_channels:
      budget_alerts: "#budget-alerts"
      system_alerts: "#system-alerts"
  spend_report_frequency: "1d"
```

### 预算控制
```yaml
general_settings:
  budget_local: 100.0
  budget_duration: 30d
  budget_alert_buffer: 0.8
```

## 特殊功能

### Responses API 配置
```yaml
model_list:
  - model_name: openai/o1-pro
    litellm_params:
      model: openai/o1-pro
      api_key: os.environ/OPENAI_API_KEY
      reasoning_effort: "medium"
```

### MCP 工具服务器
```yaml
litellm_settings:
  mcp_aliases:
    github: github_mcp_server
    zapier: zapier_mcp_server
  mcp_servers:
    - name: github_mcp_server
      command: "npx"
      args: ["@modelcontextprotocol/server-github"]
```

### 内容过滤与安全
```yaml
litellm_settings:
  guardrails:
    - prompt_injection:
        callbacks: [lakera_prompt_injection]
        default_on: true
    - pii_masking:
        callbacks: [presidio]
        default_on: false
    - hide_secrets_guard:
        callbacks: [hide_secrets]
        default_on: false
```

## CLI 管理命令

### 服务器启动
```bash
litellm --config config.yaml
litellm --port 4000
litellm --num_workers 8
litellm --debug
```

### 密钥管理
```bash
export LITELLM_PROXY_URL=http://localhost:4000
export LITELLM_PROXY_API_KEY=sk-your-key

# 创建虚拟密钥
litellm create-key --max_budget 10.00 --duration 30d

# 查看使用统计
litellm spend --days 7
```

### 健康检查
```bash
curl http://localhost:4000/health

# 模型列表
curl http://localhost:4000/model/list \
  -H "Authorization: Bearer sk-your-master-key"
```

## 常见问题解决

### 连接超时
```yaml
litellm_settings:
  request_timeout: 120
  num_retries: 5
```

### API 限流
```yaml
model_list:
  - model_name: gpt-4
    litellm_params:
      model: gpt-4
      rpm: 60  # 请求每分钟
```