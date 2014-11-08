MVCHelloWorld：Cocos2d-js MVC模块化开发（01）
===========================================

## 简介

模块化两个概念：

- 软件设计模块化
- 软件代码模块化

软件设计模块化——分层——MVC——PureMVC

软件代码模块化——JavaScript模块化——CommonJS——Browserify

实现：

- 关注点分离
- 代码重用


## 分层

将一个复杂的程序进行层次划分。为每一层进行设计，每层都是内聚的而且只依赖与它的下层。采用标准的架构模式来完成与上层的松散关联。将所有与领域模型相关的代码都集中在一层，并且将它与用户界面层、应用层和基础结构层的代码分离。领域对象可以将重点放在表达领域模型上，不需要关心它们自己的显示、存储和管理应用任务等内容。这样使模型发展得足够丰富和清晰，足以抓住本质的业务知识并实现它。

## MVC

MVC全名是Model View Controller，是模型(model)－视图(view)－控制器(controller)的缩写，一种软件设计典范，用一种业务逻辑、数据、界面显示分离的方法组织代码，将业务逻辑聚集到一个部件里面，在改进和个性化定制界面及用户交互的同时，不需要重新编写业务逻辑。MVC被独特的发展起来用于映射传统的输入、处理和输出功能在一个逻辑的图形化用户界面的结构中。

## PureMVC

PureMVC是在基于模型，视图和控制器MVC模式建立的一个轻量级的应用框架，而且是免费的，它最初是执行的ActionScript 3语言使用的Adobe Flex、Flash和AIR，现在已经移植到几乎所有主要的发展平台。

PureMVC框架的目标很明确，即把程序分为低耦合的三层：Model、View和Controller。降低模块间的耦合性，各模块如何结合在一起工作对于创建易扩展，易维护的应用程序是非常重要的。


## JavaScript模块化

随着前段JavaScript代码越来越重，如何组织JavaScript代码变得非常重要，好的组织方式，可以让别人和自己很好的理解代码，也便于维护和测试。模块化是一种非常好的代码组织方式。


## CommonJS

CommonJS是服务器端模块的规范，Node.js采用了这个规范。
 
根据CommonJS规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在该模块内部定义的变量，无法被其他模块读取，除非定义为global对象的属性。


## Browserify

Browserify是一个node.js模块，允许你在浏览器中使用require。

Browserify是NPM在前端项目里延伸的神器，有了它之后,前后端可以共用一个CommonJS规范的模块。


## 程序结构

- MVCHelloWorld
    - data
    - js
        - profile
            - flow
        - model
            - domain 
            - proxy
        - view
            - mediator    
            - component
            - ui
        - controller
            - command
        - test
        - app.js
    - res
    - index.html
- node_modules

## 开发环境

IDE：

- WebStorm

编译运行：

- Node.js
- Browserify
- UglifyJS

JavaScript库：

- Cocos2d-js（single js file ） <http://www.cocos2d-x.org/filecenter/jsbuilder/>
- PureMVC
- Underscore.js
- GNU ease.js
    
## 源代码

- 本文代码：https://github.com/guyoung/GeneCocosMVC/tree/master/MVCHelloWorld-Part01
- 项目地址：https://github.com/guyoung/GeneCocosMVC

### 编译及运行

http-server

    node_modules\.bin\http-server.cmd


## 参见


## 参考资料




## 外部链接


------------------------------------------------

<https://github.com/guyoung/GeneCocosMVC>

By Guyoung Studio 

<http://www.guyoung.net>





