---
layout: post
title: "快递100API使用讲解"
date: 2014-04-14 09:24:28 +0800
comments: true
categories: [tech, api] 
---
今天主要讲解的是如何通过api.kuaidi100.com获得物流单号的跟踪信息。

其实说来很简单，就是通过向指定的地址发送请求，即可返回如JSON、XML等格式的跟综结果。
## 应用场景
    1. 电商网站用户打开“我的订单”时调用此API显示结果
    2. 物流系统对帐前调用此API查一次所有运单的签收状态
## 是否需要授权
是，需要到[快递查询API申请地址](http://www.kuaidi100.com/openapi/applyapi.shtml)申请。
## API请求地址
http://api.kuaidi100.com/api?id=[]&com=[]&nu=[]&valicode=[]&show=[0|1|2|3]&muti=[0|1]&order=[desc|asc] 
## 参数说明
<table class="tab_use_child" cellspacing="0">
    <tbody>
        <tr>
            <th width="90" scope="col">名称</th>
            <th width="90" scope="col">类型</th>
            <th width="100" scope="col">是否必需</th>
            <th style="text-align:left;" scope="col"> 　　描述</th>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>id</td>
            <td> String</td>
            <td>是</td>
            <td style="text-align:left;">
            身份授权key，请
            <a target="_blank" href="/openapi/applyapi.shtml">快递查询接口</a>
            进行申请（大小写敏感）
            </td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>com</td>
            <td>String</td>
            <td>是</td>
            <td style="text-align:left;">
            要查询的快递公司代码，不支持中文，对应的公司代码见
            <br>
            《
            <a class="aco" target="_blank" href="http://code.google.com/p/kuaidi-api/wiki/Open_API_API_URL">API URL 所支持的快递公司及参数说明</a>
            》和《
            <a class="aco" target="_blank" href="http://code.google.com/p/kuaidi-api/wiki/Open_API_For_International_Express">支持的国际类快递及参数说明</a>
            》。
            <br>
            如果找不到您所需的公司，请发邮件至
            <a class="aco" href="mailto:kuaidi@kingdee.com"> kuaidi@kingdee.com </a>
            咨询（大小写不敏感）
            </td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>nu</td>
            <td> String</td>
            <td>是</td>
            <td style="text-align:left;">要查询的快递单号，请勿带特殊符号，不支持中文（大小写不敏感）</td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>valicode</td>
            <td>String</td>
            <td>是</td>
            <td style="text-align:left;">已弃用字段，无意义，请忽略。</td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>show</td>
            <td> String</td>
            <td>是</td>
            <td style="text-align:left;">
            返回类型：
            <br>
            0：返回json字符串，
            <br>
            1：返回xml对象，
            <br>
            2：返回html对象，
            <br>
            3：返回text文本。
            <br>
            如果不填，默认返回json字符串。
            </td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>muti</td>
            <td> String</td>
            <td>是</td>
            <td style="text-align:left;">
            返回信息数量：
            <br>
            1:返回多行完整的信息，
            <br>
            0:只返回一行信息。
            <br>
            不填默认返回多行。
            <br>
            </td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>order</td>
            <td> String</td>
            <td>是</td>
            <td style="text-align:left;">
            排序：
            <br>
            desc：按时间由新到旧排列，
            <br>
            asc：按时间由旧到新排列。
            <br>
            不填默认返回倒序（大小写不敏感）
            </td>
        </tr>
    </tbody>
</table>
## 返回结果
<table class="tab_use_child" cellspacing="0">
    <tbody>
        <tr style="background-color: rgb(255, 255, 255);">
            <th width="260" scope="col">字段名称</th>
            <th style="text-align:left;" scope="col">　　字段含义</th>
        </tr>
        <tr>
            <td>com</td>
            <td style="text-align:left;">物流公司编号</td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>nu</td>
            <td style="text-align:left;">物流单号</td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>time</td>
            <td style="text-align:left;">每条跟踪信息的时间</td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>context</td>
            <td style="text-align:left;">每条跟综信息的描述</td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>state</td>
            <td style="text-align:left;">
            快递单当前的状态 ：　
            <br>
            0：在途，即货物处于运输过程中；
            <br>
            1：揽件，货物已由快递公司揽收并且产生了第一条跟踪信息；
            <br>
            2：疑难，货物寄送过程出了问题；
            <br>
            3：签收，收件人已签收；
            <br>
            4：退签，即货物由于用户拒签、超区等原因退回，而且发件人已经签收；
            <br>
            5：派件，即快递正在进行同城派件；
            <br>
            6：退回，货物正处于退回发件人的途中；
            <br>
            该状态还在不断完善中，若您有更多的参数需求，欢迎发邮件至
            <a class="aco ff" href="mailto:kuaidi@kingdee.com"> kuaidi@kingdee.com</a>
            提出。
            </td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>status</td>
            <td style="text-align:left;">
            查询结果状态：
            <br>
            0：物流单暂无结果，
            <br>
            1：查询成功，
            <br>
            2：接口出现异常，
            </td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>message</td>
            <td style="text-align:left;">无意义，请忽略</td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>condition</td>
            <td style="text-align:left;">无意义，请忽略</td>
        </tr>
        <tr style="background-color: rgb(255, 255, 255);">
            <td>ischeck</td>
            <td style="text-align:left;">无意义，请忽略</td>
        </tr>
    </tbody>
</table>
## 返回示例
### xml格式
``` xml
<xml>
<message>ok</message>
<nu>1200722815552</nu>
<ischeck>1</ischeck>
<com>yunda</com>
<status>1</status>
<condition>F00</condition>
<data>
<time>2013-03-03 19:24:48</time>
<context>江苏泗阳县公司:进行揽件扫描</context>
</data>
<data>
<time>2013-03-03 19:25:10</time>
<context>江苏泗阳县公司:进行发出扫描，将发往：江苏淮安中转站</context>
</data>
<data>
<time>2013-03-03 21:44:47</time>
<context>江苏淮安中转站:快件进入分拨中心进行分拨</context>
</data>
<data>
<time>2013-03-04 03:22:44</time>
<context>江苏南京中转站:从站点发出，本次转运目的地：江苏南京栖霞区仙林公司</context>
</data>
<data>
<time>2013-03-04 08:25:03</time>
<context>江苏南京栖霞区仙林公司:到达目的地网点，快件将很快进行派送</context>
</data>
<data>
<time>2013-03-04 13:09:58</time>
<context>江苏南京栖霞区仙林公司:进行派件扫描；派送业务员：孙；（</context>
</data>
<data>
<time>2013-03-04 13:19:47</time>
<context>江苏南京栖霞区仙林公司:快件已被 图片 签收</context>
</data>
<state>3</state>
</xml>
```
### json格式
``` json
{"message":"ok","status":"1","state":"3","data":
    [{"time":"2012-07-07 13:35:14","context":"客户已签收"},
        {"time":"2012-07-07 09:10:10","context":"离开 [北京石景山营业厅] 派送中，递送员[温]，电话[]"},
        {"time":"2012-07-06 19:46:38","context":"到达 [北京石景山营业厅]"},
        {"time":"2012-07-06 15:22:32","context":"离开 [北京石景山营业厅] 派送中，递送员[温]，电话[]"},
        {"time":"2012-07-06 15:05:00","context":"到达 [北京石景山营业厅]"},
        {"time":"2012-07-06 13:37:52","context":"离开 [北京_同城中转站] 发往 [北京石景山营业厅]"},
        {"time":"2012-07-06 12:54:41","context":"到达 [北京_同城中转站]"},
        {"time":"2012-07-06 11:11:03","context":"离开 [北京运转中心驻站班组] 发往 [北京_同城中转站]"},
        {"time":"2012-07-06 10:43:21","context":"到达 [北京运转中心驻站班组]"},
        {"time":"2012-07-05 21:18:53","context":"离开 [福建_厦门支公司] 发往 [北京运转中心_航空]"},
        {"time":"2012-07-05 20:07:27","context":"已取件，到达 [福建_厦门支公司]"}
    ]} 
```
> 好了，今天就到这里，欢迎拍砖。查快递使用这个api还是不错的，网址是<a href="http://www.kuaidi100.com/" target="_blank">快递查询</a>。
