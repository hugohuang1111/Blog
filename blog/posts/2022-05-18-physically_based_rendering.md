---
title: Physically Based Rendering 光照
date: 2022-05-19
author: hugo
tag:
    - pbr
---

## 背景

最近在从头开始写一个引擎, 涉及到渲染部分, 就会写 PBR(Physically Based Rendering) 相关的代码. 这里特地记录一下个人理解对相关原理的理解.

## PBR 是什么

在 3D 中光照早期相关的实现, 就是 Blinn-Phong , 半兰伯特 这些了, 也是光线与视线的点积去影响 BaseColor , 最终呈现出光线直照更亮的效果. 这一段时期, 其实是用光线与视线之间的关系来模拟现实. 从这里可以看出来, 只需要光线与视线的点积, 计算量不大, 又可以比较好地达到现实效果, 所以最受大家的欢迎.

而 PBR 呢, 其实从它的名字(基于物理的渲染)就可以看出来, 它的整体逻辑, 是以现实的物理为基础, 来实现渲染. 这里要说一点, 这个是基于物理, 而不是完全物理(现在有计算也不可能完全按照现实来实现), 所以 PBR 中所有的实现都是以物理为基础, 同时又适应当前的硬件而做的渲染实现.

PBR 同时也是一种美术与程序之间交流的纽带. 大家都遵守同样的渲染逻辑, 就可以保证设计效果与最终效果能达到良好的一致性.

## PBR 理论

### 微平面理论

在现实中, 我们认为所有的平面(平整或粗糙), 以显微镜或微小尺寸去观察, 它都不是完全平整的. 所以 PBR 引入了 Roughness (粗糙度) 这个变量.

### 能量守恒

现实中, 当一束光线照射到平面上, 会发现 reflect(反射) 与 refract(折射) , 反射与拆射的能量总和肯定不会超过入射光线的能量.

```glsl
// kS 反射系数
// kD 折射/漫反射系数
float kD = 1 - kS;
```

### 菲涅尔现象

Fresnel 现象也是在现实中很常见的一种现象. 任何物体的反射率都不是固定的, 当光线越接近掠过平面时, 光线的反射率会急剧提高. 举个现实中的现象, 早上看路面, 会发现远处是亮的.

## PBR 实现

### 微平面实现

基于微平面理论, 当光线照在平面上, 反射光会因为平面粗糙度的原因, 会向各种方面反射, 当然其中根据法线与入射光线对称的反射方向肯定是占大部分. 所以反射的光线不会是 100% , 那么这里我们就用一个法线分布函数来, 在反射的能量有多少.

同时微平面中, 还存在几何遮蔽, 因为平面本身的粗糙度, 而导致光线进入平面上, 不会再反射拆射, 而是被消耗掉了. 或反射光线直接被平面上的凸起挡住.

法线分布函数的实现
```glsl
float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness*roughness;
    float a2 = a*a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;

    float nom   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / denom;
}
```

几何遮蔽的实现
```glsl
// ----------------------------------------------------------------------------
float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}

// ----------------------------------------------------------------------------
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}
```

### 菲涅尔反射

菲涅尔的本质其实就是入射光线与法线的不同夹角会导致不同的反射率.

```glsl
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}
```

更详细的理论可以参考[这里](https://learnopengl-cn.github.io/07%20PBR/01%20Theory/)

---
转自: [HH](http://www.hugohuang.xyz/)

