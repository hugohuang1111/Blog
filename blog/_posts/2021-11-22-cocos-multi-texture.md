---
title: Cocos Creator 多纹理不影响合批支持方案
date: 2021-11-22
author: hugo
tags:
    cocos
---

## 前言

相信很多小伙伴已经看过江南百景图(后文简称江百)发布的关于在使用 Cocos Creator 中所使用的优化方法了.
在这些方法中, 大家肯定对其中江百提到的 Multi-Tex 方法印象深刻.
这个方案的主要目的就是解决 Creator 中会因为纹理不同而打断合批的这种情况.

我们都知道, 在 `Cocos` 中, 要降低 `DrawCall` , 就要让我们的 `Renderable2D` 合批. 而合批是有各种条件限制的, 比如材质, layer, blend 状态等等. 而这其中最主要的一个条件就是能合批的 `Renderable2D` 必须使用的是同一个 texture . 但现实中我们的渲染结点被打断的原因往往就是纹理不一致.

本次我们会参考江百的 Multi-Tex 方案, 让 `Renderable2D` 支持多纹理合批.

同时在实现 Multi-Tex 这个方案时, 我增加了一个限制, 在 CocosCreator 3.x 上, 同时不使用自定义引擎.

## 效果

![MultiTex](@assets/202111/multitex.jpg)

上图中, 笑脸, 绵羊, 信息图标是来自于三个不同的纹理. 但是可以看到他们的 DrawCall 为 2.

## 思路

### 现有的合批流程

![BatchFlow](@assets/202111/multitex_batch_flow.jpg)

所有的 RendererComp 都会经过 commitComp 这一步, 在这里面判断能否和上一次的 RendererComp 合批.

判断通过就合批, 没通过就提交并开启新的合批.

### 改动方案

整个改动的逻辑其实都是围绕着合批这一操作来展开的. 最关键的步骤, 我认为有如下三步:

* 首先我们把 `commitComp` 中的单纹理判断改成多纹理判断
* 然后在合批通过后, 我们还需要把对应的多张纹理传到 `Descriptor` 中
* 最后当然还需要一个定制化的 `shader` 来接受传过来的多张纹理, 并在 `shader` 中选择当前的纹理去采样

关于如何在 `shader` 中得知, 当前应该选择哪张纹理, 在这个方案中, 我们取了一个巧, 将纹理索引值放在顶点属性的颜色位.
(这就留下了一坑, 如何在 Cocos 中增加自定义顶点属性)

## 关键实现步骤

因为我们有不使用自定义引擎这一限制(不定制引擎, 以后可以直接升级), 但是合批相关的处理, 又是引擎内部的实现.

所以我在如下的实现步骤中会 hook 引擎私有变量, 函数, 也因为用到了**私有**变量,函数, 所以在升级引擎时, 需要特别关注这一块

(但是我以为这也比直接去自定义引擎后, 再来升级来得快些).

### 多纹理合批判断

改动后 `commitComp` 支持多纹理, 主要有两个地方需要注意:
* 判断合批时的纹理判断改成了多纹理
* 把当前的 Sprite 使用的纹理的索引值放在顶点属性的颜色位

以下为改动后的源码:

```typescript
public static commitComp(comp: Renderable2D, frame: SpriteFrame | null, assembler: any, transform: Node | null) {

    ...

    const mtBatcher = this.mtBatcher as any as MTBatcher2D
    const isMTSprite: boolean = comp._isMTSprite || false;

    // 在这里增加多纹理的判断支持
    if (this._currScene !== renderScene
        || this._currLayer !== comp.node.layer
        || this._currMaterial !== mat
        || this._currBlendTargetHash !== blendTargetHash
        || this._currDepthStencilStateStage !== depthStencilStateStage
        || this._currTransform !== transform
        || mtBatcher.curIsMTSprite !== isMTSprite
        || !mtBatcher.canBatchTexture(texture, textureHash, isMTSprite ? MTBatcher2D.GL_MAX_Texture : 1)
        || !mtBatcher.canBatchSampler(samp, samplerHash, isMTSprite ? MTBatcher2D.GL_MAX_Texture : 1)
        ) {
        this.autoMergeBatches(this._currComponent!);
        mtBatcher.reset();
        mtBatcher.addTexture(texture, textureHash);
        mtBatcher.addSampler(samp, samplerHash);
        mtBatcher.curIsMTSprite = isMTSprite;

        ...
    }

    // 如果是多纹理, 把纹理的索引值放在顶点属性的颜色位
    if (isMTSprite) {
        const sp = comp as Sprite;
        sp.color = new Color(mtBatcher.getTexturesIdx(textureHash));
    }
    ...
}
```

### Descriptor 中传入多纹理

合批判断后, 还需要把这一批次中的多张纹理传到我们的自定义 `shader` 中.

如下为把多纹理传入到 `Descriptor` 中的源码相关改动.

