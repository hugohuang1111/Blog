---
title: 小程序抽奖实现
date: 2020-07-19
author: hugo
tag:
    - 小程序
    - canvas
---


## 介绍

__注意__: 本文中的本仓库地址为 https://gitee.com/htl/wxLottery

最近在微信小程序中实现如下这种抽奖效果.

![](@assets/20200719/lottery_sample.gif)


由这个效果来看, 可以分成三个部分

* 背景
* 转盘
* 抽奖按钮

上面的实现有很多种方法, 很多大神也给出了这种效果的实现方式. 我自己来参照过大神的实现, 最后发现实际使用中，有些地方并不如意.

## 实现

上面三个部分每一种都有很多实现方式

* 背景

这是个背景是一个带有过度背景的圆, 再加边上有很多小圆. 这个其实并不难, 有很多实现方式.

本仓库中的 index 页面使用 css 实现, lottery 页面直接使用图片(lottery主要用来讲解一个更重要的问题，其它尽量简单，可以少点干扰)

* 转盘

转盘的扇形使用 canvas 来实现, 这应该没有问题. 转盘上的字, 可以直接用 canvas 来画, 也可以用 html 加 css 旋转效果来实现. 一般情况使用 html+css 可能在字体格式方面会更方便点.

本仓库中的 index 页面使用 html+css 来实现. lottery 使用 canvas 来画字.

* 抽奖按钮

这个按钮是不动的，可以用 html 实现.

### 在小程序上的问题

提出问题之前，先看一下这个[文章](https://developers.weixin.qq.com/community/develop/article/doc/000c4e433707c072c1793e56f5c813), 从中我们可以知道, 小程序中的 canvas 与 html 组件属于不同的层, z-index 无法控制 canvas 与 html 之间的深度关系. 当然文中还提到了"同层渲染"(将 canvas 渲染到 WebView 也就是与 html 同层) 和 cover-view , cover-image 来解决开发者想解决 canvas 与 html 的深度关系的问题, 实际我使用下来, 并不觉得好用, 有效.

好了，现在提出我在完成这个抽奖效果, 遇到的问题, 那就是我想在转盘上显示 html 的抽奖信息文字，与中间的抽奖按钮, 都遇到了 canvas 总是在最上层的问题.

#### 解决方案一

我们知道小程序中的 canvas 接口有新旧两套接口. 本仓库中的 index 界面就是使用旧接口配合 z-index 来完成对应的实现

#### 解决方案二(推荐)

使用 canvas 新接口生成图片, 然后所有的实现都可以使用 html 来实现, 这样适应性最强. 我觉得这是对应本效果最好的实现方式. 本仓库中的 lottery 界面对应就是这种实现。


---
转自: [HH](http://www.hugohuang.xyz/)
