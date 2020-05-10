---
title: ssh-keygen 生成 ssh key
date: 2020-05-10
author: hugo
tags:
    linux
    git
---


生成 ssh key:

```bash
ssh-keygen -t rsa -C "test key"
```

ssh-keygen 可以生成 ssh key.
-t 密钥类型
-C 备注(备注最后会在公钥内容的结尾处)

