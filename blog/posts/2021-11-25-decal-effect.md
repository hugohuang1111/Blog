---
title: 贴花效果
date: 2021-11-25
author: hugo
tag:
    - effect
---

## 前言

最近看到一个贴花效果, 感觉不错, 所以想自己来亲自实现一次.


## 效果

![Decal](@assets/202111/decal.gif)


## 思路

贴花的实现方式有很多, 我这里用了最常见, 也是适应性最好的一种方式.
基于点击位置, 作立方体裁剪, 然后裁剪下来的mesh作平面投影, 最后就得到了在二维平面的UV值.
最后用裁剪后的 mesh 生成新一个 meshrenderer , 再加上得到的 UV 值, 就可以把贴花贴到对应的模型上了.

## 关键实现步骤

### 找到模型上的触摸的位置

找模型的上触摸点, 最主要以下这两步, 找到从屏幕发射出去的射线, 取射线与模型的交点.

```typescript
this.mainCamera?.screenPointToRay(point.x, point.y, this._ray);
const intersectCount = geometry.intersect.rayModel(this._ray, mo, this.modOpt);
```

### 以触摸点为中心裁剪mesh

以触摸点为中心立方体的六个面来裁剪当前的 mesh

```typescript
// 其中一个面
this.decalVertexes = this.clipGeometrylByPlane(this.decalVertexes, new Vec3( 1, 0, 0 ), this.scale.x/2);
```

### 将mesh投影到平面上得到uv

然后以裁剪后的 mesh , 我们投影到面上, 再归一化, 就可以它投影后的值当 UV 用

```typescript
decalVertex.uv = new Vec2(
        0.5 + ( decalVertex.viewPos.x / this.scale.x ),
        0.5 + ( decalVertex.viewPos.y / this.scale.y )
    );
```

### 用裁剪后的mesh和uv生成新的mesh

最后我们用了新的 mesh, 同时也有了对应的 UV , 那么再加上我们要贴花的纹理, 就齐活了.


## 仓库

https://github.com/hugohuang1111/fxcase/tree/master/assets/caseDecals/method2


---
转自: [HH](http://www.hugohuang.xyz/)

