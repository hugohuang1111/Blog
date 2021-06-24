---
title: Creator3 启动加载慢分析与解决
date: 2021-06-24
author: hugo
tags:
    creator, android, ios, weixin
---

## 前言

这里主要是介绍分析 Creator 3.x 的启动流程, 以及如何可以优化加载时间.

## 启动加载流程

CocosCreator 3.x 上从应用启动到进入场景的可以分为以下几个阶段

1. 点击启动后到游戏 js 第一行代码
    这里主要是对 Android/iOS 平台来说, Android/iOS 在这一阶段会加载 so 库/或 app 原生代码, 创建系统 UI, OpenGl View

    这里可以做的优化一般是用 Android/iOS 的 splash (本质就是加一个图片, 让用户不会看到黑屏)

1. js 加载引擎需要前置模块
    这里已经进入到游戏中的 JS 代码了(从这里到第一个场景的显示的最终展示, 其实都是在做各种各样的前置准备工作.), 然后加载引擎中所需要的各种各样的模块. 从调试来看最影响加载时间的就是 ammo.js 这个库的加载.

    所以这里可以做的优化是, 去掉不需要的模块, 在 Creator 的工程设置上就可以选择你要裁剪的模块. 如果你的游戏没有用到物理库, 把 ammo.js 去掉.

1. js 中加载配置, 必须的场景
    这里是在加载主要场景, 资源, 配置信息, 这里主要影响就是必须的场景的大小了, 一般情况下就是第一个场景

    这里可以做的优先一般减少你的场景大小, 场景中的内容是否可以做成动态的.

1. logo 展示
    这里是 logo 展示界面(默认是 creator 的 logo), 默认为 3 秒, 在这里的后台其实还会做 shader 的编译工作.
    
    这里可以做的优化是把 logo 展示时间改小, 个人建议不要直接改为 0, 因为还要留点时间去编译 shader, 同时也可以去掉一些你不会用到的 shader . 比如如果是2D游戏, 可以去掉一些3D相关的 shader.

1. 显示游戏中的第一个场景
    这里就进入到开发者的第一个场景了, 就要根据项目需要做项目相关的优化了.


## 具体优化手法

1. splash 的设置
    * 在 ios 上是可以直接设置启动图片的
    * 在 android 上可以通过设置主题来解决, 这里有两个文档可以参考[Android启动界面][1], [Creator2上的Android启动][2] (这个里面中对他说的第一阶段所做的操作就是使用了 splash )

1. 裁剪引擎模块
    * Creator -> Menu(菜单) -> Project(工程) -> Project Settings(工程设置) -> Feature Crop(模块设置)

1. 优化场景大小
    * 优化场景大小, 这里主要与项目本身相关了, 可以做一些, 比如场景的一些内容动态之类

1. logo 展示
    * 调整 logo 时间可以直接修改生成后工程中的 `assets/src/settings.json` (微信小游戏平台为 `src/settings.json` ) . 找到其中的 splashScreen.totalTime 项, 修改为 1000 毫秒. (当然可以为其它值, 看项目需要)
    * 去掉一些不用的 shader 的编译, 这一项一般可能不需要. 这里提供一种 hack 方法.
        在生成后工程的 application.js 中, 添加如下代码:
        ```js
        // 添加的代码段开始 接管 createShader , 不需要的 shader , 直接跳过编译
        const originCreateShader = cc.game._gfxDevice.createShader.bind(cc.game._gfxDevice);
        const skipShader = [
            'deferred-lighting|lighting-vs|lighting-fs',
            'post-process|post-process-vs|post-process-fs',
            'standard|shadow-caster-vs:vert|shadow-caster-fs:frag',
            'unlit|unlit-vs:vert|unlit-fs:frag',
            'clear-stencil|sprite-vs:vert|sprite-fs:frag',
            'particle|particle-vs-legacy:lpvs_main|tinted-fs:add',
            'particle-gpu|particle-vs-gpu:gpvs_main|tinted-fs:add',
            'particle-trail|particle-trail:vs_main|tinted-fs:add',
            'billboard|vert:vs_main|tinted-fs:add',
            'spine|sprite-vs:vert|sprite-fs:frag',
        ];
        cc.game._gfxDevice.createShader = function(shaderInfo) {
            if (shaderInfo) {
                for (let i = 0; i < skipShader.length; i++ ) {
                    if (skipShader[i] == shaderInfo.name) {
                        return null;
                    }
                }
            }

            return originCreateShader(shaderInfo);
        }
        // 添加的代码段结束

        return cc.game.run(function () {
            dt = new Date();
            console.log('LT, Game toonGameStarted:' + timestamp());
            return onGameStarted(cc, settings);
        });
        ```


[1]: https://www.jianshu.com/p/cea2864bb587
[2]: https://forum.cocos.org/t/cocos-creator-android-2/83154

---
转自: [HH](http://www.hugohuang.xyz/)

