MVCHelloWorld：Cocos2d-js MVC模块化开发（03）
===========================================

PureMVC 使用

## MVC

MVC全名是Model View Controller，是模型(Model)－视图(View)－控制器(Controller)的缩写，一种软件设计典范，用一种业务逻辑、数据、界面显示分离的方法组织代码，将业务逻辑聚集到一个部件里面，在改进和个性化定制界面及用户交互的同时，不需要重新编写业务逻辑。MVC被独特的发展起来用于映射传统的输入、处理和输出功能在一个逻辑的图形化用户界面的结构中。

![Alt MVC](/images/010.png)

MVC主要把逻辑层和表现层进行了解耦，将一个问题划分成了不同的关注点。增强了应用的稳定性，易修改性和易复用性。

- 视图(View)：就是用户看到并与之交互的界面。它不做数据逻辑方面的工作，通常来说就是显示从模型中获得的数据，或者获取用户的操作。当模型更新时，它需要得知模型已经更新并获取更新后的数据以刷新界面。因此需要在模型处注册关注该模型的视图，以便模型通知视图更新显示。
- 模型(Model)：用于封装与应用程序的业务逻辑相关的数据以及对数据的处理方法。“模型”有对数据直接访问的权力，例如对数据库的访问。因此它常常也用来与远程服务器作交互，作为一个与外界访问的代理。加载外部资源，如图片，xml等也是在这里操作。模型不关心自己会被如何操作或显示，只要在数据更新时，向关注它的视图发送通知则可。
- 控制器(Controller)：本身不作业务逻辑操作，它负责关联视图和模型，就像一个纽带一样。同时它也负责应用的流程。通常控制器会获得模型和视图的实例，然后条用它们内部的函数。

## PureMVC

PureMVC 是在基于模型、视图和控制器 MVC 模式建立的一个轻量级的应用框架，这是一个开源框架，它最初是被用于 ActionScript 3 语言使用的 Adobe Flex、Flash 和 AIR 之上，现在已经移植到几乎所有主要的软件平台之上。

![Alt PureMVC 框架示意图](/images/020.png)

## 构造PureMVC应用

在 PureMVC 实现的经典 MVC 元设计模式中，Model、View 和 Controller 分别由一个单例类来管理，合称为核心层或核心角色。 另外，在 PureMVC 中还提供了一个单例类 —— Façade，主要作用是作为与核心层通信的唯一接口，简化开发复杂度。

除了这几个主要对象以外，框架还有如下类 Proxy、Mediator 和 Command。

- Proxy 对象负责操作数据模型，与远程服务通信存取数据，这样可以保证 Model 层的可移植性。通常 Proxy 对象的引用保存在 Model 中。
- View 保存对 Mediator 对象的引用。由 Mediator 对象来操作具体的视图组件（View Component，它的作用还包括：添加事件监听器，发送或接收 Notification，直接改变视图组件的状态。通过这样，就可以把视图和控制它的逻辑分离开来。
- Command 对象是无状态的，只在需要时才被创建。Command 可以获取 Proxy 对象并与之交互，发送 Notification，执行其他的 Command。经常用于复杂的或系统范围的操作，如应用程序的“启动”和“关闭”。应用程序的业务逻辑应该在这里实现。

除了基本的对象结构以外，为了解耦合，PureMVC 框架中引入了事件机制，这是个非常简单观察者设计模式，所有的事件都是一个 Notification，不同对象之间通过 Notification 来同步操作和交换信息。例如如果想更新界面中某个 Mediator，首先我们定义 Notification 用于此目的，然后注册 Mediator 监听该 Notification，然后就可以在程序中任何地方生成一个 Notification，通过事件机制，Mediator 就会接收到 Notification，然后更新需要的部分。整个过程 Mediator 只和 Notification 有关，没有其他依赖，有效的降低了对象之间的依赖程度。


### Facade

PureMVC中有一个单例模式类——Facade，Facade提供了与核心层通信的唯一接口，以简化开发复杂度。

Facade子类——AppFacade.js

    var AppFacade = module.exports = puremvc.define(
        // CLASS INFO
        {
            name: 'AppFacade',
            parent: puremvc.Facade,

            constructor: function (multitonKey) {
                puremvc.Facade.call(this, multitonKey);
            }
        },
        // INSTANCE MEMBERS
        {
            initializeController: function () {
                puremvc.Facade.prototype.initializeController.call(this);
                this.registerCommand(AppFacade.STARTUP, StartupCommand);
            },
            initializeModel: function () {
                puremvc.Facade.prototype.initializeModel.call(this);
            },
            initializeView: function () {
                puremvc.Facade.prototype.initializeView.call(this);
            },
            startup: function () {
                this.sendNotification(AppFacade.STARTUP);
            }
        },
        // STATIC MEMBERS
        {
            getInstance: function(multitonKey) {
                var instanceMap = puremvc.Facade.instanceMap;
                var instance = instanceMap[multitonKey];
                if(instance) {
                    return instance;
                }
                return instanceMap[multitonKey] = new AppFacade(multitonKey);
            },
            NAME: 'AppFacade',
            STARTUP: 'Startup'
        }
    );
    
