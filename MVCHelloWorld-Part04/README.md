MVCHelloWorld：Cocos2d-js MVC模块化开发（04）
===========================================

一个简单Cocos2d-js游戏的策划、流程定义

## 游戏策划

游戏场景流程

![Alt 游戏场景流程](/images/010.png)


## 游戏状态机

使用有限状态机实现流程控制。

有限状态机（finite-state machine，缩写：FSM）又称有限状态自动机，简称状态机，是表示有限个状态以及在这些状态之间的转移和动作等行为的数学模型。

![Alt 有限状态机](/images/020.png)

## 创建状态机对象

### 场景状态

    var SceneState = GeneJS.Class({
        'public const MENU_MEDIATOR': 'MenuMediator',
        'public const HELLO_MEDIATOR': 'HelloMediator',
        'public const GAME_MEDIATOR': 'GameMediator',
        'public const GAME_OVER_MEDIATOR': 'GameOverMediator',
        'public const DRAW_MEDIATOR': 'DrawMediator',
        'public const BOOK_MEDIATOR': 'BookMediator'
    });

### 场景动作

    var SceneAction = GeneJS.Class({
        'public const HOME_ACTION': 'HomeAction',
        'public const MENU_ACTION': 'MenuAction',
        'public const HELLO_ACTION': 'HelloAction',
        'public const GAME_ACTION': 'GameAction',
        'public const GAME_OVER_ACTION': 'GameOverAction',
        'public const DRAW_ACTION': 'DrawAction',
        'public const BOOK_ACTION': 'BookAction'
    });

### 状态机

    var SceneFsm = GeneJS.Class({
    'public createFsm': function() {
        var fsm = {
            // 开始状态
            "@initial": SceneState.$('MENU_MEDIATOR'),
            "state": [
                {
                    // Menu
                    "@name": SceneState.$('MENU_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('HELLO_ACTION'),
                            "@target": SceneState.$('HELLO_MEDIATOR')
                        },
                        {
                            "@action": SceneAction.$('GAME_ACTION'),
                            "@target": SceneState.$('GAME_MEDIATOR')
                        },
                        {
                            "@action": SceneAction.$('DRAW_ACTION'),
                            "@target": SceneState.$('DRAW_MEDIATOR')
                        },
                        {
                            "@action": SceneAction.$('BOOK_ACTION'),
                            "@target": SceneState.$('BOOK_MEDIATOR')
                        }
                    ]
                },
                {
                    // Hello
                    "@name": SceneState.$('HELLO_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('HOME_ACTION'),
                            "@target": SceneState.$('MENU_MEDIATOR')
                        }
                    ]
                },
                {
                    // Game
                    "@name": SceneState.$('GAME_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('GAME_OVER_ACTION'),
                            "@target": SceneState.$('GAME_OVER_MEDIATOR')
                        }
                    ]
                },
                {
                    // GameOver
                    "@name": SceneState.$('GAME_OVER_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('HOME_ACTION'),
                            "@target": SceneState.$('MENU_MEDIATOR')
                        }
                    ]
                },
                {
                    // Draw
                    "@name": SceneState.$('DRAW_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('HOME_ACTION'),
                            "@target": SceneState.$('MENU_MEDIATOR')
                        }
                    ]
                },
                {
                    // Book
                    "@name": SceneState.$('BOOK_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('HOME_ACTION'),
                            "@target": SceneState.$('MENU_MEDIATOR')
                        }
                    ]
                }
            ]
        };

        return fsm;
    }
    });

## 状态机初始化

PureMVC框架提供了FSM实现。

### 定义InjectFSMCommand

    module.exports = puremvc.define
    (
    // CLASS INFO
    {
        name: 'controller.command.InjectFSMCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (notification)
        {
            cc.log('InjectFSMCommand execute');

            var sceneFsm = new SceneFsm();
            var fsm = sceneFsm.createFsm();

            var injector = new puremvc.statemachine.FSMInjector(fsm);
            injector.initializeNotifier(this.multitonKey);
            injector.inject();

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepControllerCommand'
    }
    );
    
### StartupCommand调用InjectFSMCommand

    module.exports = puremvc.define
    (
    // CLASS INFO
    {
        name: 'controller.command.StartupCommand',
        parent:puremvc.MacroCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        initializeMacroCommand: function (notification)
        {
            this.addSubCommand(PrepModelCommand);
            this.addSubCommand(PrepViewCommand);
            this.addSubCommand(PrepControllerCommand);
            this.addSubCommand(InjectFSMCommand );

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'StartupCommand'
    }
    );
 
### AppMediator监听StateMachine Notification
 
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
         /** @override */
         listNotificationInterests: function () {
             return [
                 puremvc.statemachine.StateMachine.CHANGED
             ];
         },
 
         /** @override */
         handleNotification: function (notification) {
             switch (notification.getName()) {
                 case puremvc.statemachine.StateMachine.CHANGED:
                     alert(notification.getBody().name);
 
                     break;
             }
         },
 
         /** @override */
         onRegister: function () {
 
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
 
 

## 源代码

- 本文代码：https://github.com/guyoung/GeneCocosMVC/tree/master/MVCHelloWorld-Part04
- 项目地址：https://github.com/guyoung/GeneCocosMVC

### 编译及运行

browserify

    browserify MVCHelloWorld-Part04\js\app.js -o MVCHelloWorld-Part04\js\app-all.js
    or
    browserify MVCHelloWorld-Part04\js\app.js -o MVCHelloWorld-Part04\js\app-all.js --debug

uglifyjs

    uglifyjs MVCHelloWorld-Part04\js\app-all.js -o MVCHelloWorld-Part04\js\app-all.js


http-server

    node_modules\.bin\http-server.cmd




## 参见

## 参考资料


## 外部链接


------------------------------------------------

<https://github.com/guyoung/GeneCocosMVC>

By Guyoung Studio 

<http://www.guyoung.net>

