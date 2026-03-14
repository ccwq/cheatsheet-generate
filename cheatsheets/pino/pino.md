---
title: Pino 速查表
lang: javascript
version: 10.3.1
date: 2026-02-09
github: pinojs/pino
colWidth: 340px
---

# Pino 速查表

Pino 是面向 Node.js 的高性能结构化日志库，默认输出 JSON，适合生产环境日志采集、管道转发与上下文绑定。

## 🚀 基础创建与级别
---
link: https://github.com/pinojs/pino/blob/main/docs/api.md
desc: 先确定实例创建、日志级别和对象日志写法，再扩展 transport 与上下文。
---

```javascript
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info'
})

logger.info('service started')
logger.error({ err: new Error('boom') }, 'request failed')
```

```javascript
logger.level = 'debug'

if (logger.isLevelEnabled('trace')) {
  logger.trace({ feature: 'search' }, 'trace message')
}
```

```javascript
const auditLogger = pino({
  customLevels: {
    audit: 35,
    security: 45
  }
})

auditLogger.audit({ actor: 'admin' }, 'permission changed')
```

## 🧩 字段格式化与序列化
---
link: https://github.com/pinojs/pino/blob/main/docs/api.md#options
desc: 用 `formatters`、`serializers`、字段键名配置对接日志平台字段约定。
---

```javascript
const logger = pino({
  messageKey: 'message',
  errorKey: 'error',
  nestedKey: 'payload',
  formatters: {
    level(label, number) {
      return { level: number, severity: label }
    },
    bindings(bindings) {
      return { pid: bindings.pid, host: bindings.hostname }
    }
  },
  serializers: {
    err: pino.stdSerializers.err
  }
})
```

## 🧵 Child Logger 与上下文
---
link: https://github.com/pinojs/pino/blob/main/docs/child-loggers.md
desc: 通过 `child()` 绑定请求、模块、租户等上下文，避免每次手写重复字段。
---

```javascript
const rootLogger = pino({ level: 'info' })
const requestLogger = rootLogger.child({
  requestId: 'req-42',
  module: 'billing'
})

requestLogger.info('request accepted')
console.log(requestLogger.bindings())
```

```javascript
requestLogger.setBindings({
  userId: 'u-1001'
})

requestLogger.warn({ retryable: true }, 'upstream timeout')
```

## 🔒 Redaction 脱敏
---
link: https://github.com/pinojs/pino/blob/main/docs/redaction.md
desc: 把口令、令牌、卡号等字段在输出前统一遮罩或直接移除。
---

```javascript
const logger = pino({
  redact: {
    paths: [
      'req.headers.authorization',
      'user.password',
      'payment.card.cvv',
      'items[*].secret'
    ],
    censor: '[REDACTED]'
  }
})
```

```javascript
const logger = pino({
  redact: {
    paths: ['token', 'profile.ssn'],
    remove: true
  }
})
```

## 🚚 Transport 与输出管道
---
link: https://github.com/pinojs/pino/blob/main/docs/transports.md
desc: 生产环境优先用 `pino.transport()` 把格式化、分流、落盘放到 worker 线程。
---

```javascript
const transport = pino.transport({
  targets: [
    {
      level: 'info',
      target: 'pino/file',
      options: { destination: './logs/app.log', mkdir: true }
    },
    {
      level: 'error',
      target: 'pino/file',
      options: { destination: './logs/error.log', mkdir: true }
    }
  ]
})

const logger = pino(transport)
```

```javascript
const transport = pino.transport({
  pipeline: [
    { target: 'pino-pretty', options: { colorize: true } }
  ]
})

const logger = pino({ level: 'debug' }, transport)
```

## 💾 Destination 与 flush
---
link: https://github.com/pinojs/pino/blob/main/docs/asynchronous.md
desc: 直接写文件时用 `destination()`，需要确保进程退出前适时 `flush()`。
---

```javascript
const destination = pino.destination({
  dest: './logs/runtime.log',
  minLength: 4096,
  sync: false
})

const logger = pino(destination)
logger.info('queued')
logger.flush()
```

## 🌐 Browser 与前端转发
---
link: https://github.com/pinojs/pino/blob/main/docs/browser.md
desc: 浏览器模式适合统一前后端日志接口，或将 warn/error 转发到远端采集端。
---

```javascript
const logger = pino({
  browser: {
    asObject: true,
    transmit: {
      level: 'warn',
      send(level, logEvent) {
        navigator.sendBeacon('/log', JSON.stringify({ level, logEvent }))
      }
    }
  }
})
```

## 🌍 Web 框架接入
---
link: https://github.com/pinojs/pino/blob/main/docs/web.md
desc: 与 Fastify、`pino-http` 配合时，重点是请求日志、上下文继承和敏感字段脱敏。
---

```javascript
import Fastify from 'fastify'

const app = Fastify({
  logger: {
    level: 'info',
    redact: ['req.headers.authorization']
  }
})

app.get('/health', async (request) => {
  request.log.info('health check')
  return { ok: true }
})
```

```javascript
import express from 'express'
import pinoHttp from 'pino-http'

const app = express()
app.use(pinoHttp())

app.get('/', (req, res) => {
  req.log.info({ route: '/' }, 'handled')
  res.end('ok')
})
```

## 🧪 Diagnostics 与排障
---
link: https://github.com/pinojs/pino/blob/main/docs/diagnostics.md
desc: 诊断通道可以观测内部序列化阶段，适合调试格式化或性能问题。
---

```javascript
import diagnosticsChannel from 'node:diagnostics_channel'

const start = diagnosticsChannel.channel('tracing:pino_asJson:start')
const end = diagnosticsChannel.channel('tracing:pino_asJson:end')

start.subscribe((message) => {
  console.log('serialize start', message.arguments)
})

end.subscribe((message) => {
  console.log('serialize end', message.result)
})
```

## ⚠️ 生产使用要点
---
desc: JSON 原始日志保留给机器消费，开发态再接 `pino-pretty` 或专用 transport 做展示。
---

- 避免在热路径里手动 `JSON.stringify()`，直接把对象交给 Pino。
- 结构化字段应保持稳定命名，例如 `requestId`、`userId`、`service`。
- 开发态可接 `pino-pretty`，生产态优先输出原始 JSON 给采集器。
- 退出前如果使用异步 destination 或 transport，要确认日志已 flush。
