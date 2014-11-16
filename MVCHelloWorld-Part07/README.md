MVCHelloWorld：Cocos2d-js MVC模块化开发（07）
===========================================

Controller层开发

## Controller层说明

PureMVC框架的目标很明确，即把程序分为低耦合的三层：Model、View和Controller，这三部分由三个单例模式类管理，分别是Model、View和Controller，三者合称为核心层或核心角色。

Controller保存所有Command的映射。

## Command Pattern（命令模式）


Command对象是无状态的；只有在需要的时候（Controller收到相应的Notification）才会被创建，并且在被执行（调用execute方法）之后就会被删除。所以不要在那些生命周期长的对象（long-living object）里引用Command对象。
Command可以获取Proxy对象并与之交互，发送Notification，执行其他的Command。经常用于复杂的或系统范围的操作，如应用程序的“启动”和“关闭”。应用程序的业务逻辑应该在这里实现。

Controller会注册侦听每一个Notification，当被通知到时，Controller会实例化一个该Notification对应的Command类的对象。最后，将Notification作为参数传递给execute方法。


Command要实现ICommand接口。在PureMVC中有两个类实现了ICommand接口：SimpleCommand、MacroCommand。SimpleCommand只有一个execute方法，execute方法接受一个Inotification实例做为参数。实际应用中，你只需要重写这个方法就行了。MacroCommand让你可以顺序执行多个Command。每个执行都会创建一个Command对象并传参一个对源Notification的引用。


MacroCommand在构造方法调用自身的initializeMacroCommand方法。实际应用中，你需重写这个方法，调用addSubCommand添加子Command。你可以任意组合SimpleCommand和MacroCommand成为一个新的Command。





## 源代码

- 本文代码：https://github.com/guyoung/GeneCocosMVC/tree/master/MVCHelloWorld-Part07
- 项目地址：https://github.com/guyoung/GeneCocosMVC

### 编译及运行

browserify

    browserify MVCHelloWorld-Part07\js\app.js -o MVCHelloWorld-Part07\js\app-all.js
    or
    browserify MVCHelloWorld-Part07\js\app.js -o MVCHelloWorld-Part07\js\app-all.js --debug

uglifyjs

    uglifyjs MVCHelloWorld-Part07\js\app-all.js -o MVCHelloWorld-Part07\js\app-all.js


http-server

    node_modules\.bin\http-server.cmd




## 参见

## 参考资料


## 外部链接


------------------------------------------------

<https://github.com/guyoung/GeneCocosMVC>

By Guyoung Studio 

<http://www.guyoung.net>

