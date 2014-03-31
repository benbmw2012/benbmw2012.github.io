---
layout: post
title: "搭建nginx+tornado+supervisor+mongodb环境"
date: 2014-03-27 09:52:34 +0800
comments: true
categories: [tech, python web] 
---

最近做一个项目需要用到传说中的`云计算`，云计算是什么？打个比方，回到电气时代，以前是自家买爱迪生的直流发电机给自家发电，后来有了交流电，变成了发电厂发电然后供电给各家，这个发电厂其实就是电气时代的云平台，有了这个云平台，就降低了各家的用电成本，能让越来越多的人用上电。

作为一个程序员，大家一定听说过百度的bae，新浪的sae，谷歌的gae，这些其实就是云计算的一种表现形式。某大公司有一大堆服务器，怎么开放给小公司或者个人使用呢？首先要把基本的开发环境搭建好，然后弄一套自家的开发框架出来，开发者只需要用git把本地的代码push上去就可以，这就是所谓的`应用引擎`。云计算还有一种表现形式就是像阿里云服务器、谷歌的compute engine这种，直接给你一台Linux服务器。我个人还是比较偏向第二种，用起来比较自由。

今天来介绍一下在一台装了centos的服务器上搭建python web环境。

## 安装nginx服务器，它负责为tornado做负载均衡
- 在命令行执行如下命令：
``` bash
vim /etc/yum.repos.d/nginx.repo
```
- 填写如下文本内容：
``` bash 
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=0
enabled=1
```
- 在命令行执行yum命令安装nginx：
``` bash 
yum install nginx
```
- 配置防火墙，允许80端口：
``` bash
iptables -I INPUT -p tcp --dport 80 -j ACCEPT
```
- 启动nginx：
``` bash
/etc/init.d/nginx start
```
## 安装setuptools
- 在命令行执行如下命令：
``` bash
wget https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py -O - | python
```
## 安装tornado
- 首先安装pip，在命令行执行如下命令：
``` bash
sudo yum install python-pip
```
- 然后安装tornado，在命令行执行如下命令：
``` bash
sudo pip install tornado
```
## 安装supervisor
- 在命令行执行如下命令：
``` bash
sudo pip install supervisor
```
## 安装mongodb
- 在[mongodb官方站点](http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/RPMS/)下载mongo-10gen-server-2.4.9-mongodb_1.x86_64.rpm和mongo-10gen-2.4.9-mongodb_1.x86_64.rpm，然后使用sudo rpm -ivh安装即可。

## 安装pymongo
当然也可以选择mongoengine。
- 在命令行执行如下命令：
``` bash
sudo pip install pymongo
```
## 生产环境的配置
- 首先是nginx的配置，nginx在这里主要的作用是做负载均衡，把请求分配给多个tornado进程。nginx的配置文件如下：
``` bash
http {
    charset utf-8;
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    keepalive_timeout  65;
    proxy_read_timeout 200;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    gzip on;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml
               application/x-javascript application/xml
               application/atom+xml text/javascript;
    proxy_next_upstream error;
    upstream a2bgeektest {
        server 127.0.0.1:8001;
        server 127.0.0.0:8002;
        server 127.0.0.1:8003;
    }
    server {
        listen       80;
        client_max_body_size 50M;
        location ^~ /static/ {
            root /srv/http/static;
            if ($query_string) {
                expires max;
            }
        }
        location / {
            proxy_pass_header Server;
            proxy_set_header Host $http_host;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Scheme $scheme;
            proxy_pass http://a2bgeektest;
        }
    }
}
```
- 接下来使用supervisor启动并管理tornado进程
在命令行使用vim新建并编辑一个配置文件/etc/supervisor/conf.d/test.conf，内容如下：
``` bash
[program:a2bgeektest]
command = python /srv/http/a2bgeektest/tornadoapp.py --port=80%(process_num)02d ; 
autorestart = true
autostart = true
numprocs = 3
process_name = %(program_name)s-%(process_num)02d
stdout_logfile = /var/log/a2bgeektest/tornadoapptest.log
redirect_stderr = true
```
然后在命令行下执行：
``` bash
sudo supervisord -c /etc/supervisor/supervisord.conf
sudo supervisorctl reload
sudo supervisorctl start all
```
就可以启动3个同样的tornado进程。
> 好了，今天就到这里，欢迎拍砖。
