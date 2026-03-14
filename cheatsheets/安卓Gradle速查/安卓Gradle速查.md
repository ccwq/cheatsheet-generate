---
title: 安卓 Gradle 速查
lang: bash
version: "AGP 9.1 / Gradle 9.1"
date: 2026-03-12
github: unknown
colWidth: 380px
---

# 安卓 Gradle 速查

## 🧭 快速定位
---
lang: bash
emoji: 🧭
link: https://developer.android.com/build/gradle-build-overview
desc: 先分清 Android Gradle Plugin、Gradle 和 Wrapper 的职责，再决定该改哪个文件。
---

- `gradlew` : 项目内固定入口，优先于本机 `gradle`
- `AGP` : Android Gradle Plugin，负责 `android {}` DSL、变体、打包与签名
- `Gradle` : 构建引擎，负责任务图、依赖解析、缓存、并行执行
- `settings.gradle(.kts)` : 声明模块、仓库、版本目录、插件仓库
- `build.gradle(.kts)` : 模块构建脚本，声明插件、Android DSL、依赖
- `gradle.properties` : 全局性能参数、开关和 JVM 配置
- `libs.versions.toml` : 推荐放依赖版本与插件别名

### 升级判断
- 先看 `gradle/wrapper/gradle-wrapper.properties` : 当前 Gradle 版本
- 再看模块 `plugins {}` : 当前 AGP / Kotlin 插件版本
- 升级前先查 AGP release notes : 避免 JDK、Gradle、compileSdk 不兼容

```bash
# 看当前 Wrapper 版本
cat gradle/wrapper/gradle-wrapper.properties

# 看可执行任务
./gradlew tasks

# 看构建环境
./gradlew -version
```

## 📦 Wrapper 与版本对齐
---
lang: properties
emoji: 📦
link: https://docs.gradle.org/current/userguide/gradle_wrapper.html
desc: Wrapper 负责把团队构建环境钉死；Android 项目升级优先改 Wrapper，再改 AGP 和 Kotlin。
---

- `./gradlew wrapper --gradle-version 9.1.0` : 升级 Wrapper
- `distributionUrl=` : 真正控制下载哪个 Gradle 发行版
- `bin` : 仅运行时需要，体积更小
- `all` : 包含源码和文档，适合 IDE 更完整索引

```properties
# gradle/wrapper/gradle-wrapper.properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-9.1.0-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

### 经验规则
- AGP、Gradle、JDK 需要成套升级，不要只改其中一个
- CI 和本地都只跑 `./gradlew`，不要直接跑系统 `gradle`
- 多人项目升级时，把 `wrapper` 脚本和 properties 一起提交

## 🏗️ settings 与插件入口
---
lang: kotlin
emoji: 🏗️
link: https://developer.android.com/build
desc: 现代 Android 项目优先用 Kotlin DSL、插件块和版本目录，减少散落版本号。
---

- `pluginManagement {}` : 插件仓库与解析策略
- `dependencyResolutionManagement {}` : 依赖仓库策略
- `repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)` : 禁止子模块乱配仓库
- `include(":app", ":core", ":feature:login")` : 声明模块

```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MyApp"
include(":app", ":core", ":feature:login")
```

```toml
# gradle/libs.versions.toml
[versions]
agp = "9.1.0"
kotlin = "2.2.20"
androidx-core = "1.17.0"

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }

[libraries]
androidx-core-ktx = { module = "androidx.core:core-ktx", version.ref = "androidx-core" }
```

## 🤖 Android DSL 核心块
---
lang: kotlin
emoji: 🤖
link: https://developer.android.com/build/configure-app-module
desc: `android {}` 里最常改的是 SDK、命名空间、默认配置、构建类型和编译选项。
---

- `namespace` : AGP 8+ 推荐明确声明
- `compileSdk` : 决定能编译到的 API level
- `minSdk` : 决定可安装最低版本
- `targetSdk` : 影响运行时行为兼容策略
- `buildFeatures` : 开启 Compose、BuildConfig、ViewBinding 等
- `packaging` : 处理资源冲突

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.example.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.app"
        minSdk = 24
        targetSdk = 36
        versionCode = 12
        versionName = "1.2.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        buildConfig = true
        viewBinding = true
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
```

## 📚 依赖与版本目录
---
lang: kotlin
emoji: 📚
link: https://developer.android.com/build/dependencies
desc: Android 项目最容易失控的是版本漂移和错误暴露，版本目录与依赖配置要一起用。
---

- `implementation` : 对外不暴露，默认首选
- `api` : 暴露给依赖当前模块的上游模块
- `compileOnly` : 编译需要，打包不带
- `runtimeOnly` : 运行需要，编译不需要
- `testImplementation` : 单元测试依赖
- `androidTestImplementation` : 设备 / 模拟器测试依赖
- `debugImplementation` : 仅 debug 变体使用

```kotlin
dependencies {
    implementation(project(":core"))
    implementation(libs.androidx.core.ktx)

    debugImplementation("androidx.compose.ui:ui-tooling")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.3.0")
}
```

