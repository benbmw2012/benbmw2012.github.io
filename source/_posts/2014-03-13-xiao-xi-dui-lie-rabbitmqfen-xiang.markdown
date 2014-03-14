---
layout: post
title: "消息队列RabbitMQ分享"
date: 2014-03-13 18:52:31 +0800
comments: true
categories: [tech, 消息队列] 
---

最近为我维护的微信公众号添加功能，添加之后发现返回速度变慢了，导致在5秒内无法给用户返回消息。遇到这种情况该怎么办呢？答案是把耗时的操作开线程做异步处理，不过大神给了我指点，没错，就是使用消息队列。

消息队列顾名思义是一个队列，先进先出，可以把需要异步处理的消息（常常表现为字符串）先存到里面慢慢处理。

我选用的消息队列是RabbitMQ，可以点击[RabbitMQ官方网站](https://www.rabbitmq.com)查看文档。RabbitMQ是C/S结构，就像MySQL一样，提供了很多编程语言的客户端，因为我用的是python，所以使用了pika这个包。

RabbitMQ使用的一般情形就是有几个receiver一直在监听消息队列，然后来自WEB服务器的需要先返回后处理数据的请求被不断地放入消息队列，reveiver们轮流去处理，如下图：![](https://www.rabbitmq.com/img/tutorials/python-two.png)

下面上代码：

send.py
``` python
#!/usr/bin/env python
import pika
import sys

connection = pika.BlockingConnection(pika.ConnectionParameters(
	host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='task_queue', durable=True)

message = ' '.join(sys.argv[1:]) or "Hello World!"
channel.basic_publish(exchange='',
		      routing_key='task_queue',
		      body=message,
		      properties=pika.BasicProperties(
			 delivery_mode = 2, # make message persistent
		      ))
print " [x] Sent %r" % (message,)
connection.close()
```
receiver.py
``` python
#!/usr/bin/env python
import pika
import time

connection = pika.BlockingConnection(pika.ConnectionParameters(
	host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='task_queue', durable=True)
print ' [*] Waiting for messages. To exit press CTRL+C'

def callback(ch, method, properties, body):
    print " [x] Received %r" % (body,)
    time.sleep( body.count('.') )
    print " [x] Done"
    ch.basic_ack(delivery_tag = method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(callback,
		      queue='task_queue')

channel.start_consuming()
```
我就是参考这段代码去优化我的异步处理的，好了，今天就到这里，欢迎拍砖。
