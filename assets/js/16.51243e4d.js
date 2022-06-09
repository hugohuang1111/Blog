(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{460:function(t,e,a){t.exports=a.p+"assets/img/videogl.d9f470a2.gif"},520:function(t,e,a){"use strict";a.r(e);var r=a(10),v=Object(r.a)({},(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h2",{attrs:{id:"效果"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#效果"}},[t._v("#")]),t._v(" 效果")]),t._v(" "),r("p",[t._v("话不多说, 先看效果, 在一个旋转的立方体上的播放视频.")]),t._v(" "),r("p",[r("img",{attrs:{src:a(460),alt:"VideoGL"}})]),t._v(" "),r("h2",{attrs:{id:"前言"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#前言"}},[t._v("#")]),t._v(" 前言")]),t._v(" "),r("p",[t._v("这里主要介绍如何使用 Creator3 在 WebGL 中播放视频.")]),t._v(" "),r("p",[t._v("为什么会在 WebGL 中呢, 主要是为了适合在游戏中想播放一段视频, 同时又需要在视频上层放置一些游戏元素时, 那么将 Video 播放在视频中就是一个很正常上的需求了.")]),t._v(" "),r("h2",{attrs:{id:"原理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#原理"}},[t._v("#")]),t._v(" 原理")]),t._v(" "),r("p",[t._v("其实从原理上来说, 基本都是同一套原理")]),t._v(" "),r("ol",[r("li",[t._v("解析视频, 得到视频帧 (解析视频有很多方法, 比如 ffmpeg, html 上可以直接使用 video 组件来解析)")]),t._v(" "),r("li",[t._v("将视频帧同步到 WebGL 中")])]),t._v(" "),r("p",[t._v("本文的实现手法是在 Creator3 上, 同时目前只支持 WebGL , 所以在解析视频采用 html video 组件来解析.")]),t._v(" "),r("p",[t._v("对于在将视频帧同步到 WebGL 中, 这也会因演示所在平台而定, 基本实现大同小异, 本文是在 Creator 3 中, 具体实现可见文末的代码仓库.")]),t._v(" "),r("h2",{attrs:{id:"使用"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#使用"}},[t._v("#")]),t._v(" \b使用")]),t._v(" "),r("p",[t._v("在代码中, 我给出一个 videogl 的组件, 如果需要, 完全可以将 videogl 文件夹放到你的 Creator 工程中, 在你要播放视频的结点上添加 videogl 脚本. 然后就可以在 WebGL 中播放视频了.")]),t._v(" "),r("h2",{attrs:{id:"仓库地址"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#仓库地址"}},[t._v("#")]),t._v(" 仓库地址")]),t._v(" "),r("p",[t._v("https://github.com/hugohuang1111/videogl")]),t._v(" "),r("hr"),t._v(" "),r("p",[t._v("转自: "),r("a",{attrs:{href:"http://www.hugohuang.xyz/",target:"_blank",rel:"noopener noreferrer"}},[t._v("HH"),r("OutboundLink")],1)])])}),[],!1,null,null,null);e.default=v.exports}}]);