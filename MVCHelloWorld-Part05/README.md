MVCHelloWorld：Cocos2d-js MVC模块化开发（05）
===========================================

Model层开发


## Model层说明

PureMVC框架的目标很明确，即把程序分为低耦合的三层：Model、View和Controller，这三部分由三个单例模式类管理，分别是Model、View和Controller，三者合称为核心层或核心角色。

Model保存对Proxy对象的引用，Proxy负责操作数据模型，与远程服务通信存取数据。这样保证了Model层的可移植性。

## Proxy Pattern（代理模式）


在很多场合下Proxy需要发送Notification（通知），比如：Proxy从远程服务接收到数据时，发送Notification告诉系统；或当Proxy的数据被更新时，发送Notification告诉系统。


Model通过使用Proxy来保证数据的完整性、一致性。Proxy集中程序的Domain Logic（域逻辑），并对外公布操作数据对象的API。它封装了所有对数据模型的操作，不管数据是客户端还是服务器端的，对程序其他部分来说就是数据的访问是同步还是异步的。


Model应该逻辑封装域(domain logic)证，保数据的完整性。



一般来说，Proxy Pattern（代理模式）被用来为控制、访问对象提供一个代理。在基于PureMVC的应用程序，Proxy类被设计用来管理程序数据模型。

一个Proxy有可能管理对本地创建的数据结构的访问。它是Proxy的数据对象。在这种情况下，通常会以同步的方式取得或设置数据。Proxy可能会提供访问Data Object部分属性或方法的API，也可能直接提供Data Object的引用。如果提供了更新Data Object的方法，那么在数据被修改时可能会发送一个Notifidation通知系统的其它部分。

Remote Proxy被用来封装与远程服务的数据访问。Proxy维护那些与Remote service（远程服务）通信的对象，并控制对这些数据的访问。在这种情况下，调用Proxy获取数据的方法，然后等待Proxy在收到远程服务的数据后发出异步Notification。


Proxy对象不应该通过引用、操作Mediator对象来通知系统它的Data Object（数据对象）发生了改变。

它应该采取的方式是发送Notification（这些Notification可能被Command或Mediator响应）。Proxy不关心这些Notification被发出后会影响到系统的什么。

把Model层和系统操作隔离开来，这样当View层和Controller层被重构时就不会影响到Model层。


## 源代码

- 本文代码：https://github.com/guyoung/GeneCocosMVC/tree/master/MVCHelloWorld-Part05
- 项目地址：https://github.com/guyoung/GeneCocosMVC

### 编译及运行

browserify

    browserify MVCHelloWorld-Part05\js\app.js -o MVCHelloWorld-Part05\js\app-all.js
    or
    browserify MVCHelloWorld-Part05\js\app.js -o MVCHelloWorld-Part05\js\app-all.js --debug

uglifyjs

    uglifyjs MVCHelloWorld-Part05\js\app-all.js -o MVCHelloWorld-Part05\js\app-all.js


http-server

    node_modules\.bin\http-server.cmd



## 参考

+ [PureMVC](http://puremvc.org/)
+ [browserify](http://browserify.org/)
+ [uglifyjs](http://lisperator.net/uglifyjs/)



------------------------------------------------

**Guyoung Studio**
 + Official Site: <a href="http://www.guyoung.net/" target="_blank">www.guyoung.net</a>
 + Email:         <a href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;%67%75%79%6f%75%6e%67@%61%6c%69%79%75%6e.%63%6f%6d" target="_blank">guyoung[at]aliyun.com</a>
