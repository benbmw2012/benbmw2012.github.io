---
layout: post
title: "BeautifulSoup实战"
date: 2014-04-09 09:08:31 +0800
comments: true
categories: [tech, BeautifulSoup] 
---

最近有个项目要用天气数据，看了一些天气网站，决定从`中国天气网`上抓数据，`python`抓数据的框架我知道的不多，只听过`BeautifulSoup`，下面记录一下使用`BeautifulSoup`抓取数据的全过程。`BeautifulSoup`的文档见[BeautifulSoup官方文档](http://www.crummy.com/software/BeautifulSoup/bs4/doc/index.zh.html)。

## 这里大概介绍一下`BeautifulSoup`的用法，它和javascript的dom一样，把html文档看做一棵树。
- 可以用下面的代码取得根节点：
``` python
from bs4 import BeautifulSoup
import urllib
rawdata = urllib.urlopen("http://xxx.xxx.xx")
soup = BeautifulSoup(rawdata)
```
`soup`就是根节点了，有了这个根节点就能遍历文档树了。

- find可以快速得到某一个或一簇标签：
``` python
head = soup.find('head')
```
可以得到
``` html
<head>
    <title>...<title>
    <style>...<style>
</head>
```
也可以加上id的限制:
``` python
soup.find(id="link3")
```
- find_all可以有选择地得到一些标签：
``` python
soup.find_all('a')
# [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>,
#  <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,
#  <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]
```
- `.`也很常用：
``` python
soup.title
#可以得到<title>The Dormouse's story</title>
soup.title.name
#可以得到标签名
soup.title.string
#可以得到标签之间的文本
soup.p['class']
#可以得到p标签的class属性
```
- contents也比较常用：
``` python 
soup.body.contents
#是一个list，包括了body的所有子节点，既有tag也有文本。
```
## 下面介绍抓取中国天气网数据的过程。
首先打开网页[兰州天气](http://www.weather.com.cn/weather/101160101.shtml)，再打开firebug找到我们需要抓取的部分。如图所示：
![](http://a2bgeekblog.qiniudn.com/image/png/beatifulsoup.png)，其中`id="7d"`的`div`就是我们要抓取的部分。下面上代码：
``` python
tag7d = soup.find(id = "7d")
#得到id="7d"的div
tagweatherYubaoBox = tag7d.contents[3]
#得到class="weatherYubaoBox"的div
resultset = [tagweatherYubaoBox.contents[5].find_all("a"), tagweatherYubaoBox.contents[9].find_all("a"), tagweatherYubaoBox.contents[13].find_all("a")]
#这里我只想取当天、明天、后天的天气，也就是class="yuBaoTable"的前三个table，接下来就可以循环去数据了。
result = []
for item in resultset:
    tmp_dict = {}
    tmp_dict["date"] = item[0].string
    tmp_dict["imgurl"] = ''.join(["http://www.weather.com.cn", item[1].contents[1]["src"]])
    tmp_dict["weather"] = item[2].string
    if len(item) == 6:
#中国天气网的数据在6点以后就没有白天的数据了，所以这里判断了一下。
        tmp_dict["low"] = ' '.join([u"夜间", item[3].contents[1].contents[0], item[3].contents[1].contents[1].string])
    else:
        tmp_dict["high"] = ' '.join([u"白天", item[3].contents[1].contents[0], item[3].contents[1].contents[1].string])
        tmp_dict["low"] = ' '.join([u"夜间", item[8].contents[1].contents[0], item[8].contents[1].contents[1].string])
    result.append(tmp_dict)
```
最后为大家提供一个我吐血整理的城市名称和城市编号的对应关系，请[点击](http://a2bgeekblog.qiniudn.com/file/py/data.py)下载。
> 好了今天就到这里，欢迎拍砖。
