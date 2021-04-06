---
title: 开源协议
date: 2021-04-06
author: hugo
tags:
    Open Source Protocol
---

开源协议类型与区别


### GPL (GNU General Public License)

使用源软件的类库引用（源代码）、改变（修改了源代码）的新软件，也必须采用GPL进行授权。就是说，只要使用了GPL开源软件的源代码或拿它的源代码进行了修改而编写的新的软件，也必须加入到GPL的阵营。很明显，不能拿GPL授权的开源东东来做商业软件。这个协议有个好处，就是极大增加了使用GPL的软件的数量。采用GPL授权的软件有：Linux、MySQL等。

* 商用不友好

# LGPL (Lesser GPL)

相比GPL的严格，LGPL要温和很多。可以通过引用类库的方式（不是直接使用源代码）拿LGPL授权的东东来重新开发商业软件。如果是要修改源代码，是相应的修改和衍生出来的代码都要使用LGPL开放源代码。采用LGPL的软件有：JBoss、Hibernate、FCKeditor等。

* 可以引用类库形式来商用

# APL (apache Licence vesion 2.0)

适用于商业软件，允许修改代码后再发布（不用开放源代码）。采用APL的软件有Hadoop、Apache HttpServer等。

* 商用友好

# BSD (Berkeley Software Distribution)

这个协议的要求很宽松，允许他人修改和重新发布代码，可以在此基础上开发出商业软件进行销售。所以，此协议适用于商业软件。采用BSD协议的软件最著名的有nginx。

* 商用友好

# MIT (Massachusetts Institute of Technology)

又称X11协议。MIT与BSD类似，但是比BSD协议更加宽松，算是目前限制最少的协议了。这个协议唯一的条件就是在修改后的代码或者发行包包含原作者的许可信息。适用商业软件。采用MIT的软件有：jquery、Node.js

* 商用友好


开源协议一张图

![](@assets/202104/protocols.jpg)

参见引用: https://blog.csdn.net/testcs_dn/article/details/38496107

---
转自: [HH](http://www.hugohuang.xyz/)
