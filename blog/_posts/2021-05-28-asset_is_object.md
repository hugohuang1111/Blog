---
title: Cocos Creator Launch failed
date: 2021-05-28
author: hugo
tags:
    creator
---

原生编译运行 Cocos Creator 时, 启动时 Crash

Crash Stack:

assert(isObject());

```
...
se::Value::toObject() const
cocos2d::EventDispatcher::dispatchTickEvent(float)
::Java_org_cocos2dx_lib_Cocos2dxRenderer_nativeRender(JNIEnv *)
...
```

很大的原因应该是 Cocos Creator 中对应的资源(脚本, 图片)并没有打包到 apk 包中.
而没有打包到 apk 中, 很有可能是你的 gradle 工程的配置升级, 但是却没有

以下是我更新了 gradle 配置后, 打包拷贝资源做的修改 (可以作为参考)

`proj.android/app/build.gradle`

```gradle
...

android.applicationVariants.all { variant ->
    // delete previous files first
    delete "${buildDir}/intermediates/merged_assets/${variant.dirName}"

    variant.mergeAssets.doLast {
        def sourceDir = "${buildDir}/../../../../.."
        def outputDir = "${buildDir}/intermediates/merged_assets/${variant.dirName}/out"

        copy {
            from "${sourceDir}/res"
            into "${outputDir}/res"
        }

        copy {
            from "${sourceDir}/subpackages"
            into "${outputDir}/subpackages"
        }

        copy {
            from "${sourceDir}/src"
            into "${outputDir}/src"
        }

        copy {
            from "${sourceDir}/jsb-adapter"
            into "${outputDir}/jsb-adapter"
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

---
转自: [HH](http://www.hugohuang.xyz/)
