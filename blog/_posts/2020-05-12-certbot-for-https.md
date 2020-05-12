---
title: 使用 certbot 在 nginx 上支持 https
date: 2020-05-12
author: hugo
tags:
    ubuntu
---


以下步骤需在 ubuntu 上使用

* nginx 已配置好, http 路径可访问

* 安装 certbot , terminal 中依次运行以下命令

    - sudo apt-get update;
    - sudo apt-get install software-properties-common;
    - sudo add-apt-repository ppa:certbot/certbot;
    - sudo apt-get update;
    - sudo apt-get install python-certbot-nginx;

* 使用 certbot 生成证书, 以下这个命令会自动修改 nginx:

    - sudo certbot --nginx

成功后会得到类似如下的片段:
```bash
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/d34.xyz/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/d34.xyz/privkey.pem
   Your cert will expire on 2020-08-10. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot again
   with the "certonly" option. To non-interactively renew *all* of
   your certificates, run "certbot renew"
```

* 现在应该就可以直接在浏览器打开你的域名的 https 了

* certbot 的证书有效期是 90 天, 所以注意到期更新


---
转自: [D34](http://www.d34.xyz/)
