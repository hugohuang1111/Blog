---
title: 如何避免游戏被破解
date: 2021-07-20
author: hugo
tags:
    creator, crack
---

## 前言

这里主要讲解如何避免你的 Creator 游戏被破解

## 分析

我们先来分析一下 Creator 中 js 加密是如何做的.

1. 在 Creator 中构建 iOS/Android 工程的面板中, 我们可以勾选是否加密, 同时在这里 Creator 默认生成了一个密钥.
2. 点击构建后, Creator 会把 js 代码编译成 jsc
3. 然后在游戏运行时, 通过密钥来解析 jsc

这里面最重要的就是密钥, 如下是解密的密钥的传入代码:

AppDelegate.cpp
```cpp
bool AppDelegate::applicationDidFinishLaunching()
{
    ...
    jsb_set_xxtea_key("336d2c2c-1202-49");
    jsb_init_file_operation_delegate();
    ...
}
```

从这里我们可以知道, 密钥是以一个静态字符串直接传入, 而 AppDelegate.cpp 最终会出现在编译到 `libcocos2djs.so` 文件中.

## 破解

因为密钥是以字符串中的形式存在在 `libcocos2djs.so` 中, 我写了以下这个 Python3 的脚本, 来查找密钥

`fetchpw.py`:
```python
#!/usr/bin/env python

import re

fo = open("./libcocos2djs.so", "rb")

candidatePWs = []
pwStr = ""

def appPW(pw):
    if len(pw) > 10 and len(pw) < 20:
        candidatePWs.append(pw)

while(True):
    hexs = fo.read(100)
    readLen = len(hexs)
    if 0 == readLen:
        break
    for i in range(readLen):
        if (hexs[i] > 32 and hexs[i] < 126):
            pwStr += chr(hexs[i])
        else:
            appPW(pwStr)
            pwStr = ""

appPW(pwStr)
pwStr = ""

fo.close()

# just keep str which include '-'
candidatePWs = list(filter(lambda strpw: True if 2 == len([m.start() for m in re.finditer('-', strpw)]) else False, candidatePWs))

# just keep str length is 16
candidatePWs = list(filter(lambda strpw: 16 == len(strpw), candidatePWs))

# just keep str 12345678-1234-12
candidatePWs = list(filter(lambda strpw: '-' == strpw[13] and '-' == strpw[8], candidatePWs))

print('Candidate password:')
print(candidatePWs)
```

运行结果:

```bash
hugo@earth creatorTest % python3 ./fetchpw.py
Candidate password:
['336d2c2c-1202-49']
```

从这个脚本的逻辑也很简单, 读 so 文件, 并取出所有的字符串, 然后选择 Creator 默认密钥格式的字符串.

## 如何加固

破解与加固永远是永恒的话题. 没有永远的加固方法, 也没有永远的破解方法. 这里我给出几种方法, 以供参考.

1. 自己实现加密, 解密逻辑
2. 使用一些第三方提供的加密方案, Cocos Store 中就有很多插件
3. 在现有默认的方案上加大一些破解的难度

第一种自己实现比较麻烦, 可以找网上的一些方案.
第二种就是依赖于具体的插件方了
第三种我这里给出一些具体方案, 可以作为临时解决

从以上我们的破解查找密钥可以看出来, 能找到密钥主要是因为这个密钥是一个静态字符串, 那么我们可以动态生成, 这样不能通过 Python 脚本一搜就找到了. 同时 Creator 的默认密钥都是固定格式 12345678-1234-12 , 那么我们可以用其它字符串, 比如一个像函数的名的密钥 getMaxValue&NCStr 之类.

1. 不要使用 Creator 默认的密钥
2. 不要在 cpp 中直接用静态字符串传值, 比如下面这样(这只是一个例子, 如果你要在商业项目中使用, 请按你自己的方式来动态拼密钥)

```cpp
std::string getMaxValue() {
    std::ostringstream oss;
    oss << "p";
    oss << "a";
    oss << "s";
    oss << "s";
    oss << "w";
    oss << "o";
    oss << "r";
    oss << "d";

    return oss.str();
}

jsb_set_xxtea_key(getMaxValue());
```

## 后记

这里并不是要教大家怎么破解别人的游戏, 而是要告诉大家默认的方案很容易被破解, 知道了怎么被破解, 就知道了可以怎么防护.
最后能用专业的加固还是用专业的加固方案吧.


---
转自: [HH](http://www.hugohuang.xyz/)

