---
title: AndroidStudio 如何调试联接网易 mumu
date: 2020-05-09
author: hugo
tags:
    android
---


1. 在网易 mumu 上的 `设置` 里把 `开发者选项` 中的 `USB调试` 打关

2. 在 AndroidStudio 中的 `Terminal` 中输入以下命令:

* `adb connect 127.0.0.1:7555` (Windows上)
* `adb connect 127.0.0.1:5555` (Mac上)

3. 应该在AndroidStudio中就可以看到对应的模拟器了

