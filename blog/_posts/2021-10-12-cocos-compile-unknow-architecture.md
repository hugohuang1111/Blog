---
title: unknow architecture on Xcode 12
date: 2021-10-12
author: hugo
tags:
    cocos2d
---

今天使用 Xcode 12 编译 Coco2dx 3.17.2 lua 工程时, 遇到了如下错误:

![UnknowSupportedArchitecture](@assets/202110/unknowSupportArch.jpg)

这个主要是因为 Xcode 12 编译方式有改变, 可以这样改

1. 去掉 `PROJECT` -> `Build Setting` -> `User-Defined` -> `VALID_ARCHS` 中的定义

2. 如果还需要排除架构, 可以在 `PROJECT` -> `Build Setting` -> `Architectures` -> `Excluded Architectures` -> 设置排除的编译架构指令集


---
转自: [HH](http://www.hugohuang.xyz/)
