const path = require("path");
module.exports = {
    title: 'D34',
    description: "hugo's blog",
    head: [
        ['script', {}, `
            var _hmt = _hmt || [];
            (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?73b3ee336eca944dde6626b6cd8fece8";
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
            })();
        `]
    ],
    theme: '@vuepress/theme-blog',
    themeConfig: {
        sitemap: {
            hostname: "https://d34.xyz/"
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
    }
}
