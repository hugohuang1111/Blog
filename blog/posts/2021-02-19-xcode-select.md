---
title: Xcode 多版本切换
date: 2021-02-19
author: hugo
tag:
    - Xcode
    - xcode-select
---

Xcode 的多版本共享, 切换, 主要是使用 xcode-select 来操作

## 显示版本

* xcode-select -version

## 当前使用的 Xcode

* xcode-select --print-path

## 切换到 Xcode 11.1

* sudo xcode-select -switch /Applications/Xcode.11.1.app


---
转自: [HH](http://www.hugohuang.xyz/)