类方法getInstance用于返回AppFacade的单例。Facade是pureMVC的核心，标准版的Facade只会存在一个，多核版本Facade会有多个，它的实例会在instanceMap中保存。

PureMVC已经在框架内部实现了Observer/Notification机制，只需要使用一个非常简单的方法从Proxy, Mediator, Command和Facade发送Notification，甚至不需要创建一个Notification实例。

Facade保存了Command与Notification之间的映射。当Notification（通知）被发出时，对应的Command（命令）就会自动地由Controller执行。

创建的Facade子类被用来简化“启动”的过程。应用程序调用Facade子类的startup方法，并传递自身的一个引用即完成启动，使得应用程序不需要过多了解PureMVC。



PrepModelCommand

创建Proxy对象，并注册。


PrepViewCommand

创建Mediator们，并把它注册到View.

### Model

Proxy子类——AppConfigProxy.js

    module.exports = puremvc.define
    (
        // CLASS INFO
        {
            name: 'model.proxy.AppConfigProxy',
            parent:puremvc.Proxy,

            constructor: function() {
                puremvc.Proxy.call(this);
            }
        },

        // INSTANCE MEMBERS
        {
            _config: null,

            onRegister: function() {
                this.loadData();
            },
            loadData: function() {
                var self = this;
                var xmlhttp = new XMLHttpRequest();
                var url = "js/app.config";

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        self._config = JSON.parse(xmlhttp.responseText);

                        self.sendNotification('WriteAppConfig');
                    }
                }
                xmlhttp.open("GET", url, true);
                xmlhttp.send();
            },
            getAppName: function() {
                return this._config.AppName;
            },
            getAppVersion: function() {
                return this._config.AppVersion;
            },
            getAppDescription: function() {
                return this._config.AppDescription;
            }
        },
        // STATIC MEMBERS
        {
            NAME: 'AppConfigProxy'
        }
    );
    
载入AppConfig数据，并发送Notification。
    
### View

Mediator子类——AppMediator.js

    module.exports = puremvc.define
    (
        // CLASS INFO
        {
            name: 'view.mediator.AppMediator',
            parent: puremvc.Mediator,
            constructor: function() {
                puremvc.Mediator.call(this, this.constructor.NAME);
            }
        },
        // INSTANCE MEMBERS
        {
            _appConfigProxy: null,

            /** @override */
            listNotificationInterests: function () {
                return [ 'WriteAppConfig' ];
            },

            /** @override */
            handleNotification: function (notification) {
                switch (notification.getName()) {
                    case 'WriteAppConfig':
                        document.write('<p>AppName:' + this._appConfigProxy.getAppName() + '</p>');
                        document.write('<p>AppVersion:' + this._appConfigProxy.getAppVersion() + '</p>');
                        document.write('<p>AppVersion:' + this._appConfigProxy.getAppDescription() + '</p>');

                        break;
                }
            },

            /** @override */
            onRegister: function () {
                this._appConfigProxy  = this.facade.retrieveProxy('AppConfigProxy');
            },

            /** @override */
            onRemove: function () {

            }
        },
        // STATIC MEMBERS
        {
        NAME: 'AppMediator'
        }
    );

接收Notification，输出信息。

### Controller

Command子类——StartupCommand.js

    module.exports = puremvc.define
    (
        // CLASS INFO
        {
            name: 'controller.command.StartupCommand',
            parent:puremvc.SimpleCommand
        },
        // INSTANCE MEMBERS
        {
            /** @override */
            execute: function (notification)
            {
                this.facade.registerProxy( new AppConfigProxy() );
                this.facade.registerMediator( new AppMediator() );
            }
        },
        // STATIC MEMBERS
        {
            NAME: 'StartupCommand'
        }
    );

初始化及注册ConfigProxy、AppMediator。

### 调用PureMVC

    (function() {
        var key = 'MVC_HELLOWORLD';
        AppFacade.getInstance(key).startup();
    })();

程序运行时，得到ApplicationFaçade实例，调用它的startup方法。

## 源代码

- 本文代码：https://github.com/guyoung/GeneCocosMVC/tree/master/MVCHelloWorld-Part03
- 项目地址：https://github.com/guyoung/GeneCocosMVC

### 编译及运行

browserify

    browserify MVCHelloWorld-Part03\js\app.js -o MVCHelloWorld-Part03\js\app-all.js
    or
    browserify MVCHelloWorld-Part03\js\app.js -o MVCHelloWorld-Part03\js\app-all.js --debug

uglifyjs

    uglifyjs MVCHelloWorld-Part03\js\app-all.js -o MVCHelloWorld-Part03\js\app-all.js


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

