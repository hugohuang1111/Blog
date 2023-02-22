---
title: FFMPEG 介绍
date: 2022-06-15
author: hugo
tags:
    ffmpeg
---

## 背景

最近在研究 FFMPEG , 就记录了相关知识点.

## FFMPEG 的几个基本库

* libavformat: 用于各种音视频封装格式的生成和解析，包括获取解码所需信息以生成解码上下文结构和读取音视频帧等功能；音视频的格式解析协议，为 libavcodec 分析码流提供独立的音频或视频码流源.
* libavcodec: 用于各种类型声音/图像编解码。该库是音视频编解码核心，实现了市面上可见的绝大部分解码器的功能， libavcodec 库被其他各大解码器 ffdshow， Mplayer 等所包含或应用.
* libavdevice: 硬件采集, 加速, 显示. 操作计算机中常用的音视频捕获或输出设备: ALSA, AUDIO_BEOS, JACK, OSS,1394, VFW.
* libavfilter: filter（FileIO、 FPS、 DrawText） 音视频滤波器的开发，如宽高比 裁剪 格式化 非格式化 伸缩.
* libavutil: 包含一些公共的工具函数的使用库，包括算数运算 字符操作.
* libswscale: (原始视频格式转换) 用于视频场景比例缩放、色彩映射转换；图像颜色空间或格式转换，如 rgb565、rgb888 等与 yuv420 等之间转换.
* libswresample: 音频采样数据格式转换.
* libpostproc: (同步、时间计算的简单算法) 用于后期效果处理; 音视频应用的后处理，如图像的去块效应.

## FFMPEG 的几个工具

* ffmpeg: 该项目提供的一个工具, 可用于格式转换, 解码或电视卡即时编码等.
* ffprobe: 获取媒体文件信息.
* ffplay: 是一个简单的播放器, 使用 ffmpeg 库解析和解码, 通过 SDL 显示.

---
转自: [HH](http://www.hugohuang.xyz/)

