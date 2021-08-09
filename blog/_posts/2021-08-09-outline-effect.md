---
title: 内发光, 外发光特效
date: 2021-08-09
author: hugo
tags:
    shader
---

## 简介

本文介绍如何在一个模型上实现内/外发光

## 效果与思路

外发光:
将模型按法线向外扩展一定的距离, 然后将法线与视角做点积, 这个点积就是一个从中间往外渐变弱的效果, 最后再将模型渲染出来, 就可以行到一个外发光的效果, 如图.

![外发光](@assets/202108/outline1.jpg)


内发光:
原理同外发光很像, 不过不会向外扩展, 同时再将法线与视解的点积用1去减, 取差值, 就是一个从外向内渐变弱的效果, 这里就是先渲染模型, 再渲染内发光的渐变了. 同样如上图.

![内发光](@assets/202108/outline2.jpg)

## 外发光实现

顶点里主要操作就是往外扩:

```shader
vec4 vert () {
    StandardVertInput In;
    CCVertInput(In);

    scNormal = In.normal;
    vec4 pos = In.position;
    pos.w = 1.;

    // 外扩 outlineParams.z
    pos.xyz += In.normal * outlineParams.z;

    mat4 matWorld, matWorldIT;
    CCGetWorldMatrixFull(matWorld, matWorldIT);
    scWorldPos = matWorld * pos;
    scNormal = normalize((matWorldIT * vec4(scNormal, 0.0)).xyz);

    pos = cc_matProj * (cc_matView * matWorld) * pos;
    return pos;
}
```

片元里主要操作就是视线与法线点积, 再作幂操作

```shader
vec4 frag () {
    vec4 color = rimColor;
    vec3 V = normalize(cc_cameraPos.xyz - scWorldPos.xyz);
    vec3 N = normalize(scNormal);
    float dotVal = dot(V, N);
    dotVal = saturate(dotVal);
    color.a = pow(dotVal, outlineParams.x);
		color.a *=  outlineParams.y * dotVal;
    color.a = clamp(color.a, 0., 0.8);

    return CCFragOutput(color);
}
```

## 内发光实现

顶点里就是基本操作:

```shader
vec4 vert () {
    ...

    pos = cc_matProj * (cc_matView * matWorld) * pos;
    return pos;
}
```

片元里主要操作同外发光, 最后加再去 1 去减 a  的值

```shader
  vec4 frag () {
    ...
    color.a = 1. - color.a;

    return CCFragOutput(color);
}
```

## 详细实现


https://github.com/hugohuang1111/fxcase



---
转自: [HH](http://www.hugohuang.xyz/)

