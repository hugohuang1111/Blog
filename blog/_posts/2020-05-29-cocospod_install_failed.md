---
title: Cocoapod install Crashlytics failed
date: 2020-05-28
author: hugo
tags:
    mac, cocoapod
---

使用 cocoapod 时，遇到了如下几个错误:

```bash
[!] Error installing Crashlytics
[!] /usr/bin/curl -f -L -o /var/folders/n0/33vfwqb116g2k7cgrp66m27w0000gn/T/d20200529-3811-1mwzue8/file.zip https://kit-downloads.fabric.io/cocoapods/crashlytics/3.14.0/crashlytics.zip --create-dirs --netrc-optional --retry 2

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:01:07 --:--:--     0
curl: (35) LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to kit-downloads.fabric.io:443
```


```
[!] Error installing Fabric
[!] /usr/bin/curl -f -L -o /var/folders/n0/33vfwqb116g2k7cgrp66m27w0000gn/T/d20200529-4228-12euhjq/file.zip https://kit-downloads.fabric.io/cocoapods/fabric/1.10.2/fabric.zip --create-dirs --netrc-optional --retry 2

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:01:06 --:--:--     0
curl: (35) LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to kit-downloads.fabric.io:443
```

从log来看，应该是联接 https://kit-downloads.fabric.io 失败了.

那么可以做如下这几种尝试:

1. 
运行如下命令
```bash
echo insecure >> ~/.curlrc
```

cocospod install 完装完成，记得把上面这个 .curlrc 中的 insecure 删除掉哦, 以免影响其它操作.

2. 如果第一种方法还不行, 那就上&梯&子&吧

---
转自: [D34](http://www.d34.xyz/)
