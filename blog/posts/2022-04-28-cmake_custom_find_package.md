---
title: CMake 自定义库查找
date: 2022-04-27
author: hugo
tag:
    - cmake
---

## 背景

最近遇到一个需求,需要自定义 find_package 的实现. 特此记录一下. 在这个文章里, 我用 ZLIB 来作为演示的例子.

比如: 我们现在有这样一种情况, 有一个工程 P , 它依赖了库 ZLIB, LibA, LibB, 同时 LibA, LibB又依赖于 ZLIB.

               Project
                 │
 ┌───────────────┼───────────────┐
 │               ▼               ▼
 │             LibA            LibB
 │               │               │
 ▼               ▼               ▼
ZLIB            ZLIB           ZLIB


这里我们可以把 ZLIB 安装在系统库中, 这样我们在 Project/LibA/LibB 中直接使用 find_package(ZLIB) 就可以找到 ZLIB , 但是, 如果我们想要把 ZLIB 放在 Project 工程中或一个自定义的目录下, 但是又不想改动 LibA, LibB 中的查找的方式, 那么我们就需要用到自定义的 find_package 了.

## find_package 的库查找

要想自定义 find_package , 我们首先要了解 cmake 中 find_package 的运行方式. cmake 中的 find_package 其实最终会调用 cmake 中的一个 FindXXX.cmake 的脚本. 如果调用用了 find_package(ABC) , 那么最终就会在 cmake 中找到 FindABC.cmake 并运行, 最终也是 FindABC.cmake 来实现 ABC 这个库的查找.

所以从这个查找逻辑基本就明白了, cmake 内置的 FindXXX.cmake 只会是最常用的一些库, 而且也只能找到固定的位置. 所以我们在使用 find_package 中, 经常会遇到失败的时候, 就是这个原因.

所以我们在很多时候都会自定义 FindXXX.camke 来自己实现库的头文件/库文件的查找. 比如这里我们就会自己实现一个 FindZLIB.cmake 来查找自己的 zlib 库.

## FindXXX.camke 的实现

所有的 FindXXX.cmake 脚本, 其实最终就是在给 XXX_INCLUDE_DIR, XXX_LIBRARY, XXX_INCLUDE_DIRS, XXX_LIBRARIES, XXX_FOUND 赋值.

这里给出一个极简的 FindZLIB.cmake 的例子

```cmake
set(ZLIB_INCLUDE_DIR path/to/zlib/include)
set(ZLIB_LIBRARY path/to/zlib/lib)

set(ZLIB_INCLUDE_DIRS ${ZLIB_INCLUDE_DIR})
set(ZLIB_LIBRARIES ${ZLIB_LIBRARY})

set(ZLIB_FOUND TRUE)
```

## 添加脚本路径

FindXXX.cmake 的脚本完成了, 我们还要让 cmake 能找到它, 当然可以把 FindXXX.cmake 放到 cmake 系统中(<CMAKE_ROOT>/share/cmake/Mdodules), 但是我们要是想放到自己的目录中, 比如工程目录, 就可以用以下方法

比如: 我们把自己的 FindZLIB.cmake 放在当前 CMakeList.txt 所在目录的 cmake 目录中,
```cmake
list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake")
```

---
转自: [HH](http://www.hugohuang.xyz/)

