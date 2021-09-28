---
title: 雨滴特效
date: 2021-09-28
author: hugo
tags:
    shader, rain, effect
---

## 简介

本文介绍如何实现一个玻璃上雨滴落的特效

## 效果与思路

先看效果图吧

![RainOnWindow](@assets/202109/rainOnWindow.gif)

这个其实是一种后期, 把 rain 的效果与当前帧相融合.
rain 的效果实施, 可以把整个屏幕分格, 一个格子中一个雨滴, 让并让他从下往下滑落.


## 实现步骤简述

1. 将整个 UV 分成小格子

```glsl
vec2 cellUV = uv*gridsWH;
cellUV = fract(cellUV);
```

2. 画一个雨滴

```glsl
float rDrop = 0.;
rDrop = length(dropUV * gridSize);
```

3. 让雨滴往下滑掉

```glsl
dropUV.y += sin(time + sin(time + sin(time)* 0.5)) * 0.4;
```

4. 画雨滴的尾

```glsl
vec2 trailUV = cellUV * vec2(1., 8.);
trailUV = fract(trailUV);
trailUV -= 0.5;
float rTrail = length(trailUV * gridSize / vec2(1., 8.));
```

5. 修剪尾巴

```glsl
rTrail = smoothstep(0.05, 0.03, rTrail);
rTrail *= smoothstep(-0.01, 0., dropUV.y);
rTrail *= smoothstep(0.4, 0., dropUV.y);
```

6. 最终将雨滴与每一帧合成

```glsl
vec4 texCol = texture(cc_gbuffer_albedoMap, v_uv + offsetUV);
```


## 详细实现

https://github.com/hugohuang1111/fxcase/tree/master/assets/caseRaindrop


---
转自: [HH](http://www.hugohuang.xyz/)