```typescript
function(batch: any) {
    const ds = origin_getDescriptorSet.call(this, batch);
    if (batch.fromMTSprite) {
        const pass = batch.passes[0];
        for (let i = 1; i < mtBatcher.textures.length; i++) {
            const texName = "spriteTexture" + i;
            if (mtBatcher.texBindingMap.has(texName)) {
                const binding = mtBatcher.texBindingMap.get(texName);

                // 传入对应的多张纹理
                if (mtBatcher.textures[i]) {
                    pass.bindTexture(binding, mtBatcher.textures[i]);
                }
                if (mtBatcher.samplers[i]) {
                    pass.bindSampler(binding, mtBatcher.samplers[i]);
                }
            }
        }
    }

    return ds;
}
```

### 多纹理 Shader 实现

我们的自定义 Shader 中

* `Vertex Shader`: 与正常类似(类似的意思, 就是可以直接用 Coocos 中内置的 Sprite-default.effect 中的代码)

* `Fragment Shader`: 大体也是与正常类似, 不同的地方就是, 需要添加纹理相关的了, 比如用到的所有纹理声明. 然后根据当前顶点颜色属性对应的纹理索引值, 使用相应的纹理来采样.

```glsl
CCProgram sprite-fs %{
    ...

  #if USE_TEXTURE
    in vec2 uv0;
    #pragma builtin(local)
    layout(set = 2, binding = 10) uniform sampler2D cc_spriteTexture;

    // 声明所有会用到的纹理, 从这里也可以看出来, 我们最多支持 8 个纹理
    uniform sampler2D spriteTexture1;
    uniform sampler2D spriteTexture2;
    uniform sampler2D spriteTexture3;
    uniform sampler2D spriteTexture4;
    uniform sampler2D spriteTexture5;
    uniform sampler2D spriteTexture6;
    uniform sampler2D spriteTexture7;

  #endif


  float getCalVal(float texID) {
    return step(-0.5, -step(texID, -0.5) - step(0.5, texID));
  }

  vec4 frag () {
    vec4 o = vec4(1, 1, 1, 1);

    #if USE_TEXTURE
      float texID = color.x * 255.;

        // 这里提供了两种方法, 两种方法都在做同一件事, 根据纹理索引值 textID ,来采样对应的纹理.
        // 按你的风格, 喜欢哪个选哪个.

        // way 1
        /*
        if (texID == 0.0) {
            o = texture(cc_spriteTexture, uv0);
        } else if (texID == 1.0) {
            o = texture(spriteTexture1, uv0);
        } else if (texID == 2.0) {
            o = texture(spriteTexture2, uv0);
        } else if (texID == 3.0) {
            o = texture(spriteTexture3, uv0);
        } else if (texID == 4.0) {
            o = texture(spriteTexture4, uv0);
        } else if (texID == 5.0) {
            o = texture(spriteTexture5, uv0);
        } else if (texID == 6.0) {
            o = texture(spriteTexture6, uv0);
        } else if (texID == 7.0) {
            o = texture(spriteTexture7, uv0);
        }
        */

        // way 2
        o = vec4(0., 0., 0., 0.);
        o += getCalVal(texID) * CCSampleWithAlphaSeparated(cc_spriteTexture,  uv0);
        texID -= 1.;
        o += getCalVal(texID) * CCSampleWithAlphaSeparated(spriteTexture1, uv0);
        texID -= 1.;
        o += getCalVal(texID) * CCSampleWithAlphaSeparated(spriteTexture2, uv0);
        texID -= 1.;
        o += getCalVal(texID) * CCSampleWithAlphaSeparated(spriteTexture3, uv0);
        texID -= 1.;
        o += getCalVal(texID) * CCSampleWithAlphaSeparated(spriteTexture4, uv0);
        texID -= 1.;
        o += getCalVal(texID) * CCSampleWithAlphaSeparated(spriteTexture5, uv0);
        texID -= 1.;
        o += getCalVal(texID) * CCSampleWithAlphaSeparated(spriteTexture6, uv0);
        texID -= 1.;
        o += getCalVal(texID) * CCSampleWithAlphaSeparated(spriteTexture7, uv0);

    #endif

    ALPHA_TEST(o);
    return o;
  }
}%
```

到这里, 我们的这个 `Multi-Tex` 的整体实现流程与关键点都讲完了.

## Multi-Tex 插件使用

我在实现这个 `Multi-Tex` 这个方案时, 就再想不是可以做到尽量可复用.

如下介绍一下, `Multi-Tex` 的整体框架与使用.

* Multi-Tex 主要有以下几个文件:
    1. MTBatcher2D.ts   // 对现在引擎中的 Batch2D 的 hook 实现, 不需要直接调用
    2. MTSprite.ts      // 对于要支持 Multi-Tex 的 Sprite 需要添加这个 Component
    3. MTTex.ts         // 需要全局唯一, 可以挂在 main Camera 上
    4. multitex.effect  // 支持多纹理的 Effect
    5. multitex.mtl     // 支持多纹理的 Material, 应该赋值到 MTTex 上.

* 使用步骤:
    1. 将 MTTex 挂在 main Camera 上
    2. 将 multitex.mtl 赋值给 MTTex 的属性上
    3. 将 MTSprite 挂在需要支持 Multi-Tex 的 Sprite 上
    4. Done, 看一下 DrawCall.

## 仓库

详细实现与 Demo 可以查看这里

https://github.com/hugohuang1111/fxcase/tree/master/assets/caseMultiTex


---
转自: [HH](http://www.hugohuang.xyz/)

