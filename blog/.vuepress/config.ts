import path from "path"
import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from 'vuepress'
import theme from "./theme.js";

export default defineUserConfig({
  base: "/Blog/",

  lang: "zh-CN",
  title: "HH",
  description: "Hugo's blog",

  theme,
});


/*
export default defineUserConfig({
    title: 'HH',
    description: "hugo's blog",
    head: [
        ['script', {}, `
            var _hmt = _hmt || [];
            (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?cffb1df3a4b288bdd0a77e64400c7861";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
            })();
        `],
        ['script', {
            async: 'async',
            "data-ad-client": "ca-pub-5506230384423010",
            src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        }, ``]
    ],
    base: '/Blog/',
    theme,
    theme: defaultTheme({
        blog: {

        },
        sitemap: {
            hostname: "https://hugohuang.xyz/"
        },
        dateFormat: 'YYYY-MM-DD',
        smoothScroll: true,
        nav: [
            { text: '文章', link: '/' },
            { text: '标签', link: '/tag/' },
            { text: '关于', link: '/about/' },
        ],
        footer: {
            contact: [
                {
                    type: 'github',
                    link: 'https://github.com/hugohuang1111',
                },
                {
                    type: 'gitee',
                    link: 'https://gitee.com/hugohuang1111',
                },
                {
                    type: 'mail',
                    link: 'mailto:hugohuang1111@gmail.com',
                },
            ],
            copyright: [
                {
                    text: 'Copyright © 2020',
                    link: ''
                }
            ]
        }
    }),
    alias: {
        "@assets": path.resolve(__dirname, "../assets")
    },
    bundler: viteBundler()
})
*/
