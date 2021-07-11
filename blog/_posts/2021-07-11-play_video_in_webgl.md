---
title: 在 WebGL 中播放视频
date: 2021-07-11
author: hugo
tags:
    creator, video, webgl
---

## 效果

话不多说, 先看效果, 在一个旋转的立方体上的播放视频.

![VideoGL](@assets/202107/videogl.gif)

## 前言

这里主要介绍如何使用 Creator3 在 WebGL 中播放视频.

为什么会在 WebGL 中呢, 主要是为了适合在游戏中想播放一段视频, 同时又需要在视频上层放置一些游戏元素时, 那么将 Video 播放在视频中就是一个很正常上的需求了.

## 原理

其实从原理上来说, 基本都是同一套原理

1. 解析视频, 得到视频帧 (解析视频有很多方法, 比如 ffmpeg, html 上可以直接使用 video 组件来解析)
1. 将视频帧同步到 WebGL 中

本文的实现手法是在 Creator3 上, 同时目前只支持 WebGL , 所以在解析视频采用 html video 组件来解析.

对于在将视频帧同步到 WebGL 中, 这也会因演示所在平台而定, 基本实现大同小异, 本文是在 Creator 3 中, 具体实现可见文末的代码仓库.

## 使用

在代码中, 我给出一个 videogl 的组件, 如果需要, 完全可以将 videogl 文件夹放到你的 Creator 工程中, 在你要播放视频的结点上添加 videogl 脚本. 然后就可以在 WebGL 中播放视频了.

## 仓库地址

https://github.com/hugohuang1111/videogl


---
转自: [HH](http://www.hugohuang.xyz/)

