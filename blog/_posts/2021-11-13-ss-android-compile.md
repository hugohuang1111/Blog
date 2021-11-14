---
title: ShadowsocksAndroid工程的编译打包
date: 2021-11-14
author: hugo
tags:
    shadowsocks
---

## 前言

今天尝试了下把 ShadowsockAndroid 工程自主编译打包, 走了很多弯路, 试了好久才成功. 最后回过头来看, 其实也很简单.

## 前提条件

* Android系统6.0+的手机(Android SDK >= 23)
* 你的电脑已装好 Git 环境
* 你的电脑已装好 Rust 环境

## 步骤

### 检查 Rust 环境

在命令行中运行 `rustup --version` , 应该能得到如下的提示

```bash
rustup --version

rustup 1.24.3 (ce5817a94 2021-05-31)
info: This is the version for the rustup toolchain manager, not the rustc compiler.
info: The currently active `rustc` version is `rustc 1.54.0-nightly (dbe459ded 2021-06-02)`
```

### 给 Rust 配置国内镜像

* 添加环境变量

```bash
# 中国科学技术大学
RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
```

将以上内容放到你的 `bash_profile` 中就可以了 (Windows 的话, 加到环境变量中就行)

* 修改 cargo 的配置文件

找到 `~/.cargo/config` 文件(如果没有, 就自己创建一个, 同理, 在 Windows 上就是相应的位置, 个人目录下的 `.cargo/config`), 加入以下内容

```yml
[source.crates-io]
replace-with = 'ustc'

# 中国科学技术大学
[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
```


### 更新 Rust

这一步应该也不是必要, 根本实际情况, 自行判断吧
命令行中运行如下命令:

更新 rustup 自身
```bash
rustup self update
```

更新 rust
```bash
rustup update
```

### Clone ShadowSocks

克隆 ShadowSocks
```bash
git clone https://github.com/shadowsocks/shadowsocks-android.git
```

仓库的依赖别忘了更新
```bash
cd shadowsocks-android
git submodule update --init --recursive
```

### 添加 rust target

在 shadowsocks-rust 中添加target, 运行以下两个命令:

```bash
cd core/src/main/rust/shadowsocks-rust
```

```bash
rustup target add armv7-linux-androideabi aarch64-linux-android i686-linux-android x86_64-linux-android
```

### 编译 ShadowSocks

用 Android Studio 打开工程 shadowsocks-android , 联接手机.


这里要注意一点, shadowsocks-android 需要 JDK 11.
如果你的本机就是 JDK 11 , 那无事.
如果你的电脑是其它版本, 那么你可以直接替换(重新安装)本机 JDK 为 11.
同时还有一种方法, 在 Android Studio 中的工程设置中, 选择 Android Studio 中内置的 JDK 11.


直接开始编译吧.


理论上, 应该可以成功了.


---
转自: [HH](http://www.hugohuang.xyz/)

