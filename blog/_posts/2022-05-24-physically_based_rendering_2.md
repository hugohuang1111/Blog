---
title: Physically Based Rendering-Image Base Lighting
date: 2022-05-24
author: hugo
tags:
    pbr
---

## 背景

上一篇说到我最近开了一个[引擎](https://gitee.com/hugohuang1111/ben)的坑写了, 所以把自己关于 PBR 的一点体会记录下来, 前篇写了 PBR 的光照部分, 其实 PBR 还有一个特别重要的部分, 那就是 IBL(Image Base Lighting).

## IBL 是什么

IBL 主要作用就是模拟我们现实生活中的间接光反射. 想像我们把一个白球放在四面墙壁是红色的屋里, 我们去观察这个白球, 它会有浅浅的红色, 这就是因为球受到红色墙壁的影响. 同理, 如果我们把球放在四面墙壁是绿色的房间, 那球就是呈现浅浅的绿色.

物体最终会呈现出什么颜色, 其实与物体所处的环境相关.

## IBL 理论

IBL(Image Base Lighting) 也就是基于图像的光照. 这里的图像就是物体所处的环境. 一般情况下我们会用一个 Cube 纹理来表示. 这个 Cube 怎么来, 可以是天空盒, 也可以是物体所处的环境的实时渲染结果(光照探针就是一种类似的技术).

IBL 也分为漫反射与镜面反射, 而 IBL 中光线来辐射量应该是来源于法线平面所有的像素点, 而计算机中不可能取到现实中所有的光源, 所以我们其实是采样法线半球内的像素点作为光源. 而因为采样的成本很高, 所以我们都会预处理, 先将平面四周的环境全采样后存储到一个 Cube 纹理中, 在 IBL 中, 再直接采用.

## IBL 实现

### 漫反射

环境漫反射是说, 当前点的平面法线所在的半球应该都会对当前点的有辐射, 而我们在计算机, 在每一帧中的每一个点都要去采样当前点的法线半球, 这在性能上几乎不可接受, 所以我们需要做一个预处理, 预先将每个点的所能接收到的环境辐射存储到一个 Cube 纹理中. 这样在实时计算时, 只需要从这个 Cube 纹理中直接取值就好, 而这个 Cube 纹理, 我们一般叫作环境辐射图.

生成辐射图的 glsl

```glsl
float sampleDelta = 0.025;
float nrSamples = 0.0f;
for(float phi = 0.0; phi < 2.0 * PI; phi += sampleDelta) {
    for(float theta = 0.0; theta < 0.5 * PI; theta += sampleDelta) {
        // spherical to cartesian (in tangent space)
        vec3 tangentSample = vec3(sin(theta) * cos(phi),  sin(theta) * sin(phi), cos(theta));
        // tangent space to world
        vec3 sampleVec = tangentSample.x * right + tangentSample.y * up + tangentSample.z * N;

        irradiance += texture(environmentMap, sampleVec).rgb * cos(theta) * sin(theta);
        nrSamples++;
    }
}
irradiance = PI * irradiance * (1.0 / float(nrSamples));
```

上面这个 shader 其实就是用两个 for 循环在当前点的法线半球上采样, 然后取平均. 

有了上面实时生成的辐照图, 我们在实时实现物体的实时漫反射光源, 就可以直接从辐照图中获取了.

```glsl
vec3 irradiance = texture(irradianceMap, N).rgb;
vec3 diffuse    = irradiance * albedo;
```

### 镜面反射

光线在一个点发生反射, 因为微平面与粗糙度这两个概念, 反射出来的光线不会只有一条, 而是以完全镜面反射 r 为中心主要反射的扇瓣形. 同时, 粗糙度的不同也会导致扇瓣大小的不同. 所以我们会生成一个预滤波的环境图, 并以粗糙度为准生成 lod 纹理. 

再加上我们生成的以 NdotV 和粗糙度为轴的 LUT , 就可以得到 Fresnel 值.

至此, 高光的相关元素, 我们都集齐了.

```glsl
vec3 F = fresnelSchlickRoughness(max(-dot(N, V), 0.0), F0, roughness);
F = vec3(0.5);

vec3 kS = F;
vec3 kD = vec3(1.0) - kS;
kD *= 1.0 - metallic;

vec3 irradiance = texture(irradianceMap, N).rgb;
vec3 diffuse    = irradiance * albedo;

// sample both the pre-filter map and the BRDF lut and combine them together as per the Split-Sum approximation to get the IBL specular part.
const float MAX_REFLECTION_LOD = 4.0;
vec3 prefilteredColor = textureLod(prefilterMap, R,  roughness * MAX_REFLECTION_LOD).rgb;    
vec2 brdf  = texture(LUTMap, vec2(max(dot(N, V), 0.0), roughness)).rg;
vec3 specular = prefilteredColor * (F * brdf.x + brdf.y);

vec3 ambient = (kD * diffuse + specular) * ao;
```

更详细的理论可以参考[这里](https://learnopengl-cn.github.io/07%20PBR/03%20IBL/02%20Specular%20IBL/)

---
转自: [HH](http://www.hugohuang.xyz/)

