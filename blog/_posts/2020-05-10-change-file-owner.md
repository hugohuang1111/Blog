---
title: ubuntu 修改文件所有者
date: 2020-05-10
author: hugo
tags:
    linux
---


修改文件所有者的命令是: chown

用法:

```bash
chown -R another_user file_or_folder
```
这个命令将 `file_or_folder` 的 owner 修改为 another_user,
其中 -R 是递归把 file_or_folder 下所有文件都修改, 只修改这一个文件，可能不要 -R

```bash
chown -R another_user:another_group file_or_folder
```
这个命令将 `file_or_folder` 的 owner 修改为 another_user, 用户组修改为 another_group
其中 -R 是递归把 file_or_folder 下所有文件都修改, 只修改这一个文件，可能不要 -R

修改文件所属用户组: chgrp

```bash
chgrp -R another_group file_or_folder
```
这个命令将 `file_or_folder` 的 group 修改为 another_group
其中 -R 是递归把 file_or_folder 下所有文件都修改, 只修改这一个文件，可能不要 -R
