---
title: Upgrade Cocos Creator Android project
date: 2021-06-07
author: hugo
tags:
    creator, android
---

## 前言

这里主要是介绍如果把 Cocos Creator 的 Andorid 导出工程的编译配置升级.

## 为什么

为什么要升级了, 默认导出不能用吗, 肯定是可以用的. 但是当你想在导出工程上集成一些第三方插件时, 它们必须要 android build tool 多少版本以上, 工程中必须要用 enable androidx, 那就必须要升级工程配置了.

## 升级步骤

以下以 Cocos Creator 2.4.5 的导出工程为准来依次给出步骤与方法. 

* Cocos Creator 2.x 其它版本其实是差不多的, 基本可以直接套用
* Cocos Creator 3.x 的导出工程结构有一个定的变化, 但是以下步骤中的文件内容都是有的, 只是路径不太一样, 实际修改不会变.

在以下的步骤中, 我会列出要修改的文件, 修改文件的内容, 在其中带 `为升级作的修改` 标识的行就是为升级而作的修改, 其它行是为了好定位修改行的位置或附带的帮助开发的作用(比如 aliyun 镜像这样的标志).

### Android tool build

路径: proj.android-studio/build.gradle

修改: 将 android tools build 版本修改为 4.1.1

```gradle
buildscript {

    repositories {
        maven { url 'https://maven.aliyun.com/repository/public/' }   // 使用 ailun 镜像
        maven { url 'https://maven.aliyun.com/repository/google/' }  // 使用 ailun 镜像
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin/' }  // 使用 ailun 镜像
        google()
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:4.1.1'  // 为升级作的修改
    }
}

allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/public/' }         // 使用 ailun 镜像
        maven { url 'https://maven.aliyun.com/repository/google/' }         // 使用 ailun 镜像
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin/' }  // 使用 ailun 镜像
        google()
        jcenter()
        flatDir {
            dirs 'libs'
        }
    }
}
```

### Gradle Wrapper

基本这里的版本是要匹配上一步中的 android tool build 的, 如果你在 Android Studio 中的话, 就会提示你 gradel-wrapper 中的版本不对,需要升级.

路径: `proj.android-studio/gradle/wrapper/gradle-wrapper.properties`

修改: 将 gradle 版本修改为 6.5

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-6.5-bin.zip # 为升级作的修改
```

### Gradle Settings

在 Cocos Creator 中导出的 Android Studio 工程其实有两个 Target , 一个是 Instantapp , 一个是你的工程名.
instantapp 是 google 推出的一种叫免安装打包方式, 对包体是有大小限制的
另一个就是我们平常打包 apk 最常用到的.

这里我会把 instantapp 去掉, 一般很少打这个原生包.

路径: `proj.android-studio/settings.gradle`

修改: 去掉 `,':game', ':instantapp'`

```gradle
include ':libcocos2dx'  // 为升级作的修改
project(':libcocos2dx').projectDir = new File('/Applications/CocosCreator/Creator/2.4.5/CocosCreator.app/Contents/Resources/cocos2d-x/cocos/platform/android/libcocos2dx')
include ':creatorTest'
project(':creatorTest').projectDir = new File(settingsDir, 'app')
```

### Gradle Properties

一般是在这个文件里定义一些可变的配置项, 这样修改的地方都是在这个文件里, 其它具体引用直接引用这个文件里的变量名就要以了.

这里的修改应该是确保 PROP_COMPILE_SDK_VERSION, PROP_TARGET_SDK_VERSION, PROP_BUILD_TOOLS_VERSION 使用的是同一个 api.

一般情况下 PROP_COMPILE_SDK_VERSION, PROP_TARGET_SDK_VERSION, PROP_BUILD_TOOLS_VERSION 应该用最新的版本. google store 也会不断地要求上架的 apk , target sdk 必须支持对应多少版本.

PROP_MIN_SDK_VERSION 是最低兼容 android api, 根据你的情况来定了.
[Android Level API](./2021-01-20-androidapilevels.md)

以下的修改中, 还加了 android.useAndroidX=true, 这一项, 如果你只是升级 Android 工程, 应该不需要这一项, 但是很多第三方 sdk 都开始依赖 androidx 了, 所以很多时候都会需要这一项.

路径: `proj.android-studio/gradle.properties`

修改: 修改 PROP_COMPILE_SDK_VERSION, PROP_MIN_SDK_VERSION, PROP_TARGET_SDK_VERSION, PROP_BUILD_TOOLS_VERSION 的值

```properties
PROP_COMPILE_SDK_VERSION=30     // 为升级作的修改

# Android SDK version that will be used as the earliest version of android this application can run on
PROP_MIN_SDK_VERSION=16         // 为升级作的修改

# Android SDK version that will be used as the latest version of android this application has been tested on
PROP_TARGET_SDK_VERSION=30      // 为升级作的修改

# Android Build Tools version that will be used as the compile project
PROP_BUILD_TOOLS_VERSION=30.0.2 // 为升级作的修改

...

android.useAndroidX=true
```

### App Build Gradle

这里最主要的核心点就是确定 outputDir 所在的位置, outputDir 的位置在不同的 gradle 版本中位置是不一样的.
outputDir gradle 打包 apk 的临时路径, 我们这里所做的事就是在开始打包 apk 之前, 把工程中的 assets 相关的资源拷贝到 gradle 中正确的位置上去. 以下是一个对于 2.4.5 的参考, 其它版本根据其它的思想来做对应的修改.

路径: `build/jsb-link/frameworks/runtime-src/proj.android-studio/app/build.gradle`

修改: 最核心的点就是修改 outputDir

```gradle

...

android.applicationVariants.all { variant ->
    // delete previous files first
    def outputDir = "${buildDir}/intermediates/merged_assets/${variant.dirName}/out"
    delete "${outputDir}"

    variant.mergeAssets.doLast {
        def sourceDir = "${buildDir}/../../../../.."

        copy {
            from "${sourceDir}/res"
            into "${outputDir}/res"
        }

        copy {
            from "${sourceDir}/subpackages"
            into "${outputDir}/subpackages"
        }

        copy {
            from "${sourceDir}"
            include "assets/**"
            include "src/**"
            include "jsb-adapter/**"
            into outputDir
        }

        copy {
            from "${sourceDir}/main.js"
            from "${sourceDir}/project.json"
            into outputDir
        }
    }
}

...

```

### NDK 编译

NDK 升级后, module 不能带 shared 后缀了, 需要去掉.
下面路径跟了两个, 那是因为`app/jni/Android.mk` 里引用了外层的 `CocosAndroid.mk` 文件, 所以最终是在 `CocosAndroid.mk` 中做的修改.
但是如果 `app/jni/Android.mk` 没有包含外面的 mk , 而是直接实现的, 那么就应该在 `app/jni/Android.mk` 中修改.

路径: `proj.android-studio/app/jni/Android.mk`, `proj.android-studio/jni/CocosAndroid.mk`

修改: module 名字中不用带 shared

```mk
LOCAL_MODULE := cocos2djs   # 为升级作的修改
```

---
转自: [HH](http://www.hugohuang.xyz/)

