---
title: 在 mac 上查看文件的 md5/sha1/sha256
date: 2020-05-13
author: hugo
tags:
    mac
---


* 查看 md5

```bash
md5 path/to/file
```

* 查看 sha1

```bash
openssl dgst -sha1 path/to/file
```

* 查看 sha256

```bash
openssl dgst -sha256 path/to/file
```

---
转自: [HH](http://www.hugohuang.xyz/)
