---
title: Cocos Creator 多纹理不影响合批支持方案
date: 2021-11-22
author: hugo
tags:
    cocos
---

## 前言

相信很多小灰伴已经看过江百的优化方案中提到的 multi-tex 方案. 这个方案的主要作用把因为纹理不同而打断合批这个很常见的因素去掉.

我们都知道, 在 Cocos 中, 要降低 DrawCall , 就要让我们的 RendererComp 可以合批. 而合批是有各种条件限制的, 最主要的一个条件就是合批必须要使用同一个 texture . 但现实中往往我们的渲染结点使用的纹理可能会不一致.

本次我们要按江百的 multi-tex 方案, 做一个对应的实现, 让 Cocos 支持多纹理的合批.

同时在实现 multi-tex 这个方案时, 我增加了一个限制, 在 CocosCreator 3.x 上, 同时不使用自定义引擎.

## 效果

![MultiTex](@assets/202111/multitex.jpg)

上图中, 笑脸, 绵羊, 信息图标是来自于三个不同的纹理. 但是可以看到他们的 DrawCall 为 2.

## 思路

### 现有的合批流程

```
RendererComp -> commitComp -> Set Descriptor -> DrawBatch2D -> WebGL
```

所有的 RendererComp 都会经过 commitComp 这一步, 在这里面判断能否和上一次的 RendererComp 合批.

可以合批, 就合批, 不能就会打断当前合批.

### 改动方案

我们现在要增加多纹理支持, 那么就需要在 commitComp 支持多纹理的判断.

后面的 DrawBatch2D 的 Set Descriptor 也需要把多张纹理传进去.

同时我们还需要定制化 Shader(也就是一个支持多纹理的Shader) . 在这个定制化的 Shader 中, 我们把当前使用的纹理索引值通过顶点属性的方式传到 Shader 中.

在这里我们取了一个巧, 将纹理索引值放在顶点属性的颜色位. (后面再写一个如何在 Cocos 中增加顶点属性的文章?)


## 关键实现步骤

因为有不使用自定义引擎这一限制, 同时我们对合批的处理, 又是引擎内部的实现.

因为这两个原因, 所以我们在实现步骤用到了一些私有的方法, 成员, 这样在升级引擎时, 需要关注到这一块.

### 多纹理合批判断

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

当 DrawBatch2D 是多纹理的时候, 在 Descriptor 中传入对应的多张纹理.

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

我们的自定义 Shader 中, 在 Vertex Shader 部分与正常类似(类似的意思, 就是可以直接用 Coocos 中内置的 Sprite-default.effect 中的代码)

在 fragment shader 中, 就需要把用到的所有纹理声明一遍了. 然后根据当前顶点对应的纹理索引值, 使用相应的纹理来采样.


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

        // 这后面一段, 都是在做一件事. 根据纹理索引值 textID ,来采样对应的纹理.
        // 为什么不用 if 判断?  只能说习惯吧.
        // 但是这里完全是可以用下面这一种方式的.
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

## Multi-Tex 插件使用

当我们想在自己的工程中尝试 Multi-Tex 时, 可以这样来.

* 先介绍一下 Multi-Tex 这个插件的内容:
    1. MTBatcher2D.ts   // 对现在引擎中的 Batch2D 的 hack 实现, 不需要直接调用
    2. MTSprite.ts      // 对于要支持 Multi-Tex 的 Sprite 需要添加这个 Component
    3. MTTex.ts         // 需要全局唯一, 可以挂在 main Camera 上
    4. multitex.effect  // 支持多纹理的 Shader
    5. multitex.mtl     // 支持多纹理的 Material, 应该赋值到 MTTex 上.

* 现在介绍一下使用的步骤
    1. 将 MTTex 挂在 main Camera 上
    2. 将 multitex.mtl 赋值给 MTTex 的属性上
    3. 将 MTSprite 挂在需要支持 Multi-Tex 的 Sprite 上
    4. Done, 看一下 DrawCall.

## 仓库

https://github.com/hugohuang1111/fxcase/tree/master/assets/caseMultiTex


---
转自: [HH](http://www.hugohuang.xyz/)

