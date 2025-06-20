---
title: 计算文件夹下的文件行数
date: 2021-04-06
author: hugo
tag:
    - Source
    - Python
---

计算给定文件夹下, 所以文件的行数

源码如下, python 编写, 支持 python2.7, python3

```python
#!/usr/bin/env python3

import os
import sys
import traceback

def calcLines(filePath):
    lines = -1
    with open(filePath) as f:
        try:
            lines = len(f.readlines())
        except:
            lines = -1

    return lines

def main(argv):
    if len(argv) < 2:
        raise Exception("should be `wc.py path/to/want/to/counter`")
    rootPath = argv[1]
    print("")
    print("Lines   <=   FilePath")
    print("---------------------")
    for root, dirs, files in os.walk(rootPath):
        for file in files:
            filePath = os.path.join(root, file)
            calcLines(filePath)
            print("{0} <= {1}".format(calcLines(filePath), filePath))
    print("")

if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as e:
        traceback.print_exc()
        sys.exit(1)

```

### 如何使用

将上面的源码保存成文件 `wc.py` (当然你也可以定为其它名字).
然后你想运行得到 `/User/hugo/test` 这个文件夹下所有文件的行数, 然后在命令行中运行 `wc.py /User/hugo/test` 就可以了.

### 高级

如果你有其它需求

hugohuang1111@gmail.com
QQ: 402723933
Wechat: hugohuang1111

---
转自: [HH](http://www.hugohuang.xyz/)
