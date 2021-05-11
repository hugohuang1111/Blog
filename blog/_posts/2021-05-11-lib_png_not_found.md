---
title: pngquant failed to build
date: 2021-04-27
author: hugo
tags:
    Jar
---

编译 Davinci webapp 时, 遇到了下面这个错

```
Error: pngquant failed to build, make sure that libpng is installed
```

正如这个错误提示所言, libpng 没有安装

在 Mac 中运行以下命令把, libpng 安装好就 OK 了.

```
brew install libpng
```

---
转自: [HH](http://www.hugohuang.xyz/)
