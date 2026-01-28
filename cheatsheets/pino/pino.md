# Pino 速查表

Pino 是 Node.js 高性能结构化日志库，默认输出 NDJSON，适合生产环境与日志管道处理。

## 基础创建与日志方法

```javascript
// 创建 logger
const pino = require('pino')
const logger = pino()

// 基础日志方法
logger.info('hello')
logger.error({ err }, 'request failed')
```

## 日志级别与自定义级别

```javascript
// 设置最小输出级别
logger.level = 'debug'

// 判断级别是否启用
if (logger.isLevelEnabled('trace')) {
  logger.trace('trace message')
}
```

```javascript
// 自定义级别
const logger = pino({
  customLevels: { audit: 35, security: 45 },
  useOnlyCustomLevels: false
})
```

## 结构化字段与格式化

```javascript
const logger = pino({
  formatters: {
    level (label, number) {
      return { level: number, levelLabel: label }
    },
    bindings (bindings) {
      return { pid: bindings.pid }
    },
    log (obj) {
      return { ...obj, service: 'edge' }
    }
  },
  serializers: {
    err: pino.stdSerializers.err
  }
})
```

```javascript
// 控制字段键名
const logger = pino({
  messageKey: 'msg',
  errorKey: 'err',
  nestedKey: 'payload'
})
```

## 子日志与绑定

```javascript
// 创建 child logger
const child = logger.child({ module: 'user' })
child.info('loaded')

// 读取与追加绑定
const bindings = child.bindings()
child.setBindings({ requestId: 'req-1' })
```

## Redaction 数据脱敏

```javascript
// 指定脱敏路径与遮罩
const logger = pino({
  redact: {
    paths: ['user.password', 'card["cvv"]', 'items[*].secret'],
    censor: '[Redacted]'
  }
})
```

```javascript
// 直接移除字段
const logger = pino({
  redact: {
    paths: ['token'],
    remove: true
  }
})
```

## Destination 与异步写入

```javascript
const dest = pino.destination({
  dest: './logs/app.log',
  minLength: 4096,
  sync: false
})
const logger = pino(dest)

// 定期 flush
logger.flush()
```

## Transport 与多路输出

```javascript
const transport = pino.transport({
  targets: [
    { level: 'info', target: 'pino-pretty' },
    { level: 'error', target: 'pino/file', options: { destination: './logs/error.log' } }
  ]
})
const logger = pino(transport)
```

```javascript
// Pipeline 组合
const transport = pino.transport({
  pipeline: [
    { target: 'pino-syslog' },
    { target: 'pino-socket' }
  ]
})
```

## Browser API

```javascript
const logger = pino({
  browser: {
    asObject: true,
    reportCaller: true,
    serialize: ['custom'],
    write: (obj) => {
      // 自定义输出
    }
  }
})
```

```javascript
const logger = pino({
  browser: {
    transmit: {
      level: 'warn',
      send (level, logEvent) {
        // 发送到采集端
      }
    }
  }
})
```

## Web 框架接入

```javascript
// Fastify 内置 logger
const fastify = require('fastify')({ logger: true })
fastify.get('/', async (req, reply) => {
  req.log.info('request')
  return { ok: true }
})
```

```javascript
// Express / Node http（pino-http）
const pinoHttp = require('pino-http')()
app.use(pinoHttp)
app.get('/', (req, res) => {
  req.log.info('hit')
  res.end('ok')
})
```

## Diagnostics 观测

```javascript
const dc = require('diagnostics_channel')

const start = dc.channel('tracing:pino_asJson:start')
const end = dc.channel('tracing:pino_asJson:end')

start.subscribe((message) => {
  // message.instance / message.arguments
})

end.subscribe((message) => {
  // message.result
})
```

## Pretty Printing

```javascript
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})
```
