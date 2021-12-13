---
title: 在 Docker 的容器(Container)里访问主机(Host)上 mysql
date: 2021-12-13
author: hugo
tags:
    docker
---

## 前言

最近在帮朋友找一个工单系统, 在 Docker 的部署中遇到了在容器(Container)中要访问主机(Host)中的 mysql 的问题.
而且因为我自己开发用的是 Mac , 生产环境用的是 Ubuntu . 而恰恰在这两个环境中, Docker 的容器(Container)去访问主机(Host)还不一样.
遇到了很多坑, 这里特地记录一下.

## 目标

我在环境是在 Docker 中运行我的服务程序, 然后在容器中的服务程序所依赖的 mysql 是放在外部的主机上的. 那么我就需要在容器中访问主机.

## 配置方法

### Mac

在 Mac 中, 容器中用 `host.docker.internal` 代替以前的 `127.0.0.1` 就可以了.


### Ubuntu

在 Ubuntu 中, 有一种简单的, 在 `docker run xxx` 里加上 `--network host` 参数, 就可以在容器(container)里直接访问通过 `127.0.0.1` 访问到主机(Host)上的 mysql 了. 但是 `--network host` 与 `-p` 是冲突的, 而我又需要用 `-p` , 所以我换了一种方式:

* 修改 `/etc/mysql/my.cnf` , 添加以下配置:

```
[mysqld]
bind-address=0.0.0.0
```

不加这个配置, mysql 是监听的 `127.0.0.1` , 只能本地访问 mysql .
改成 `0.0.0.0` , 这样就可以远程访问了.

* 将 mysql 中的用户名限定到 ip . 在 mysql 中运行如下

```
RENAME USER ferry@localhost TO ferry@172.18.0.2;
```

以前的 ferry 这个帐号只能从本地 localhost 访问, 改成可以从 `172.18.0.2` 这个 ip (这个IP就是 docker 容器的的IP)来访问.

* 在容器 Container 中通过 `172.18.0.1` 访问主机(Host) 上的 mysql .

这里的 `172.18.0.1` 就是容器的 gateway . 这里给出一个查看 gateway 的方法. 在主机(Host)上运行如下命令就可以看到

```
ifconfig docker0
```

至此, 再以正常的路径布署你的 Docker 程序就可以了.


## 总结

对于 Ubuntu/Linux 上访问主机(Host) 上的 mysql 总结如下:
* 让 mysql 监听 `0.0.0.0` , 这样所有 ip 都可以访问
* 查 Docker 中 Container 的 gateway , 这样才能知道在容器中应该访问哪个 ip ,才能访问到 mysql
* mysql 中的帐号需要绑定到容器上的 ip, 这样才有访问权限.


---
转自: [HH](http://www.hugohuang.xyz/)

