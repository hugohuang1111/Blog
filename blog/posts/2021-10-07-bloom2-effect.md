---
title: bloom2 辉光特效
date: 2021-10-07
author: hugo
tag:
    - effect
---

## 前言

之前做过一次 bloom 辉光特效, 这次国庆节把整个后处理框架调整了一下, 更容易添加后处理效果.

## 效果与思路

先上效果图

![Bloom](@assets/202110/bloom2.png)

bloom 的实现就不说了, 上篇文章说过了, 这次说下这个后处理框架吧.
整个后处理的核心就是对渲染管线的调整.添加自定义的 stage . 我提供了一个 BaseStage ,自定义的 Stage 只需要继承它, 重写 init 就好了.

## 后处理介绍

1. PPMgr 会管理整个自定义的 Stage , 同时会处理一些基础功能.

2. PPBaseStage 是自定义 Stage 的基类.

3. 创建 Stage , 重写 initWithStageDesc

```typescript
export class PPThresholdStage extends PPBaseStage {

    constructor() {
        super();
        this._name = "PPThresholdStage";
    }

    public initWithStageDesc(mgr: PPMgr, pl: RenderPipeline) {
        this.paramTexs = ['screenTex'];
        this.outputTexName = 'tempTex';

        super.initWithStageDesc(mgr, pl);
    }
}
```

4. 将新的 Stage 加到 PPMgr 的 StageDesc 上


## 详细实现

https://github.com/hugohuang1111/fxcase/tree/master/assets/caseBloom2


---
转自: [HH](http://www.hugohuang.xyz/)

