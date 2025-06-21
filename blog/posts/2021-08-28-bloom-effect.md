---
title: bloom 辉光特效
date: 2021-08-28
author: hugo
tag:
    - effect
---

## 简介

本文介绍如何实现一个全局 bloom 辉光特效

## 效果与思路

bloom 效果是对渲染后的纹理作处理. 一般可以这样, 先通过阀值取出来纹理中高亮的区域, 然后再对这些区域作模糊处理, 最终再将模糊区域与取阀值前的纹理合并显示.

原图:

![原图](/assets/202108/bloom2.png)

加上辉光效果后:

![Bloom](/assets/202108/bloom1.png)


## Bloom 实现

主要分四步

1. 通过阀值选取高亮区域:

```shader
vec4 frag () {
    vec4 col = texture(cc_gbuffer_albedoMap, v_uv);
    float luminace = sqrt(col.r*col.r*0.299 + col.g*col.g*0.587 + col.b*col.b*0.114);

    if (luminace < thresholdVal) {
      col = vec4(0., 0., 0., 1.);
    }

    return CCFragOutput(col);
}
```

2. 将阀值后的纹理作模糊处理

这里的模糊其实是分两次做的, 一次做横向, 一次做竖向

```shader
vec4 frag () {
    vec4 col = vec4(0., 0., 0., 0.);

#if DIRECTIONX
    col += texture(cc_gbuffer_emissiveMap, v_uv);
    for (float i = 1.; i <= WINDOW_SIZE; i += 1.) {
      col += texture(cc_gbuffer_emissiveMap, v_uv + vec2(i * windowStep, 0.));
      col += texture(cc_gbuffer_emissiveMap, v_uv - vec2(i * windowStep, 0.));
    }
#else
    col += texture(cc_lighting_resultMap, v_uv);
    for (float i = 1.; i <= WINDOW_SIZE; i += 1.) {
      col += texture(cc_lighting_resultMap, v_uv + vec2(0., i * windowStep));
      col += texture(cc_lighting_resultMap, v_uv - vec2(0., i * windowStep));
    }
#endif

    col /= (WINDOW_SIZE * 2. + 1.);

    return CCFragOutput(col);
}
```

3. 将模糊后的图与原图合并

```shader
vec4 frag () {
    vec4 difCol = texture(cc_gbuffer_albedoMap, v_uv);
    vec4 blurCol = texture(cc_gbuffer_emissiveMap, v_uv);
    vec4 col = difCol + blurCol;

    col = vec4(1.) - exp(-col * toneExp);

    return CCFragOutput(col);
}
```


## 详细实现

https://github.com/hugohuang1111/fxcase/tree/master/assets/caseBloom


---
转自: [HH](http://www.hugohuang.xyz/)