### 常见误区
- 基础库默认用 `implementation`，不是 `api`
- 版本不要散落在多个模块，统一提到 `libs.versions.toml`
- 仓库声明尽量只留在 `settings.gradle(.kts)`

## 🧩 变体、风味与多模块
---
lang: kotlin
emoji: 🧩
link: https://developer.android.com/build/build-variants
desc: 变体组合来自 `buildTypes × productFlavors`，命名、签名和资源覆盖都跟这个组合走。
---

- `buildTypes` : `debug` / `release` 行为差异
- `productFlavors` : 免费版、企业版、国内版等业务差异
- `flavorDimensions` : 风味维度必须声明
- `sourceSets` : 为特定变体追加代码和资源目录

```kotlin
android {
    flavorDimensions += "tier"

    productFlavors {
        create("free") {
            dimension = "tier"
            applicationIdSuffix = ".free"
            versionNameSuffix = "-free"
        }
        create("pro") {
            dimension = "tier"
        }
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            isMinifyEnabled = false
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

```bash
# 常用变体任务命名规则
./gradlew assembleFreeDebug
./gradlew bundleProRelease
./gradlew installFreeDebug
```

## ▶️ 高频任务与日常命令
---
lang: bash
emoji: ▶️
link: https://docs.gradle.org/current/userguide/command_line_interface.html
desc: Android 项目日常主要围绕 assemble、bundle、install、test、lint、dependencies 这些任务。
---

- `./gradlew help` : 看入口帮助
- `./gradlew projects` : 看模块树
- `./gradlew tasks --all` : 看全部任务
- `./gradlew clean assembleDebug` : 清理并打 debug 包
- `./gradlew bundleRelease` : 打 AAB
- `./gradlew installDebug` : 安装到设备
- `./gradlew testDebugUnitTest` : 跑 JVM 单测
- `./gradlew connectedDebugAndroidTest` : 跑仪器测试
- `./gradlew lintDebug` : 跑 Lint
- `./gradlew app:dependencies` : 查看依赖树

```bash
# 只构建某个模块
./gradlew :app:assembleDebug

# 并行和构建缓存一起开
./gradlew assembleDebug --parallel --build-cache

# 输出 Build Scan（团队允许时）
./gradlew assembleRelease --scan
```

## 🔐 签名、发布与产物
---
lang: kotlin
emoji: 🔐
link: https://developer.android.com/build/build-variants#signing
desc: 发布版最关键的是签名凭据隔离、AAB 产物和混淆配置，不要把密码硬编码进仓库。
---

- `signingConfigs` : 定义 keystore 和密码来源
- `bundleRelease` : Google Play 首选产物
- `assembleRelease` : 传统 APK 产物
- `mapping.txt` : 混淆后排查崩溃必须保留

```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("release.keystore")
            storePassword = System.getenv("STORE_PASSWORD")
            keyAlias = System.getenv("KEY_ALIAS")
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            isShrinkResources = true
        }
    }
}
```

```proguard
# 仅示例：放行反射和序列化常用项
-keepattributes Signature,*Annotation*
-keep class kotlinx.serialization.** { *; }
-keep class com.google.gson.** { *; }
```

## ⚡ 性能优化与诊断
---
lang: properties
emoji: ⚡
link: https://developer.android.com/build/optimize-your-build
desc: 先优化构建输入，再开并行与缓存；最后用 profile、build scan、依赖树定位瓶颈。
---

- `org.gradle.caching=true` : 开启本地构建缓存
- `org.gradle.parallel=true` : 多模块并行
- `org.gradle.configuration-cache=true` : 兼容时优先开启
- `org.gradle.jvmargs=` : 给 Daemon 足够堆内存
- `--profile` : 生成 HTML 性能报告
- `--stacktrace --info` : 定位失败原因

```properties
# gradle.properties
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=1g -Dfile.encoding=UTF-8
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.configuration-cache=true
android.useAndroidX=true
```

```bash
# 生成构建性能报告
./gradlew :app:assembleDebug --profile

# 看哪个任务拖慢构建
./gradlew :app:assembleDebug --scan

# 排查依赖冲突
./gradlew :app:dependencyInsight --dependency okhttp --configuration debugRuntimeClasspath
```

## 🩺 常见坑与排障
---
lang: bash
emoji: 🩺
link: https://developer.android.com/build/build-troubleshooting
desc: 先判断是版本兼容问题、缓存问题、仓库问题还是签名 / SDK 配置问题，再决定清理范围。
---

- `Unsupported class file major version` : JDK 太新或太旧，先查 AGP 支持范围
- `Namespace not specified` : AGP 8+ 模块缺少 `namespace`
- `SDK location not found` : 缺 `local.properties` 或环境变量未配置
- `Duplicate class` / `Duplicate resources` : 先看依赖冲突，再看 `packaging`
- `Could not resolve` : 仓库缺失、离线模式、代理或镜像问题
- `Configuration cache` 失败 : 某些旧插件还不兼容，先临时关闭验证

```bash
# 最小化清理：优先清本模块
./gradlew :app:clean

# 彻底重建依赖缓存（代价大）
./gradlew --refresh-dependencies assembleDebug

# 排查配置阶段问题
./gradlew help --stacktrace --info
```
