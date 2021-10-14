---
title: Dissolve 消融特效
date: 2021-10-14
author: hugo
tags:
    effect
---

## 简介

前几天看到一个消融(Dissolve)特效, 就想自己也尝试一下.

## 效果与思路

老规矩, 先上效果图

![Dissolve](@assets/202110/dissolve1.gif)

另一种效果, 最后带点飞升的感觉

![Dissolve](@assets/202110/dissolve2.gif)

这个最后扩展一点, 有点膨胀消失的感觉

![Dissolve](@assets/202110/dissolve3.gif)

消融其实就是用一张 noise 的图, 然后以 noise 像素点的一个分量与消融阀值作比较, noise 小于阀值的, 那么对应的模型纹理就直接 discard ,随着消融阀值地不断提升, 模型就慢慢整个消失了.

最后飞升(整体上移),膨胀(模型外扩), 其实就是在要完全消失时, 再去操作模型坐标.

## 实现步骤简述

1. 以 noise map 为点, 将小于消融阀值的像素丢掉

```glsl
vec4 dissval = texture(dissolveMap, v_uv);
if (dissval.r < dissthreshold) { discard; }
```

2. 在消融值的边缘加上过渡色

```glsl
float t = 1.0 - smoothstep(0.0, dissolveParams.y, dissval.r - dissthreshold);
s.albedo = mix(s.albedo, dissolveColor, t * step(0.001, dissthreshold));
```

3. 在逻辑代码中加不断增加消融的阀值

随时间增加 value , 并将其通过 pass 传到 shader 中.

```typescript
pass.setUniform(this.dissolveThresholdHandle, value);
```

4. 如果要做飞升

dissolveOffsetDir 设置为 (0, 1, 0), 代入下面的代码中, 就会在完全消失前, 整体往上 (0, 1, 0) 的方向移动了

```glsl
vec3 offsetDir = dissolveOffsetDir.xyz * saturate(dissolveParams.x - dissolveParams.w) * dissolveParams.z;
```

5. 如果要做扩展

扩展一般都是按法线往外移动一段距离

```glsl
vec3 normalDir = In.normal * saturate(dissolveParams.x - dissolveParams.w) * dissolveParams.z;
```

## 详细实现

https://github.com/hugohuang1111/fxcase/tree/master/assets/caseDissolve


---
转自: [HH](http://www.hugohuang.xyz/)

