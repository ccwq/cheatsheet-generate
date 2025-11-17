# 安卓Gradle速查

## 环境搭建与Wrapper

**安装命令**
```bash
brew install gradle
gradle -v
```

**Wrapper初始化**
```bash
gradle wrapper --gradle-version 8.0
./gradlew tasks
```

**核心文件**
- gradlew：Unix/Linux脚本
- gradlew.bat：Windows批处理
- gradle/wrapper/：Wrapper Jar和属性

## 项目配置基础

**settings.gradle**
```groovy
rootProject.name = "MyApp"
include ":app", ":core", ":data"
```

**gradle.properties**
```properties
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m
org.gradle.parallel=true
org.gradle.caching=true
android.useAndroidX=true
```

**local.properties**
```properties
sdk.dir=/Users/username/Library/Android/sdk
ndk.dir=/Users/username/Library/Android/sdk/ndk/25.1.8937393
```

## 构建脚本DSL

**Groovy DSL**
```groovy
android {
    compileSdk 34
    defaultConfig {
        applicationId "com.example.app"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
}
```

**Kotlin DSL**
```kotlin
android {
    compileSdk = 34
    defaultConfig {
        applicationId = "com.example.app"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
}
```

## 插件应用

**Groovy插件声明**
```groovy
plugins {
    id 'com.android.application' version '8.1.0'
    id 'kotlin-android' version '1.9.0'
}
```

**Kotlin DSL插件声明**
```kotlin
plugins {
    id("com.android.application") version "8.1.0"
    kotlin("android") version "1.9.0"
}
```

**Legacy方式**
```groovy
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
```

**插件类型**
- com.android.application：应用模块
- com.android.library：库模块
- com.android.test：测试模块

## 依赖管理

**仓库配置**
```groovy
repositories {
    google()
    mavenCentral()
}
```

**依赖范围**
- implementation：编译时依赖，不暴露给使用者
- api：编译时依赖，暴露给使用者
- compileOnly：仅编译时使用
- runtimeOnly：仅运行时使用
- kapt/annotationProcessor：注解处理器
- testImplementation：测试依赖
- androidTestImplementation：Android测试依赖

## 任务系统

**自定义任务**
```groovy
task copyAssets(type: Copy) {
    from 'src/main/assets'
    into "$buildDir/outputs/assets"
    description 'Copy assets to build directory'
}

task cleanBuildDir(type: Delete) {
    delete rootProject.buildDir
}
```

**常用命令**
```bash
./gradlew clean
./gradlew assembleDebug
./gradlew assembleRelease
./gradlew installDebug
./gradlew connectedAndroidTest
```

**任务依赖**
```groovy
assembleDebug.dependsOn 'copyAssets'
```

## 生命周期阶段

**三阶段**
1. 初始化：解析settings.gradle，创建项目实例
2. 配置：执行所有构建脚本，构建任务图
3. 执行：执行选定的任务

**钩子**
```groovy
tasks.named('assembleDebug') {
    doFirst {
        println '开始构建Debug版本'
    }
    doLast  {
        println '构建完成'
    }
}
```

## 多模块项目

**模块声明**
```groovy
// settings.gradle.kts
include(":app")
include(":core")
include(":data")
include(":feature:login")
include(":feature:profile")
```

**模块间依赖**
```groovy
// app/build.gradle.kts
dependencies {
    implementation(project(":core"))
    implementation(project(":data"))
    implementation(project(":feature:login"))
}
```

## 构建变体与风味

**构建类型**
```groovy
buildTypes {
    debug {
        applicationIdSuffix ".debug"
        debuggable true
        minifyEnabled false
    }
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }
}
```

**产品风味**
```groovy
flavorDimensions = "version"
productFlavors {
    free {
        dimension "version"
        applicationIdSuffix ".free"
    }
    pro {
        dimension "version"
        applicationIdSuffix ".pro"
    }
}
```

## 性能优化

**gradle.properties**
```properties
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.caching=true
org.gradle.daemon=true
org.gradle.jvmargs=-Xmx4g
```

**构建缓存**
- 本地缓存：org.gradle.caching=true
- 远程缓存：配置HTTP缓存服务器
- 任务输出缓存：避免重复执行输入相同的任务

## 调试与诊断

**日志级别**
```bash
./gradlew build --info
./gradlew build --debug
./gradlew build --stacktrace
./gradlew build --scan
```

**构建分析**
```bash
./gradlew assembleDebug --profile
./gradlew tasks --all
./gradlew app:dependencies
```

## 签名配置

**签名声明**
```groovy
signingConfigs {
    release {
        storeFile file('release.keystore')
        storePassword System.getenv("STORE_PASSWORD")
        keyAlias System.getenv("KEY_ALIAS")
        keyPassword System.getenv("KEY_PASSWORD")
    }
}
```

## 代码混淆与压缩

**混淆配置**
```groovy
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        android.enableR8.fullMode = true
    }
}
```

**proguard规则**
```proguard
# 保持实体类
-keep class com.example.app.model.** { *; }

# 保持注解
-keepattributes *Annotation*

# 保持Gson使用
-keepattributes Signature
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
```