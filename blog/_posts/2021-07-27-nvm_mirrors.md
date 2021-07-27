---
title: nvm 镜像
date: 2021-07-27
author: hugo
tags:
    nvm
---

## 前言

nvm 代理, 镜像设置

## 代理

Command:
```cmd
nvm proxy [url]
```
设置用于下载的代理。[url]为空则查看当前代理。设置[url]为"none"以删除代理。

代理格式为 nvm proxy http://username:password@proxy:port 其中，如果用户名有特殊字符，用url编码工具编码，只对特殊字符编码

## 镜像

```cmd
nvm node_mirror https://npm.taobao.org/mirrors/node/
```
设置 node 镜像

```cmd
nvm npm_mirror https://npm.taobao.org/mirrors/npm/
```
设置 npm 镜像


---
转自: [HH](http://www.hugohuang.xyz/)

