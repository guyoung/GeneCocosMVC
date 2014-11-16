MVCHelloWorld：Cocos2d-js MVC模块化开发（06）
===========================================

View层开发

## View层说明

PureMVC框架的目标很明确，即把程序分为低耦合的三层：Model、View和Controller，这三部分由三个单例模式类管理，分别是Model、View和Controller，三者合称为核心层或核心角色。

View保存对Mediator对象的引用。由Mediator对象来操作具体的视图组件（View Component，例如Cocos2d的Layer组件），包括：添加事件监听器，发送或接收Notification ，直接改变视图组件的状态。这样做实现了把视图和控制它的逻辑分离开来。


## Mediator Pattern（中介者模式）

当用View注册Mediator时，Mediator的listNotifications方法会被调用，以数组形式返回该Mediator对象所关心的所有Notification。
之后，当系统其它角色发出同名的Notification（通知）时，关心这个通知的Mediator都会调用handleNotification方法并将Notification以参数传递到方法。


Mediator是视图组件与系统其他部分交互的中介，侦听View Component来处理用户动作和Component的数据请求。Mediator通过发送和接收Notification来与程序其他部分通信。


Mediator保存了一个或多个View Component的引用，通过View Component自身提供的API管理它们。一个View Component应该把尽可能自己的状态和操作封装起来，对外只提供事件、方法和属性的简单的API。


Mediator的主要职责是处理View Component派发的事件和系统其他部分发出来的Notification（通知）。因为Mediator也会经常和Proxy交互，所以经常在Mediator的构造方法中取得Proxy实例的引用并保存在Mediator的属性中，这样避免频繁的获取Proxy实例。

Mediator负责处理与Controller层、Model层交互，在收到相关Notification时更新View Component。




## 源代码

- 本文代码：https://github.com/guyoung/GeneCocosMVC/tree/master/MVCHelloWorld-Part06
- 项目地址：https://github.com/guyoung/GeneCocosMVC

### 编译及运行

browserify

    browserify MVCHelloWorld-Part06\js\app.js -o MVCHelloWorld-Part06\js\app-all.js
    or
    browserify MVCHelloWorld-Part06\js\app.js -o MVCHelloWorld-Part06\js\app-all.js --debug

uglifyjs

    uglifyjs MVCHelloWorld-Part06\js\app-all.js -o MVCHelloWorld-Part06\js\app-all.js


http-server

    node_modules\.bin\http-server.cmd




## 参见

## 参考资料


## 外部链接


------------------------------------------------

<https://github.com/guyoung/GeneCocosMVC>

By Guyoung Studio 

<http://www.guyoung.net>

