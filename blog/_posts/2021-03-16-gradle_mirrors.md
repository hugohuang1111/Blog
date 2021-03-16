---
title: gradle 镜像
date: 2021-03-16
author: hugo
tags:
    gralde, android-studio, mirrors
---

gradle 下载慢完美解决方法.

gradle 的镜像下载, 在网上很多都会搜到在工程的 build.gradle 中加入对应镜像的 url,
这里以阿里云为例.

```gradle
buildscript {

    repositories {
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin' } // 阿里云国内镜像
        maven { url 'https://maven.aliyun.com/repository/google' } // 阿里云国内镜像
        maven { url 'https://maven.aliyun.com/repository/public' } // 阿里云国内镜像

        google()
        jcenter()
    }
}

allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin' } // 阿里云国内镜像
        maven { url 'https://maven.aliyun.com/repository/google' } // 阿里云国内镜像
        maven { url 'https://maven.aliyun.com/repository/public' } // 阿里云国内镜像

        google()
        jcenter()
    }
}
```

只要添加上面三项, gradle, google, jcenter中的插件下载都会比较快了.

这里阿里云相关镜像的介绍: https://maven.aliyun.com/mvn/guide


但是还是会遇到下载 `gradel-x.x.x-all.zip` 非常慢的问题, 那么这时将 `gradle/wrapper/gradle-wrapper.properties` 中的地址也定位到国内镜像就可以了.

```properties
#distributionUrl=https\://services.gradle.org/distributions/gradle-4.10.3-all.zip
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-4.10.3-all.zip
```

如上, 将 `gradle-4.10.3-all.zip` 定向到了 tencent , 下载就非常快了.
如下中的版本, 应该根据你自身的版本作对应修改.


---
转自: [HH](http://www.hugohuang.xyz/)
