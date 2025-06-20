---
title: gradle 镜像
date: 2021-03-16
author: hugo
tag:
    - gradle
    - android-studio
    - mirrors
---

gradle 下载慢完美解决方法.

## 添加镜像

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


## gradle 下载

但是还是会遇到下载 `gradle-x.x.x-all.zip` 非常慢的问题, 那么这时将 `gradle/wrapper/gradle-wrapper.properties` 中的地址也定位到国内镜像就可以了.

```properties
#distributionUrl=https\://services.gradle.org/distributions/gradle-4.10.3-all.zip
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-4.10.3-all.zip
```

如上, 将 `gradle-4.10.3-all.zip` 定向到了 tencent , 下载就非常快了.
如下中的版本, 应该根据你自身的版本作对应修改.

## gradle 全局代理

在 gradle 编译中, 有时还会遇到这种情况
既使已经配置了上面的镜像, 还是会遇到类似 `Unable to load Maven meta-data from https://maven.google.com/` 这样的错.

这时可能就是你依赖的插件依赖了 google maven , 而这时因某些原因, 这里的 google maven 不能使用上面你配置的镜像.

那么就需要添加一个全局的 gradle 代理配置:
在 `~/.gradle/gradle.properties` (Windows上也是类似的位置) 添加如下内容

```properties
systemProp.http.proxyHost=127.0.0.1
systemProp.http.proxyPort=7890
# systemProp.http.proxyUser=userid
# systemProp.http.proxyPassword=password
systemProp.http.nonProxyHosts=*.nonproxyrepos.com|localhost

systemProp.https.proxyHost=127.0.0.1
systemProp.https.proxyPort=7890
# systemProp.https.proxyUser=userid
# systemProp.https.proxyPassword=password
systemProp.https.nonProxyHosts=*.nonproxyrepos.com|localhost
```

上文中的 proxy, port 应该是用你自己的信息.
当然你也可以把 gradle.properties 放在你的工程下, 这样只在当前工程有效.

---
转自: [HH](http://www.hugohuang.xyz/)
