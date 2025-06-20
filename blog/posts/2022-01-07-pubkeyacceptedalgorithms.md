---
title: pubkeyacceptedalgorithms 错误
date: 2022-01-07
author: hugo
tag:
    - ssh
---

## 问题

今天在使用 git push 到 gerrit 时, 遇到了 ".ssh/config: line 4: Bad configuration option: pubkeyacceptedalgorithms" 这个错误.
找到了很多地方, 终于找到了原因.

## 原因

根本原因是 GIT 2.33.1 版本集成了最新的 OpenSSH v8.8 版本，而此版本放弃了历史相当悠久的 `rsa-sha1` 的支持。

网络上对此的一个方案是创建一个文件 ".ssh/config" , 并在文件中写入

```
Host git.xxxxxx.com
HostkeyAlgorithms +ssh-rsa
PubkeyAcceptedAlgorithms +ssh-rsa
```

这个方法对于我却没有效果, 反而还会出现上面那个错误 `Bad configuration option: pubkeyacceptedalgorithms`.

## 解决

即然 `rsa-sha1` 不能用了, 那就要换一种更安全的方式吧.


```bash
# ssh-keygen -t rsa -C "hugo@dev" # rsa-sha1 加密方式
ssh-keygen -t ed25519 -C "hugo@dev" # ED25519 加密方式
```

## 参考
* https://gitee.com/help/articles/4352
* https://confluence.atlassian.com/bitbucketserverkb/ssh-rsa-key-rejected-with-message-no-mutual-signature-algorithm-1026057701.html
* https://git-scm.com/docs/gitfaq#_credentials


---
转自: [HH](http://www.hugohuang.xyz/)

