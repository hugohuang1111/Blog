---
title: Argument value 10880 is outside the valid range [0, 255]
date: 2020-05-09
author: hugo
tag:
    - cocos2d
---

用 Xcode 编译 Cocos2d 工程时遇到的错误:

`Argument value 10880 is outside the valid range [0, 255]`

可以尝试以下方法:

btVector3.h 中

将

```cpp
#define BT_SHUFFLE(x,y,z,w) ((w)<<6 | (z)<<4 | (y)<<2 | (x))
```

改为

```cpp
#define BT_SHUFFLE(x,y,z,w) (((w)<<6 | (z)<<4 | (y)<<2 | (x)) & 0xff)
```

---
转自: [HH](http://www.hugohuang.xyz/)
