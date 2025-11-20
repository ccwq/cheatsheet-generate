# Vite 配置速查表

## 配置文件基础

### 配置文件命名
```js
// vite.config.js (基础)
vite.config.ts
vite.config.mjs
vite.config.cjs
```

### 指定配置文件
```bash
vite --config my-config.js
```

### 基础配置结构
```js
export default {
  // 配置选项
}
```

## 配置智能提示

### JSDoc 类型提示
```js
/** @type {import('vite').UserConfig} */
export default {
  // 配置内容
}
```

### defineConfig 助手函数
```js
import { defineConfig } from 'vite'
export default defineConfig({
  // 配置内容
})
```

### TypeScript 配置文件
```ts
import type { UserConfig } from 'vite'
export default {
  // 配置内容
} satisfies UserConfig
```

## 条件配置

### 基于命令的条件配置
```js
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // 开发环境特定配置
      server: {
        port: 3000
      }
    }
  } else {
    return {
      // 构建环境特定配置
      build: {
        minify: 'terser'
      }
    }
  }
})
```

### 常用条件判断
```js
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  return {
    // 开发环境
    devOnly: command === 'serve',
    // 生产环境构建
    prodBuild: command === 'build' && mode === 'production',
    // SSR 构建
    ssr: isSsrBuild,
    // 预览模式
    preview: isPreview
  }
})
```

## 异步配置

### 异步函数配置
```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // 使用异步数据
    define: {
      __ASYNC_DATA__: JSON.stringify(data)
    }
  }
})
```

## 环境变量使用

### 加载环境变量
```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 基于模式加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    server: {
      port: env.APP_PORT ? Number(env.APP_PORT) : 5173,
    },
  }
})
```

### 环境变量作用域
```js
export default defineConfig(({ mode }) => {
  // 加载所有环境变量（不限制 VITE_ 前缀）
  const env = loadEnv(mode, process.cwd(), '')

  // 仅加载 VITE_ 前缀的环境变量
  const viteEnv = loadEnv(mode, process.cwd())

  return {
    // 配置内容
  }
})
```

## 核心配置选项

### 项目配置
```js
export default defineConfig({
  // 项目根目录
  root: './src',
  // 环境变量目录
  envDir: './env',
  // 基础公共路径
  base: '/my-app/',
  // 模式
  mode: 'development',
  // 配置文件目录
  configFile: 'my-vite.config.js',
})
```

### 服务器配置
```js
export default defineConfig({
  server: {
    // 开发服务器端口
    port: 5173,
    // 自动打开浏览器
    open: true,
    // CORS 配置
    cors: true,
    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 构建配置
```js
export default defineConfig({
  build: {
    // 输出目录
    outDir: 'dist',
    // 静态资源目录
    assetsDir: 'assets',
    // 压缩方式
    minify: 'terser',
    // 生成 source map
    sourcemap: true,
    // 构建目标
    target: 'es2015',
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router']
        }
      }
    }
  }
})
```

### 插件配置
```js
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    // 自定义插件
    {
      name: 'my-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // 自定义中间件
          next()
        })
      }
    }
  ]
})
```

## 高级配置

### 路径别名
```js
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  }
})
```

### CSS 配置
```js
export default defineConfig({
  css: {
    // CSS 预处理器配置
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";'
      }
    },
    // PostCSS 配置
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('tailwindcss')
      ]
    }
  }
})
```

### 依赖优化
```js
export default defineConfig({
  optimizeDeps: {
    // 强制预构建依赖
    include: ['vue', 'vue-router', 'axios'],
    // 排除预构建
    exclude: ['@tensorflow/tfjs'],
    // 添加需要转换的依赖
    force: true
  }
})
```

## 调试配置

### VS Code 调试配置
```json
{
  "debug.javascript.terminalOptions": {
    "resolveSourceMapLocations": [
      "${workspaceFolder}/**",
      "!**/node_modules/**",
      "**/node_modules/.vite-temp/**"
    ]
  }
}
```

### 配置加载器选项
```bash
# 使用模块运行器（推荐用于 monorepo）
vite --configLoader runner

# 使用原生运行器
vite --configLoader native

# 默认使用 bundle 方式
vite --configLoader bundle
```

## 常用配置模板

### Vue 3 项目
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
```

### React 项目
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
```

### TypeScript 项目
```js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@types': resolve(__dirname, 'src/types')
    }
  },
  server: {
    port: 5173
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
})
```

## 环境变量和模式

### 环境变量文件优先级
```
.env                # 所有环境
.env.local          # 所有环境，本地优先
.env.[mode]         # 特定模式
.env.[mode].local   # 特定模式，本地优先
```

### 环境变量在应用中使用
```js
// 仅限 VITE_ 前缀的变量暴露给客户端
console.log(import.meta.env.VITE_API_URL)

// 在配置中访问所有环境变量
const env = loadEnv(mode, process.cwd(), '')
console.log(env.DATABASE_URL)
```

### 常用环境变量
```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true

# .env.production
VITE_API_URL=https://api.example.com
VITE_DEBUG=false
```

## 插件开发

### 简单插件示例
```js
export default function myPlugin() {
  return {
    name: 'my-plugin',
    // 钩子函数
    config(config, { command }) {
      // 配置钩子
      return {
        // 返回配置合并
      }
    },
    configResolved(resolvedConfig) {
      // 配置解析完成钩子
    },
    configureServer(server) {
      // 服务器配置钩子
      server.middlewares.use((req, res, next) => {
        next()
      })
    },
    transform(code, id) {
      // 代码转换钩子
      if (id.endsWith('.vue')) {
        // 转换 Vue 文件
        return code.replace(/foo/g, 'bar')
      }
    }
  }
}
```

## 性能优化配置

### 构建性能优化
```js
export default defineConfig({
  build: {
    // 减少内存使用
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
    // 并行处理
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### 开发性能优化
```js
export default defineConfig({
  server: {
    fs: {
      // 限制文件系统访问范围
      strict: false
    },
    hmr: {
      // 热更新配置
      overlay: true
    }
  },
  optimizeDeps: {
    // 预构建优化
    force: true,
    include: ['vue', 'vue-router']
  }
})
```