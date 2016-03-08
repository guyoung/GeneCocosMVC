(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var StartupCommand = require('./controller/command/StartupCommand.js');

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
},{"./controller/command/StartupCommand.js":7,"puremvc":26}],2:[function(require,module,exports){
"use strict";

var AppFacade = require('./AppFacade.js');

(function() {
    cc.game.config[cc.game.CONFIG_KEY.debugMode] = 1;
    cc.game.config[cc.game.CONFIG_KEY.showFPS] = true;
    cc.game.config[cc.game.CONFIG_KEY.frameRate] = 60;
    cc.game.config[cc.game.CONFIG_KEY.id] = 'gameCanvas';
    cc.game.config[cc.game.CONFIG_KEY.renderMode] = 0;

    cc.game.onStart = function(){
        cc.view.adjustViewPort(true);
        cc.view.setDesignResolutionSize(480, 320,cc.ResolutionPolicy.SHOW_ALL);
        cc.view.resizeWithBrowserSize(true);
        cc.director.setProjection(cc.Director.PROJECTION_2D);

        var key = 'MVC_HELLOWORLD';
        AppFacade.getInstance(key).startup();
    };

    cc.game.run();
})();

},{"./AppFacade.js":1}],3:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var SceneFsm = require('./../../profile/flow/SceneFsm.js').SceneFsm;

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

            //cc.log(fsm);

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

},{"./../../profile/flow/SceneFsm.js":10,"puremvc":26}],4:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.PrepControllerCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (notification)
        {
            cc.log('PrepControllerCommand execute');
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepControllerCommand'
    }
);

},{"puremvc":26}],5:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var GameProxy = require('./../../model/proxy/GameProxy');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.PrepModelCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (notification)
        {
            cc.log('PrepModelCommand execute');

            this.facade.registerProxy(new GameProxy() );
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepModelCommand'
    }
);

},{"./../../model/proxy/GameProxy":8,"puremvc":26}],6:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var DirectorMediator = require('./../../view/mediator/DirectorMediator.js');
var SceneMediator = require('./../../view/mediator/SceneMediator.js');
var GameMediator = require('./../../view/mediator/GameMediator.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.PrepViewCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (notification)
        {
            cc.log('PrepViewCommand execute');

            this.facade.registerMediator( new DirectorMediator() );
            this.facade.registerMediator( new SceneMediator() );
            this.facade.registerMediator( new GameMediator() );
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepViewCommand'
    }
);

},{"./../../view/mediator/DirectorMediator.js":17,"./../../view/mediator/GameMediator.js":18,"./../../view/mediator/SceneMediator.js":19,"puremvc":26}],7:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var PrepModelCommand = require('./PrepModelCommand.js');
var PrepViewCommand = require('./PrepViewCommand.js');
var PrepControllerCommand = require('./PrepControllerCommand.js');
var InjectFSMCommand = require('./InjectFSMCommand.js');

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

},{"./InjectFSMCommand.js":3,"./PrepControllerCommand.js":4,"./PrepModelCommand.js":5,"./PrepViewCommand.js":6,"puremvc":26}],8:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'model.proxy.GameProxy',
        parent: puremvc.Proxy,

        constructor: function () {
            puremvc.Proxy.call(this);
        }
    },

    // INSTANCE MEMBERS
    {
        onRegister: function () {

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'GameProxy'
    }
);


},{"./../../profile/flow/SceneAction.js":9,"puremvc":26}],9:[function(require,module,exports){
var GeneJS = require('GeneJS');

// Action 动作
var SceneAction = GeneJS.Class({
    'public const HOME_ACTION': 'HomeAction',
    'public const GAME_ACTION': 'GameAction',
    'public const GAME_OVER_ACTION': 'GameOverAction'
});


exports.SceneAction = SceneAction;
},{"GeneJS":25}],10:[function(require,module,exports){
var GeneJS = require('GeneJS');

var SceneState = require('./SceneState.js').SceneState;
var SceneAction = require('./SceneAction.js').SceneAction;
var SceneTransition = require('./SceneTransition.js').SceneTransition;

var SceneFsm = GeneJS.Class({
    'public createFsm': function() {
        var fsm = {
            // 开始状态
            "@initial": SceneState.$('GAME_MEDIATOR'),
            "state": [
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
                            "@target": SceneState.$('GAME_MEDIATOR')
                        }
                    ]
                }
            ]
        };

        return fsm;
    }
});

exports.SceneFsm = SceneFsm;
},{"./SceneAction.js":9,"./SceneState.js":11,"./SceneTransition.js":12,"GeneJS":25}],11:[function(require,module,exports){
var GeneJS = require('GeneJS');

// State 状态
var SceneState = GeneJS.Class({
    'public const GAME_MEDIATOR': 'GameMediator',
    'public const GAME_OVER_MEDIATOR': 'GameOverMediator'
});


exports.SceneState = SceneState;
},{"GeneJS":25}],12:[function(require,module,exports){
var GeneJS = require('GeneJS');

// Transition 转变
var SceneTransition = GeneJS.Class({

});


exports.SceneTransition = SceneTransition;
},{"GeneJS":25}],13:[function(require,module,exports){
"use strict";

var res = require('./../ui/Resource.js').res;


var BackgroundLayer = cc.Layer.extend({

    winSize: cc.Size(400, 300),

    bg_array: null,
    backgroundSprite_2: null,

    ctor: function (space) {
        this._super();
    },

    init: function () {
        this._super();

        this.removeAllChildren();

        // 游戏场景开始时背景
        var backgroundSprite_1 = cc.Sprite.create(res.background);
        backgroundSprite_1.setPosition(this.winSize.width / 2, this.winSize.height / 2);
        backgroundSprite_1.tag = 2002;
        this.addChild(backgroundSprite_1, 0);
        this.bg_array = this.bg_array || new Array();   // 存储背景图层上的精灵
        this.bg_array = [];
        this.bg_array.push(backgroundSprite_1);
        this.backgroundSprite_2 = this.backgroundSprite_2 || cc.Sprite.create(res.background2);
        this.backgroundSprite_2.attr({
            x: this.winSize.width / 2,
            y: this.winSize.height / 2
        });
        this.addChild(this.backgroundSprite_2, -1);


        return true;
    },

    move_Sprite: function (dx) {
        // 企鹅打飞时移动背景图层中的精灵
        var i = this.bg_array.length;
        while (i--) {
            var sp = this.bg_array[i];
            if (sp.x > this.winSize.width + 240) {
                this.bg_array.splice(i, 1); // 如果不在屏幕之内，则不再移动
                this.removeChild(sp);
            } else {
                sp.setPositionX(sp.x + dx);
            }
        }
    },

    load_milestone: function (score) {
        // 添加里程碑
        var milestone = cc.Sprite.create(res.milestone);
        milestone.setPosition(milestone.width, 90);
        // 显示分数
        var score_Label = cc.LabelTTF.create(score, "Arial", 14);
        score_Label.setColor(cc.color(0, 191, 255, 0));
        score_Label.setPosition(milestone.width + 10, 102);
        this.addChild(milestone, 1);
        this.addChild(score_Label, 1)
        this.bg_array.push(milestone);
        this.bg_array.push(score_Label);
    }
});

exports.BackgroundLayer = BackgroundLayer;
},{"./../ui/Resource.js":21}],14:[function(require,module,exports){
"use strict";

var res = require('./../ui/Resource.js').res;

var BearSprite = cc.Sprite.extend({
    penguin : null,
    rate : null,
    cotr : function() {
        this._super();
    },
    init : function() {
        this.initWithFile(res.idle);
    },
    readyBaseBall : function() {
        // 熊挥杆准备
        var animation = cc.Animation.create();
        animation.addSpriteFrameWithFile(res.ready_1);
        animation.addSpriteFrameWithFile(res.ready_2);
        animation.addSpriteFrameWithFile(res.ready_3);
        animation.addSpriteFrameWithFile(res.ready_4);
        animation.addSpriteFrameWithFile(res.ready_5);
        animation.setDelayPerUnit(0.1); // 每隔0.1秒播放一帧
        var animate = cc.Animate.create(animation);
        this.stopAllActions();
        this.runAction(animate);
    },
    playBaseBall : function(penguin, percentage) {
        this.penguin = penguin;
        this.rate = percentage; // 将力量值看做企鹅被打出时的初速度
        // 熊开始挥杆
        this.stopAllActions();
        var animation = cc.Animation.create();
        animation.addSpriteFrameWithFile(res.strike_1);
        animation.addSpriteFrameWithFile(res.strike_2);
        animation.addSpriteFrameWithFile(res.strike_3);
        animation.addSpriteFrameWithFile(res.strike_4);
        animation.addSpriteFrameWithFile(res.strike_5);
        animation.setDelayPerUnit(0.05);
        var animate = cc.Animate.create(animation);
        // 挥杆结束后检测碰撞
        var actionFinish = cc.CallFunc.create(this.checkStrike.call(this));
        this.runAction(cc.Sequence.create([animate, actionFinish]));
    },
    strikeSuccess : function() {
        // 熊击打成功
        var animation_s = cc.Animation.create();
        animation_s.addSpriteFrameWithFile(res.strike_s_1);
        animation_s.addSpriteFrameWithFile(res.strike_s_2);
        animation_s.addSpriteFrameWithFile(res.strike_s_3);
        animation_s.addSpriteFrameWithFile(res.strike_s_4);
        animation_s.addSpriteFrameWithFile(res.strike_s_5);
        animation_s.setDelayPerUnit(0.1);
        var animate_s = cc.Animate.create(animation_s);
        this.stopAllActions();
        this.runAction(animate_s);
    },
    strikeFall : function() {
        // 熊击打失败
        var animation_f = cc.Animation.create();
        animation_f.addSpriteFrameWithFile(res.strike_f_1);
        animation_f.addSpriteFrameWithFile(res.strike_f_2);
        animation_f.addSpriteFrameWithFile(res.strike_f_3);
        animation_f.addSpriteFrameWithFile(res.strike_f_4);
        animation_f.setDelayPerUnit(0.1);
        var animate_f = cc.Animate.create(animation_f);
        this.stopAllActions();
        this.runAction(animate_f);
    },
    checkStrike : function() {
        var rect = cc.rect(this.getPositionX()-20, this.getPositionY()-10, 40, 70);
        if(cc.rectContainsPoint(rect, cc.p(this.penguin.getPositionX(), this.penguin.getPositionY()))) {
            this.penguin.stopAllActions();
            this.penguin.flyAfterStrike(this.rate);
            this.strikeSuccess();
        } else {
            this.strikeFall();
        }
    }
});

module.exports.BearSprite = BearSprite;
},{"./../ui/Resource.js":21}],15:[function(require,module,exports){
"use strict";

var res = require('./../ui/Resource.js').res;
var BackgroundLayer = require('./BackgroundLayer.js').BackgroundLayer;
var BearSprite = require('./BearSprite.js').BearSprite;
var PenguinSprite = require('./PenguinSprite.js').PenguinSprite;

var TOUCH_COUNT = 0;    // 点击次数
var TouchEventListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: false,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
    onTouchBegan: function (touch, event) {     //实现 onTouchBegan 事件回调函数
        return true;
    },
    onTouchEnded: function (touch, event) {         // 点击事件结束处理
        cc.log('onTouchEnded');

        TOUCH_COUNT++;
        var target = event.getCurrentTarget();
        // 第一次点击，进度条停止刷新，企鹅自由落体；第二次点击，熊挥杆
        if(TOUCH_COUNT == 1) {
            var penguinLayer = target.getChildByTag(103);
            var penguinSprite = penguinLayer.getChildByTag(1031);
            penguinSprite.playFreeFall();

            var backgroundLayer = target.getChildByTag(100);
            var bearSprite = backgroundLayer.getChildByTag(1001);
            bearSprite.readyBaseBall();
        }
        if(TOUCH_COUNT == 2) {
            var backgroundLayer = target.getChildByTag(100);
            var bearSprite = backgroundLayer.getChildByTag(1001);
            var penguinLayer = target.getChildByTag(103);
            var pressTimer = penguinLayer.getChildByTag(1032);
            pressTimer.stopAllActions();
            var penguinSprite = penguinLayer.getChildByTag(1031);
            bearSprite.playBaseBall(penguinSprite, pressTimer.getPercentage());
        }
    }
});



var GameLayer = cc.Layer.extend({

    winSize: cc.Size(400, 300),

    size_height: null,
    size_width: null,
    backgroundLayer : null,
    pressTimer : null,
    menu_layer: null,
    bearSprite: null,
    penguinSprite: null,

    ctor:function (space) {
        this._super();

    },

    init:function () {
        this._super();

        this.size_height = this.winSize.height;
        this.size_width = this.winSize.width;

        // 背景
        this.backgroundLayer = new BackgroundLayer();

        // 熊
        this.bearSprite = new BearSprite();
        this.bearSprite.init();
        this.bearSprite.setPosition(this.size_width - 70, 105);
        this.bearSprite.tag = 1001;

        this.backgroundLayer.winSize = this.winSize;
        this.backgroundLayer.init();
        this.backgroundLayer.addChild(this.bearSprite, 1);
        this.backgroundLayer.bg_array.push(this.bearSprite);

        this.addChild(this.backgroundLayer, 0, 100);

        // 企鹅
        this.penguinSprite = new PenguinSprite();
        this.penguinSprite.init(res.penguin_jump_2);
        this.penguinSprite.setPosition(this.size_width - 58, this.size_height - 45);
        this.penguinSprite.tag = 1031;
        var penguinLayer = cc.Layer.create();
        penguinLayer.tag = 103;
        penguinLayer.addChild(this.penguinSprite, 0);

        // 力量大小(进度条)
        this.pressTimer = cc.ProgressTimer.create(cc.Sprite.create(res.button_bottom_pressed_2));
        this.pressTimer.setType(cc.ProgressTimer.TYPE_BAR);
        this.pressTimer.setBarChangeRate(cc.p(0, 1));  // 垂直进度条
        this.pressTimer.setMidpoint(cc.p(1, 0)); // 从下向上
        this.pressTimer.setAnchorPoint(0, 0);
        this.pressTimer.setPosition(cc.p(10, 25));
        this.pressTimer.runAction(cc.RepeatForever.create(cc.ProgressTo.create(3, 100)));    // 在5秒到达100%，即每秒20%
        this.pressTimer.tag = 1032;
        penguinLayer.addChild(this.pressTimer, 1);
        var pressTimerBottom = cc.Sprite.create(res.button_bottom_pressed_3);
        pressTimerBottom.setAnchorPoint(0, 0);
        pressTimerBottom.setPosition(10, 25);
        penguinLayer.addChild(pressTimerBottom, 1);
        this.addChild(penguinLayer, 2);
        cc.eventManager.addListener(TouchEventListener, this);


        return true;
    },

    displayMenu: function(score) {
        TOUCH_COUNT = 0;

        this.getChildByTag(103).getChildByTag(1032).stopAllActions();
        cc.eventManager.removeAllListeners();
        // 游戏结束后显示菜单
        score = score || 0;
        if(score > 0) {
//            dp_submitScore(0,score);
        }
        this.menu_layer = cc.Layer.create();
        this.menu_layer.tag = 104;
        var score_label = cc.LabelTTF.create("得分: " + score, "Arial", 20);
        score_label.setPosition(this.size_width/2, this.size_height/2 + 80);
        score_label.setColor(cc.color(39, 64, 139, 0));

        var more_sprite = cc.Sprite.create(res.button_more_game);
        var more_menuItem = cc.MenuItemSprite.create(more_sprite, null, null,this.click_moreGame, this);
        var retry_sprite = cc.Sprite.create(res.button_retry);
        var retry_menuItem = cc.MenuItemSprite.create(retry_sprite, null, null,this.click_retry, this);
        var menu = cc.Menu.create(more_menuItem, retry_menuItem);
        menu.alignItemsHorizontallyWithPadding(20);
        menu.attr({
            x : this.size_width / 2,
            y : this.size_height / 2
        });
        this.menu_layer.addChild(score_label, 0);
        this.menu_layer.addChild(menu, 0);
        this.addChild(this.menu_layer, 3);
    },

    click_moreGame: function() {
//        dp_Ranking("moregame");
    },

    click_retry: function() {
        this.menu_layer.setVisible(false);
        this.pressTimer.setPercentage(0);
        this.pressTimer.runAction(cc.RepeatForever.create(cc.ProgressTo.create(3, 100)));
        this.backgroundLayer.init();
        this.bearSprite.setPosition(this.size_width - 70, 105);
        this.bearSprite.init();
        this.backgroundLayer.addChild(this.bearSprite, 1);
        this.backgroundLayer.bg_array.push(this.bearSprite);
        this.penguinSprite.setPosition(this.size_width - 58, this.size_height - 45);
        this.penguinSprite.re_stand();
        cc.eventManager.addListener(TouchEventListener, this);
    }
});

exports.GameLayer = GameLayer;
},{"./../ui/Resource.js":21,"./BackgroundLayer.js":13,"./BearSprite.js":14,"./PenguinSprite.js":16}],16:[function(require,module,exports){
"use strict";

var FreeFallAction = require('./../ui/FreeFallAction.js').FreeFallAction;
var res = require('./../ui/Resource.js').res;

var PenguinSprite = cc.Sprite.extend({
    landing_Y : null,
    p_reference : null,
    v_friction : null,
    h_friction : null,
    rate_X : null,
    rate_Y : null,
    move_time : null,
    current_X : null,
    current_Y : null,
    start_X : null,
    start_Y : null,
    start_point_X: null,
    milestone_number: null,
    ctor : function() {
        this._super();
        this.landing_Y = 75;    // 地面高度
        this.p_reference = cc.p(450, 130);   // 击打处参考点
        this.h_friction = 50;    // 水平减速系数
        this.v_friction = 50;    // 垂直减速系数
        this.rate_X = 0;    // 企鹅水平速度
        this.rate_Y = 0;    // 企鹅垂直速度
        this.time_interval = 0.1;   //  企鹅飞时刷新时间间隔
        this.milestone_number = 1;
    },
    init : function(res_imag) {

        this.initWithFile(res_imag);
    },
    re_stand: function() {
        // 企鹅重新上台
        this.milestone_number = 1;
        this.setRotation(0);
        var animation = cc.Animation.create();
        animation.addSpriteFrameWithFile(res.penguin_step_left_1);
        animation.addSpriteFrameWithFile(res.penguin_step_left_2);
        animation.addSpriteFrameWithFile(res.penguin_step_left_3);
        animation.addSpriteFrameWithFile(res.penguin_step_right_1);
        animation.addSpriteFrameWithFile(res.penguin_step_right_2);
        animation.addSpriteFrameWithFile(res.penguin_step_right_3);
        animation.addSpriteFrameWithFile(res.penguin_idle);
        animation.addSpriteFrameWithFile(res.penguin_jump_1);
        animation.addSpriteFrameWithFile(res.penguin_jump_2);
        animation.setDelayPerUnit(0.1); // 每隔0.1秒播放一帧
        var animate = cc.Animate.create(animation);
        this.runAction(animate);
    },
    playFreeFall : function() {
        this.stopAllActions();
        // 企鹅下落时准备动画
        var animation = cc.Animation.create();
        animation.addSpriteFrameWithFile(res.penguin_jump_3);
        animation.addSpriteFrameWithFile(res.penguin_jump_4);
        animation.addSpriteFrameWithFile(res.penguin_jump_5);
        animation.addSpriteFrameWithFile(res.penguin_jump_6);
        animation.setDelayPerUnit(0.1); // 每隔0.1秒播放一帧
        var animate = cc.Animate.create(animation);
        // 自由落体动画
        var freeFallAction = FreeFallAction.create(this.getPositionY() - 75);
        // 合并动画序列
        this.runAction(cc.Sequence.create([animate, freeFallAction]));
    },
    flyAfterStrike : function(rate) {
        this.fly_animate();
        this.current_X = this.start_X = this.start_point_X = this.getPositionX();   // X轴坐标
        this.current_Y = this.start_Y = this.getPositionY();   // Y轴坐标
        this.divide_rate(rate * 20);    // 设置速度放大倍数
        this.schedule(this.on_tick, this.time_interval);
    },
    landing_vertical : function() {
        // 垂直停下来
        var animation_vertical = cc.Animation.create();
        animation_vertical.addSpriteFrameWithFile(res.penguin_vertical_landing_1);
        animation_vertical.addSpriteFrameWithFile(res.penguin_vertical_landing_2);
        animation_vertical.addSpriteFrameWithFile(res.penguin_vertical_landing_3);
        animation_vertical.addSpriteFrameWithFile(res.penguin_vertical_landing_4);
        animation_vertical.setDelayPerUnit(0.1);
        var animate_vertical = cc.Animate.create(animation_vertical);
        this.runAction(animate_vertical);
        this.getParent().getParent().displayMenu();
    },
    landing_horizon : function() {
        this.stopAllActions();
        // 水平停下来
        var animation_landing = cc.Animation.create();
        animation_landing.addSpriteFrameWithFile(res.penguin_landing_1);
        animation_landing.addSpriteFrameWithFile(res.penguin_landing_2);
        animation_landing.addSpriteFrameWithFile(res.penguin_landing_3);
        animation_landing.addSpriteFrameWithFile(res.penguin_landing_4);
        animation_landing.setDelayPerUnit(0.1); // 每隔0.1秒播放一帧
        var animate_landing = cc.Animate.create(animation_landing);
        this.runAction(animate_landing);
        this.unscheduleAllCallbacks();
        var gameLayer = this.getParent().getParent();
        gameLayer.displayMenu(this.calculate_score());
    },
    fly_animate : function() {
        this.stopAllActions();
        // 飞
        var animation_fly = cc.Animation.create();
        animation_fly.addSpriteFrameWithFile(res.penguin_fly_1);
        animation_fly.addSpriteFrameWithFile(res.penguin_fly_2);
        animation_fly.addSpriteFrameWithFile(res.penguin_fly_3);
        animation_fly.setDelayPerUnit(0.1); // 每隔0.1秒播放一帧
        var animate_fly = cc.Animate.create(animation_fly);
        this.runAction(cc.RepeatForever.create(animate_fly));
    },
    add_black_landing : function(x) {
        // 在落地点添加黑色标记
        var backgroundLayer = this.getParent().getParent().getChildByTag(100);
        var black_landing = cc.Sprite.create(res.penguin_nick);
        black_landing.setPosition(x, this.landing_Y-10);
        backgroundLayer.addChild(black_landing, 1);
        backgroundLayer.bg_array.push(black_landing);
    },
    on_tick : function() {
        this.move_X();
        this.move_Y();
        if(this.getPositionX() <= 75) {
            this.setPosition(75, this.current_Y);
            var backgroundLayer = this.getParent().getParent().getChildByTag(100);
            backgroundLayer.move_Sprite(Math.abs(this.current_X - this.start_X));
            var d = Math.abs(this.current_X - this.start_point_X);
            if(parseInt(d / 500) === this.milestone_number) {
                backgroundLayer.load_milestone(this.milestone_number * 500);
                this.milestone_number++;
            }
            if (this.getPositionY() <= this.landing_Y) {
                if ((this.rate_X >= (-this.h_friction / 5)) && (this.rate_Y >= -this.v_friction && this.rate_Y <= this.v_friction)) {
                    this.landing_horizon();
                    this.add_black_landing(75);
                } else {
                    this.add_black_landing(75);
                    this.rate_Y = -this.rate_Y - this.v_friction;
                }
                this.setRotation(0);
                this.setPositionY(this.landing_Y);
            } else {
                this.setRotation(this.calculate_rotation());
                this.fly_animate();
            }
        } else {
            this.setPosition(this.current_X, this.current_Y);
            if (this.getPositionY() <= this.landing_Y) {
                if ((this.rate_X >= (-this.h_friction / 5)) && (this.rate_Y >= -this.v_friction && this.rate_Y <= this.v_friction)) {
                    this.landing_horizon();
                    this.add_black_landing(this.current_X);
                } else {
                    this.add_black_landing(this.current_X);
                    this.rate_Y = -this.rate_Y - this.v_friction;
                }
                this.setRotation(0);
                this.setPositionY(this.landing_Y);
            } else {
                this.setRotation(this.calculate_rotation());
                this.fly_animate();
            }
        }
        this.start_X = this.current_X;
        this.start_Y = this.current_Y;
    },
    divide_rate : function(rate) {
        // 分解初始速度(正方向以cocos2d的坐标轴为准)
        // X分量始终为负
        var c = Math.sqrt((this.p_reference.x - this.getPositionX())*(this.p_reference.x - this.getPositionX()) + (this.p_reference.y - this.getPositionY())*(this.p_reference.y - this.getPositionY()));
        this.rate_X = -rate * (this.p_reference.x - this.getPositionX())/c;
        // Y分量可能为正,可能为负
        this.rate_Y = rate * (this.getPositionY()-this.p_reference.y)/c;
    },
    move_X : function() {
        // 水平运动
        this.current_X = this.start_X + this.rate_X * this.time_interval;
        if(this.rate_X < (-this.h_friction/5)) {
            if(this.getPositionY() > this.landing_Y) {
                this.rate_X += this.h_friction / 10; // 水平默认减速幅度
            } else {
                this.rate_X += this.h_friction; // 擦地时减速
            }
        }
    },
    move_Y : function() {
        // 垂直运动
        this.current_Y = this.start_Y + this.rate_Y * this.time_interval;
        if(this.rate_Y > this.v_friction) {
            this.rate_Y -= this.v_friction;
        } else {
            this.rate_Y -= this.v_friction / 5;
        }
    },
    calculate_score: function() {
        // 计算分数
        return parseInt(Math.abs(this.current_X - this.start_point_X));
    },
    calculate_rotation: function() {
        var angle = -Math.atan2(this.rate_X, this.rate_Y);
        angle = 90 - angle * (180/Math.PI);
        return angle;
    }
});


module.exports.PenguinSprite = PenguinSprite;
},{"./../ui/FreeFallAction.js":20,"./../ui/Resource.js":21}],17:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var SceneMediator = require('./SceneMediator.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.DirectorMediator',
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
                'SCENE_CHANGED'
            ];
        },

        /** @override */
        handleNotification: function (notification) {
            switch (notification.getName()) {
                case 'SCENE_CHANGED':
                    //cc.log('SCENE_CHANGED');

                    var sceneMediator = this.facade.retrieveMediator(SceneMediator.NAME );

                    if(sceneMediator && sceneMediator.getViewComponent()) {
                        cc.director.runScene(new cc.TransitionFade(1.2, sceneMediator.getViewComponent()));
                    }

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
        NAME: 'DirectorMediator'
    }
);

},{"./SceneMediator.js":19,"puremvc":26}],18:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var GameLayer = require('./../component/GameLayer.js').GameLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;
var GameProxy = require('./../../model/proxy/GameProxy.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.GameMediator',
        parent: puremvc.Mediator,
        constructor: function() {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        _gameProxy: null,

        /** @override */
        listNotificationInterests: function () {
            return [ ];
        },

        /** @override */
        handleNotification: function (note) {

        },

        /** @override */
        onRegister: function () {
            this._gameProxy  = this.facade.retrieveProxy(GameProxy.NAME);
        },

        /** @override */
        onRemove: function () {

        },
        init: function() {
            var self = this;

            self.viewComponent = new GameLayer();
            self.viewComponent.winSize = cc.director.getWinSize();

            self.viewComponent.init();
        },
        destroy: function() {
            this.viewComponent = null;
        },
        getResource: function () {
            return null;
        }


    },
    // STATIC MEMBERS
    {
        NAME: 'GameMediator'
    }
);

},{"./../../model/proxy/GameProxy.js":8,"./../../profile/flow/SceneAction.js":9,"./../component/GameLayer.js":15,"puremvc":26}],19:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var GeneCocosJS = require('GeneCocosJS');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.SceneMediator',
        parent: puremvc.Mediator,
        constructor: function () {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        _initialized: false,

        loaderImage: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAlAAD/4QMpaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM4MDBEMDY2QTU1MjExRTFBQTAzQjEzMUNFNzMxRkQwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM4MDBEMDY1QTU1MjExRTFBQTAzQjEzMUNFNzMxRkQwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU2RTk0OEM4OERCNDExRTE5NEUyRkE3M0M3QkE1NTlEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU2RTk0OEM5OERCNDExRTE5NEUyRkE3M0M3QkE1NTlEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQADQkJCQoJDQoKDRMMCwwTFhENDREWGhUVFhUVGhkUFhUVFhQZGR0fIB8dGScnKionJzk4ODg5QEBAQEBAQEBAQAEODAwOEA4RDw8RFA4RDhQVERISERUfFRUXFRUfKB0ZGRkZHSgjJiAgICYjLCwoKCwsNzc1NzdAQEBAQEBAQEBA/8AAEQgAyACgAwEiAAIRAQMRAf/EALAAAAEFAQEAAAAAAAAAAAAAAAQAAgMFBgcBAQEAAwEBAAAAAAAAAAAAAAAAAQMEAgUQAAIBAgIEBwoLBgQGAwAAAAECAwAEEQUhMRIGQVFxsTITFGGBwdEiQlKSMzWRoeFicqKyI1NzFYJjJDQWB9KjVCbxwkNkJWXik3QRAAIBAgMFBQcDBQEAAAAAAAABAhEDIRIEMUFRcTJhwVIUBZGhsSJyEzOB0ULhYpIjUxX/2gAMAwEAAhEDEQA/AMJSpUqAVKlXuFAeUq9wpUB5XuFe4V6ooDzZHDox0CnGMinzwl7Z8NajaHeoO3vmTBZBtp9YUIqTEV5ROxHKnWRnaU8VRMhFBUjpV7hSoSeUq9pUB5Sr2lhQHlKvcK8oBV7hSFSRrtaKAZs07YNPM1pG2xJIAw1jSeandry/8X4m8VCKkWwaWwam7Xl/4v1W8VLtmX/i/VbxUoKkWwakSM407tmX/i/VbxUmzGwjQsjdY41IARie/U0IbZO0kNtCXnOCkEBeFu4KI3Bs7DNb27ya+jDx3kJeEnpJJEcQVbWDsk17u5urd591ucZkWhym2Vnd9RkCDEpFxDRpbw0bunu5mlp2De2FMLYXOD2wB2xbOeraUcYGJ72mlSUiqzzdzMd3Z3mixltA2yzcK/NlHM1DQyRXce1HocdNOEfJXZ88y9ZojOqhiBszIRiHQ8Y4cK5TvHuzLljHNMqxNoDjLFraHHnjPxcNCGVbxEUzYNTx5jZSxhpW6qTzlwJ+DCvO2Zf+L9VvFSgqyHYNLYNTdssPxfibxUu15f8Ai/VPiqCakOwa82DU/a8v/F+JvFTDdWPBL8R8VKCvYRYV5UzoMAy6QdIIqI0B4KJtxiRQwou16QoGUkntH5Tz0RbZbmF2hktraSVBo2lUkY8tDye0flPPXTslVUyiyVRsjqUOA4yMT8dW2ram2m6UVTNq9S7EIyUVJydMTn/6DnP+im9Wl+g5z/opvVrpteEhQWY4AaSTwAVf5WPiZh/9S5/zj7zltzlmYWkfWXNvJDGTgGcYDHirR7i7mSbwXParsFMrgb7w6jKw/wCmnc9I14kF3vpvCljbMyWMOJL4aEiB8qU/ObUK7HYWVrl1pFZWiCOCBQqKOLjPGTrNZZqKbUXVHq2nNwTuJRk1VpbgXN8s7Rk5ym0UQQzhIG2NAjhxHWbI+gCBVjBBFbwxwQqEiiUJGg1BVGAFe7dV28WYLYZFmF2Th1UD7JGjymGyn1iK5OyzIBGB1HgrLZhamzumQAGJwSqnSCh1q3GOCodxt4cxurdcpzuN4cyhiWaF5Bg09udUmnWw1H/jV9nFuJ7Quo+8h8peThFA+047vduyMtk7fYqTl07YFdfUufMPzT5p71UdtlmYXaGS2t3mQHAsgxANdadYJopLe4QS2867EsZ4QfCNYrCFbjdDPmgkYyWFxgVf04ifJf6ScNdRUW1XBb6FU5TjF5EpSSrGu/s5lN+g5z/opvVpfoOc/wCim9WtdHnatvObJXDW7xLGhB8nrPaY9/HCr+tEdPCVaSeDoYLnqF63lzW4/PFSW3ecxbI84VSzWUwUaSdg0DXXK5nvAipnd6qgKvWnQO7pri9ZUEmm3Vl2j1kr8pRlFRyquBNZjGxQ/S56Y1S2fu9OVueon11Szahoou06QoQUXadIVCD2FJJ7R+U89dMydv8Axdn+TH9muZye0flPPXQstlK5Tbka1gUjlC1q0vVLkeb6r+O3Tx9xcY1nt8c0NrZCyiOE1108NYjGv1joo7Js1jzKyScYLIvkzL6LDwHXVJksH9Sb49dKNq0tj1jA6uriOCL+02FWX7iVtZX1/AzaHTyeoauKn2MX9W79zebiZCuR5MjSrhfXuEtwTrUeZH+yNfdrRNcxI6IzhXlJEak6WIGJ2Rw4ChWnChndtlVBLMdQA0k1gbXNMzzDfDLs6mjaPKppJbWwJ1bOwwxw43OnHh71YT3DpfWUJmFlb5jHHDdeXBHIsrRea5TSqvxqG04cNN62vetoCS4tre5mgnkGE9q+3DKOkuI2WX6LDQRRHWDh1UCtwj7QRg2wdl8Djgw1qe7XvW0BQ3kfZ7mSLgU+T9E6RVbnuVrnWVSWqj+Lt8ZbRuHEdKPkYVcZ2MJY5fSGyeVar45+rkWQHAqccalPE5km1htWK5nK4Wnt5FuUBUwOMG4nGkA/BXUrW4S6torlOjMgcd/xVn7rLo7zKs0uEjCNeSvdwoBhgsZxX1l2j36k3Lu+uyprdj5Vs5A+i/lD48a0aaVJOPi7jB6lbzWozpjB48pf1NDXNN4vfl7+Z4BXS65pvF78vfzPAK71XTHmZ/S/yT+jvJ7L3fHytz1E+upbL+Qj5W56jfXWRnsIYKLtekKEFGWvSFQgyjk9o/Keet3YthlMP/5x9msJJ7R+U89biyb/AMXEv7gD6tadL1T+kwepRrC39ZkLDMbiwMvUHRPG0bjlGg8ore/23sxBldxfMPLupNhT8yL/AORNZbdzJ484scytxgLqJY5LZj6Q2sV5G1Vud1mjjyG0ij0NEGSZToKyhjtqw4waztuiXA3qKTbSxltfGhbZlE95ZtZqxVbgiOZhrER9ph3Svk9+pJILZ4Y4DGBFCUMKjRsGPobPFhUfW0NJmljE2xJcIrcI2vFUEln1lRXd6lrazXT9GCNpD+yNqoI7mOVduNw6nzlOIoPOUa6yye1XXcbMR5GdQ3xY0BSbj31/FcTQZirJ+q431q7anbHCTZ72Bw7lbPrKBMcBWNNgbMBBh+bsjBdni0VJ1lARZs6yWiupxCuMDy6KpS2IwOo6DTr3Mre3e5tZZVUM4ZBjqOOJoWO4jkXajcOOMHGgDISvWIrdAkKR80+TzVl908bPPL3LzxOuHdifxVfiTAg92qI/w+/8gGgSyN/mR7XPVlp0lF/3L3mbVKtu5Hjbk/8AHE2Fc03i9+Xv5ngFdKNc13i9+Xv5ngFaNV0x5nn+l/kn9HeEWXu+PlbnqJ9dS2Xu9OVueon11kZ7CGCjLXpCgxRlr0hUIPYUcntH5Tz1s8vb+Bt1/dqPirGSe0flPPWusG/g4Py15q06XqlyMWvVYQ+ruI9xJOqzO9hOto/sP8tbGOFIrmWeM7IuMDMnAXXQJOUjQeOsJk0nY96ip0CYunrjaHx1t+srPJUbXBm2LrFPikwTOb+T+VhbZxGMrDXp83x1QSy2tucJpUjPETp+Cn5/ftaRvKvtp3Kx48HG3erHMzOxZiWZtLMdJNQSbbL71Vk6yynViOkqnEEfOWtPbXi3EQkGg6mXiNckjeSJxJGxR10qw0GtxuxmvbImD4CZMFlA4fRfv0BqesqqzTMZNMEDbIHtHH2QeCiZJSqMQdOGiue53mz3czQwsRbIcNHnkec3c4qAMuriz68gTIToxwOOnlp0MjxMJYW741Gs3RVldtbygE/dMcHX/moDaxTiWNZB53B3arb8/wC+4SOF4sf/AKxU9kcBsfOGHfoUHtG/RbzY5Die5HHhXdvavqiZ9Q8Jdlq4/gbKua7xe/L38zwCuhpf2Uk/Zo50kmwJKIdogDjw1VzzeL35e/meAVp1LTgqY4nn+mRauzqmqwrjzCLL3fHytz1E+upLL+Qj5W56jfXWRnroYKLtekKEFF2vSFQg9hSSe0flPPWosm/hIfoLzVl5PaPynnrRWb/w0X0F5q06XqlyM2sVYx5gmbFre/t71NY2T+0h8VbSO5SWNJUOKSAMp7jDGspmMPaLRlXS6eWve1/FRO7WYdbZm1Y/eW/R7qHxHRXGojlm3ulid6aVbaW+OALvgCLq2Hm9WxHKWqjhj6xsK1e8dm15l4niG1LZkswGsxtrPeOmsvayBJA1VItlWjptLuTdPMo7LtjRDq9naK4+WF9IrUW7BaHOljGqVHB7w2hzVoZt87d8vaNYSLl02CcRsDEbJbj71Uu7UBkvJ7/D7q2QoDxySaAO8MTXdxRVMpRp5XZOWdF/ms7R5XdyKfKWJsO/5PhrG5XlNxmEywW6bTnTxAAcJNbGSMXkM1pjgbiNo1PziPJ+Os7u7m/6ReM00ZOgxSpqYYHT3wRXMKN4ll9zUG4bQfNshu8sZVuEA2hirA4qe/VOwwrVbzbww5mI44UKRRYkbWG0S3JWctbd7u5WFfOOLHiUdJqmaipfLsIsObhWe001lMkMVvJNjhghIALMcBxCs7fxXQmkupx1bXDswGPlaTidVaEyKNXkoo4eBV+Sq7L7Vs9zcBgeyQ4GQ/MB1crmoim2orezqcowTuSeEY48jQ7oZX2PLzdyLhNd6RjrEY6I7+uspvH78vfzPAK6UAAAFGAGgAcArmu8Xvy9/M8ArTfio24RW5nnaG67uou3H/KPuqT2X8hHytz1G+upLL3enK3PUb66ys9RDBRdr0hQgou06QqEGUkntH5Tz1e238vF9BeaqKT2j8p56vbb+Xi+gvNWjTdUuRn1XTHmTh8KrJTJlt8t1CPIY44cGnpJVjTJYkmjaN9Ib4u7V923njTethRauZJV3PaW1rfLIiXEDYg6R4VYc9CXW7thfOZbKdbGZtLW8uPVY/u3GrkNUkM9zlcxUjbhfWOA90cRq4gv4LhdqN+VToNYWmnRm9NNVWNTyHc6VWBv8wt4YeHqm6xyPmroq1Z7WGFLSxTq7WLSuPSdjrkfumq5yHXDUeA92oO2SKpVumNAaoJLMXH3myp0rpJ4uKhc3tbDM5BMri1zAj79j7KTiY8TcdBpcsith0286o+sPCagEX9Pzg4zXUCp6QYse8oouCG3tk6m1BYv05W6T+IdyolxbHDAAa2OgDlNCz3ryN2WxBd5PJMg1t81eId2ukqnLlTBbfcuY+9uJLiRcvtPvHdsHK+cfRHcHDWsyawjyy0WBcDI3lTP6TeIcFV+S5OmXx9bJg1048o8Cj0V8Jq2DVu09nL80up7OxHi+oal3P8AXB/IsZS8T/YOV65zvCcc7vfzPAK3ivWCz445zeH954BXOr6I8yfSfyz+jvCLP3fHytz1G+upLP3fHytz1E+usbPaQ0UXadIUIKLtekKhB7Ckk9o/Keer22/l4/oLzVRSe0flPPV7b/y8X0F5q0abqlyM+q6Y8yQsBTDMor1o8aiaE1pbluMqS3sbLLHIhSRQyngqukhaJ9uBjo+H5aOa3ao2t34qouRlLajTalGP8v0IY8ylXQ+PKPFU/bYXOLPge6CKia0LaxTOxHu1Q7cuBd9yPEJ7TbjXKO8CajbMIF6CNIeNvJHjqIWJ7tSpYkalqVblwIdyG+RGXur0hXYJFxal+Dhq5y3slkv3Y2pD0pTr+QUClpJRUdo9XW4OLrTHtM16cZLLWkeC7y4jvlNEpcRtw1Ux27Ci448NZrTFy3nn3IQWxlgGrDZ3pza7/M8ArZo+ArF5171uvp+CqdV0R5l/psUrs2vB3hdl7vTlbnqJ9dS2Xu+PlbnqJ9dY2eshooq16QoQUXa9IVCD2FLJ7RuU89WNtmUSQqkgYMgw0accKrpPaPynnrZWG4Vi+VWmY5tnMWXG+XrIYnA0rhj0mdcTgdNdwnKDqjmduM1SRR/qlr8/4KX6pa8T/BVzDuLZXudRZblmbxXcPUNPc3KqCIwrbOzgrHEnHjoyD+3eSXkht7DeKG4umDGOJVUklfouThXfmbnZ7Cvy1vt9pmv1W1+d8FL9VteJvgq5yrcOGfLmzHN80iyyETPbptAEFo2ZG8pmUa1OFNn3Ky6W/sbDKM5hv5bx2WTZA+7RF2y52WOPJTzE+z2Dy1vt9pT/AKpacTerS/U7Tib1a04/t7kDXPY03jhN0W6sQ7K7W3q2dnrMccaDy/8At80kuZfqWYxWNtlcvUPPhiGYhWDeUy7IwYU8xPs9g8tb7faUn6pacTerTxm9oOBvVq3v9z927aynuId44LiWKNnjhAXF2UYhRg516qpsryjLr21665zFLSTaK9U2GOA87SwqY37knRU+BzOzags0s1Oyr+BKM6sxwP6tSDPLMen6vy0rvdm3Sxlu7K/S7WDDrFUDUTxgnTU826eXW7KlxmqQuwDBXUKcD+1Xee/wXuKX5XDGWLapSVcOyhEM/seJ/V+WnjeGx4pPV+Wkm6kKZlFay3Jlt7iFpYZY8ASVK6DjtDDA0f8A0Tl340/1f8Ndx8xJVWXB0KbktFFpNzdVXAC/qOwA0CQni2flrO3Vwbm5lnI2TKxbDirX/wBE5d+NcfV/wVR7xZPa5U9utvI8nWhmbbw0YEAYYAVxfhfy5rlKR4Fulu6X7mW1mzT8S4Yis/5CPlbnqJ9dSWfu9OVueon11mZvQ2i7XpChKKtekKhBlNJ7R+U89bDfGTb3a3ZX0Lcj6kdY+T2j8p560288m1kWQr6MJ+ylSAr+2cnV5renjs3H1loX+3j9XvbbtxLN9lqW4UnV5jdnjtXHxihtyZNjeSBu5J9k1BJe7xy7W5CJ/wCzuD/mTVTf2+fq97LJuLrPsNRueS7W6aJ/38x+vLVXuY+xvHaNxbf2GoCezf8A36j/APsSf8w1sLnqczTefJluYoLm5uo5F61sBshItP1cNFYe1f8A3ir/APfE/wCZUe9bB94r5jwuPsrQFhmG4l/Z2M17HdW90tuu3IkTHaCjWdIw0VVZdks9/C06yJFEp2dp+E1bbqybGTZ8vpQD7L1XRv8A7blT96Oda7tpNuuNE37Cq9KSisjyuUoxrStKllHbLlWTXsMs8chuSuwEPDqwoLe5y+YRE/gLzmqRekvKKtd4327yM/ulHxmrHJStySWVRyrjxKI2XC/CTlnlPPKTpTdFbP0L1bgrf5Lp0G3dPhQHwV0S1lzBsns3sESR8Crh9WAJGjSOKuU3E+zdZQ3oJh8IArdZXFDmOTpHa3i2+YrI2KtKy4ricBsBuHHgFXSo440+Wa2qqxjvM9uMoy+WvzWpLCWWWE28HxL6e43ojgkeSCBY1Ri5BGIUDT51cl3vm276BBqSEH4WbxV0tlkyXJcxTMb+OW6uY9mGHrCzDQwwAbTp2uKuTZ9N1uYsfRRR8WPhrm419mSSjRyiqxVK7y23B/ftuTm2oSdJyzNVw3BFn7vTlbnqF9dS2fu9OVueon11lZuQ2iLdsGFD05H2dNQGV0ntG5Tz1dWm9N1b2kVq8EVwsI2UaQaQOKhmitZGLOmk68DhSFvY+gfWNSAg7z3Qvo7yKCKIohiaNR5LKxx8qpxvjcqS0VpbxvwOAcRQPZ7D0G9Y0uz2HoH1jUCpLY7zXlpbm3eKO5QuzjrBqZji3x17PvNcyT288VvDBJbMWUovS2hslW7mFQ9nsPQPrGl2ew9A+saCod/WNxtbYsrfb17WBxx5ddD2281xC88klvDcSXEnWuzrqOGGC9zRUPZ7D0G9Y0uzWHoH1jQVCLreq6ntZbaO3it1mGy7RjTs1X2mYy20ZiCq8ZOODcdEdmsPQb1jS7PYegfWNdJuLqnQiSUlRqpFLmryxtH1Ma7Qw2gNNPOdSt0oI27p007s9h6B9Y0uz2HoH1jXX3Z+I4+1b8IJdX89xLHKQFMXQUahpxoiPN5P+onfU+A0/s9h6DesaXZ7D0D6xpG7OLbUtu0StW5JJx2bBsmbtiSiEk+cxoCWWSaVpZOk2vDVo0VYdnsPQb1jSNvZcCH1jSd2c+p1XAmFqEOmOPEfaH+BQd1ueo211IzrgFUYKNAAqI1WztCpUqVCRUqVKgFSpUqAVKlSoBUqVKgFSpUqAVKlSoBUqVKgFSpUqAVKlSoD/9k=",

        loaderText: "正在载入... ",

        loaderFont: "Arial",

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
                    cc.log(notification.getBody().name);
                    var viewMediator = this.facade.retrieveMediator(notification.getBody().name);
                    if (viewMediator) {
                        this.setView(viewMediator);
                    }
                    if (!this._initialized) {
                        this._initialized = true;
                    }

                    break;

            }
        },

        /** @override */
        onRegister: function () {

        },

        /** @override */
        onRemove: function () {

        },

        setView: function (viewMediator) {
            var self = this;

            self.viewComponent = new cc.Scene();

            viewMediator.init();

            var child = viewMediator.getViewComponent();
            if (child) {
                self.viewComponent.addChild(child);
            }

            var res = viewMediator.getResource();

            var handleSceneChanged = function () {
                self.sendNotification('SCENE_CHANGED');
            }

            if (res) {
                GeneCocosJS.LoaderScene.preload(res, handleSceneChanged, this);
            }
            else {
                handleSceneChanged();
            }
        }


    },
    // STATIC MEMBERS
    {
        NAME: 'SceneMediator',
        SCENE_CHANGE_VIEW: 'SceneChangeView'
    }
);

},{"GeneCocosJS":23,"puremvc":26}],20:[function(require,module,exports){
"use strict";

// 自定义自由落体的Action
var FreeFallAction = cc.ActionInterval.extend( {
    timeElasped:0,
    m_positionDeltaY:null,
    m_startPosition:null,
    m_targetPosition:null,
    _target : null,
    k_Acceleration : 10,
    v0:30,
    ctor:function() {
        cc.ActionInterval.prototype.ctor.call(this);
        this.yOffsetElasped = 0;
        this.timeElasped = 0;
        this.m_positionDeltaY = 0;  // 垂直偏移量
        this.m_startPosition = cc.p(0, 0);  // 起点坐标
        this.m_targetPosition = cc.p(0, 0); // 终点坐标
    },
    // 设置该Action运行的时间
    initWithDuration:function (duration) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            return true;
        }
        return false;
    },

    initWithOffset:function(deltaPosition) {
        var dropTime = (-this.v0 + Math.sqrt(this.v0*this.v0 + 2*this.k_Acceleration*Math.abs(deltaPosition)))/this.k_Acceleration;
        if(this.initWithDuration(dropTime)) {
            this.m_positionDeltaY = deltaPosition;
            return true;
        }
        //cc.log("dropTime =" + dropTime + "; deltaPosition=" + deltaPosition);
        return false;
    },

    isDone:function() {
        if (this.m_targetPosition.y >= this._target.getPositionY()) {
            return true;
        }
        return false;
    },

    // Node的runAction函数会调用ActionManager的addAction函数，在ActionManager的addAction函数中会调用Action的startWithTarget，然后在Action类的startWithTarget函数中设置_target的值。
    startWithTarget:function(target) {
        //cc.log("startWithTarget target=" + target);
        this._target = target;
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this.m_startPosition = target.getPosition();
        this.m_targetPosition = cc.p(this.m_startPosition.x, this.m_startPosition.y - this.m_positionDeltaY);
    },

    update:function(dt) {
        this.timeElasped += dt;
        if (this._target && this.m_targetPosition.y < this._target.getPositionY()) {
            var yMoveOffset = 0.5 * this.k_Acceleration * this.timeElasped * this.timeElasped + this.v0 * this.timeElasped;
            if (cc.ENABLE_STACKABLE_ACTIONS) {
                var newPos = cc.p(this.m_startPosition.x, this.m_startPosition.y - yMoveOffset);
                if (this.m_targetPosition.y > newPos.y) {
                    newPos.y = this.m_targetPosition.y;
                    this._target.stopAllActions();
                    this._target.landing_vertical();
                }
                this._target.setPosition(newPos);
            } else {
                this._target.setPosition(cc.p(this.m_startPosition.x, this.m_startPosition.y + this.m_positionDeltaY * dt));
            }
        }
    }

});

FreeFallAction.create = function(deltaPosition) {
    var ff = new FreeFallAction();
    ff.initWithOffset(deltaPosition);
    return ff;
};

module.exports.FreeFallAction = FreeFallAction;
},{}],21:[function(require,module,exports){
var res = {
    background : "res/background.jpg",
    background2 : "res/background2.JPG",
    milestone: "res/milestone.png",
    idle : "res/idle.png",
    ready_1 : "res/ready_1.png",
    ready_2 : "res/ready_2.png",
    ready_3 : "res/ready_3.png",
    ready_4 : "res/ready_4.png",
    ready_5 : "res/ready_5.png",
    strike_1 : "res/strike_1.png",
    strike_2 : "res/strike_2.png",
    strike_3 : "res/strike_3.png",
    strike_4 : "res/strike_4.png",
    strike_5 : "res/strike_5.png",
    strike_f_1 : "res/strike_f_1.png",
    strike_f_2 : "res/strike_f_3.png",
    strike_f_3 : "res/strike_f_3.png",
    strike_f_4 : "res/strike_f_4.png",
    strike_s_1 : "res/strike_s_1.png",
    strike_s_2 : "res/strike_s_2.png",
    strike_s_3 : "res/strike_s_3.png",
    strike_s_4 : "res/strike_s_4.png",
    strike_s_5 : "res/strike_s_5.png",
    penguin_jump_1 : "res/penguin_jump_1.png",
    penguin_jump_2 : "res/penguin_jump_2.png",
    penguin_jump_3 : "res/penguin_jump_3.png",
    penguin_jump_4 : "res/penguin_jump_4.png",
    penguin_jump_5 : "res/penguin_jump_5.png",
    penguin_jump_6 : "res/penguin_jump_6.png",
    penguin_vertical_landing_1 : "res/penguin_vertical_landing_1.png",
    penguin_vertical_landing_2 : "res/penguin_vertical_landing_2.png",
    penguin_vertical_landing_3 : "res/penguin_vertical_landing_3.png",
    penguin_vertical_landing_4 : "res/penguin_vertical_landing_4.png",
    penguin_fly_1 : "res/penguin_fly_1.png",
    penguin_fly_2 : "res/penguin_fly_2.png",
    penguin_fly_3 : "res/penguin_fly_3.png",
    penguin_landing_1 : "res/penguin_landing_1.png",
    penguin_landing_2 : "res/penguin_landing_2.png",
    penguin_landing_3 : "res/penguin_landing_3.png",
    penguin_landing_4 : "res/penguin_landing_4.png",
    button_bottom_pressed_2 : "res/button_bottom_pressed_2.png",
    penguin_nick : "res/penguin_nick.png",
    button_bottom_pressed_3: "res/button_bottom_pressed_3.png",
    penguin_step_left_1: "res/penguin_step_left_1.png",
    penguin_step_left_2: "res/penguin_step_left_2.png",
    penguin_step_left_3: "res/penguin_step_left_3.png",
    penguin_step_right_1: "res/penguin_step_right_1.png",
    penguin_step_right_2: "res/penguin_step_right_2.png",
    penguin_step_right_3: "res/penguin_step_right_3.png",

    button_more_game: "res/button_more.png",
    button_retry: "res/button_retry.png",
    penguin_idle: "res/penguin_idle.png"
};

var g_resources = [
    //image
    res.background,
    res.background2,
    res.idle,
    res.ready_1,
    res.ready_2,
    res.ready_3,
    res.ready_4,
    res.ready_5,
    res.strike_1,
    res.strike_2,
    res.strike_3,
    res.strike_4,
    res.strike_5,
    res.strike_f_1,
    res.strike_f_2,
    res.strike_f_3,
    res.strike_f_4,
    res.strike_s_1,
    res.strike_s_2,
    res.strike_s_3,
    res.strike_s_4,
    res.strike_s_5,
    res.penguin_jump_2,
    res.penguin_jump_3,
    res.penguin_jump_4,
    res.penguin_jump_5,
    res.penguin_jump_6,
    res.button_bottom_pressed_3,
    res.button_bottom_pressed_2,
    res.penguin_vertical_landing_1,
    res.penguin_vertical_landing_2,
    res.penguin_vertical_landing_3,
    res.penguin_vertical_landing_4,
    res.penguin_fly_1,
    res.penguin_fly_2,
    res.penguin_fly_3,
    res.penguin_landing_1,
    res.penguin_landing_2,
    res.penguin_landing_3,
    res.penguin_landing_4,
    res.penguin_nick,
    res.milestone,
    res.button_bottom_pressed_3,
    res.button_more_game,
    res.button_retry,
    res.penguin_step_left_1,
    res.penguin_step_left_2,
    res.penguin_step_left_3,
    res.penguin_step_right_1,
    res.penguin_step_right_2,
    res.penguin_step_right_3,
    res.penguin_idle,
    res.penguin_jump_1
];

module.exports.res = res;
module.exports.g_resources = g_resources;

},{}],22:[function(require,module,exports){
var LoaderScene = cc.Scene.extend({
    _image: null,
    _text: "Loading... ",
    _font: "Arial",
    _label : null,
    _className: "GeneJS.Cocos.LoaderScene",

    init : function(image, text, font){
        var self = this;

        if (image) {
            self._image = image;
        }
        if (text) {
            self._text = text;
        }
        if (font) {
            self._font = font;
        }

        var logoWidth = 160;
        var logoHeight = 200;

        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
        bgLayer.setPosition(cc.visibleRect.bottomLeft);
        self.addChild(bgLayer, 0);

        var fontSize = 24, lblHeight =  -logoHeight / 2 + 100;

        if(self._image){
            cc.loader.loadImg(self._image, {isCrossOrigin : false }, function(err, img){
                logoWidth = img.width;
                logoHeight = img.height;
                self._initStage(img, cc.visibleRect.center);
            });
            fontSize = 14;
            lblHeight = -logoHeight / 2 - 10;
        }

        var label = self._label = new cc.LabelTTF(self._text +"0%",  self._font, fontSize);
        label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
        label.setColor(cc.color(180, 180, 180));
        bgLayer.addChild(this._label, 10);

        return true;
    },
    _initStage: function (img, centerPos) {
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        var logo = self._logo = new cc.Sprite(texture2d);
        logo.setScale(cc.contentScaleFactor());
        logo.x = centerPos.x;
        logo.y = centerPos.y;
        self._bgLayer.addChild(logo, 10);
    },
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
    },
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = self._text +"0%";
        this._label.setString(tmpStr);
    },
    initWithResources: function (resources, cb) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
    },
    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self._label.setString(self._text + percent + "%");
            }, function () {
                if (self.cb)
                    self.cb();
            });
    }
});
LoaderScene.setImage = function(image){

}

LoaderScene.preload = function(resources, cb, sender){

    if(!this.loaderScene) {
        this.loaderScene = new LoaderScene();
        this.loaderScene.init(sender.loaderImage, sender.loaderText, sender.loaderFont);
    }
    this.loaderScene.initWithResources(resources, cb);
    cc.director.runScene(this.loaderScene);
    return this.loaderScene;
};

module.exports = LoaderScene;
},{}],23:[function(require,module,exports){
var GeneCocosJS = {
    LoaderScene: require("./class/LoaderScene.js")
};

module.exports = GeneCocosJS;
},{"./class/LoaderScene.js":22}],24:[function(require,module,exports){
/*** ease.min-0.2.4.js ***/

var easejs={};
(function(B,n){var j={},h=function(b){var b=("/"===b.substr(0,1)?b:n+"/"+b).replace(/([^\/]+\/\.\.\/|\.\/|^\/)/g,""),c=j[b];if(void 0===c)throw"[ease.js] Undefined module: "+b;return c.exports};(function(b){function c(){if(!(this instanceof c))return new c;this.___$$id$$=e+f(1E8*a())}b.exports={};n="util/symbol";var a=Math.random,f=Math.floor,e=" "+String.fromCharCode(f(10*a())%31+1)+"$";c.prototype={toString:function(){return this.___$$id$$}};b.exports=c})(j["util/symbol/FallbackSymbol"]={},".");
    (function(b){function c(){if(!(this instanceof c))return new c;this._alt={}}b.exports={};n="util";(0,eval)("var _the_global=this");c.expose=function(){return _the_global};c.prototype={provideAlt:function(a,c){if(!(void 0!==_the_global[a]||void 0!==this._alt[a]))return this._alt[a]=c(),this},get:function(a){return void 0!==this._alt[a]?this._alt[a]:_the_global[a]}};b.exports=c})(j["util/Global"]={},".");(function(b){b.exports={};n="util";var c=h("./symbol/FallbackSymbol"),a=h("./Global").expose();
        b.exports=a.Symbol||c})(j["util/Symbol"]={},".");(function(b){b=b.exports={};n=".";var c={"public":1,"protected":2,"private":4,"static":8,"abstract":16,"const":32,virtual:64,override:128,proxy:256,weak:512},a={amods:c["public"]|c["protected"]|c["private"],virtual:c["abstract"]|c.virtual};b.kvals=c;b.kmasks=a;b.parseKeywords=function(b){var e=b,d=[],g=0,i={};if(1!==(d=(""+b).split(/\s+/)).length){e=d.pop();for(b=d.length;b--;){var C=d[b],r=c[C];if(!r)throw Error("Unexpected keyword for '"+e+"': "+
        C);i[C]=!0;g|=r}}e.match(/^_[^_]/)&&!(g&a.amods)&&(i["private"]=!0,g|=c["private"]);return{name:e,keywords:i,bitwords:g}}})(j.prop_parser={},".");(function(b){function c(a){throw a;}function a(a,c,b){for(var e=b.length;e--;)null===b[e].match(/^[a-z_][a-z0-9_]*$/i)&&a(SyntaxError("Member "+c+" contains invalid parameter '"+b[e]+"'"))}function f(){return g?function(a,c,b){Object.defineProperty(a,c,{value:b,enumerable:!1,writable:!1,configurable:!1})}:function(a,c,b){a[c]=b}}var e=b.exports={};n=".";
        var d=h("./prop_parser").parseKeywords,g;a:{if("function"===typeof Object.defineProperty)try{Object.defineProperty({},"x",{});g=!0;break a}catch(i){}g=!1}e.Global=h("./util/Global");e.freeze="function"===typeof Object.freeze?Object.freeze:function(){};e.definePropertyFallback=function(a){if(void 0===a)return!g;g=!a;e.defineSecureProp=f();return e};e.defineSecureProp=f();e.clone=function r(a,c){c=!!c;if(a instanceof Array){if(!c)return a.slice(0);for(var b=[],e=0,d=a.length;e<d;e++)b.push(r(a[e],c));
            return b}if("function"!==typeof a&&a instanceof Object){b={};e=Object.prototype.hasOwnProperty;for(d in a)e.call(a,d)&&(b[d]=c?r(a[d]):a[d]);return b}return a};e.copyTo=function(a,c,b){var b=!!b,d;if(!(a instanceof Object)||!(c instanceof Object))throw TypeError("Must provide both source and destination objects");if(g)for(var f in c)d=Object.getOwnPropertyDescriptor(c,f),d.get||d.set?Object.defineProperty(a,f,d):a[f]=b?e.clone(c[f],!0):c[f];else for(f in c)a[f]=b?e.clone(c[f],!0):c[f];return a};e.propParse=
            function(b,f,p){var v=function(){},i=f.each||void 0,h=f.property||v,m=f.method||v,v=f.getset||v,l=f.keywordParser||d,x=f._throw||c,j=Object.prototype.hasOwnProperty,s={},k="",s={},o=null,t=!1,u=!1,w;for(w in b)if(j.call(b,w)){if(g)k=Object.getOwnPropertyDescriptor(b,w),t=k.get,u=k.set;o="function"===typeof t?void 0:b[w];s=l(w)||{};k=s.name||w;s=s.keywords||{};if(f.assumeAbstract||s["abstract"]&&!s.override)s["abstract"]=!0,o instanceof Array||x(TypeError("Missing parameter list for abstract method: "+
                k)),a(x,k,o),o=e.createAbstractMethod.apply(this,o);i&&i.call(p,k,o,s);t||u?v.call(p,k,t,u,s):"function"===typeof o||s.proxy?m.call(p,k,o,e.isAbstractMethod(o),s):h.call(p,k,o,s)}};e.createAbstractMethod=function(a){for(var c=[],b=arguments.length;b--;)c[b]=arguments[b];b=function(){throw Error("Cannot call abstract method");};e.defineSecureProp(b,"abstractFlag",!0);e.defineSecureProp(b,"definition",c);e.defineSecureProp(b,"__length",arguments.length);return b};e.isAbstractMethod=function(a){return"function"===
            typeof a&&!0===a.abstractFlag?!0:!1};e.arrayShrink=function(a){for(var c=[],b=0,e=a.length;b<e;b++){var d=a[b];void 0!==d&&c.push(d)}return c};e.getOwnPropertyDescriptor=g&&Object.getOwnPropertyDescriptor||function(a,c){return!Object.prototype.hasOwnProperty.call(a,c)?void 0:{get:void 0,set:void 0,writable:!0,enumerable:!0,configurable:!0,value:a[c]}};e.getPrototypeOf=Object.getPrototypeOf||function(){};e.getPropertyDescriptor=function(a,c,b){var b=!!b,d=e.getOwnPropertyDescriptor(a,c),a=e.getPrototypeOf(a);
            return!d&&a&&(!b||e.getPrototypeOf(a))?e.getPropertyDescriptor(a,c,b):d};e.defineSecureProp(e.getPropertyDescriptor,"canTraverse",Object.getPrototypeOf?!0:!1)})(j.util={},".");(function(b){function c(a){if(!(this instanceof c))return new c(a);if(!(a instanceof Error))throw TypeError("Must provide exception to wrap");Error.prototype.constructor.call(this,a.message);this.message=a.message;this.name="Warning";this._error=a;this.stack=a.stack&&a.stack.replace(/^.*?\n+/,this.name+": "+this.message+"\n")}
        b.exports={};n="warn";c.prototype=Error();c.prototype.constructor=c;c.prototype.name="Warning";c.prototype.getError=function(){return this._error};b.exports=c})(j["warn/Warning"]={},".");(function(b){function c(){if(!(this instanceof c))return new c}b.exports={};n="warn";c.prototype={handle:function(){}};b.exports=c})(j["warn/DismissiveHandler"]={},".");(function(b){function c(a){if(!(this instanceof c))return new c(a);this._console=a||{}}b.exports={};n="warn";c.prototype={handle:function(a){var c=
        this._console.warn||this._console.log;c&&c.call(this._console,"Warning: "+a.message)}};b.exports=c})(j["warn/LogHandler"]={},".");(function(b){function c(){if(!(this instanceof c))return new c}b.exports={};n="warn";c.prototype={handle:function(a){throw a.getError();}};b.exports=c})(j["warn/ThrowHandler"]={},".");(function(b){b.exports={};n=".";b.exports={Warning:h("./warn/Warning"),DismissiveHandler:h("./warn/DismissiveHandler"),LogHandler:h("./warn/LogHandler"),ThrowHandler:h("./warn/ThrowHandler")}})(j.warn=
    {},".");(function(b){function c(w,a){try{if(a instanceof w)return!0}catch(c){}return!1}function a(w,a,c){a=this.defs;if(!0===o[w])throw Error(w+" is reserved");if(s.call(a,w)&&!c.weak&&!a[w].weak)throw Error("Cannot redefine method '"+w+"' in same declaration");a[w]=c}function f(a,c,b){this._cb._memberBuilder.buildProp(i(b)?this.static_members.props:this.prop_init,null,a,c,b,this.base)}function e(a,c,b,e){var d=i(e)?this.static_members.methods:this.members,k=i(e)?this.staticInstLookup:m.getMethodInstance;
        this._cb._memberBuilder.buildGetterSetter(d,null,a,c,b,e,k,this.class_id,this.base)}function d(a,c,b,e){var d=i(e),k=d?this.static_members.methods:this.members,d=d?this.staticInstLookup:m.getMethodInstance;if(!0===t[a]&&(e["protected"]||e["private"]))throw TypeError(a+" must be public");this._cb._memberBuilder.buildMethod(k,null,a,c,e,d,this.class_id,this.base,this.state)&&(b?(this.abstract_methods[a]=!0,this.abstract_methods.__length++):s.call(this.abstract_methods,a)&&!1===b&&(delete this.abstract_methods[a],
        this.abstract_methods.__length--),e.virtual&&(this.virtual_members[a]=!0))}function g(a,c,b,e){if(a.___$$abstract$$){if(!e&&0===b.__length)throw TypeError("Class "+(c||"(anonymous)")+" was declared as abstract, but contains no abstract members");}else if(0<b.__length)if(e)a.___$$abstract$$=!0;else throw TypeError("Class "+(c||"(anonymous)")+" contains abstract members and must therefore be declared abstract");}function i(a){return a["static"]||a["const"]?!0:!1}function C(a,c){var b=c.__cid?m.getMeta(c):
        void 0;return b?a[u].meta=l.clone(b,!0):a[u].meta={implemented:[]}}function r(a,c){l.defineSecureProp(a,"__iid",c)}function y(a){var c=function(){};c.prototype=a;l.defineSecureProp(a,u,{});a[u].vis=new c}function p(a){var c=function(c){return b.exports.isInstanceOf(c,a)};l.defineSecureProp(a,"isInstanceOf",c);l.defineSecureProp(a,"isA",c)}function v(a,c){var b=0<c.__length?!0:!1;l.defineSecureProp(a,"isAbstract",function(){return b})}function j(a,c){l.defineSecureProp(a,"__cid",c);l.defineSecureProp(a.prototype,
        "__cid",c)}function A(a,c){a.___$$final$$=!!c.___$$final$$;a.___$$abstract$$=!!c.___$$abstract$$;c.___$$final$$=c.___$$abstract$$=void 0}var m=b.exports={};n=".";var l=h("./util"),x=h("./warn").Warning,q=h("./util/Symbol"),s=Object.prototype.hasOwnProperty,k=!1===Object.prototype.propertyIsEnumerable.call({toString:function(){}},"toString")?!0:!1,o={__initProps:!0,constructor:!0},t={__construct:!0,__mixin:!0,toString:!0,__toString:!0},u=q();b.exports=m=function(a,c,e){if(!(this instanceof m))return new b.exports(a,
        c,e);this._warnHandler=a;this._memberBuilder=c;this._visFactory=e;this._instanceId=this._classId=0;this._spropInternal=this._extending=!1};m.ClassBase=function(){};l.defineSecureProp(m.ClassBase,"__cid",0);m.ClassBase.$=function(a,c){if(void 0!==c)throw ReferenceError("Cannot set value of undeclared static property '"+a+"'");};m.getReservedMembers=function(){return l.clone(o,!0)};m.getForcedPublicMethods=function(){return l.clone(t,!0)};m.getMeta=function(a){return(a[u]||{}).meta||null};m.isInstanceOf=
        function(a,b){return!a||!b?!1:!!(a.__isInstanceOf||c)(a,b)};m.prototype.build=function(a,c){var b=this;this._extending=!0;var e=arguments,d=e.length,f=(0<d?e[d-1]:0)||{},t=(1<d?e[d-2]:0)||m.ClassBase,e=this._getBase(t),d="",o=!1,r=this._memberBuilder.initMembers(),p=this._memberBuilder.initMembers(e),i={methods:this._memberBuilder.initMembers(),props:this._memberBuilder.initMembers()},o=m.getMeta(t)||{},y=l.clone(o.abstractMethods)||{__length:0},s=l.clone(o.virtualMembers)||{};if(!0===t.___$$final$$)throw Error("Cannot extend final class "+
        (t[u].meta.name||"(anonymous)"));(d=f.__name)&&delete f.__name;void 0!==(o=f.___$$auto$abstract$$)&&delete f.___$$auto$abstract$$;if(k&&f.toString!==Object.prototype.toString)f.__toString=f.toString;this._classId++;void 0===(e[u]||{}).vis&&this._discoverProtoProps(e,r);try{this.buildMembers(f,this._classId,t,r,{all:p,"abstract":y,"static":i,virtual:s},function(){return q.___$$svis$$})}catch(h){if(h instanceof x)this._warnHandler.handle(h);else throw h;}e.___$$parent$$=t.prototype;var q=this.createCtor(d,
        y,p);this.initStaticVisibilityObj(q);var n=this,B=function(a,c){n.attachStatic(a,i,t,c)};B(q,!1);this._attachPropInit(e,r,p,q,this._classId);q.prototype=e;q.prototype.constructor=q;q.___$$props$$=r;q.___$$methods$$=p;q.___$$sinit$$=B;A(q,f);g(q,d,y,o);l.defineSecureProp(e,"__self",q.___$$svis$$);o=C(q,t);o.abstractMethods=y;o.virtualMembers=s;o.name=d;v(q,y);j(q,this._classId);q.asPrototype=function(){b._extending=!0;var a=q();b._extending=!1;return a};this._extending=!1;return q};m.prototype._getBase=
        function(a){switch(typeof a){case "function":return new a;case "object":return a}throw TypeError("Must extend from Class, constructor or object");};m.prototype._discoverProtoProps=function(a,c){var b=Object.hasOwnProperty,e;for(e in a){var d=a[e];b.call(a,e)&&"function"!==typeof d&&this._memberBuilder.buildProp(c,null,e,d,{})}};m.prototype.buildMembers=function(c,b,k,t,u,C){var o={_cb:this,prop_init:t,class_id:b,base:k,staticInstLookup:C,defs:{},state:{},members:u.all,abstract_methods:u["abstract"],
        static_members:u["static"],virtual_members:u.virtual},g={each:a,property:f,getset:e,method:d};if(c.___$$parser$$){var r=c.___$$parser$$;delete c.___$$parser$$;b=function(a,c){g[a]=function(){for(var b=[],e=arguments.length;e--;)b[e]=arguments[e];b.push(c);r[a].apply(o,b)}};r.each&&b("each",g.each);r.property&&b("property",g.property);r.getset&&b("getset",g.getset);r.method&&b("method",g.method)}l.propParse(c,g,o);this._memberBuilder.end(o.state)};m.prototype.createCtor=function(a,c,b){a=0===c.__length?
        this.createConcreteCtor(a,b):this.createAbstractCtor(a);l.defineSecureProp(a,u,{});return a};m.prototype.createConcreteCtor=function(a,c){function b(){if(!(this instanceof b))return e=arguments,new b;y(this);this.__initProps();if(!d._extending){r(this,++d._instanceId);var k="function"===typeof this.___$$ctor$pre$$;k&&b.prototype.hasOwnProperty("___$$ctor$pre$$")&&(this.___$$ctor$pre$$(u),k=!1);"function"===typeof this.__construct&&this.__construct.apply(this,e||arguments);k&&this.___$$ctor$pre$$(u);
        "function"===typeof this.___$$ctor$post$$&&this.___$$ctor$post$$(u);e=null;p(this);if(!s.call(c["public"],"toString"))this.toString=c["public"].__toString||(a?function(){return"#<"+a+">"}:function(){return"#<anonymous>"})}}var e=null,d=this;b.toString=a?function(){return a}:function(){return"(Class)"};return b};m.prototype.createAbstractCtor=function(a){var c=this,b=function(){if(!c._extending)throw Error("Abstract class "+(a||"(anonymous)")+" cannot be instantiated");};b.toString=a?function(){return a}:
        function(){return"(AbstractClass)"};return b};m.prototype._attachPropInit=function(a,c,b,e,d){var k=this;l.defineSecureProp(a,"__initProps",function(e){var e=!!e,f=a.___$$parent$$,t=this[u].vis,f=f&&f.__initProps;"function"===typeof f&&f.call(this,!0);f=k._visFactory.createPropProxy(this,t,c["public"]);t=t[d]=k._visFactory.setup(f,c,b);e||l.defineSecureProp(t,"__inst",this)})};m.prototype.initStaticVisibilityObj=function(a){var c=this,b=function(){};b.prototype=a;b=new b;a.___$$svis$$=b;b.$=function(){c._spropInternal=
        !0;var b=a.$.apply(a,arguments);c._spropInternal=!1;return b}};m.prototype.attachStatic=function(a,c,b,e){var d=c.methods,k=c.props,f=this;(c=b.___$$sinit$$)&&c(a,!0);if(!e)a.___$$sprops$$=k,l.defineSecureProp(a,"$",function(c,e){var d=!1,t=this.___$$sprops$$?this:a,u=t!==a,d=s.call(k["public"],c)&&"public";!d&&f._spropInternal&&(d=s.call(k["protected"],c)&&"protected"||!u&&s.call(k["private"],c)&&"private");if(!1===d)return(b.__cid&&b.$||m.ClassBase.$).apply(t,arguments);d=k[d][c];if(1<arguments.length){if(d[1]["const"])throw TypeError("Cannot modify constant property '"+
        c+"'");d[0]=e;return t}return d[0]});l.copyTo(a,d["public"],!0);l.copyTo(a.___$$svis$$,d["protected"],!0);e||l.copyTo(a.___$$svis$$,d["private"],!0)};m.getMethodInstance=function(a,c){if(void 0===a)return null;var b=a[u],e;return a.__iid&&b&&(e=b.vis)?e[c]:null}})(j.ClassBuilder={},".");(function(b){var c=b.exports={};n=".";b.exports=c=function(a){if(!(this instanceof c))return new b.exports(a);this._factory=a};c.prototype.wrapMethod=function(a,c,b,d,g,i){return this._factory(a,c,b,d,g,i)}})(j.MethodWrapperFactory=
    {},".");(function(b){b=b.exports={};n=".";b.standard={wrapOverride:function(c,a,b,e){var d=function(){var d=e(this,b)||this||{},i=void 0,C=d.__super;d.__super=a;i=c.apply(d,arguments);d.__super=C;return i===d?this:i};d["super"]=a;return d},wrapNew:function(c,a,b,e){return function(){var a=e(this,b)||this,g=void 0,g=c.apply(a,arguments);return g===a?this:g}},wrapProxy:function(c,a,b,e,d,g){var i=g&&g["static"],a=function(){var a=e(this,b)||this,r=void 0,a=i?a.$(c):a[c];if(!(null!==a&&"object"===typeof a&&
        "function"===typeof a[d]))throw TypeError("Unable to proxy "+d+"() call to '"+c+"'; '"+c+"' is undefined or '"+d+"' is not a function.");r=a[d].apply(a,arguments);return r===a?this:r};a.__length=NaN;return a}}})(j.MethodWrappers={},".");(function(b){function c(a){return function(){return this.___$$super$$.prototype[a].apply(this.___$$pmo$$,arguments)}}function a(a,c,b){if(c["private"])return(c["public"]||c["protected"])&&f(b),a["private"];if(c["protected"])return(c["public"]||c["private"])&&f(b),
        a["protected"];(c["private"]||c["protected"])&&f(b);return a["public"]}function f(a){throw TypeError("Only one access modifier may be used for definition of '"+a+"'");}function e(a,c,b){for(var d=i.length,f=null;d--;)if(f=g.getPropertyDescriptor(a[i[d]],c,!0))return{get:f.get,set:f.set,member:f.value};return void 0!==b?(a=b.___$$methods$$,d=b.___$$props$$,b=((b.prototype||{}).___$$parent$$||{}).constructor,a&&e(a,c,b)||d&&e(d,c,b)||null):null}var d=b.exports={};n=".";var g=h("./util"),i=["public",
        "protected","private"];b.exports=function(a,c,e,d){if(!(this instanceof b.exports))return new b.exports(a,c,e,d);this._wrapMethod=a;this._wrapOverride=c;this._wrapProxy=e;this._validate=d};d=b.exports.prototype;d.initMembers=function(a,c,b){return{"public":a||{},"protected":c||{},"private":b||{}}};d.buildMethod=function(b,d,f,g,i,h,j,m,l){var x=this._methodKeywordDefaults,x=(d=(m=e(b,f,m))?m.member:null)&&(d.___$$keywords$$||x),b=a(b,i,f);this._validate.validateMethod(f,g,i,m,x,l);if(i.proxy&&(!d||
        !i.weak))b[f]=this._createProxy(g,h,j,f,i);else if(d){if(i.weak&&!x["abstract"])return!1;if(i.override||x["abstract"])l=i["abstract"]?c(f):d,b[f]=this._overrideMethod(l,g,h,j);else throw Error("Method hiding not yet implemented (we should never get here; bug).");}else b[f]=i["abstract"]||i["private"]?g:this._overrideMethod(null,g,h,j);b[f].___$$keywords$$=i;return!0};d._methodKeywordDefaults={virtual:!0};d.buildProp=function(c,b,d,f,g,i){i=(b=e(c,d,i))?b.member:null;this._validate.validateProperty(d,
        f,g,b,i?i[1]:null);a(c,g,d)[d]=[f,g]};d.buildGetterSetter=function(c,b,d,f,g,i,h,j,l){b=e(c,d,l);this._validate.validateGetterSetter(d,{},i,b,b&&b.get?b.get.___$$keywords$$:null);if(f)f=this._overrideMethod(null,f,h,j),f.___$$keywords$$=i;Object.defineProperty(a(c,i,d),d,{get:f,set:g?this._overrideMethod(null,g,h,j):g,enumerable:!0,configurable:!1})};d._createProxy=function(a,c,b,d,e){return this._wrapProxy.wrapMethod(a,null,b,c,d,e)};d._overrideMethod=function(a,c,b,d){var e=null,e=(a?this._wrapOverride:
        this._wrapMethod).wrapMethod(c,a,d,b||function(){});g.defineSecureProp(e,"__length",c.__length||c.length);return e};d._getVisibilityValue=function(a){return a["protected"]?1:a["private"]?2:0};d.end=function(a){this._validate&&this._validate.end(a)}})(j.MemberBuilder={},".");(function(b){var c=b.exports={};n=".";b.exports=c=function(a){if(!(this instanceof b.exports))return new b.exports(a);this._warningHandler=a||function(){}};c.prototype._initState=function(a){if(a.__vready)return a;a.warn={};a.__vready=
        !0;return a};c.prototype.end=function(a){for(var c in a.warn){var b=a.warn[c],d;for(d in b)this._warningHandler(b[d])}a.__vready=!1};c.prototype.validateMethod=function(a,c,b,d,g,i){this._initState(i);var h=d?d.member:null;if(b["abstract"]&&b["private"])throw TypeError("Method '"+a+"' cannot be both private and abstract");if(b["const"])throw TypeError("Cannot declare method '"+a+"' as constant; keyword is redundant");if(b.virtual&&b["static"])throw TypeError("Cannot declare static method '"+a+"' as virtual");
        if(d&&(d.get||d.set))throw TypeError("Cannot override getter/setter '"+a+"' with method");if(b.proxy){if("string"!==typeof c)throw TypeError("Cannot declare proxy method '"+a+"'; string value expected");if(b["abstract"])throw TypeError("Proxy method '"+a+"' cannot be abstract");}if(h){if(g["private"])throw TypeError("Private member name '"+a+"' conflicts with supertype");if("function"!==typeof h)throw TypeError("Cannot override property '"+a+"' with method");if(b.override&&!g.virtual){if(!b["abstract"])throw TypeError("Cannot override non-virtual method '"+
            a+"'");if(!g["abstract"])throw TypeError("Cannot perform abstract override on non-abstract method '"+a+"'");}if(b["abstract"]&&!b.weak&&!g["abstract"])throw TypeError("Cannot override concrete method '"+a+"' with abstract method");d=void 0===h.__length?h.length:h.__length;c=void 0===c.__length?c.length:c.__length;b.proxy&&(c=NaN);b.weak&&!g["abstract"]&&(h=d,d=c,c=h);if(c<d)throw TypeError("Declaration of method '"+a+"' must be compatible with that of its supertype");if(this._getVisibilityValue(g)<
            this._getVisibilityValue(b))throw TypeError("Cannot de-escalate visibility of method '"+a+"'");if(!b.override&&!g["abstract"]&&!b.weak)throw TypeError("Attempting to override method '"+a+"' without 'override' keyword");b.weak&&g.override&&delete (i.warn[a]||{}).no}else if(b.override)(i.warn[a]=i.warn[a]||{}).no=Error("Method '"+a+"' using 'override' keyword without super method")};c.prototype.validateProperty=function(a,c,b,d,g){if(c=d?d.member:null){if(g["private"])throw TypeError("Private member name '"+
        a+"' conflicts with supertype");if("function"===typeof c)throw new TypeError("Cannot override method '"+a+"' with property");if(this._getVisibilityValue(g)<this._getVisibilityValue(b))throw TypeError("Cannot de-escalate visibility of property '"+a+"'");}if(d&&(d.get||d.set))throw TypeError("Cannot override getter/setter '"+a+"' with property");if(b["abstract"])throw TypeError("Property '"+a+"' cannot be declared as abstract");if(b["static"]&&b["const"])throw TypeError("Static keyword cannot be used with const for property '"+
        a+"'");if(b.virtual)throw TypeError("Cannot declare property '"+a+"' as virtual");};c.prototype.validateGetterSetter=function(a,c,b,d,g){c=d?d.member:null;d=d&&(d.get||d.set)?!0:!1;if(b["abstract"])throw TypeError("Cannot declare getter/setter '"+a+"' as abstract");if(b["const"])throw TypeError("Cannot declare const getter/setter '"+a+"'");if(b.virtual&&b["static"])throw TypeError("Cannot declare static method '"+a+"' as virtual");if(c||d){if(g&&g["private"])throw TypeError("Private member name '"+
        a+"' conflicts with supertype");if(!d)throw TypeError("Cannot override method or property '"+a+"' with getter/setter");if(!g||!g.virtual)throw TypeError("Cannot override non-virtual getter/setter '"+a+"'");if(!b.override)throw TypeError("Attempting to override getter/setter '"+a+"' without 'override' keyword");if(this._getVisibilityValue(g||{})<this._getVisibilityValue(b))throw TypeError("Cannot de-escalate visibility of getter/setter '"+a+"'");}else b.override&&this._warningHandler(Error("Getter/setter '"+
        a+"' using 'override' keyword without super getter/setter"))};c.prototype._getVisibilityValue=function(a){return a["protected"]?1:a["private"]?2:0}})(j.MemberBuilderValidator={},".");(function(b){var c=b.exports={};n=".";var a=h("./util");b.exports=c=function(){if(!(this instanceof c))return new b.exports};c.prototype.setup=function(a,b,c){var g=this._createPrivateLayer(a,b);this._doSetup(a,b["public"]);this._doSetup(a,b["protected"],c["protected"],!0);this._doSetup(g,b["private"],c["private"]);return g};
        c.prototype._createPrivateLayer=function(a,b){var c=function(){};c.prototype=a;c=new c;this.createPropProxy(a,c,b["protected"]);return c};c.prototype._doSetup=function(b,c,d,g){var i=Array.prototype.hasOwnProperty;if(void 0!==d)for(var h in d)if(i.call(d,h)){var j=b[h],n=j&&j.___$$keywords$$;if(!g||void 0===j||n["private"]||n["protected"])b[h]=d[h]}for(var p in c)i.call(c,p)&&(b[p]=a.clone(c[p][0]))};c.prototype.createPropProxy=function(a,b,c){var g=Object.prototype.hasOwnProperty,i;for(i in c)g.call(c,
            i)&&function(c){b[c]=void 0;Object.defineProperty(b,c,{set:function(b){a[c]=b},get:function(){return a[c]},enumerable:!0})}.call(null,i);return b}})(j.VisibilityObjectFactory={},".");(function(b){var c=b.exports={};n=".";b.exports=c=function(){if(!(this instanceof c))return new b.exports};c.prototype=h("./VisibilityObjectFactory")();c.prototype._createPrivateLayer=function(a){return a};c.prototype.createPropProxy=function(a){return a}})(j.FallbackVisibilityObjectFactory={},".");(function(b){b=b.exports=
    {};n=".";var c=h("./util"),a=h("./VisibilityObjectFactory"),f=h("./FallbackVisibilityObjectFactory");b.fromEnvironment=function(){return c.definePropertyFallback()?f():a()}})(j.VisibilityObjectFactoryFactory={},".");(function(b){function c(a){if(1<arguments.length)throw Error("Expecting one argument for anonymous Class definition; "+arguments.length+" given.");return i(a)}function a(a,c){if(2<arguments.length)throw Error("Expecting at most two arguments for definition of named Class '"+a+"'; "+arguments.length+
        " given.");if(void 0===c)return f(a);if("object"!==typeof c)throw TypeError("Unexpected value for definition of named Class '"+a+"'; object expected");c.__name=a;return i(c)}function f(a){return{extend:function(){for(var c=[],b=arguments.length;b--;)c[b]=arguments[b];c[c.length-1].__name=a;return i.apply(null,c)},implement:function(){for(var c=[],b=arguments.length;b--;)c[b]=arguments[b];return e(null,c,a)},use:function(){for(var a=[],c=arguments.length;c--;)a[c]=arguments[c];return d(q,a)}}}function e(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    c,b){var e={extend:function(){var d=arguments.length,e=arguments[d-1],k=1<d?arguments[d-2]:null;if(2<d)throw Error("Expecting no more than two arguments for extend()");if(a&&k)throw Error("Cannot override parent "+a.toString()+" with "+k.toString()+" via extend()");if(b)e.__name=b;c.push(a||k||i({}));return i.call(null,o.apply(this,c),e)},use:function(){for(var a=[],c=arguments.length;c--;)a[c]=arguments[c];return d(function(){return e.__createBase()},a)},__createBase:function(){return e.extend({})}};
        return e}function d(a,c,b){var e=function(){if(!b)throw TypeError("Cannot instantiate incomplete class definition; did you forget to call `extend'?");return g(a(),c).apply(null,arguments)};e.extend=function(){var b=arguments.length,d=arguments[b-1],b=1<b?arguments[b-2]:null,e=a();return i.call(null,g(e||b,c),d)};e.use=function(){for(var a=[],c=arguments.length;c--;)a[c]=arguments[c];return d(function(){return e.__createBase()},a,b)};e.__createBase=function(){return e.extend({})};return e}function g(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                c){for(var b={___$$auto$abstract$$:!0},d=[],e=0,k=c.length;e<k;e++)c[e].__mixin(b,d,a||z.ClassBase);b=i.call(null,a,b);d=z.getMeta(b).implemented;e=0;for(k=c.length;e<k;e++)d.push(c[e]),c[e].__mixinImpl(d);return b}function i(a,c){for(var b=[],d=arguments.length;d--;)b[d]=arguments[d];b=x.build.apply(x,b);j(b);r(b);y(b);v.freeze(b);return b}function j(a){v.defineSecureProp(a,"extend",function(a){return i(this,a)})}function r(a){v.defineSecureProp(a,"implement",function(){for(var c=[],b=arguments.length;b--;)c[b]=
        arguments[b];return e(a,c)})}function y(a){v.defineSecureProp(a,"use",function(){for(var c=[],b=arguments.length;b--;)c[b]=arguments[b];return d(function(){return a},c,!0)})}b.exports={};n=".";var p="undefined"!==typeof console?console:void 0,v=h("./util"),z=h("./ClassBuilder"),A=h("./warn"),m=A.Warning,l=A.LogHandler(p),p=h("./MethodWrapperFactory"),A=h("./MethodWrappers").standard,x=z(l,h("./MemberBuilder")(p(A.wrapNew),p(A.wrapOverride),p(A.wrapProxy),h("./MemberBuilderValidator")(function(a){l.handle(m(a))})),
        h("./VisibilityObjectFactoryFactory").fromEnvironment()),q=function(){return null};b.exports=function(b,d){for(var e=typeof b,k=null,k=[],f=arguments.length;f--;)k[f]=arguments[f];switch(e){case "object":k=c.apply(null,k);break;case "string":k=a.apply(null,k);break;default:throw TypeError("Expecting anonymous class definition or named class definition");}return k};b.exports.extend=i;b.exports.implement=function(a){return e(null,Array.prototype.slice.call(arguments))};b.exports.use=function(a){for(var b=
        [],c=arguments.length;c--;)b[c]=arguments[c];return d(q,b)};var s={prototype:{}},k={constructor:{prototype:{}}};b.exports.isClass=function(a){a=a||s;if(!a.prototype)return!1;var c=z.getMeta(a);return null!==c&&c.implemented||a.prototype instanceof z.ClassBase?!0:!1};b.exports.isClassInstance=function(a){a=a||k;return b.exports.isClass(a.constructor)};b.exports.isInstanceOf=z.isInstanceOf;b.exports.isA=b.exports.isInstanceOf;var o=function(a,c){for(var d=arguments.length,e={},k=arguments[d-1],f=null,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                g=[],o=!1,i=0;i<d-1;i++)f=arguments[i],v.propParse(f.prototype,{method:function(a,c){e["abstract "+a]=c.definition;o=!0}}),g.push(f);if(o)e.___$$abstract$$=!0;d=b.exports.extend(k,e);z.getMeta(d).implemented=g;return d}})(j["class"]={},".");(function(b){function c(a){if("object"===typeof a)a.___$$abstract$$=!0}function a(b){var e=b.extend,f=b.implement,h=b.use;f&&(b.implement=function(){return a(f.apply(this,arguments))});h&&(b.use=function(){return a(h.apply(this,arguments))});b.extend=function(){c(arguments[arguments.length-
        1]);return e.apply(this,arguments)};b.__createBase=function(){return e({___$$auto$abstract$$:!0})};return b}var f=b.exports={};n=".";var e=h("./class");b.exports=f=function(){c(arguments[arguments.length-1]);var b=e.apply(this,arguments);e.isClass(b)||a(b);return b};f.extend=function(){c(arguments[arguments.length-1]);return e.extend.apply(this,arguments)};f.use=function(){return a(e.use.apply(this,arguments))};f.implement=function(){return a(e.implement.apply(this,arguments))}})(j.class_abstract=
    {},".");(function(b){function c(){}function a(a){if(1<arguments.length)throw Error("Expecting one argument for Interface definition; "+arguments.length+" given.");return l(a)}function f(a,b){if(2<arguments.length)throw Error("Expecting two arguments for definition of named Interface '"+a+"'; "+arguments.length+" given.");if("object"!==typeof b)throw TypeError("Unexpected value for definition of named Interface '"+a+"'; object expected");b.__name=a;return l(b)}function e(a,b){b.message="Failed to define interface "+
        (a?a:"(anonymous)")+": "+b.message;throw b;}function d(a){p.defineSecureProp(a,"extend",function(a){return l(this,a)})}function g(a,b){a.toString=b?function(){return"[object Interface <"+b+">]"}:function(){return"[object Interface]"}}function i(a){p.defineSecureProp(a,"isCompatible",function(b){return 0===j(a,b).length})}function j(a,b){var c=[];p.propParse(a.prototype,{method:function(a,d){"function"!==typeof b[a]?c.push([a,"missing"]):b[a].length<d.__length&&c.push([a,"incompatible"])}});return c}
        function r(a){p.defineSecureProp(a,"__isInstanceOf",function(a,b){return y(a,b)})}function y(a,b){var c=b.constructor,d;if(!b.__cid||!(d=m.getMeta(c)))return 0===j(a,b).length;c=d.implemented;for(d=c.length;d--;)if(c[d]===a)return!0;return!1}b.exports={};n=".";var p=h("./util"),v=h("./MethodWrapperFactory"),z=h("./MethodWrappers").standard,A=h("./MemberBuilder")(v(z.wrapNew),v(z.wrapOverride),v(z.wrapProxy),h("./MemberBuilderValidator")());h("./class");var m=h("./ClassBuilder");b.exports=function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              c){var d=null;switch(typeof b){case "object":d=a.apply(null,arguments);break;case "string":d=f.apply(null,arguments);break;default:throw TypeError("Expecting anonymous interface definition or named interface definition");}return d};b.exports.extend=function(){return l.apply(this,arguments)};b.exports.isInterface=function(a){a=a||{};return a.prototype instanceof c?!0:!1};var l=function(a){function b(c){return function(){if(!a)throw Error("Interface "+(c?c+" ":"")+" cannot be instantiated");}}return function(){a=
            !0;var f=arguments,k=f.length,o=(0<k?f[k-1]:0)||{},f=new ((1<k?f[k-2]:0)||c),h="",j={},w=A.initMembers(f,f,f);(h=o.__name)&&delete o.__name;if(!(f instanceof c))throw new TypeError("Interfaces may only extend other interfaces");k=b(h);p.propParse(o,{assumeAbstract:!0,_throw:function(a){e(h,a)},property:function(){e(h,TypeError("Unexpected internal error"))},getset:function(){e(h,TypeError("Unexpected internal error"))},method:function(a,b,c,d){(d["protected"]||d["private"])&&e(h,TypeError("Member "+
            a+" must be public"));A.buildMethod(w,null,a,b,d,null,0,{},j)}});d(k);g(k,h);i(k);r(k);k.prototype=f;k.constructor=k;p.freeze(k);a=!1;return k}}(!1);b.exports.isInstanceOf=y})(j["interface"]={},".");(function(b){function c(){}function a(){switch(arguments.length){case 0:throw Error("Missing trait name or definition");case 1:return"string"===typeof arguments[0]?e.apply(this,arguments):a.extend.apply(this,arguments);case 2:return f.apply(this,arguments)}throw Error("Expecting at most two arguments for definition of named Trait "+
        name+"'; "+arguments.length+" given");}function f(b,c){if("string"!==typeof b)throw Error("First argument of named class definition must be a string");c.__name=b;return a.extend(c)}function e(a){return{extend:function(b){return f(a,b)},implement:function(){return j(arguments,a)}}}function d(a,b,c,d){if("__construct"===a)throw Error("Traits may not define __construct");if(c["static"])throw Error("Cannot define member `"+a+"'; static trait members are currently unsupported");d.apply(this,arguments)}
        function g(a,b,c,d){if("___"!==a.substr(0,3)){if(!c["private"])throw Error("Cannot define property `"+a+"'; only private properties are permitted within Trait definitions");d.apply(this,arguments)}}function i(a){throw Error("Cannot define property `"+a+"'; getters/setters are currently unsupported");}function j(b,c){return{extend:function(d){if(c)d.__name=c;return a.extend.call({__$$meta:{ifaces:b}},d)}}}function r(a){var b={"protected ___$$pmo$$":null,"protected ___$$super$$":null,__construct:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    b){this.___$$super$$=a;this.___$$pmo$$=b},__name:"#ConcreteTrait#"},c=q.getMeta(a).abstractMethods,d;for(d in c)Object.hasOwnProperty.call(c,d)&&"__"!==d.substr(0,2)&&(b[(void 0!==a.___$$methods$$["public"][d]?"public":"protected")+" proxy "+d]="___$$pmo$$");y(a,b);return a.extend(b)}function y(a,b){var c=q.getMeta(a).virtualMembers,d;for(d in c){var e=void 0!==a.___$$methods$$["public"][d]?"public":"protected",f=a.___$$methods$$[e][d],g=f.__length;b[e+" virtual override "+d]=function(a){var b=function(){var b=
            this.___$$pmo$$,c=b[a];return c?c.apply(b,arguments):this.__super.apply(this,arguments)};b.__length=g;return b}(d);b[e+" virtual __$$"+d]=function(a){var b=function(){return a.apply(this,arguments)};b.__length=g;return b}(f)}}function p(a,b,d,e){var f=a.__acls,a=A(a,b,d,e);b["weak virtual ___$$ctor$pre$$"]=c;b["weak virtual ___$$ctor$post$$"]=c;e===q.ClassBase?(b["virtual override ___$$ctor$post$$"]=l,b["virtual override ___$$ctor$pre$$"]=c):(b["virtual override ___$$ctor$post$$"]=c,b["virtual override ___$$ctor$pre$$"]=
            l);v(f,b,a);return b}function v(a,b,c){a=a.___$$methods$$;z(a["public"],b,"public",c);z(a["protected"],b,"protected",c);(a=a["public"].___$$parent$$)&&a.constructor!==q.ClassBase&&v(a.constructor,b,c)}function z(a,b,c,d){for(var e in a)if(Object.hasOwnProperty.call(a,e)&&"__mixin"!==e&&a[e].___$$keywords$$){var f=a[e].___$$keywords$$,c=f["protected"]?"protected":"public";if(f["abstract"]&&!f.override)b[c+" weak abstract "+e]=a[e].definition;else{var g=f.virtual,c=(g?"":"proxy ")+(g?"virtual ":"")+
            (f.override?"override ":"")+c+" "+e;if(void 0!==b[c])throw Error("Trait member conflict: `"+e+"'");b[c]=f.virtual?function(b){var c=function(){var a=this[d],c=a["__$$"+b].apply(a,arguments);return c===a?this:c};c.__length=a[b].__length;return c}(e):d}}}function A(a,b,c,d){var e="___$to$"+a.__acls.__cid+"$"+d.__cid;c.push([e,a]);b["private "+e]=null;void 0===b.___$$tctor$$&&(b["weak virtual ___$$tctor$$"]=function(){},b["virtual override ___$$tctor$$"]=m(c,d));return e}function m(a,b){return function(c){for(var d in a){var e=
            a[d][0],f=a[d][1],g=f.__ccls||(f.__ccls=r(f.__acls));this[e]=g(b,this[c].vis)[c].vis;this[e].__mixin&&this[e].__mixin.apply(this[e],f.___$$mixinargs)}this.__super&&this.__super(c)}}function l(){this.___$$tctor$$.apply(this,arguments)}b.exports={};n=".";var x=h("./class_abstract"),q=h("./ClassBuilder"),s=h("./interface");a.extend=function(a){var b=(this||{}).__$$meta||{},c=a.__name||"(Trait)",e="function"===typeof a.__mixin?"param":"std";a.___$$parser$$={each:d,property:g,getset:i};a.___$$auto$abstract$$=
            !0;a.__name="#AbstractTrait#";var f="param"===e?function(){for(var a=[],b=arguments.length;b--;)a[b]=arguments[b];var c=function(){throw Error("Cannot re-configure argument trait");};c.___$$mixinargs=a;c.__trait="arg";c.__acls=f.__acls;c.__ccls=f.__ccls;c.toString=f.toString;c.__mixinImpl=f.__mixinImpl;c.__isInstanceOf=f.__isInstanceOf;c.__mixin=function(a,b,d){p(c,a,b,d)};return c}:function(){throw Error("Cannot instantiate non-parameterized trait");},h=x;b.ifaces&&(h=h.implement.apply(null,b.ifaces));
            var j=h.extend(a);f.__trait=e;f.__acls=j;f.__ccls=null;f.toString=function(){return""+c};f.___$$mixinargs=[];f.__mixin=function(a,b,c){p(f,a,b,c)};f.__mixinImpl=function(a){for(var b=q.getMeta(j).implemented||[],c=b.length;c--;)a.push(b[c])};f.__isInstanceOf=s.isInstanceOf;return f};a.implement=function(){return j(arguments)};a.isTrait=function(a){return!!(a||{}).__trait};a.isParameterTrait=function(a){return"param"===(a||{}).__trait};a.isArgumentTrait=function(a){return"arg"===(a||{}).__trait};b.exports=
            a})(j.Trait={},".");(function(b){function c(a){if("object"===typeof a)a.___$$final$$=!0}function a(a){var b=a.extend;a.extend=function(){c(arguments[arguments.length-1]);return b.apply(this,arguments)}}var f=b.exports={};n=".";var e=h("./class"),f=b.exports=function(){c(arguments[arguments.length-1]);var b=e.apply(this,arguments);e.isClass(b)||a(b);return b};f.extend=function(){c(arguments[arguments.length-1]);return e.extend.apply(this,arguments)}})(j.class_final={},".");(function(b){var c=b.exports=
    {};n=".";var a=h("./MemberBuilder");b.exports=c=function(a,c){if(!(this instanceof b.exports))return new b.exports(a,c);b.exports.prototype.constructor.call(this,a,c)};b.exports.prototype=new a;b.exports.constructor=b.exports;c.prototype.buildGetterSetter=function(){throw Error("Getters/setters are unsupported in this environment");}})(j.FallbackMemberBuilder={},".");(function(b){function c(){if(!(this instanceof c))return new c;this._alt={}}b.exports={};n="util";(0,eval)("var _the_global=this");
        c.expose=function(){return _the_global};c.prototype={provideAlt:function(a,b){if(!(void 0!==_the_global[a]||void 0!==this._alt[a]))return this._alt[a]=b(),this},get:function(a){return void 0!==this._alt[a]?this._alt[a]:_the_global[a]}};b.exports=c})(j["util/Global"]={},".");(function(b){b.exports={};n="util";var c=h("./symbol/FallbackSymbol"),a=h("./Global").expose();b.exports=a.Symbol||c})(j["util/Symbol"]={},".");(function(b){function c(){if(!(this instanceof c))return new c;this.___$$id$$=e+f(1E8*
        a())}b.exports={};n="util/symbol";var a=Math.random,f=Math.floor,e=" "+String.fromCharCode(f(10*a())%31+1)+"$";c.prototype={toString:function(){return this.___$$id$$}};b.exports=c})(j["util/symbol/FallbackSymbol"]={},".");(function(b){b.exports={};n=".";var c=[0,2,4,""];c.major=0;c.minor=2;c.rev=4;c.suffix="";c.toString=function(){return this.join(".").replace(/\.([^.]*)$/,"-$1").replace(/-$/,"")};b.exports=c})(j.version={},".");(function(b){function c(){if(!(this instanceof c))return new c}b.exports=
    {};n="warn";c.prototype={handle:function(){}};b.exports=c})(j["warn/DismissiveHandler"]={},".");(function(b){function c(a){if(!(this instanceof c))return new c(a);this._console=a||{}}b.exports={};n="warn";c.prototype={handle:function(a){var b=this._console.warn||this._console.log;b&&b.call(this._console,"Warning: "+a.message)}};b.exports=c})(j["warn/LogHandler"]={},".");(function(b){function c(){if(!(this instanceof c))return new c}b.exports={};n="warn";c.prototype={handle:function(a){throw a.getError();
    }};b.exports=c})(j["warn/ThrowHandler"]={},".");(function(b){function c(a){if(!(this instanceof c))return new c(a);if(!(a instanceof Error))throw TypeError("Must provide exception to wrap");Error.prototype.constructor.call(this,a.message);this.message=a.message;this.name="Warning";this._error=a;this.stack=a.stack&&a.stack.replace(/^.*?\n+/,this.name+": "+this.message+"\n")}b.exports={};n="warn";c.prototype=Error();c.prototype.constructor=c;c.prototype.name="Warning";c.prototype.getError=function(){return this._error};
        b.exports=c})(j["warn/Warning"]={},".");B.Class=j["class"].exports;B.AbstractClass=j.class_abstract.exports;B.FinalClass=j.class_final.exports;B.Interface=j["interface"].exports;B.Trait=j.Trait.exports;B.version=j.version.exports})(easejs,".");

module.exports = easejs;
},{}],25:[function(require,module,exports){
var GeneJS = {
    Class: require('./easejs.js').Class
};

module.exports = GeneJS;
},{"./easejs.js":24}],26:[function(require,module,exports){
exports.puremvc = require("./lib/puremvc-1.0.1-mod.js");
exports.puremvc.statemachine = require("./lib/puremvc-statemachine-1.0-mod.js");
},{"./lib/puremvc-1.0.1-mod.js":27,"./lib/puremvc-statemachine-1.0-mod.js":28}],27:[function(require,module,exports){
/**
 * @fileOverview
 * PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * Reuse governed by Creative Commons Attribution 3.0 
 * http://creativecommons.org/licenses/by/3.0/us/
 * @author david.foley@puremvc.org 
 */


 	/* implementation begin */
	
	
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Observer
 * 
 * A base Observer implementation.
 * 
 * An Observer is an object that encapsulates information
 * about an interested object with a method that should 
 * be called when a particular Notification is broadcast. 
 * 
 * In PureMVC, the Observer class assumes these responsibilities:
 * 
 * - Encapsulate the notification (callback) method of the interested object.
 * - Encapsulate the notification context (this) of the interested object.
 * - Provide methods for setting the notification method and context.
 * - Provide a method for notifying the interested object.
 * 
 * 
 * The notification method on the interested object should take 
 * one parameter of type Notification.
 * 
 * 
 * @param {Function} notifyMethod 
 *  the notification method of the interested object
 * @param {Object} notifyContext 
 *  the notification context of the interested object
 * @constructor
 */
function Observer (notifyMethod, notifyContext)
{
    this.setNotifyMethod(notifyMethod);
    this.setNotifyContext(notifyContext);
};

/**
 * Set the Observers notification method.
 * 
 * The notification method should take one parameter of type Notification
 * @param {Function} notifyMethod
 *  the notification (callback) method of the interested object.
 * @return {void}
 */
Observer.prototype.setNotifyMethod= function (notifyMethod)
{
    this.notify= notifyMethod;
};

/**
 * Set the Observers notification context.
 * 
 * @param {Object} notifyContext
 *  the notification context (this) of the interested object.
 * 
 * @return {void}
 */
Observer.prototype.setNotifyContext= function (notifyContext)
{
    this.context= notifyContext;
};

/**
 * Get the Function that this Observer will invoke when it is notified.
 * 
 * @private
 * @return {Function}
 */
Observer.prototype.getNotifyMethod= function ()
{
    return this.notify;
};

/**
 * Get the Object that will serve as the Observers callback execution context
 * 
 * @private
 * @return {Object}
 */
Observer.prototype.getNotifyContext= function ()
{
    return this.context;
};

/**
 * Notify the interested object.
 * 
 * @param {puremvc.Notification} notification
 *  The Notification to pass to the interested objects notification method
 * @return {void}
 */
Observer.prototype.notifyObserver= function (notification)
{
    this.getNotifyMethod().call(this.getNotifyContext(), notification);
};

/**
 * Compare an object to this Observers notification context.
 * 
 * @param {Object} object
 *  
 * @return {boolean}
 */
Observer.prototype.compareNotifyContext= function (object)
{
    return object === this.context;
};

/**
 * The Observers callback Function
 * 
 * @private
 * @type {Function}
 */
Observer.prototype.notify= null;

/**
 * The Observers callback Object
 * @private
 * @type {Object}
 */
Observer.prototype.context= null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Notification
 * 
 * A base Notification implementation.
 * 
 * PureMVC does not rely upon underlying event models such as the one provided 
 * with the DOM or other browser centric W3C event models.
 * 
 * The Observer Pattern as implemented within PureMVC exists to support 
 * event-driven communication between the application and the actors of the MVC 
 * triad.
 * 
 * Notifications are not meant to be a replacement for events in the browser. 
 * Generally, Mediator implementors place event listeners on their view 
 * components, which they then handle in the usual way. This may lead to the 
 * broadcast of Notifications to trigger commands or to communicate with other 
 * Mediators. {@link puremvc.Proxy Proxy},
 * {@link puremvc.SimpleCommand SimpleCommand}
 * and {@link puremvc.MacroCommand MacroCommand}
 * instances communicate with each other and 
 * {@link puremvc.Mediator Mediator}s
 * by broadcasting Notifications.
 * 
 * A key difference between browser events and PureMVC Notifications is that
 * events follow the 'Chain of Responsibility' pattern, 'bubbling' up the 
 * display hierarchy until some parent component handles the event, while 
 * PureMVC Notification follow a 'Publish/Subscribe' pattern. PureMVC classes 
 * need not be related to each other in a parent/child relationship in order to 
 * communicate with one another using Notifications.
 * 
 * @constructor 
 * @param {string} name
 *  The Notification name
 * @param {Object} [body]
 *  The Notification body
 * @param {Object} [type]
 *  The Notification type
 */
function Notification(name, body, type)
{
    this.name= name;
    this.body= body;
    this.type= type;
};

/**
 * Get the name of the Notification instance
 *
 * @return {string}
 *  The name of the Notification instance
 */
Notification.prototype.getName= function()
{
    return this.name;
};

/**
 * Set this Notifications body. 
 * @param {Object} body
 * @return {void}
 */
Notification.prototype.setBody= function(body)
{
    this.body= body;
};

/**
 * Get the Notification body.
 *
 * @return {Object}
 */
Notification.prototype.getBody= function()
{
    return this.body
};

/**
 * Set the type of the Notification instance.
 *
 * @param {Object} type
 * @return {void}
 */
Notification.prototype.setType= function(type)
{
    this.type= type;
};

/**
 * Get the type of the Notification instance.
 * 
 * @return {Object}
 */
Notification.prototype.getType= function()
{
    return this.type;
};

/**
 * Get a string representation of the Notification instance
 *
 * @return {string}
 */
Notification.prototype.toString= function()
{
    var msg= "Notification Name: " + this.getName();
    msg+= "\nBody:" + ((this.body == null ) ? "null" : this.body.toString());
    msg+= "\nType:" + ((this.type == null ) ? "null" : this.type);
    return msg;
};

/**
 * The Notifications name.
 *
 * @type {string}
 * @private
 */
Notification.prototype.name= null;

/**
 * The Notifications type.
 *
 * @type {string}
 * @private
 */
Notification.prototype.type= null;

/**
 * The Notifications body.
 *
 * @type {Object}
 * @private
 */
Notification.prototype.body= null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Notifier
 * 
 * A Base Notifier implementation.
 * 
 * {@link puremvc.MacroCommand MacroCommand}, 
 * {@link puremvc.SimpleCommand SimpleCommand}, 
 * {@link puremvc.Mediator Mediator} and 
 * {@link puremvc.Proxy Proxy}
 * all have a need to send Notifications
 * 
 * The Notifier interface provides a common method called #sendNotification that 
 * relieves implementation code of the necessity to actually construct 
 * Notifications.
 * 
 * The Notifier class, which all of the above mentioned classes
 * extend, provides an initialized reference to the 
 * {@link puremvc.Facade Facade}
 * Multiton, which is required for the convienience method
 * for sending Notifications but also eases implementation as these
 * classes have frequent 
 * {@link puremvc.Facade Facade} interactions 
 * and usually require access to the facade anyway.
 * 
 * NOTE: In the MultiCore version of the framework, there is one caveat to
 * notifiers, they cannot send notifications or reach the facade until they
 * have a valid multitonKey. 
 * 
 * The multitonKey is set:
 *   - on a Command when it is executed by the Controller
 *   - on a Mediator is registered with the View
 *   - on a Proxy is registered with the Model. 
 * 
 * @constructor
 */
function Notifier()
{
};

/**
 * Create and send a Notification.
 *
 * Keeps us from having to construct new Notification instances in our 
 * implementation code.
 * 
 * @param {string} notificationName
 *  A notification name
 * @param {Object} [body]
 *  The body of the notification
 * @param {string} [type]
 *  The notification type
 * @return {void}
 */
Notifier.prototype.sendNotification = function(notificationName, body, type)
{
    var facade = this.getFacade();
    if(facade)
    {
        facade.sendNotification(notificationName, body, type);
    }
};


/**
 * @protected
 * A reference to this Notifier's Facade. This reference will not be available
 * until #initializeNotifier has been called. 
 * 
 * @type {puremvc.Facade}
 */
Notifier.prototype.facade;

/**
 * Initialize this Notifier instance.
 * 
 * This is how a Notifier gets its multitonKey. 
 * Calls to #sendNotification or to access the
 * facade will fail until after this method 
 * has been called.
 * 
 * Mediators, Commands or Proxies may override 
 * this method in order to send notifications
 * or access the Multiton Facade instance as
 * soon as possible. They CANNOT access the facade
 * in their constructors, since this method will not
 * yet have been called.
 * 
 *
 * @param {string} key
 *  The Notifiers multiton key;
 * @return {void}
 */
Notifier.prototype.initializeNotifier = function(key)
{
    this.multitonKey = String(key);
    this.facade= this.getFacade();
};

/**
 * Retrieve the Multiton Facade instance
 *
 *
 * @protected
 * @return {puremvc.Facade}
 */
Notifier.prototype.getFacade = function()
{
    if(this.multitonKey == null)
    {
        throw new Error(Notifier.MULTITON_MSG);
    };

    return Facade.getInstance(this.multitonKey);
};

/**
 * @ignore
 * The Notifiers internal multiton key.
 *
 * @protected
 * @type string
 */
Notifier.prototype.multitonKey = null;

/**
 * @ignore
 * The error message used if the Notifier is not initialized correctly and
 * attempts to retrieve its own multiton key
 *
 * @static
 * @protected
 * @const
 * @type string
 */
Notifier.MULTITON_MSG = "multitonKey for this Notifier not yet initialized!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.SimpleCommand
 * @extends puremvc.Notifier
 *
 * SimpleCommands encapsulate the business logic of your application. Your 
 * subclass should override the #execute method where your business logic will
 * handle the 
 * {@link puremvc.Notification Notification}
 * 
 * Take a look at 
 * {@link puremvc.Facade#registerCommand Facade's registerCommand}
 * or {@link puremvc.Controller#registerCommand Controllers registerCommand}
 * methods to see how to add commands to your application.
 * 
 * @constructor
 */
function SimpleCommand () { };

SimpleCommand.prototype= new Notifier;
SimpleCommand.prototype.constructor= SimpleCommand;

/**
 * Fulfill the use-case initiated by the given Notification
 * 
 * In the Command Pattern, an application use-case typically begins with some
 * user action, which results in a Notification is handled by the business logic
 * in the #execute method of a command.
 * 
 * @param {puremvc.Notification} notification
 *  The notification to handle.
 * @return {void}
 */
SimpleCommand.prototype.execute= function (notification) { };
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.MacroCommand
 * @extends puremvc.Notifier
 * 
 * A base command implementation that executes other commands, such as
 * {@link puremvc.SimpleCommand SimpleCommand}
 * or {@link puremvc.MacroCommand MacroCommand}
 * subclasses.
 *  
 * A MacroCommand maintains an list of
 * command constructor references called *SubCommands*.
 * 
 * When #execute is called, the MacroCommand
 * instantiates and calls #execute on each of its *SubCommands* in turn.
 * Each *SubCommand* will be passed a reference to the original
 * {@link puremvc.Notification Notification} 
 * that was passed to the MacroCommands #execute method
 * 
 * Unlike {@link puremvc.SimpleCommand SimpleCommand}, 
 * your subclass should not override #execute but instead, should 
 * override the #initializeMacroCommand method, calling #addSubCommand once for 
 * each *SubCommand* to be executed.
 * 
 * If your subclass does define a constructor, be sure to call "super" like so
 * 
 *     function MyMacroCommand ()
 *     {
 *         MacroCommand.call(this);
 *     };
 * @constructor
 */
function MacroCommand()
{
    this.subCommands= [];
    this.initializeMacroCommand();
};

/* subclass Notifier */
MacroCommand.prototype= new Notifier;
MacroCommand.prototype.constructor= MacroCommand;

/**
 * @private
 * @type {Array.<puremvc.SimpleCommand|puremvc.MacroCommand>}
 */
MacroCommand.prototype.subCommands= null;

/**
 * @protected
 * Initialize the MacroCommand.
 * 
 * In your subclass, override this method to 
 * initialize the MacroCommand's *SubCommand*  
 * list with command class references like 
 * this:
 * 
 *     // Initialize MyMacroCommand
 *     MyMacroCommand.prototype.initializeMacroCommand= function ()
 *     {
 *         this.addSubCommand( com.me.myapp.controller.FirstCommand );
 *         this.addSubCommand( com.me.myapp.controller.SecondCommand );
 *         this.addSubCommand( com.me.myapp.controller.ThirdCommand );
 *     };
 * 
 * Note that *SubCommand*s may be any command implementor,
 * MacroCommands or SimpleCommands are both acceptable.
 * @return {void}
 */
MacroCommand.prototype.initializeMacroCommand= function() {}

/**
 * @protected
 * Add a *SubCommand*
 * 
 * The *SubCommand*s will be called in First In / First Out (FIFO) order
 * @param {Function} commandClassRef
 *  A reference to a subclassed SimpleCommand or MacroCommand constructor
 */
MacroCommand.prototype.addSubCommand= function(commandClassRef)
{
    this.subCommands.push(commandClassRef);
};

/**
 * Execute this MacroCommands *SubCommands*
 * 
 * The *SubCommand*s will be called in First In / First Out (FIFO) order
 * @param {puremvc.Notification} note
 *  The Notification object to be passed to each *SubCommand*
 */
MacroCommand.prototype.execute= function(note)
{
    // SIC- TODO optimize
    while(this.subCommands.length > 0)
    {
        var ref= this.subCommands.shift();
        var cmd= new ref;
        cmd.initializeNotifier(this.multitonKey);
        cmd.execute(note);
    }
};
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Mediator
 * @extends puremvc.Notifier
 * 
 * A base Mediator implementation.
 *
 * In PureMVC, Mediator classes are used to mediate communication between a view 
 * component and the rest of the application.
 *
 * A Mediator should listen to its view components for events, and handle them 
 * by sending notifications (to be handled by other Mediators, 
 * {@link puremvc.SimpleCommand SimpleCommands} 
 * or
 * {@link puremvc.MacroCommand MacroCommands}) 
 * or passing data from the view component directly to a 
 * {@link puremvc.Proxy Proxy}, such as submitting 
 * the contents of a form to a service.
 * 
 * Mediators should not perform business logic, maintain state or other 
 * information for its view component, or break the encapsulation of the view 
 * component by manipulating the view component's children. It should only call 
 * methods or set properties on the view component.
 *  
 * The view component should encapsulate its own behavior and implementation by 
 * exposing methods and properties that the Mediator can call without having to 
 * know about the view component's children.
 * 
 * @constructor
 * @param {string} [mediatorName]
 *  The Mediators name. The Mediators static #NAME value is used by default
 * @param {Object} [viewComponent]
 *  The Mediators {@link #setViewComponent viewComponent}.
 */
function Mediator (mediatorName, viewComponent)
{
    this.mediatorName= mediatorName || this.constructor.NAME;
    this.viewComponent=viewComponent;  
};

/**
 * @static
 * The name of the Mediator.
 * 
 * Typically, a Mediator will be written to serve one specific control or group
 * of controls and so, will not have a need to be dynamically named.
 * 
 * @type {string}
 */
Mediator.NAME= "Mediator";

/* subclass */
Mediator.prototype= new Notifier;
Mediator.prototype.constructor= Mediator;

/**
 * Get the name of the Mediator
 * 
 * @return {string}
 *  The Mediator name
 */
Mediator.prototype.getMediatorName= function ()
{
    return this.mediatorName;
};

/**
 * Set the Mediators view component. This could
 * be a HTMLElement, a bespoke UiComponent wrapper
 * class, a MooTools Element, a jQuery result or a
 * css selector, depending on which DOM abstraction 
 * library you are using.
 * 
 * 
 * @param {Object} the view component
 * @return {void}
 */
Mediator.prototype.setViewComponent= function (viewComponent)
{
    this.viewComponent= viewComponent;
};

/**
 * Get the Mediators view component.
 * 
 * Additionally, an optional explicit getter can be
 * be defined in the subclass that defines the 
 * view components, providing a more semantic interface
 * to the Mediator.
 * 
 * This is different from the AS3 implementation in
 * the sense that no casting is required from the
 * object supplied as the view component.
 * 
 *     MyMediator.prototype.getComboBox= function ()
 *     {
 *         return this.viewComponent;  
 *     }
 * 
 * @return {Object}
 *  The view component
 */
Mediator.prototype.getViewComponent= function ()
{
    return this.viewComponent;
};

/**
 * List the Notification names this Mediator is interested
 * in being notified of.
 * 
 * @return {Array} 
 *  The list of Notification names.
 */
Mediator.prototype.listNotificationInterests= function ()
{
    return [];
};

/**
 * Handle Notifications.
 * 
 * Typically this will be handled in a switch statement
 * with one 'case' entry per Notification the Mediator
 * is interested in
 * 
 * @param {puremvc.Notification} notification
 * @return {void}
 */
Mediator.prototype.handleNotification= function (notification)
{
    return;
};

/**
 * Called by the View when the Mediator is registered
 * @return {void}
 */
Mediator.prototype.onRegister= function ()
{
    return;
};

/**
 * Called by the View when the Mediator is removed
 */
Mediator.prototype.onRemove= function ()
{
    return;
};

/**
 * @ignore
 * The Mediators name. Should only be accessed by Mediator subclasses.
 * 
 * @protected
 * @type string
 */
Mediator.prototype.mediatorName= null;

/**
 * @ignore
 * The Mediators viewComponent. Should only be accessed by Mediator subclasses.
 * 
 * @protected
 * @type Object
 */
Mediator.prototype.viewComponent=null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Proxy
 * @extends puremvc.Notifier
 *
 * A base Proxy implementation. 
 * 
 * In PureMVC, Proxy classes are used to manage parts of the application's data 
 * model.
 * 
 * A Proxy might simply manage a reference to a local data object, in which case 
 * interacting with it might involve setting and getting of its data in 
 * synchronous fashion.
 * 
 * Proxy classes are also used to encapsulate the application's interaction with 
 * remote services to save or retrieve data, in which case, we adopt an 
 * asyncronous idiom; setting data (or calling a method) on the Proxy and 
 * listening for a 
 * {@link puremvc.Notification Notification} 
 * to be sent  when the Proxy has retrieved the data from the service. 
 * 
 * 
 * @param {string} [proxyName]
 *  The Proxy's name. If none is provided, the Proxy will use its constructors
 *  NAME property.
 * @param {Object} [data]
 *  The Proxy's data object
 * @constructor
 */
function Proxy(proxyName, data)
{
    this.proxyName= proxyName || this.constructor.NAME;
    if(data != null)
    {
        this.setData(data);
    }
};


Proxy.NAME= "Proxy";

Proxy.prototype= new Notifier;
Proxy.prototype.constructor= Proxy;

/**
 * Get the Proxy's name.
 *
 * @return {string}
 */
Proxy.prototype.getProxyName= function()
{
    return this.proxyName;
};

/**
 * Set the Proxy's data object
 *
 * @param {Object} data
 * @return {void}
 */
Proxy.prototype.setData= function(data)
{
    this.data= data;
};

/**
 * Get the Proxy's data object
 *
 * @return {Object}
 */
Proxy.prototype.getData= function()
{
    return this.data;
};

/**
 * Called by the {@link puremvc.Model Model} when
 * the Proxy is registered.
 *
 * @return {void}
 */
Proxy.prototype.onRegister= function()
{
    return;
};

/**
 * Called by the {@link puremvc.Model Model} when
 * the Proxy is removed.
 * 
 * @return {void}
 */
Proxy.prototype.onRemove= function()
{
    return;
};

/**
 * @ignore
 * The Proxys name.
 *
 * @protected
 * @type String
 */
Proxy.prototype.proxyName= null;

/**
 * @ignore
 * The Proxy's data object.
 *
 * @protected
 * @type Object
 */
Proxy.prototype.data= null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Facade
 * Facade exposes the functionality of the Controller, Model and View
 * actors to client facing code. 
 * 
 * This Facade implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the static Factory method, 
 * passing the unique key for this instance to #getInstance
 *
 * @constructor
 * @param {string} key
 * 	The multiton key to use to retrieve the Facade instance.
 * @throws {Error} 
 *  If an attempt is made to instantiate Facade directly
 */
function Facade(key)
{
    if(Facade.instanceMap[key] != null)
    {
        throw new Error(Facade.MULTITON_MSG);
    }

    this.initializeNotifier(key);
    Facade.instanceMap[key] = this;
    this.initializeFacade();
};

/**
 * Initialize the Multiton Facade instance.
 * 
 * Called automatically by the constructor. Override in your subclass to any
 * subclass specific initializations. Be sure to call the 'super' 
 * initializeFacade method, though
 * 
 *     MyFacade.prototype.initializeFacade= function ()
 *     {
 *         Facade.call(this);
 *     };
 * @protected
 * @return {void}
 */
Facade.prototype.initializeFacade = function()
{
    this.initializeModel();
    this.initializeController();
    this.initializeView();
};

/**
 * Facade Multiton Factory method. 
 * Note that this method will return null if supplied a
 * null or undefined multiton key.
 * 
 * @param {string} key
 * 	The multiton key use to retrieve a particular Facade instance
 * @return {puremvc.Facade}
 */
Facade.getInstance = function(key)
{
	if (null == key)
		return null;
		
    if(Facade.instanceMap[key] == null)
    {
        Facade.instanceMap[key] = new Facade(key);
    }

    return Facade.instanceMap[key];
};

/**
 * Initialize the {@link puremvc.Controller Controller}.
 * 
 * Called by the #initializeFacade method.
 * 
 * Override this method in your subclass of Facade
 * if one or both of the following are true:

 * - You wish to initialize a different Controller
 * - You have 
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or {@link puremvc.MacroCommand MacroCommand}s
 * to register with the Controllerat startup.   
 * 
 * If you don't want to initialize a different Controller, 
 * call the 'super' initializeControlle method at the beginning of your
 * method, then register commands.
 * 
 *     MyFacade.prototype.initializeController= function ()
 *     {
 *         Facade.prototype.initializeController.call(this);
 *         this.registerCommand(AppConstants.A_NOTE_NAME, ABespokeCommand)
 *     }
 * 
 * @protected
 * @return {void}
 */
Facade.prototype.initializeController = function()
{
    if(this.controller != null)
        return;

    this.controller = Controller.getInstance(this.multitonKey);
};

/**
 * @protected
 * Initialize the {@link puremvc.Model Model};
 * 
 * Called by the #initializeFacade method.
 * Override this method in your subclass of Facade if one of the following are
 * true:
 * 
 * - You wish to initialize a different Model.
 * 
 * - You have {@link puremvc.Proxy Proxy}s to 
 *   register with the Model that do not retrieve a reference to the Facade at 
 *   construction time.
 * 
 * If you don't want to initialize a different Model
 * call 'super' #initializeModel at the beginning of your method, then register 
 * Proxys.
 * 
 * Note: This method is *rarely* overridden; in practice you are more
 * likely to use a command to create and registerProxys with the Model>, 
 * since Proxys with mutable data will likely
 * need to send Notifications and thus will likely want to fetch a reference to 
 * the Facade during their construction. 
 * 
 * @return {void}
 */
Facade.prototype.initializeModel = function()
{
    if(this.model != null)
        return;

    this.model = Model.getInstance(this.multitonKey);
};

/**
 * @protected
 * 
 * Initialize the {@link puremvc.View View}.
 * 
 * Called by the #initializeFacade method.
 * 
 * Override this method in your subclass of Facade if one or both of the 
 * following are true:
 *
 * - You wish to initialize a different View.
 * - You have Observers to register with the View
 * 
 * If you don't want to initialize a different View 
 * call 'super' #initializeView at the beginning of your
 * method, then register Mediator instances.
 * 
 *     MyFacade.prototype.initializeView= function ()
 *     {
 *         Facade.prototype.initializeView.call(this);
 *         this.registerMediator(new MyMediator());
 *     };
 * 
 * Note: This method is *rarely* overridden; in practice you are more
 * likely to use a command to create and register Mediators
 * with the View, since Mediator instances will need to send 
 * Notifications and thus will likely want to fetch a reference 
 * to the Facade during their construction. 
 * @return {void}
 */
Facade.prototype.initializeView = function()
{
    if(this.view != null)
        return;

    this.view = View.getInstance(this.multitonKey);
};

/**
 * Register a command with the Controller by Notification name
 * @param {string} notificationName
 *  The name of the Notification to associate the command with
 * @param {Function} commandClassRef
 *  A reference ot the commands constructor.
 * @return {void}
 */
Facade.prototype.registerCommand = function(notificationName, commandClassRef)
{
    this.controller.registerCommand(notificationName, commandClassRef);
};

/**
 * Remove a previously registered command to Notification mapping from the
 * {@link puremvc.Controller#removeCommand Controller}
 * @param {string} notificationName
 *  The name of the the Notification to remove from the command mapping for.
 * @return {void}
 */
Facade.prototype.removeCommand = function(notificationName)
{
    this.controller.removeCommand(notificationName);
};

/**
 * Check if a command is registered for a given notification.
 * 
 * @param {string} notificationName
 *  A Notification name
 * @return {boolean}
 *  Whether a comman is currently registered for the given notificationName
 */
Facade.prototype.hasCommand = function(notificationName)
{
    return this.controller.hasCommand(notificationName);
};

/**
 * Register a Proxy with the {@link puremvc.Model#registerProxy Model}
 * by name.
 * 
 * @param {puremvc.Proxy} proxy
 *  The Proxy instance to be registered with the Model.
 * @return {void}
 */
Facade.prototype.registerProxy = function(proxy)
{
    this.model.registerProxy(proxy);
};

/**
 * Retrieve a Proxy from the Model
 * 
 * @param {string} proxyName
 * @return {puremvc.Proxy}
 */
Facade.prototype.retrieveProxy = function(proxyName)
{
    return this.model.retrieveProxy(proxyName);
};

/**
 * Remove a Proxy from the Model by name
 * @param {string} proxyName
 *  The name of the Proxy
 * @return {puremvc.Proxy}
 *  The Proxy that was removed from the Model
 */
Facade.prototype.removeProxy = function(proxyName)
{
    var proxy = null;
    if(this.model != null)
    {
        proxy = this.model.removeProxy(proxyName);
    }

    return proxy;
};

/**
 * Check it a Proxy is registered.
 * @param {string} proxyName
 *  A Proxy name
 * @return {boolean}
 *  Whether a Proxy is currently registered with the given proxyName
 */
Facade.prototype.hasProxy = function(proxyName)
{
    return this.model.hasProxy(proxyName);
};

/**
 * Register a Mediator with with the View.
 * 
 * @param {puremvc.Mediator} mediator
 *  A reference to the Mediator to register
 * @return {void}
 */
Facade.prototype.registerMediator = function(mediator)
{
    if(this.view != null)
    {
        this.view.registerMediator(mediator);
    }
};

/**
 * Retrieve a Mediator from the View by name
 * 
 * @param {string} mediatorName
 *  The Mediators name
 * @return {puremvc.Mediator}
 *  The retrieved Mediator
 */
Facade.prototype.retrieveMediator = function(mediatorName)
{
    return this.view.retrieveMediator(mediatorName);
};

/**
 * Remove a Mediator from the View.
 * 
 * @param {string} mediatorName
 *  The name of the Mediator to remove.
 * @return {puremvc.Mediator}
 *  The removed Mediator
 */
Facade.prototype.removeMediator = function(mediatorName)
{
    var mediator = null;
    if(this.view != null)
    {
        mediator = this.view.removeMediator(mediatorName);
    }

    return mediator;
};

/**
 * Check if a Mediator is registered or not.
 * 
 * @param {string} mediatorName
 *  A Mediator name
 * @return {boolean}
 *  Whether a Mediator is registered with the given mediatorName
 */
Facade.prototype.hasMediator = function(mediatorName)
{
    return this.view.hasMediator(mediatorName);
};

/**
 * Create and send a 
 * {@link puremvc.Notification Notification}
 * 
 * Keeps us from having to construct new Notification instances in our
 * implementation
 * 
 * @param {string} notificationName
 *  The name of the Notification to send
 * @param {Object} [body]
 *  The body of the notification
 * @param {string} [type]
 *  The type of the notification
 * @return {void}
 */
Facade.prototype.sendNotification = function(notificationName, body, type)
{
    this.notifyObservers(new Notification(notificationName, body, type));
};

/**
 * Notify {@link puremvc.Observer Observer}s
 * 
 * This method is left public mostly for backward compatibility, and to allow
 * you to send custom notification classes using the facade.
 * 
 * Usually you should just call sendNotification and pass the parameters, never 
 * having to construct the notification yourself.
 * 
 * @param {puremvc.Notification} notification
 *  The Notification to send
 * @return {void}
 */
Facade.prototype.notifyObservers = function(notification)
{
    if(this.view != null)
    {
        this.view.notifyObservers(notification);
    }
};

/**
 * Initialize the Facades Notifier capabilities by setting the Multiton key for 
 * this facade instance.
 * 
 * Not called directly, but instead from the constructor when #getInstance is 
 * invoked. It is necessary to be public in order to implement Notifier
 * 
 * @param {string} key
 * @return {void}
 */
Facade.prototype.initializeNotifier = function(key)
{
    this.multitonKey = key;
};

/**
 * Check if a *Core* is registered or not
 *
 * @static
 * @param {string} key
 *  The multiton key for the *Core* in question
 * @return {boolean}
 *  Whether a *Core* is registered with the given key
 */
Facade.hasCore = function(key)
{
    return Facade.instanceMap[key] != null;
};

/**
 * Remove a *Core* 
 * 
 * Remove the Model, View, Controller and Facade for a given key.
 *
 * @static
 * @param {string} key
 * @return {void}
 */
Facade.removeCore = function(key)
{
    if(Facade.instanceMap[key] == null)
        return;

    Model.removeModel(key);
    View.removeView(key);
    Controller.removeController(key);
    delete Facade.instanceMap[key];
};

/**
 * @ignore
 * The Facades corresponding Controller
 *
 * @protected
 * @type puremvc.Controller
 */
Facade.prototype.controller = null;

/**
 * @ignore
 * The Facades corresponding Model instance
 *
 * @protected
 * @type puremvc.Model
 */
Facade.prototype.model = null;

/**
 * @ignore
 * The Facades correspnding View instance.
 *
 * @protected
 * @type puremvc.View
 */
Facade.prototype.view = null;

/**
 * @ignore
 * The Facades multiton key.
 *
 * @protected
 * @type string
 */
Facade.prototype.multitonKey = null;

/**
 * @ignore
 * The Multiton Facade instance map.
 * @static
 * @protected
 * @type Array
 */
Facade.instanceMap = [];

/**
 * @ignore
 * Message Constants
 * @protected
 * @type {string}
 * @const
 * @static
 */
Facade.MULTITON_MSG = "Facade instance for this Multiton key already constructed!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.View
 * 
 * A Multiton View implementation.
 * 
 * In PureMVC, the View class assumes these responsibilities
 * 
 * - Maintain a cache of {@link puremvc.Mediator Mediator}
 *   instances.
 * 
 * - Provide methods for registering, retrieving, and removing 
 *   {@link puremvc.Mediator Mediator}.
 * 
 * - Notifiying {@link puremvc.Mediator Mediator} when they are registered or 
 *   removed.
 * 
 * - Managing the observer lists for each {@link puremvc.Notification Notification}  
 *   in the application.
 * 
 * - Providing a method for attaching {@link puremvc.Observer Observer} to an 
 *   {@link puremvc.Notification Notification}'s observer list.
 * 
 * - Providing a method for broadcasting a {@link puremvc.Notification Notification}.
 * 
 * - Notifying the {@link puremvc.Observer Observer}s of a given 
 *   {@link puremvc.Notification Notification} when it broadcast.
 * 
 * This View implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the static Multiton 
 * Factory #getInstance method.
 * 
 * @param {string} key
 * @constructor
 * @throws {Error} 
 *  if instance for this Multiton key has already been constructed
 */
function View(key)
{
    if(View.instanceMap[key] != null)
    {
        throw new Error(View.MULTITON_MSG);
    };

    this.multitonKey = key;
    View.instanceMap[this.multitonKey] = this;
    this.mediatorMap = [];
    this.observerMap = [];
    this.initializeView();
};

/**
 * @protected
 * Initialize the Singleton View instance
 * 
 * Called automatically by the constructor, this is your opportunity to
 * initialize the Singleton instance in your subclass without overriding the
 * constructor
 * 
 * @return {void}
 */
View.prototype.initializeView = function()
{
    return;
};

/**
 * View Singleton Factory method.
 * Note that this method will return null if supplied a null 
 * or undefined multiton key.
 *  
 * @return {puremvc.View}
 *  The Singleton instance of View
 */
View.getInstance = function(key)
{
	if (null == key)
		return null;
		
    if(View.instanceMap[key] == null)
    {
        View.instanceMap[key] = new View(key);
    };

    return View.instanceMap[key];
};

/**
 * Register an Observer to be notified of Notifications with a given name
 * 
 * @param {string} notificationName
 *  The name of the Notifications to notify this Observer of
 * @param {puremvc.Observer} observer
 *  The Observer to register.
 * @return {void}
 */
View.prototype.registerObserver = function(notificationName, observer)
{
    if(this.observerMap[notificationName] != null)
    {
        this.observerMap[notificationName].push(observer);
    }
    else
    {
        this.observerMap[notificationName] = [observer];
    }
};

/**
 * Notify the Observersfor a particular Notification.
 * 
 * All previously attached Observers for this Notification's
 * list are notified and are passed a reference to the INotification in 
 * the order in which they were registered.
 * 
 * @param {puremvc.Notification} notification
 *  The Notification to notify Observers of
 * @return {void}
 */
View.prototype.notifyObservers = function(notification)
{
    // SIC
    if(this.observerMap[notification.getName()] != null)
    {
        var observers_ref = this.observerMap[notification.getName()], observers = [], observer

        for(var i = 0; i < observers_ref.length; i++)
        {
            observer = observers_ref[i];
            observers.push(observer);
        }

        for(var i = 0; i < observers.length; i++)
        {
            observer = observers[i];
            observer.notifyObserver(notification);
        }
    }
};

/**
 * Remove the Observer for a given notifyContext from an observer list for
 * a given Notification name
 * 
 * @param {string} notificationName
 *  Which observer list to remove from
 * @param {Object} notifyContext
 *  Remove the Observer with this object as its notifyContext
 * @return {void}
 */
View.prototype.removeObserver = function(notificationName, notifyContext)
{
    // SIC
    var observers = this.observerMap[notificationName];
    for(var i = 0; i < observers.length; i++)
    {
        if(observers[i].compareNotifyContext(notifyContext) == true)
        {
            observers.splice(i, 1);
            break;
        }
    }

    if(observers.length == 0)
    {
        delete this.observerMap[notificationName];
    }
};

/**
 * Register a Mediator instance with the View.
 * 
 * Registers the Mediator so that it can be retrieved by name,
 * and further interrogates the Mediator for its 
 * {@link puremvc.Mediator#listNotificationInterests interests}.
 *
 * If the Mediator returns any Notification
 * names to be notified about, an Observer is created encapsulating 
 * the Mediator instance's 
 * {@link puremvc.Mediator#handleNotification handleNotification}
 * method and registering it as an Observer for all Notifications the 
 * Mediator is interested in.
 * 
 * @param {puremvc.Mediator} 
 *  a reference to the Mediator instance
 */
View.prototype.registerMediator = function(mediator)
{
    if(this.mediatorMap[mediator.getMediatorName()] != null)
    {
        return;
    }

    mediator.initializeNotifier(this.multitonKey);
    // register the mediator for retrieval by name
    this.mediatorMap[mediator.getMediatorName()] = mediator;

    // get notification interests if any
    var interests = mediator.listNotificationInterests();

    // register mediator as an observer for each notification
    if(interests.length > 0)
    {
        // create observer referencing this mediators handleNotification method
        var observer = new Observer(mediator.handleNotification, mediator);
        for(var i = 0; i < interests.length; i++)
        {
            this.registerObserver(interests[i], observer);
        }
    }

    mediator.onRegister();
}

/**
 * Retrieve a Mediator from the View
 * 
 * @param {string} mediatorName
 *  The name of the Mediator instance to retrieve
 * @return {puremvc.Mediator}
 *  The Mediator instance previously registered with the given mediatorName
 */
View.prototype.retrieveMediator = function(mediatorName)
{
    return this.mediatorMap[mediatorName];
};

/**
 * Remove a Mediator from the View.
 * 
 * @param {string} mediatorName
 *  Name of the Mediator instance to be removed
 * @return {puremvc.Mediator}
 *  The Mediator that was removed from the View
 */
View.prototype.removeMediator = function(mediatorName)
{
    var mediator = this.mediatorMap[mediatorName];
    if(mediator)
    {
        // for every notification the mediator is interested in...
        var interests = mediator.listNotificationInterests();
        for(var i = 0; i < interests.length; i++)
        {
            // remove the observer linking the mediator to the notification
            // interest
            this.removeObserver(interests[i], mediator);
        }

        // remove the mediator from the map
        delete this.mediatorMap[mediatorName];

        // alert the mediator that it has been removed
        mediator.onRemove();
    }

    return mediator;
};

/**
 * Check if a Mediator is registered or not.
 * 
 * @param {string} mediatorName
 * @return {boolean}
 *  Whether a Mediator is registered with the given mediatorname
 */
View.prototype.hasMediator = function(mediatorName)
{
    return this.mediatorMap[mediatorName] != null;
};

/**
 * Remove a View instance
 * 
 * @return {void}
 */
View.removeView = function(key)
{
    delete View.instanceMap[key];
};

/**
 * @ignore
 * The Views internal mapping of mediator names to mediator instances
 *
 * @type Array
 * @protected
 */
View.prototype.mediatorMap = null;

/**
 * @ignore
 * The Views internal mapping of Notification names to Observer lists
 *
 * @type Array
 * @protected
 */
View.prototype.observerMap = null;

/**
 * @ignore
 * The internal map used to store multiton View instances
 *
 * @type Array
 * @protected
 */
View.instanceMap = [];

/**
 * @ignore
 * The Views internal multiton key.
 *
 * @type string
 * @protected
 */
View.prototype.multitonKey = null;

/**
 * @ignore
 * The error message used if an attempt is made to instantiate View directly
 *
 * @type string
 * @protected
 * @const
 * @static
 */
View.MULTITON_MSG = "View instance for this Multiton key already constructed!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Model
 *
 * A Multiton Model implementation.
 *
 * In PureMVC, the Model class provides
 * access to model objects (Proxies) by named lookup.
 *
 * The Model assumes these responsibilities:
 *
 * - Maintain a cache of {@link puremvc.Proxy Proxy}
 *   instances.
 * - Provide methods for registering, retrieving, and removing
 *   {@link puremvc.Proxy Proxy} instances.
 *
 * Your application must register 
 * {@link puremvc.Proxy Proxy} instances with the Model. 
 * Typically, you use a 
 * {@link puremvc.SimpleCommand SimpleCommand} 
 * or
 * {@link puremvc.MacroCommand MacroCommand} 
 * to create and register Proxy instances once the Facade has initialized the 
 * *Core* actors.
 *
 * This Model implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the 
 * {@link #getInstance static Multiton Factory method} 
 * @constructor
 * @param {string} key
 *  The Models multiton key
 * @throws {Error}
 *  An error is thrown if this multitons key is already in use by another instance
 */
function Model(key)
{
    if(Model.instanceMap[key])
    {
        throw new Error(Model.MULTITON_MSG);
    }

    this.multitonKey= key;
    Model.instanceMap[key]= this;
    this.proxyMap= [];
    this.initializeModel();
};

/**
 * Initialize the Model instance.
 * 
 * Called automatically by the constructor, this
 * is your opportunity to initialize the Singleton
 * instance in your subclass without overriding the
 * constructor.
 * 
 * @return void
 */
Model.prototype.initializeModel= function(){};


/**
 * Model Multiton Factory method.
 * Note that this method will return null if supplied a null 
 * or undefined multiton key.
 *  
 * @param {string} key
 *  The multiton key for the Model to retrieve
 * @return {puremvc.Model}
 *  the instance for this Multiton key 
 */
Model.getInstance= function(key)
{
	if (null == key)
		return null;
		
    if(Model.instanceMap[key] == null)
    {
        Model.instanceMap[key]= new Model(key);
    }

    return Model.instanceMap[key];
};

/**
 * Register a Proxy with the Model
 * @param {puremvc.Proxy}
 */
Model.prototype.registerProxy= function(proxy)
{
    proxy.initializeNotifier(this.multitonKey);
    this.proxyMap[proxy.getProxyName()]= proxy;
    proxy.onRegister();
};

/**
 * Retrieve a Proxy from the Model
 * 
 * @param {string} proxyName
 * @return {puremvc.Proxy}
 *  The Proxy instance previously registered with the provided proxyName
 */
Model.prototype.retrieveProxy= function(proxyName)
{
    return this.proxyMap[proxyName];
};

/**
 * Check if a Proxy is registered
 * @param {string} proxyName
 * @return {boolean}
 *  whether a Proxy is currently registered with the given proxyName.
 */
Model.prototype.hasProxy= function(proxyName)
{
    return this.proxyMap[proxyName] != null;
};

/**
 * Remove a Proxy from the Model.
 * 
 * @param {string} proxyName
 *  The name of the Proxy instance to remove
 * @return {puremvc.Proxy}
 *  The Proxy that was removed from the Model
 */
Model.prototype.removeProxy= function(proxyName)
{
    var proxy= this.proxyMap[proxyName];
    if(proxy)
    {
        this.proxyMap[proxyName]= null;
        proxy.onRemove();
    }

    return proxy;
};

/**
 * @static
 * Remove a Model instance.
 * 
 * @param {string} key
 * @return {void}
 */
Model.removeModel= function(key)
{
    delete Model.instanceMap[key];
};

/**
 * @ignore
 * The map used by the Model to store Proxy instances.
 *
 * @protected
 * @type Array
 */
Model.prototype.proxyMap= null;

/**
 * @ignore
 * The map used by the Model to store multiton instances
 *
 * @protected
 * @static
 * @type Array
 */
Model.instanceMap= [];

/**
 * @ignore
 * The Models multiton key.
 *
 * @protected
 * @type string
 */
Model.prototype.multitonKey;

/**
 * @ignore
 * Message Constants
 * 
 * @static
 * @type {string}
 */
Model.MULTITON_MSG= "Model instance for this Multiton key already constructed!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Controller
 * 
 * In PureMVC, the Controller class follows the 'Command and Controller' 
 * strategy, and assumes these responsibilities:
 * 
 * - Remembering which
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or 
 * {@link puremvc.MacroCommand MacroCommand}s
 * are intended to handle which 
 * {@link puremvc.Notification Notification}s
 * - Registering itself as an 
 * {@link puremvc.Observer Observer} with
 * the {@link puremvc.View View} for each 
 * {@link puremvc.Notification Notification}
 * that it has an 
 * {@link puremvc.SimpleCommand SimpleCommand} 
 * or {@link puremvc.MacroCommand MacroCommand} 
 * mapping for.
 * - Creating a new instance of the proper 
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or 
 * {@link puremvc.MacroCommand MacroCommand}s
 * to handle a given 
 * {@link puremvc.Notification Notification} 
 * when notified by the
 * {@link puremvc.View View}.
 * - Calling the command's execute method, passing in the 
 * {@link puremvc.Notification Notification}.
 *
 * Your application must register 
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or {@link puremvc.MacroCommand MacroCommand}s 
 * with the Controller.
 *
 * The simplest way is to subclass 
 * {@link puremvc.Facade Facade},
 * and use its 
 * {@link puremvc.Facade#initializeController initializeController} 
 * method to add your registrations.
 *
 * @constructor
 * This Controller implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the static #getInstance factory method, 
 * passing the unique key for this instance to it.
 * @param {string} key
 * @throws {Error}
 *  If instance for this Multiton key has already been constructed
 */
function Controller(key)
{
    if(Controller.instanceMap[key] != null)
    {
        throw new Error(Controller.MULTITON_MSG);
    }

    this.multitonKey= key;
    Controller.instanceMap[this.multitonKey]= this;
    this.commandMap= new Array();
    this.initializeController();
}

/**
 * @protected
 * 
 * Initialize the multiton Controller instance.
 *
 * Called automatically by the constructor.
 *
 * Note that if you are using a subclass of View
 * in your application, you should *also* subclass Controller
 * and override the initializeController method in the
 * following way.
 * 
 *     MyController.prototype.initializeController= function ()
 *     {
 *         this.view= MyView.getInstance(this.multitonKey);
 *     };
 * 
 * @return {void}
 */
Controller.prototype.initializeController= function()
{
    this.view= View.getInstance(this.multitonKey);
};

/**
 * The Controllers multiton factory method. 
 * Note that this method will return null if supplied a null 
 * or undefined multiton key. 
 *
 * @param {string} key
 *  A Controller's multiton key
 * @return {puremvc.Controller}
 *  the Multiton instance of Controller
 */
Controller.getInstance= function(key)
{
	if (null == key)
		return null;
		
    if(null == this.instanceMap[key])
    {
        this.instanceMap[key]= new this(key);
    }

    return this.instanceMap[key];
};

/**
 * If a SimpleCommand or MacroCommand has previously been registered to handle
 * the given Notification then it is executed.
 *
 * @param {puremvc.Notification} note
 * @return {void}
 */
Controller.prototype.executeCommand= function(note)
{
    var commandClassRef= this.commandMap[note.getName()];
    if(commandClassRef == null)
        return;

    var commandInstance= new commandClassRef();
    commandInstance.initializeNotifier(this.multitonKey);
    commandInstance.execute(note);
};

/**
 * Register a particular SimpleCommand or MacroCommand class as the handler for 
 * a particular Notification.
 *
 * If an command already been registered to handle Notifications with this name, 
 * it is no longer used, the new command is used instead.
 *
 * The Observer for the new command is only created if this the irst time a
 * command has been regisered for this Notification name.
 *
 * @param {string} notificationName
 *  the name of the Notification
 * @param {Function} commandClassRef
 *  a command constructor
 * @return {void}
 */
Controller.prototype.registerCommand= function(notificationName, commandClassRef)
{
    if(this.commandMap[notificationName] == null)
    {
        this.view.registerObserver(notificationName, new Observer(this.executeCommand, this));
    }

    this.commandMap[notificationName]= commandClassRef;
};

/**
 * Check if a command is registered for a given Notification
 *
 * @param {string} notificationName
 * @return {boolean}
 *  whether a Command is currently registered for the given notificationName.
 */
Controller.prototype.hasCommand= function(notificationName)
{
    return this.commandMap[notificationName] != null;
};

/**
 * Remove a previously registered command to
 * {@link puremvc.Notification Notification}
 * mapping.
 *
 * @param {string} notificationName
 *  the name of the Notification to remove the command mapping for
 * @return {void}
 */
Controller.prototype.removeCommand= function(notificationName)
{
    if(this.hasCommand(notificationName))
    {
        this.view.removeObserver(notificationName, this);
        this.commandMap[notificationName]= null;
    }
};

/**
 * @static
 * Remove a Controller instance.
 *
 * @param {string} key 
 *  multitonKey of Controller instance to remove
 * @return {void}
 */
Controller.removeController= function(key)
{
    delete this.instanceMap[key];
};

/**
 * Local reference to the Controller's View
 * 
 * @protected
 * @type {puremvc.View}
 */
Controller.prototype.view= null;

/**
 * Note name to command constructor mappings
 * 
 * @protected
 * @type {Object}
 */
Controller.prototype.commandMap= null;

/**
 * The Controller's multiton key
 * 
 * @protected
 * @type {string}
 */
Controller.prototype.multitonKey= null;

/**
 * Multiton key to Controller instance mappings
 * 
 * @static
 * @protected
 * @type {Object}
 */
Controller.instanceMap= [];

/**
 * @ignore
 * 
 * Message constants
 * @static
 * @protected
 * @type {string}
 */
Controller.MULTITON_MSG= "controller key for this Multiton key already constructed"
/*
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @hide
 * A an internal helper class used to assist classlet implementation. This
 * class is not accessible by client code.
 */
var OopHelp=
{
    /*
     * @private
     * A reference to the global scope. We use this rather than window
     * in order to support both browser based and non browser baed 
     * JavaScript interpreters.
     * @type {Object}
     */
	global: (function(){return this})()
    
    /*
     * @private
     * Extend one Function's prototype by another, emulating classic
     * inheritance.
     * 
     * @param {Function} child
     *  The Function to extend (subclass)
     * 
     * @param {Function} parent
     *  The Function to extend from (superclass)
     * 
     * @return {Function}
     * 
     *  A reference to the extended Function (subclass)
     */
,   extend: function (child, parent)
    {
        if ('function' !== typeof child)
            throw new TypeError('#extend- child should be Function');            
        
        if ('function' !== typeof parent)
            throw new TypeError('#extend- parent should be Function');
            
        if (parent === child)
            return;
            
        var Transitive= new Function;
        Transitive.prototype= parent.prototype;
        child.prototype= new Transitive;
        return child.prototype.constructor= child;
    }
    
    /*
     * @private
     * Decoarate one object with the properties of another. 
     * 
     * @param {Object} object
     *  The object to decorate.
     * 
     * @param {Object} traits
     *  The object providing the properites that the first object
     *  will be decorated with. Note that only properties defined on 
     *  this object will be copied- i.e. inherited properties will
     *  be ignored.
     * 
     * @return {Object}
     *  THe decorated object (first argument)
     */
,   decorate: function (object, traits)
    {   
        for (var accessor in traits)
        {
            object[accessor]= traits[accessor];
        }    
        
        return object;
    }
};


/**
 * @member puremvc
 * 
 * Declare a namespace and optionally make an Object the referent
 * of that namespace.
 * 
 *     console.assert(null == window.tld, 'No tld namespace');
 *     // declare the tld namespace
 *     puremvc.declare('tld');
 *     console.assert('object' === typeof tld, 'The tld namespace was declared');
 * 
 *     // the method returns a reference to last namespace node in a created hierarchy
 *     var reference= puremvc.declare('tld.domain.app');
 *     console.assert(reference === tld.domain.app)
 *    
 *     // of course you can also declare your own objects as well
 *     var AppConstants=
 *         {
 * 	           APP_NAME: 'tld.domain.app.App'
 *         };
 * 
 *     puremvc.declare('tld.domain.app.AppConstants', AppConstants);
 *     console.assert(AppConstants === tld.domain.app.AppConstants
 * 	   , 'AppConstants was exported to the namespace');
 * 
 * Note that you can also #declare within a closure. That way you
 * can selectively export Objects to your own namespaces without
 * leaking variables into the global scope.
 *    
 *     (function(){
 *         // this var is not accessible outside of this
 *         // closures call scope
 *         var hiddenValue= 'defaultValue';
 * 
 *         // export an object that references the hidden
 *         // variable and which can mutate it
 *         puremvc.declare
 *         (
 *              'tld.domain.app.backdoor'
 * 
 *         ,    {
 *                  setValue: function (value)
 *                  {
 *                      // assigns to the hidden var
 *                      hiddenValue= value;
 *                  }
 * 
 *         ,        getValue: function ()
 *                  {
 *                      // reads from the hidden var
 *                      return hiddenValue;
 *                  }
 *              }
 *         );
 *     })();
 *     // indirectly retrieve the hidden variables value
 *     console.assert('defaultValue' === tld.domain.app.backdoor.getValue());
 *     // indirectly set the hidden variables value
 *     tld.domain.app.backdoor.setValue('newValue');
 *     // the hidden var was mutated
 *     console.assert('newValue' === tld.domain.app.backdoor.getValue());
 * 
 * On occasion, primarily during testing, you may want to use declare, 
 * but not have the global object be the namespace root. In these cases you
 * can supply the optional third scope argument.
 * 
 *     var localScope= {}
 *     ,   object= {}
 * 
 *     puremvc.declare('mock.object', object, localScope);
 * 
 *     console.assert(null == window.mock, 'mock namespace is not in global scope');
 *     console.assert(object === localScope.mock.object, 'mock.object is available in localScope');    
 * 
 * @param {string} string
 *  A qualified object name, e.g. 'com.example.Class'
 * 
 * @param {Object} [object]
 *  An object to make the referent of the namespace. 
 * 
 * @param {Object} [scope]
 *  The namespace's root node. If not supplied, the global
 *  scope will be namespaces root node.
 * 
 * @return {Object}
 * 
 *  A reference to the last node of the Object hierarchy created.
 */
function declare (qualifiedName, object, scope)
{
    var nodes= qualifiedName.split('.')
    ,   node= scope || OopHelp.global
    ,   lastNode
    ,   newNode
    ,   nodeName;
                
    for (var i= 0, n= nodes.length; i < n; i++)
    {
        lastNode= node;
        nodeName= nodes[i];
        
        node= (null == node[nodeName] ? node[nodeName] = {} : node[nodeName]);
    }
                    
    if (null == object)
        return node;
                        
    return lastNode[nodeName]= object;
};




/**
 * @member puremvc
 * 
 * Define a new classlet. Current editions of JavaScript do not have classes,
 * but they can be emulated, and this method does this for you, saving you
 * from having to work with Function prototype directly. The method does
 * not extend any Native objects and is entirely opt in. Its particularly
 * usefull if you want to make your PureMvc applications more portable, by
 * decoupling them from a specific OOP abstraction library.
 * 
 * 
 *     puremvc.define
 *     (
 *         // the first object supplied is a class descriptor. None of these
 *         // properties are added to your class, the exception being the
 *         // constructor property, which if supplied, will be your classes
 *         // constructor.
 *         {
 *             // your classes namespace- if supplied, it will be 
 *             // created for you
 *             name: 'com.example.UserMediator'
 * 
 *             // your classes parent class. If supplied, inheritance 
 *             // will be taken care of for you
 *         ,   parent: puremvc.Mediator
 * 
 *             // your classes constructor. If not supplied, one will be 
 *             // created for you
 *         ,   constructor: function UserMediator (component)
 *             {
 *                  puremvc.Mediator.call(this, this.constructor.NAME, component);  
 *             }
 *         }
 *         
 *         // the second object supplied defines your class traits, that is
 *         // the properties that will be defined on your classes prototype
 *         // and thereby on all instances of this class
 *     ,   {
 *             businessMethod: function ()
 *             {
 *                 // impl 
 *             }
 *         }
 * 
 *         // the third object supplied defines your classes 'static' traits
 *         // that is, the methods and properties which will be defined on
 *         // your classes constructor
 *     ,   {
 *             NAME: 'userMediator'
 *         }
 *     );
 * 
 * @param {Object} [classinfo]
 *  An object describing the class. This object can have any or all of
 *  the following properties:
 * 
 *  - name: String  
 *      The classlets name. This can be any arbitrary qualified object
 *      name. 'com.example.Classlet' or simply 'MyClasslet' for example 
 *      The method will automatically create an object hierarchy refering
 *      to your class for you. Note that you will need to capture the 
 *      methods return value to retrieve a reference to your class if the
 *      class name property is not defined.

 *  - parent: Function
 *      The classlets 'superclass'. Your class will be extended from this
 *      if supplied.
 * 
 *  - constructor: Function
 *      The classlets constructor. Note this is *not* a post construct 
 *      initialize method, but your classes constructor Function.
 *      If this attribute is not defined, a constructor will be created for 
 *      you automatically. If you have supplied a parent class
 *      value and not defined the classes constructor, the automatically
 *      created constructor will invoke the super class constructor
 *      automatically. If you have supplied your own constructor and you
 *      wish to invoke it's super constructor, you must do this manually, as
 *      there is no reference to the classes parent added to the constructor
 *      prototype.
 *      
 *  - scope: Object.
 *      For use in advanced scenarios. If the name attribute has been supplied,
 *      this value will be the root of the object hierarchy created for you.
 *      Use it do define your own class hierarchies in private scopes,
 *      accross iFrames, in your unit tests, or avoid collision with third
 *      party library namespaces.
 * 
 * @param {Object} [traits]
 *  An Object, the properties of which will be added to the
 *  class constructors prototype.
 * 
 * @param {Object} [staitcTraits]
 *  An Object, the properties of which will be added directly
 *  to this class constructor
 * 
 * @return {Function}
 *  A reference to the classlets constructor
 */
function define (classInfo, traits, staticTraits)
{
    if (!classInfo)
    {
        classInfo= {}
    }

    var className= classInfo.name
    ,   classParent= classInfo.parent
    ,   doExtend= 'function' === typeof classParent
    ,   classConstructor
    ,   classScope= classInfo.scope || null
    ,   prototype

    if ('parent' in classInfo && !doExtend)
    {
        throw new TypeError('Class parent must be Function');
    }
        
    if (classInfo.hasOwnProperty('constructor'))
    {
        classConstructor= classInfo.constructor
        if ('function' !== typeof classConstructor)
        {
            throw new TypeError('Class constructor must be Function')
        }   
    }
    else // there is no constructor, create one
    {
        if (doExtend) // ensure to call the super constructor
        {
            classConstructor= function ()
            {
                classParent.apply(this, arguments);
            }
        }
        else // just create a Function
        {
            classConstructor= new Function;
        } 
    }

    if (doExtend)
    {
        OopHelp.extend(classConstructor, classParent);
    }
    
    if (traits)
    {
        prototype= classConstructor.prototype
        OopHelp.decorate(prototype, traits);
        // reassign constructor 
        prototype.constructor= classConstructor;
    }
    
    if (staticTraits)
    {
        OopHelp.decorate(classConstructor, staticTraits)
    }
    
    if (className)
    {
        if ('string' !== typeof className)
        {
            throw new TypeError('Class name must be primitive string');
        }
            
        declare (className, classConstructor, classScope);
    }    
    
    return classConstructor;            
};


	
 	/* implementation end */
 	 
 	// define the puremvc global namespace and export the actors
var puremvc =
 	{
 		View: View
 	,	Model: Model
 	,	Controller: Controller
 	,	SimpleCommand: SimpleCommand
 	,	MacroCommand: MacroCommand
 	,	Facade: Facade
 	,	Mediator: Mediator
 	,	Observer: Observer
 	,	Notification: Notification
 	,	Notifier: Notifier
 	,	Proxy: Proxy
 	,	define: define
 	,	declare: declare
 	};



module.exports = puremvc;
},{}],28:[function(require,module,exports){
/**
 * @fileOverview
 * PureMVC State Machine Utility JS Native Port by Saad Shams
 * Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * Reuse governed by Creative Commons Attribution 3.0 
 * http://creativecommons.org/licenses/by/3.0/us/
 * @author saad.shams@puremvc.org 
 */

var puremvc = require( './puremvc-1.0.1-mod.js' );
    
/**
 * Constructor
 *
 * Defines a State.
 * @method State
 * @param {string} name id the id of the state
 * @param {string} entering an optional notification name to be sent when entering this state
 * @param {string} exiting an optional notification name to be sent when exiting this state
 * @param {string} changed an optional notification name to be sent when fully transitioned to this state
 * @return 
 */

function State(name, entering, exiting, changed) {  
    this.name = name;
    if(entering) this.entering = entering;
    if(exiting) this.exiting = exiting;
    if(changed) this.changed = changed;
    this.transitions = {};
}

/**
 * Define a transition.
 * @method defineTrans
 * @param {string} action the name of the StateMachine.ACTION Notification type.
 * @param {string} target the name of the target state to transition to.
 * @return 
 */
State.prototype.defineTrans = function(action, target) {
    if(this.getTarget(action) != null) return;
    this.transitions[action] = target;
}

/**
 * Remove a previously defined transition.
 * @method removeTrans
 * @param {string} action
 * @return 
 */
State.prototype.removeTrans = function(action) {
    delete this.transitions[action];
}

/**
 * Get the target state name for a given action.
 * @method getTarget
 * @param {string} action
 * @return State
 */
/**
 * 
 */
State.prototype.getTarget = function(action) {
    return this.transitions[action] ? this.transitions[action] : null;
}

// The state name
State.prototype.name = null;

// The notification to dispatch when entering the state
State.prototype.entering = null;

// The notification to dispatch when exiting the state
State.prototype.exiting = null;

// The notification to dispatch when the state has actually changed
State.prototype.changed = null;

/**
 *  Transition map of actions to target states
 */ 
State.prototype.transitions = null;
    

    
 /**
 * A Finite State Machine implimentation.
 * <P>
 * Handles regisistration and removal of state definitions, 
 * which include optional entry and exit commands for each 
 * state.</P>
 */

/**
 * Constructor
 *
 * @method StateMachine
 * @return 
 */
function StateMachine() {
    puremvc.Mediator.call(this, StateMachine.NAME, null);
    this.states = {};
}
    
StateMachine.prototype = new puremvc.Mediator;
StateMachine.prototype.constructor = StateMachine;

/**
 * Transitions to initial state once registered with Facade
 * @method onRegister
 * @return 
 */
StateMachine.prototype.onRegister = function() {
    if(this.initial) this.transitionTo(this.initial, null);
}

/**
 * Registers the entry and exit commands for a given state.
 * @method registerState
 * @param {State} state the state to which to register the above commands
 * @param {boolean} initial boolean telling if this is the initial state of the system
 * @return 
 */
StateMachine.prototype.registerState = function(state, initial) {
    if(state == null || this.states[state.name] != null) return;
    this.states[state.name] = state;
    if(initial) this.initial = state;
}

/**
 * Remove a state mapping. Removes the entry and exit commands for a given state as well as the state mapping itself.
 * @method removeState
 * @param {string} stateName
 * @return 
 */
StateMachine.prototype.removeState = function(stateName) {
    var state = this.states[stateName];
    if(state == null) return;
    this.states[stateName] = null;
}

/**
 * Transitions to the given state from the current state.
 * <P>
 * Sends the <code>exiting</code> notification for the current state 
 * followed by the <code>entering</code> notification for the new state.
 * Once finally transitioned to the new state, the <code>changed</code> 
 * notification for the new state is sent.</P>
 * <P>
 * If a data parameter is provided, it is included as the body of all
 * three state-specific transition notes.</P>
 * <P>
 * Finally, when all the state-specific transition notes have been
 * sent, a <code>StateMachine.CHANGED</code> note is sent, with the
 * new <code>State</code> object as the <code>body</code> and the name of the 
 * new state in the <code>type</code>.
 *
 * @method transitionTo
 * @param {State} nextState the next State to transition to.
 * @param {Object} data is the optional Object that was sent in the <code>StateMachine.ACTION</code> notification body
 * @return 
 */
StateMachine.prototype.transitionTo = function(nextState, data) {
    // Going nowhere?
    if(nextState == null) return;
    
    // Clear the cancel flag
    this.canceled = false;
    
    // Exit the current State 
    if(this.getCurrentState() && this.getCurrentState().exiting) 
        this.sendNotification(this.getCurrentState().exiting, data, nextState.name);
    
    // Check to see whether the exiting guard has canceled the transition
    if(this.canceled) {
        this.canceled = false;
        return;
    }
    
    // Enter the next State 
    if(nextState.entering)
        this.sendNotification(nextState.entering, data);
    
    // Check to see whether the entering guard has canceled the transition
    if(this.canceled) {
        this.canceled = false;
        return;
    }
    
    // change the current state only when both guards have been passed
    this.setCurrentState(nextState);
    
    // Send the notification configured to be sent when this specific state becomes current 
    if(nextState.changed) {
        this.sendNotification(this.getCurrentState().changed, data);
    }
    
    // Notify the app generally that the state changed and what the new state is 
    this.sendNotification(StateMachine.CHANGED, this.getCurrentState(), this.getCurrentState().name);
}

/**
 * Notification interests for the StateMachine.
 * @method listNotificationInterests
 * @return {Array} Array of Notifications
 */

StateMachine.prototype.listNotificationInterests = function() {
    return [
        StateMachine.ACTION,
        StateMachine.CANCEL
    ];
}

/**
 * Handle notifications the <code>StateMachine</code> is interested in.
 * <P>
 * <code>StateMachine.ACTION</code>: Triggers the transition to a new state.<BR>
 * <code>StateMachine.CANCEL</code>: Cancels the transition if sent in response to the exiting note for the current state.<BR>
 *
 * @method handleNotification
 * @param {Notification} notification
 * @return 
 */
StateMachine.prototype.handleNotification = function(notification) {
    switch(notification.getName()) {
        case StateMachine.ACTION:
            var action = notification.getType();
            var target = this.getCurrentState().getTarget(action);
            var newState = this.states[target];
            if(newState) this.transitionTo(newState, notification.getBody());
            break;
            
        case StateMachine.CANCEL:
            this.canceled = true;
            break;
    }
}

/**
 * Get the current state.
 * @method getCurrentState
 * @return a State defining the machine's current state
 */
StateMachine.prototype.getCurrentState = function() {
    return this.viewComponent;
}

/**
 * Set the current state.
 * @method setCurrentState
 * @param {State} state
 * @return 
 */
StateMachine.prototype.setCurrentState = function(state) {
    this.viewComponent = state;
}

/**
 * Map of States objects by name.
 */
StateMachine.prototype.states = null;

/**
 * The initial state of the FSM.
 */
StateMachine.prototype.initial = null;

/**
 * The transition has been canceled.
 */
StateMachine.prototype.canceled = null;
    
StateMachine.NAME = "StateMachine";

/**
 * Action Notification name. 
 */ 
StateMachine.ACTION = StateMachine.NAME + "/notes/action";

/**
 *  Changed Notification name  
 */ 
StateMachine.CHANGED = StateMachine.NAME + "/notes/changed";

/**
 *  Cancel Notification name  
 */ 
StateMachine.CANCEL = StateMachine.NAME + "/notes/cancel";
    
    
/**
 * Creates and registers a StateMachine described in JSON.
 * 
 * <P>
 * This allows reconfiguration of the StateMachine 
 * without changing any code, as well as making it 
 * easier than creating all the <code>State</code> 
 * instances and registering them with the 
 * <code>StateMachine</code> at startup time.
 * 
 * @ see State
 * @ see StateMachine
 */

/**
 * Constructor
 * @method FSMInjector
 * @param {Object} fsm JSON Object
 * @return 
 */
function FSMInjector(fsm) {
    puremvc.Notifier.call(this);
    this.fsm = fsm;
}
  
FSMInjector.prototype = new puremvc.Notifier;
FSMInjector.prototype.constructor = FSMInjector;

/**
 * Inject the <code>StateMachine</code> into the PureMVC apparatus.
 * <P>
 * Creates the <code>StateMachine</code> instance, registers all the states
 * and registers the <code>StateMachine</code> with the <code>IFacade</code>.
 * @method inject
 * @return 
 */
FSMInjector.prototype.inject = function() {
    // Create the StateMachine
    var stateMachine = new puremvc.statemachine.StateMachine();
    
    // Register all the states with the StateMachine
    var states = this.getStates();
    for(var i=0; i<states.length; i++) {
        stateMachine.registerState(states[i], this.isInitial(states[i].name));
    }
    
    // Register the StateMachine with the facade
    this.facade.registerMediator(stateMachine);
}

/**
 * Get the state definitions.
 * <P>
 * Creates and returns the array of State objects 
 * from the FSM on first call, subsequently returns
 * the existing array.</P>
 *
 * @method getStates
 * @return {Array} Array of States
 */
FSMInjector.prototype.getStates = function() {
    if(this.stateList == null) {
        this.stateList = [];

        var stateDefs = this.fsm.state ? this.fsm.state : [];
        for(var i=0; i<stateDefs.length; i++) {
            var stateDef = stateDefs[i];
            var state = this.createState(stateDef);
            this.stateList.push(state);
        }
    }
    return this.stateList;
}

/**
 * Creates a <code>State</code> instance from its JSON definition.
 * @method createState
 * @param {Object} stateDef JSON Object
 * @return {State} 
 */
/**

 */
FSMInjector.prototype.createState = function(stateDef) {
    // Create State object
    var name = stateDef['@name'];
    var exiting = stateDef['@exiting'];
    var entering = stateDef['@entering'];
    var changed = stateDef['@changed'];
    var state = new puremvc.statemachine.State(name, entering, exiting, changed);
    
    // Create transitions
    var transitions = stateDef.transition ? stateDef.transition : [];
    for(var i=0; i<transitions.length; i++) {
        var transDef = transitions[i];
        state.defineTrans(transDef['@action'], transDef['@target']);
    }
    return state;
}

/**
 * Is the given state the initial state?
 * @method isInitial
 * @param {string} stateName
 * @return {boolean}
 */
FSMInjector.prototype.isInitial = function(stateName) {
    var initial = this.fsm['@initial'];
    return stateName == initial;
}

// The JSON FSM definition
FSMInjector.prototype.fsm = null;

// The List of State objects
FSMInjector.prototype.stateList = null;


puremvc.statemachine =
{
    State: State
    ,	StateMachine: StateMachine
    ,	FSMInjector: FSMInjector
};

module.exports = puremvc.statemachine;
},{"./puremvc-1.0.1-mod.js":27}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxub2RlanNcXG5wbV9nbG9iYWxcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiTVZDMDFQZW5ndWluXFxqc1xcQXBwRmFjYWRlLmpzIiwiTVZDMDFQZW5ndWluXFxqc1xcYXBwLmpzIiwiTVZDMDFQZW5ndWluXFxqc1xcY29udHJvbGxlclxcY29tbWFuZFxcSW5qZWN0RlNNQ29tbWFuZC5qcyIsIk1WQzAxUGVuZ3VpblxcanNcXGNvbnRyb2xsZXJcXGNvbW1hbmRcXFByZXBDb250cm9sbGVyQ29tbWFuZC5qcyIsIk1WQzAxUGVuZ3VpblxcanNcXGNvbnRyb2xsZXJcXGNvbW1hbmRcXFByZXBNb2RlbENvbW1hbmQuanMiLCJNVkMwMVBlbmd1aW5cXGpzXFxjb250cm9sbGVyXFxjb21tYW5kXFxQcmVwVmlld0NvbW1hbmQuanMiLCJNVkMwMVBlbmd1aW5cXGpzXFxjb250cm9sbGVyXFxjb21tYW5kXFxTdGFydHVwQ29tbWFuZC5qcyIsIk1WQzAxUGVuZ3VpblxcanNcXG1vZGVsXFxwcm94eVxcR2FtZVByb3h5LmpzIiwiTVZDMDFQZW5ndWluXFxqc1xccHJvZmlsZVxcZmxvd1xcU2NlbmVBY3Rpb24uanMiLCJNVkMwMVBlbmd1aW5cXGpzXFxwcm9maWxlXFxmbG93XFxTY2VuZUZzbS5qcyIsIk1WQzAxUGVuZ3VpblxcanNcXHByb2ZpbGVcXGZsb3dcXFNjZW5lU3RhdGUuanMiLCJNVkMwMVBlbmd1aW5cXGpzXFxwcm9maWxlXFxmbG93XFxTY2VuZVRyYW5zaXRpb24uanMiLCJNVkMwMVBlbmd1aW5cXGpzXFx2aWV3XFxjb21wb25lbnRcXEJhY2tncm91bmRMYXllci5qcyIsIk1WQzAxUGVuZ3VpblxcanNcXHZpZXdcXGNvbXBvbmVudFxcQmVhclNwcml0ZS5qcyIsIk1WQzAxUGVuZ3VpblxcanNcXHZpZXdcXGNvbXBvbmVudFxcR2FtZUxheWVyLmpzIiwiTVZDMDFQZW5ndWluXFxqc1xcdmlld1xcY29tcG9uZW50XFxQZW5ndWluU3ByaXRlLmpzIiwiTVZDMDFQZW5ndWluXFxqc1xcdmlld1xcbWVkaWF0b3JcXERpcmVjdG9yTWVkaWF0b3IuanMiLCJNVkMwMVBlbmd1aW5cXGpzXFx2aWV3XFxtZWRpYXRvclxcR2FtZU1lZGlhdG9yLmpzIiwiTVZDMDFQZW5ndWluXFxqc1xcdmlld1xcbWVkaWF0b3JcXFNjZW5lTWVkaWF0b3IuanMiLCJNVkMwMVBlbmd1aW5cXGpzXFx2aWV3XFx1aVxcRnJlZUZhbGxBY3Rpb24uanMiLCJNVkMwMVBlbmd1aW5cXGpzXFx2aWV3XFx1aVxcUmVzb3VyY2UuanMiLCJub2RlX21vZHVsZXNcXEdlbmVDb2Nvc0pTXFxjbGFzc1xcTG9hZGVyU2NlbmUuanMiLCJub2RlX21vZHVsZXNcXEdlbmVDb2Nvc0pTXFxpbmRleC5qcyIsIm5vZGVfbW9kdWxlc1xcR2VuZUpTXFxlYXNlanMuanMiLCJub2RlX21vZHVsZXNcXEdlbmVKU1xcaW5kZXguanMiLCJub2RlX21vZHVsZXNcXHB1cmVtdmNcXGluZGV4LmpzIiwibm9kZV9tb2R1bGVzXFxwdXJlbXZjXFxsaWJcXHB1cmVtdmMtMS4wLjEtbW9kLmpzIiwibm9kZV9tb2R1bGVzXFxwdXJlbXZjXFxsaWJcXHB1cmVtdmMtc3RhdGVtYWNoaW5lLTEuMC1tb2QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4NUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XHJcbnZhciBTdGFydHVwQ29tbWFuZCA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9jb21tYW5kL1N0YXJ0dXBDb21tYW5kLmpzJyk7XHJcblxyXG52YXIgQXBwRmFjYWRlID0gbW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZShcclxuICAgIC8vIENMQVNTIElORk9cclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnQXBwRmFjYWRlJyxcclxuICAgICAgICBwYXJlbnQ6IHB1cmVtdmMuRmFjYWRlLFxyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKG11bHRpdG9uS2V5KSB7XHJcbiAgICAgICAgICAgIHB1cmVtdmMuRmFjYWRlLmNhbGwodGhpcywgbXVsdGl0b25LZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgaW5pdGlhbGl6ZUNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcHVyZW12Yy5GYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVDb250cm9sbGVyLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kKEFwcEZhY2FkZS5TVEFSVFVQLCBTdGFydHVwQ29tbWFuZCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0aWFsaXplTW9kZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcHVyZW12Yy5GYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVNb2RlbC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdGlhbGl6ZVZpZXc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcHVyZW12Yy5GYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVWaWV3LmNhbGwodGhpcyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3RhcnR1cDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmROb3RpZmljYXRpb24oQXBwRmFjYWRlLlNUQVJUVVApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIGdldEluc3RhbmNlOiBmdW5jdGlvbihtdWx0aXRvbktleSkge1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2VNYXAgPSBwdXJlbXZjLkZhY2FkZS5pbnN0YW5jZU1hcDtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gaW5zdGFuY2VNYXBbbXVsdGl0b25LZXldO1xyXG4gICAgICAgICAgICBpZihpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZU1hcFttdWx0aXRvbktleV0gPSBuZXcgQXBwRmFjYWRlKG11bHRpdG9uS2V5KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIE5BTUU6ICdBcHBGYWNhZGUnLFxyXG4gICAgICAgIFNUQVJUVVA6ICdTdGFydHVwJ1xyXG4gICAgfVxyXG4pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIEFwcEZhY2FkZSA9IHJlcXVpcmUoJy4vQXBwRmFjYWRlLmpzJyk7XHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICBjYy5nYW1lLmNvbmZpZ1tjYy5nYW1lLkNPTkZJR19LRVkuZGVidWdNb2RlXSA9IDE7XHJcbiAgICBjYy5nYW1lLmNvbmZpZ1tjYy5nYW1lLkNPTkZJR19LRVkuc2hvd0ZQU10gPSB0cnVlO1xyXG4gICAgY2MuZ2FtZS5jb25maWdbY2MuZ2FtZS5DT05GSUdfS0VZLmZyYW1lUmF0ZV0gPSA2MDtcclxuICAgIGNjLmdhbWUuY29uZmlnW2NjLmdhbWUuQ09ORklHX0tFWS5pZF0gPSAnZ2FtZUNhbnZhcyc7XHJcbiAgICBjYy5nYW1lLmNvbmZpZ1tjYy5nYW1lLkNPTkZJR19LRVkucmVuZGVyTW9kZV0gPSAwO1xyXG5cclxuICAgIGNjLmdhbWUub25TdGFydCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY2Mudmlldy5hZGp1c3RWaWV3UG9ydCh0cnVlKTtcclxuICAgICAgICBjYy52aWV3LnNldERlc2lnblJlc29sdXRpb25TaXplKDQ4MCwgMzIwLGNjLlJlc29sdXRpb25Qb2xpY3kuU0hPV19BTEwpO1xyXG4gICAgICAgIGNjLnZpZXcucmVzaXplV2l0aEJyb3dzZXJTaXplKHRydWUpO1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLnNldFByb2plY3Rpb24oY2MuRGlyZWN0b3IuUFJPSkVDVElPTl8yRCk7XHJcblxyXG4gICAgICAgIHZhciBrZXkgPSAnTVZDX0hFTExPV09STEQnO1xyXG4gICAgICAgIEFwcEZhY2FkZS5nZXRJbnN0YW5jZShrZXkpLnN0YXJ0dXAoKTtcclxuICAgIH07XHJcblxyXG4gICAgY2MuZ2FtZS5ydW4oKTtcclxufSkoKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xyXG52YXIgU2NlbmVGc20gPSByZXF1aXJlKCcuLy4uLy4uL3Byb2ZpbGUvZmxvdy9TY2VuZUZzbS5qcycpLlNjZW5lRnNtO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ2NvbnRyb2xsZXIuY29tbWFuZC5JbmplY3RGU01Db21tYW5kJyxcclxuICAgICAgICBwYXJlbnQ6cHVyZW12Yy5TaW1wbGVDb21tYW5kXHJcbiAgICB9LFxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBleGVjdXRlOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2MubG9nKCdJbmplY3RGU01Db21tYW5kIGV4ZWN1dGUnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzY2VuZUZzbSA9IG5ldyBTY2VuZUZzbSgpO1xyXG4gICAgICAgICAgICB2YXIgZnNtID0gc2NlbmVGc20uY3JlYXRlRnNtKCk7XHJcblxyXG4gICAgICAgICAgICAvL2NjLmxvZyhmc20pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGluamVjdG9yID0gbmV3IHB1cmVtdmMuc3RhdGVtYWNoaW5lLkZTTUluamVjdG9yKGZzbSk7XHJcbiAgICAgICAgICAgIGluamVjdG9yLmluaXRpYWxpemVOb3RpZmllcih0aGlzLm11bHRpdG9uS2V5KTtcclxuICAgICAgICAgICAgaW5qZWN0b3IuaW5qZWN0KCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdQcmVwQ29udHJvbGxlckNvbW1hbmQnXHJcbiAgICB9XHJcbik7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmVcclxuKFxyXG4gICAgLy8gQ0xBU1MgSU5GT1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdjb250cm9sbGVyLmNvbW1hbmQuUHJlcENvbnRyb2xsZXJDb21tYW5kJyxcclxuICAgICAgICBwYXJlbnQ6cHVyZW12Yy5TaW1wbGVDb21tYW5kXHJcbiAgICB9LFxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBleGVjdXRlOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2MubG9nKCdQcmVwQ29udHJvbGxlckNvbW1hbmQgZXhlY3V0ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdQcmVwQ29udHJvbGxlckNvbW1hbmQnXHJcbiAgICB9XHJcbik7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxudmFyIEdhbWVQcm94eSA9IHJlcXVpcmUoJy4vLi4vLi4vbW9kZWwvcHJveHkvR2FtZVByb3h5Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lXHJcbihcclxuICAgIC8vIENMQVNTIElORk9cclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnY29udHJvbGxlci5jb21tYW5kLlByZXBNb2RlbENvbW1hbmQnLFxyXG4gICAgICAgIHBhcmVudDpwdXJlbXZjLlNpbXBsZUNvbW1hbmRcclxuICAgIH0sXHJcbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uIChub3RpZmljYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYy5sb2coJ1ByZXBNb2RlbENvbW1hbmQgZXhlY3V0ZScpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5mYWNhZGUucmVnaXN0ZXJQcm94eShuZXcgR2FtZVByb3h5KCkgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBOQU1FOiAnUHJlcE1vZGVsQ29tbWFuZCdcclxuICAgIH1cclxuKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xyXG52YXIgRGlyZWN0b3JNZWRpYXRvciA9IHJlcXVpcmUoJy4vLi4vLi4vdmlldy9tZWRpYXRvci9EaXJlY3Rvck1lZGlhdG9yLmpzJyk7XHJcbnZhciBTY2VuZU1lZGlhdG9yID0gcmVxdWlyZSgnLi8uLi8uLi92aWV3L21lZGlhdG9yL1NjZW5lTWVkaWF0b3IuanMnKTtcclxudmFyIEdhbWVNZWRpYXRvciA9IHJlcXVpcmUoJy4vLi4vLi4vdmlldy9tZWRpYXRvci9HYW1lTWVkaWF0b3IuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmVcclxuKFxyXG4gICAgLy8gQ0xBU1MgSU5GT1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdjb250cm9sbGVyLmNvbW1hbmQuUHJlcFZpZXdDb21tYW5kJyxcclxuICAgICAgICBwYXJlbnQ6cHVyZW12Yy5TaW1wbGVDb21tYW5kXHJcbiAgICB9LFxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBleGVjdXRlOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2MubG9nKCdQcmVwVmlld0NvbW1hbmQgZXhlY3V0ZScpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5mYWNhZGUucmVnaXN0ZXJNZWRpYXRvciggbmV3IERpcmVjdG9yTWVkaWF0b3IoKSApO1xyXG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3Rlck1lZGlhdG9yKCBuZXcgU2NlbmVNZWRpYXRvcigpICk7XHJcbiAgICAgICAgICAgIHRoaXMuZmFjYWRlLnJlZ2lzdGVyTWVkaWF0b3IoIG5ldyBHYW1lTWVkaWF0b3IoKSApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdQcmVwVmlld0NvbW1hbmQnXHJcbiAgICB9XHJcbik7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxudmFyIFByZXBNb2RlbENvbW1hbmQgPSByZXF1aXJlKCcuL1ByZXBNb2RlbENvbW1hbmQuanMnKTtcclxudmFyIFByZXBWaWV3Q29tbWFuZCA9IHJlcXVpcmUoJy4vUHJlcFZpZXdDb21tYW5kLmpzJyk7XHJcbnZhciBQcmVwQ29udHJvbGxlckNvbW1hbmQgPSByZXF1aXJlKCcuL1ByZXBDb250cm9sbGVyQ29tbWFuZC5qcycpO1xyXG52YXIgSW5qZWN0RlNNQ29tbWFuZCA9IHJlcXVpcmUoJy4vSW5qZWN0RlNNQ29tbWFuZC5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ2NvbnRyb2xsZXIuY29tbWFuZC5TdGFydHVwQ29tbWFuZCcsXHJcbiAgICAgICAgcGFyZW50OnB1cmVtdmMuTWFjcm9Db21tYW5kXHJcbiAgICB9LFxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBpbml0aWFsaXplTWFjcm9Db21tYW5kOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRTdWJDb21tYW5kKFByZXBNb2RlbENvbW1hbmQpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFN1YkNvbW1hbmQoUHJlcFZpZXdDb21tYW5kKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTdWJDb21tYW5kKFByZXBDb250cm9sbGVyQ29tbWFuZCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU3ViQ29tbWFuZChJbmplY3RGU01Db21tYW5kICk7XHJcblxyXG4gICAgICAgIH1cclxufSxcclxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgTkFNRTogJ1N0YXJ0dXBDb21tYW5kJ1xyXG4gICAgfVxyXG4pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XHJcbnZhciBTY2VuZUFjdGlvbiA9IHJlcXVpcmUoJy4vLi4vLi4vcHJvZmlsZS9mbG93L1NjZW5lQWN0aW9uLmpzJykuU2NlbmVBY3Rpb247XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lXHJcbihcclxuICAgIC8vIENMQVNTIElORk9cclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnbW9kZWwucHJveHkuR2FtZVByb3h5JyxcclxuICAgICAgICBwYXJlbnQ6IHB1cmVtdmMuUHJveHksXHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHB1cmVtdmMuUHJveHkuY2FsbCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdHYW1lUHJveHknXHJcbiAgICB9XHJcbik7XHJcblxyXG4iLCJ2YXIgR2VuZUpTID0gcmVxdWlyZSgnR2VuZUpTJyk7XHJcblxyXG4vLyBBY3Rpb24g5Yqo5L2cXHJcbnZhciBTY2VuZUFjdGlvbiA9IEdlbmVKUy5DbGFzcyh7XHJcbiAgICAncHVibGljIGNvbnN0IEhPTUVfQUNUSU9OJzogJ0hvbWVBY3Rpb24nLFxyXG4gICAgJ3B1YmxpYyBjb25zdCBHQU1FX0FDVElPTic6ICdHYW1lQWN0aW9uJyxcclxuICAgICdwdWJsaWMgY29uc3QgR0FNRV9PVkVSX0FDVElPTic6ICdHYW1lT3ZlckFjdGlvbidcclxufSk7XHJcblxyXG5cclxuZXhwb3J0cy5TY2VuZUFjdGlvbiA9IFNjZW5lQWN0aW9uOyIsInZhciBHZW5lSlMgPSByZXF1aXJlKCdHZW5lSlMnKTtcclxuXHJcbnZhciBTY2VuZVN0YXRlID0gcmVxdWlyZSgnLi9TY2VuZVN0YXRlLmpzJykuU2NlbmVTdGF0ZTtcclxudmFyIFNjZW5lQWN0aW9uID0gcmVxdWlyZSgnLi9TY2VuZUFjdGlvbi5qcycpLlNjZW5lQWN0aW9uO1xyXG52YXIgU2NlbmVUcmFuc2l0aW9uID0gcmVxdWlyZSgnLi9TY2VuZVRyYW5zaXRpb24uanMnKS5TY2VuZVRyYW5zaXRpb247XHJcblxyXG52YXIgU2NlbmVGc20gPSBHZW5lSlMuQ2xhc3Moe1xyXG4gICAgJ3B1YmxpYyBjcmVhdGVGc20nOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZnNtID0ge1xyXG4gICAgICAgICAgICAvLyDlvIDlp4vnirbmgIFcclxuICAgICAgICAgICAgXCJAaW5pdGlhbFwiOiBTY2VuZVN0YXRlLiQoJ0dBTUVfTUVESUFUT1InKSxcclxuICAgICAgICAgICAgXCJzdGF0ZVwiOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2FtZVxyXG4gICAgICAgICAgICAgICAgICAgIFwiQG5hbWVcIjogU2NlbmVTdGF0ZS4kKCdHQU1FX01FRElBVE9SJyksXHJcbiAgICAgICAgICAgICAgICAgICAgLy9cIkBjaGFuZ2VkXCI6IFNjZW5lVHJhbnNpdGlvbiAsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0cmFuc2l0aW9uXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAYWN0aW9uXCI6IFNjZW5lQWN0aW9uLiQoJ0dBTUVfT1ZFUl9BQ1RJT04nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQHRhcmdldFwiOiBTY2VuZVN0YXRlLiQoJ0dBTUVfT1ZFUl9NRURJQVRPUicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdhbWVPdmVyXHJcbiAgICAgICAgICAgICAgICAgICAgXCJAbmFtZVwiOiBTY2VuZVN0YXRlLiQoJ0dBTUVfT1ZFUl9NRURJQVRPUicpLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vXCJAY2hhbmdlZFwiOiBTY2VuZVRyYW5zaXRpb24gLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHJhbnNpdGlvblwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGFjdGlvblwiOiBTY2VuZUFjdGlvbi4kKCdIT01FX0FDVElPTicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAdGFyZ2V0XCI6IFNjZW5lU3RhdGUuJCgnR0FNRV9NRURJQVRPUicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZnNtO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydHMuU2NlbmVGc20gPSBTY2VuZUZzbTsiLCJ2YXIgR2VuZUpTID0gcmVxdWlyZSgnR2VuZUpTJyk7XHJcblxyXG4vLyBTdGF0ZSDnirbmgIFcclxudmFyIFNjZW5lU3RhdGUgPSBHZW5lSlMuQ2xhc3Moe1xyXG4gICAgJ3B1YmxpYyBjb25zdCBHQU1FX01FRElBVE9SJzogJ0dhbWVNZWRpYXRvcicsXHJcbiAgICAncHVibGljIGNvbnN0IEdBTUVfT1ZFUl9NRURJQVRPUic6ICdHYW1lT3Zlck1lZGlhdG9yJ1xyXG59KTtcclxuXHJcblxyXG5leHBvcnRzLlNjZW5lU3RhdGUgPSBTY2VuZVN0YXRlOyIsInZhciBHZW5lSlMgPSByZXF1aXJlKCdHZW5lSlMnKTtcclxuXHJcbi8vIFRyYW5zaXRpb24g6L2s5Y+YXHJcbnZhciBTY2VuZVRyYW5zaXRpb24gPSBHZW5lSlMuQ2xhc3Moe1xyXG5cclxufSk7XHJcblxyXG5cclxuZXhwb3J0cy5TY2VuZVRyYW5zaXRpb24gPSBTY2VuZVRyYW5zaXRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcmVzID0gcmVxdWlyZSgnLi8uLi91aS9SZXNvdXJjZS5qcycpLnJlcztcclxuXHJcblxyXG52YXIgQmFja2dyb3VuZExheWVyID0gY2MuTGF5ZXIuZXh0ZW5kKHtcclxuXHJcbiAgICB3aW5TaXplOiBjYy5TaXplKDQwMCwgMzAwKSxcclxuXHJcbiAgICBiZ19hcnJheTogbnVsbCxcclxuICAgIGJhY2tncm91bmRTcHJpdGVfMjogbnVsbCxcclxuXHJcbiAgICBjdG9yOiBmdW5jdGlvbiAoc3BhY2UpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAvLyDmuLjmiI/lnLrmma/lvIDlp4vml7bog4zmma9cclxuICAgICAgICB2YXIgYmFja2dyb3VuZFNwcml0ZV8xID0gY2MuU3ByaXRlLmNyZWF0ZShyZXMuYmFja2dyb3VuZCk7XHJcbiAgICAgICAgYmFja2dyb3VuZFNwcml0ZV8xLnNldFBvc2l0aW9uKHRoaXMud2luU2l6ZS53aWR0aCAvIDIsIHRoaXMud2luU2l6ZS5oZWlnaHQgLyAyKTtcclxuICAgICAgICBiYWNrZ3JvdW5kU3ByaXRlXzEudGFnID0gMjAwMjtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGJhY2tncm91bmRTcHJpdGVfMSwgMCk7XHJcbiAgICAgICAgdGhpcy5iZ19hcnJheSA9IHRoaXMuYmdfYXJyYXkgfHwgbmV3IEFycmF5KCk7ICAgLy8g5a2Y5YKo6IOM5pmv5Zu+5bGC5LiK55qE57K+54G1XHJcbiAgICAgICAgdGhpcy5iZ19hcnJheSA9IFtdO1xyXG4gICAgICAgIHRoaXMuYmdfYXJyYXkucHVzaChiYWNrZ3JvdW5kU3ByaXRlXzEpO1xyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZFNwcml0ZV8yID0gdGhpcy5iYWNrZ3JvdW5kU3ByaXRlXzIgfHwgY2MuU3ByaXRlLmNyZWF0ZShyZXMuYmFja2dyb3VuZDIpO1xyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZFNwcml0ZV8yLmF0dHIoe1xyXG4gICAgICAgICAgICB4OiB0aGlzLndpblNpemUud2lkdGggLyAyLFxyXG4gICAgICAgICAgICB5OiB0aGlzLndpblNpemUuaGVpZ2h0IC8gMlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5iYWNrZ3JvdW5kU3ByaXRlXzIsIC0xKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlX1Nwcml0ZTogZnVuY3Rpb24gKGR4KSB7XHJcbiAgICAgICAgLy8g5LyB6bmF5omT6aOe5pe256e75Yqo6IOM5pmv5Zu+5bGC5Lit55qE57K+54G1XHJcbiAgICAgICAgdmFyIGkgPSB0aGlzLmJnX2FycmF5Lmxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgICAgIHZhciBzcCA9IHRoaXMuYmdfYXJyYXlbaV07XHJcbiAgICAgICAgICAgIGlmIChzcC54ID4gdGhpcy53aW5TaXplLndpZHRoICsgMjQwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJnX2FycmF5LnNwbGljZShpLCAxKTsgLy8g5aaC5p6c5LiN5Zyo5bGP5bmV5LmL5YaF77yM5YiZ5LiN5YaN56e75YqoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHNwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNwLnNldFBvc2l0aW9uWChzcC54ICsgZHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkX21pbGVzdG9uZTogZnVuY3Rpb24gKHNjb3JlKSB7XHJcbiAgICAgICAgLy8g5re75Yqg6YeM56iL56KRXHJcbiAgICAgICAgdmFyIG1pbGVzdG9uZSA9IGNjLlNwcml0ZS5jcmVhdGUocmVzLm1pbGVzdG9uZSk7XHJcbiAgICAgICAgbWlsZXN0b25lLnNldFBvc2l0aW9uKG1pbGVzdG9uZS53aWR0aCwgOTApO1xyXG4gICAgICAgIC8vIOaYvuekuuWIhuaVsFxyXG4gICAgICAgIHZhciBzY29yZV9MYWJlbCA9IGNjLkxhYmVsVFRGLmNyZWF0ZShzY29yZSwgXCJBcmlhbFwiLCAxNCk7XHJcbiAgICAgICAgc2NvcmVfTGFiZWwuc2V0Q29sb3IoY2MuY29sb3IoMCwgMTkxLCAyNTUsIDApKTtcclxuICAgICAgICBzY29yZV9MYWJlbC5zZXRQb3NpdGlvbihtaWxlc3RvbmUud2lkdGggKyAxMCwgMTAyKTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKG1pbGVzdG9uZSwgMSk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChzY29yZV9MYWJlbCwgMSlcclxuICAgICAgICB0aGlzLmJnX2FycmF5LnB1c2gobWlsZXN0b25lKTtcclxuICAgICAgICB0aGlzLmJnX2FycmF5LnB1c2goc2NvcmVfTGFiZWwpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydHMuQmFja2dyb3VuZExheWVyID0gQmFja2dyb3VuZExheWVyOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHJlcyA9IHJlcXVpcmUoJy4vLi4vdWkvUmVzb3VyY2UuanMnKS5yZXM7XHJcblxyXG52YXIgQmVhclNwcml0ZSA9IGNjLlNwcml0ZS5leHRlbmQoe1xyXG4gICAgcGVuZ3VpbiA6IG51bGwsXHJcbiAgICByYXRlIDogbnVsbCxcclxuICAgIGNvdHIgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG4gICAgfSxcclxuICAgIGluaXQgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmluaXRXaXRoRmlsZShyZXMuaWRsZSk7XHJcbiAgICB9LFxyXG4gICAgcmVhZHlCYXNlQmFsbCA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIOeGiuaMpeadhuWHhuWkh1xyXG4gICAgICAgIHZhciBhbmltYXRpb24gPSBjYy5BbmltYXRpb24uY3JlYXRlKCk7XHJcbiAgICAgICAgYW5pbWF0aW9uLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnJlYWR5XzEpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5yZWFkeV8yKTtcclxuICAgICAgICBhbmltYXRpb24uYWRkU3ByaXRlRnJhbWVXaXRoRmlsZShyZXMucmVhZHlfMyk7XHJcbiAgICAgICAgYW5pbWF0aW9uLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnJlYWR5XzQpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5yZWFkeV81KTtcclxuICAgICAgICBhbmltYXRpb24uc2V0RGVsYXlQZXJVbml0KDAuMSk7IC8vIOavj+malDAuMeenkuaSreaUvuS4gOW4p1xyXG4gICAgICAgIHZhciBhbmltYXRlID0gY2MuQW5pbWF0ZS5jcmVhdGUoYW5pbWF0aW9uKTtcclxuICAgICAgICB0aGlzLnN0b3BBbGxBY3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy5ydW5BY3Rpb24oYW5pbWF0ZSk7XHJcbiAgICB9LFxyXG4gICAgcGxheUJhc2VCYWxsIDogZnVuY3Rpb24ocGVuZ3VpbiwgcGVyY2VudGFnZSkge1xyXG4gICAgICAgIHRoaXMucGVuZ3VpbiA9IHBlbmd1aW47XHJcbiAgICAgICAgdGhpcy5yYXRlID0gcGVyY2VudGFnZTsgLy8g5bCG5Yqb6YeP5YC855yL5YGa5LyB6bmF6KKr5omT5Ye65pe255qE5Yid6YCf5bqmXHJcbiAgICAgICAgLy8g54aK5byA5aeL5oyl5p2GXHJcbiAgICAgICAgdGhpcy5zdG9wQWxsQWN0aW9ucygpO1xyXG4gICAgICAgIHZhciBhbmltYXRpb24gPSBjYy5BbmltYXRpb24uY3JlYXRlKCk7XHJcbiAgICAgICAgYW5pbWF0aW9uLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnN0cmlrZV8xKTtcclxuICAgICAgICBhbmltYXRpb24uYWRkU3ByaXRlRnJhbWVXaXRoRmlsZShyZXMuc3RyaWtlXzIpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5zdHJpa2VfMyk7XHJcbiAgICAgICAgYW5pbWF0aW9uLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnN0cmlrZV80KTtcclxuICAgICAgICBhbmltYXRpb24uYWRkU3ByaXRlRnJhbWVXaXRoRmlsZShyZXMuc3RyaWtlXzUpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5zZXREZWxheVBlclVuaXQoMC4wNSk7XHJcbiAgICAgICAgdmFyIGFuaW1hdGUgPSBjYy5BbmltYXRlLmNyZWF0ZShhbmltYXRpb24pO1xyXG4gICAgICAgIC8vIOaMpeadhue7k+adn+WQjuajgOa1i+eisOaSnlxyXG4gICAgICAgIHZhciBhY3Rpb25GaW5pc2ggPSBjYy5DYWxsRnVuYy5jcmVhdGUodGhpcy5jaGVja1N0cmlrZS5jYWxsKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnJ1bkFjdGlvbihjYy5TZXF1ZW5jZS5jcmVhdGUoW2FuaW1hdGUsIGFjdGlvbkZpbmlzaF0pKTtcclxuICAgIH0sXHJcbiAgICBzdHJpa2VTdWNjZXNzIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g54aK5Ye75omT5oiQ5YqfXHJcbiAgICAgICAgdmFyIGFuaW1hdGlvbl9zID0gY2MuQW5pbWF0aW9uLmNyZWF0ZSgpO1xyXG4gICAgICAgIGFuaW1hdGlvbl9zLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnN0cmlrZV9zXzEpO1xyXG4gICAgICAgIGFuaW1hdGlvbl9zLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnN0cmlrZV9zXzIpO1xyXG4gICAgICAgIGFuaW1hdGlvbl9zLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnN0cmlrZV9zXzMpO1xyXG4gICAgICAgIGFuaW1hdGlvbl9zLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnN0cmlrZV9zXzQpO1xyXG4gICAgICAgIGFuaW1hdGlvbl9zLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnN0cmlrZV9zXzUpO1xyXG4gICAgICAgIGFuaW1hdGlvbl9zLnNldERlbGF5UGVyVW5pdCgwLjEpO1xyXG4gICAgICAgIHZhciBhbmltYXRlX3MgPSBjYy5BbmltYXRlLmNyZWF0ZShhbmltYXRpb25fcyk7XHJcbiAgICAgICAgdGhpcy5zdG9wQWxsQWN0aW9ucygpO1xyXG4gICAgICAgIHRoaXMucnVuQWN0aW9uKGFuaW1hdGVfcyk7XHJcbiAgICB9LFxyXG4gICAgc3RyaWtlRmFsbCA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIOeGiuWHu+aJk+Wksei0pVxyXG4gICAgICAgIHZhciBhbmltYXRpb25fZiA9IGNjLkFuaW1hdGlvbi5jcmVhdGUoKTtcclxuICAgICAgICBhbmltYXRpb25fZi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5zdHJpa2VfZl8xKTtcclxuICAgICAgICBhbmltYXRpb25fZi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5zdHJpa2VfZl8yKTtcclxuICAgICAgICBhbmltYXRpb25fZi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5zdHJpa2VfZl8zKTtcclxuICAgICAgICBhbmltYXRpb25fZi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5zdHJpa2VfZl80KTtcclxuICAgICAgICBhbmltYXRpb25fZi5zZXREZWxheVBlclVuaXQoMC4xKTtcclxuICAgICAgICB2YXIgYW5pbWF0ZV9mID0gY2MuQW5pbWF0ZS5jcmVhdGUoYW5pbWF0aW9uX2YpO1xyXG4gICAgICAgIHRoaXMuc3RvcEFsbEFjdGlvbnMoKTtcclxuICAgICAgICB0aGlzLnJ1bkFjdGlvbihhbmltYXRlX2YpO1xyXG4gICAgfSxcclxuICAgIGNoZWNrU3RyaWtlIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlY3QgPSBjYy5yZWN0KHRoaXMuZ2V0UG9zaXRpb25YKCktMjAsIHRoaXMuZ2V0UG9zaXRpb25ZKCktMTAsIDQwLCA3MCk7XHJcbiAgICAgICAgaWYoY2MucmVjdENvbnRhaW5zUG9pbnQocmVjdCwgY2MucCh0aGlzLnBlbmd1aW4uZ2V0UG9zaXRpb25YKCksIHRoaXMucGVuZ3Vpbi5nZXRQb3NpdGlvblkoKSkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGVuZ3Vpbi5zdG9wQWxsQWN0aW9ucygpO1xyXG4gICAgICAgICAgICB0aGlzLnBlbmd1aW4uZmx5QWZ0ZXJTdHJpa2UodGhpcy5yYXRlKTtcclxuICAgICAgICAgICAgdGhpcy5zdHJpa2VTdWNjZXNzKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHJpa2VGYWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLkJlYXJTcHJpdGUgPSBCZWFyU3ByaXRlOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHJlcyA9IHJlcXVpcmUoJy4vLi4vdWkvUmVzb3VyY2UuanMnKS5yZXM7XHJcbnZhciBCYWNrZ3JvdW5kTGF5ZXIgPSByZXF1aXJlKCcuL0JhY2tncm91bmRMYXllci5qcycpLkJhY2tncm91bmRMYXllcjtcclxudmFyIEJlYXJTcHJpdGUgPSByZXF1aXJlKCcuL0JlYXJTcHJpdGUuanMnKS5CZWFyU3ByaXRlO1xyXG52YXIgUGVuZ3VpblNwcml0ZSA9IHJlcXVpcmUoJy4vUGVuZ3VpblNwcml0ZS5qcycpLlBlbmd1aW5TcHJpdGU7XHJcblxyXG52YXIgVE9VQ0hfQ09VTlQgPSAwOyAgICAvLyDngrnlh7vmrKHmlbBcclxudmFyIFRvdWNoRXZlbnRMaXN0ZW5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcclxuICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUsXHJcbiAgICBzd2FsbG93VG91Y2hlczogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7mmK/lkKblkJ7msqHkuovku7bvvIzlnKggb25Ub3VjaEJlZ2FuIOaWueazlei/lOWbniB0cnVlIOaXtuWQnuayoVxyXG4gICAgb25Ub3VjaEJlZ2FuOiBmdW5jdGlvbiAodG91Y2gsIGV2ZW50KSB7ICAgICAvL+WunueOsCBvblRvdWNoQmVnYW4g5LqL5Lu25Zue6LCD5Ye95pWwXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG4gICAgb25Ub3VjaEVuZGVkOiBmdW5jdGlvbiAodG91Y2gsIGV2ZW50KSB7ICAgICAgICAgLy8g54K55Ye75LqL5Lu257uT5p2f5aSE55CGXHJcbiAgICAgICAgY2MubG9nKCdvblRvdWNoRW5kZWQnKTtcclxuXHJcbiAgICAgICAgVE9VQ0hfQ09VTlQrKztcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gZXZlbnQuZ2V0Q3VycmVudFRhcmdldCgpO1xyXG4gICAgICAgIC8vIOesrOS4gOasoeeCueWHu++8jOi/m+W6puadoeWBnOatouWIt+aWsO+8jOS8gem5heiHqueUseiQveS9k++8m+esrOS6jOasoeeCueWHu++8jOeGiuaMpeadhlxyXG4gICAgICAgIGlmKFRPVUNIX0NPVU5UID09IDEpIHtcclxuICAgICAgICAgICAgdmFyIHBlbmd1aW5MYXllciA9IHRhcmdldC5nZXRDaGlsZEJ5VGFnKDEwMyk7XHJcbiAgICAgICAgICAgIHZhciBwZW5ndWluU3ByaXRlID0gcGVuZ3VpbkxheWVyLmdldENoaWxkQnlUYWcoMTAzMSk7XHJcbiAgICAgICAgICAgIHBlbmd1aW5TcHJpdGUucGxheUZyZWVGYWxsKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYmFja2dyb3VuZExheWVyID0gdGFyZ2V0LmdldENoaWxkQnlUYWcoMTAwKTtcclxuICAgICAgICAgICAgdmFyIGJlYXJTcHJpdGUgPSBiYWNrZ3JvdW5kTGF5ZXIuZ2V0Q2hpbGRCeVRhZygxMDAxKTtcclxuICAgICAgICAgICAgYmVhclNwcml0ZS5yZWFkeUJhc2VCYWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKFRPVUNIX0NPVU5UID09IDIpIHtcclxuICAgICAgICAgICAgdmFyIGJhY2tncm91bmRMYXllciA9IHRhcmdldC5nZXRDaGlsZEJ5VGFnKDEwMCk7XHJcbiAgICAgICAgICAgIHZhciBiZWFyU3ByaXRlID0gYmFja2dyb3VuZExheWVyLmdldENoaWxkQnlUYWcoMTAwMSk7XHJcbiAgICAgICAgICAgIHZhciBwZW5ndWluTGF5ZXIgPSB0YXJnZXQuZ2V0Q2hpbGRCeVRhZygxMDMpO1xyXG4gICAgICAgICAgICB2YXIgcHJlc3NUaW1lciA9IHBlbmd1aW5MYXllci5nZXRDaGlsZEJ5VGFnKDEwMzIpO1xyXG4gICAgICAgICAgICBwcmVzc1RpbWVyLnN0b3BBbGxBY3Rpb25zKCk7XHJcbiAgICAgICAgICAgIHZhciBwZW5ndWluU3ByaXRlID0gcGVuZ3VpbkxheWVyLmdldENoaWxkQnlUYWcoMTAzMSk7XHJcbiAgICAgICAgICAgIGJlYXJTcHJpdGUucGxheUJhc2VCYWxsKHBlbmd1aW5TcHJpdGUsIHByZXNzVGltZXIuZ2V0UGVyY2VudGFnZSgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcblxyXG52YXIgR2FtZUxheWVyID0gY2MuTGF5ZXIuZXh0ZW5kKHtcclxuXHJcbiAgICB3aW5TaXplOiBjYy5TaXplKDQwMCwgMzAwKSxcclxuXHJcbiAgICBzaXplX2hlaWdodDogbnVsbCxcclxuICAgIHNpemVfd2lkdGg6IG51bGwsXHJcbiAgICBiYWNrZ3JvdW5kTGF5ZXIgOiBudWxsLFxyXG4gICAgcHJlc3NUaW1lciA6IG51bGwsXHJcbiAgICBtZW51X2xheWVyOiBudWxsLFxyXG4gICAgYmVhclNwcml0ZTogbnVsbCxcclxuICAgIHBlbmd1aW5TcHJpdGU6IG51bGwsXHJcblxyXG4gICAgY3RvcjpmdW5jdGlvbiAoc3BhY2UpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zaXplX2hlaWdodCA9IHRoaXMud2luU2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5zaXplX3dpZHRoID0gdGhpcy53aW5TaXplLndpZHRoO1xyXG5cclxuICAgICAgICAvLyDog4zmma9cclxuICAgICAgICB0aGlzLmJhY2tncm91bmRMYXllciA9IG5ldyBCYWNrZ3JvdW5kTGF5ZXIoKTtcclxuXHJcbiAgICAgICAgLy8g54aKXHJcbiAgICAgICAgdGhpcy5iZWFyU3ByaXRlID0gbmV3IEJlYXJTcHJpdGUoKTtcclxuICAgICAgICB0aGlzLmJlYXJTcHJpdGUuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuYmVhclNwcml0ZS5zZXRQb3NpdGlvbih0aGlzLnNpemVfd2lkdGggLSA3MCwgMTA1KTtcclxuICAgICAgICB0aGlzLmJlYXJTcHJpdGUudGFnID0gMTAwMTtcclxuXHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kTGF5ZXIud2luU2l6ZSA9IHRoaXMud2luU2l6ZTtcclxuICAgICAgICB0aGlzLmJhY2tncm91bmRMYXllci5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kTGF5ZXIuYWRkQ2hpbGQodGhpcy5iZWFyU3ByaXRlLCAxKTtcclxuICAgICAgICB0aGlzLmJhY2tncm91bmRMYXllci5iZ19hcnJheS5wdXNoKHRoaXMuYmVhclNwcml0ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5iYWNrZ3JvdW5kTGF5ZXIsIDAsIDEwMCk7XHJcblxyXG4gICAgICAgIC8vIOS8gem5hVxyXG4gICAgICAgIHRoaXMucGVuZ3VpblNwcml0ZSA9IG5ldyBQZW5ndWluU3ByaXRlKCk7XHJcbiAgICAgICAgdGhpcy5wZW5ndWluU3ByaXRlLmluaXQocmVzLnBlbmd1aW5fanVtcF8yKTtcclxuICAgICAgICB0aGlzLnBlbmd1aW5TcHJpdGUuc2V0UG9zaXRpb24odGhpcy5zaXplX3dpZHRoIC0gNTgsIHRoaXMuc2l6ZV9oZWlnaHQgLSA0NSk7XHJcbiAgICAgICAgdGhpcy5wZW5ndWluU3ByaXRlLnRhZyA9IDEwMzE7XHJcbiAgICAgICAgdmFyIHBlbmd1aW5MYXllciA9IGNjLkxheWVyLmNyZWF0ZSgpO1xyXG4gICAgICAgIHBlbmd1aW5MYXllci50YWcgPSAxMDM7XHJcbiAgICAgICAgcGVuZ3VpbkxheWVyLmFkZENoaWxkKHRoaXMucGVuZ3VpblNwcml0ZSwgMCk7XHJcblxyXG4gICAgICAgIC8vIOWKm+mHj+Wkp+Wwjyjov5vluqbmnaEpXHJcbiAgICAgICAgdGhpcy5wcmVzc1RpbWVyID0gY2MuUHJvZ3Jlc3NUaW1lci5jcmVhdGUoY2MuU3ByaXRlLmNyZWF0ZShyZXMuYnV0dG9uX2JvdHRvbV9wcmVzc2VkXzIpKTtcclxuICAgICAgICB0aGlzLnByZXNzVGltZXIuc2V0VHlwZShjYy5Qcm9ncmVzc1RpbWVyLlRZUEVfQkFSKTtcclxuICAgICAgICB0aGlzLnByZXNzVGltZXIuc2V0QmFyQ2hhbmdlUmF0ZShjYy5wKDAsIDEpKTsgIC8vIOWeguebtOi/m+W6puadoVxyXG4gICAgICAgIHRoaXMucHJlc3NUaW1lci5zZXRNaWRwb2ludChjYy5wKDEsIDApKTsgLy8g5LuO5LiL5ZCR5LiKXHJcbiAgICAgICAgdGhpcy5wcmVzc1RpbWVyLnNldEFuY2hvclBvaW50KDAsIDApO1xyXG4gICAgICAgIHRoaXMucHJlc3NUaW1lci5zZXRQb3NpdGlvbihjYy5wKDEwLCAyNSkpO1xyXG4gICAgICAgIHRoaXMucHJlc3NUaW1lci5ydW5BY3Rpb24oY2MuUmVwZWF0Rm9yZXZlci5jcmVhdGUoY2MuUHJvZ3Jlc3NUby5jcmVhdGUoMywgMTAwKSkpOyAgICAvLyDlnKg156eS5Yiw6L6+MTAwJe+8jOWNs+avj+enkjIwJVxyXG4gICAgICAgIHRoaXMucHJlc3NUaW1lci50YWcgPSAxMDMyO1xyXG4gICAgICAgIHBlbmd1aW5MYXllci5hZGRDaGlsZCh0aGlzLnByZXNzVGltZXIsIDEpO1xyXG4gICAgICAgIHZhciBwcmVzc1RpbWVyQm90dG9tID0gY2MuU3ByaXRlLmNyZWF0ZShyZXMuYnV0dG9uX2JvdHRvbV9wcmVzc2VkXzMpO1xyXG4gICAgICAgIHByZXNzVGltZXJCb3R0b20uc2V0QW5jaG9yUG9pbnQoMCwgMCk7XHJcbiAgICAgICAgcHJlc3NUaW1lckJvdHRvbS5zZXRQb3NpdGlvbigxMCwgMjUpO1xyXG4gICAgICAgIHBlbmd1aW5MYXllci5hZGRDaGlsZChwcmVzc1RpbWVyQm90dG9tLCAxKTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHBlbmd1aW5MYXllciwgMik7XHJcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKFRvdWNoRXZlbnRMaXN0ZW5lciwgdGhpcyk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgZGlzcGxheU1lbnU6IGZ1bmN0aW9uKHNjb3JlKSB7XHJcbiAgICAgICAgVE9VQ0hfQ09VTlQgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLmdldENoaWxkQnlUYWcoMTAzKS5nZXRDaGlsZEJ5VGFnKDEwMzIpLnN0b3BBbGxBY3Rpb25zKCk7XHJcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnJlbW92ZUFsbExpc3RlbmVycygpO1xyXG4gICAgICAgIC8vIOa4uOaIj+e7k+adn+WQjuaYvuekuuiPnOWNlVxyXG4gICAgICAgIHNjb3JlID0gc2NvcmUgfHwgMDtcclxuICAgICAgICBpZihzY29yZSA+IDApIHtcclxuLy8gICAgICAgICAgICBkcF9zdWJtaXRTY29yZSgwLHNjb3JlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tZW51X2xheWVyID0gY2MuTGF5ZXIuY3JlYXRlKCk7XHJcbiAgICAgICAgdGhpcy5tZW51X2xheWVyLnRhZyA9IDEwNDtcclxuICAgICAgICB2YXIgc2NvcmVfbGFiZWwgPSBjYy5MYWJlbFRURi5jcmVhdGUoXCLlvpfliIY6IFwiICsgc2NvcmUsIFwiQXJpYWxcIiwgMjApO1xyXG4gICAgICAgIHNjb3JlX2xhYmVsLnNldFBvc2l0aW9uKHRoaXMuc2l6ZV93aWR0aC8yLCB0aGlzLnNpemVfaGVpZ2h0LzIgKyA4MCk7XHJcbiAgICAgICAgc2NvcmVfbGFiZWwuc2V0Q29sb3IoY2MuY29sb3IoMzksIDY0LCAxMzksIDApKTtcclxuXHJcbiAgICAgICAgdmFyIG1vcmVfc3ByaXRlID0gY2MuU3ByaXRlLmNyZWF0ZShyZXMuYnV0dG9uX21vcmVfZ2FtZSk7XHJcbiAgICAgICAgdmFyIG1vcmVfbWVudUl0ZW0gPSBjYy5NZW51SXRlbVNwcml0ZS5jcmVhdGUobW9yZV9zcHJpdGUsIG51bGwsIG51bGwsdGhpcy5jbGlja19tb3JlR2FtZSwgdGhpcyk7XHJcbiAgICAgICAgdmFyIHJldHJ5X3Nwcml0ZSA9IGNjLlNwcml0ZS5jcmVhdGUocmVzLmJ1dHRvbl9yZXRyeSk7XHJcbiAgICAgICAgdmFyIHJldHJ5X21lbnVJdGVtID0gY2MuTWVudUl0ZW1TcHJpdGUuY3JlYXRlKHJldHJ5X3Nwcml0ZSwgbnVsbCwgbnVsbCx0aGlzLmNsaWNrX3JldHJ5LCB0aGlzKTtcclxuICAgICAgICB2YXIgbWVudSA9IGNjLk1lbnUuY3JlYXRlKG1vcmVfbWVudUl0ZW0sIHJldHJ5X21lbnVJdGVtKTtcclxuICAgICAgICBtZW51LmFsaWduSXRlbXNIb3Jpem9udGFsbHlXaXRoUGFkZGluZygyMCk7XHJcbiAgICAgICAgbWVudS5hdHRyKHtcclxuICAgICAgICAgICAgeCA6IHRoaXMuc2l6ZV93aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIHkgOiB0aGlzLnNpemVfaGVpZ2h0IC8gMlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMubWVudV9sYXllci5hZGRDaGlsZChzY29yZV9sYWJlbCwgMCk7XHJcbiAgICAgICAgdGhpcy5tZW51X2xheWVyLmFkZENoaWxkKG1lbnUsIDApO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5tZW51X2xheWVyLCAzKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2tfbW9yZUdhbWU6IGZ1bmN0aW9uKCkge1xyXG4vLyAgICAgICAgZHBfUmFua2luZyhcIm1vcmVnYW1lXCIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGlja19yZXRyeTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5tZW51X2xheWVyLnNldFZpc2libGUoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMucHJlc3NUaW1lci5zZXRQZXJjZW50YWdlKDApO1xyXG4gICAgICAgIHRoaXMucHJlc3NUaW1lci5ydW5BY3Rpb24oY2MuUmVwZWF0Rm9yZXZlci5jcmVhdGUoY2MuUHJvZ3Jlc3NUby5jcmVhdGUoMywgMTAwKSkpO1xyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZExheWVyLmluaXQoKTtcclxuICAgICAgICB0aGlzLmJlYXJTcHJpdGUuc2V0UG9zaXRpb24odGhpcy5zaXplX3dpZHRoIC0gNzAsIDEwNSk7XHJcbiAgICAgICAgdGhpcy5iZWFyU3ByaXRlLmluaXQoKTtcclxuICAgICAgICB0aGlzLmJhY2tncm91bmRMYXllci5hZGRDaGlsZCh0aGlzLmJlYXJTcHJpdGUsIDEpO1xyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZExheWVyLmJnX2FycmF5LnB1c2godGhpcy5iZWFyU3ByaXRlKTtcclxuICAgICAgICB0aGlzLnBlbmd1aW5TcHJpdGUuc2V0UG9zaXRpb24odGhpcy5zaXplX3dpZHRoIC0gNTgsIHRoaXMuc2l6ZV9oZWlnaHQgLSA0NSk7XHJcbiAgICAgICAgdGhpcy5wZW5ndWluU3ByaXRlLnJlX3N0YW5kKCk7XHJcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKFRvdWNoRXZlbnRMaXN0ZW5lciwgdGhpcyk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0cy5HYW1lTGF5ZXIgPSBHYW1lTGF5ZXI7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgRnJlZUZhbGxBY3Rpb24gPSByZXF1aXJlKCcuLy4uL3VpL0ZyZWVGYWxsQWN0aW9uLmpzJykuRnJlZUZhbGxBY3Rpb247XHJcbnZhciByZXMgPSByZXF1aXJlKCcuLy4uL3VpL1Jlc291cmNlLmpzJykucmVzO1xyXG5cclxudmFyIFBlbmd1aW5TcHJpdGUgPSBjYy5TcHJpdGUuZXh0ZW5kKHtcclxuICAgIGxhbmRpbmdfWSA6IG51bGwsXHJcbiAgICBwX3JlZmVyZW5jZSA6IG51bGwsXHJcbiAgICB2X2ZyaWN0aW9uIDogbnVsbCxcclxuICAgIGhfZnJpY3Rpb24gOiBudWxsLFxyXG4gICAgcmF0ZV9YIDogbnVsbCxcclxuICAgIHJhdGVfWSA6IG51bGwsXHJcbiAgICBtb3ZlX3RpbWUgOiBudWxsLFxyXG4gICAgY3VycmVudF9YIDogbnVsbCxcclxuICAgIGN1cnJlbnRfWSA6IG51bGwsXHJcbiAgICBzdGFydF9YIDogbnVsbCxcclxuICAgIHN0YXJ0X1kgOiBudWxsLFxyXG4gICAgc3RhcnRfcG9pbnRfWDogbnVsbCxcclxuICAgIG1pbGVzdG9uZV9udW1iZXI6IG51bGwsXHJcbiAgICBjdG9yIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmxhbmRpbmdfWSA9IDc1OyAgICAvLyDlnLDpnaLpq5jluqZcclxuICAgICAgICB0aGlzLnBfcmVmZXJlbmNlID0gY2MucCg0NTAsIDEzMCk7ICAgLy8g5Ye75omT5aSE5Y+C6ICD54K5XHJcbiAgICAgICAgdGhpcy5oX2ZyaWN0aW9uID0gNTA7ICAgIC8vIOawtOW5s+WHj+mAn+ezu+aVsFxyXG4gICAgICAgIHRoaXMudl9mcmljdGlvbiA9IDUwOyAgICAvLyDlnoLnm7Tlh4/pgJ/ns7vmlbBcclxuICAgICAgICB0aGlzLnJhdGVfWCA9IDA7ICAgIC8vIOS8gem5heawtOW5s+mAn+W6plxyXG4gICAgICAgIHRoaXMucmF0ZV9ZID0gMDsgICAgLy8g5LyB6bmF5Z6C55u06YCf5bqmXHJcbiAgICAgICAgdGhpcy50aW1lX2ludGVydmFsID0gMC4xOyAgIC8vICDkvIHpuYXpo57ml7bliLfmlrDml7bpl7Tpl7TpmpRcclxuICAgICAgICB0aGlzLm1pbGVzdG9uZV9udW1iZXIgPSAxO1xyXG4gICAgfSxcclxuICAgIGluaXQgOiBmdW5jdGlvbihyZXNfaW1hZykge1xyXG5cclxuICAgICAgICB0aGlzLmluaXRXaXRoRmlsZShyZXNfaW1hZyk7XHJcbiAgICB9LFxyXG4gICAgcmVfc3RhbmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIOS8gem5hemHjeaWsOS4iuWPsFxyXG4gICAgICAgIHRoaXMubWlsZXN0b25lX251bWJlciA9IDE7XHJcbiAgICAgICAgdGhpcy5zZXRSb3RhdGlvbigwKTtcclxuICAgICAgICB2YXIgYW5pbWF0aW9uID0gY2MuQW5pbWF0aW9uLmNyZWF0ZSgpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5wZW5ndWluX3N0ZXBfbGVmdF8xKTtcclxuICAgICAgICBhbmltYXRpb24uYWRkU3ByaXRlRnJhbWVXaXRoRmlsZShyZXMucGVuZ3Vpbl9zdGVwX2xlZnRfMik7XHJcbiAgICAgICAgYW5pbWF0aW9uLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnBlbmd1aW5fc3RlcF9sZWZ0XzMpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5wZW5ndWluX3N0ZXBfcmlnaHRfMSk7XHJcbiAgICAgICAgYW5pbWF0aW9uLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnBlbmd1aW5fc3RlcF9yaWdodF8yKTtcclxuICAgICAgICBhbmltYXRpb24uYWRkU3ByaXRlRnJhbWVXaXRoRmlsZShyZXMucGVuZ3Vpbl9zdGVwX3JpZ2h0XzMpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5wZW5ndWluX2lkbGUpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5wZW5ndWluX2p1bXBfMSk7XHJcbiAgICAgICAgYW5pbWF0aW9uLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnBlbmd1aW5fanVtcF8yKTtcclxuICAgICAgICBhbmltYXRpb24uc2V0RGVsYXlQZXJVbml0KDAuMSk7IC8vIOavj+malDAuMeenkuaSreaUvuS4gOW4p1xyXG4gICAgICAgIHZhciBhbmltYXRlID0gY2MuQW5pbWF0ZS5jcmVhdGUoYW5pbWF0aW9uKTtcclxuICAgICAgICB0aGlzLnJ1bkFjdGlvbihhbmltYXRlKTtcclxuICAgIH0sXHJcbiAgICBwbGF5RnJlZUZhbGwgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnN0b3BBbGxBY3Rpb25zKCk7XHJcbiAgICAgICAgLy8g5LyB6bmF5LiL6JC95pe25YeG5aSH5Yqo55S7XHJcbiAgICAgICAgdmFyIGFuaW1hdGlvbiA9IGNjLkFuaW1hdGlvbi5jcmVhdGUoKTtcclxuICAgICAgICBhbmltYXRpb24uYWRkU3ByaXRlRnJhbWVXaXRoRmlsZShyZXMucGVuZ3Vpbl9qdW1wXzMpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5wZW5ndWluX2p1bXBfNCk7XHJcbiAgICAgICAgYW5pbWF0aW9uLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnBlbmd1aW5fanVtcF81KTtcclxuICAgICAgICBhbmltYXRpb24uYWRkU3ByaXRlRnJhbWVXaXRoRmlsZShyZXMucGVuZ3Vpbl9qdW1wXzYpO1xyXG4gICAgICAgIGFuaW1hdGlvbi5zZXREZWxheVBlclVuaXQoMC4xKTsgLy8g5q+P6ZqUMC4x56eS5pKt5pS+5LiA5binXHJcbiAgICAgICAgdmFyIGFuaW1hdGUgPSBjYy5BbmltYXRlLmNyZWF0ZShhbmltYXRpb24pO1xyXG4gICAgICAgIC8vIOiHqueUseiQveS9k+WKqOeUu1xyXG4gICAgICAgIHZhciBmcmVlRmFsbEFjdGlvbiA9IEZyZWVGYWxsQWN0aW9uLmNyZWF0ZSh0aGlzLmdldFBvc2l0aW9uWSgpIC0gNzUpO1xyXG4gICAgICAgIC8vIOWQiOW5tuWKqOeUu+W6j+WIl1xyXG4gICAgICAgIHRoaXMucnVuQWN0aW9uKGNjLlNlcXVlbmNlLmNyZWF0ZShbYW5pbWF0ZSwgZnJlZUZhbGxBY3Rpb25dKSk7XHJcbiAgICB9LFxyXG4gICAgZmx5QWZ0ZXJTdHJpa2UgOiBmdW5jdGlvbihyYXRlKSB7XHJcbiAgICAgICAgdGhpcy5mbHlfYW5pbWF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudF9YID0gdGhpcy5zdGFydF9YID0gdGhpcy5zdGFydF9wb2ludF9YID0gdGhpcy5nZXRQb3NpdGlvblgoKTsgICAvLyBY6L205Z2Q5qCHXHJcbiAgICAgICAgdGhpcy5jdXJyZW50X1kgPSB0aGlzLnN0YXJ0X1kgPSB0aGlzLmdldFBvc2l0aW9uWSgpOyAgIC8vIFnovbTlnZDmoIdcclxuICAgICAgICB0aGlzLmRpdmlkZV9yYXRlKHJhdGUgKiAyMCk7ICAgIC8vIOiuvue9rumAn+W6puaUvuWkp+WAjeaVsFxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5vbl90aWNrLCB0aGlzLnRpbWVfaW50ZXJ2YWwpO1xyXG4gICAgfSxcclxuICAgIGxhbmRpbmdfdmVydGljYWwgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDlnoLnm7TlgZzkuIvmnaVcclxuICAgICAgICB2YXIgYW5pbWF0aW9uX3ZlcnRpY2FsID0gY2MuQW5pbWF0aW9uLmNyZWF0ZSgpO1xyXG4gICAgICAgIGFuaW1hdGlvbl92ZXJ0aWNhbC5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5wZW5ndWluX3ZlcnRpY2FsX2xhbmRpbmdfMSk7XHJcbiAgICAgICAgYW5pbWF0aW9uX3ZlcnRpY2FsLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnBlbmd1aW5fdmVydGljYWxfbGFuZGluZ18yKTtcclxuICAgICAgICBhbmltYXRpb25fdmVydGljYWwuYWRkU3ByaXRlRnJhbWVXaXRoRmlsZShyZXMucGVuZ3Vpbl92ZXJ0aWNhbF9sYW5kaW5nXzMpO1xyXG4gICAgICAgIGFuaW1hdGlvbl92ZXJ0aWNhbC5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5wZW5ndWluX3ZlcnRpY2FsX2xhbmRpbmdfNCk7XHJcbiAgICAgICAgYW5pbWF0aW9uX3ZlcnRpY2FsLnNldERlbGF5UGVyVW5pdCgwLjEpO1xyXG4gICAgICAgIHZhciBhbmltYXRlX3ZlcnRpY2FsID0gY2MuQW5pbWF0ZS5jcmVhdGUoYW5pbWF0aW9uX3ZlcnRpY2FsKTtcclxuICAgICAgICB0aGlzLnJ1bkFjdGlvbihhbmltYXRlX3ZlcnRpY2FsKTtcclxuICAgICAgICB0aGlzLmdldFBhcmVudCgpLmdldFBhcmVudCgpLmRpc3BsYXlNZW51KCk7XHJcbiAgICB9LFxyXG4gICAgbGFuZGluZ19ob3Jpem9uIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wQWxsQWN0aW9ucygpO1xyXG4gICAgICAgIC8vIOawtOW5s+WBnOS4i+adpVxyXG4gICAgICAgIHZhciBhbmltYXRpb25fbGFuZGluZyA9IGNjLkFuaW1hdGlvbi5jcmVhdGUoKTtcclxuICAgICAgICBhbmltYXRpb25fbGFuZGluZy5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5wZW5ndWluX2xhbmRpbmdfMSk7XHJcbiAgICAgICAgYW5pbWF0aW9uX2xhbmRpbmcuYWRkU3ByaXRlRnJhbWVXaXRoRmlsZShyZXMucGVuZ3Vpbl9sYW5kaW5nXzIpO1xyXG4gICAgICAgIGFuaW1hdGlvbl9sYW5kaW5nLmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnBlbmd1aW5fbGFuZGluZ18zKTtcclxuICAgICAgICBhbmltYXRpb25fbGFuZGluZy5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5wZW5ndWluX2xhbmRpbmdfNCk7XHJcbiAgICAgICAgYW5pbWF0aW9uX2xhbmRpbmcuc2V0RGVsYXlQZXJVbml0KDAuMSk7IC8vIOavj+malDAuMeenkuaSreaUvuS4gOW4p1xyXG4gICAgICAgIHZhciBhbmltYXRlX2xhbmRpbmcgPSBjYy5BbmltYXRlLmNyZWF0ZShhbmltYXRpb25fbGFuZGluZyk7XHJcbiAgICAgICAgdGhpcy5ydW5BY3Rpb24oYW5pbWF0ZV9sYW5kaW5nKTtcclxuICAgICAgICB0aGlzLnVuc2NoZWR1bGVBbGxDYWxsYmFja3MoKTtcclxuICAgICAgICB2YXIgZ2FtZUxheWVyID0gdGhpcy5nZXRQYXJlbnQoKS5nZXRQYXJlbnQoKTtcclxuICAgICAgICBnYW1lTGF5ZXIuZGlzcGxheU1lbnUodGhpcy5jYWxjdWxhdGVfc2NvcmUoKSk7XHJcbiAgICB9LFxyXG4gICAgZmx5X2FuaW1hdGUgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnN0b3BBbGxBY3Rpb25zKCk7XHJcbiAgICAgICAgLy8g6aOeXHJcbiAgICAgICAgdmFyIGFuaW1hdGlvbl9mbHkgPSBjYy5BbmltYXRpb24uY3JlYXRlKCk7XHJcbiAgICAgICAgYW5pbWF0aW9uX2ZseS5hZGRTcHJpdGVGcmFtZVdpdGhGaWxlKHJlcy5wZW5ndWluX2ZseV8xKTtcclxuICAgICAgICBhbmltYXRpb25fZmx5LmFkZFNwcml0ZUZyYW1lV2l0aEZpbGUocmVzLnBlbmd1aW5fZmx5XzIpO1xyXG4gICAgICAgIGFuaW1hdGlvbl9mbHkuYWRkU3ByaXRlRnJhbWVXaXRoRmlsZShyZXMucGVuZ3Vpbl9mbHlfMyk7XHJcbiAgICAgICAgYW5pbWF0aW9uX2ZseS5zZXREZWxheVBlclVuaXQoMC4xKTsgLy8g5q+P6ZqUMC4x56eS5pKt5pS+5LiA5binXHJcbiAgICAgICAgdmFyIGFuaW1hdGVfZmx5ID0gY2MuQW5pbWF0ZS5jcmVhdGUoYW5pbWF0aW9uX2ZseSk7XHJcbiAgICAgICAgdGhpcy5ydW5BY3Rpb24oY2MuUmVwZWF0Rm9yZXZlci5jcmVhdGUoYW5pbWF0ZV9mbHkpKTtcclxuICAgIH0sXHJcbiAgICBhZGRfYmxhY2tfbGFuZGluZyA6IGZ1bmN0aW9uKHgpIHtcclxuICAgICAgICAvLyDlnKjokL3lnLDngrnmt7vliqDpu5HoibLmoIforrBcclxuICAgICAgICB2YXIgYmFja2dyb3VuZExheWVyID0gdGhpcy5nZXRQYXJlbnQoKS5nZXRQYXJlbnQoKS5nZXRDaGlsZEJ5VGFnKDEwMCk7XHJcbiAgICAgICAgdmFyIGJsYWNrX2xhbmRpbmcgPSBjYy5TcHJpdGUuY3JlYXRlKHJlcy5wZW5ndWluX25pY2spO1xyXG4gICAgICAgIGJsYWNrX2xhbmRpbmcuc2V0UG9zaXRpb24oeCwgdGhpcy5sYW5kaW5nX1ktMTApO1xyXG4gICAgICAgIGJhY2tncm91bmRMYXllci5hZGRDaGlsZChibGFja19sYW5kaW5nLCAxKTtcclxuICAgICAgICBiYWNrZ3JvdW5kTGF5ZXIuYmdfYXJyYXkucHVzaChibGFja19sYW5kaW5nKTtcclxuICAgIH0sXHJcbiAgICBvbl90aWNrIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5tb3ZlX1goKTtcclxuICAgICAgICB0aGlzLm1vdmVfWSgpO1xyXG4gICAgICAgIGlmKHRoaXMuZ2V0UG9zaXRpb25YKCkgPD0gNzUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRQb3NpdGlvbig3NSwgdGhpcy5jdXJyZW50X1kpO1xyXG4gICAgICAgICAgICB2YXIgYmFja2dyb3VuZExheWVyID0gdGhpcy5nZXRQYXJlbnQoKS5nZXRQYXJlbnQoKS5nZXRDaGlsZEJ5VGFnKDEwMCk7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmRMYXllci5tb3ZlX1Nwcml0ZShNYXRoLmFicyh0aGlzLmN1cnJlbnRfWCAtIHRoaXMuc3RhcnRfWCkpO1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguYWJzKHRoaXMuY3VycmVudF9YIC0gdGhpcy5zdGFydF9wb2ludF9YKTtcclxuICAgICAgICAgICAgaWYocGFyc2VJbnQoZCAvIDUwMCkgPT09IHRoaXMubWlsZXN0b25lX251bWJlcikge1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZExheWVyLmxvYWRfbWlsZXN0b25lKHRoaXMubWlsZXN0b25lX251bWJlciAqIDUwMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pbGVzdG9uZV9udW1iZXIrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRQb3NpdGlvblkoKSA8PSB0aGlzLmxhbmRpbmdfWSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzLnJhdGVfWCA+PSAoLXRoaXMuaF9mcmljdGlvbiAvIDUpKSAmJiAodGhpcy5yYXRlX1kgPj0gLXRoaXMudl9mcmljdGlvbiAmJiB0aGlzLnJhdGVfWSA8PSB0aGlzLnZfZnJpY3Rpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYW5kaW5nX2hvcml6b24oKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZF9ibGFja19sYW5kaW5nKDc1KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRfYmxhY2tfbGFuZGluZyg3NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYXRlX1kgPSAtdGhpcy5yYXRlX1kgLSB0aGlzLnZfZnJpY3Rpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFJvdGF0aW9uKDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQb3NpdGlvblkodGhpcy5sYW5kaW5nX1kpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSb3RhdGlvbih0aGlzLmNhbGN1bGF0ZV9yb3RhdGlvbigpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmx5X2FuaW1hdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5jdXJyZW50X1gsIHRoaXMuY3VycmVudF9ZKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0UG9zaXRpb25ZKCkgPD0gdGhpcy5sYW5kaW5nX1kpIHtcclxuICAgICAgICAgICAgICAgIGlmICgodGhpcy5yYXRlX1ggPj0gKC10aGlzLmhfZnJpY3Rpb24gLyA1KSkgJiYgKHRoaXMucmF0ZV9ZID49IC10aGlzLnZfZnJpY3Rpb24gJiYgdGhpcy5yYXRlX1kgPD0gdGhpcy52X2ZyaWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFuZGluZ19ob3Jpem9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRfYmxhY2tfbGFuZGluZyh0aGlzLmN1cnJlbnRfWCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkX2JsYWNrX2xhbmRpbmcodGhpcy5jdXJyZW50X1gpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmF0ZV9ZID0gLXRoaXMucmF0ZV9ZIC0gdGhpcy52X2ZyaWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSb3RhdGlvbigwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb25ZKHRoaXMubGFuZGluZ19ZKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Um90YXRpb24odGhpcy5jYWxjdWxhdGVfcm90YXRpb24oKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZseV9hbmltYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGFydF9YID0gdGhpcy5jdXJyZW50X1g7XHJcbiAgICAgICAgdGhpcy5zdGFydF9ZID0gdGhpcy5jdXJyZW50X1k7XHJcbiAgICB9LFxyXG4gICAgZGl2aWRlX3JhdGUgOiBmdW5jdGlvbihyYXRlKSB7XHJcbiAgICAgICAgLy8g5YiG6Kej5Yid5aeL6YCf5bqmKOato+aWueWQkeS7pWNvY29zMmTnmoTlnZDmoIfovbTkuLrlh4YpXHJcbiAgICAgICAgLy8gWOWIhumHj+Wni+e7iOS4uui0n1xyXG4gICAgICAgIHZhciBjID0gTWF0aC5zcXJ0KCh0aGlzLnBfcmVmZXJlbmNlLnggLSB0aGlzLmdldFBvc2l0aW9uWCgpKSoodGhpcy5wX3JlZmVyZW5jZS54IC0gdGhpcy5nZXRQb3NpdGlvblgoKSkgKyAodGhpcy5wX3JlZmVyZW5jZS55IC0gdGhpcy5nZXRQb3NpdGlvblkoKSkqKHRoaXMucF9yZWZlcmVuY2UueSAtIHRoaXMuZ2V0UG9zaXRpb25ZKCkpKTtcclxuICAgICAgICB0aGlzLnJhdGVfWCA9IC1yYXRlICogKHRoaXMucF9yZWZlcmVuY2UueCAtIHRoaXMuZ2V0UG9zaXRpb25YKCkpL2M7XHJcbiAgICAgICAgLy8gWeWIhumHj+WPr+iDveS4uuatoyzlj6/og73kuLrotJ9cclxuICAgICAgICB0aGlzLnJhdGVfWSA9IHJhdGUgKiAodGhpcy5nZXRQb3NpdGlvblkoKS10aGlzLnBfcmVmZXJlbmNlLnkpL2M7XHJcbiAgICB9LFxyXG4gICAgbW92ZV9YIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g5rC05bmz6L+Q5YqoXHJcbiAgICAgICAgdGhpcy5jdXJyZW50X1ggPSB0aGlzLnN0YXJ0X1ggKyB0aGlzLnJhdGVfWCAqIHRoaXMudGltZV9pbnRlcnZhbDtcclxuICAgICAgICBpZih0aGlzLnJhdGVfWCA8ICgtdGhpcy5oX2ZyaWN0aW9uLzUpKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ2V0UG9zaXRpb25ZKCkgPiB0aGlzLmxhbmRpbmdfWSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYXRlX1ggKz0gdGhpcy5oX2ZyaWN0aW9uIC8gMTA7IC8vIOawtOW5s+m7mOiupOWHj+mAn+W5heW6plxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYXRlX1ggKz0gdGhpcy5oX2ZyaWN0aW9uOyAvLyDmk6blnLDml7blh4/pgJ9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb3ZlX1kgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDlnoLnm7Tov5DliqhcclxuICAgICAgICB0aGlzLmN1cnJlbnRfWSA9IHRoaXMuc3RhcnRfWSArIHRoaXMucmF0ZV9ZICogdGhpcy50aW1lX2ludGVydmFsO1xyXG4gICAgICAgIGlmKHRoaXMucmF0ZV9ZID4gdGhpcy52X2ZyaWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmF0ZV9ZIC09IHRoaXMudl9mcmljdGlvbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJhdGVfWSAtPSB0aGlzLnZfZnJpY3Rpb24gLyA1O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjYWxjdWxhdGVfc2NvcmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIOiuoeeul+WIhuaVsFxyXG4gICAgICAgIHJldHVybiBwYXJzZUludChNYXRoLmFicyh0aGlzLmN1cnJlbnRfWCAtIHRoaXMuc3RhcnRfcG9pbnRfWCkpO1xyXG4gICAgfSxcclxuICAgIGNhbGN1bGF0ZV9yb3RhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFuZ2xlID0gLU1hdGguYXRhbjIodGhpcy5yYXRlX1gsIHRoaXMucmF0ZV9ZKTtcclxuICAgICAgICBhbmdsZSA9IDkwIC0gYW5nbGUgKiAoMTgwL01hdGguUEkpO1xyXG4gICAgICAgIHJldHVybiBhbmdsZTtcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuUGVuZ3VpblNwcml0ZSA9IFBlbmd1aW5TcHJpdGU7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xyXG52YXIgU2NlbmVNZWRpYXRvciA9IHJlcXVpcmUoJy4vU2NlbmVNZWRpYXRvci5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3ZpZXcubWVkaWF0b3IuRGlyZWN0b3JNZWRpYXRvcicsXHJcbiAgICAgICAgcGFyZW50OiBwdXJlbXZjLk1lZGlhdG9yLFxyXG4gICAgICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcHVyZW12Yy5NZWRpYXRvci5jYWxsKHRoaXMsIHRoaXMuY29uc3RydWN0b3IuTkFNRSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgbGlzdE5vdGlmaWNhdGlvbkludGVyZXN0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgJ1NDRU5FX0NIQU5HRUQnXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIGhhbmRsZU5vdGlmaWNhdGlvbjogZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG5vdGlmaWNhdGlvbi5nZXROYW1lKCkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1NDRU5FX0NIQU5HRUQnOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vY2MubG9nKCdTQ0VORV9DSEFOR0VEJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY2VuZU1lZGlhdG9yID0gdGhpcy5mYWNhZGUucmV0cmlldmVNZWRpYXRvcihTY2VuZU1lZGlhdG9yLk5BTUUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2NlbmVNZWRpYXRvciAmJiBzY2VuZU1lZGlhdG9yLmdldFZpZXdDb21wb25lbnQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5ydW5TY2VuZShuZXcgY2MuVHJhbnNpdGlvbkZhZGUoMS4yLCBzY2VuZU1lZGlhdG9yLmdldFZpZXdDb21wb25lbnQoKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgb25SZWdpc3RlcjogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIG9uUmVtb3ZlOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdEaXJlY3Rvck1lZGlhdG9yJ1xyXG4gICAgfVxyXG4pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XHJcbnZhciBHYW1lTGF5ZXIgPSByZXF1aXJlKCcuLy4uL2NvbXBvbmVudC9HYW1lTGF5ZXIuanMnKS5HYW1lTGF5ZXI7XHJcbnZhciBTY2VuZUFjdGlvbiA9IHJlcXVpcmUoJy4vLi4vLi4vcHJvZmlsZS9mbG93L1NjZW5lQWN0aW9uLmpzJykuU2NlbmVBY3Rpb247XHJcbnZhciBHYW1lUHJveHkgPSByZXF1aXJlKCcuLy4uLy4uL21vZGVsL3Byb3h5L0dhbWVQcm94eS5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3ZpZXcubWVkaWF0b3IuR2FtZU1lZGlhdG9yJyxcclxuICAgICAgICBwYXJlbnQ6IHB1cmVtdmMuTWVkaWF0b3IsXHJcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBwdXJlbXZjLk1lZGlhdG9yLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBfZ2FtZVByb3h5OiBudWxsLFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgbGlzdE5vdGlmaWNhdGlvbkludGVyZXN0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gWyBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBoYW5kbGVOb3RpZmljYXRpb246IGZ1bmN0aW9uIChub3RlKSB7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVQcm94eSAgPSB0aGlzLmZhY2FkZS5yZXRyaWV2ZVByb3h5KEdhbWVQcm94eS5OQU1FKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgb25SZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50ID0gbmV3IEdhbWVMYXllcigpO1xyXG4gICAgICAgICAgICBzZWxmLnZpZXdDb21wb25lbnQud2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5pbml0KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50ID0gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFJlc291cmNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfSxcclxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgTkFNRTogJ0dhbWVNZWRpYXRvcidcclxuICAgIH1cclxuKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xyXG52YXIgR2VuZUNvY29zSlMgPSByZXF1aXJlKCdHZW5lQ29jb3NKUycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3ZpZXcubWVkaWF0b3IuU2NlbmVNZWRpYXRvcicsXHJcbiAgICAgICAgcGFyZW50OiBwdXJlbXZjLk1lZGlhdG9yLFxyXG4gICAgICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHB1cmVtdmMuTWVkaWF0b3IuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIF9pbml0aWFsaXplZDogZmFsc2UsXHJcblxyXG4gICAgICAgIGxvYWRlckltYWdlOiBcImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRRQVlSWGhwWmdBQVNVa3FBQWdBQUFBQUFBQUFBQUFBQVAvc0FCRkVkV05yZVFBQkFBUUFBQUFsQUFELzRRTXBhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMd0E4UDNod1lXTnJaWFFnWW1WbmFXNDlJdSs3dnlJZ2FXUTlJbGMxVFRCTmNFTmxhR2xJZW5KbFUzcE9WR042YTJNNVpDSS9QaUE4ZURwNGJYQnRaWFJoSUhodGJHNXpPbmc5SW1Ga2IySmxPbTV6T20xbGRHRXZJaUI0T25odGNIUnJQU0pCWkc5aVpTQllUVkFnUTI5eVpTQTFMakF0WXpBMk1DQTJNUzR4TXpRM056Y3NJREl3TVRBdk1ESXZNVEl0TVRjNk16STZNREFnSUNBZ0lDQWdJQ0krSUR4eVpHWTZVa1JHSUhodGJHNXpPbkprWmowaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1UazVPUzh3TWk4eU1pMXlaR1l0YzNsdWRHRjRMVzV6SXlJK0lEeHlaR1k2UkdWelkzSnBjSFJwYjI0Z2NtUm1PbUZpYjNWMFBTSWlJSGh0Ykc1ek9uaHRjRTFOUFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdmJXMHZJaUI0Yld4dWN6cHpkRkpsWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wzTlVlWEJsTDFKbGMyOTFjbU5sVW1WbUl5SWdlRzFzYm5NNmVHMXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2SWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2pNNE1EQkVNRFkyUVRVMU1qRXhSVEZCUVRBelFqRXpNVU5GTnpNeFJrUXdJaUI0YlhCTlRUcEpibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPak00TURCRU1EWTFRVFUxTWpFeFJURkJRVEF6UWpFek1VTkZOek14UmtRd0lpQjRiWEE2UTNKbFlYUnZjbFJ2YjJ3OUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFV6VWdWMmx1Wkc5M2N5SStJRHg0YlhCTlRUcEVaWEpwZG1Wa1JuSnZiU0J6ZEZKbFpqcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPa1UyUlRrME9FTTRPRVJDTkRFeFJURTVORVV5UmtFM00wTTNRa0UxTlRsRUlpQnpkRkpsWmpwa2IyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09rVTJSVGswT0VNNU9FUkNOREV4UlRFNU5FVXlSa0UzTTBNM1FrRTFOVGxFSWk4K0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4Ky8rNEFEa0ZrYjJKbEFHVEFBQUFBQWYvYkFJUUFEUWtKQ1FvSkRRb0tEUk1NQ3d3VEZoRU5EUkVXR2hVVkZoVVZHaGtVRmhVVkZoUVpHUjBmSUI4ZEdTY25LaW9uSnprNE9EZzVRRUJBUUVCQVFFQkFRQUVPREF3T0VBNFJEdzhSRkE0UkRoUVZFUklTRVJVZkZSVVhGUlVmS0IwWkdSa1pIU2dqSmlBZ0lDWWpMQ3dvS0N3c056YzFOemRBUUVCQVFFQkFRRUJBLzhBQUVRZ0F5QUNnQXdFaUFBSVJBUU1SQWYvRUFMQUFBQUVGQVFFQUFBQUFBQUFBQUFBQUFBUUFBZ01GQmdjQkFRRUFBd0VCQUFBQUFBQUFBQUFBQUFBQUFRTUVBZ1VRQUFJQkFnSUVCd29MQmdRR0F3QUFBQUVDQXdBRUVRVWhNUklHUVZGeHNUSVRGR0dCd2RFaVFsS1NNeldSb2VGaWNxS3lJMU56RllKakpEUVdCOUtqVkNieHdrTmtKV1hpazNRUkFBSUJBZ01GQlFjREJRRUFBQUFBQUFBQkFoRURJUklFTVVGUmNUSmh3VklVQlpHaHNTSnlFek9CMFVMaFlwSWpVeFgvMmdBTUF3RUFBaEVERVFBL0FNSlNwVXFBVktsWHVGQWVVcTl3cFVCNVh1RmU0VjZvb0R6WkhEb3gwQ25HTWluendsN1o4TmFqYUhlb08zdm1UQlpCdHA5WVVJcVRFVjVST3hIS25XUm5hVThWUk1oRkJVanBWN2hTb1NlVXE5cFVCNVNyMmxoUUhsS3ZjSzhvQlY3aFNGU1JydGFLQVpzMDdZTlBNMXBHMnhKSUF3MWpTZWFuZHJ5LzhYNG04VkNLa1d3YVd3YW03WGwvNHYxVzhWTHRtWC9pL1ZieFVvS2tXd2FrU000MDd0bVgvaS9WYnhVbXpHd2pRc2pkWTQxSUFSaWUvVTBJYlpPMGtOdENYbk9Da0VCZUZ1NEtJM0JzN0ROYjI3eWErakR4M2tKZUVucEpKRWNRVmJXRHNrMTd1NXVyZDU5MXVjWmtXaHltMlZuZDlSa0NERXBGeERScGJ3MGJ1bnU1bWxwMkRlMkZNTFlYT0Qyd0IyeGJPZXJhVWNZR0o3Mm1sU1VpcXp6ZHpNZDNaM21peGx0QTJ5emNLL05sSE0xRFF5UlhjZTFIb2NkTk9FZkpYWjg4eTlab2pPcWhpQnN6SVJpSFE4WTRjSzVUdkh1ekxsakhOTXF4Tm9EakxGcmFISG5qUHhjTkNHVmJ4RVV6WU5UeDVqWlN4aHBXNnFUemx3SitEQ3ZPMlpmK0w5VnZGU2dxeUhZTkxZTlRkc3NQeGZpYnhVdTE1ZjhBaS9WUGlxQ2FrT3dhODJEVS9hOHYvRitKdkZURGRXUEJMOFI4VktDdllSWVY1VXpvTUF5NlFkSUlxSTBCNEtKdHhpUlF3b3UxNlFvR1VrbnRINVR6MFJiWmJtRjJoa3RyYVNWQm8ybFVrWTh0RHllMGZsUFBYVHNsVlV5aXlWUnNqcVVPQTR5TVQ4ZFcycmFtMm02VVZUTnE5UzdFSXlVVkp5ZE1Ubi82RG5QK2ltOVdsK2c1ei9vcHZWcnB0ZUVoUVdZNEFhU1R3QVZmNVdQaVpoLzlTNS96ajd6bHR6bG1ZV2tmV1hOdkpER1RnR2NZREhpclI3aTdtU2J3WFBhcnNGTXJnYjd3NmpLdy93Q21uYzlJMTRrRjN2cHZDbGpiTXlXTU9KTDRhRWlCOHFVL09iVUs3SFlXVnJsMXBGWldpQ09DQlFxS09MalBHVHJOWlpxS2JVWFZIcTJuTndUdUpSazFWcGJnWE44czdSazV5bTBVUVF6aElHMk5Bamh4SFdiSStnQ0JWakJCRmJ3eHdRcUVpaVVKR2cxQlZHQUZlN2RWMjhXWUxZWkZtRjJUaDFVRDdKR2p5bUd5bjFpSzVPeXpJQkdCMUhnckxaaGFtenVtUUFHSndTcW5TQ2gxcTNHT0NvZHh0NGN4dXJkY3B6dU40Y3loaVdhRjVCZzA5dWRVbW5XdzFIL2pWOW5GdUo3UXVvKzhoOHBlVGhGQSswNDd2ZHV5TXRrN2ZZcVRsMDdZRmRmVXVmTVB6VDVwNzFVZHRsbVlYYUdTMnQzbVFIQXNneEFOZGFkWUpvcExlNFFTMjg2N0VzWjRRZkNOWXJDRmJqZERQbWdrWXlXRnhnVmYwNGlmSmY2U2NOZFJVVzFYQmI2RlU1VGpGNUVwU1NyR3UvczVsTitnNXovb3B2VnBmb09jL3dDaW05V3RkSG5hdHZPYkpYRFc3eExHaEI4bnJQYVk5L0hDcit0RWRQQ1ZhU2VEb1lMbnFGNjNselc0L1BGU1czZWN4Ykk4NFZTeldVd1VhU2RnMERYWEs1bnZBaXBuZDZxZ0t2V25RTzdwcmk5WlVFbW0zVmwyajFrcjhwUmxGUnlxdUJOWmpHeFEvUzU2WTFTMmZ1OU9WdWVvbjExU3phaG9vdTA2UW9RVVhhZElWQ0QyRkpKN1IrVTg5ZE15ZHY4QXhkbitUSDltdVp5ZTBmbFBQWFFzdGxLNVRia2ExZ1VqbEMxcTB2VkxrZWI2citPM1R4OXhjWTFudDhjME5yWkN5aU9FMTEwOE5Zakd2MWpvbzdKczFqekt5U2NZTEl2a3pMNkxEd0hYVkprc0g5U2I0OWRLTnEwdGoxakE2dXJpT0NMKzAyRldYN2lWdFpYMS9BemFIVHllb2F1S24yTVg5Vzc5emViaVpDdVI1TWpTcmhmWHVFdHdUclVlWkgreU5mZHJSTmN4STZJemhYbEpFYWs2V0lHSjJSdzRDaFduQ2huZHRsVkJMTWRRQTBrMWdiWE5NenpEZkRMczZtamFQS3BwSmJXd0oxYk93d3h3NDNPbkhoNzFZVDNEcGZXVUptRmxiNWpISERkZVhCSElzclJlYTVUU3F2eHFHMDRjTk42MnZldG9DUzR0cmU1bWdua0dFOXErM0RLT2t1STJXWDZMRFFSUkhXRGgxVUN0d2o3UVJnMndkbDhEamd3MXFlN1h2VzBCUTNrZlo3bVNMZ1UrVDlFNlJWYm51VnJuV1ZTV3FqK0x0OFpiUnVIRWRLUGtZVmNaMk1KWTVmU0d5ZVZhcjQ1K3JrV1FIQXFjY2FsUEU1a20xaHRXSzVuSzRXbnQ1RnVVQlV3T01HNG5Ha0EvQlhVclc0UzZ0b3JsT2pNZ2NkL3hWbjdyTG83ektzMHVFakNOZVN2ZHdvQmhnc1p4WDFsMmozNmszTHUrdXlwcmRqNVZzNUEraS9sRDQ4YTBhYVZKT1BpN2pCNmxieldvenBqQjQ4cGYxTkRYTk40dmZsNytaNEJYUzY1cHZGNzh2ZnpQQUs3MVhUSG1aL1MveVQranZKN0wzZkh5dHoxRSt1cGJMK1FqNVc1NmpmWFdSbnNJWUtMdGVrS0VGR1d2U0ZRZ3lqazlvL0tlZXQzWXRobE1QLzV4OW1zSko3UitVODliaXliL0FNWEV2N2dENnRhZEwxVCtrd2VwUnJDMzlaa0xETWJpd012VUhSUEcwYmpsR2c4b3JlLzIzc3hCbGR4Zk1QTHVwTmhUOHlML0FPUk5aYmR6SjQ4NHNjeXR4Z0xxSlk1TFpqNlEyc1Y1RzFWdWQxbWpqeUcwaWowTkVHU1pUb0t5aGp0cXc0d2F6dHVpWEEzcUtUYlN4bHRmR2hiWmxFOTVadFpxeFZiZ2lPWmhyRVI5cGgzU3ZrOStwSklMWjRZNERHQkZDVU1LalJzR1BvYlBGaFVmVzBOSm1sakUyeEpjSXJjSTJ2RlVFbG4xbFJYZDZscmF6WFQ5R0NOcEQreU5xb0k3bU9WZHVOdzZuemxPSW9QT1VhNnl5ZTFYWGNiTVI1R2RRM3hZMEJTYmozMS9GY1RRWmlySitxNDMxcTdhbmJIQ1RaNzJCdzdsYlByS0JNY0JXTk5nYk1CQmgrYnNqQmRuaTBWSjFsQVJaczZ5V2l1cHhDdU1EeTZLcFMySXdPbzZEVHIzTXJlM2U1dFpaVlVNNFpCanFPT0pvV080amtYYWpjT09NSEdnRElTdldJcmRBa0tSODArVHpWbDkwOGJQUEwzTHp4T3VIZGlmeFZmaVRBZzkycUkvdysvOGdHZ1N5Ti9tUjdYUFZscDBsRi8zTDNtYlZLdHU1SGpiay84QUhFMkZjMDNpOStYdjVuZ0ZkS05jMTNpOStYdjVuZ0ZhTlYweDVubitsL2tuOUhlRVdYdStQbGJucUo5ZFMyWHU5T1Z1ZW9uMTFrWjdDR0NqTFhwQ2d4UmxyMGhVSVBZVWNudEg1VHoxczh2YitCdDEvZHFQaXJHU2UwZmxQUFd1c0cvZzRQeTE1cTA2WHFseU1XdlZZUStydUk5eEpPcXpPOWhPdG8vc1A4dGJHT0ZJcm1XZU03SXVNRE1uQVhYUUpPVWpRZU9zSmswblk5NmlwMENZdW5yamFIeDF0K3NyUEpVYlhCbTJMckZQaWt3VE9iK1QrVmhiWnhHTXJEWHA4M3gxUVN5MnR1Y0pwVWpQRVRwK0NuNS9mdGFSdkt2dHAzS3g0OEhHM2VySE16T3haaVdadExNZEpOUVNiYkw3MVZrNnl5blZpT2txbkVFZk9XdFBiWGkzRVFrR2c2bVhpTmNramVTSnhKR3hSMTBxdzBHdHh1eG12YkltRDRDWk1GbEE0ZlJmdjBCcWVzcXF6VE1aTk1FRGJJSHRISDJRZUNpWkpTcU1RZE9HaXVlNTNtejNjelF3c1JiSWNOSG5rZWMzYzRxQU11cml6NjhnVElUb3h3T09ubHAwTWp4TUpZVzc0MUdzM1JWbGR0YnlnRS9kTWNIWC9tb0RheFRpV05aQjUzQjNhcmI4L3dDKzRTT0Y0c2YvQUt4VTlrY0JzZk9HSGZvVUh0Ry9SYnpZNURpZTVISGhYZHZhdnFpWjlROEpkbHE0L2diS3VhN3hlL0wzOHp3Q3VocGYyVWsvWm81MGttd0pLSWRvZ0RqdzFWenplTDM1ZS9tZUFWcDFMVGdxWTRubittUmF1enFtcXdyanpDTEwzZkh5dHoxRSt1cExMK1FqNVc1NmpmWFdSbnJvWUtMdGVrS0VGRjJ2U0ZRZzloU1NlMGZsUFBXb3NtL2hJZm9MelZsNVBhUHlubnJSV2IvdzBYMEY1cTA2WHFseU0yc1ZZeDVnbWJGcmUvdDcxTlkyVCswaDhWYlNPNVNXTkpVT0tTQU1wN2pER3NwbU1QYUxSbFhTNmVXdmUxL0ZSTzdXWWRiWm0xWS9lVy9SN3FIeEhSWEdvamxtM3VsaWQ2YVZiYVcrT0FMdmdDTHEySG05V3hIS1dxamhqNnhzSzFlOGRtMTVsNG5pRzFMWmtzd0dzeHRyUGVPbXN2YXlCSkExVkl0bFdqcHRMdVRkUE1vN0x0alJEcTluYUs0K1dGOUlyVVc3QmFIT2xqR3FWSEI3dzJoelZvWnQ4N2Q4dmFOWVNMbDAyQ2NSc0RFYkpiajcxVXU3VUJrdko3L0Q3cTJRb0R4eVNhQU84TVRYZHhSVk1wUnA1WFpPV2RGL21zN1I1WGR5S2ZLV0pzTy81UGhyRzVYbE54bUV5d1c2YlRuVHhBQWNKTmJHU01Ya00xcGpnYmlObzFQemlQSitPczd1N20vNlJlTTAwWk9neFNwcVlZSFQzd1JYTUtONGxsOXpVRzRiUWZOc2h1OHNaVnVFQTJoaXJBNHFlL1ZPd3dyVmJ6Ynd3NW1JNDRVS1JSWWtiV0cwUzNKV2N0YmQ3dTVXRmZPT0xIaVVkSnFtYWlwZkxzSXNPYmhXZTAwMWxNa01WdkpOamhnaElBTE1jQnhDczdmeFhRbWt1cHgxYlhEc3dHUGxhVGlkVmFFeUtOWGtvbzRlQlYrU3E3TDdWczl6Y0JnZXlRNEdRL01CMWNybW9pbTJvcmV6cWNvd1R1U2VFWTQ4alE3b1pYMlBMemR5TGhOZDZSanJFWTZJNyt1c3B2SDc4dmZ6UEFLNlVBQUFGR0FHZ0FjQXJtdThYdnk5L004QXJUZmlvMjRSVzVubmFHNjd1b3UzSC9LUHVxVDJYOGhIeXR6MUcrdXBMTDNlbkszUFViNjZ5czlSREJSZHIwaFFnb3UwNlFxRUdVa250SDVUejFlMjM4dkY5QmVhcUtUMmo4cDU2dmJiK1hpK2d2TldqVGRVdVJuMVhUSG1UaDhLckpUSmx0OHQxQ1BJWTQ0Y0ducEpWalRKWWttamFOOUliNHU3VjkyM25qVGV0aFJhdVpKVjNQYVcxcmZMSWlYRURZZzZSNFZZYzlDWFc3dGhmT1piS2RiR1p0TFc4dVBWWS91M0dya05Va005emxjeFVqYmhmV09BOTBjUnE0Z3Y0TGhkcU4rVlRvTllXbW5SbTlOTlZXTlR5SGM2VldCdjh3dDRZZUhxbTZ4eVBtcm9xMVo3V0dGTFN4VHE3V0xTdVBTZGpya2Z1bXE1eUhYRFVlQTkyb08yU0twVnVtTkFhb0pMTVhIM215cDBycEo0dUtoYzN0YkRNNUJNcmkxekFqNzlqN0tUaVk4VGNkQnBjc2l0aDAyODZvK3NQQ2FnRVg5UHpnNHpYVUNwNlFZc2U4b291Q0czdGs2bTFCWXYwNVc2VCtJZHlvbHhiSERBQWEyT2dEbE5DejNyeU4yV3hCZDVQSk1nMXQ4MWVJZDJ1a3FuTGxUQmJmY3VZKzl1SkxpUmN2dFB2SGRzSEsrY2ZSSGNIRFdzeWF3anl5MFdCY0RJM2xUUDZUZUljRlYrUzVPbVh4OWJKZzEwNDhvOENqMFY4SnEyRFZ1MDluTDgwdXA3T3hIaStvYWwzUDhBWEIvSXNaUzhUL1lPVjY1enZDY2M3dmZ6UEFLM2l2V0N6NDQ1emVIOTU0QlhPcjZJOHlmU2Z5eitqdkNMUDNmSHl0ejFHK3VwTFAzZkh5dHoxRSt1c2JQYVEwVVhhZElVSUtMdGVrS2hCN0NrazlvL0tlZXIyMi9sNC9vTHpWUlNlMGZsUFBWN2IveThYMEY1cTBhYnFseU0rcTZZOHlRc0JURE1vcjFvOGFpYUUxcGJsdU1xUzNzYkxMSEloU1JReW5ncXVraGFKOXVCam8rSDVhT2EzYW8ydDM0cW91UmxMYWpUYWxHUDh2MElZOHlsWFErUEtQRlUvYllYT0xQZ2U2Q0tpYTBMYXhUT3hIdTFRN2N1QmQ5eVBFSjdUYmpYS084Q2FqYk1JRjZDTkllTnZKSGpxSVdKN3RTcFlrYWxxVmJsd0lkeUcrUkdYdXIwaFhZSkZ4YWwrRGhxNXkzc2xrdjNZMnBEMHBUcitRVUNscEpSVWRvOVhXNE9MclRIdE0xNmNaTExXa2VDN3k0anZsTkVwY1J0dzFVeDI3Q2k0NDhOWnJURnkzbm4zSVFXeGxnR3JEWjNwemE3L004QXJabytBckY1MTcxdXZwK0NxZFYwUjVsL3BzVXJzMnZCM2hkbDd2VGxibnFKOWRTMlh1K1BsYm5xSjlkWTJlc2hvb3ExNlFvUVVYYTlJVkNEMkZMSjdSdVU4OVdOdG1VU1Fxa2dZTWd3MGFjY0tycFBhUHlubnJaV0c0VmkrVldtWTV0bk1XWEcrWHJJWW5BMHJoajBtZGNUZ2ROZHduS0Rxam1kdU0xU1JSL3FscjgvNEtYNnBhOFQvQlZ6RHVMWlh1ZFJaYmxtYnhYY1BVTlBjM0txQ0l3cmJPemdySEVuSGpveUQrM2VTWGtodDdEZUtHNHVtREdPSlZVa2xmb3VUaFhmbWJuWjdDdnkxdnQ5cG12MVcxK2Q4Rkw5VnRlSnZncTV5cmNPR2ZMbXpITjgwaXl5RVRQYnB0QUVGbzJaRzhwbVVhMU9GTm4zS3k2Vy9zYkRLTTVodjVieDJXVFpBKzdSRjJ5NTJXT1BKVHpFK3oyRHkxdnQ5cFQvQUtwYWNUZXJTL1U3VGliMWEwNC90N2tEWFBZMDNqaE4wVzZzUTdLN1czcTJkbnJNY2NhRHkvOEF0ODBrdVpmcVdZeFdOdGxjdlVQUGhpR1loV0RlVXk3SXdZVTh4UHM5Zzh0YjdmYVVuNnBhY1RlclR4bTlvT0J2VnEzdjl6OTI3YXludUlkNDRMaVdLTm5qaEFYRjJVWWhSZzUxNnFwc3J5akxyMjE2NjV6RkxTVGFLOVUyR09BODdTd3FZMzdrblJVK0J6T3phZ3MwczFPeXIrQktNNnN4d1A2dFNEUExNZW42dnkwcnZkbTNTeGx1N0svUzdXRERyRlVEVVR4Z25UVTgyNmVYVzdLbHhtcVF1d0RCWFVLY0QrMVhlZS93WHVLWDVYREdXTGFwU1ZjT3loRU0vc2VKL1YrV25qZUd4NHBQVitXa202a0tabEZheTNKbHQ3aUZwWVpZOEFTVks2RGp0RERBMGY4QTBUbDM0MC8xZjhOZHg4eEpWV1hCMEtia3RGRnBOemRWWEFDL3FPd0EwQ1FuaTJmbHJPM1Z3Ym01bG5JMlRLeGJEaXJYL3dCRTVkK05jZlYvd1ZSN3haUGE1VTl1dHZJOG5XaG1iYncwWUVBWVlBVnhmaGZ5NXJsS1I0RnVsdTZYN21XMW16VDhTNFlpcy81Q1BsYm5xSjlkU1dmdTlPVnVlb24xMW1adlEyaTdYcENoS0t0ZWtLaEJsTko3UitVODliRGZHVGIzYTNaWDBMY2o2a2RZK1QyajhwNTYwMjg4bTFrV1FyNk1KK3lsU0FyKzJjblY1cmVuanMzSDFsb1grM2o5WHZiYnR4TE45bHFXNFVuVjVqZG5qdFhIeGlodHlaTmplU0J1NUo5azFCSmU3eHk3VzVDSi93Q3p1RC9tVFZUZjIrZnE5N0xKdUxyUHNOUnVlUzdXNmFKLzM4eCt2TFZYdVkreHZIYU54YmYyR29DZXpmOEEzNmovQVBzU2Y4dzFzTG5xY3pUZWZKbHVZb0xtNXVvNUY2MXNCc2hJdFAxY05GWWUxZjhBM2lyL0FQZkUvd0NaVWU5YkI5NHI1and1UHNyUUZobUc0bC9aMk0xN0hkVzkwdHV1M0lrVEhhQ2pXZEl3MFZWWmRrczkvQzA2eUpGRXAyZHArRTFiYnF5YkdUWjh2cFFEN0wxWFJ2OEE3YmxUOTZPZGE3dHBOdXVORTM3Q3E5S1Npc2p5dVVveHJTdEtsbEhiTGxXVFhzTXM4Y2h1U3V3RVBEcXdvTGU1eStZUkUvZ0x6bXFSZWt2S0t0ZDQzMjd5TS91bEh4bXJISlN0eVNXVlJ5cmp4S0kyWEMvQ1RsbmxQUEtUcFRkRmJQMEwxYmdyZjVMcDBHM2RQaFFId1YwUzFsekJzbnMzc0VTUjhDcmg5V0FKR2pTT0t1VTNFK3pkWlEzb0poOElBcmRaWEZEbU9UcEhhM2kyK1lySTJLdEt5NHJpY0JzQnVISGdGWFNvNDQwK1dhMnFxeGp2TTl1TW95K1d2eldwTENXV1dFMjhIeEw2ZTQzb2pna2VTQ0JZMVJpNUJHSVVEVDUxY2wzdm0yNzZCQnFTRUg0V2J4VjB0bGt5WEpjeFRNYitPVzZ1WTltR0hyQ3pEUXd3QWJUcDJ1S3VUWjlOMXVZc2ZSUlI4V1Bocm00MTltU1NqUnlpcXhWSzd5MjNCL2Z0dVRtMm9TZEp5ek5WdzNCRm43dlRsYm5xRjlkUzJmdTlPVnVlb24xMWxadVEyaUxkc0dGRDA1SDJkTlFHVjBudEc1VHoxZFdtOU4xYjJrVnE4RVZ3c0kyVWFRYVFPS2htaXRaR0xPbWs2OERoU0Z2WStnZldOU0FnN3ozUXZvN3lLQ0tJb2hpYU5SNUxLeHg4cXB4dmpjcVMwVnBieHZ3T0FjUlFQWjdEMEc5WTB1ejJIb0gxalVDcExZN3pYbHBibTNlS081UXV6anJCcVpqaTN4MTdQdk5jeVQyODhWdkRCSmJNV1VvdlMyaHNsVzdtRlE5bnNQUVByR2wyZXc5QStzYUNvZC9XTnh0YllzcmZiMTdXQnh4NWRkRDIyODF4Qzg4a2x2RGNTWEVuV3V6cnFPR0dDOXpSVVBaN0QwRzlZMHV6V0hvSDFqUVZDTHJlcTZudFpiYU8zaXQxbUd5N1JqVHMxWDJtWXkyMFppQ3E4Wk9PRGNkRWRtc1BRYjFqUzdQWWVnZldOZEp1THFuUWlTVWxScXBGTG1yeXh0SDFNYTdRdzJnTk5QT2RTdDBvSTI3cDAwN3M5aDZCOVkwdXoySG9IMWpYWDNaK0k0KzFiOElKZFg4OXhMSEtRRk1YUVVhaHB4b2lQTjVQK29uZlUrQTAvczloNkRlc2FYWjdEMEQ2eHBHN09MYlV0dTBTdFc1Skp4MmJCc21idGlTaUVrK2N4b0NXV1NhVnBaT2sydkRWbzBWWWRuc1BRYjFqU052WmNDSDFqU2QyYytwMVhBbUZxRU9tT1BFZmFIK0JRZDF1ZW8yMTFJenJnRlVZS05BQXFJMVd6dENwVXFWQ1JVcVZLZ0ZTcFVxQVZLbFNvQlVxVktnRlNwVXFBVktsU29CVXFWS2dGU3BVcUFWS2xTb0QvOWs9XCIsXHJcblxyXG4gICAgICAgIGxvYWRlclRleHQ6IFwi5q2j5Zyo6L295YWlLi4uIFwiLFxyXG5cclxuICAgICAgICBsb2FkZXJGb250OiBcIkFyaWFsXCIsXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBsaXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICBwdXJlbXZjLnN0YXRlbWFjaGluZS5TdGF0ZU1hY2hpbmUuQ0hBTkdFRFxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBoYW5kbGVOb3RpZmljYXRpb246IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcclxuICAgICAgICAgICAgc3dpdGNoIChub3RpZmljYXRpb24uZ2V0TmFtZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIHB1cmVtdmMuc3RhdGVtYWNoaW5lLlN0YXRlTWFjaGluZS5DSEFOR0VEOlxyXG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZyhub3RpZmljYXRpb24uZ2V0Qm9keSgpLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2aWV3TWVkaWF0b3IgPSB0aGlzLmZhY2FkZS5yZXRyaWV2ZU1lZGlhdG9yKG5vdGlmaWNhdGlvbi5nZXRCb2R5KCkubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpZXdNZWRpYXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFZpZXcodmlld01lZGlhdG9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgb25SZWdpc3RlcjogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgb25SZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0VmlldzogZnVuY3Rpb24gKHZpZXdNZWRpYXRvcikge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnZpZXdDb21wb25lbnQgPSBuZXcgY2MuU2NlbmUoKTtcclxuXHJcbiAgICAgICAgICAgIHZpZXdNZWRpYXRvci5pbml0KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSB2aWV3TWVkaWF0b3IuZ2V0Vmlld0NvbXBvbmVudCgpO1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciByZXMgPSB2aWV3TWVkaWF0b3IuZ2V0UmVzb3VyY2UoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBoYW5kbGVTY2VuZUNoYW5nZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbmROb3RpZmljYXRpb24oJ1NDRU5FX0NIQU5HRUQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgR2VuZUNvY29zSlMuTG9hZGVyU2NlbmUucHJlbG9hZChyZXMsIGhhbmRsZVNjZW5lQ2hhbmdlZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVTY2VuZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfSxcclxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgTkFNRTogJ1NjZW5lTWVkaWF0b3InLFxyXG4gICAgICAgIFNDRU5FX0NIQU5HRV9WSUVXOiAnU2NlbmVDaGFuZ2VWaWV3J1xyXG4gICAgfVxyXG4pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8vIOiHquWumuS5ieiHqueUseiQveS9k+eahEFjdGlvblxyXG52YXIgRnJlZUZhbGxBY3Rpb24gPSBjYy5BY3Rpb25JbnRlcnZhbC5leHRlbmQoIHtcclxuICAgIHRpbWVFbGFzcGVkOjAsXHJcbiAgICBtX3Bvc2l0aW9uRGVsdGFZOm51bGwsXHJcbiAgICBtX3N0YXJ0UG9zaXRpb246bnVsbCxcclxuICAgIG1fdGFyZ2V0UG9zaXRpb246bnVsbCxcclxuICAgIF90YXJnZXQgOiBudWxsLFxyXG4gICAga19BY2NlbGVyYXRpb24gOiAxMCxcclxuICAgIHYwOjMwLFxyXG4gICAgY3RvcjpmdW5jdGlvbigpIHtcclxuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuY3Rvci5jYWxsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMueU9mZnNldEVsYXNwZWQgPSAwO1xyXG4gICAgICAgIHRoaXMudGltZUVsYXNwZWQgPSAwO1xyXG4gICAgICAgIHRoaXMubV9wb3NpdGlvbkRlbHRhWSA9IDA7ICAvLyDlnoLnm7TlgY/np7vph49cclxuICAgICAgICB0aGlzLm1fc3RhcnRQb3NpdGlvbiA9IGNjLnAoMCwgMCk7ICAvLyDotbfngrnlnZDmoIdcclxuICAgICAgICB0aGlzLm1fdGFyZ2V0UG9zaXRpb24gPSBjYy5wKDAsIDApOyAvLyDnu4jngrnlnZDmoIdcclxuICAgIH0sXHJcbiAgICAvLyDorr7nva7or6VBY3Rpb27ov5DooYznmoTml7bpl7RcclxuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR1cmF0aW9uKSB7XHJcbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRXaXRoT2Zmc2V0OmZ1bmN0aW9uKGRlbHRhUG9zaXRpb24pIHtcclxuICAgICAgICB2YXIgZHJvcFRpbWUgPSAoLXRoaXMudjAgKyBNYXRoLnNxcnQodGhpcy52MCp0aGlzLnYwICsgMip0aGlzLmtfQWNjZWxlcmF0aW9uKk1hdGguYWJzKGRlbHRhUG9zaXRpb24pKSkvdGhpcy5rX0FjY2VsZXJhdGlvbjtcclxuICAgICAgICBpZih0aGlzLmluaXRXaXRoRHVyYXRpb24oZHJvcFRpbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubV9wb3NpdGlvbkRlbHRhWSA9IGRlbHRhUG9zaXRpb247XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NjLmxvZyhcImRyb3BUaW1lID1cIiArIGRyb3BUaW1lICsgXCI7IGRlbHRhUG9zaXRpb249XCIgKyBkZWx0YVBvc2l0aW9uKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGlzRG9uZTpmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5tX3RhcmdldFBvc2l0aW9uLnkgPj0gdGhpcy5fdGFyZ2V0LmdldFBvc2l0aW9uWSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIE5vZGXnmoRydW5BY3Rpb27lh73mlbDkvJrosIPnlKhBY3Rpb25NYW5hZ2Vy55qEYWRkQWN0aW9u5Ye95pWw77yM5ZyoQWN0aW9uTWFuYWdlcueahGFkZEFjdGlvbuWHveaVsOS4reS8muiwg+eUqEFjdGlvbueahHN0YXJ0V2l0aFRhcmdldO+8jOeEtuWQjuWcqEFjdGlvbuexu+eahHN0YXJ0V2l0aFRhcmdldOWHveaVsOS4reiuvue9rl90YXJnZXTnmoTlgLzjgIJcclxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbih0YXJnZXQpIHtcclxuICAgICAgICAvL2NjLmxvZyhcInN0YXJ0V2l0aFRhcmdldCB0YXJnZXQ9XCIgKyB0YXJnZXQpO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcclxuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgICB0aGlzLm1fc3RhcnRQb3NpdGlvbiA9IHRhcmdldC5nZXRQb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMubV90YXJnZXRQb3NpdGlvbiA9IGNjLnAodGhpcy5tX3N0YXJ0UG9zaXRpb24ueCwgdGhpcy5tX3N0YXJ0UG9zaXRpb24ueSAtIHRoaXMubV9wb3NpdGlvbkRlbHRhWSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZTpmdW5jdGlvbihkdCkge1xyXG4gICAgICAgIHRoaXMudGltZUVsYXNwZWQgKz0gZHQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldCAmJiB0aGlzLm1fdGFyZ2V0UG9zaXRpb24ueSA8IHRoaXMuX3RhcmdldC5nZXRQb3NpdGlvblkoKSkge1xyXG4gICAgICAgICAgICB2YXIgeU1vdmVPZmZzZXQgPSAwLjUgKiB0aGlzLmtfQWNjZWxlcmF0aW9uICogdGhpcy50aW1lRWxhc3BlZCAqIHRoaXMudGltZUVsYXNwZWQgKyB0aGlzLnYwICogdGhpcy50aW1lRWxhc3BlZDtcclxuICAgICAgICAgICAgaWYgKGNjLkVOQUJMRV9TVEFDS0FCTEVfQUNUSU9OUykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1BvcyA9IGNjLnAodGhpcy5tX3N0YXJ0UG9zaXRpb24ueCwgdGhpcy5tX3N0YXJ0UG9zaXRpb24ueSAtIHlNb3ZlT2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1fdGFyZ2V0UG9zaXRpb24ueSA+IG5ld1Bvcy55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB0aGlzLm1fdGFyZ2V0UG9zaXRpb24ueTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90YXJnZXQuc3RvcEFsbEFjdGlvbnMoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90YXJnZXQubGFuZGluZ192ZXJ0aWNhbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGFyZ2V0LnNldFBvc2l0aW9uKG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90YXJnZXQuc2V0UG9zaXRpb24oY2MucCh0aGlzLm1fc3RhcnRQb3NpdGlvbi54LCB0aGlzLm1fc3RhcnRQb3NpdGlvbi55ICsgdGhpcy5tX3Bvc2l0aW9uRGVsdGFZICogZHQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuRnJlZUZhbGxBY3Rpb24uY3JlYXRlID0gZnVuY3Rpb24oZGVsdGFQb3NpdGlvbikge1xyXG4gICAgdmFyIGZmID0gbmV3IEZyZWVGYWxsQWN0aW9uKCk7XHJcbiAgICBmZi5pbml0V2l0aE9mZnNldChkZWx0YVBvc2l0aW9uKTtcclxuICAgIHJldHVybiBmZjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLkZyZWVGYWxsQWN0aW9uID0gRnJlZUZhbGxBY3Rpb247IiwidmFyIHJlcyA9IHtcbiAgICBiYWNrZ3JvdW5kIDogXCJyZXMvYmFja2dyb3VuZC5qcGdcIixcbiAgICBiYWNrZ3JvdW5kMiA6IFwicmVzL2JhY2tncm91bmQyLkpQR1wiLFxuICAgIG1pbGVzdG9uZTogXCJyZXMvbWlsZXN0b25lLnBuZ1wiLFxuICAgIGlkbGUgOiBcInJlcy9pZGxlLnBuZ1wiLFxuICAgIHJlYWR5XzEgOiBcInJlcy9yZWFkeV8xLnBuZ1wiLFxuICAgIHJlYWR5XzIgOiBcInJlcy9yZWFkeV8yLnBuZ1wiLFxuICAgIHJlYWR5XzMgOiBcInJlcy9yZWFkeV8zLnBuZ1wiLFxuICAgIHJlYWR5XzQgOiBcInJlcy9yZWFkeV80LnBuZ1wiLFxuICAgIHJlYWR5XzUgOiBcInJlcy9yZWFkeV81LnBuZ1wiLFxuICAgIHN0cmlrZV8xIDogXCJyZXMvc3RyaWtlXzEucG5nXCIsXG4gICAgc3RyaWtlXzIgOiBcInJlcy9zdHJpa2VfMi5wbmdcIixcbiAgICBzdHJpa2VfMyA6IFwicmVzL3N0cmlrZV8zLnBuZ1wiLFxuICAgIHN0cmlrZV80IDogXCJyZXMvc3RyaWtlXzQucG5nXCIsXG4gICAgc3RyaWtlXzUgOiBcInJlcy9zdHJpa2VfNS5wbmdcIixcbiAgICBzdHJpa2VfZl8xIDogXCJyZXMvc3RyaWtlX2ZfMS5wbmdcIixcbiAgICBzdHJpa2VfZl8yIDogXCJyZXMvc3RyaWtlX2ZfMy5wbmdcIixcbiAgICBzdHJpa2VfZl8zIDogXCJyZXMvc3RyaWtlX2ZfMy5wbmdcIixcbiAgICBzdHJpa2VfZl80IDogXCJyZXMvc3RyaWtlX2ZfNC5wbmdcIixcbiAgICBzdHJpa2Vfc18xIDogXCJyZXMvc3RyaWtlX3NfMS5wbmdcIixcbiAgICBzdHJpa2Vfc18yIDogXCJyZXMvc3RyaWtlX3NfMi5wbmdcIixcbiAgICBzdHJpa2Vfc18zIDogXCJyZXMvc3RyaWtlX3NfMy5wbmdcIixcbiAgICBzdHJpa2Vfc180IDogXCJyZXMvc3RyaWtlX3NfNC5wbmdcIixcbiAgICBzdHJpa2Vfc181IDogXCJyZXMvc3RyaWtlX3NfNS5wbmdcIixcbiAgICBwZW5ndWluX2p1bXBfMSA6IFwicmVzL3Blbmd1aW5fanVtcF8xLnBuZ1wiLFxuICAgIHBlbmd1aW5fanVtcF8yIDogXCJyZXMvcGVuZ3Vpbl9qdW1wXzIucG5nXCIsXG4gICAgcGVuZ3Vpbl9qdW1wXzMgOiBcInJlcy9wZW5ndWluX2p1bXBfMy5wbmdcIixcbiAgICBwZW5ndWluX2p1bXBfNCA6IFwicmVzL3Blbmd1aW5fanVtcF80LnBuZ1wiLFxuICAgIHBlbmd1aW5fanVtcF81IDogXCJyZXMvcGVuZ3Vpbl9qdW1wXzUucG5nXCIsXG4gICAgcGVuZ3Vpbl9qdW1wXzYgOiBcInJlcy9wZW5ndWluX2p1bXBfNi5wbmdcIixcbiAgICBwZW5ndWluX3ZlcnRpY2FsX2xhbmRpbmdfMSA6IFwicmVzL3Blbmd1aW5fdmVydGljYWxfbGFuZGluZ18xLnBuZ1wiLFxuICAgIHBlbmd1aW5fdmVydGljYWxfbGFuZGluZ18yIDogXCJyZXMvcGVuZ3Vpbl92ZXJ0aWNhbF9sYW5kaW5nXzIucG5nXCIsXG4gICAgcGVuZ3Vpbl92ZXJ0aWNhbF9sYW5kaW5nXzMgOiBcInJlcy9wZW5ndWluX3ZlcnRpY2FsX2xhbmRpbmdfMy5wbmdcIixcbiAgICBwZW5ndWluX3ZlcnRpY2FsX2xhbmRpbmdfNCA6IFwicmVzL3Blbmd1aW5fdmVydGljYWxfbGFuZGluZ180LnBuZ1wiLFxuICAgIHBlbmd1aW5fZmx5XzEgOiBcInJlcy9wZW5ndWluX2ZseV8xLnBuZ1wiLFxuICAgIHBlbmd1aW5fZmx5XzIgOiBcInJlcy9wZW5ndWluX2ZseV8yLnBuZ1wiLFxuICAgIHBlbmd1aW5fZmx5XzMgOiBcInJlcy9wZW5ndWluX2ZseV8zLnBuZ1wiLFxuICAgIHBlbmd1aW5fbGFuZGluZ18xIDogXCJyZXMvcGVuZ3Vpbl9sYW5kaW5nXzEucG5nXCIsXG4gICAgcGVuZ3Vpbl9sYW5kaW5nXzIgOiBcInJlcy9wZW5ndWluX2xhbmRpbmdfMi5wbmdcIixcbiAgICBwZW5ndWluX2xhbmRpbmdfMyA6IFwicmVzL3Blbmd1aW5fbGFuZGluZ18zLnBuZ1wiLFxuICAgIHBlbmd1aW5fbGFuZGluZ180IDogXCJyZXMvcGVuZ3Vpbl9sYW5kaW5nXzQucG5nXCIsXG4gICAgYnV0dG9uX2JvdHRvbV9wcmVzc2VkXzIgOiBcInJlcy9idXR0b25fYm90dG9tX3ByZXNzZWRfMi5wbmdcIixcbiAgICBwZW5ndWluX25pY2sgOiBcInJlcy9wZW5ndWluX25pY2sucG5nXCIsXG4gICAgYnV0dG9uX2JvdHRvbV9wcmVzc2VkXzM6IFwicmVzL2J1dHRvbl9ib3R0b21fcHJlc3NlZF8zLnBuZ1wiLFxuICAgIHBlbmd1aW5fc3RlcF9sZWZ0XzE6IFwicmVzL3Blbmd1aW5fc3RlcF9sZWZ0XzEucG5nXCIsXG4gICAgcGVuZ3Vpbl9zdGVwX2xlZnRfMjogXCJyZXMvcGVuZ3Vpbl9zdGVwX2xlZnRfMi5wbmdcIixcbiAgICBwZW5ndWluX3N0ZXBfbGVmdF8zOiBcInJlcy9wZW5ndWluX3N0ZXBfbGVmdF8zLnBuZ1wiLFxuICAgIHBlbmd1aW5fc3RlcF9yaWdodF8xOiBcInJlcy9wZW5ndWluX3N0ZXBfcmlnaHRfMS5wbmdcIixcbiAgICBwZW5ndWluX3N0ZXBfcmlnaHRfMjogXCJyZXMvcGVuZ3Vpbl9zdGVwX3JpZ2h0XzIucG5nXCIsXG4gICAgcGVuZ3Vpbl9zdGVwX3JpZ2h0XzM6IFwicmVzL3Blbmd1aW5fc3RlcF9yaWdodF8zLnBuZ1wiLFxuXG4gICAgYnV0dG9uX21vcmVfZ2FtZTogXCJyZXMvYnV0dG9uX21vcmUucG5nXCIsXG4gICAgYnV0dG9uX3JldHJ5OiBcInJlcy9idXR0b25fcmV0cnkucG5nXCIsXG4gICAgcGVuZ3Vpbl9pZGxlOiBcInJlcy9wZW5ndWluX2lkbGUucG5nXCJcbn07XG5cbnZhciBnX3Jlc291cmNlcyA9IFtcbiAgICAvL2ltYWdlXG4gICAgcmVzLmJhY2tncm91bmQsXG4gICAgcmVzLmJhY2tncm91bmQyLFxuICAgIHJlcy5pZGxlLFxuICAgIHJlcy5yZWFkeV8xLFxuICAgIHJlcy5yZWFkeV8yLFxuICAgIHJlcy5yZWFkeV8zLFxuICAgIHJlcy5yZWFkeV80LFxuICAgIHJlcy5yZWFkeV81LFxuICAgIHJlcy5zdHJpa2VfMSxcbiAgICByZXMuc3RyaWtlXzIsXG4gICAgcmVzLnN0cmlrZV8zLFxuICAgIHJlcy5zdHJpa2VfNCxcbiAgICByZXMuc3RyaWtlXzUsXG4gICAgcmVzLnN0cmlrZV9mXzEsXG4gICAgcmVzLnN0cmlrZV9mXzIsXG4gICAgcmVzLnN0cmlrZV9mXzMsXG4gICAgcmVzLnN0cmlrZV9mXzQsXG4gICAgcmVzLnN0cmlrZV9zXzEsXG4gICAgcmVzLnN0cmlrZV9zXzIsXG4gICAgcmVzLnN0cmlrZV9zXzMsXG4gICAgcmVzLnN0cmlrZV9zXzQsXG4gICAgcmVzLnN0cmlrZV9zXzUsXG4gICAgcmVzLnBlbmd1aW5fanVtcF8yLFxuICAgIHJlcy5wZW5ndWluX2p1bXBfMyxcbiAgICByZXMucGVuZ3Vpbl9qdW1wXzQsXG4gICAgcmVzLnBlbmd1aW5fanVtcF81LFxuICAgIHJlcy5wZW5ndWluX2p1bXBfNixcbiAgICByZXMuYnV0dG9uX2JvdHRvbV9wcmVzc2VkXzMsXG4gICAgcmVzLmJ1dHRvbl9ib3R0b21fcHJlc3NlZF8yLFxuICAgIHJlcy5wZW5ndWluX3ZlcnRpY2FsX2xhbmRpbmdfMSxcbiAgICByZXMucGVuZ3Vpbl92ZXJ0aWNhbF9sYW5kaW5nXzIsXG4gICAgcmVzLnBlbmd1aW5fdmVydGljYWxfbGFuZGluZ18zLFxuICAgIHJlcy5wZW5ndWluX3ZlcnRpY2FsX2xhbmRpbmdfNCxcbiAgICByZXMucGVuZ3Vpbl9mbHlfMSxcbiAgICByZXMucGVuZ3Vpbl9mbHlfMixcbiAgICByZXMucGVuZ3Vpbl9mbHlfMyxcbiAgICByZXMucGVuZ3Vpbl9sYW5kaW5nXzEsXG4gICAgcmVzLnBlbmd1aW5fbGFuZGluZ18yLFxuICAgIHJlcy5wZW5ndWluX2xhbmRpbmdfMyxcbiAgICByZXMucGVuZ3Vpbl9sYW5kaW5nXzQsXG4gICAgcmVzLnBlbmd1aW5fbmljayxcbiAgICByZXMubWlsZXN0b25lLFxuICAgIHJlcy5idXR0b25fYm90dG9tX3ByZXNzZWRfMyxcbiAgICByZXMuYnV0dG9uX21vcmVfZ2FtZSxcbiAgICByZXMuYnV0dG9uX3JldHJ5LFxuICAgIHJlcy5wZW5ndWluX3N0ZXBfbGVmdF8xLFxuICAgIHJlcy5wZW5ndWluX3N0ZXBfbGVmdF8yLFxuICAgIHJlcy5wZW5ndWluX3N0ZXBfbGVmdF8zLFxuICAgIHJlcy5wZW5ndWluX3N0ZXBfcmlnaHRfMSxcbiAgICByZXMucGVuZ3Vpbl9zdGVwX3JpZ2h0XzIsXG4gICAgcmVzLnBlbmd1aW5fc3RlcF9yaWdodF8zLFxuICAgIHJlcy5wZW5ndWluX2lkbGUsXG4gICAgcmVzLnBlbmd1aW5fanVtcF8xXG5dO1xuXG5tb2R1bGUuZXhwb3J0cy5yZXMgPSByZXM7XG5tb2R1bGUuZXhwb3J0cy5nX3Jlc291cmNlcyA9IGdfcmVzb3VyY2VzO1xuIiwidmFyIExvYWRlclNjZW5lID0gY2MuU2NlbmUuZXh0ZW5kKHtcclxuICAgIF9pbWFnZTogbnVsbCxcclxuICAgIF90ZXh0OiBcIkxvYWRpbmcuLi4gXCIsXHJcbiAgICBfZm9udDogXCJBcmlhbFwiLFxyXG4gICAgX2xhYmVsIDogbnVsbCxcclxuICAgIF9jbGFzc05hbWU6IFwiR2VuZUpTLkNvY29zLkxvYWRlclNjZW5lXCIsXHJcblxyXG4gICAgaW5pdCA6IGZ1bmN0aW9uKGltYWdlLCB0ZXh0LCBmb250KXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgICAgICBzZWxmLl9pbWFnZSA9IGltYWdlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGV4dCkge1xyXG4gICAgICAgICAgICBzZWxmLl90ZXh0ID0gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZvbnQpIHtcclxuICAgICAgICAgICAgc2VsZi5fZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbG9nb1dpZHRoID0gMTYwO1xyXG4gICAgICAgIHZhciBsb2dvSGVpZ2h0ID0gMjAwO1xyXG5cclxuICAgICAgICB2YXIgYmdMYXllciA9IHNlbGYuX2JnTGF5ZXIgPSBuZXcgY2MuTGF5ZXJDb2xvcihjYy5jb2xvcigzMiwgMzIsIDMyLCAyNTUpKTtcclxuICAgICAgICBiZ0xheWVyLnNldFBvc2l0aW9uKGNjLnZpc2libGVSZWN0LmJvdHRvbUxlZnQpO1xyXG4gICAgICAgIHNlbGYuYWRkQ2hpbGQoYmdMYXllciwgMCk7XHJcblxyXG4gICAgICAgIHZhciBmb250U2l6ZSA9IDI0LCBsYmxIZWlnaHQgPSAgLWxvZ29IZWlnaHQgLyAyICsgMTAwO1xyXG5cclxuICAgICAgICBpZihzZWxmLl9pbWFnZSl7XHJcbiAgICAgICAgICAgIGNjLmxvYWRlci5sb2FkSW1nKHNlbGYuX2ltYWdlLCB7aXNDcm9zc09yaWdpbiA6IGZhbHNlIH0sIGZ1bmN0aW9uKGVyciwgaW1nKXtcclxuICAgICAgICAgICAgICAgIGxvZ29XaWR0aCA9IGltZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIGxvZ29IZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5faW5pdFN0YWdlKGltZywgY2MudmlzaWJsZVJlY3QuY2VudGVyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGZvbnRTaXplID0gMTQ7XHJcbiAgICAgICAgICAgIGxibEhlaWdodCA9IC1sb2dvSGVpZ2h0IC8gMiAtIDEwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxhYmVsID0gc2VsZi5fbGFiZWwgPSBuZXcgY2MuTGFiZWxUVEYoc2VsZi5fdGV4dCArXCIwJVwiLCAgc2VsZi5fZm9udCwgZm9udFNpemUpO1xyXG4gICAgICAgIGxhYmVsLnNldFBvc2l0aW9uKGNjLnBBZGQoY2MudmlzaWJsZVJlY3QuY2VudGVyLCBjYy5wKDAsIGxibEhlaWdodCkpKTtcclxuICAgICAgICBsYWJlbC5zZXRDb2xvcihjYy5jb2xvcigxODAsIDE4MCwgMTgwKSk7XHJcbiAgICAgICAgYmdMYXllci5hZGRDaGlsZCh0aGlzLl9sYWJlbCwgMTApO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBfaW5pdFN0YWdlOiBmdW5jdGlvbiAoaW1nLCBjZW50ZXJQb3MpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHRleHR1cmUyZCA9IHNlbGYuX3RleHR1cmUyZCA9IG5ldyBjYy5UZXh0dXJlMkQoKTtcclxuICAgICAgICB0ZXh0dXJlMmQuaW5pdFdpdGhFbGVtZW50KGltZyk7XHJcbiAgICAgICAgdGV4dHVyZTJkLmhhbmRsZUxvYWRlZFRleHR1cmUoKTtcclxuICAgICAgICB2YXIgbG9nbyA9IHNlbGYuX2xvZ28gPSBuZXcgY2MuU3ByaXRlKHRleHR1cmUyZCk7XHJcbiAgICAgICAgbG9nby5zZXRTY2FsZShjYy5jb250ZW50U2NhbGVGYWN0b3IoKSk7XHJcbiAgICAgICAgbG9nby54ID0gY2VudGVyUG9zLng7XHJcbiAgICAgICAgbG9nby55ID0gY2VudGVyUG9zLnk7XHJcbiAgICAgICAgc2VsZi5fYmdMYXllci5hZGRDaGlsZChsb2dvLCAxMCk7XHJcbiAgICB9LFxyXG4gICAgb25FbnRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBjYy5Ob2RlLnByb3RvdHlwZS5vbkVudGVyLmNhbGwoc2VsZik7XHJcbiAgICAgICAgc2VsZi5zY2hlZHVsZShzZWxmLl9zdGFydExvYWRpbmcsIDAuMyk7XHJcbiAgICB9LFxyXG4gICAgb25FeGl0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2MuTm9kZS5wcm90b3R5cGUub25FeGl0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgdmFyIHRtcFN0ciA9IHNlbGYuX3RleHQgK1wiMCVcIjtcclxuICAgICAgICB0aGlzLl9sYWJlbC5zZXRTdHJpbmcodG1wU3RyKTtcclxuICAgIH0sXHJcbiAgICBpbml0V2l0aFJlc291cmNlczogZnVuY3Rpb24gKHJlc291cmNlcywgY2IpIHtcclxuICAgICAgICBpZihjYy5pc1N0cmluZyhyZXNvdXJjZXMpKVxyXG4gICAgICAgICAgICByZXNvdXJjZXMgPSBbcmVzb3VyY2VzXTtcclxuICAgICAgICB0aGlzLnJlc291cmNlcyA9IHJlc291cmNlcyB8fCBbXTtcclxuICAgICAgICB0aGlzLmNiID0gY2I7XHJcbiAgICB9LFxyXG4gICAgX3N0YXJ0TG9hZGluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnVuc2NoZWR1bGUoc2VsZi5fc3RhcnRMb2FkaW5nKTtcclxuICAgICAgICB2YXIgcmVzID0gc2VsZi5yZXNvdXJjZXM7XHJcbiAgICAgICAgY2MubG9hZGVyLmxvYWQocmVzLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0LCBjb3VudCwgbG9hZGVkQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50ID0gKGxvYWRlZENvdW50IC8gY291bnQgKiAxMDApIHwgMDtcclxuICAgICAgICAgICAgICAgIHBlcmNlbnQgPSBNYXRoLm1pbihwZXJjZW50LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5fbGFiZWwuc2V0U3RyaW5nKHNlbGYuX3RleHQgKyBwZXJjZW50ICsgXCIlXCIpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jYilcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNiKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuTG9hZGVyU2NlbmUuc2V0SW1hZ2UgPSBmdW5jdGlvbihpbWFnZSl7XHJcblxyXG59XHJcblxyXG5Mb2FkZXJTY2VuZS5wcmVsb2FkID0gZnVuY3Rpb24ocmVzb3VyY2VzLCBjYiwgc2VuZGVyKXtcclxuXHJcbiAgICBpZighdGhpcy5sb2FkZXJTY2VuZSkge1xyXG4gICAgICAgIHRoaXMubG9hZGVyU2NlbmUgPSBuZXcgTG9hZGVyU2NlbmUoKTtcclxuICAgICAgICB0aGlzLmxvYWRlclNjZW5lLmluaXQoc2VuZGVyLmxvYWRlckltYWdlLCBzZW5kZXIubG9hZGVyVGV4dCwgc2VuZGVyLmxvYWRlckZvbnQpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5sb2FkZXJTY2VuZS5pbml0V2l0aFJlc291cmNlcyhyZXNvdXJjZXMsIGNiKTtcclxuICAgIGNjLmRpcmVjdG9yLnJ1blNjZW5lKHRoaXMubG9hZGVyU2NlbmUpO1xyXG4gICAgcmV0dXJuIHRoaXMubG9hZGVyU2NlbmU7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlclNjZW5lOyIsInZhciBHZW5lQ29jb3NKUyA9IHtcclxuICAgIExvYWRlclNjZW5lOiByZXF1aXJlKFwiLi9jbGFzcy9Mb2FkZXJTY2VuZS5qc1wiKVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW5lQ29jb3NKUzsiLCIvKioqIGVhc2UubWluLTAuMi40LmpzICoqKi9cclxuXHJcbnZhciBlYXNlanM9e307XHJcbihmdW5jdGlvbihCLG4pe3ZhciBqPXt9LGg9ZnVuY3Rpb24oYil7dmFyIGI9KFwiL1wiPT09Yi5zdWJzdHIoMCwxKT9iOm4rXCIvXCIrYikucmVwbGFjZSgvKFteXFwvXStcXC9cXC5cXC5cXC98XFwuXFwvfF5cXC8pL2csXCJcIiksYz1qW2JdO2lmKHZvaWQgMD09PWMpdGhyb3dcIltlYXNlLmpzXSBVbmRlZmluZWQgbW9kdWxlOiBcIitiO3JldHVybiBjLmV4cG9ydHN9OyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBjO3RoaXMuX19fJCRpZCQkPWUrZigxRTgqYSgpKX1iLmV4cG9ydHM9e307bj1cInV0aWwvc3ltYm9sXCI7dmFyIGE9TWF0aC5yYW5kb20sZj1NYXRoLmZsb29yLGU9XCIgXCIrU3RyaW5nLmZyb21DaGFyQ29kZShmKDEwKmEoKSklMzErMSkrXCIkXCI7Yy5wcm90b3R5cGU9e3RvU3RyaW5nOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX19fJCRpZCQkfX07Yi5leHBvcnRzPWN9KShqW1widXRpbC9zeW1ib2wvRmFsbGJhY2tTeW1ib2xcIl09e30sXCIuXCIpO1xyXG4gICAgKGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoKXtpZighKHRoaXMgaW5zdGFuY2VvZiBjKSlyZXR1cm4gbmV3IGM7dGhpcy5fYWx0PXt9fWIuZXhwb3J0cz17fTtuPVwidXRpbFwiOygwLGV2YWwpKFwidmFyIF90aGVfZ2xvYmFsPXRoaXNcIik7Yy5leHBvc2U9ZnVuY3Rpb24oKXtyZXR1cm4gX3RoZV9nbG9iYWx9O2MucHJvdG90eXBlPXtwcm92aWRlQWx0OmZ1bmN0aW9uKGEsYyl7aWYoISh2b2lkIDAhPT1fdGhlX2dsb2JhbFthXXx8dm9pZCAwIT09dGhpcy5fYWx0W2FdKSlyZXR1cm4gdGhpcy5fYWx0W2FdPWMoKSx0aGlzfSxnZXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHZvaWQgMCE9PXRoaXMuX2FsdFthXT90aGlzLl9hbHRbYV06X3RoZV9nbG9iYWxbYV19fTtiLmV4cG9ydHM9Y30pKGpbXCJ1dGlsL0dsb2JhbFwiXT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2IuZXhwb3J0cz17fTtuPVwidXRpbFwiO3ZhciBjPWgoXCIuL3N5bWJvbC9GYWxsYmFja1N5bWJvbFwiKSxhPWgoXCIuL0dsb2JhbFwiKS5leHBvc2UoKTtcclxuICAgICAgICBiLmV4cG9ydHM9YS5TeW1ib2x8fGN9KShqW1widXRpbC9TeW1ib2xcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtiPWIuZXhwb3J0cz17fTtuPVwiLlwiO3ZhciBjPXtcInB1YmxpY1wiOjEsXCJwcm90ZWN0ZWRcIjoyLFwicHJpdmF0ZVwiOjQsXCJzdGF0aWNcIjo4LFwiYWJzdHJhY3RcIjoxNixcImNvbnN0XCI6MzIsdmlydHVhbDo2NCxvdmVycmlkZToxMjgscHJveHk6MjU2LHdlYWs6NTEyfSxhPXthbW9kczpjW1wicHVibGljXCJdfGNbXCJwcm90ZWN0ZWRcIl18Y1tcInByaXZhdGVcIl0sdmlydHVhbDpjW1wiYWJzdHJhY3RcIl18Yy52aXJ0dWFsfTtiLmt2YWxzPWM7Yi5rbWFza3M9YTtiLnBhcnNlS2V5d29yZHM9ZnVuY3Rpb24oYil7dmFyIGU9YixkPVtdLGc9MCxpPXt9O2lmKDEhPT0oZD0oXCJcIitiKS5zcGxpdCgvXFxzKy8pKS5sZW5ndGgpe2U9ZC5wb3AoKTtmb3IoYj1kLmxlbmd0aDtiLS07KXt2YXIgQz1kW2JdLHI9Y1tDXTtpZighcil0aHJvdyBFcnJvcihcIlVuZXhwZWN0ZWQga2V5d29yZCBmb3IgJ1wiK2UrXCInOiBcIitcclxuICAgICAgICBDKTtpW0NdPSEwO2d8PXJ9fWUubWF0Y2goL15fW15fXS8pJiYhKGcmYS5hbW9kcykmJihpW1wicHJpdmF0ZVwiXT0hMCxnfD1jW1wicHJpdmF0ZVwiXSk7cmV0dXJue25hbWU6ZSxrZXl3b3JkczppLGJpdHdvcmRzOmd9fX0pKGoucHJvcF9wYXJzZXI9e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKGEpe3Rocm93IGE7fWZ1bmN0aW9uIGEoYSxjLGIpe2Zvcih2YXIgZT1iLmxlbmd0aDtlLS07KW51bGw9PT1iW2VdLm1hdGNoKC9eW2Etel9dW2EtejAtOV9dKiQvaSkmJmEoU3ludGF4RXJyb3IoXCJNZW1iZXIgXCIrYytcIiBjb250YWlucyBpbnZhbGlkIHBhcmFtZXRlciAnXCIrYltlXStcIidcIikpfWZ1bmN0aW9uIGYoKXtyZXR1cm4gZz9mdW5jdGlvbihhLGMsYil7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsYyx7dmFsdWU6YixlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiExLGNvbmZpZ3VyYWJsZTohMX0pfTpmdW5jdGlvbihhLGMsYil7YVtjXT1ifX12YXIgZT1iLmV4cG9ydHM9e307bj1cIi5cIjtcclxuICAgICAgICB2YXIgZD1oKFwiLi9wcm9wX3BhcnNlclwiKS5wYXJzZUtleXdvcmRzLGc7YTp7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSl0cnl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LFwieFwiLHt9KTtnPSEwO2JyZWFrIGF9Y2F0Y2goaSl7fWc9ITF9ZS5HbG9iYWw9aChcIi4vdXRpbC9HbG9iYWxcIik7ZS5mcmVlemU9XCJmdW5jdGlvblwiPT09dHlwZW9mIE9iamVjdC5mcmVlemU/T2JqZWN0LmZyZWV6ZTpmdW5jdGlvbigpe307ZS5kZWZpbmVQcm9wZXJ0eUZhbGxiYWNrPWZ1bmN0aW9uKGEpe2lmKHZvaWQgMD09PWEpcmV0dXJuIWc7Zz0hYTtlLmRlZmluZVNlY3VyZVByb3A9ZigpO3JldHVybiBlfTtlLmRlZmluZVNlY3VyZVByb3A9ZigpO2UuY2xvbmU9ZnVuY3Rpb24gcihhLGMpe2M9ISFjO2lmKGEgaW5zdGFuY2VvZiBBcnJheSl7aWYoIWMpcmV0dXJuIGEuc2xpY2UoMCk7Zm9yKHZhciBiPVtdLGU9MCxkPWEubGVuZ3RoO2U8ZDtlKyspYi5wdXNoKHIoYVtlXSxjKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBifWlmKFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBhJiZhIGluc3RhbmNlb2YgT2JqZWN0KXtiPXt9O2U9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtmb3IoZCBpbiBhKWUuY2FsbChhLGQpJiYoYltkXT1jP3IoYVtkXSk6YVtkXSk7cmV0dXJuIGJ9cmV0dXJuIGF9O2UuY29weVRvPWZ1bmN0aW9uKGEsYyxiKXt2YXIgYj0hIWIsZDtpZighKGEgaW5zdGFuY2VvZiBPYmplY3QpfHwhKGMgaW5zdGFuY2VvZiBPYmplY3QpKXRocm93IFR5cGVFcnJvcihcIk11c3QgcHJvdmlkZSBib3RoIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gb2JqZWN0c1wiKTtpZihnKWZvcih2YXIgZiBpbiBjKWQ9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjLGYpLGQuZ2V0fHxkLnNldD9PYmplY3QuZGVmaW5lUHJvcGVydHkoYSxmLGQpOmFbZl09Yj9lLmNsb25lKGNbZl0sITApOmNbZl07ZWxzZSBmb3IoZiBpbiBjKWFbZl09Yj9lLmNsb25lKGNbZl0sITApOmNbZl07cmV0dXJuIGF9O2UucHJvcFBhcnNlPVxyXG4gICAgICAgICAgICBmdW5jdGlvbihiLGYscCl7dmFyIHY9ZnVuY3Rpb24oKXt9LGk9Zi5lYWNofHx2b2lkIDAsaD1mLnByb3BlcnR5fHx2LG09Zi5tZXRob2R8fHYsdj1mLmdldHNldHx8dixsPWYua2V5d29yZFBhcnNlcnx8ZCx4PWYuX3Rocm93fHxjLGo9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxzPXt9LGs9XCJcIixzPXt9LG89bnVsbCx0PSExLHU9ITEsdztmb3IodyBpbiBiKWlmKGouY2FsbChiLHcpKXtpZihnKWs9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiLHcpLHQ9ay5nZXQsdT1rLnNldDtvPVwiZnVuY3Rpb25cIj09PXR5cGVvZiB0P3ZvaWQgMDpiW3ddO3M9bCh3KXx8e307az1zLm5hbWV8fHc7cz1zLmtleXdvcmRzfHx7fTtpZihmLmFzc3VtZUFic3RyYWN0fHxzW1wiYWJzdHJhY3RcIl0mJiFzLm92ZXJyaWRlKXNbXCJhYnN0cmFjdFwiXT0hMCxvIGluc3RhbmNlb2YgQXJyYXl8fHgoVHlwZUVycm9yKFwiTWlzc2luZyBwYXJhbWV0ZXIgbGlzdCBmb3IgYWJzdHJhY3QgbWV0aG9kOiBcIitcclxuICAgICAgICAgICAgICAgIGspKSxhKHgsayxvKSxvPWUuY3JlYXRlQWJzdHJhY3RNZXRob2QuYXBwbHkodGhpcyxvKTtpJiZpLmNhbGwocCxrLG8scyk7dHx8dT92LmNhbGwocCxrLHQsdSxzKTpcImZ1bmN0aW9uXCI9PT10eXBlb2Ygb3x8cy5wcm94eT9tLmNhbGwocCxrLG8sZS5pc0Fic3RyYWN0TWV0aG9kKG8pLHMpOmguY2FsbChwLGssbyxzKX19O2UuY3JlYXRlQWJzdHJhY3RNZXRob2Q9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGI9YXJndW1lbnRzLmxlbmd0aDtiLS07KWNbYl09YXJndW1lbnRzW2JdO2I9ZnVuY3Rpb24oKXt0aHJvdyBFcnJvcihcIkNhbm5vdCBjYWxsIGFic3RyYWN0IG1ldGhvZFwiKTt9O2UuZGVmaW5lU2VjdXJlUHJvcChiLFwiYWJzdHJhY3RGbGFnXCIsITApO2UuZGVmaW5lU2VjdXJlUHJvcChiLFwiZGVmaW5pdGlvblwiLGMpO2UuZGVmaW5lU2VjdXJlUHJvcChiLFwiX19sZW5ndGhcIixhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gYn07ZS5pc0Fic3RyYWN0TWV0aG9kPWZ1bmN0aW9uKGEpe3JldHVyblwiZnVuY3Rpb25cIj09PVxyXG4gICAgICAgICAgICB0eXBlb2YgYSYmITA9PT1hLmFic3RyYWN0RmxhZz8hMDohMX07ZS5hcnJheVNocmluaz1mdW5jdGlvbihhKXtmb3IodmFyIGM9W10sYj0wLGU9YS5sZW5ndGg7YjxlO2IrKyl7dmFyIGQ9YVtiXTt2b2lkIDAhPT1kJiZjLnB1c2goZCl9cmV0dXJuIGN9O2UuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yPWcmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3J8fGZ1bmN0aW9uKGEsYyl7cmV0dXJuIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLGMpP3ZvaWQgMDp7Z2V0OnZvaWQgMCxzZXQ6dm9pZCAwLHdyaXRhYmxlOiEwLGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHZhbHVlOmFbY119fTtlLmdldFByb3RvdHlwZU9mPU9iamVjdC5nZXRQcm90b3R5cGVPZnx8ZnVuY3Rpb24oKXt9O2UuZ2V0UHJvcGVydHlEZXNjcmlwdG9yPWZ1bmN0aW9uKGEsYyxiKXt2YXIgYj0hIWIsZD1lLmdldE93blByb3BlcnR5RGVzY3JpcHRvcihhLGMpLGE9ZS5nZXRQcm90b3R5cGVPZihhKTtcclxuICAgICAgICAgICAgcmV0dXJuIWQmJmEmJighYnx8ZS5nZXRQcm90b3R5cGVPZihhKSk/ZS5nZXRQcm9wZXJ0eURlc2NyaXB0b3IoYSxjLGIpOmR9O2UuZGVmaW5lU2VjdXJlUHJvcChlLmdldFByb3BlcnR5RGVzY3JpcHRvcixcImNhblRyYXZlcnNlXCIsT2JqZWN0LmdldFByb3RvdHlwZU9mPyEwOiExKX0pKGoudXRpbD17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoYSl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBjKGEpO2lmKCEoYSBpbnN0YW5jZW9mIEVycm9yKSl0aHJvdyBUeXBlRXJyb3IoXCJNdXN0IHByb3ZpZGUgZXhjZXB0aW9uIHRvIHdyYXBcIik7RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcyxhLm1lc3NhZ2UpO3RoaXMubWVzc2FnZT1hLm1lc3NhZ2U7dGhpcy5uYW1lPVwiV2FybmluZ1wiO3RoaXMuX2Vycm9yPWE7dGhpcy5zdGFjaz1hLnN0YWNrJiZhLnN0YWNrLnJlcGxhY2UoL14uKj9cXG4rLyx0aGlzLm5hbWUrXCI6IFwiK3RoaXMubWVzc2FnZStcIlxcblwiKX1cclxuICAgICAgICBiLmV4cG9ydHM9e307bj1cIndhcm5cIjtjLnByb3RvdHlwZT1FcnJvcigpO2MucHJvdG90eXBlLmNvbnN0cnVjdG9yPWM7Yy5wcm90b3R5cGUubmFtZT1cIldhcm5pbmdcIjtjLnByb3RvdHlwZS5nZXRFcnJvcj1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9lcnJvcn07Yi5leHBvcnRzPWN9KShqW1wid2Fybi9XYXJuaW5nXCJdPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYygpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGMpKXJldHVybiBuZXcgY31iLmV4cG9ydHM9e307bj1cIndhcm5cIjtjLnByb3RvdHlwZT17aGFuZGxlOmZ1bmN0aW9uKCl7fX07Yi5leHBvcnRzPWN9KShqW1wid2Fybi9EaXNtaXNzaXZlSGFuZGxlclwiXT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoYSl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBjKGEpO3RoaXMuX2NvbnNvbGU9YXx8e319Yi5leHBvcnRzPXt9O249XCJ3YXJuXCI7Yy5wcm90b3R5cGU9e2hhbmRsZTpmdW5jdGlvbihhKXt2YXIgYz1cclxuICAgICAgICB0aGlzLl9jb25zb2xlLndhcm58fHRoaXMuX2NvbnNvbGUubG9nO2MmJmMuY2FsbCh0aGlzLl9jb25zb2xlLFwiV2FybmluZzogXCIrYS5tZXNzYWdlKX19O2IuZXhwb3J0cz1jfSkoaltcIndhcm4vTG9nSGFuZGxlclwiXT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoKXtpZighKHRoaXMgaW5zdGFuY2VvZiBjKSlyZXR1cm4gbmV3IGN9Yi5leHBvcnRzPXt9O249XCJ3YXJuXCI7Yy5wcm90b3R5cGU9e2hhbmRsZTpmdW5jdGlvbihhKXt0aHJvdyBhLmdldEVycm9yKCk7fX07Yi5leHBvcnRzPWN9KShqW1wid2Fybi9UaHJvd0hhbmRsZXJcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtiLmV4cG9ydHM9e307bj1cIi5cIjtiLmV4cG9ydHM9e1dhcm5pbmc6aChcIi4vd2Fybi9XYXJuaW5nXCIpLERpc21pc3NpdmVIYW5kbGVyOmgoXCIuL3dhcm4vRGlzbWlzc2l2ZUhhbmRsZXJcIiksTG9nSGFuZGxlcjpoKFwiLi93YXJuL0xvZ0hhbmRsZXJcIiksVGhyb3dIYW5kbGVyOmgoXCIuL3dhcm4vVGhyb3dIYW5kbGVyXCIpfX0pKGoud2Fybj1cclxuICAgIHt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYyh3LGEpe3RyeXtpZihhIGluc3RhbmNlb2YgdylyZXR1cm4hMH1jYXRjaChjKXt9cmV0dXJuITF9ZnVuY3Rpb24gYSh3LGEsYyl7YT10aGlzLmRlZnM7aWYoITA9PT1vW3ddKXRocm93IEVycm9yKHcrXCIgaXMgcmVzZXJ2ZWRcIik7aWYocy5jYWxsKGEsdykmJiFjLndlYWsmJiFhW3ddLndlYWspdGhyb3cgRXJyb3IoXCJDYW5ub3QgcmVkZWZpbmUgbWV0aG9kICdcIit3K1wiJyBpbiBzYW1lIGRlY2xhcmF0aW9uXCIpO2Fbd109Y31mdW5jdGlvbiBmKGEsYyxiKXt0aGlzLl9jYi5fbWVtYmVyQnVpbGRlci5idWlsZFByb3AoaShiKT90aGlzLnN0YXRpY19tZW1iZXJzLnByb3BzOnRoaXMucHJvcF9pbml0LG51bGwsYSxjLGIsdGhpcy5iYXNlKX1mdW5jdGlvbiBlKGEsYyxiLGUpe3ZhciBkPWkoZSk/dGhpcy5zdGF0aWNfbWVtYmVycy5tZXRob2RzOnRoaXMubWVtYmVycyxrPWkoZSk/dGhpcy5zdGF0aWNJbnN0TG9va3VwOm0uZ2V0TWV0aG9kSW5zdGFuY2U7XHJcbiAgICAgICAgdGhpcy5fY2IuX21lbWJlckJ1aWxkZXIuYnVpbGRHZXR0ZXJTZXR0ZXIoZCxudWxsLGEsYyxiLGUsayx0aGlzLmNsYXNzX2lkLHRoaXMuYmFzZSl9ZnVuY3Rpb24gZChhLGMsYixlKXt2YXIgZD1pKGUpLGs9ZD90aGlzLnN0YXRpY19tZW1iZXJzLm1ldGhvZHM6dGhpcy5tZW1iZXJzLGQ9ZD90aGlzLnN0YXRpY0luc3RMb29rdXA6bS5nZXRNZXRob2RJbnN0YW5jZTtpZighMD09PXRbYV0mJihlW1wicHJvdGVjdGVkXCJdfHxlW1wicHJpdmF0ZVwiXSkpdGhyb3cgVHlwZUVycm9yKGErXCIgbXVzdCBiZSBwdWJsaWNcIik7dGhpcy5fY2IuX21lbWJlckJ1aWxkZXIuYnVpbGRNZXRob2QoayxudWxsLGEsYyxlLGQsdGhpcy5jbGFzc19pZCx0aGlzLmJhc2UsdGhpcy5zdGF0ZSkmJihiPyh0aGlzLmFic3RyYWN0X21ldGhvZHNbYV09ITAsdGhpcy5hYnN0cmFjdF9tZXRob2RzLl9fbGVuZ3RoKyspOnMuY2FsbCh0aGlzLmFic3RyYWN0X21ldGhvZHMsYSkmJiExPT09YiYmKGRlbGV0ZSB0aGlzLmFic3RyYWN0X21ldGhvZHNbYV0sXHJcbiAgICAgICAgdGhpcy5hYnN0cmFjdF9tZXRob2RzLl9fbGVuZ3RoLS0pLGUudmlydHVhbCYmKHRoaXMudmlydHVhbF9tZW1iZXJzW2FdPSEwKSl9ZnVuY3Rpb24gZyhhLGMsYixlKXtpZihhLl9fXyQkYWJzdHJhY3QkJCl7aWYoIWUmJjA9PT1iLl9fbGVuZ3RoKXRocm93IFR5cGVFcnJvcihcIkNsYXNzIFwiKyhjfHxcIihhbm9ueW1vdXMpXCIpK1wiIHdhcyBkZWNsYXJlZCBhcyBhYnN0cmFjdCwgYnV0IGNvbnRhaW5zIG5vIGFic3RyYWN0IG1lbWJlcnNcIik7fWVsc2UgaWYoMDxiLl9fbGVuZ3RoKWlmKGUpYS5fX18kJGFic3RyYWN0JCQ9ITA7ZWxzZSB0aHJvdyBUeXBlRXJyb3IoXCJDbGFzcyBcIisoY3x8XCIoYW5vbnltb3VzKVwiKStcIiBjb250YWlucyBhYnN0cmFjdCBtZW1iZXJzIGFuZCBtdXN0IHRoZXJlZm9yZSBiZSBkZWNsYXJlZCBhYnN0cmFjdFwiKTt9ZnVuY3Rpb24gaShhKXtyZXR1cm4gYVtcInN0YXRpY1wiXXx8YVtcImNvbnN0XCJdPyEwOiExfWZ1bmN0aW9uIEMoYSxjKXt2YXIgYj1jLl9fY2lkP20uZ2V0TWV0YShjKTpcclxuICAgICAgICB2b2lkIDA7cmV0dXJuIGI/YVt1XS5tZXRhPWwuY2xvbmUoYiwhMCk6YVt1XS5tZXRhPXtpbXBsZW1lbnRlZDpbXX19ZnVuY3Rpb24gcihhLGMpe2wuZGVmaW5lU2VjdXJlUHJvcChhLFwiX19paWRcIixjKX1mdW5jdGlvbiB5KGEpe3ZhciBjPWZ1bmN0aW9uKCl7fTtjLnByb3RvdHlwZT1hO2wuZGVmaW5lU2VjdXJlUHJvcChhLHUse30pO2FbdV0udmlzPW5ldyBjfWZ1bmN0aW9uIHAoYSl7dmFyIGM9ZnVuY3Rpb24oYyl7cmV0dXJuIGIuZXhwb3J0cy5pc0luc3RhbmNlT2YoYyxhKX07bC5kZWZpbmVTZWN1cmVQcm9wKGEsXCJpc0luc3RhbmNlT2ZcIixjKTtsLmRlZmluZVNlY3VyZVByb3AoYSxcImlzQVwiLGMpfWZ1bmN0aW9uIHYoYSxjKXt2YXIgYj0wPGMuX19sZW5ndGg/ITA6ITE7bC5kZWZpbmVTZWN1cmVQcm9wKGEsXCJpc0Fic3RyYWN0XCIsZnVuY3Rpb24oKXtyZXR1cm4gYn0pfWZ1bmN0aW9uIGooYSxjKXtsLmRlZmluZVNlY3VyZVByb3AoYSxcIl9fY2lkXCIsYyk7bC5kZWZpbmVTZWN1cmVQcm9wKGEucHJvdG90eXBlLFxyXG4gICAgICAgIFwiX19jaWRcIixjKX1mdW5jdGlvbiBBKGEsYyl7YS5fX18kJGZpbmFsJCQ9ISFjLl9fXyQkZmluYWwkJDthLl9fXyQkYWJzdHJhY3QkJD0hIWMuX19fJCRhYnN0cmFjdCQkO2MuX19fJCRmaW5hbCQkPWMuX19fJCRhYnN0cmFjdCQkPXZvaWQgMH12YXIgbT1iLmV4cG9ydHM9e307bj1cIi5cIjt2YXIgbD1oKFwiLi91dGlsXCIpLHg9aChcIi4vd2FyblwiKS5XYXJuaW5nLHE9aChcIi4vdXRpbC9TeW1ib2xcIikscz1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LGs9ITE9PT1PYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoe3RvU3RyaW5nOmZ1bmN0aW9uKCl7fX0sXCJ0b1N0cmluZ1wiKT8hMDohMSxvPXtfX2luaXRQcm9wczohMCxjb25zdHJ1Y3RvcjohMH0sdD17X19jb25zdHJ1Y3Q6ITAsX19taXhpbjohMCx0b1N0cmluZzohMCxfX3RvU3RyaW5nOiEwfSx1PXEoKTtiLmV4cG9ydHM9bT1mdW5jdGlvbihhLGMsZSl7aWYoISh0aGlzIGluc3RhbmNlb2YgbSkpcmV0dXJuIG5ldyBiLmV4cG9ydHMoYSxcclxuICAgICAgICBjLGUpO3RoaXMuX3dhcm5IYW5kbGVyPWE7dGhpcy5fbWVtYmVyQnVpbGRlcj1jO3RoaXMuX3Zpc0ZhY3Rvcnk9ZTt0aGlzLl9pbnN0YW5jZUlkPXRoaXMuX2NsYXNzSWQ9MDt0aGlzLl9zcHJvcEludGVybmFsPXRoaXMuX2V4dGVuZGluZz0hMX07bS5DbGFzc0Jhc2U9ZnVuY3Rpb24oKXt9O2wuZGVmaW5lU2VjdXJlUHJvcChtLkNsYXNzQmFzZSxcIl9fY2lkXCIsMCk7bS5DbGFzc0Jhc2UuJD1mdW5jdGlvbihhLGMpe2lmKHZvaWQgMCE9PWMpdGhyb3cgUmVmZXJlbmNlRXJyb3IoXCJDYW5ub3Qgc2V0IHZhbHVlIG9mIHVuZGVjbGFyZWQgc3RhdGljIHByb3BlcnR5ICdcIithK1wiJ1wiKTt9O20uZ2V0UmVzZXJ2ZWRNZW1iZXJzPWZ1bmN0aW9uKCl7cmV0dXJuIGwuY2xvbmUobywhMCl9O20uZ2V0Rm9yY2VkUHVibGljTWV0aG9kcz1mdW5jdGlvbigpe3JldHVybiBsLmNsb25lKHQsITApfTttLmdldE1ldGE9ZnVuY3Rpb24oYSl7cmV0dXJuKGFbdV18fHt9KS5tZXRhfHxudWxsfTttLmlzSW5zdGFuY2VPZj1cclxuICAgICAgICBmdW5jdGlvbihhLGIpe3JldHVybiFhfHwhYj8hMTohIShhLl9faXNJbnN0YW5jZU9mfHxjKShhLGIpfTttLnByb3RvdHlwZS5idWlsZD1mdW5jdGlvbihhLGMpe3ZhciBiPXRoaXM7dGhpcy5fZXh0ZW5kaW5nPSEwO3ZhciBlPWFyZ3VtZW50cyxkPWUubGVuZ3RoLGY9KDA8ZD9lW2QtMV06MCl8fHt9LHQ9KDE8ZD9lW2QtMl06MCl8fG0uQ2xhc3NCYXNlLGU9dGhpcy5fZ2V0QmFzZSh0KSxkPVwiXCIsbz0hMSxyPXRoaXMuX21lbWJlckJ1aWxkZXIuaW5pdE1lbWJlcnMoKSxwPXRoaXMuX21lbWJlckJ1aWxkZXIuaW5pdE1lbWJlcnMoZSksaT17bWV0aG9kczp0aGlzLl9tZW1iZXJCdWlsZGVyLmluaXRNZW1iZXJzKCkscHJvcHM6dGhpcy5fbWVtYmVyQnVpbGRlci5pbml0TWVtYmVycygpfSxvPW0uZ2V0TWV0YSh0KXx8e30seT1sLmNsb25lKG8uYWJzdHJhY3RNZXRob2RzKXx8e19fbGVuZ3RoOjB9LHM9bC5jbG9uZShvLnZpcnR1YWxNZW1iZXJzKXx8e307aWYoITA9PT10Ll9fXyQkZmluYWwkJCl0aHJvdyBFcnJvcihcIkNhbm5vdCBleHRlbmQgZmluYWwgY2xhc3MgXCIrXHJcbiAgICAgICAgKHRbdV0ubWV0YS5uYW1lfHxcIihhbm9ueW1vdXMpXCIpKTsoZD1mLl9fbmFtZSkmJmRlbGV0ZSBmLl9fbmFtZTt2b2lkIDAhPT0obz1mLl9fXyQkYXV0byRhYnN0cmFjdCQkKSYmZGVsZXRlIGYuX19fJCRhdXRvJGFic3RyYWN0JCQ7aWYoayYmZi50b1N0cmluZyE9PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcpZi5fX3RvU3RyaW5nPWYudG9TdHJpbmc7dGhpcy5fY2xhc3NJZCsrO3ZvaWQgMD09PShlW3VdfHx7fSkudmlzJiZ0aGlzLl9kaXNjb3ZlclByb3RvUHJvcHMoZSxyKTt0cnl7dGhpcy5idWlsZE1lbWJlcnMoZix0aGlzLl9jbGFzc0lkLHQscix7YWxsOnAsXCJhYnN0cmFjdFwiOnksXCJzdGF0aWNcIjppLHZpcnR1YWw6c30sZnVuY3Rpb24oKXtyZXR1cm4gcS5fX18kJHN2aXMkJH0pfWNhdGNoKGgpe2lmKGggaW5zdGFuY2VvZiB4KXRoaXMuX3dhcm5IYW5kbGVyLmhhbmRsZShoKTtlbHNlIHRocm93IGg7fWUuX19fJCRwYXJlbnQkJD10LnByb3RvdHlwZTt2YXIgcT10aGlzLmNyZWF0ZUN0b3IoZCxcclxuICAgICAgICB5LHApO3RoaXMuaW5pdFN0YXRpY1Zpc2liaWxpdHlPYmoocSk7dmFyIG49dGhpcyxCPWZ1bmN0aW9uKGEsYyl7bi5hdHRhY2hTdGF0aWMoYSxpLHQsYyl9O0IocSwhMSk7dGhpcy5fYXR0YWNoUHJvcEluaXQoZSxyLHAscSx0aGlzLl9jbGFzc0lkKTtxLnByb3RvdHlwZT1lO3EucHJvdG90eXBlLmNvbnN0cnVjdG9yPXE7cS5fX18kJHByb3BzJCQ9cjtxLl9fXyQkbWV0aG9kcyQkPXA7cS5fX18kJHNpbml0JCQ9QjtBKHEsZik7ZyhxLGQseSxvKTtsLmRlZmluZVNlY3VyZVByb3AoZSxcIl9fc2VsZlwiLHEuX19fJCRzdmlzJCQpO289QyhxLHQpO28uYWJzdHJhY3RNZXRob2RzPXk7by52aXJ0dWFsTWVtYmVycz1zO28ubmFtZT1kO3YocSx5KTtqKHEsdGhpcy5fY2xhc3NJZCk7cS5hc1Byb3RvdHlwZT1mdW5jdGlvbigpe2IuX2V4dGVuZGluZz0hMDt2YXIgYT1xKCk7Yi5fZXh0ZW5kaW5nPSExO3JldHVybiBhfTt0aGlzLl9leHRlbmRpbmc9ITE7cmV0dXJuIHF9O20ucHJvdG90eXBlLl9nZXRCYXNlPVxyXG4gICAgICAgIGZ1bmN0aW9uKGEpe3N3aXRjaCh0eXBlb2YgYSl7Y2FzZSBcImZ1bmN0aW9uXCI6cmV0dXJuIG5ldyBhO2Nhc2UgXCJvYmplY3RcIjpyZXR1cm4gYX10aHJvdyBUeXBlRXJyb3IoXCJNdXN0IGV4dGVuZCBmcm9tIENsYXNzLCBjb25zdHJ1Y3RvciBvciBvYmplY3RcIik7fTttLnByb3RvdHlwZS5fZGlzY292ZXJQcm90b1Byb3BzPWZ1bmN0aW9uKGEsYyl7dmFyIGI9T2JqZWN0Lmhhc093blByb3BlcnR5LGU7Zm9yKGUgaW4gYSl7dmFyIGQ9YVtlXTtiLmNhbGwoYSxlKSYmXCJmdW5jdGlvblwiIT09dHlwZW9mIGQmJnRoaXMuX21lbWJlckJ1aWxkZXIuYnVpbGRQcm9wKGMsbnVsbCxlLGQse30pfX07bS5wcm90b3R5cGUuYnVpbGRNZW1iZXJzPWZ1bmN0aW9uKGMsYixrLHQsdSxDKXt2YXIgbz17X2NiOnRoaXMscHJvcF9pbml0OnQsY2xhc3NfaWQ6YixiYXNlOmssc3RhdGljSW5zdExvb2t1cDpDLGRlZnM6e30sc3RhdGU6e30sbWVtYmVyczp1LmFsbCxhYnN0cmFjdF9tZXRob2RzOnVbXCJhYnN0cmFjdFwiXSxcclxuICAgICAgICBzdGF0aWNfbWVtYmVyczp1W1wic3RhdGljXCJdLHZpcnR1YWxfbWVtYmVyczp1LnZpcnR1YWx9LGc9e2VhY2g6YSxwcm9wZXJ0eTpmLGdldHNldDplLG1ldGhvZDpkfTtpZihjLl9fXyQkcGFyc2VyJCQpe3ZhciByPWMuX19fJCRwYXJzZXIkJDtkZWxldGUgYy5fX18kJHBhcnNlciQkO2I9ZnVuY3Rpb24oYSxjKXtnW2FdPWZ1bmN0aW9uKCl7Zm9yKHZhciBiPVtdLGU9YXJndW1lbnRzLmxlbmd0aDtlLS07KWJbZV09YXJndW1lbnRzW2VdO2IucHVzaChjKTtyW2FdLmFwcGx5KG8sYil9fTtyLmVhY2gmJmIoXCJlYWNoXCIsZy5lYWNoKTtyLnByb3BlcnR5JiZiKFwicHJvcGVydHlcIixnLnByb3BlcnR5KTtyLmdldHNldCYmYihcImdldHNldFwiLGcuZ2V0c2V0KTtyLm1ldGhvZCYmYihcIm1ldGhvZFwiLGcubWV0aG9kKX1sLnByb3BQYXJzZShjLGcsbyk7dGhpcy5fbWVtYmVyQnVpbGRlci5lbmQoby5zdGF0ZSl9O20ucHJvdG90eXBlLmNyZWF0ZUN0b3I9ZnVuY3Rpb24oYSxjLGIpe2E9MD09PWMuX19sZW5ndGg/XHJcbiAgICAgICAgdGhpcy5jcmVhdGVDb25jcmV0ZUN0b3IoYSxiKTp0aGlzLmNyZWF0ZUFic3RyYWN0Q3RvcihhKTtsLmRlZmluZVNlY3VyZVByb3AoYSx1LHt9KTtyZXR1cm4gYX07bS5wcm90b3R5cGUuY3JlYXRlQ29uY3JldGVDdG9yPWZ1bmN0aW9uKGEsYyl7ZnVuY3Rpb24gYigpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGIpKXJldHVybiBlPWFyZ3VtZW50cyxuZXcgYjt5KHRoaXMpO3RoaXMuX19pbml0UHJvcHMoKTtpZighZC5fZXh0ZW5kaW5nKXtyKHRoaXMsKytkLl9pbnN0YW5jZUlkKTt2YXIgaz1cImZ1bmN0aW9uXCI9PT10eXBlb2YgdGhpcy5fX18kJGN0b3IkcHJlJCQ7ayYmYi5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoXCJfX18kJGN0b3IkcHJlJCRcIikmJih0aGlzLl9fXyQkY3RvciRwcmUkJCh1KSxrPSExKTtcImZ1bmN0aW9uXCI9PT10eXBlb2YgdGhpcy5fX2NvbnN0cnVjdCYmdGhpcy5fX2NvbnN0cnVjdC5hcHBseSh0aGlzLGV8fGFyZ3VtZW50cyk7ayYmdGhpcy5fX18kJGN0b3IkcHJlJCQodSk7XHJcbiAgICAgICAgXCJmdW5jdGlvblwiPT09dHlwZW9mIHRoaXMuX19fJCRjdG9yJHBvc3QkJCYmdGhpcy5fX18kJGN0b3IkcG9zdCQkKHUpO2U9bnVsbDtwKHRoaXMpO2lmKCFzLmNhbGwoY1tcInB1YmxpY1wiXSxcInRvU3RyaW5nXCIpKXRoaXMudG9TdHJpbmc9Y1tcInB1YmxpY1wiXS5fX3RvU3RyaW5nfHwoYT9mdW5jdGlvbigpe3JldHVyblwiIzxcIithK1wiPlwifTpmdW5jdGlvbigpe3JldHVyblwiIzxhbm9ueW1vdXM+XCJ9KX19dmFyIGU9bnVsbCxkPXRoaXM7Yi50b1N0cmluZz1hP2Z1bmN0aW9uKCl7cmV0dXJuIGF9OmZ1bmN0aW9uKCl7cmV0dXJuXCIoQ2xhc3MpXCJ9O3JldHVybiBifTttLnByb3RvdHlwZS5jcmVhdGVBYnN0cmFjdEN0b3I9ZnVuY3Rpb24oYSl7dmFyIGM9dGhpcyxiPWZ1bmN0aW9uKCl7aWYoIWMuX2V4dGVuZGluZyl0aHJvdyBFcnJvcihcIkFic3RyYWN0IGNsYXNzIFwiKyhhfHxcIihhbm9ueW1vdXMpXCIpK1wiIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWRcIik7fTtiLnRvU3RyaW5nPWE/ZnVuY3Rpb24oKXtyZXR1cm4gYX06XHJcbiAgICAgICAgZnVuY3Rpb24oKXtyZXR1cm5cIihBYnN0cmFjdENsYXNzKVwifTtyZXR1cm4gYn07bS5wcm90b3R5cGUuX2F0dGFjaFByb3BJbml0PWZ1bmN0aW9uKGEsYyxiLGUsZCl7dmFyIGs9dGhpcztsLmRlZmluZVNlY3VyZVByb3AoYSxcIl9faW5pdFByb3BzXCIsZnVuY3Rpb24oZSl7dmFyIGU9ISFlLGY9YS5fX18kJHBhcmVudCQkLHQ9dGhpc1t1XS52aXMsZj1mJiZmLl9faW5pdFByb3BzO1wiZnVuY3Rpb25cIj09PXR5cGVvZiBmJiZmLmNhbGwodGhpcywhMCk7Zj1rLl92aXNGYWN0b3J5LmNyZWF0ZVByb3BQcm94eSh0aGlzLHQsY1tcInB1YmxpY1wiXSk7dD10W2RdPWsuX3Zpc0ZhY3Rvcnkuc2V0dXAoZixjLGIpO2V8fGwuZGVmaW5lU2VjdXJlUHJvcCh0LFwiX19pbnN0XCIsdGhpcyl9KX07bS5wcm90b3R5cGUuaW5pdFN0YXRpY1Zpc2liaWxpdHlPYmo9ZnVuY3Rpb24oYSl7dmFyIGM9dGhpcyxiPWZ1bmN0aW9uKCl7fTtiLnByb3RvdHlwZT1hO2I9bmV3IGI7YS5fX18kJHN2aXMkJD1iO2IuJD1mdW5jdGlvbigpe2MuX3Nwcm9wSW50ZXJuYWw9XHJcbiAgICAgICAgITA7dmFyIGI9YS4kLmFwcGx5KGEsYXJndW1lbnRzKTtjLl9zcHJvcEludGVybmFsPSExO3JldHVybiBifX07bS5wcm90b3R5cGUuYXR0YWNoU3RhdGljPWZ1bmN0aW9uKGEsYyxiLGUpe3ZhciBkPWMubWV0aG9kcyxrPWMucHJvcHMsZj10aGlzOyhjPWIuX19fJCRzaW5pdCQkKSYmYyhhLCEwKTtpZighZSlhLl9fXyQkc3Byb3BzJCQ9ayxsLmRlZmluZVNlY3VyZVByb3AoYSxcIiRcIixmdW5jdGlvbihjLGUpe3ZhciBkPSExLHQ9dGhpcy5fX18kJHNwcm9wcyQkP3RoaXM6YSx1PXQhPT1hLGQ9cy5jYWxsKGtbXCJwdWJsaWNcIl0sYykmJlwicHVibGljXCI7IWQmJmYuX3Nwcm9wSW50ZXJuYWwmJihkPXMuY2FsbChrW1wicHJvdGVjdGVkXCJdLGMpJiZcInByb3RlY3RlZFwifHwhdSYmcy5jYWxsKGtbXCJwcml2YXRlXCJdLGMpJiZcInByaXZhdGVcIik7aWYoITE9PT1kKXJldHVybihiLl9fY2lkJiZiLiR8fG0uQ2xhc3NCYXNlLiQpLmFwcGx5KHQsYXJndW1lbnRzKTtkPWtbZF1bY107aWYoMTxhcmd1bWVudHMubGVuZ3RoKXtpZihkWzFdW1wiY29uc3RcIl0pdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IG1vZGlmeSBjb25zdGFudCBwcm9wZXJ0eSAnXCIrXHJcbiAgICAgICAgYytcIidcIik7ZFswXT1lO3JldHVybiB0fXJldHVybiBkWzBdfSk7bC5jb3B5VG8oYSxkW1wicHVibGljXCJdLCEwKTtsLmNvcHlUbyhhLl9fXyQkc3ZpcyQkLGRbXCJwcm90ZWN0ZWRcIl0sITApO2V8fGwuY29weVRvKGEuX19fJCRzdmlzJCQsZFtcInByaXZhdGVcIl0sITApfTttLmdldE1ldGhvZEluc3RhbmNlPWZ1bmN0aW9uKGEsYyl7aWYodm9pZCAwPT09YSlyZXR1cm4gbnVsbDt2YXIgYj1hW3VdLGU7cmV0dXJuIGEuX19paWQmJmImJihlPWIudmlzKT9lW2NdOm51bGx9fSkoai5DbGFzc0J1aWxkZXI9e30sXCIuXCIpOyhmdW5jdGlvbihiKXt2YXIgYz1iLmV4cG9ydHM9e307bj1cIi5cIjtiLmV4cG9ydHM9Yz1mdW5jdGlvbihhKXtpZighKHRoaXMgaW5zdGFuY2VvZiBjKSlyZXR1cm4gbmV3IGIuZXhwb3J0cyhhKTt0aGlzLl9mYWN0b3J5PWF9O2MucHJvdG90eXBlLndyYXBNZXRob2Q9ZnVuY3Rpb24oYSxjLGIsZCxnLGkpe3JldHVybiB0aGlzLl9mYWN0b3J5KGEsYyxiLGQsZyxpKX19KShqLk1ldGhvZFdyYXBwZXJGYWN0b3J5PVxyXG4gICAge30sXCIuXCIpOyhmdW5jdGlvbihiKXtiPWIuZXhwb3J0cz17fTtuPVwiLlwiO2Iuc3RhbmRhcmQ9e3dyYXBPdmVycmlkZTpmdW5jdGlvbihjLGEsYixlKXt2YXIgZD1mdW5jdGlvbigpe3ZhciBkPWUodGhpcyxiKXx8dGhpc3x8e30saT12b2lkIDAsQz1kLl9fc3VwZXI7ZC5fX3N1cGVyPWE7aT1jLmFwcGx5KGQsYXJndW1lbnRzKTtkLl9fc3VwZXI9QztyZXR1cm4gaT09PWQ/dGhpczppfTtkW1wic3VwZXJcIl09YTtyZXR1cm4gZH0sd3JhcE5ldzpmdW5jdGlvbihjLGEsYixlKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYT1lKHRoaXMsYil8fHRoaXMsZz12b2lkIDAsZz1jLmFwcGx5KGEsYXJndW1lbnRzKTtyZXR1cm4gZz09PWE/dGhpczpnfX0sd3JhcFByb3h5OmZ1bmN0aW9uKGMsYSxiLGUsZCxnKXt2YXIgaT1nJiZnW1wic3RhdGljXCJdLGE9ZnVuY3Rpb24oKXt2YXIgYT1lKHRoaXMsYil8fHRoaXMscj12b2lkIDAsYT1pP2EuJChjKTphW2NdO2lmKCEobnVsbCE9PWEmJlwib2JqZWN0XCI9PT10eXBlb2YgYSYmXHJcbiAgICAgICAgXCJmdW5jdGlvblwiPT09dHlwZW9mIGFbZF0pKXRocm93IFR5cGVFcnJvcihcIlVuYWJsZSB0byBwcm94eSBcIitkK1wiKCkgY2FsbCB0byAnXCIrYytcIic7ICdcIitjK1wiJyBpcyB1bmRlZmluZWQgb3IgJ1wiK2QrXCInIGlzIG5vdCBhIGZ1bmN0aW9uLlwiKTtyPWFbZF0uYXBwbHkoYSxhcmd1bWVudHMpO3JldHVybiByPT09YT90aGlzOnJ9O2EuX19sZW5ndGg9TmFOO3JldHVybiBhfX19KShqLk1ldGhvZFdyYXBwZXJzPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYyhhKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fX18kJHN1cGVyJCQucHJvdG90eXBlW2FdLmFwcGx5KHRoaXMuX19fJCRwbW8kJCxhcmd1bWVudHMpfX1mdW5jdGlvbiBhKGEsYyxiKXtpZihjW1wicHJpdmF0ZVwiXSlyZXR1cm4oY1tcInB1YmxpY1wiXXx8Y1tcInByb3RlY3RlZFwiXSkmJmYoYiksYVtcInByaXZhdGVcIl07aWYoY1tcInByb3RlY3RlZFwiXSlyZXR1cm4oY1tcInB1YmxpY1wiXXx8Y1tcInByaXZhdGVcIl0pJiZmKGIpLFxyXG4gICAgICAgIGFbXCJwcm90ZWN0ZWRcIl07KGNbXCJwcml2YXRlXCJdfHxjW1wicHJvdGVjdGVkXCJdKSYmZihiKTtyZXR1cm4gYVtcInB1YmxpY1wiXX1mdW5jdGlvbiBmKGEpe3Rocm93IFR5cGVFcnJvcihcIk9ubHkgb25lIGFjY2VzcyBtb2RpZmllciBtYXkgYmUgdXNlZCBmb3IgZGVmaW5pdGlvbiBvZiAnXCIrYStcIidcIik7fWZ1bmN0aW9uIGUoYSxjLGIpe2Zvcih2YXIgZD1pLmxlbmd0aCxmPW51bGw7ZC0tOylpZihmPWcuZ2V0UHJvcGVydHlEZXNjcmlwdG9yKGFbaVtkXV0sYywhMCkpcmV0dXJue2dldDpmLmdldCxzZXQ6Zi5zZXQsbWVtYmVyOmYudmFsdWV9O3JldHVybiB2b2lkIDAhPT1iPyhhPWIuX19fJCRtZXRob2RzJCQsZD1iLl9fXyQkcHJvcHMkJCxiPSgoYi5wcm90b3R5cGV8fHt9KS5fX18kJHBhcmVudCQkfHx7fSkuY29uc3RydWN0b3IsYSYmZShhLGMsYil8fGQmJmUoZCxjLGIpfHxudWxsKTpudWxsfXZhciBkPWIuZXhwb3J0cz17fTtuPVwiLlwiO3ZhciBnPWgoXCIuL3V0aWxcIiksaT1bXCJwdWJsaWNcIixcclxuICAgICAgICBcInByb3RlY3RlZFwiLFwicHJpdmF0ZVwiXTtiLmV4cG9ydHM9ZnVuY3Rpb24oYSxjLGUsZCl7aWYoISh0aGlzIGluc3RhbmNlb2YgYi5leHBvcnRzKSlyZXR1cm4gbmV3IGIuZXhwb3J0cyhhLGMsZSxkKTt0aGlzLl93cmFwTWV0aG9kPWE7dGhpcy5fd3JhcE92ZXJyaWRlPWM7dGhpcy5fd3JhcFByb3h5PWU7dGhpcy5fdmFsaWRhdGU9ZH07ZD1iLmV4cG9ydHMucHJvdG90eXBlO2QuaW5pdE1lbWJlcnM9ZnVuY3Rpb24oYSxjLGIpe3JldHVybntcInB1YmxpY1wiOmF8fHt9LFwicHJvdGVjdGVkXCI6Y3x8e30sXCJwcml2YXRlXCI6Ynx8e319fTtkLmJ1aWxkTWV0aG9kPWZ1bmN0aW9uKGIsZCxmLGcsaSxoLGosbSxsKXt2YXIgeD10aGlzLl9tZXRob2RLZXl3b3JkRGVmYXVsdHMseD0oZD0obT1lKGIsZixtKSk/bS5tZW1iZXI6bnVsbCkmJihkLl9fXyQka2V5d29yZHMkJHx8eCksYj1hKGIsaSxmKTt0aGlzLl92YWxpZGF0ZS52YWxpZGF0ZU1ldGhvZChmLGcsaSxtLHgsbCk7aWYoaS5wcm94eSYmKCFkfHxcclxuICAgICAgICAhaS53ZWFrKSliW2ZdPXRoaXMuX2NyZWF0ZVByb3h5KGcsaCxqLGYsaSk7ZWxzZSBpZihkKXtpZihpLndlYWsmJiF4W1wiYWJzdHJhY3RcIl0pcmV0dXJuITE7aWYoaS5vdmVycmlkZXx8eFtcImFic3RyYWN0XCJdKWw9aVtcImFic3RyYWN0XCJdP2MoZik6ZCxiW2ZdPXRoaXMuX292ZXJyaWRlTWV0aG9kKGwsZyxoLGopO2Vsc2UgdGhyb3cgRXJyb3IoXCJNZXRob2QgaGlkaW5nIG5vdCB5ZXQgaW1wbGVtZW50ZWQgKHdlIHNob3VsZCBuZXZlciBnZXQgaGVyZTsgYnVnKS5cIik7fWVsc2UgYltmXT1pW1wiYWJzdHJhY3RcIl18fGlbXCJwcml2YXRlXCJdP2c6dGhpcy5fb3ZlcnJpZGVNZXRob2QobnVsbCxnLGgsaik7YltmXS5fX18kJGtleXdvcmRzJCQ9aTtyZXR1cm4hMH07ZC5fbWV0aG9kS2V5d29yZERlZmF1bHRzPXt2aXJ0dWFsOiEwfTtkLmJ1aWxkUHJvcD1mdW5jdGlvbihjLGIsZCxmLGcsaSl7aT0oYj1lKGMsZCxpKSk/Yi5tZW1iZXI6bnVsbDt0aGlzLl92YWxpZGF0ZS52YWxpZGF0ZVByb3BlcnR5KGQsXHJcbiAgICAgICAgZixnLGIsaT9pWzFdOm51bGwpO2EoYyxnLGQpW2RdPVtmLGddfTtkLmJ1aWxkR2V0dGVyU2V0dGVyPWZ1bmN0aW9uKGMsYixkLGYsZyxpLGgsaixsKXtiPWUoYyxkLGwpO3RoaXMuX3ZhbGlkYXRlLnZhbGlkYXRlR2V0dGVyU2V0dGVyKGQse30saSxiLGImJmIuZ2V0P2IuZ2V0Ll9fXyQka2V5d29yZHMkJDpudWxsKTtpZihmKWY9dGhpcy5fb3ZlcnJpZGVNZXRob2QobnVsbCxmLGgsaiksZi5fX18kJGtleXdvcmRzJCQ9aTtPYmplY3QuZGVmaW5lUHJvcGVydHkoYShjLGksZCksZCx7Z2V0OmYsc2V0Omc/dGhpcy5fb3ZlcnJpZGVNZXRob2QobnVsbCxnLGgsaik6ZyxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMX0pfTtkLl9jcmVhdGVQcm94eT1mdW5jdGlvbihhLGMsYixkLGUpe3JldHVybiB0aGlzLl93cmFwUHJveHkud3JhcE1ldGhvZChhLG51bGwsYixjLGQsZSl9O2QuX292ZXJyaWRlTWV0aG9kPWZ1bmN0aW9uKGEsYyxiLGQpe3ZhciBlPW51bGwsZT0oYT90aGlzLl93cmFwT3ZlcnJpZGU6XHJcbiAgICAgICAgdGhpcy5fd3JhcE1ldGhvZCkud3JhcE1ldGhvZChjLGEsZCxifHxmdW5jdGlvbigpe30pO2cuZGVmaW5lU2VjdXJlUHJvcChlLFwiX19sZW5ndGhcIixjLl9fbGVuZ3RofHxjLmxlbmd0aCk7cmV0dXJuIGV9O2QuX2dldFZpc2liaWxpdHlWYWx1ZT1mdW5jdGlvbihhKXtyZXR1cm4gYVtcInByb3RlY3RlZFwiXT8xOmFbXCJwcml2YXRlXCJdPzI6MH07ZC5lbmQ9ZnVuY3Rpb24oYSl7dGhpcy5fdmFsaWRhdGUmJnRoaXMuX3ZhbGlkYXRlLmVuZChhKX19KShqLk1lbWJlckJ1aWxkZXI9e30sXCIuXCIpOyhmdW5jdGlvbihiKXt2YXIgYz1iLmV4cG9ydHM9e307bj1cIi5cIjtiLmV4cG9ydHM9Yz1mdW5jdGlvbihhKXtpZighKHRoaXMgaW5zdGFuY2VvZiBiLmV4cG9ydHMpKXJldHVybiBuZXcgYi5leHBvcnRzKGEpO3RoaXMuX3dhcm5pbmdIYW5kbGVyPWF8fGZ1bmN0aW9uKCl7fX07Yy5wcm90b3R5cGUuX2luaXRTdGF0ZT1mdW5jdGlvbihhKXtpZihhLl9fdnJlYWR5KXJldHVybiBhO2Eud2Fybj17fTthLl9fdnJlYWR5PVxyXG4gICAgICAgICEwO3JldHVybiBhfTtjLnByb3RvdHlwZS5lbmQ9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjIGluIGEud2Fybil7dmFyIGI9YS53YXJuW2NdLGQ7Zm9yKGQgaW4gYil0aGlzLl93YXJuaW5nSGFuZGxlcihiW2RdKX1hLl9fdnJlYWR5PSExfTtjLnByb3RvdHlwZS52YWxpZGF0ZU1ldGhvZD1mdW5jdGlvbihhLGMsYixkLGcsaSl7dGhpcy5faW5pdFN0YXRlKGkpO3ZhciBoPWQ/ZC5tZW1iZXI6bnVsbDtpZihiW1wiYWJzdHJhY3RcIl0mJmJbXCJwcml2YXRlXCJdKXRocm93IFR5cGVFcnJvcihcIk1ldGhvZCAnXCIrYStcIicgY2Fubm90IGJlIGJvdGggcHJpdmF0ZSBhbmQgYWJzdHJhY3RcIik7aWYoYltcImNvbnN0XCJdKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBkZWNsYXJlIG1ldGhvZCAnXCIrYStcIicgYXMgY29uc3RhbnQ7IGtleXdvcmQgaXMgcmVkdW5kYW50XCIpO2lmKGIudmlydHVhbCYmYltcInN0YXRpY1wiXSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3QgZGVjbGFyZSBzdGF0aWMgbWV0aG9kICdcIithK1wiJyBhcyB2aXJ0dWFsXCIpO1xyXG4gICAgICAgIGlmKGQmJihkLmdldHx8ZC5zZXQpKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBvdmVycmlkZSBnZXR0ZXIvc2V0dGVyICdcIithK1wiJyB3aXRoIG1ldGhvZFwiKTtpZihiLnByb3h5KXtpZihcInN0cmluZ1wiIT09dHlwZW9mIGMpdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGRlY2xhcmUgcHJveHkgbWV0aG9kICdcIithK1wiJzsgc3RyaW5nIHZhbHVlIGV4cGVjdGVkXCIpO2lmKGJbXCJhYnN0cmFjdFwiXSl0aHJvdyBUeXBlRXJyb3IoXCJQcm94eSBtZXRob2QgJ1wiK2ErXCInIGNhbm5vdCBiZSBhYnN0cmFjdFwiKTt9aWYoaCl7aWYoZ1tcInByaXZhdGVcIl0pdGhyb3cgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZW1iZXIgbmFtZSAnXCIrYStcIicgY29uZmxpY3RzIHdpdGggc3VwZXJ0eXBlXCIpO2lmKFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBoKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBvdmVycmlkZSBwcm9wZXJ0eSAnXCIrYStcIicgd2l0aCBtZXRob2RcIik7aWYoYi5vdmVycmlkZSYmIWcudmlydHVhbCl7aWYoIWJbXCJhYnN0cmFjdFwiXSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3Qgb3ZlcnJpZGUgbm9uLXZpcnR1YWwgbWV0aG9kICdcIitcclxuICAgICAgICAgICAgYStcIidcIik7aWYoIWdbXCJhYnN0cmFjdFwiXSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3QgcGVyZm9ybSBhYnN0cmFjdCBvdmVycmlkZSBvbiBub24tYWJzdHJhY3QgbWV0aG9kICdcIithK1wiJ1wiKTt9aWYoYltcImFic3RyYWN0XCJdJiYhYi53ZWFrJiYhZ1tcImFic3RyYWN0XCJdKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBvdmVycmlkZSBjb25jcmV0ZSBtZXRob2QgJ1wiK2ErXCInIHdpdGggYWJzdHJhY3QgbWV0aG9kXCIpO2Q9dm9pZCAwPT09aC5fX2xlbmd0aD9oLmxlbmd0aDpoLl9fbGVuZ3RoO2M9dm9pZCAwPT09Yy5fX2xlbmd0aD9jLmxlbmd0aDpjLl9fbGVuZ3RoO2IucHJveHkmJihjPU5hTik7Yi53ZWFrJiYhZ1tcImFic3RyYWN0XCJdJiYoaD1kLGQ9YyxjPWgpO2lmKGM8ZCl0aHJvdyBUeXBlRXJyb3IoXCJEZWNsYXJhdGlvbiBvZiBtZXRob2QgJ1wiK2ErXCInIG11c3QgYmUgY29tcGF0aWJsZSB3aXRoIHRoYXQgb2YgaXRzIHN1cGVydHlwZVwiKTtpZih0aGlzLl9nZXRWaXNpYmlsaXR5VmFsdWUoZyk8XHJcbiAgICAgICAgICAgIHRoaXMuX2dldFZpc2liaWxpdHlWYWx1ZShiKSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3QgZGUtZXNjYWxhdGUgdmlzaWJpbGl0eSBvZiBtZXRob2QgJ1wiK2ErXCInXCIpO2lmKCFiLm92ZXJyaWRlJiYhZ1tcImFic3RyYWN0XCJdJiYhYi53ZWFrKXRocm93IFR5cGVFcnJvcihcIkF0dGVtcHRpbmcgdG8gb3ZlcnJpZGUgbWV0aG9kICdcIithK1wiJyB3aXRob3V0ICdvdmVycmlkZScga2V5d29yZFwiKTtiLndlYWsmJmcub3ZlcnJpZGUmJmRlbGV0ZSAoaS53YXJuW2FdfHx7fSkubm99ZWxzZSBpZihiLm92ZXJyaWRlKShpLndhcm5bYV09aS53YXJuW2FdfHx7fSkubm89RXJyb3IoXCJNZXRob2QgJ1wiK2ErXCInIHVzaW5nICdvdmVycmlkZScga2V5d29yZCB3aXRob3V0IHN1cGVyIG1ldGhvZFwiKX07Yy5wcm90b3R5cGUudmFsaWRhdGVQcm9wZXJ0eT1mdW5jdGlvbihhLGMsYixkLGcpe2lmKGM9ZD9kLm1lbWJlcjpudWxsKXtpZihnW1wicHJpdmF0ZVwiXSl0aHJvdyBUeXBlRXJyb3IoXCJQcml2YXRlIG1lbWJlciBuYW1lICdcIitcclxuICAgICAgICBhK1wiJyBjb25mbGljdHMgd2l0aCBzdXBlcnR5cGVcIik7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGMpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBvdmVycmlkZSBtZXRob2QgJ1wiK2ErXCInIHdpdGggcHJvcGVydHlcIik7aWYodGhpcy5fZ2V0VmlzaWJpbGl0eVZhbHVlKGcpPHRoaXMuX2dldFZpc2liaWxpdHlWYWx1ZShiKSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3QgZGUtZXNjYWxhdGUgdmlzaWJpbGl0eSBvZiBwcm9wZXJ0eSAnXCIrYStcIidcIik7fWlmKGQmJihkLmdldHx8ZC5zZXQpKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBvdmVycmlkZSBnZXR0ZXIvc2V0dGVyICdcIithK1wiJyB3aXRoIHByb3BlcnR5XCIpO2lmKGJbXCJhYnN0cmFjdFwiXSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9wZXJ0eSAnXCIrYStcIicgY2Fubm90IGJlIGRlY2xhcmVkIGFzIGFic3RyYWN0XCIpO2lmKGJbXCJzdGF0aWNcIl0mJmJbXCJjb25zdFwiXSl0aHJvdyBUeXBlRXJyb3IoXCJTdGF0aWMga2V5d29yZCBjYW5ub3QgYmUgdXNlZCB3aXRoIGNvbnN0IGZvciBwcm9wZXJ0eSAnXCIrXHJcbiAgICAgICAgYStcIidcIik7aWYoYi52aXJ0dWFsKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBkZWNsYXJlIHByb3BlcnR5ICdcIithK1wiJyBhcyB2aXJ0dWFsXCIpO307Yy5wcm90b3R5cGUudmFsaWRhdGVHZXR0ZXJTZXR0ZXI9ZnVuY3Rpb24oYSxjLGIsZCxnKXtjPWQ/ZC5tZW1iZXI6bnVsbDtkPWQmJihkLmdldHx8ZC5zZXQpPyEwOiExO2lmKGJbXCJhYnN0cmFjdFwiXSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3QgZGVjbGFyZSBnZXR0ZXIvc2V0dGVyICdcIithK1wiJyBhcyBhYnN0cmFjdFwiKTtpZihiW1wiY29uc3RcIl0pdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGRlY2xhcmUgY29uc3QgZ2V0dGVyL3NldHRlciAnXCIrYStcIidcIik7aWYoYi52aXJ0dWFsJiZiW1wic3RhdGljXCJdKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBkZWNsYXJlIHN0YXRpYyBtZXRob2QgJ1wiK2ErXCInIGFzIHZpcnR1YWxcIik7aWYoY3x8ZCl7aWYoZyYmZ1tcInByaXZhdGVcIl0pdGhyb3cgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZW1iZXIgbmFtZSAnXCIrXHJcbiAgICAgICAgYStcIicgY29uZmxpY3RzIHdpdGggc3VwZXJ0eXBlXCIpO2lmKCFkKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBvdmVycmlkZSBtZXRob2Qgb3IgcHJvcGVydHkgJ1wiK2ErXCInIHdpdGggZ2V0dGVyL3NldHRlclwiKTtpZighZ3x8IWcudmlydHVhbCl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3Qgb3ZlcnJpZGUgbm9uLXZpcnR1YWwgZ2V0dGVyL3NldHRlciAnXCIrYStcIidcIik7aWYoIWIub3ZlcnJpZGUpdGhyb3cgVHlwZUVycm9yKFwiQXR0ZW1wdGluZyB0byBvdmVycmlkZSBnZXR0ZXIvc2V0dGVyICdcIithK1wiJyB3aXRob3V0ICdvdmVycmlkZScga2V5d29yZFwiKTtpZih0aGlzLl9nZXRWaXNpYmlsaXR5VmFsdWUoZ3x8e30pPHRoaXMuX2dldFZpc2liaWxpdHlWYWx1ZShiKSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3QgZGUtZXNjYWxhdGUgdmlzaWJpbGl0eSBvZiBnZXR0ZXIvc2V0dGVyICdcIithK1wiJ1wiKTt9ZWxzZSBiLm92ZXJyaWRlJiZ0aGlzLl93YXJuaW5nSGFuZGxlcihFcnJvcihcIkdldHRlci9zZXR0ZXIgJ1wiK1xyXG4gICAgICAgIGErXCInIHVzaW5nICdvdmVycmlkZScga2V5d29yZCB3aXRob3V0IHN1cGVyIGdldHRlci9zZXR0ZXJcIikpfTtjLnByb3RvdHlwZS5fZ2V0VmlzaWJpbGl0eVZhbHVlPWZ1bmN0aW9uKGEpe3JldHVybiBhW1wicHJvdGVjdGVkXCJdPzE6YVtcInByaXZhdGVcIl0/MjowfX0pKGouTWVtYmVyQnVpbGRlclZhbGlkYXRvcj17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe3ZhciBjPWIuZXhwb3J0cz17fTtuPVwiLlwiO3ZhciBhPWgoXCIuL3V0aWxcIik7Yi5leHBvcnRzPWM9ZnVuY3Rpb24oKXtpZighKHRoaXMgaW5zdGFuY2VvZiBjKSlyZXR1cm4gbmV3IGIuZXhwb3J0c307Yy5wcm90b3R5cGUuc2V0dXA9ZnVuY3Rpb24oYSxiLGMpe3ZhciBnPXRoaXMuX2NyZWF0ZVByaXZhdGVMYXllcihhLGIpO3RoaXMuX2RvU2V0dXAoYSxiW1wicHVibGljXCJdKTt0aGlzLl9kb1NldHVwKGEsYltcInByb3RlY3RlZFwiXSxjW1wicHJvdGVjdGVkXCJdLCEwKTt0aGlzLl9kb1NldHVwKGcsYltcInByaXZhdGVcIl0sY1tcInByaXZhdGVcIl0pO3JldHVybiBnfTtcclxuICAgICAgICBjLnByb3RvdHlwZS5fY3JlYXRlUHJpdmF0ZUxheWVyPWZ1bmN0aW9uKGEsYil7dmFyIGM9ZnVuY3Rpb24oKXt9O2MucHJvdG90eXBlPWE7Yz1uZXcgYzt0aGlzLmNyZWF0ZVByb3BQcm94eShhLGMsYltcInByb3RlY3RlZFwiXSk7cmV0dXJuIGN9O2MucHJvdG90eXBlLl9kb1NldHVwPWZ1bmN0aW9uKGIsYyxkLGcpe3ZhciBpPUFycmF5LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtpZih2b2lkIDAhPT1kKWZvcih2YXIgaCBpbiBkKWlmKGkuY2FsbChkLGgpKXt2YXIgaj1iW2hdLG49aiYmai5fX18kJGtleXdvcmRzJCQ7aWYoIWd8fHZvaWQgMD09PWp8fG5bXCJwcml2YXRlXCJdfHxuW1wicHJvdGVjdGVkXCJdKWJbaF09ZFtoXX1mb3IodmFyIHAgaW4gYylpLmNhbGwoYyxwKSYmKGJbcF09YS5jbG9uZShjW3BdWzBdKSl9O2MucHJvdG90eXBlLmNyZWF0ZVByb3BQcm94eT1mdW5jdGlvbihhLGIsYyl7dmFyIGc9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxpO2ZvcihpIGluIGMpZy5jYWxsKGMsXHJcbiAgICAgICAgICAgIGkpJiZmdW5jdGlvbihjKXtiW2NdPXZvaWQgMDtPYmplY3QuZGVmaW5lUHJvcGVydHkoYixjLHtzZXQ6ZnVuY3Rpb24oYil7YVtjXT1ifSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gYVtjXX0sZW51bWVyYWJsZTohMH0pfS5jYWxsKG51bGwsaSk7cmV0dXJuIGJ9fSkoai5WaXNpYmlsaXR5T2JqZWN0RmFjdG9yeT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe3ZhciBjPWIuZXhwb3J0cz17fTtuPVwiLlwiO2IuZXhwb3J0cz1jPWZ1bmN0aW9uKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBiLmV4cG9ydHN9O2MucHJvdG90eXBlPWgoXCIuL1Zpc2liaWxpdHlPYmplY3RGYWN0b3J5XCIpKCk7Yy5wcm90b3R5cGUuX2NyZWF0ZVByaXZhdGVMYXllcj1mdW5jdGlvbihhKXtyZXR1cm4gYX07Yy5wcm90b3R5cGUuY3JlYXRlUHJvcFByb3h5PWZ1bmN0aW9uKGEpe3JldHVybiBhfX0pKGouRmFsbGJhY2tWaXNpYmlsaXR5T2JqZWN0RmFjdG9yeT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2I9Yi5leHBvcnRzPVxyXG4gICAge307bj1cIi5cIjt2YXIgYz1oKFwiLi91dGlsXCIpLGE9aChcIi4vVmlzaWJpbGl0eU9iamVjdEZhY3RvcnlcIiksZj1oKFwiLi9GYWxsYmFja1Zpc2liaWxpdHlPYmplY3RGYWN0b3J5XCIpO2IuZnJvbUVudmlyb25tZW50PWZ1bmN0aW9uKCl7cmV0dXJuIGMuZGVmaW5lUHJvcGVydHlGYWxsYmFjaygpP2YoKTphKCl9fSkoai5WaXNpYmlsaXR5T2JqZWN0RmFjdG9yeUZhY3Rvcnk9e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKGEpe2lmKDE8YXJndW1lbnRzLmxlbmd0aCl0aHJvdyBFcnJvcihcIkV4cGVjdGluZyBvbmUgYXJndW1lbnQgZm9yIGFub255bW91cyBDbGFzcyBkZWZpbml0aW9uOyBcIithcmd1bWVudHMubGVuZ3RoK1wiIGdpdmVuLlwiKTtyZXR1cm4gaShhKX1mdW5jdGlvbiBhKGEsYyl7aWYoMjxhcmd1bWVudHMubGVuZ3RoKXRocm93IEVycm9yKFwiRXhwZWN0aW5nIGF0IG1vc3QgdHdvIGFyZ3VtZW50cyBmb3IgZGVmaW5pdGlvbiBvZiBuYW1lZCBDbGFzcyAnXCIrYStcIic7IFwiK2FyZ3VtZW50cy5sZW5ndGgrXHJcbiAgICAgICAgXCIgZ2l2ZW4uXCIpO2lmKHZvaWQgMD09PWMpcmV0dXJuIGYoYSk7aWYoXCJvYmplY3RcIiE9PXR5cGVvZiBjKXRocm93IFR5cGVFcnJvcihcIlVuZXhwZWN0ZWQgdmFsdWUgZm9yIGRlZmluaXRpb24gb2YgbmFtZWQgQ2xhc3MgJ1wiK2ErXCInOyBvYmplY3QgZXhwZWN0ZWRcIik7Yy5fX25hbWU9YTtyZXR1cm4gaShjKX1mdW5jdGlvbiBmKGEpe3JldHVybntleHRlbmQ6ZnVuY3Rpb24oKXtmb3IodmFyIGM9W10sYj1hcmd1bWVudHMubGVuZ3RoO2ItLTspY1tiXT1hcmd1bWVudHNbYl07Y1tjLmxlbmd0aC0xXS5fX25hbWU9YTtyZXR1cm4gaS5hcHBseShudWxsLGMpfSxpbXBsZW1lbnQ6ZnVuY3Rpb24oKXtmb3IodmFyIGM9W10sYj1hcmd1bWVudHMubGVuZ3RoO2ItLTspY1tiXT1hcmd1bWVudHNbYl07cmV0dXJuIGUobnVsbCxjLGEpfSx1c2U6ZnVuY3Rpb24oKXtmb3IodmFyIGE9W10sYz1hcmd1bWVudHMubGVuZ3RoO2MtLTspYVtjXT1hcmd1bWVudHNbY107cmV0dXJuIGQocSxhKX19fWZ1bmN0aW9uIGUoYSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyxiKXt2YXIgZT17ZXh0ZW5kOmZ1bmN0aW9uKCl7dmFyIGQ9YXJndW1lbnRzLmxlbmd0aCxlPWFyZ3VtZW50c1tkLTFdLGs9MTxkP2FyZ3VtZW50c1tkLTJdOm51bGw7aWYoMjxkKXRocm93IEVycm9yKFwiRXhwZWN0aW5nIG5vIG1vcmUgdGhhbiB0d28gYXJndW1lbnRzIGZvciBleHRlbmQoKVwiKTtpZihhJiZrKXRocm93IEVycm9yKFwiQ2Fubm90IG92ZXJyaWRlIHBhcmVudCBcIithLnRvU3RyaW5nKCkrXCIgd2l0aCBcIitrLnRvU3RyaW5nKCkrXCIgdmlhIGV4dGVuZCgpXCIpO2lmKGIpZS5fX25hbWU9YjtjLnB1c2goYXx8a3x8aSh7fSkpO3JldHVybiBpLmNhbGwobnVsbCxvLmFwcGx5KHRoaXMsYyksZSl9LHVzZTpmdW5jdGlvbigpe2Zvcih2YXIgYT1bXSxjPWFyZ3VtZW50cy5sZW5ndGg7Yy0tOylhW2NdPWFyZ3VtZW50c1tjXTtyZXR1cm4gZChmdW5jdGlvbigpe3JldHVybiBlLl9fY3JlYXRlQmFzZSgpfSxhKX0sX19jcmVhdGVCYXNlOmZ1bmN0aW9uKCl7cmV0dXJuIGUuZXh0ZW5kKHt9KX19O1xyXG4gICAgICAgIHJldHVybiBlfWZ1bmN0aW9uIGQoYSxjLGIpe3ZhciBlPWZ1bmN0aW9uKCl7aWYoIWIpdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGluc3RhbnRpYXRlIGluY29tcGxldGUgY2xhc3MgZGVmaW5pdGlvbjsgZGlkIHlvdSBmb3JnZXQgdG8gY2FsbCBgZXh0ZW5kJz9cIik7cmV0dXJuIGcoYSgpLGMpLmFwcGx5KG51bGwsYXJndW1lbnRzKX07ZS5leHRlbmQ9ZnVuY3Rpb24oKXt2YXIgYj1hcmd1bWVudHMubGVuZ3RoLGQ9YXJndW1lbnRzW2ItMV0sYj0xPGI/YXJndW1lbnRzW2ItMl06bnVsbCxlPWEoKTtyZXR1cm4gaS5jYWxsKG51bGwsZyhlfHxiLGMpLGQpfTtlLnVzZT1mdW5jdGlvbigpe2Zvcih2YXIgYT1bXSxjPWFyZ3VtZW50cy5sZW5ndGg7Yy0tOylhW2NdPWFyZ3VtZW50c1tjXTtyZXR1cm4gZChmdW5jdGlvbigpe3JldHVybiBlLl9fY3JlYXRlQmFzZSgpfSxhLGIpfTtlLl9fY3JlYXRlQmFzZT1mdW5jdGlvbigpe3JldHVybiBlLmV4dGVuZCh7fSl9O3JldHVybiBlfWZ1bmN0aW9uIGcoYSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjKXtmb3IodmFyIGI9e19fXyQkYXV0byRhYnN0cmFjdCQkOiEwfSxkPVtdLGU9MCxrPWMubGVuZ3RoO2U8aztlKyspY1tlXS5fX21peGluKGIsZCxhfHx6LkNsYXNzQmFzZSk7Yj1pLmNhbGwobnVsbCxhLGIpO2Q9ei5nZXRNZXRhKGIpLmltcGxlbWVudGVkO2U9MDtmb3Ioaz1jLmxlbmd0aDtlPGs7ZSsrKWQucHVzaChjW2VdKSxjW2VdLl9fbWl4aW5JbXBsKGQpO3JldHVybiBifWZ1bmN0aW9uIGkoYSxjKXtmb3IodmFyIGI9W10sZD1hcmd1bWVudHMubGVuZ3RoO2QtLTspYltkXT1hcmd1bWVudHNbZF07Yj14LmJ1aWxkLmFwcGx5KHgsYik7aihiKTtyKGIpO3koYik7di5mcmVlemUoYik7cmV0dXJuIGJ9ZnVuY3Rpb24gaihhKXt2LmRlZmluZVNlY3VyZVByb3AoYSxcImV4dGVuZFwiLGZ1bmN0aW9uKGEpe3JldHVybiBpKHRoaXMsYSl9KX1mdW5jdGlvbiByKGEpe3YuZGVmaW5lU2VjdXJlUHJvcChhLFwiaW1wbGVtZW50XCIsZnVuY3Rpb24oKXtmb3IodmFyIGM9W10sYj1hcmd1bWVudHMubGVuZ3RoO2ItLTspY1tiXT1cclxuICAgICAgICBhcmd1bWVudHNbYl07cmV0dXJuIGUoYSxjKX0pfWZ1bmN0aW9uIHkoYSl7di5kZWZpbmVTZWN1cmVQcm9wKGEsXCJ1c2VcIixmdW5jdGlvbigpe2Zvcih2YXIgYz1bXSxiPWFyZ3VtZW50cy5sZW5ndGg7Yi0tOyljW2JdPWFyZ3VtZW50c1tiXTtyZXR1cm4gZChmdW5jdGlvbigpe3JldHVybiBhfSxjLCEwKX0pfWIuZXhwb3J0cz17fTtuPVwiLlwiO3ZhciBwPVwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZT9jb25zb2xlOnZvaWQgMCx2PWgoXCIuL3V0aWxcIiksej1oKFwiLi9DbGFzc0J1aWxkZXJcIiksQT1oKFwiLi93YXJuXCIpLG09QS5XYXJuaW5nLGw9QS5Mb2dIYW5kbGVyKHApLHA9aChcIi4vTWV0aG9kV3JhcHBlckZhY3RvcnlcIiksQT1oKFwiLi9NZXRob2RXcmFwcGVyc1wiKS5zdGFuZGFyZCx4PXoobCxoKFwiLi9NZW1iZXJCdWlsZGVyXCIpKHAoQS53cmFwTmV3KSxwKEEud3JhcE92ZXJyaWRlKSxwKEEud3JhcFByb3h5KSxoKFwiLi9NZW1iZXJCdWlsZGVyVmFsaWRhdG9yXCIpKGZ1bmN0aW9uKGEpe2wuaGFuZGxlKG0oYSkpfSkpLFxyXG4gICAgICAgIGgoXCIuL1Zpc2liaWxpdHlPYmplY3RGYWN0b3J5RmFjdG9yeVwiKS5mcm9tRW52aXJvbm1lbnQoKSkscT1mdW5jdGlvbigpe3JldHVybiBudWxsfTtiLmV4cG9ydHM9ZnVuY3Rpb24oYixkKXtmb3IodmFyIGU9dHlwZW9mIGIsaz1udWxsLGs9W10sZj1hcmd1bWVudHMubGVuZ3RoO2YtLTspa1tmXT1hcmd1bWVudHNbZl07c3dpdGNoKGUpe2Nhc2UgXCJvYmplY3RcIjprPWMuYXBwbHkobnVsbCxrKTticmVhaztjYXNlIFwic3RyaW5nXCI6az1hLmFwcGx5KG51bGwsayk7YnJlYWs7ZGVmYXVsdDp0aHJvdyBUeXBlRXJyb3IoXCJFeHBlY3RpbmcgYW5vbnltb3VzIGNsYXNzIGRlZmluaXRpb24gb3IgbmFtZWQgY2xhc3MgZGVmaW5pdGlvblwiKTt9cmV0dXJuIGt9O2IuZXhwb3J0cy5leHRlbmQ9aTtiLmV4cG9ydHMuaW1wbGVtZW50PWZ1bmN0aW9uKGEpe3JldHVybiBlKG51bGwsQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSl9O2IuZXhwb3J0cy51c2U9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPVxyXG4gICAgICAgIFtdLGM9YXJndW1lbnRzLmxlbmd0aDtjLS07KWJbY109YXJndW1lbnRzW2NdO3JldHVybiBkKHEsYil9O3ZhciBzPXtwcm90b3R5cGU6e319LGs9e2NvbnN0cnVjdG9yOntwcm90b3R5cGU6e319fTtiLmV4cG9ydHMuaXNDbGFzcz1mdW5jdGlvbihhKXthPWF8fHM7aWYoIWEucHJvdG90eXBlKXJldHVybiExO3ZhciBjPXouZ2V0TWV0YShhKTtyZXR1cm4gbnVsbCE9PWMmJmMuaW1wbGVtZW50ZWR8fGEucHJvdG90eXBlIGluc3RhbmNlb2Ygei5DbGFzc0Jhc2U/ITA6ITF9O2IuZXhwb3J0cy5pc0NsYXNzSW5zdGFuY2U9ZnVuY3Rpb24oYSl7YT1hfHxrO3JldHVybiBiLmV4cG9ydHMuaXNDbGFzcyhhLmNvbnN0cnVjdG9yKX07Yi5leHBvcnRzLmlzSW5zdGFuY2VPZj16LmlzSW5zdGFuY2VPZjtiLmV4cG9ydHMuaXNBPWIuZXhwb3J0cy5pc0luc3RhbmNlT2Y7dmFyIG89ZnVuY3Rpb24oYSxjKXtmb3IodmFyIGQ9YXJndW1lbnRzLmxlbmd0aCxlPXt9LGs9YXJndW1lbnRzW2QtMV0sZj1udWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGc9W10sbz0hMSxpPTA7aTxkLTE7aSsrKWY9YXJndW1lbnRzW2ldLHYucHJvcFBhcnNlKGYucHJvdG90eXBlLHttZXRob2Q6ZnVuY3Rpb24oYSxjKXtlW1wiYWJzdHJhY3QgXCIrYV09Yy5kZWZpbml0aW9uO289ITB9fSksZy5wdXNoKGYpO2lmKG8pZS5fX18kJGFic3RyYWN0JCQ9ITA7ZD1iLmV4cG9ydHMuZXh0ZW5kKGssZSk7ei5nZXRNZXRhKGQpLmltcGxlbWVudGVkPWc7cmV0dXJuIGR9fSkoaltcImNsYXNzXCJdPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYyhhKXtpZihcIm9iamVjdFwiPT09dHlwZW9mIGEpYS5fX18kJGFic3RyYWN0JCQ9ITB9ZnVuY3Rpb24gYShiKXt2YXIgZT1iLmV4dGVuZCxmPWIuaW1wbGVtZW50LGg9Yi51c2U7ZiYmKGIuaW1wbGVtZW50PWZ1bmN0aW9uKCl7cmV0dXJuIGEoZi5hcHBseSh0aGlzLGFyZ3VtZW50cykpfSk7aCYmKGIudXNlPWZ1bmN0aW9uKCl7cmV0dXJuIGEoaC5hcHBseSh0aGlzLGFyZ3VtZW50cykpfSk7Yi5leHRlbmQ9ZnVuY3Rpb24oKXtjKGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoLVxyXG4gICAgICAgIDFdKTtyZXR1cm4gZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2IuX19jcmVhdGVCYXNlPWZ1bmN0aW9uKCl7cmV0dXJuIGUoe19fXyQkYXV0byRhYnN0cmFjdCQkOiEwfSl9O3JldHVybiBifXZhciBmPWIuZXhwb3J0cz17fTtuPVwiLlwiO3ZhciBlPWgoXCIuL2NsYXNzXCIpO2IuZXhwb3J0cz1mPWZ1bmN0aW9uKCl7Yyhhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aC0xXSk7dmFyIGI9ZS5hcHBseSh0aGlzLGFyZ3VtZW50cyk7ZS5pc0NsYXNzKGIpfHxhKGIpO3JldHVybiBifTtmLmV4dGVuZD1mdW5jdGlvbigpe2MoYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGgtMV0pO3JldHVybiBlLmV4dGVuZC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2YudXNlPWZ1bmN0aW9uKCl7cmV0dXJuIGEoZS51c2UuYXBwbHkodGhpcyxhcmd1bWVudHMpKX07Zi5pbXBsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gYShlLmltcGxlbWVudC5hcHBseSh0aGlzLGFyZ3VtZW50cykpfX0pKGouY2xhc3NfYWJzdHJhY3Q9XHJcbiAgICB7fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoKXt9ZnVuY3Rpb24gYShhKXtpZigxPGFyZ3VtZW50cy5sZW5ndGgpdGhyb3cgRXJyb3IoXCJFeHBlY3Rpbmcgb25lIGFyZ3VtZW50IGZvciBJbnRlcmZhY2UgZGVmaW5pdGlvbjsgXCIrYXJndW1lbnRzLmxlbmd0aCtcIiBnaXZlbi5cIik7cmV0dXJuIGwoYSl9ZnVuY3Rpb24gZihhLGIpe2lmKDI8YXJndW1lbnRzLmxlbmd0aCl0aHJvdyBFcnJvcihcIkV4cGVjdGluZyB0d28gYXJndW1lbnRzIGZvciBkZWZpbml0aW9uIG9mIG5hbWVkIEludGVyZmFjZSAnXCIrYStcIic7IFwiK2FyZ3VtZW50cy5sZW5ndGgrXCIgZ2l2ZW4uXCIpO2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYil0aHJvdyBUeXBlRXJyb3IoXCJVbmV4cGVjdGVkIHZhbHVlIGZvciBkZWZpbml0aW9uIG9mIG5hbWVkIEludGVyZmFjZSAnXCIrYStcIic7IG9iamVjdCBleHBlY3RlZFwiKTtiLl9fbmFtZT1hO3JldHVybiBsKGIpfWZ1bmN0aW9uIGUoYSxiKXtiLm1lc3NhZ2U9XCJGYWlsZWQgdG8gZGVmaW5lIGludGVyZmFjZSBcIitcclxuICAgICAgICAoYT9hOlwiKGFub255bW91cylcIikrXCI6IFwiK2IubWVzc2FnZTt0aHJvdyBiO31mdW5jdGlvbiBkKGEpe3AuZGVmaW5lU2VjdXJlUHJvcChhLFwiZXh0ZW5kXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGwodGhpcyxhKX0pfWZ1bmN0aW9uIGcoYSxiKXthLnRvU3RyaW5nPWI/ZnVuY3Rpb24oKXtyZXR1cm5cIltvYmplY3QgSW50ZXJmYWNlIDxcIitiK1wiPl1cIn06ZnVuY3Rpb24oKXtyZXR1cm5cIltvYmplY3QgSW50ZXJmYWNlXVwifX1mdW5jdGlvbiBpKGEpe3AuZGVmaW5lU2VjdXJlUHJvcChhLFwiaXNDb21wYXRpYmxlXCIsZnVuY3Rpb24oYil7cmV0dXJuIDA9PT1qKGEsYikubGVuZ3RofSl9ZnVuY3Rpb24gaihhLGIpe3ZhciBjPVtdO3AucHJvcFBhcnNlKGEucHJvdG90eXBlLHttZXRob2Q6ZnVuY3Rpb24oYSxkKXtcImZ1bmN0aW9uXCIhPT10eXBlb2YgYlthXT9jLnB1c2goW2EsXCJtaXNzaW5nXCJdKTpiW2FdLmxlbmd0aDxkLl9fbGVuZ3RoJiZjLnB1c2goW2EsXCJpbmNvbXBhdGlibGVcIl0pfX0pO3JldHVybiBjfVxyXG4gICAgICAgIGZ1bmN0aW9uIHIoYSl7cC5kZWZpbmVTZWN1cmVQcm9wKGEsXCJfX2lzSW5zdGFuY2VPZlwiLGZ1bmN0aW9uKGEsYil7cmV0dXJuIHkoYSxiKX0pfWZ1bmN0aW9uIHkoYSxiKXt2YXIgYz1iLmNvbnN0cnVjdG9yLGQ7aWYoIWIuX19jaWR8fCEoZD1tLmdldE1ldGEoYykpKXJldHVybiAwPT09aihhLGIpLmxlbmd0aDtjPWQuaW1wbGVtZW50ZWQ7Zm9yKGQ9Yy5sZW5ndGg7ZC0tOylpZihjW2RdPT09YSlyZXR1cm4hMDtyZXR1cm4hMX1iLmV4cG9ydHM9e307bj1cIi5cIjt2YXIgcD1oKFwiLi91dGlsXCIpLHY9aChcIi4vTWV0aG9kV3JhcHBlckZhY3RvcnlcIiksej1oKFwiLi9NZXRob2RXcmFwcGVyc1wiKS5zdGFuZGFyZCxBPWgoXCIuL01lbWJlckJ1aWxkZXJcIikodih6LndyYXBOZXcpLHYoei53cmFwT3ZlcnJpZGUpLHYoei53cmFwUHJveHkpLGgoXCIuL01lbWJlckJ1aWxkZXJWYWxpZGF0b3JcIikoKSk7aChcIi4vY2xhc3NcIik7dmFyIG09aChcIi4vQ2xhc3NCdWlsZGVyXCIpO2IuZXhwb3J0cz1mdW5jdGlvbihiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjKXt2YXIgZD1udWxsO3N3aXRjaCh0eXBlb2YgYil7Y2FzZSBcIm9iamVjdFwiOmQ9YS5hcHBseShudWxsLGFyZ3VtZW50cyk7YnJlYWs7Y2FzZSBcInN0cmluZ1wiOmQ9Zi5hcHBseShudWxsLGFyZ3VtZW50cyk7YnJlYWs7ZGVmYXVsdDp0aHJvdyBUeXBlRXJyb3IoXCJFeHBlY3RpbmcgYW5vbnltb3VzIGludGVyZmFjZSBkZWZpbml0aW9uIG9yIG5hbWVkIGludGVyZmFjZSBkZWZpbml0aW9uXCIpO31yZXR1cm4gZH07Yi5leHBvcnRzLmV4dGVuZD1mdW5jdGlvbigpe3JldHVybiBsLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07Yi5leHBvcnRzLmlzSW50ZXJmYWNlPWZ1bmN0aW9uKGEpe2E9YXx8e307cmV0dXJuIGEucHJvdG90eXBlIGluc3RhbmNlb2YgYz8hMDohMX07dmFyIGw9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihjKXtyZXR1cm4gZnVuY3Rpb24oKXtpZighYSl0aHJvdyBFcnJvcihcIkludGVyZmFjZSBcIisoYz9jK1wiIFwiOlwiXCIpK1wiIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWRcIik7fX1yZXR1cm4gZnVuY3Rpb24oKXthPVxyXG4gICAgICAgICAgICAhMDt2YXIgZj1hcmd1bWVudHMsaz1mLmxlbmd0aCxvPSgwPGs/ZltrLTFdOjApfHx7fSxmPW5ldyAoKDE8az9mW2stMl06MCl8fGMpLGg9XCJcIixqPXt9LHc9QS5pbml0TWVtYmVycyhmLGYsZik7KGg9by5fX25hbWUpJiZkZWxldGUgby5fX25hbWU7aWYoIShmIGluc3RhbmNlb2YgYykpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludGVyZmFjZXMgbWF5IG9ubHkgZXh0ZW5kIG90aGVyIGludGVyZmFjZXNcIik7az1iKGgpO3AucHJvcFBhcnNlKG8se2Fzc3VtZUFic3RyYWN0OiEwLF90aHJvdzpmdW5jdGlvbihhKXtlKGgsYSl9LHByb3BlcnR5OmZ1bmN0aW9uKCl7ZShoLFR5cGVFcnJvcihcIlVuZXhwZWN0ZWQgaW50ZXJuYWwgZXJyb3JcIikpfSxnZXRzZXQ6ZnVuY3Rpb24oKXtlKGgsVHlwZUVycm9yKFwiVW5leHBlY3RlZCBpbnRlcm5hbCBlcnJvclwiKSl9LG1ldGhvZDpmdW5jdGlvbihhLGIsYyxkKXsoZFtcInByb3RlY3RlZFwiXXx8ZFtcInByaXZhdGVcIl0pJiZlKGgsVHlwZUVycm9yKFwiTWVtYmVyIFwiK1xyXG4gICAgICAgICAgICBhK1wiIG11c3QgYmUgcHVibGljXCIpKTtBLmJ1aWxkTWV0aG9kKHcsbnVsbCxhLGIsZCxudWxsLDAse30sail9fSk7ZChrKTtnKGssaCk7aShrKTtyKGspO2sucHJvdG90eXBlPWY7ay5jb25zdHJ1Y3Rvcj1rO3AuZnJlZXplKGspO2E9ITE7cmV0dXJuIGt9fSghMSk7Yi5leHBvcnRzLmlzSW5zdGFuY2VPZj15fSkoaltcImludGVyZmFjZVwiXT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoKXt9ZnVuY3Rpb24gYSgpe3N3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtjYXNlIDA6dGhyb3cgRXJyb3IoXCJNaXNzaW5nIHRyYWl0IG5hbWUgb3IgZGVmaW5pdGlvblwiKTtjYXNlIDE6cmV0dXJuXCJzdHJpbmdcIj09PXR5cGVvZiBhcmd1bWVudHNbMF0/ZS5hcHBseSh0aGlzLGFyZ3VtZW50cyk6YS5leHRlbmQuYXBwbHkodGhpcyxhcmd1bWVudHMpO2Nhc2UgMjpyZXR1cm4gZi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9dGhyb3cgRXJyb3IoXCJFeHBlY3RpbmcgYXQgbW9zdCB0d28gYXJndW1lbnRzIGZvciBkZWZpbml0aW9uIG9mIG5hbWVkIFRyYWl0IFwiK1xyXG4gICAgICAgIG5hbWUrXCInOyBcIithcmd1bWVudHMubGVuZ3RoK1wiIGdpdmVuXCIpO31mdW5jdGlvbiBmKGIsYyl7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBiKXRocm93IEVycm9yKFwiRmlyc3QgYXJndW1lbnQgb2YgbmFtZWQgY2xhc3MgZGVmaW5pdGlvbiBtdXN0IGJlIGEgc3RyaW5nXCIpO2MuX19uYW1lPWI7cmV0dXJuIGEuZXh0ZW5kKGMpfWZ1bmN0aW9uIGUoYSl7cmV0dXJue2V4dGVuZDpmdW5jdGlvbihiKXtyZXR1cm4gZihhLGIpfSxpbXBsZW1lbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gaihhcmd1bWVudHMsYSl9fX1mdW5jdGlvbiBkKGEsYixjLGQpe2lmKFwiX19jb25zdHJ1Y3RcIj09PWEpdGhyb3cgRXJyb3IoXCJUcmFpdHMgbWF5IG5vdCBkZWZpbmUgX19jb25zdHJ1Y3RcIik7aWYoY1tcInN0YXRpY1wiXSl0aHJvdyBFcnJvcihcIkNhbm5vdCBkZWZpbmUgbWVtYmVyIGBcIithK1wiJzsgc3RhdGljIHRyYWl0IG1lbWJlcnMgYXJlIGN1cnJlbnRseSB1bnN1cHBvcnRlZFwiKTtkLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1cclxuICAgICAgICBmdW5jdGlvbiBnKGEsYixjLGQpe2lmKFwiX19fXCIhPT1hLnN1YnN0cigwLDMpKXtpZighY1tcInByaXZhdGVcIl0pdGhyb3cgRXJyb3IoXCJDYW5ub3QgZGVmaW5lIHByb3BlcnR5IGBcIithK1wiJzsgb25seSBwcml2YXRlIHByb3BlcnRpZXMgYXJlIHBlcm1pdHRlZCB3aXRoaW4gVHJhaXQgZGVmaW5pdGlvbnNcIik7ZC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fWZ1bmN0aW9uIGkoYSl7dGhyb3cgRXJyb3IoXCJDYW5ub3QgZGVmaW5lIHByb3BlcnR5IGBcIithK1wiJzsgZ2V0dGVycy9zZXR0ZXJzIGFyZSBjdXJyZW50bHkgdW5zdXBwb3J0ZWRcIik7fWZ1bmN0aW9uIGooYixjKXtyZXR1cm57ZXh0ZW5kOmZ1bmN0aW9uKGQpe2lmKGMpZC5fX25hbWU9YztyZXR1cm4gYS5leHRlbmQuY2FsbCh7X18kJG1ldGE6e2lmYWNlczpifX0sZCl9fX1mdW5jdGlvbiByKGEpe3ZhciBiPXtcInByb3RlY3RlZCBfX18kJHBtbyQkXCI6bnVsbCxcInByb3RlY3RlZCBfX18kJHN1cGVyJCRcIjpudWxsLF9fY29uc3RydWN0OmZ1bmN0aW9uKGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIpe3RoaXMuX19fJCRzdXBlciQkPWE7dGhpcy5fX18kJHBtbyQkPWJ9LF9fbmFtZTpcIiNDb25jcmV0ZVRyYWl0I1wifSxjPXEuZ2V0TWV0YShhKS5hYnN0cmFjdE1ldGhvZHMsZDtmb3IoZCBpbiBjKU9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGMsZCkmJlwiX19cIiE9PWQuc3Vic3RyKDAsMikmJihiWyh2b2lkIDAhPT1hLl9fXyQkbWV0aG9kcyQkW1wicHVibGljXCJdW2RdP1wicHVibGljXCI6XCJwcm90ZWN0ZWRcIikrXCIgcHJveHkgXCIrZF09XCJfX18kJHBtbyQkXCIpO3koYSxiKTtyZXR1cm4gYS5leHRlbmQoYil9ZnVuY3Rpb24geShhLGIpe3ZhciBjPXEuZ2V0TWV0YShhKS52aXJ0dWFsTWVtYmVycyxkO2ZvcihkIGluIGMpe3ZhciBlPXZvaWQgMCE9PWEuX19fJCRtZXRob2RzJCRbXCJwdWJsaWNcIl1bZF0/XCJwdWJsaWNcIjpcInByb3RlY3RlZFwiLGY9YS5fX18kJG1ldGhvZHMkJFtlXVtkXSxnPWYuX19sZW5ndGg7YltlK1wiIHZpcnR1YWwgb3ZlcnJpZGUgXCIrZF09ZnVuY3Rpb24oYSl7dmFyIGI9ZnVuY3Rpb24oKXt2YXIgYj1cclxuICAgICAgICAgICAgdGhpcy5fX18kJHBtbyQkLGM9YlthXTtyZXR1cm4gYz9jLmFwcGx5KGIsYXJndW1lbnRzKTp0aGlzLl9fc3VwZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpfTtiLl9fbGVuZ3RoPWc7cmV0dXJuIGJ9KGQpO2JbZStcIiB2aXJ0dWFsIF9fJCRcIitkXT1mdW5jdGlvbihhKXt2YXIgYj1mdW5jdGlvbigpe3JldHVybiBhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07Yi5fX2xlbmd0aD1nO3JldHVybiBifShmKX19ZnVuY3Rpb24gcChhLGIsZCxlKXt2YXIgZj1hLl9fYWNscyxhPUEoYSxiLGQsZSk7YltcIndlYWsgdmlydHVhbCBfX18kJGN0b3IkcHJlJCRcIl09YztiW1wid2VhayB2aXJ0dWFsIF9fXyQkY3RvciRwb3N0JCRcIl09YztlPT09cS5DbGFzc0Jhc2U/KGJbXCJ2aXJ0dWFsIG92ZXJyaWRlIF9fXyQkY3RvciRwb3N0JCRcIl09bCxiW1widmlydHVhbCBvdmVycmlkZSBfX18kJGN0b3IkcHJlJCRcIl09Yyk6KGJbXCJ2aXJ0dWFsIG92ZXJyaWRlIF9fXyQkY3RvciRwb3N0JCRcIl09YyxiW1widmlydHVhbCBvdmVycmlkZSBfX18kJGN0b3IkcHJlJCRcIl09XHJcbiAgICAgICAgICAgIGwpO3YoZixiLGEpO3JldHVybiBifWZ1bmN0aW9uIHYoYSxiLGMpe2E9YS5fX18kJG1ldGhvZHMkJDt6KGFbXCJwdWJsaWNcIl0sYixcInB1YmxpY1wiLGMpO3ooYVtcInByb3RlY3RlZFwiXSxiLFwicHJvdGVjdGVkXCIsYyk7KGE9YVtcInB1YmxpY1wiXS5fX18kJHBhcmVudCQkKSYmYS5jb25zdHJ1Y3RvciE9PXEuQ2xhc3NCYXNlJiZ2KGEuY29uc3RydWN0b3IsYixjKX1mdW5jdGlvbiB6KGEsYixjLGQpe2Zvcih2YXIgZSBpbiBhKWlmKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsZSkmJlwiX19taXhpblwiIT09ZSYmYVtlXS5fX18kJGtleXdvcmRzJCQpe3ZhciBmPWFbZV0uX19fJCRrZXl3b3JkcyQkLGM9ZltcInByb3RlY3RlZFwiXT9cInByb3RlY3RlZFwiOlwicHVibGljXCI7aWYoZltcImFic3RyYWN0XCJdJiYhZi5vdmVycmlkZSliW2MrXCIgd2VhayBhYnN0cmFjdCBcIitlXT1hW2VdLmRlZmluaXRpb247ZWxzZXt2YXIgZz1mLnZpcnR1YWwsYz0oZz9cIlwiOlwicHJveHkgXCIpKyhnP1widmlydHVhbCBcIjpcIlwiKStcclxuICAgICAgICAgICAgKGYub3ZlcnJpZGU/XCJvdmVycmlkZSBcIjpcIlwiKStjK1wiIFwiK2U7aWYodm9pZCAwIT09YltjXSl0aHJvdyBFcnJvcihcIlRyYWl0IG1lbWJlciBjb25mbGljdDogYFwiK2UrXCInXCIpO2JbY109Zi52aXJ0dWFsP2Z1bmN0aW9uKGIpe3ZhciBjPWZ1bmN0aW9uKCl7dmFyIGE9dGhpc1tkXSxjPWFbXCJfXyQkXCIrYl0uYXBwbHkoYSxhcmd1bWVudHMpO3JldHVybiBjPT09YT90aGlzOmN9O2MuX19sZW5ndGg9YVtiXS5fX2xlbmd0aDtyZXR1cm4gY30oZSk6ZH19fWZ1bmN0aW9uIEEoYSxiLGMsZCl7dmFyIGU9XCJfX18kdG8kXCIrYS5fX2FjbHMuX19jaWQrXCIkXCIrZC5fX2NpZDtjLnB1c2goW2UsYV0pO2JbXCJwcml2YXRlIFwiK2VdPW51bGw7dm9pZCAwPT09Yi5fX18kJHRjdG9yJCQmJihiW1wid2VhayB2aXJ0dWFsIF9fXyQkdGN0b3IkJFwiXT1mdW5jdGlvbigpe30sYltcInZpcnR1YWwgb3ZlcnJpZGUgX19fJCR0Y3RvciQkXCJdPW0oYyxkKSk7cmV0dXJuIGV9ZnVuY3Rpb24gbShhLGIpe3JldHVybiBmdW5jdGlvbihjKXtmb3IodmFyIGQgaW4gYSl7dmFyIGU9XHJcbiAgICAgICAgICAgIGFbZF1bMF0sZj1hW2RdWzFdLGc9Zi5fX2NjbHN8fChmLl9fY2Nscz1yKGYuX19hY2xzKSk7dGhpc1tlXT1nKGIsdGhpc1tjXS52aXMpW2NdLnZpczt0aGlzW2VdLl9fbWl4aW4mJnRoaXNbZV0uX19taXhpbi5hcHBseSh0aGlzW2VdLGYuX19fJCRtaXhpbmFyZ3MpfXRoaXMuX19zdXBlciYmdGhpcy5fX3N1cGVyKGMpfX1mdW5jdGlvbiBsKCl7dGhpcy5fX18kJHRjdG9yJCQuYXBwbHkodGhpcyxhcmd1bWVudHMpfWIuZXhwb3J0cz17fTtuPVwiLlwiO3ZhciB4PWgoXCIuL2NsYXNzX2Fic3RyYWN0XCIpLHE9aChcIi4vQ2xhc3NCdWlsZGVyXCIpLHM9aChcIi4vaW50ZXJmYWNlXCIpO2EuZXh0ZW5kPWZ1bmN0aW9uKGEpe3ZhciBiPSh0aGlzfHx7fSkuX18kJG1ldGF8fHt9LGM9YS5fX25hbWV8fFwiKFRyYWl0KVwiLGU9XCJmdW5jdGlvblwiPT09dHlwZW9mIGEuX19taXhpbj9cInBhcmFtXCI6XCJzdGRcIjthLl9fXyQkcGFyc2VyJCQ9e2VhY2g6ZCxwcm9wZXJ0eTpnLGdldHNldDppfTthLl9fXyQkYXV0byRhYnN0cmFjdCQkPVxyXG4gICAgICAgICAgICAhMDthLl9fbmFtZT1cIiNBYnN0cmFjdFRyYWl0I1wiO3ZhciBmPVwicGFyYW1cIj09PWU/ZnVuY3Rpb24oKXtmb3IodmFyIGE9W10sYj1hcmd1bWVudHMubGVuZ3RoO2ItLTspYVtiXT1hcmd1bWVudHNbYl07dmFyIGM9ZnVuY3Rpb24oKXt0aHJvdyBFcnJvcihcIkNhbm5vdCByZS1jb25maWd1cmUgYXJndW1lbnQgdHJhaXRcIik7fTtjLl9fXyQkbWl4aW5hcmdzPWE7Yy5fX3RyYWl0PVwiYXJnXCI7Yy5fX2FjbHM9Zi5fX2FjbHM7Yy5fX2NjbHM9Zi5fX2NjbHM7Yy50b1N0cmluZz1mLnRvU3RyaW5nO2MuX19taXhpbkltcGw9Zi5fX21peGluSW1wbDtjLl9faXNJbnN0YW5jZU9mPWYuX19pc0luc3RhbmNlT2Y7Yy5fX21peGluPWZ1bmN0aW9uKGEsYixkKXtwKGMsYSxiLGQpfTtyZXR1cm4gY306ZnVuY3Rpb24oKXt0aHJvdyBFcnJvcihcIkNhbm5vdCBpbnN0YW50aWF0ZSBub24tcGFyYW1ldGVyaXplZCB0cmFpdFwiKTt9LGg9eDtiLmlmYWNlcyYmKGg9aC5pbXBsZW1lbnQuYXBwbHkobnVsbCxiLmlmYWNlcykpO1xyXG4gICAgICAgICAgICB2YXIgaj1oLmV4dGVuZChhKTtmLl9fdHJhaXQ9ZTtmLl9fYWNscz1qO2YuX19jY2xzPW51bGw7Zi50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiXCIrY307Zi5fX18kJG1peGluYXJncz1bXTtmLl9fbWl4aW49ZnVuY3Rpb24oYSxiLGMpe3AoZixhLGIsYyl9O2YuX19taXhpbkltcGw9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPXEuZ2V0TWV0YShqKS5pbXBsZW1lbnRlZHx8W10sYz1iLmxlbmd0aDtjLS07KWEucHVzaChiW2NdKX07Zi5fX2lzSW5zdGFuY2VPZj1zLmlzSW5zdGFuY2VPZjtyZXR1cm4gZn07YS5pbXBsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gaihhcmd1bWVudHMpfTthLmlzVHJhaXQ9ZnVuY3Rpb24oYSl7cmV0dXJuISEoYXx8e30pLl9fdHJhaXR9O2EuaXNQYXJhbWV0ZXJUcmFpdD1mdW5jdGlvbihhKXtyZXR1cm5cInBhcmFtXCI9PT0oYXx8e30pLl9fdHJhaXR9O2EuaXNBcmd1bWVudFRyYWl0PWZ1bmN0aW9uKGEpe3JldHVyblwiYXJnXCI9PT0oYXx8e30pLl9fdHJhaXR9O2IuZXhwb3J0cz1cclxuICAgICAgICAgICAgYX0pKGouVHJhaXQ9e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKGEpe2lmKFwib2JqZWN0XCI9PT10eXBlb2YgYSlhLl9fXyQkZmluYWwkJD0hMH1mdW5jdGlvbiBhKGEpe3ZhciBiPWEuZXh0ZW5kO2EuZXh0ZW5kPWZ1bmN0aW9uKCl7Yyhhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aC0xXSk7cmV0dXJuIGIuYXBwbHkodGhpcyxhcmd1bWVudHMpfX12YXIgZj1iLmV4cG9ydHM9e307bj1cIi5cIjt2YXIgZT1oKFwiLi9jbGFzc1wiKSxmPWIuZXhwb3J0cz1mdW5jdGlvbigpe2MoYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGgtMV0pO3ZhciBiPWUuYXBwbHkodGhpcyxhcmd1bWVudHMpO2UuaXNDbGFzcyhiKXx8YShiKTtyZXR1cm4gYn07Zi5leHRlbmQ9ZnVuY3Rpb24oKXtjKGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoLTFdKTtyZXR1cm4gZS5leHRlbmQuYXBwbHkodGhpcyxhcmd1bWVudHMpfX0pKGouY2xhc3NfZmluYWw9e30sXCIuXCIpOyhmdW5jdGlvbihiKXt2YXIgYz1iLmV4cG9ydHM9XHJcbiAgICB7fTtuPVwiLlwiO3ZhciBhPWgoXCIuL01lbWJlckJ1aWxkZXJcIik7Yi5leHBvcnRzPWM9ZnVuY3Rpb24oYSxjKXtpZighKHRoaXMgaW5zdGFuY2VvZiBiLmV4cG9ydHMpKXJldHVybiBuZXcgYi5leHBvcnRzKGEsYyk7Yi5leHBvcnRzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsYSxjKX07Yi5leHBvcnRzLnByb3RvdHlwZT1uZXcgYTtiLmV4cG9ydHMuY29uc3RydWN0b3I9Yi5leHBvcnRzO2MucHJvdG90eXBlLmJ1aWxkR2V0dGVyU2V0dGVyPWZ1bmN0aW9uKCl7dGhyb3cgRXJyb3IoXCJHZXR0ZXJzL3NldHRlcnMgYXJlIHVuc3VwcG9ydGVkIGluIHRoaXMgZW52aXJvbm1lbnRcIik7fX0pKGouRmFsbGJhY2tNZW1iZXJCdWlsZGVyPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYygpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGMpKXJldHVybiBuZXcgYzt0aGlzLl9hbHQ9e319Yi5leHBvcnRzPXt9O249XCJ1dGlsXCI7KDAsZXZhbCkoXCJ2YXIgX3RoZV9nbG9iYWw9dGhpc1wiKTtcclxuICAgICAgICBjLmV4cG9zZT1mdW5jdGlvbigpe3JldHVybiBfdGhlX2dsb2JhbH07Yy5wcm90b3R5cGU9e3Byb3ZpZGVBbHQ6ZnVuY3Rpb24oYSxiKXtpZighKHZvaWQgMCE9PV90aGVfZ2xvYmFsW2FdfHx2b2lkIDAhPT10aGlzLl9hbHRbYV0pKXJldHVybiB0aGlzLl9hbHRbYV09YigpLHRoaXN9LGdldDpmdW5jdGlvbihhKXtyZXR1cm4gdm9pZCAwIT09dGhpcy5fYWx0W2FdP3RoaXMuX2FsdFthXTpfdGhlX2dsb2JhbFthXX19O2IuZXhwb3J0cz1jfSkoaltcInV0aWwvR2xvYmFsXCJdPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7Yi5leHBvcnRzPXt9O249XCJ1dGlsXCI7dmFyIGM9aChcIi4vc3ltYm9sL0ZhbGxiYWNrU3ltYm9sXCIpLGE9aChcIi4vR2xvYmFsXCIpLmV4cG9zZSgpO2IuZXhwb3J0cz1hLlN5bWJvbHx8Y30pKGpbXCJ1dGlsL1N5bWJvbFwiXT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoKXtpZighKHRoaXMgaW5zdGFuY2VvZiBjKSlyZXR1cm4gbmV3IGM7dGhpcy5fX18kJGlkJCQ9ZStmKDFFOCpcclxuICAgICAgICBhKCkpfWIuZXhwb3J0cz17fTtuPVwidXRpbC9zeW1ib2xcIjt2YXIgYT1NYXRoLnJhbmRvbSxmPU1hdGguZmxvb3IsZT1cIiBcIitTdHJpbmcuZnJvbUNoYXJDb2RlKGYoMTAqYSgpKSUzMSsxKStcIiRcIjtjLnByb3RvdHlwZT17dG9TdHJpbmc6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fX18kJGlkJCR9fTtiLmV4cG9ydHM9Y30pKGpbXCJ1dGlsL3N5bWJvbC9GYWxsYmFja1N5bWJvbFwiXT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2IuZXhwb3J0cz17fTtuPVwiLlwiO3ZhciBjPVswLDIsNCxcIlwiXTtjLm1ham9yPTA7Yy5taW5vcj0yO2MucmV2PTQ7Yy5zdWZmaXg9XCJcIjtjLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuam9pbihcIi5cIikucmVwbGFjZSgvXFwuKFteLl0qKSQvLFwiLSQxXCIpLnJlcGxhY2UoLy0kLyxcIlwiKX07Yi5leHBvcnRzPWN9KShqLnZlcnNpb249e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBjfWIuZXhwb3J0cz1cclxuICAgIHt9O249XCJ3YXJuXCI7Yy5wcm90b3R5cGU9e2hhbmRsZTpmdW5jdGlvbigpe319O2IuZXhwb3J0cz1jfSkoaltcIndhcm4vRGlzbWlzc2l2ZUhhbmRsZXJcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKGEpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGMpKXJldHVybiBuZXcgYyhhKTt0aGlzLl9jb25zb2xlPWF8fHt9fWIuZXhwb3J0cz17fTtuPVwid2FyblwiO2MucHJvdG90eXBlPXtoYW5kbGU6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5fY29uc29sZS53YXJufHx0aGlzLl9jb25zb2xlLmxvZztiJiZiLmNhbGwodGhpcy5fY29uc29sZSxcIldhcm5pbmc6IFwiK2EubWVzc2FnZSl9fTtiLmV4cG9ydHM9Y30pKGpbXCJ3YXJuL0xvZ0hhbmRsZXJcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBjfWIuZXhwb3J0cz17fTtuPVwid2FyblwiO2MucHJvdG90eXBlPXtoYW5kbGU6ZnVuY3Rpb24oYSl7dGhyb3cgYS5nZXRFcnJvcigpO1xyXG4gICAgfX07Yi5leHBvcnRzPWN9KShqW1wid2Fybi9UaHJvd0hhbmRsZXJcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKGEpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGMpKXJldHVybiBuZXcgYyhhKTtpZighKGEgaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgVHlwZUVycm9yKFwiTXVzdCBwcm92aWRlIGV4Y2VwdGlvbiB0byB3cmFwXCIpO0Vycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsYS5tZXNzYWdlKTt0aGlzLm1lc3NhZ2U9YS5tZXNzYWdlO3RoaXMubmFtZT1cIldhcm5pbmdcIjt0aGlzLl9lcnJvcj1hO3RoaXMuc3RhY2s9YS5zdGFjayYmYS5zdGFjay5yZXBsYWNlKC9eLio/XFxuKy8sdGhpcy5uYW1lK1wiOiBcIit0aGlzLm1lc3NhZ2UrXCJcXG5cIil9Yi5leHBvcnRzPXt9O249XCJ3YXJuXCI7Yy5wcm90b3R5cGU9RXJyb3IoKTtjLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1jO2MucHJvdG90eXBlLm5hbWU9XCJXYXJuaW5nXCI7Yy5wcm90b3R5cGUuZ2V0RXJyb3I9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZXJyb3J9O1xyXG4gICAgICAgIGIuZXhwb3J0cz1jfSkoaltcIndhcm4vV2FybmluZ1wiXT17fSxcIi5cIik7Qi5DbGFzcz1qW1wiY2xhc3NcIl0uZXhwb3J0cztCLkFic3RyYWN0Q2xhc3M9ai5jbGFzc19hYnN0cmFjdC5leHBvcnRzO0IuRmluYWxDbGFzcz1qLmNsYXNzX2ZpbmFsLmV4cG9ydHM7Qi5JbnRlcmZhY2U9altcImludGVyZmFjZVwiXS5leHBvcnRzO0IuVHJhaXQ9ai5UcmFpdC5leHBvcnRzO0IudmVyc2lvbj1qLnZlcnNpb24uZXhwb3J0c30pKGVhc2VqcyxcIi5cIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VqczsiLCJ2YXIgR2VuZUpTID0ge1xyXG4gICAgQ2xhc3M6IHJlcXVpcmUoJy4vZWFzZWpzLmpzJykuQ2xhc3NcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VuZUpTOyIsImV4cG9ydHMucHVyZW12YyA9IHJlcXVpcmUoXCIuL2xpYi9wdXJlbXZjLTEuMC4xLW1vZC5qc1wiKTtcclxuZXhwb3J0cy5wdXJlbXZjLnN0YXRlbWFjaGluZSA9IHJlcXVpcmUoXCIuL2xpYi9wdXJlbXZjLXN0YXRlbWFjaGluZS0xLjAtbW9kLmpzXCIpOyIsIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBDb3B5cmlnaHQoYykgMjAwNi0yMDEyIEZ1dHVyZXNjYWxlLCBJbmMuLCBTb21lIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFJldXNlIGdvdmVybmVkIGJ5IENyZWF0aXZlIENvbW1vbnMgQXR0cmlidXRpb24gMy4wIFxuICogaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wL3VzL1xuICogQGF1dGhvciBkYXZpZC5mb2xleUBwdXJlbXZjLm9yZyBcbiAqL1xuXG5cbiBcdC8qIGltcGxlbWVudGF0aW9uIGJlZ2luICovXG5cdFxuXHRcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLk9ic2VydmVyXG4gKiBcbiAqIEEgYmFzZSBPYnNlcnZlciBpbXBsZW1lbnRhdGlvbi5cbiAqIFxuICogQW4gT2JzZXJ2ZXIgaXMgYW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIGluZm9ybWF0aW9uXG4gKiBhYm91dCBhbiBpbnRlcmVzdGVkIG9iamVjdCB3aXRoIGEgbWV0aG9kIHRoYXQgc2hvdWxkIFxuICogYmUgY2FsbGVkIHdoZW4gYSBwYXJ0aWN1bGFyIE5vdGlmaWNhdGlvbiBpcyBicm9hZGNhc3QuIFxuICogXG4gKiBJbiBQdXJlTVZDLCB0aGUgT2JzZXJ2ZXIgY2xhc3MgYXNzdW1lcyB0aGVzZSByZXNwb25zaWJpbGl0aWVzOlxuICogXG4gKiAtIEVuY2Fwc3VsYXRlIHRoZSBub3RpZmljYXRpb24gKGNhbGxiYWNrKSBtZXRob2Qgb2YgdGhlIGludGVyZXN0ZWQgb2JqZWN0LlxuICogLSBFbmNhcHN1bGF0ZSB0aGUgbm90aWZpY2F0aW9uIGNvbnRleHQgKHRoaXMpIG9mIHRoZSBpbnRlcmVzdGVkIG9iamVjdC5cbiAqIC0gUHJvdmlkZSBtZXRob2RzIGZvciBzZXR0aW5nIHRoZSBub3RpZmljYXRpb24gbWV0aG9kIGFuZCBjb250ZXh0LlxuICogLSBQcm92aWRlIGEgbWV0aG9kIGZvciBub3RpZnlpbmcgdGhlIGludGVyZXN0ZWQgb2JqZWN0LlxuICogXG4gKiBcbiAqIFRoZSBub3RpZmljYXRpb24gbWV0aG9kIG9uIHRoZSBpbnRlcmVzdGVkIG9iamVjdCBzaG91bGQgdGFrZSBcbiAqIG9uZSBwYXJhbWV0ZXIgb2YgdHlwZSBOb3RpZmljYXRpb24uXG4gKiBcbiAqIFxuICogQHBhcmFtIHtGdW5jdGlvbn0gbm90aWZ5TWV0aG9kIFxuICogIHRoZSBub3RpZmljYXRpb24gbWV0aG9kIG9mIHRoZSBpbnRlcmVzdGVkIG9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG5vdGlmeUNvbnRleHQgXG4gKiAgdGhlIG5vdGlmaWNhdGlvbiBjb250ZXh0IG9mIHRoZSBpbnRlcmVzdGVkIG9iamVjdFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE9ic2VydmVyIChub3RpZnlNZXRob2QsIG5vdGlmeUNvbnRleHQpXG57XG4gICAgdGhpcy5zZXROb3RpZnlNZXRob2Qobm90aWZ5TWV0aG9kKTtcbiAgICB0aGlzLnNldE5vdGlmeUNvbnRleHQobm90aWZ5Q29udGV4dCk7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgT2JzZXJ2ZXJzIG5vdGlmaWNhdGlvbiBtZXRob2QuXG4gKiBcbiAqIFRoZSBub3RpZmljYXRpb24gbWV0aG9kIHNob3VsZCB0YWtlIG9uZSBwYXJhbWV0ZXIgb2YgdHlwZSBOb3RpZmljYXRpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG5vdGlmeU1ldGhvZFxuICogIHRoZSBub3RpZmljYXRpb24gKGNhbGxiYWNrKSBtZXRob2Qgb2YgdGhlIGludGVyZXN0ZWQgb2JqZWN0LlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuT2JzZXJ2ZXIucHJvdG90eXBlLnNldE5vdGlmeU1ldGhvZD0gZnVuY3Rpb24gKG5vdGlmeU1ldGhvZClcbntcbiAgICB0aGlzLm5vdGlmeT0gbm90aWZ5TWV0aG9kO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIE9ic2VydmVycyBub3RpZmljYXRpb24gY29udGV4dC5cbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IG5vdGlmeUNvbnRleHRcbiAqICB0aGUgbm90aWZpY2F0aW9uIGNvbnRleHQgKHRoaXMpIG9mIHRoZSBpbnRlcmVzdGVkIG9iamVjdC5cbiAqIFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuT2JzZXJ2ZXIucHJvdG90eXBlLnNldE5vdGlmeUNvbnRleHQ9IGZ1bmN0aW9uIChub3RpZnlDb250ZXh0KVxue1xuICAgIHRoaXMuY29udGV4dD0gbm90aWZ5Q29udGV4dDtcbn07XG5cbi8qKlxuICogR2V0IHRoZSBGdW5jdGlvbiB0aGF0IHRoaXMgT2JzZXJ2ZXIgd2lsbCBpbnZva2Ugd2hlbiBpdCBpcyBub3RpZmllZC5cbiAqIFxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5PYnNlcnZlci5wcm90b3R5cGUuZ2V0Tm90aWZ5TWV0aG9kPSBmdW5jdGlvbiAoKVxue1xuICAgIHJldHVybiB0aGlzLm5vdGlmeTtcbn07XG5cbi8qKlxuICogR2V0IHRoZSBPYmplY3QgdGhhdCB3aWxsIHNlcnZlIGFzIHRoZSBPYnNlcnZlcnMgY2FsbGJhY2sgZXhlY3V0aW9uIGNvbnRleHRcbiAqIFxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuT2JzZXJ2ZXIucHJvdG90eXBlLmdldE5vdGlmeUNvbnRleHQ9IGZ1bmN0aW9uICgpXG57XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dDtcbn07XG5cbi8qKlxuICogTm90aWZ5IHRoZSBpbnRlcmVzdGVkIG9iamVjdC5cbiAqIFxuICogQHBhcmFtIHtwdXJlbXZjLk5vdGlmaWNhdGlvbn0gbm90aWZpY2F0aW9uXG4gKiAgVGhlIE5vdGlmaWNhdGlvbiB0byBwYXNzIHRvIHRoZSBpbnRlcmVzdGVkIG9iamVjdHMgbm90aWZpY2F0aW9uIG1ldGhvZFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuT2JzZXJ2ZXIucHJvdG90eXBlLm5vdGlmeU9ic2VydmVyPSBmdW5jdGlvbiAobm90aWZpY2F0aW9uKVxue1xuICAgIHRoaXMuZ2V0Tm90aWZ5TWV0aG9kKCkuY2FsbCh0aGlzLmdldE5vdGlmeUNvbnRleHQoKSwgbm90aWZpY2F0aW9uKTtcbn07XG5cbi8qKlxuICogQ29tcGFyZSBhbiBvYmplY3QgdG8gdGhpcyBPYnNlcnZlcnMgbm90aWZpY2F0aW9uIGNvbnRleHQuXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqICBcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5jb21wYXJlTm90aWZ5Q29udGV4dD0gZnVuY3Rpb24gKG9iamVjdClcbntcbiAgICByZXR1cm4gb2JqZWN0ID09PSB0aGlzLmNvbnRleHQ7XG59O1xuXG4vKipcbiAqIFRoZSBPYnNlcnZlcnMgY2FsbGJhY2sgRnVuY3Rpb25cbiAqIFxuICogQHByaXZhdGVcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuT2JzZXJ2ZXIucHJvdG90eXBlLm5vdGlmeT0gbnVsbDtcblxuLyoqXG4gKiBUaGUgT2JzZXJ2ZXJzIGNhbGxiYWNrIE9iamVjdFxuICogQHByaXZhdGVcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5jb250ZXh0PSBudWxsO1xuLyoqXG4gKiBAYXV0aG9yIFB1cmVNVkMgSlMgTmF0aXZlIFBvcnQgYnkgRGF2aWQgRm9sZXksIEZyw6lkw6lyaWMgU2F1bmllciwgJiBBbGFpbiBEdWNoZXNuZWF1IFxuICogQGF1dGhvciBDb3B5cmlnaHQoYykgMjAwNi0yMDEyIEZ1dHVyZXNjYWxlLCBJbmMuLCBTb21lIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogQGNsYXNzIHB1cmVtdmMuTm90aWZpY2F0aW9uXG4gKiBcbiAqIEEgYmFzZSBOb3RpZmljYXRpb24gaW1wbGVtZW50YXRpb24uXG4gKiBcbiAqIFB1cmVNVkMgZG9lcyBub3QgcmVseSB1cG9uIHVuZGVybHlpbmcgZXZlbnQgbW9kZWxzIHN1Y2ggYXMgdGhlIG9uZSBwcm92aWRlZCBcbiAqIHdpdGggdGhlIERPTSBvciBvdGhlciBicm93c2VyIGNlbnRyaWMgVzNDIGV2ZW50IG1vZGVscy5cbiAqIFxuICogVGhlIE9ic2VydmVyIFBhdHRlcm4gYXMgaW1wbGVtZW50ZWQgd2l0aGluIFB1cmVNVkMgZXhpc3RzIHRvIHN1cHBvcnQgXG4gKiBldmVudC1kcml2ZW4gY29tbXVuaWNhdGlvbiBiZXR3ZWVuIHRoZSBhcHBsaWNhdGlvbiBhbmQgdGhlIGFjdG9ycyBvZiB0aGUgTVZDIFxuICogdHJpYWQuXG4gKiBcbiAqIE5vdGlmaWNhdGlvbnMgYXJlIG5vdCBtZWFudCB0byBiZSBhIHJlcGxhY2VtZW50IGZvciBldmVudHMgaW4gdGhlIGJyb3dzZXIuIFxuICogR2VuZXJhbGx5LCBNZWRpYXRvciBpbXBsZW1lbnRvcnMgcGxhY2UgZXZlbnQgbGlzdGVuZXJzIG9uIHRoZWlyIHZpZXcgXG4gKiBjb21wb25lbnRzLCB3aGljaCB0aGV5IHRoZW4gaGFuZGxlIGluIHRoZSB1c3VhbCB3YXkuIFRoaXMgbWF5IGxlYWQgdG8gdGhlIFxuICogYnJvYWRjYXN0IG9mIE5vdGlmaWNhdGlvbnMgdG8gdHJpZ2dlciBjb21tYW5kcyBvciB0byBjb21tdW5pY2F0ZSB3aXRoIG90aGVyIFxuICogTWVkaWF0b3JzLiB7QGxpbmsgcHVyZW12Yy5Qcm94eSBQcm94eX0sXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9XG4gKiBhbmQge0BsaW5rIHB1cmVtdmMuTWFjcm9Db21tYW5kIE1hY3JvQ29tbWFuZH1cbiAqIGluc3RhbmNlcyBjb21tdW5pY2F0ZSB3aXRoIGVhY2ggb3RoZXIgYW5kIFxuICoge0BsaW5rIHB1cmVtdmMuTWVkaWF0b3IgTWVkaWF0b3J9c1xuICogYnkgYnJvYWRjYXN0aW5nIE5vdGlmaWNhdGlvbnMuXG4gKiBcbiAqIEEga2V5IGRpZmZlcmVuY2UgYmV0d2VlbiBicm93c2VyIGV2ZW50cyBhbmQgUHVyZU1WQyBOb3RpZmljYXRpb25zIGlzIHRoYXRcbiAqIGV2ZW50cyBmb2xsb3cgdGhlICdDaGFpbiBvZiBSZXNwb25zaWJpbGl0eScgcGF0dGVybiwgJ2J1YmJsaW5nJyB1cCB0aGUgXG4gKiBkaXNwbGF5IGhpZXJhcmNoeSB1bnRpbCBzb21lIHBhcmVudCBjb21wb25lbnQgaGFuZGxlcyB0aGUgZXZlbnQsIHdoaWxlIFxuICogUHVyZU1WQyBOb3RpZmljYXRpb24gZm9sbG93IGEgJ1B1Ymxpc2gvU3Vic2NyaWJlJyBwYXR0ZXJuLiBQdXJlTVZDIGNsYXNzZXMgXG4gKiBuZWVkIG5vdCBiZSByZWxhdGVkIHRvIGVhY2ggb3RoZXIgaW4gYSBwYXJlbnQvY2hpbGQgcmVsYXRpb25zaGlwIGluIG9yZGVyIHRvIFxuICogY29tbXVuaWNhdGUgd2l0aCBvbmUgYW5vdGhlciB1c2luZyBOb3RpZmljYXRpb25zLlxuICogXG4gKiBAY29uc3RydWN0b3IgXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogIFRoZSBOb3RpZmljYXRpb24gbmFtZVxuICogQHBhcmFtIHtPYmplY3R9IFtib2R5XVxuICogIFRoZSBOb3RpZmljYXRpb24gYm9keVxuICogQHBhcmFtIHtPYmplY3R9IFt0eXBlXVxuICogIFRoZSBOb3RpZmljYXRpb24gdHlwZVxuICovXG5mdW5jdGlvbiBOb3RpZmljYXRpb24obmFtZSwgYm9keSwgdHlwZSlcbntcbiAgICB0aGlzLm5hbWU9IG5hbWU7XG4gICAgdGhpcy5ib2R5PSBib2R5O1xuICAgIHRoaXMudHlwZT0gdHlwZTtcbn07XG5cbi8qKlxuICogR2V0IHRoZSBuYW1lIG9mIHRoZSBOb3RpZmljYXRpb24gaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiAgVGhlIG5hbWUgb2YgdGhlIE5vdGlmaWNhdGlvbiBpbnN0YW5jZVxuICovXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLmdldE5hbWU9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xufTtcblxuLyoqXG4gKiBTZXQgdGhpcyBOb3RpZmljYXRpb25zIGJvZHkuIFxuICogQHBhcmFtIHtPYmplY3R9IGJvZHlcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuc2V0Qm9keT0gZnVuY3Rpb24oYm9keSlcbntcbiAgICB0aGlzLmJvZHk9IGJvZHk7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgTm90aWZpY2F0aW9uIGJvZHkuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLmdldEJvZHk9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gdGhpcy5ib2R5XG59O1xuXG4vKipcbiAqIFNldCB0aGUgdHlwZSBvZiB0aGUgTm90aWZpY2F0aW9uIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLnNldFR5cGU9IGZ1bmN0aW9uKHR5cGUpXG57XG4gICAgdGhpcy50eXBlPSB0eXBlO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIHR5cGUgb2YgdGhlIE5vdGlmaWNhdGlvbiBpbnN0YW5jZS5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLmdldFR5cGU9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gdGhpcy50eXBlO1xufTtcblxuLyoqXG4gKiBHZXQgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIE5vdGlmaWNhdGlvbiBpbnN0YW5jZVxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS50b1N0cmluZz0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBtc2c9IFwiTm90aWZpY2F0aW9uIE5hbWU6IFwiICsgdGhpcy5nZXROYW1lKCk7XG4gICAgbXNnKz0gXCJcXG5Cb2R5OlwiICsgKCh0aGlzLmJvZHkgPT0gbnVsbCApID8gXCJudWxsXCIgOiB0aGlzLmJvZHkudG9TdHJpbmcoKSk7XG4gICAgbXNnKz0gXCJcXG5UeXBlOlwiICsgKCh0aGlzLnR5cGUgPT0gbnVsbCApID8gXCJudWxsXCIgOiB0aGlzLnR5cGUpO1xuICAgIHJldHVybiBtc2c7XG59O1xuXG4vKipcbiAqIFRoZSBOb3RpZmljYXRpb25zIG5hbWUuXG4gKlxuICogQHR5cGUge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUubmFtZT0gbnVsbDtcblxuLyoqXG4gKiBUaGUgTm90aWZpY2F0aW9ucyB0eXBlLlxuICpcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLnR5cGU9IG51bGw7XG5cbi8qKlxuICogVGhlIE5vdGlmaWNhdGlvbnMgYm9keS5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByaXZhdGVcbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5ib2R5PSBudWxsO1xuLyoqXG4gKiBAYXV0aG9yIFB1cmVNVkMgSlMgTmF0aXZlIFBvcnQgYnkgRGF2aWQgRm9sZXksIEZyw6lkw6lyaWMgU2F1bmllciwgJiBBbGFpbiBEdWNoZXNuZWF1IFxuICogQGF1dGhvciBDb3B5cmlnaHQoYykgMjAwNi0yMDEyIEZ1dHVyZXNjYWxlLCBJbmMuLCBTb21lIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogQGNsYXNzIHB1cmVtdmMuTm90aWZpZXJcbiAqIFxuICogQSBCYXNlIE5vdGlmaWVyIGltcGxlbWVudGF0aW9uLlxuICogXG4gKiB7QGxpbmsgcHVyZW12Yy5NYWNyb0NvbW1hbmQgTWFjcm9Db21tYW5kfSwgXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9LCBcbiAqIHtAbGluayBwdXJlbXZjLk1lZGlhdG9yIE1lZGlhdG9yfSBhbmQgXG4gKiB7QGxpbmsgcHVyZW12Yy5Qcm94eSBQcm94eX1cbiAqIGFsbCBoYXZlIGEgbmVlZCB0byBzZW5kIE5vdGlmaWNhdGlvbnNcbiAqIFxuICogVGhlIE5vdGlmaWVyIGludGVyZmFjZSBwcm92aWRlcyBhIGNvbW1vbiBtZXRob2QgY2FsbGVkICNzZW5kTm90aWZpY2F0aW9uIHRoYXQgXG4gKiByZWxpZXZlcyBpbXBsZW1lbnRhdGlvbiBjb2RlIG9mIHRoZSBuZWNlc3NpdHkgdG8gYWN0dWFsbHkgY29uc3RydWN0IFxuICogTm90aWZpY2F0aW9ucy5cbiAqIFxuICogVGhlIE5vdGlmaWVyIGNsYXNzLCB3aGljaCBhbGwgb2YgdGhlIGFib3ZlIG1lbnRpb25lZCBjbGFzc2VzXG4gKiBleHRlbmQsIHByb3ZpZGVzIGFuIGluaXRpYWxpemVkIHJlZmVyZW5jZSB0byB0aGUgXG4gKiB7QGxpbmsgcHVyZW12Yy5GYWNhZGUgRmFjYWRlfVxuICogTXVsdGl0b24sIHdoaWNoIGlzIHJlcXVpcmVkIGZvciB0aGUgY29udmllbmllbmNlIG1ldGhvZFxuICogZm9yIHNlbmRpbmcgTm90aWZpY2F0aW9ucyBidXQgYWxzbyBlYXNlcyBpbXBsZW1lbnRhdGlvbiBhcyB0aGVzZVxuICogY2xhc3NlcyBoYXZlIGZyZXF1ZW50IFxuICoge0BsaW5rIHB1cmVtdmMuRmFjYWRlIEZhY2FkZX0gaW50ZXJhY3Rpb25zIFxuICogYW5kIHVzdWFsbHkgcmVxdWlyZSBhY2Nlc3MgdG8gdGhlIGZhY2FkZSBhbnl3YXkuXG4gKiBcbiAqIE5PVEU6IEluIHRoZSBNdWx0aUNvcmUgdmVyc2lvbiBvZiB0aGUgZnJhbWV3b3JrLCB0aGVyZSBpcyBvbmUgY2F2ZWF0IHRvXG4gKiBub3RpZmllcnMsIHRoZXkgY2Fubm90IHNlbmQgbm90aWZpY2F0aW9ucyBvciByZWFjaCB0aGUgZmFjYWRlIHVudGlsIHRoZXlcbiAqIGhhdmUgYSB2YWxpZCBtdWx0aXRvbktleS4gXG4gKiBcbiAqIFRoZSBtdWx0aXRvbktleSBpcyBzZXQ6XG4gKiAgIC0gb24gYSBDb21tYW5kIHdoZW4gaXQgaXMgZXhlY3V0ZWQgYnkgdGhlIENvbnRyb2xsZXJcbiAqICAgLSBvbiBhIE1lZGlhdG9yIGlzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgVmlld1xuICogICAtIG9uIGEgUHJveHkgaXMgcmVnaXN0ZXJlZCB3aXRoIHRoZSBNb2RlbC4gXG4gKiBcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBOb3RpZmllcigpXG57XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhbmQgc2VuZCBhIE5vdGlmaWNhdGlvbi5cbiAqXG4gKiBLZWVwcyB1cyBmcm9tIGhhdmluZyB0byBjb25zdHJ1Y3QgbmV3IE5vdGlmaWNhdGlvbiBpbnN0YW5jZXMgaW4gb3VyIFxuICogaW1wbGVtZW50YXRpb24gY29kZS5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICBBIG5vdGlmaWNhdGlvbiBuYW1lXG4gKiBAcGFyYW0ge09iamVjdH0gW2JvZHldXG4gKiAgVGhlIGJvZHkgb2YgdGhlIG5vdGlmaWNhdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXVxuICogIFRoZSBub3RpZmljYXRpb24gdHlwZVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLnNlbmROb3RpZmljYXRpb24gPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lLCBib2R5LCB0eXBlKVxue1xuICAgIHZhciBmYWNhZGUgPSB0aGlzLmdldEZhY2FkZSgpO1xuICAgIGlmKGZhY2FkZSlcbiAgICB7XG4gICAgICAgIGZhY2FkZS5zZW5kTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbk5hbWUsIGJvZHksIHR5cGUpO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBBIHJlZmVyZW5jZSB0byB0aGlzIE5vdGlmaWVyJ3MgRmFjYWRlLiBUaGlzIHJlZmVyZW5jZSB3aWxsIG5vdCBiZSBhdmFpbGFibGVcbiAqIHVudGlsICNpbml0aWFsaXplTm90aWZpZXIgaGFzIGJlZW4gY2FsbGVkLiBcbiAqIFxuICogQHR5cGUge3B1cmVtdmMuRmFjYWRlfVxuICovXG5Ob3RpZmllci5wcm90b3R5cGUuZmFjYWRlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhpcyBOb3RpZmllciBpbnN0YW5jZS5cbiAqIFxuICogVGhpcyBpcyBob3cgYSBOb3RpZmllciBnZXRzIGl0cyBtdWx0aXRvbktleS4gXG4gKiBDYWxscyB0byAjc2VuZE5vdGlmaWNhdGlvbiBvciB0byBhY2Nlc3MgdGhlXG4gKiBmYWNhZGUgd2lsbCBmYWlsIHVudGlsIGFmdGVyIHRoaXMgbWV0aG9kIFxuICogaGFzIGJlZW4gY2FsbGVkLlxuICogXG4gKiBNZWRpYXRvcnMsIENvbW1hbmRzIG9yIFByb3hpZXMgbWF5IG92ZXJyaWRlIFxuICogdGhpcyBtZXRob2QgaW4gb3JkZXIgdG8gc2VuZCBub3RpZmljYXRpb25zXG4gKiBvciBhY2Nlc3MgdGhlIE11bHRpdG9uIEZhY2FkZSBpbnN0YW5jZSBhc1xuICogc29vbiBhcyBwb3NzaWJsZS4gVGhleSBDQU5OT1QgYWNjZXNzIHRoZSBmYWNhZGVcbiAqIGluIHRoZWlyIGNvbnN0cnVjdG9ycywgc2luY2UgdGhpcyBtZXRob2Qgd2lsbCBub3RcbiAqIHlldCBoYXZlIGJlZW4gY2FsbGVkLlxuICogXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogIFRoZSBOb3RpZmllcnMgbXVsdGl0b24ga2V5O1xuICogQHJldHVybiB7dm9pZH1cbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLmluaXRpYWxpemVOb3RpZmllciA9IGZ1bmN0aW9uKGtleSlcbntcbiAgICB0aGlzLm11bHRpdG9uS2V5ID0gU3RyaW5nKGtleSk7XG4gICAgdGhpcy5mYWNhZGU9IHRoaXMuZ2V0RmFjYWRlKCk7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBNdWx0aXRvbiBGYWNhZGUgaW5zdGFuY2VcbiAqXG4gKlxuICogQHByb3RlY3RlZFxuICogQHJldHVybiB7cHVyZW12Yy5GYWNhZGV9XG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5nZXRGYWNhZGUgPSBmdW5jdGlvbigpXG57XG4gICAgaWYodGhpcy5tdWx0aXRvbktleSA9PSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKE5vdGlmaWVyLk1VTFRJVE9OX01TRyk7XG4gICAgfTtcblxuICAgIHJldHVybiBGYWNhZGUuZ2V0SW5zdGFuY2UodGhpcy5tdWx0aXRvbktleSk7XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBOb3RpZmllcnMgaW50ZXJuYWwgbXVsdGl0b24ga2V5LlxuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHN0cmluZ1xuICovXG5Ob3RpZmllci5wcm90b3R5cGUubXVsdGl0b25LZXkgPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBlcnJvciBtZXNzYWdlIHVzZWQgaWYgdGhlIE5vdGlmaWVyIGlzIG5vdCBpbml0aWFsaXplZCBjb3JyZWN0bHkgYW5kXG4gKiBhdHRlbXB0cyB0byByZXRyaWV2ZSBpdHMgb3duIG11bHRpdG9uIGtleVxuICpcbiAqIEBzdGF0aWNcbiAqIEBwcm90ZWN0ZWRcbiAqIEBjb25zdFxuICogQHR5cGUgc3RyaW5nXG4gKi9cbk5vdGlmaWVyLk1VTFRJVE9OX01TRyA9IFwibXVsdGl0b25LZXkgZm9yIHRoaXMgTm90aWZpZXIgbm90IHlldCBpbml0aWFsaXplZCFcIjtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLlNpbXBsZUNvbW1hbmRcbiAqIEBleHRlbmRzIHB1cmVtdmMuTm90aWZpZXJcbiAqXG4gKiBTaW1wbGVDb21tYW5kcyBlbmNhcHN1bGF0ZSB0aGUgYnVzaW5lc3MgbG9naWMgb2YgeW91ciBhcHBsaWNhdGlvbi4gWW91ciBcbiAqIHN1YmNsYXNzIHNob3VsZCBvdmVycmlkZSB0aGUgI2V4ZWN1dGUgbWV0aG9kIHdoZXJlIHlvdXIgYnVzaW5lc3MgbG9naWMgd2lsbFxuICogaGFuZGxlIHRoZSBcbiAqIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259XG4gKiBcbiAqIFRha2UgYSBsb29rIGF0IFxuICoge0BsaW5rIHB1cmVtdmMuRmFjYWRlI3JlZ2lzdGVyQ29tbWFuZCBGYWNhZGUncyByZWdpc3RlckNvbW1hbmR9XG4gKiBvciB7QGxpbmsgcHVyZW12Yy5Db250cm9sbGVyI3JlZ2lzdGVyQ29tbWFuZCBDb250cm9sbGVycyByZWdpc3RlckNvbW1hbmR9XG4gKiBtZXRob2RzIHRvIHNlZSBob3cgdG8gYWRkIGNvbW1hbmRzIHRvIHlvdXIgYXBwbGljYXRpb24uXG4gKiBcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBTaW1wbGVDb21tYW5kICgpIHsgfTtcblxuU2ltcGxlQ29tbWFuZC5wcm90b3R5cGU9IG5ldyBOb3RpZmllcjtcblNpbXBsZUNvbW1hbmQucHJvdG90eXBlLmNvbnN0cnVjdG9yPSBTaW1wbGVDb21tYW5kO1xuXG4vKipcbiAqIEZ1bGZpbGwgdGhlIHVzZS1jYXNlIGluaXRpYXRlZCBieSB0aGUgZ2l2ZW4gTm90aWZpY2F0aW9uXG4gKiBcbiAqIEluIHRoZSBDb21tYW5kIFBhdHRlcm4sIGFuIGFwcGxpY2F0aW9uIHVzZS1jYXNlIHR5cGljYWxseSBiZWdpbnMgd2l0aCBzb21lXG4gKiB1c2VyIGFjdGlvbiwgd2hpY2ggcmVzdWx0cyBpbiBhIE5vdGlmaWNhdGlvbiBpcyBoYW5kbGVkIGJ5IHRoZSBidXNpbmVzcyBsb2dpY1xuICogaW4gdGhlICNleGVjdXRlIG1ldGhvZCBvZiBhIGNvbW1hbmQuXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5Ob3RpZmljYXRpb259IG5vdGlmaWNhdGlvblxuICogIFRoZSBub3RpZmljYXRpb24gdG8gaGFuZGxlLlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuU2ltcGxlQ29tbWFuZC5wcm90b3R5cGUuZXhlY3V0ZT0gZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikgeyB9O1xuLyoqXG4gKiBAYXV0aG9yIFB1cmVNVkMgSlMgTmF0aXZlIFBvcnQgYnkgRGF2aWQgRm9sZXksIEZyw6lkw6lyaWMgU2F1bmllciwgJiBBbGFpbiBEdWNoZXNuZWF1IFxuICogQGF1dGhvciBDb3B5cmlnaHQoYykgMjAwNi0yMDEyIEZ1dHVyZXNjYWxlLCBJbmMuLCBTb21lIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogQGNsYXNzIHB1cmVtdmMuTWFjcm9Db21tYW5kXG4gKiBAZXh0ZW5kcyBwdXJlbXZjLk5vdGlmaWVyXG4gKiBcbiAqIEEgYmFzZSBjb21tYW5kIGltcGxlbWVudGF0aW9uIHRoYXQgZXhlY3V0ZXMgb3RoZXIgY29tbWFuZHMsIHN1Y2ggYXNcbiAqIHtAbGluayBwdXJlbXZjLlNpbXBsZUNvbW1hbmQgU2ltcGxlQ29tbWFuZH1cbiAqIG9yIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmR9XG4gKiBzdWJjbGFzc2VzLlxuICogIFxuICogQSBNYWNyb0NvbW1hbmQgbWFpbnRhaW5zIGFuIGxpc3Qgb2ZcbiAqIGNvbW1hbmQgY29uc3RydWN0b3IgcmVmZXJlbmNlcyBjYWxsZWQgKlN1YkNvbW1hbmRzKi5cbiAqIFxuICogV2hlbiAjZXhlY3V0ZSBpcyBjYWxsZWQsIHRoZSBNYWNyb0NvbW1hbmRcbiAqIGluc3RhbnRpYXRlcyBhbmQgY2FsbHMgI2V4ZWN1dGUgb24gZWFjaCBvZiBpdHMgKlN1YkNvbW1hbmRzKiBpbiB0dXJuLlxuICogRWFjaCAqU3ViQ29tbWFuZCogd2lsbCBiZSBwYXNzZWQgYSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsXG4gKiB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufSBcbiAqIHRoYXQgd2FzIHBhc3NlZCB0byB0aGUgTWFjcm9Db21tYW5kcyAjZXhlY3V0ZSBtZXRob2RcbiAqIFxuICogVW5saWtlIHtAbGluayBwdXJlbXZjLlNpbXBsZUNvbW1hbmQgU2ltcGxlQ29tbWFuZH0sIFxuICogeW91ciBzdWJjbGFzcyBzaG91bGQgbm90IG92ZXJyaWRlICNleGVjdXRlIGJ1dCBpbnN0ZWFkLCBzaG91bGQgXG4gKiBvdmVycmlkZSB0aGUgI2luaXRpYWxpemVNYWNyb0NvbW1hbmQgbWV0aG9kLCBjYWxsaW5nICNhZGRTdWJDb21tYW5kIG9uY2UgZm9yIFxuICogZWFjaCAqU3ViQ29tbWFuZCogdG8gYmUgZXhlY3V0ZWQuXG4gKiBcbiAqIElmIHlvdXIgc3ViY2xhc3MgZG9lcyBkZWZpbmUgYSBjb25zdHJ1Y3RvciwgYmUgc3VyZSB0byBjYWxsIFwic3VwZXJcIiBsaWtlIHNvXG4gKiBcbiAqICAgICBmdW5jdGlvbiBNeU1hY3JvQ29tbWFuZCAoKVxuICogICAgIHtcbiAqICAgICAgICAgTWFjcm9Db21tYW5kLmNhbGwodGhpcyk7XG4gKiAgICAgfTtcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBNYWNyb0NvbW1hbmQoKVxue1xuICAgIHRoaXMuc3ViQ29tbWFuZHM9IFtdO1xuICAgIHRoaXMuaW5pdGlhbGl6ZU1hY3JvQ29tbWFuZCgpO1xufTtcblxuLyogc3ViY2xhc3MgTm90aWZpZXIgKi9cbk1hY3JvQ29tbWFuZC5wcm90b3R5cGU9IG5ldyBOb3RpZmllcjtcbk1hY3JvQ29tbWFuZC5wcm90b3R5cGUuY29uc3RydWN0b3I9IE1hY3JvQ29tbWFuZDtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHR5cGUge0FycmF5LjxwdXJlbXZjLlNpbXBsZUNvbW1hbmR8cHVyZW12Yy5NYWNyb0NvbW1hbmQ+fVxuICovXG5NYWNyb0NvbW1hbmQucHJvdG90eXBlLnN1YkNvbW1hbmRzPSBudWxsO1xuXG4vKipcbiAqIEBwcm90ZWN0ZWRcbiAqIEluaXRpYWxpemUgdGhlIE1hY3JvQ29tbWFuZC5cbiAqIFxuICogSW4geW91ciBzdWJjbGFzcywgb3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gXG4gKiBpbml0aWFsaXplIHRoZSBNYWNyb0NvbW1hbmQncyAqU3ViQ29tbWFuZCogIFxuICogbGlzdCB3aXRoIGNvbW1hbmQgY2xhc3MgcmVmZXJlbmNlcyBsaWtlIFxuICogdGhpczpcbiAqIFxuICogICAgIC8vIEluaXRpYWxpemUgTXlNYWNyb0NvbW1hbmRcbiAqICAgICBNeU1hY3JvQ29tbWFuZC5wcm90b3R5cGUuaW5pdGlhbGl6ZU1hY3JvQ29tbWFuZD0gZnVuY3Rpb24gKClcbiAqICAgICB7XG4gKiAgICAgICAgIHRoaXMuYWRkU3ViQ29tbWFuZCggY29tLm1lLm15YXBwLmNvbnRyb2xsZXIuRmlyc3RDb21tYW5kICk7XG4gKiAgICAgICAgIHRoaXMuYWRkU3ViQ29tbWFuZCggY29tLm1lLm15YXBwLmNvbnRyb2xsZXIuU2Vjb25kQ29tbWFuZCApO1xuICogICAgICAgICB0aGlzLmFkZFN1YkNvbW1hbmQoIGNvbS5tZS5teWFwcC5jb250cm9sbGVyLlRoaXJkQ29tbWFuZCApO1xuICogICAgIH07XG4gKiBcbiAqIE5vdGUgdGhhdCAqU3ViQ29tbWFuZCpzIG1heSBiZSBhbnkgY29tbWFuZCBpbXBsZW1lbnRvcixcbiAqIE1hY3JvQ29tbWFuZHMgb3IgU2ltcGxlQ29tbWFuZHMgYXJlIGJvdGggYWNjZXB0YWJsZS5cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk1hY3JvQ29tbWFuZC5wcm90b3R5cGUuaW5pdGlhbGl6ZU1hY3JvQ29tbWFuZD0gZnVuY3Rpb24oKSB7fVxuXG4vKipcbiAqIEBwcm90ZWN0ZWRcbiAqIEFkZCBhICpTdWJDb21tYW5kKlxuICogXG4gKiBUaGUgKlN1YkNvbW1hbmQqcyB3aWxsIGJlIGNhbGxlZCBpbiBGaXJzdCBJbiAvIEZpcnN0IE91dCAoRklGTykgb3JkZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbW1hbmRDbGFzc1JlZlxuICogIEEgcmVmZXJlbmNlIHRvIGEgc3ViY2xhc3NlZCBTaW1wbGVDb21tYW5kIG9yIE1hY3JvQ29tbWFuZCBjb25zdHJ1Y3RvclxuICovXG5NYWNyb0NvbW1hbmQucHJvdG90eXBlLmFkZFN1YkNvbW1hbmQ9IGZ1bmN0aW9uKGNvbW1hbmRDbGFzc1JlZilcbntcbiAgICB0aGlzLnN1YkNvbW1hbmRzLnB1c2goY29tbWFuZENsYXNzUmVmKTtcbn07XG5cbi8qKlxuICogRXhlY3V0ZSB0aGlzIE1hY3JvQ29tbWFuZHMgKlN1YkNvbW1hbmRzKlxuICogXG4gKiBUaGUgKlN1YkNvbW1hbmQqcyB3aWxsIGJlIGNhbGxlZCBpbiBGaXJzdCBJbiAvIEZpcnN0IE91dCAoRklGTykgb3JkZXJcbiAqIEBwYXJhbSB7cHVyZW12Yy5Ob3RpZmljYXRpb259IG5vdGVcbiAqICBUaGUgTm90aWZpY2F0aW9uIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gZWFjaCAqU3ViQ29tbWFuZCpcbiAqL1xuTWFjcm9Db21tYW5kLnByb3RvdHlwZS5leGVjdXRlPSBmdW5jdGlvbihub3RlKVxue1xuICAgIC8vIFNJQy0gVE9ETyBvcHRpbWl6ZVxuICAgIHdoaWxlKHRoaXMuc3ViQ29tbWFuZHMubGVuZ3RoID4gMClcbiAgICB7XG4gICAgICAgIHZhciByZWY9IHRoaXMuc3ViQ29tbWFuZHMuc2hpZnQoKTtcbiAgICAgICAgdmFyIGNtZD0gbmV3IHJlZjtcbiAgICAgICAgY21kLmluaXRpYWxpemVOb3RpZmllcih0aGlzLm11bHRpdG9uS2V5KTtcbiAgICAgICAgY21kLmV4ZWN1dGUobm90ZSk7XG4gICAgfVxufTtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLk1lZGlhdG9yXG4gKiBAZXh0ZW5kcyBwdXJlbXZjLk5vdGlmaWVyXG4gKiBcbiAqIEEgYmFzZSBNZWRpYXRvciBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBJbiBQdXJlTVZDLCBNZWRpYXRvciBjbGFzc2VzIGFyZSB1c2VkIHRvIG1lZGlhdGUgY29tbXVuaWNhdGlvbiBiZXR3ZWVuIGEgdmlldyBcbiAqIGNvbXBvbmVudCBhbmQgdGhlIHJlc3Qgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICpcbiAqIEEgTWVkaWF0b3Igc2hvdWxkIGxpc3RlbiB0byBpdHMgdmlldyBjb21wb25lbnRzIGZvciBldmVudHMsIGFuZCBoYW5kbGUgdGhlbSBcbiAqIGJ5IHNlbmRpbmcgbm90aWZpY2F0aW9ucyAodG8gYmUgaGFuZGxlZCBieSBvdGhlciBNZWRpYXRvcnMsIFxuICoge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kc30gXG4gKiBvclxuICoge0BsaW5rIHB1cmVtdmMuTWFjcm9Db21tYW5kIE1hY3JvQ29tbWFuZHN9KSBcbiAqIG9yIHBhc3NpbmcgZGF0YSBmcm9tIHRoZSB2aWV3IGNvbXBvbmVudCBkaXJlY3RseSB0byBhIFxuICoge0BsaW5rIHB1cmVtdmMuUHJveHkgUHJveHl9LCBzdWNoIGFzIHN1Ym1pdHRpbmcgXG4gKiB0aGUgY29udGVudHMgb2YgYSBmb3JtIHRvIGEgc2VydmljZS5cbiAqIFxuICogTWVkaWF0b3JzIHNob3VsZCBub3QgcGVyZm9ybSBidXNpbmVzcyBsb2dpYywgbWFpbnRhaW4gc3RhdGUgb3Igb3RoZXIgXG4gKiBpbmZvcm1hdGlvbiBmb3IgaXRzIHZpZXcgY29tcG9uZW50LCBvciBicmVhayB0aGUgZW5jYXBzdWxhdGlvbiBvZiB0aGUgdmlldyBcbiAqIGNvbXBvbmVudCBieSBtYW5pcHVsYXRpbmcgdGhlIHZpZXcgY29tcG9uZW50J3MgY2hpbGRyZW4uIEl0IHNob3VsZCBvbmx5IGNhbGwgXG4gKiBtZXRob2RzIG9yIHNldCBwcm9wZXJ0aWVzIG9uIHRoZSB2aWV3IGNvbXBvbmVudC5cbiAqICBcbiAqIFRoZSB2aWV3IGNvbXBvbmVudCBzaG91bGQgZW5jYXBzdWxhdGUgaXRzIG93biBiZWhhdmlvciBhbmQgaW1wbGVtZW50YXRpb24gYnkgXG4gKiBleHBvc2luZyBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIHRoYXQgdGhlIE1lZGlhdG9yIGNhbiBjYWxsIHdpdGhvdXQgaGF2aW5nIHRvIFxuICoga25vdyBhYm91dCB0aGUgdmlldyBjb21wb25lbnQncyBjaGlsZHJlbi5cbiAqIFxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge3N0cmluZ30gW21lZGlhdG9yTmFtZV1cbiAqICBUaGUgTWVkaWF0b3JzIG5hbWUuIFRoZSBNZWRpYXRvcnMgc3RhdGljICNOQU1FIHZhbHVlIGlzIHVzZWQgYnkgZGVmYXVsdFxuICogQHBhcmFtIHtPYmplY3R9IFt2aWV3Q29tcG9uZW50XVxuICogIFRoZSBNZWRpYXRvcnMge0BsaW5rICNzZXRWaWV3Q29tcG9uZW50IHZpZXdDb21wb25lbnR9LlxuICovXG5mdW5jdGlvbiBNZWRpYXRvciAobWVkaWF0b3JOYW1lLCB2aWV3Q29tcG9uZW50KVxue1xuICAgIHRoaXMubWVkaWF0b3JOYW1lPSBtZWRpYXRvck5hbWUgfHwgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FO1xuICAgIHRoaXMudmlld0NvbXBvbmVudD12aWV3Q29tcG9uZW50OyAgXG59O1xuXG4vKipcbiAqIEBzdGF0aWNcbiAqIFRoZSBuYW1lIG9mIHRoZSBNZWRpYXRvci5cbiAqIFxuICogVHlwaWNhbGx5LCBhIE1lZGlhdG9yIHdpbGwgYmUgd3JpdHRlbiB0byBzZXJ2ZSBvbmUgc3BlY2lmaWMgY29udHJvbCBvciBncm91cFxuICogb2YgY29udHJvbHMgYW5kIHNvLCB3aWxsIG5vdCBoYXZlIGEgbmVlZCB0byBiZSBkeW5hbWljYWxseSBuYW1lZC5cbiAqIFxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuTWVkaWF0b3IuTkFNRT0gXCJNZWRpYXRvclwiO1xuXG4vKiBzdWJjbGFzcyAqL1xuTWVkaWF0b3IucHJvdG90eXBlPSBuZXcgTm90aWZpZXI7XG5NZWRpYXRvci5wcm90b3R5cGUuY29uc3RydWN0b3I9IE1lZGlhdG9yO1xuXG4vKipcbiAqIEdldCB0aGUgbmFtZSBvZiB0aGUgTWVkaWF0b3JcbiAqIFxuICogQHJldHVybiB7c3RyaW5nfVxuICogIFRoZSBNZWRpYXRvciBuYW1lXG4gKi9cbk1lZGlhdG9yLnByb3RvdHlwZS5nZXRNZWRpYXRvck5hbWU9IGZ1bmN0aW9uICgpXG57XG4gICAgcmV0dXJuIHRoaXMubWVkaWF0b3JOYW1lO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIE1lZGlhdG9ycyB2aWV3IGNvbXBvbmVudC4gVGhpcyBjb3VsZFxuICogYmUgYSBIVE1MRWxlbWVudCwgYSBiZXNwb2tlIFVpQ29tcG9uZW50IHdyYXBwZXJcbiAqIGNsYXNzLCBhIE1vb1Rvb2xzIEVsZW1lbnQsIGEgalF1ZXJ5IHJlc3VsdCBvciBhXG4gKiBjc3Mgc2VsZWN0b3IsIGRlcGVuZGluZyBvbiB3aGljaCBET00gYWJzdHJhY3Rpb24gXG4gKiBsaWJyYXJ5IHlvdSBhcmUgdXNpbmcuXG4gKiBcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IHRoZSB2aWV3IGNvbXBvbmVudFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuTWVkaWF0b3IucHJvdG90eXBlLnNldFZpZXdDb21wb25lbnQ9IGZ1bmN0aW9uICh2aWV3Q29tcG9uZW50KVxue1xuICAgIHRoaXMudmlld0NvbXBvbmVudD0gdmlld0NvbXBvbmVudDtcbn07XG5cbi8qKlxuICogR2V0IHRoZSBNZWRpYXRvcnMgdmlldyBjb21wb25lbnQuXG4gKiBcbiAqIEFkZGl0aW9uYWxseSwgYW4gb3B0aW9uYWwgZXhwbGljaXQgZ2V0dGVyIGNhbiBiZVxuICogYmUgZGVmaW5lZCBpbiB0aGUgc3ViY2xhc3MgdGhhdCBkZWZpbmVzIHRoZSBcbiAqIHZpZXcgY29tcG9uZW50cywgcHJvdmlkaW5nIGEgbW9yZSBzZW1hbnRpYyBpbnRlcmZhY2VcbiAqIHRvIHRoZSBNZWRpYXRvci5cbiAqIFxuICogVGhpcyBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgQVMzIGltcGxlbWVudGF0aW9uIGluXG4gKiB0aGUgc2Vuc2UgdGhhdCBubyBjYXN0aW5nIGlzIHJlcXVpcmVkIGZyb20gdGhlXG4gKiBvYmplY3Qgc3VwcGxpZWQgYXMgdGhlIHZpZXcgY29tcG9uZW50LlxuICogXG4gKiAgICAgTXlNZWRpYXRvci5wcm90b3R5cGUuZ2V0Q29tYm9Cb3g9IGZ1bmN0aW9uICgpXG4gKiAgICAge1xuICogICAgICAgICByZXR1cm4gdGhpcy52aWV3Q29tcG9uZW50OyAgXG4gKiAgICAgfVxuICogXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiAgVGhlIHZpZXcgY29tcG9uZW50XG4gKi9cbk1lZGlhdG9yLnByb3RvdHlwZS5nZXRWaWV3Q29tcG9uZW50PSBmdW5jdGlvbiAoKVxue1xuICAgIHJldHVybiB0aGlzLnZpZXdDb21wb25lbnQ7XG59O1xuXG4vKipcbiAqIExpc3QgdGhlIE5vdGlmaWNhdGlvbiBuYW1lcyB0aGlzIE1lZGlhdG9yIGlzIGludGVyZXN0ZWRcbiAqIGluIGJlaW5nIG5vdGlmaWVkIG9mLlxuICogXG4gKiBAcmV0dXJuIHtBcnJheX0gXG4gKiAgVGhlIGxpc3Qgb2YgTm90aWZpY2F0aW9uIG5hbWVzLlxuICovXG5NZWRpYXRvci5wcm90b3R5cGUubGlzdE5vdGlmaWNhdGlvbkludGVyZXN0cz0gZnVuY3Rpb24gKClcbntcbiAgICByZXR1cm4gW107XG59O1xuXG4vKipcbiAqIEhhbmRsZSBOb3RpZmljYXRpb25zLlxuICogXG4gKiBUeXBpY2FsbHkgdGhpcyB3aWxsIGJlIGhhbmRsZWQgaW4gYSBzd2l0Y2ggc3RhdGVtZW50XG4gKiB3aXRoIG9uZSAnY2FzZScgZW50cnkgcGVyIE5vdGlmaWNhdGlvbiB0aGUgTWVkaWF0b3JcbiAqIGlzIGludGVyZXN0ZWQgaW5cbiAqIFxuICogQHBhcmFtIHtwdXJlbXZjLk5vdGlmaWNhdGlvbn0gbm90aWZpY2F0aW9uXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5NZWRpYXRvci5wcm90b3R5cGUuaGFuZGxlTm90aWZpY2F0aW9uPSBmdW5jdGlvbiAobm90aWZpY2F0aW9uKVxue1xuICAgIHJldHVybjtcbn07XG5cbi8qKlxuICogQ2FsbGVkIGJ5IHRoZSBWaWV3IHdoZW4gdGhlIE1lZGlhdG9yIGlzIHJlZ2lzdGVyZWRcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk1lZGlhdG9yLnByb3RvdHlwZS5vblJlZ2lzdGVyPSBmdW5jdGlvbiAoKVxue1xuICAgIHJldHVybjtcbn07XG5cbi8qKlxuICogQ2FsbGVkIGJ5IHRoZSBWaWV3IHdoZW4gdGhlIE1lZGlhdG9yIGlzIHJlbW92ZWRcbiAqL1xuTWVkaWF0b3IucHJvdG90eXBlLm9uUmVtb3ZlPSBmdW5jdGlvbiAoKVxue1xuICAgIHJldHVybjtcbn07XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIE1lZGlhdG9ycyBuYW1lLiBTaG91bGQgb25seSBiZSBhY2Nlc3NlZCBieSBNZWRpYXRvciBzdWJjbGFzc2VzLlxuICogXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBzdHJpbmdcbiAqL1xuTWVkaWF0b3IucHJvdG90eXBlLm1lZGlhdG9yTmFtZT0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgTWVkaWF0b3JzIHZpZXdDb21wb25lbnQuIFNob3VsZCBvbmx5IGJlIGFjY2Vzc2VkIGJ5IE1lZGlhdG9yIHN1YmNsYXNzZXMuXG4gKiBcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIE9iamVjdFxuICovXG5NZWRpYXRvci5wcm90b3R5cGUudmlld0NvbXBvbmVudD1udWxsO1xuLyoqXG4gKiBAYXV0aG9yIFB1cmVNVkMgSlMgTmF0aXZlIFBvcnQgYnkgRGF2aWQgRm9sZXksIEZyw6lkw6lyaWMgU2F1bmllciwgJiBBbGFpbiBEdWNoZXNuZWF1IFxuICogQGF1dGhvciBDb3B5cmlnaHQoYykgMjAwNi0yMDEyIEZ1dHVyZXNjYWxlLCBJbmMuLCBTb21lIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogQGNsYXNzIHB1cmVtdmMuUHJveHlcbiAqIEBleHRlbmRzIHB1cmVtdmMuTm90aWZpZXJcbiAqXG4gKiBBIGJhc2UgUHJveHkgaW1wbGVtZW50YXRpb24uIFxuICogXG4gKiBJbiBQdXJlTVZDLCBQcm94eSBjbGFzc2VzIGFyZSB1c2VkIHRvIG1hbmFnZSBwYXJ0cyBvZiB0aGUgYXBwbGljYXRpb24ncyBkYXRhIFxuICogbW9kZWwuXG4gKiBcbiAqIEEgUHJveHkgbWlnaHQgc2ltcGx5IG1hbmFnZSBhIHJlZmVyZW5jZSB0byBhIGxvY2FsIGRhdGEgb2JqZWN0LCBpbiB3aGljaCBjYXNlIFxuICogaW50ZXJhY3Rpbmcgd2l0aCBpdCBtaWdodCBpbnZvbHZlIHNldHRpbmcgYW5kIGdldHRpbmcgb2YgaXRzIGRhdGEgaW4gXG4gKiBzeW5jaHJvbm91cyBmYXNoaW9uLlxuICogXG4gKiBQcm94eSBjbGFzc2VzIGFyZSBhbHNvIHVzZWQgdG8gZW5jYXBzdWxhdGUgdGhlIGFwcGxpY2F0aW9uJ3MgaW50ZXJhY3Rpb24gd2l0aCBcbiAqIHJlbW90ZSBzZXJ2aWNlcyB0byBzYXZlIG9yIHJldHJpZXZlIGRhdGEsIGluIHdoaWNoIGNhc2UsIHdlIGFkb3B0IGFuIFxuICogYXN5bmNyb25vdXMgaWRpb207IHNldHRpbmcgZGF0YSAob3IgY2FsbGluZyBhIG1ldGhvZCkgb24gdGhlIFByb3h5IGFuZCBcbiAqIGxpc3RlbmluZyBmb3IgYSBcbiAqIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259IFxuICogdG8gYmUgc2VudCAgd2hlbiB0aGUgUHJveHkgaGFzIHJldHJpZXZlZCB0aGUgZGF0YSBmcm9tIHRoZSBzZXJ2aWNlLiBcbiAqIFxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gW3Byb3h5TmFtZV1cbiAqICBUaGUgUHJveHkncyBuYW1lLiBJZiBub25lIGlzIHByb3ZpZGVkLCB0aGUgUHJveHkgd2lsbCB1c2UgaXRzIGNvbnN0cnVjdG9yc1xuICogIE5BTUUgcHJvcGVydHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW2RhdGFdXG4gKiAgVGhlIFByb3h5J3MgZGF0YSBvYmplY3RcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBQcm94eShwcm94eU5hbWUsIGRhdGEpXG57XG4gICAgdGhpcy5wcm94eU5hbWU9IHByb3h5TmFtZSB8fCB0aGlzLmNvbnN0cnVjdG9yLk5BTUU7XG4gICAgaWYoZGF0YSAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhpcy5zZXREYXRhKGRhdGEpO1xuICAgIH1cbn07XG5cblxuUHJveHkuTkFNRT0gXCJQcm94eVwiO1xuXG5Qcm94eS5wcm90b3R5cGU9IG5ldyBOb3RpZmllcjtcblByb3h5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj0gUHJveHk7XG5cbi8qKlxuICogR2V0IHRoZSBQcm94eSdzIG5hbWUuXG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5Qcm94eS5wcm90b3R5cGUuZ2V0UHJveHlOYW1lPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIHRoaXMucHJveHlOYW1lO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIFByb3h5J3MgZGF0YSBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuUHJveHkucHJvdG90eXBlLnNldERhdGE9IGZ1bmN0aW9uKGRhdGEpXG57XG4gICAgdGhpcy5kYXRhPSBkYXRhO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIFByb3h5J3MgZGF0YSBvYmplY3RcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblByb3h5LnByb3RvdHlwZS5nZXREYXRhPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIHRoaXMuZGF0YTtcbn07XG5cbi8qKlxuICogQ2FsbGVkIGJ5IHRoZSB7QGxpbmsgcHVyZW12Yy5Nb2RlbCBNb2RlbH0gd2hlblxuICogdGhlIFByb3h5IGlzIHJlZ2lzdGVyZWQuXG4gKlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuUHJveHkucHJvdG90eXBlLm9uUmVnaXN0ZXI9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm47XG59O1xuXG4vKipcbiAqIENhbGxlZCBieSB0aGUge0BsaW5rIHB1cmVtdmMuTW9kZWwgTW9kZWx9IHdoZW5cbiAqIHRoZSBQcm94eSBpcyByZW1vdmVkLlxuICogXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5Qcm94eS5wcm90b3R5cGUub25SZW1vdmU9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm47XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBQcm94eXMgbmFtZS5cbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBTdHJpbmdcbiAqL1xuUHJveHkucHJvdG90eXBlLnByb3h5TmFtZT0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgUHJveHkncyBkYXRhIG9iamVjdC5cbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBPYmplY3RcbiAqL1xuUHJveHkucHJvdG90eXBlLmRhdGE9IG51bGw7XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5GYWNhZGVcbiAqIEZhY2FkZSBleHBvc2VzIHRoZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSBDb250cm9sbGVyLCBNb2RlbCBhbmQgVmlld1xuICogYWN0b3JzIHRvIGNsaWVudCBmYWNpbmcgY29kZS4gXG4gKiBcbiAqIFRoaXMgRmFjYWRlIGltcGxlbWVudGF0aW9uIGlzIGEgTXVsdGl0b24sIHNvIHlvdSBzaG91bGQgbm90IGNhbGwgdGhlIFxuICogY29uc3RydWN0b3IgZGlyZWN0bHksIGJ1dCBpbnN0ZWFkIGNhbGwgdGhlIHN0YXRpYyBGYWN0b3J5IG1ldGhvZCwgXG4gKiBwYXNzaW5nIHRoZSB1bmlxdWUga2V5IGZvciB0aGlzIGluc3RhbmNlIHRvICNnZXRJbnN0YW5jZVxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogXHRUaGUgbXVsdGl0b24ga2V5IHRvIHVzZSB0byByZXRyaWV2ZSB0aGUgRmFjYWRlIGluc3RhbmNlLlxuICogQHRocm93cyB7RXJyb3J9IFxuICogIElmIGFuIGF0dGVtcHQgaXMgbWFkZSB0byBpbnN0YW50aWF0ZSBGYWNhZGUgZGlyZWN0bHlcbiAqL1xuZnVuY3Rpb24gRmFjYWRlKGtleSlcbntcbiAgICBpZihGYWNhZGUuaW5zdGFuY2VNYXBba2V5XSAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKEZhY2FkZS5NVUxUSVRPTl9NU0cpO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdGlhbGl6ZU5vdGlmaWVyKGtleSk7XG4gICAgRmFjYWRlLmluc3RhbmNlTWFwW2tleV0gPSB0aGlzO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUZhY2FkZSgpO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBNdWx0aXRvbiBGYWNhZGUgaW5zdGFuY2UuXG4gKiBcbiAqIENhbGxlZCBhdXRvbWF0aWNhbGx5IGJ5IHRoZSBjb25zdHJ1Y3Rvci4gT3ZlcnJpZGUgaW4geW91ciBzdWJjbGFzcyB0byBhbnlcbiAqIHN1YmNsYXNzIHNwZWNpZmljIGluaXRpYWxpemF0aW9ucy4gQmUgc3VyZSB0byBjYWxsIHRoZSAnc3VwZXInIFxuICogaW5pdGlhbGl6ZUZhY2FkZSBtZXRob2QsIHRob3VnaFxuICogXG4gKiAgICAgTXlGYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVGYWNhZGU9IGZ1bmN0aW9uICgpXG4gKiAgICAge1xuICogICAgICAgICBGYWNhZGUuY2FsbCh0aGlzKTtcbiAqICAgICB9O1xuICogQHByb3RlY3RlZFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplRmFjYWRlID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuaW5pdGlhbGl6ZU1vZGVsKCk7XG4gICAgdGhpcy5pbml0aWFsaXplQ29udHJvbGxlcigpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZVZpZXcoKTtcbn07XG5cbi8qKlxuICogRmFjYWRlIE11bHRpdG9uIEZhY3RvcnkgbWV0aG9kLiBcbiAqIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBudWxsIGlmIHN1cHBsaWVkIGFcbiAqIG51bGwgb3IgdW5kZWZpbmVkIG11bHRpdG9uIGtleS5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogXHRUaGUgbXVsdGl0b24ga2V5IHVzZSB0byByZXRyaWV2ZSBhIHBhcnRpY3VsYXIgRmFjYWRlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtwdXJlbXZjLkZhY2FkZX1cbiAqL1xuRmFjYWRlLmdldEluc3RhbmNlID0gZnVuY3Rpb24oa2V5KVxue1xuXHRpZiAobnVsbCA9PSBrZXkpXG5cdFx0cmV0dXJuIG51bGw7XG5cdFx0XG4gICAgaWYoRmFjYWRlLmluc3RhbmNlTWFwW2tleV0gPT0gbnVsbClcbiAgICB7XG4gICAgICAgIEZhY2FkZS5pbnN0YW5jZU1hcFtrZXldID0gbmV3IEZhY2FkZShrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBGYWNhZGUuaW5zdGFuY2VNYXBba2V5XTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUge0BsaW5rIHB1cmVtdmMuQ29udHJvbGxlciBDb250cm9sbGVyfS5cbiAqIFxuICogQ2FsbGVkIGJ5IHRoZSAjaW5pdGlhbGl6ZUZhY2FkZSBtZXRob2QuXG4gKiBcbiAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIGluIHlvdXIgc3ViY2xhc3Mgb2YgRmFjYWRlXG4gKiBpZiBvbmUgb3IgYm90aCBvZiB0aGUgZm9sbG93aW5nIGFyZSB0cnVlOlxuXG4gKiAtIFlvdSB3aXNoIHRvIGluaXRpYWxpemUgYSBkaWZmZXJlbnQgQ29udHJvbGxlclxuICogLSBZb3UgaGF2ZSBcbiAqIHtAbGluayBwdXJlbXZjLlNpbXBsZUNvbW1hbmQgU2ltcGxlQ29tbWFuZH1zXG4gKiBvciB7QGxpbmsgcHVyZW12Yy5NYWNyb0NvbW1hbmQgTWFjcm9Db21tYW5kfXNcbiAqIHRvIHJlZ2lzdGVyIHdpdGggdGhlIENvbnRyb2xsZXJhdCBzdGFydHVwLiAgIFxuICogXG4gKiBJZiB5b3UgZG9uJ3Qgd2FudCB0byBpbml0aWFsaXplIGEgZGlmZmVyZW50IENvbnRyb2xsZXIsIFxuICogY2FsbCB0aGUgJ3N1cGVyJyBpbml0aWFsaXplQ29udHJvbGxlIG1ldGhvZCBhdCB0aGUgYmVnaW5uaW5nIG9mIHlvdXJcbiAqIG1ldGhvZCwgdGhlbiByZWdpc3RlciBjb21tYW5kcy5cbiAqIFxuICogICAgIE15RmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplQ29udHJvbGxlcj0gZnVuY3Rpb24gKClcbiAqICAgICB7XG4gKiAgICAgICAgIEZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZUNvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAqICAgICAgICAgdGhpcy5yZWdpc3RlckNvbW1hbmQoQXBwQ29uc3RhbnRzLkFfTk9URV9OQU1FLCBBQmVzcG9rZUNvbW1hbmQpXG4gKiAgICAgfVxuICogXG4gKiBAcHJvdGVjdGVkXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVDb250cm9sbGVyID0gZnVuY3Rpb24oKVxue1xuICAgIGlmKHRoaXMuY29udHJvbGxlciAhPSBudWxsKVxuICAgICAgICByZXR1cm47XG5cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBDb250cm9sbGVyLmdldEluc3RhbmNlKHRoaXMubXVsdGl0b25LZXkpO1xufTtcblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBJbml0aWFsaXplIHRoZSB7QGxpbmsgcHVyZW12Yy5Nb2RlbCBNb2RlbH07XG4gKiBcbiAqIENhbGxlZCBieSB0aGUgI2luaXRpYWxpemVGYWNhZGUgbWV0aG9kLlxuICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgaW4geW91ciBzdWJjbGFzcyBvZiBGYWNhZGUgaWYgb25lIG9mIHRoZSBmb2xsb3dpbmcgYXJlXG4gKiB0cnVlOlxuICogXG4gKiAtIFlvdSB3aXNoIHRvIGluaXRpYWxpemUgYSBkaWZmZXJlbnQgTW9kZWwuXG4gKiBcbiAqIC0gWW91IGhhdmUge0BsaW5rIHB1cmVtdmMuUHJveHkgUHJveHl9cyB0byBcbiAqICAgcmVnaXN0ZXIgd2l0aCB0aGUgTW9kZWwgdGhhdCBkbyBub3QgcmV0cmlldmUgYSByZWZlcmVuY2UgdG8gdGhlIEZhY2FkZSBhdCBcbiAqICAgY29uc3RydWN0aW9uIHRpbWUuXG4gKiBcbiAqIElmIHlvdSBkb24ndCB3YW50IHRvIGluaXRpYWxpemUgYSBkaWZmZXJlbnQgTW9kZWxcbiAqIGNhbGwgJ3N1cGVyJyAjaW5pdGlhbGl6ZU1vZGVsIGF0IHRoZSBiZWdpbm5pbmcgb2YgeW91ciBtZXRob2QsIHRoZW4gcmVnaXN0ZXIgXG4gKiBQcm94eXMuXG4gKiBcbiAqIE5vdGU6IFRoaXMgbWV0aG9kIGlzICpyYXJlbHkqIG92ZXJyaWRkZW47IGluIHByYWN0aWNlIHlvdSBhcmUgbW9yZVxuICogbGlrZWx5IHRvIHVzZSBhIGNvbW1hbmQgdG8gY3JlYXRlIGFuZCByZWdpc3RlclByb3h5cyB3aXRoIHRoZSBNb2RlbD4sIFxuICogc2luY2UgUHJveHlzIHdpdGggbXV0YWJsZSBkYXRhIHdpbGwgbGlrZWx5XG4gKiBuZWVkIHRvIHNlbmQgTm90aWZpY2F0aW9ucyBhbmQgdGh1cyB3aWxsIGxpa2VseSB3YW50IHRvIGZldGNoIGEgcmVmZXJlbmNlIHRvIFxuICogdGhlIEZhY2FkZSBkdXJpbmcgdGhlaXIgY29uc3RydWN0aW9uLiBcbiAqIFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplTW9kZWwgPSBmdW5jdGlvbigpXG57XG4gICAgaWYodGhpcy5tb2RlbCAhPSBudWxsKVxuICAgICAgICByZXR1cm47XG5cbiAgICB0aGlzLm1vZGVsID0gTW9kZWwuZ2V0SW5zdGFuY2UodGhpcy5tdWx0aXRvbktleSk7XG59O1xuXG4vKipcbiAqIEBwcm90ZWN0ZWRcbiAqIFxuICogSW5pdGlhbGl6ZSB0aGUge0BsaW5rIHB1cmVtdmMuVmlldyBWaWV3fS5cbiAqIFxuICogQ2FsbGVkIGJ5IHRoZSAjaW5pdGlhbGl6ZUZhY2FkZSBtZXRob2QuXG4gKiBcbiAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIGluIHlvdXIgc3ViY2xhc3Mgb2YgRmFjYWRlIGlmIG9uZSBvciBib3RoIG9mIHRoZSBcbiAqIGZvbGxvd2luZyBhcmUgdHJ1ZTpcbiAqXG4gKiAtIFlvdSB3aXNoIHRvIGluaXRpYWxpemUgYSBkaWZmZXJlbnQgVmlldy5cbiAqIC0gWW91IGhhdmUgT2JzZXJ2ZXJzIHRvIHJlZ2lzdGVyIHdpdGggdGhlIFZpZXdcbiAqIFxuICogSWYgeW91IGRvbid0IHdhbnQgdG8gaW5pdGlhbGl6ZSBhIGRpZmZlcmVudCBWaWV3IFxuICogY2FsbCAnc3VwZXInICNpbml0aWFsaXplVmlldyBhdCB0aGUgYmVnaW5uaW5nIG9mIHlvdXJcbiAqIG1ldGhvZCwgdGhlbiByZWdpc3RlciBNZWRpYXRvciBpbnN0YW5jZXMuXG4gKiBcbiAqICAgICBNeUZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZVZpZXc9IGZ1bmN0aW9uICgpXG4gKiAgICAge1xuICogICAgICAgICBGYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVWaWV3LmNhbGwodGhpcyk7XG4gKiAgICAgICAgIHRoaXMucmVnaXN0ZXJNZWRpYXRvcihuZXcgTXlNZWRpYXRvcigpKTtcbiAqICAgICB9O1xuICogXG4gKiBOb3RlOiBUaGlzIG1ldGhvZCBpcyAqcmFyZWx5KiBvdmVycmlkZGVuOyBpbiBwcmFjdGljZSB5b3UgYXJlIG1vcmVcbiAqIGxpa2VseSB0byB1c2UgYSBjb21tYW5kIHRvIGNyZWF0ZSBhbmQgcmVnaXN0ZXIgTWVkaWF0b3JzXG4gKiB3aXRoIHRoZSBWaWV3LCBzaW5jZSBNZWRpYXRvciBpbnN0YW5jZXMgd2lsbCBuZWVkIHRvIHNlbmQgXG4gKiBOb3RpZmljYXRpb25zIGFuZCB0aHVzIHdpbGwgbGlrZWx5IHdhbnQgdG8gZmV0Y2ggYSByZWZlcmVuY2UgXG4gKiB0byB0aGUgRmFjYWRlIGR1cmluZyB0aGVpciBjb25zdHJ1Y3Rpb24uIFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplVmlldyA9IGZ1bmN0aW9uKClcbntcbiAgICBpZih0aGlzLnZpZXcgIT0gbnVsbClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgdGhpcy52aWV3ID0gVmlldy5nZXRJbnN0YW5jZSh0aGlzLm11bHRpdG9uS2V5KTtcbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBjb21tYW5kIHdpdGggdGhlIENvbnRyb2xsZXIgYnkgTm90aWZpY2F0aW9uIG5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb25OYW1lXG4gKiAgVGhlIG5hbWUgb2YgdGhlIE5vdGlmaWNhdGlvbiB0byBhc3NvY2lhdGUgdGhlIGNvbW1hbmQgd2l0aFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29tbWFuZENsYXNzUmVmXG4gKiAgQSByZWZlcmVuY2Ugb3QgdGhlIGNvbW1hbmRzIGNvbnN0cnVjdG9yLlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5yZWdpc3RlckNvbW1hbmQgPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lLCBjb21tYW5kQ2xhc3NSZWYpXG57XG4gICAgdGhpcy5jb250cm9sbGVyLnJlZ2lzdGVyQ29tbWFuZChub3RpZmljYXRpb25OYW1lLCBjb21tYW5kQ2xhc3NSZWYpO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgY29tbWFuZCB0byBOb3RpZmljYXRpb24gbWFwcGluZyBmcm9tIHRoZVxuICoge0BsaW5rIHB1cmVtdmMuQ29udHJvbGxlciNyZW1vdmVDb21tYW5kIENvbnRyb2xsZXJ9XG4gKiBAcGFyYW0ge3N0cmluZ30gbm90aWZpY2F0aW9uTmFtZVxuICogIFRoZSBuYW1lIG9mIHRoZSB0aGUgTm90aWZpY2F0aW9uIHRvIHJlbW92ZSBmcm9tIHRoZSBjb21tYW5kIG1hcHBpbmcgZm9yLlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5yZW1vdmVDb21tYW5kID0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSlcbntcbiAgICB0aGlzLmNvbnRyb2xsZXIucmVtb3ZlQ29tbWFuZChub3RpZmljYXRpb25OYW1lKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBjb21tYW5kIGlzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gbm90aWZpY2F0aW9uLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gbm90aWZpY2F0aW9uTmFtZVxuICogIEEgTm90aWZpY2F0aW9uIG5hbWVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKiAgV2hldGhlciBhIGNvbW1hbiBpcyBjdXJyZW50bHkgcmVnaXN0ZXJlZCBmb3IgdGhlIGdpdmVuIG5vdGlmaWNhdGlvbk5hbWVcbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5oYXNDb21tYW5kID0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSlcbntcbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLmhhc0NvbW1hbmQobm90aWZpY2F0aW9uTmFtZSk7XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgUHJveHkgd2l0aCB0aGUge0BsaW5rIHB1cmVtdmMuTW9kZWwjcmVnaXN0ZXJQcm94eSBNb2RlbH1cbiAqIGJ5IG5hbWUuXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5Qcm94eX0gcHJveHlcbiAqICBUaGUgUHJveHkgaW5zdGFuY2UgdG8gYmUgcmVnaXN0ZXJlZCB3aXRoIHRoZSBNb2RlbC5cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUucmVnaXN0ZXJQcm94eSA9IGZ1bmN0aW9uKHByb3h5KVxue1xuICAgIHRoaXMubW9kZWwucmVnaXN0ZXJQcm94eShwcm94eSk7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIGEgUHJveHkgZnJvbSB0aGUgTW9kZWxcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IHByb3h5TmFtZVxuICogQHJldHVybiB7cHVyZW12Yy5Qcm94eX1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5yZXRyaWV2ZVByb3h5ID0gZnVuY3Rpb24ocHJveHlOYW1lKVxue1xuICAgIHJldHVybiB0aGlzLm1vZGVsLnJldHJpZXZlUHJveHkocHJveHlOYW1lKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgUHJveHkgZnJvbSB0aGUgTW9kZWwgYnkgbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IHByb3h5TmFtZVxuICogIFRoZSBuYW1lIG9mIHRoZSBQcm94eVxuICogQHJldHVybiB7cHVyZW12Yy5Qcm94eX1cbiAqICBUaGUgUHJveHkgdGhhdCB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBNb2RlbFxuICovXG5GYWNhZGUucHJvdG90eXBlLnJlbW92ZVByb3h5ID0gZnVuY3Rpb24ocHJveHlOYW1lKVxue1xuICAgIHZhciBwcm94eSA9IG51bGw7XG4gICAgaWYodGhpcy5tb2RlbCAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgcHJveHkgPSB0aGlzLm1vZGVsLnJlbW92ZVByb3h5KHByb3h5TmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3h5O1xufTtcblxuLyoqXG4gKiBDaGVjayBpdCBhIFByb3h5IGlzIHJlZ2lzdGVyZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJveHlOYW1lXG4gKiAgQSBQcm94eSBuYW1lXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICogIFdoZXRoZXIgYSBQcm94eSBpcyBjdXJyZW50bHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBnaXZlbiBwcm94eU5hbWVcbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5oYXNQcm94eSA9IGZ1bmN0aW9uKHByb3h5TmFtZSlcbntcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5oYXNQcm94eShwcm94eU5hbWUpO1xufTtcblxuLyoqXG4gKiBSZWdpc3RlciBhIE1lZGlhdG9yIHdpdGggd2l0aCB0aGUgVmlldy5cbiAqIFxuICogQHBhcmFtIHtwdXJlbXZjLk1lZGlhdG9yfSBtZWRpYXRvclxuICogIEEgcmVmZXJlbmNlIHRvIHRoZSBNZWRpYXRvciB0byByZWdpc3RlclxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5yZWdpc3Rlck1lZGlhdG9yID0gZnVuY3Rpb24obWVkaWF0b3IpXG57XG4gICAgaWYodGhpcy52aWV3ICE9IG51bGwpXG4gICAge1xuICAgICAgICB0aGlzLnZpZXcucmVnaXN0ZXJNZWRpYXRvcihtZWRpYXRvcik7XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSBhIE1lZGlhdG9yIGZyb20gdGhlIFZpZXcgYnkgbmFtZVxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVkaWF0b3JOYW1lXG4gKiAgVGhlIE1lZGlhdG9ycyBuYW1lXG4gKiBAcmV0dXJuIHtwdXJlbXZjLk1lZGlhdG9yfVxuICogIFRoZSByZXRyaWV2ZWQgTWVkaWF0b3JcbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5yZXRyaWV2ZU1lZGlhdG9yID0gZnVuY3Rpb24obWVkaWF0b3JOYW1lKVxue1xuICAgIHJldHVybiB0aGlzLnZpZXcucmV0cmlldmVNZWRpYXRvcihtZWRpYXRvck5hbWUpO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYSBNZWRpYXRvciBmcm9tIHRoZSBWaWV3LlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVkaWF0b3JOYW1lXG4gKiAgVGhlIG5hbWUgb2YgdGhlIE1lZGlhdG9yIHRvIHJlbW92ZS5cbiAqIEByZXR1cm4ge3B1cmVtdmMuTWVkaWF0b3J9XG4gKiAgVGhlIHJlbW92ZWQgTWVkaWF0b3JcbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5yZW1vdmVNZWRpYXRvciA9IGZ1bmN0aW9uKG1lZGlhdG9yTmFtZSlcbntcbiAgICB2YXIgbWVkaWF0b3IgPSBudWxsO1xuICAgIGlmKHRoaXMudmlldyAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgbWVkaWF0b3IgPSB0aGlzLnZpZXcucmVtb3ZlTWVkaWF0b3IobWVkaWF0b3JOYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVkaWF0b3I7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGEgTWVkaWF0b3IgaXMgcmVnaXN0ZXJlZCBvciBub3QuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZWRpYXRvck5hbWVcbiAqICBBIE1lZGlhdG9yIG5hbWVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKiAgV2hldGhlciBhIE1lZGlhdG9yIGlzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ2l2ZW4gbWVkaWF0b3JOYW1lXG4gKi9cbkZhY2FkZS5wcm90b3R5cGUuaGFzTWVkaWF0b3IgPSBmdW5jdGlvbihtZWRpYXRvck5hbWUpXG57XG4gICAgcmV0dXJuIHRoaXMudmlldy5oYXNNZWRpYXRvcihtZWRpYXRvck5hbWUpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYW5kIHNlbmQgYSBcbiAqIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259XG4gKiBcbiAqIEtlZXBzIHVzIGZyb20gaGF2aW5nIHRvIGNvbnN0cnVjdCBuZXcgTm90aWZpY2F0aW9uIGluc3RhbmNlcyBpbiBvdXJcbiAqIGltcGxlbWVudGF0aW9uXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb25OYW1lXG4gKiAgVGhlIG5hbWUgb2YgdGhlIE5vdGlmaWNhdGlvbiB0byBzZW5kXG4gKiBAcGFyYW0ge09iamVjdH0gW2JvZHldXG4gKiAgVGhlIGJvZHkgb2YgdGhlIG5vdGlmaWNhdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXVxuICogIFRoZSB0eXBlIG9mIHRoZSBub3RpZmljYXRpb25cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUuc2VuZE5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbk5hbWUsIGJvZHksIHR5cGUpXG57XG4gICAgdGhpcy5ub3RpZnlPYnNlcnZlcnMobmV3IE5vdGlmaWNhdGlvbihub3RpZmljYXRpb25OYW1lLCBib2R5LCB0eXBlKSk7XG59O1xuXG4vKipcbiAqIE5vdGlmeSB7QGxpbmsgcHVyZW12Yy5PYnNlcnZlciBPYnNlcnZlcn1zXG4gKiBcbiAqIFRoaXMgbWV0aG9kIGlzIGxlZnQgcHVibGljIG1vc3RseSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgYW5kIHRvIGFsbG93XG4gKiB5b3UgdG8gc2VuZCBjdXN0b20gbm90aWZpY2F0aW9uIGNsYXNzZXMgdXNpbmcgdGhlIGZhY2FkZS5cbiAqIFxuICogVXN1YWxseSB5b3Ugc2hvdWxkIGp1c3QgY2FsbCBzZW5kTm90aWZpY2F0aW9uIGFuZCBwYXNzIHRoZSBwYXJhbWV0ZXJzLCBuZXZlciBcbiAqIGhhdmluZyB0byBjb25zdHJ1Y3QgdGhlIG5vdGlmaWNhdGlvbiB5b3Vyc2VsZi5cbiAqIFxuICogQHBhcmFtIHtwdXJlbXZjLk5vdGlmaWNhdGlvbn0gbm90aWZpY2F0aW9uXG4gKiAgVGhlIE5vdGlmaWNhdGlvbiB0byBzZW5kXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLm5vdGlmeU9ic2VydmVycyA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbilcbntcbiAgICBpZih0aGlzLnZpZXcgIT0gbnVsbClcbiAgICB7XG4gICAgICAgIHRoaXMudmlldy5ub3RpZnlPYnNlcnZlcnMobm90aWZpY2F0aW9uKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIEZhY2FkZXMgTm90aWZpZXIgY2FwYWJpbGl0aWVzIGJ5IHNldHRpbmcgdGhlIE11bHRpdG9uIGtleSBmb3IgXG4gKiB0aGlzIGZhY2FkZSBpbnN0YW5jZS5cbiAqIFxuICogTm90IGNhbGxlZCBkaXJlY3RseSwgYnV0IGluc3RlYWQgZnJvbSB0aGUgY29uc3RydWN0b3Igd2hlbiAjZ2V0SW5zdGFuY2UgaXMgXG4gKiBpbnZva2VkLiBJdCBpcyBuZWNlc3NhcnkgdG8gYmUgcHVibGljIGluIG9yZGVyIHRvIGltcGxlbWVudCBOb3RpZmllclxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVOb3RpZmllciA9IGZ1bmN0aW9uKGtleSlcbntcbiAgICB0aGlzLm11bHRpdG9uS2V5ID0ga2V5O1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBhICpDb3JlKiBpcyByZWdpc3RlcmVkIG9yIG5vdFxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqICBUaGUgbXVsdGl0b24ga2V5IGZvciB0aGUgKkNvcmUqIGluIHF1ZXN0aW9uXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICogIFdoZXRoZXIgYSAqQ29yZSogaXMgcmVnaXN0ZXJlZCB3aXRoIHRoZSBnaXZlbiBrZXlcbiAqL1xuRmFjYWRlLmhhc0NvcmUgPSBmdW5jdGlvbihrZXkpXG57XG4gICAgcmV0dXJuIEZhY2FkZS5pbnN0YW5jZU1hcFtrZXldICE9IG51bGw7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhICpDb3JlKiBcbiAqIFxuICogUmVtb3ZlIHRoZSBNb2RlbCwgVmlldywgQ29udHJvbGxlciBhbmQgRmFjYWRlIGZvciBhIGdpdmVuIGtleS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucmVtb3ZlQ29yZSA9IGZ1bmN0aW9uKGtleSlcbntcbiAgICBpZihGYWNhZGUuaW5zdGFuY2VNYXBba2V5XSA9PSBudWxsKVxuICAgICAgICByZXR1cm47XG5cbiAgICBNb2RlbC5yZW1vdmVNb2RlbChrZXkpO1xuICAgIFZpZXcucmVtb3ZlVmlldyhrZXkpO1xuICAgIENvbnRyb2xsZXIucmVtb3ZlQ29udHJvbGxlcihrZXkpO1xuICAgIGRlbGV0ZSBGYWNhZGUuaW5zdGFuY2VNYXBba2V5XTtcbn07XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIEZhY2FkZXMgY29ycmVzcG9uZGluZyBDb250cm9sbGVyXG4gKlxuICogQHByb3RlY3RlZFxuICogQHR5cGUgcHVyZW12Yy5Db250cm9sbGVyXG4gKi9cbkZhY2FkZS5wcm90b3R5cGUuY29udHJvbGxlciA9IG51bGw7XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIEZhY2FkZXMgY29ycmVzcG9uZGluZyBNb2RlbCBpbnN0YW5jZVxuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHB1cmVtdmMuTW9kZWxcbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5tb2RlbCA9IG51bGw7XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIEZhY2FkZXMgY29ycmVzcG5kaW5nIFZpZXcgaW5zdGFuY2UuXG4gKlxuICogQHByb3RlY3RlZFxuICogQHR5cGUgcHVyZW12Yy5WaWV3XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUudmlldyA9IG51bGw7XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIEZhY2FkZXMgbXVsdGl0b24ga2V5LlxuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHN0cmluZ1xuICovXG5GYWNhZGUucHJvdG90eXBlLm11bHRpdG9uS2V5ID0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgTXVsdGl0b24gRmFjYWRlIGluc3RhbmNlIG1hcC5cbiAqIEBzdGF0aWNcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIEFycmF5XG4gKi9cbkZhY2FkZS5pbnN0YW5jZU1hcCA9IFtdO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIE1lc3NhZ2UgQ29uc3RhbnRzXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQGNvbnN0XG4gKiBAc3RhdGljXG4gKi9cbkZhY2FkZS5NVUxUSVRPTl9NU0cgPSBcIkZhY2FkZSBpbnN0YW5jZSBmb3IgdGhpcyBNdWx0aXRvbiBrZXkgYWxyZWFkeSBjb25zdHJ1Y3RlZCFcIjtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLlZpZXdcbiAqIFxuICogQSBNdWx0aXRvbiBWaWV3IGltcGxlbWVudGF0aW9uLlxuICogXG4gKiBJbiBQdXJlTVZDLCB0aGUgVmlldyBjbGFzcyBhc3N1bWVzIHRoZXNlIHJlc3BvbnNpYmlsaXRpZXNcbiAqIFxuICogLSBNYWludGFpbiBhIGNhY2hlIG9mIHtAbGluayBwdXJlbXZjLk1lZGlhdG9yIE1lZGlhdG9yfVxuICogICBpbnN0YW5jZXMuXG4gKiBcbiAqIC0gUHJvdmlkZSBtZXRob2RzIGZvciByZWdpc3RlcmluZywgcmV0cmlldmluZywgYW5kIHJlbW92aW5nIFxuICogICB7QGxpbmsgcHVyZW12Yy5NZWRpYXRvciBNZWRpYXRvcn0uXG4gKiBcbiAqIC0gTm90aWZpeWluZyB7QGxpbmsgcHVyZW12Yy5NZWRpYXRvciBNZWRpYXRvcn0gd2hlbiB0aGV5IGFyZSByZWdpc3RlcmVkIG9yIFxuICogICByZW1vdmVkLlxuICogXG4gKiAtIE1hbmFnaW5nIHRoZSBvYnNlcnZlciBsaXN0cyBmb3IgZWFjaCB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufSAgXG4gKiAgIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqIFxuICogLSBQcm92aWRpbmcgYSBtZXRob2QgZm9yIGF0dGFjaGluZyB7QGxpbmsgcHVyZW12Yy5PYnNlcnZlciBPYnNlcnZlcn0gdG8gYW4gXG4gKiAgIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259J3Mgb2JzZXJ2ZXIgbGlzdC5cbiAqIFxuICogLSBQcm92aWRpbmcgYSBtZXRob2QgZm9yIGJyb2FkY2FzdGluZyBhIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259LlxuICogXG4gKiAtIE5vdGlmeWluZyB0aGUge0BsaW5rIHB1cmVtdmMuT2JzZXJ2ZXIgT2JzZXJ2ZXJ9cyBvZiBhIGdpdmVuIFxuICogICB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufSB3aGVuIGl0IGJyb2FkY2FzdC5cbiAqIFxuICogVGhpcyBWaWV3IGltcGxlbWVudGF0aW9uIGlzIGEgTXVsdGl0b24sIHNvIHlvdSBzaG91bGQgbm90IGNhbGwgdGhlIFxuICogY29uc3RydWN0b3IgZGlyZWN0bHksIGJ1dCBpbnN0ZWFkIGNhbGwgdGhlIHN0YXRpYyBNdWx0aXRvbiBcbiAqIEZhY3RvcnkgI2dldEluc3RhbmNlIG1ldGhvZC5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogQGNvbnN0cnVjdG9yXG4gKiBAdGhyb3dzIHtFcnJvcn0gXG4gKiAgaWYgaW5zdGFuY2UgZm9yIHRoaXMgTXVsdGl0b24ga2V5IGhhcyBhbHJlYWR5IGJlZW4gY29uc3RydWN0ZWRcbiAqL1xuZnVuY3Rpb24gVmlldyhrZXkpXG57XG4gICAgaWYoVmlldy5pbnN0YW5jZU1hcFtrZXldICE9IG51bGwpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoVmlldy5NVUxUSVRPTl9NU0cpO1xuICAgIH07XG5cbiAgICB0aGlzLm11bHRpdG9uS2V5ID0ga2V5O1xuICAgIFZpZXcuaW5zdGFuY2VNYXBbdGhpcy5tdWx0aXRvbktleV0gPSB0aGlzO1xuICAgIHRoaXMubWVkaWF0b3JNYXAgPSBbXTtcbiAgICB0aGlzLm9ic2VydmVyTWFwID0gW107XG4gICAgdGhpcy5pbml0aWFsaXplVmlldygpO1xufTtcblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBJbml0aWFsaXplIHRoZSBTaW5nbGV0b24gVmlldyBpbnN0YW5jZVxuICogXG4gKiBDYWxsZWQgYXV0b21hdGljYWxseSBieSB0aGUgY29uc3RydWN0b3IsIHRoaXMgaXMgeW91ciBvcHBvcnR1bml0eSB0b1xuICogaW5pdGlhbGl6ZSB0aGUgU2luZ2xldG9uIGluc3RhbmNlIGluIHlvdXIgc3ViY2xhc3Mgd2l0aG91dCBvdmVycmlkaW5nIHRoZVxuICogY29uc3RydWN0b3JcbiAqIFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuVmlldy5wcm90b3R5cGUuaW5pdGlhbGl6ZVZpZXcgPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuO1xufTtcblxuLyoqXG4gKiBWaWV3IFNpbmdsZXRvbiBGYWN0b3J5IG1ldGhvZC5cbiAqIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBudWxsIGlmIHN1cHBsaWVkIGEgbnVsbCBcbiAqIG9yIHVuZGVmaW5lZCBtdWx0aXRvbiBrZXkuXG4gKiAgXG4gKiBAcmV0dXJuIHtwdXJlbXZjLlZpZXd9XG4gKiAgVGhlIFNpbmdsZXRvbiBpbnN0YW5jZSBvZiBWaWV3XG4gKi9cblZpZXcuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbihrZXkpXG57XG5cdGlmIChudWxsID09IGtleSlcblx0XHRyZXR1cm4gbnVsbDtcblx0XHRcbiAgICBpZihWaWV3Lmluc3RhbmNlTWFwW2tleV0gPT0gbnVsbClcbiAgICB7XG4gICAgICAgIFZpZXcuaW5zdGFuY2VNYXBba2V5XSA9IG5ldyBWaWV3KGtleSk7XG4gICAgfTtcblxuICAgIHJldHVybiBWaWV3Lmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGFuIE9ic2VydmVyIHRvIGJlIG5vdGlmaWVkIG9mIE5vdGlmaWNhdGlvbnMgd2l0aCBhIGdpdmVuIG5hbWVcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICBUaGUgbmFtZSBvZiB0aGUgTm90aWZpY2F0aW9ucyB0byBub3RpZnkgdGhpcyBPYnNlcnZlciBvZlxuICogQHBhcmFtIHtwdXJlbXZjLk9ic2VydmVyfSBvYnNlcnZlclxuICogIFRoZSBPYnNlcnZlciB0byByZWdpc3Rlci5cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cblZpZXcucHJvdG90eXBlLnJlZ2lzdGVyT2JzZXJ2ZXIgPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lLCBvYnNlcnZlcilcbntcbiAgICBpZih0aGlzLm9ic2VydmVyTWFwW25vdGlmaWNhdGlvbk5hbWVdICE9IG51bGwpXG4gICAge1xuICAgICAgICB0aGlzLm9ic2VydmVyTWFwW25vdGlmaWNhdGlvbk5hbWVdLnB1c2gob2JzZXJ2ZXIpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICB0aGlzLm9ic2VydmVyTWFwW25vdGlmaWNhdGlvbk5hbWVdID0gW29ic2VydmVyXTtcbiAgICB9XG59O1xuXG4vKipcbiAqIE5vdGlmeSB0aGUgT2JzZXJ2ZXJzZm9yIGEgcGFydGljdWxhciBOb3RpZmljYXRpb24uXG4gKiBcbiAqIEFsbCBwcmV2aW91c2x5IGF0dGFjaGVkIE9ic2VydmVycyBmb3IgdGhpcyBOb3RpZmljYXRpb24nc1xuICogbGlzdCBhcmUgbm90aWZpZWQgYW5kIGFyZSBwYXNzZWQgYSByZWZlcmVuY2UgdG8gdGhlIElOb3RpZmljYXRpb24gaW4gXG4gKiB0aGUgb3JkZXIgaW4gd2hpY2ggdGhleSB3ZXJlIHJlZ2lzdGVyZWQuXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5Ob3RpZmljYXRpb259IG5vdGlmaWNhdGlvblxuICogIFRoZSBOb3RpZmljYXRpb24gdG8gbm90aWZ5IE9ic2VydmVycyBvZlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuVmlldy5wcm90b3R5cGUubm90aWZ5T2JzZXJ2ZXJzID0gZnVuY3Rpb24obm90aWZpY2F0aW9uKVxue1xuICAgIC8vIFNJQ1xuICAgIGlmKHRoaXMub2JzZXJ2ZXJNYXBbbm90aWZpY2F0aW9uLmdldE5hbWUoKV0gIT0gbnVsbClcbiAgICB7XG4gICAgICAgIHZhciBvYnNlcnZlcnNfcmVmID0gdGhpcy5vYnNlcnZlck1hcFtub3RpZmljYXRpb24uZ2V0TmFtZSgpXSwgb2JzZXJ2ZXJzID0gW10sIG9ic2VydmVyXG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG9ic2VydmVyc19yZWYubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9ic2VydmVyID0gb2JzZXJ2ZXJzX3JlZltpXTtcbiAgICAgICAgICAgIG9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBvYnNlcnZlcnMubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9ic2VydmVyID0gb2JzZXJ2ZXJzW2ldO1xuICAgICAgICAgICAgb2JzZXJ2ZXIubm90aWZ5T2JzZXJ2ZXIobm90aWZpY2F0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBPYnNlcnZlciBmb3IgYSBnaXZlbiBub3RpZnlDb250ZXh0IGZyb20gYW4gb2JzZXJ2ZXIgbGlzdCBmb3JcbiAqIGEgZ2l2ZW4gTm90aWZpY2F0aW9uIG5hbWVcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICBXaGljaCBvYnNlcnZlciBsaXN0IHRvIHJlbW92ZSBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gbm90aWZ5Q29udGV4dFxuICogIFJlbW92ZSB0aGUgT2JzZXJ2ZXIgd2l0aCB0aGlzIG9iamVjdCBhcyBpdHMgbm90aWZ5Q29udGV4dFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuVmlldy5wcm90b3R5cGUucmVtb3ZlT2JzZXJ2ZXIgPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lLCBub3RpZnlDb250ZXh0KVxue1xuICAgIC8vIFNJQ1xuICAgIHZhciBvYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVyTWFwW25vdGlmaWNhdGlvbk5hbWVdO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBvYnNlcnZlcnMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICBpZihvYnNlcnZlcnNbaV0uY29tcGFyZU5vdGlmeUNvbnRleHQobm90aWZ5Q29udGV4dCkgPT0gdHJ1ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgb2JzZXJ2ZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYob2JzZXJ2ZXJzLmxlbmd0aCA9PSAwKVxuICAgIHtcbiAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJNYXBbbm90aWZpY2F0aW9uTmFtZV07XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZWdpc3RlciBhIE1lZGlhdG9yIGluc3RhbmNlIHdpdGggdGhlIFZpZXcuXG4gKiBcbiAqIFJlZ2lzdGVycyB0aGUgTWVkaWF0b3Igc28gdGhhdCBpdCBjYW4gYmUgcmV0cmlldmVkIGJ5IG5hbWUsXG4gKiBhbmQgZnVydGhlciBpbnRlcnJvZ2F0ZXMgdGhlIE1lZGlhdG9yIGZvciBpdHMgXG4gKiB7QGxpbmsgcHVyZW12Yy5NZWRpYXRvciNsaXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzIGludGVyZXN0c30uXG4gKlxuICogSWYgdGhlIE1lZGlhdG9yIHJldHVybnMgYW55IE5vdGlmaWNhdGlvblxuICogbmFtZXMgdG8gYmUgbm90aWZpZWQgYWJvdXQsIGFuIE9ic2VydmVyIGlzIGNyZWF0ZWQgZW5jYXBzdWxhdGluZyBcbiAqIHRoZSBNZWRpYXRvciBpbnN0YW5jZSdzIFxuICoge0BsaW5rIHB1cmVtdmMuTWVkaWF0b3IjaGFuZGxlTm90aWZpY2F0aW9uIGhhbmRsZU5vdGlmaWNhdGlvbn1cbiAqIG1ldGhvZCBhbmQgcmVnaXN0ZXJpbmcgaXQgYXMgYW4gT2JzZXJ2ZXIgZm9yIGFsbCBOb3RpZmljYXRpb25zIHRoZSBcbiAqIE1lZGlhdG9yIGlzIGludGVyZXN0ZWQgaW4uXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5NZWRpYXRvcn0gXG4gKiAgYSByZWZlcmVuY2UgdG8gdGhlIE1lZGlhdG9yIGluc3RhbmNlXG4gKi9cblZpZXcucHJvdG90eXBlLnJlZ2lzdGVyTWVkaWF0b3IgPSBmdW5jdGlvbihtZWRpYXRvcilcbntcbiAgICBpZih0aGlzLm1lZGlhdG9yTWFwW21lZGlhdG9yLmdldE1lZGlhdG9yTmFtZSgpXSAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1lZGlhdG9yLmluaXRpYWxpemVOb3RpZmllcih0aGlzLm11bHRpdG9uS2V5KTtcbiAgICAvLyByZWdpc3RlciB0aGUgbWVkaWF0b3IgZm9yIHJldHJpZXZhbCBieSBuYW1lXG4gICAgdGhpcy5tZWRpYXRvck1hcFttZWRpYXRvci5nZXRNZWRpYXRvck5hbWUoKV0gPSBtZWRpYXRvcjtcblxuICAgIC8vIGdldCBub3RpZmljYXRpb24gaW50ZXJlc3RzIGlmIGFueVxuICAgIHZhciBpbnRlcmVzdHMgPSBtZWRpYXRvci5saXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzKCk7XG5cbiAgICAvLyByZWdpc3RlciBtZWRpYXRvciBhcyBhbiBvYnNlcnZlciBmb3IgZWFjaCBub3RpZmljYXRpb25cbiAgICBpZihpbnRlcmVzdHMubGVuZ3RoID4gMClcbiAgICB7XG4gICAgICAgIC8vIGNyZWF0ZSBvYnNlcnZlciByZWZlcmVuY2luZyB0aGlzIG1lZGlhdG9ycyBoYW5kbGVOb3RpZmljYXRpb24gbWV0aG9kXG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBPYnNlcnZlcihtZWRpYXRvci5oYW5kbGVOb3RpZmljYXRpb24sIG1lZGlhdG9yKTtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGludGVyZXN0cy5sZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3Rlck9ic2VydmVyKGludGVyZXN0c1tpXSwgb2JzZXJ2ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWVkaWF0b3Iub25SZWdpc3RlcigpO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGEgTWVkaWF0b3IgZnJvbSB0aGUgVmlld1xuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVkaWF0b3JOYW1lXG4gKiAgVGhlIG5hbWUgb2YgdGhlIE1lZGlhdG9yIGluc3RhbmNlIHRvIHJldHJpZXZlXG4gKiBAcmV0dXJuIHtwdXJlbXZjLk1lZGlhdG9yfVxuICogIFRoZSBNZWRpYXRvciBpbnN0YW5jZSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ2l2ZW4gbWVkaWF0b3JOYW1lXG4gKi9cblZpZXcucHJvdG90eXBlLnJldHJpZXZlTWVkaWF0b3IgPSBmdW5jdGlvbihtZWRpYXRvck5hbWUpXG57XG4gICAgcmV0dXJuIHRoaXMubWVkaWF0b3JNYXBbbWVkaWF0b3JOYW1lXTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgTWVkaWF0b3IgZnJvbSB0aGUgVmlldy5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG1lZGlhdG9yTmFtZVxuICogIE5hbWUgb2YgdGhlIE1lZGlhdG9yIGluc3RhbmNlIHRvIGJlIHJlbW92ZWRcbiAqIEByZXR1cm4ge3B1cmVtdmMuTWVkaWF0b3J9XG4gKiAgVGhlIE1lZGlhdG9yIHRoYXQgd2FzIHJlbW92ZWQgZnJvbSB0aGUgVmlld1xuICovXG5WaWV3LnByb3RvdHlwZS5yZW1vdmVNZWRpYXRvciA9IGZ1bmN0aW9uKG1lZGlhdG9yTmFtZSlcbntcbiAgICB2YXIgbWVkaWF0b3IgPSB0aGlzLm1lZGlhdG9yTWFwW21lZGlhdG9yTmFtZV07XG4gICAgaWYobWVkaWF0b3IpXG4gICAge1xuICAgICAgICAvLyBmb3IgZXZlcnkgbm90aWZpY2F0aW9uIHRoZSBtZWRpYXRvciBpcyBpbnRlcmVzdGVkIGluLi4uXG4gICAgICAgIHZhciBpbnRlcmVzdHMgPSBtZWRpYXRvci5saXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzKCk7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBpbnRlcmVzdHMubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgb2JzZXJ2ZXIgbGlua2luZyB0aGUgbWVkaWF0b3IgdG8gdGhlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgLy8gaW50ZXJlc3RcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlT2JzZXJ2ZXIoaW50ZXJlc3RzW2ldLCBtZWRpYXRvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgdGhlIG1lZGlhdG9yIGZyb20gdGhlIG1hcFxuICAgICAgICBkZWxldGUgdGhpcy5tZWRpYXRvck1hcFttZWRpYXRvck5hbWVdO1xuXG4gICAgICAgIC8vIGFsZXJ0IHRoZSBtZWRpYXRvciB0aGF0IGl0IGhhcyBiZWVuIHJlbW92ZWRcbiAgICAgICAgbWVkaWF0b3Iub25SZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVkaWF0b3I7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGEgTWVkaWF0b3IgaXMgcmVnaXN0ZXJlZCBvciBub3QuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZWRpYXRvck5hbWVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKiAgV2hldGhlciBhIE1lZGlhdG9yIGlzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ2l2ZW4gbWVkaWF0b3JuYW1lXG4gKi9cblZpZXcucHJvdG90eXBlLmhhc01lZGlhdG9yID0gZnVuY3Rpb24obWVkaWF0b3JOYW1lKVxue1xuICAgIHJldHVybiB0aGlzLm1lZGlhdG9yTWFwW21lZGlhdG9yTmFtZV0gIT0gbnVsbDtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgVmlldyBpbnN0YW5jZVxuICogXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5WaWV3LnJlbW92ZVZpZXcgPSBmdW5jdGlvbihrZXkpXG57XG4gICAgZGVsZXRlIFZpZXcuaW5zdGFuY2VNYXBba2V5XTtcbn07XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIFZpZXdzIGludGVybmFsIG1hcHBpbmcgb2YgbWVkaWF0b3IgbmFtZXMgdG8gbWVkaWF0b3IgaW5zdGFuY2VzXG4gKlxuICogQHR5cGUgQXJyYXlcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuVmlldy5wcm90b3R5cGUubWVkaWF0b3JNYXAgPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBWaWV3cyBpbnRlcm5hbCBtYXBwaW5nIG9mIE5vdGlmaWNhdGlvbiBuYW1lcyB0byBPYnNlcnZlciBsaXN0c1xuICpcbiAqIEB0eXBlIEFycmF5XG4gKiBAcHJvdGVjdGVkXG4gKi9cblZpZXcucHJvdG90eXBlLm9ic2VydmVyTWFwID0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgaW50ZXJuYWwgbWFwIHVzZWQgdG8gc3RvcmUgbXVsdGl0b24gVmlldyBpbnN0YW5jZXNcbiAqXG4gKiBAdHlwZSBBcnJheVxuICogQHByb3RlY3RlZFxuICovXG5WaWV3Lmluc3RhbmNlTWFwID0gW107XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIFZpZXdzIGludGVybmFsIG11bHRpdG9uIGtleS5cbiAqXG4gKiBAdHlwZSBzdHJpbmdcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuVmlldy5wcm90b3R5cGUubXVsdGl0b25LZXkgPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBlcnJvciBtZXNzYWdlIHVzZWQgaWYgYW4gYXR0ZW1wdCBpcyBtYWRlIHRvIGluc3RhbnRpYXRlIFZpZXcgZGlyZWN0bHlcbiAqXG4gKiBAdHlwZSBzdHJpbmdcbiAqIEBwcm90ZWN0ZWRcbiAqIEBjb25zdFxuICogQHN0YXRpY1xuICovXG5WaWV3Lk1VTFRJVE9OX01TRyA9IFwiVmlldyBpbnN0YW5jZSBmb3IgdGhpcyBNdWx0aXRvbiBrZXkgYWxyZWFkeSBjb25zdHJ1Y3RlZCFcIjtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLk1vZGVsXG4gKlxuICogQSBNdWx0aXRvbiBNb2RlbCBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBJbiBQdXJlTVZDLCB0aGUgTW9kZWwgY2xhc3MgcHJvdmlkZXNcbiAqIGFjY2VzcyB0byBtb2RlbCBvYmplY3RzIChQcm94aWVzKSBieSBuYW1lZCBsb29rdXAuXG4gKlxuICogVGhlIE1vZGVsIGFzc3VtZXMgdGhlc2UgcmVzcG9uc2liaWxpdGllczpcbiAqXG4gKiAtIE1haW50YWluIGEgY2FjaGUgb2Yge0BsaW5rIHB1cmVtdmMuUHJveHkgUHJveHl9XG4gKiAgIGluc3RhbmNlcy5cbiAqIC0gUHJvdmlkZSBtZXRob2RzIGZvciByZWdpc3RlcmluZywgcmV0cmlldmluZywgYW5kIHJlbW92aW5nXG4gKiAgIHtAbGluayBwdXJlbXZjLlByb3h5IFByb3h5fSBpbnN0YW5jZXMuXG4gKlxuICogWW91ciBhcHBsaWNhdGlvbiBtdXN0IHJlZ2lzdGVyIFxuICoge0BsaW5rIHB1cmVtdmMuUHJveHkgUHJveHl9IGluc3RhbmNlcyB3aXRoIHRoZSBNb2RlbC4gXG4gKiBUeXBpY2FsbHksIHlvdSB1c2UgYSBcbiAqIHtAbGluayBwdXJlbXZjLlNpbXBsZUNvbW1hbmQgU2ltcGxlQ29tbWFuZH0gXG4gKiBvclxuICoge0BsaW5rIHB1cmVtdmMuTWFjcm9Db21tYW5kIE1hY3JvQ29tbWFuZH0gXG4gKiB0byBjcmVhdGUgYW5kIHJlZ2lzdGVyIFByb3h5IGluc3RhbmNlcyBvbmNlIHRoZSBGYWNhZGUgaGFzIGluaXRpYWxpemVkIHRoZSBcbiAqICpDb3JlKiBhY3RvcnMuXG4gKlxuICogVGhpcyBNb2RlbCBpbXBsZW1lbnRhdGlvbiBpcyBhIE11bHRpdG9uLCBzbyB5b3Ugc2hvdWxkIG5vdCBjYWxsIHRoZSBcbiAqIGNvbnN0cnVjdG9yIGRpcmVjdGx5LCBidXQgaW5zdGVhZCBjYWxsIHRoZSBcbiAqIHtAbGluayAjZ2V0SW5zdGFuY2Ugc3RhdGljIE11bHRpdG9uIEZhY3RvcnkgbWV0aG9kfSBcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogIFRoZSBNb2RlbHMgbXVsdGl0b24ga2V5XG4gKiBAdGhyb3dzIHtFcnJvcn1cbiAqICBBbiBlcnJvciBpcyB0aHJvd24gaWYgdGhpcyBtdWx0aXRvbnMga2V5IGlzIGFscmVhZHkgaW4gdXNlIGJ5IGFub3RoZXIgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gTW9kZWwoa2V5KVxue1xuICAgIGlmKE1vZGVsLmluc3RhbmNlTWFwW2tleV0pXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoTW9kZWwuTVVMVElUT05fTVNHKTtcbiAgICB9XG5cbiAgICB0aGlzLm11bHRpdG9uS2V5PSBrZXk7XG4gICAgTW9kZWwuaW5zdGFuY2VNYXBba2V5XT0gdGhpcztcbiAgICB0aGlzLnByb3h5TWFwPSBbXTtcbiAgICB0aGlzLmluaXRpYWxpemVNb2RlbCgpO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBNb2RlbCBpbnN0YW5jZS5cbiAqIFxuICogQ2FsbGVkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIGNvbnN0cnVjdG9yLCB0aGlzXG4gKiBpcyB5b3VyIG9wcG9ydHVuaXR5IHRvIGluaXRpYWxpemUgdGhlIFNpbmdsZXRvblxuICogaW5zdGFuY2UgaW4geW91ciBzdWJjbGFzcyB3aXRob3V0IG92ZXJyaWRpbmcgdGhlXG4gKiBjb25zdHJ1Y3Rvci5cbiAqIFxuICogQHJldHVybiB2b2lkXG4gKi9cbk1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplTW9kZWw9IGZ1bmN0aW9uKCl7fTtcblxuXG4vKipcbiAqIE1vZGVsIE11bHRpdG9uIEZhY3RvcnkgbWV0aG9kLlxuICogTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIG51bGwgaWYgc3VwcGxpZWQgYSBudWxsIFxuICogb3IgdW5kZWZpbmVkIG11bHRpdG9uIGtleS5cbiAqICBcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqICBUaGUgbXVsdGl0b24ga2V5IGZvciB0aGUgTW9kZWwgdG8gcmV0cmlldmVcbiAqIEByZXR1cm4ge3B1cmVtdmMuTW9kZWx9XG4gKiAgdGhlIGluc3RhbmNlIGZvciB0aGlzIE11bHRpdG9uIGtleSBcbiAqL1xuTW9kZWwuZ2V0SW5zdGFuY2U9IGZ1bmN0aW9uKGtleSlcbntcblx0aWYgKG51bGwgPT0ga2V5KVxuXHRcdHJldHVybiBudWxsO1xuXHRcdFxuICAgIGlmKE1vZGVsLmluc3RhbmNlTWFwW2tleV0gPT0gbnVsbClcbiAgICB7XG4gICAgICAgIE1vZGVsLmluc3RhbmNlTWFwW2tleV09IG5ldyBNb2RlbChrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBNb2RlbC5pbnN0YW5jZU1hcFtrZXldO1xufTtcblxuLyoqXG4gKiBSZWdpc3RlciBhIFByb3h5IHdpdGggdGhlIE1vZGVsXG4gKiBAcGFyYW0ge3B1cmVtdmMuUHJveHl9XG4gKi9cbk1vZGVsLnByb3RvdHlwZS5yZWdpc3RlclByb3h5PSBmdW5jdGlvbihwcm94eSlcbntcbiAgICBwcm94eS5pbml0aWFsaXplTm90aWZpZXIodGhpcy5tdWx0aXRvbktleSk7XG4gICAgdGhpcy5wcm94eU1hcFtwcm94eS5nZXRQcm94eU5hbWUoKV09IHByb3h5O1xuICAgIHByb3h5Lm9uUmVnaXN0ZXIoKTtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgYSBQcm94eSBmcm9tIHRoZSBNb2RlbFxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJveHlOYW1lXG4gKiBAcmV0dXJuIHtwdXJlbXZjLlByb3h5fVxuICogIFRoZSBQcm94eSBpbnN0YW5jZSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgcHJvdmlkZWQgcHJveHlOYW1lXG4gKi9cbk1vZGVsLnByb3RvdHlwZS5yZXRyaWV2ZVByb3h5PSBmdW5jdGlvbihwcm94eU5hbWUpXG57XG4gICAgcmV0dXJuIHRoaXMucHJveHlNYXBbcHJveHlOYW1lXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBQcm94eSBpcyByZWdpc3RlcmVkXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJveHlOYW1lXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICogIHdoZXRoZXIgYSBQcm94eSBpcyBjdXJyZW50bHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBnaXZlbiBwcm94eU5hbWUuXG4gKi9cbk1vZGVsLnByb3RvdHlwZS5oYXNQcm94eT0gZnVuY3Rpb24ocHJveHlOYW1lKVxue1xuICAgIHJldHVybiB0aGlzLnByb3h5TWFwW3Byb3h5TmFtZV0gIT0gbnVsbDtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgUHJveHkgZnJvbSB0aGUgTW9kZWwuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm94eU5hbWVcbiAqICBUaGUgbmFtZSBvZiB0aGUgUHJveHkgaW5zdGFuY2UgdG8gcmVtb3ZlXG4gKiBAcmV0dXJuIHtwdXJlbXZjLlByb3h5fVxuICogIFRoZSBQcm94eSB0aGF0IHdhcyByZW1vdmVkIGZyb20gdGhlIE1vZGVsXG4gKi9cbk1vZGVsLnByb3RvdHlwZS5yZW1vdmVQcm94eT0gZnVuY3Rpb24ocHJveHlOYW1lKVxue1xuICAgIHZhciBwcm94eT0gdGhpcy5wcm94eU1hcFtwcm94eU5hbWVdO1xuICAgIGlmKHByb3h5KVxuICAgIHtcbiAgICAgICAgdGhpcy5wcm94eU1hcFtwcm94eU5hbWVdPSBudWxsO1xuICAgICAgICBwcm94eS5vblJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm94eTtcbn07XG5cbi8qKlxuICogQHN0YXRpY1xuICogUmVtb3ZlIGEgTW9kZWwgaW5zdGFuY2UuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk1vZGVsLnJlbW92ZU1vZGVsPSBmdW5jdGlvbihrZXkpXG57XG4gICAgZGVsZXRlIE1vZGVsLmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBtYXAgdXNlZCBieSB0aGUgTW9kZWwgdG8gc3RvcmUgUHJveHkgaW5zdGFuY2VzLlxuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIEFycmF5XG4gKi9cbk1vZGVsLnByb3RvdHlwZS5wcm94eU1hcD0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgbWFwIHVzZWQgYnkgdGhlIE1vZGVsIHRvIHN0b3JlIG11bHRpdG9uIGluc3RhbmNlc1xuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIEFycmF5XG4gKi9cbk1vZGVsLmluc3RhbmNlTWFwPSBbXTtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgTW9kZWxzIG11bHRpdG9uIGtleS5cbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBzdHJpbmdcbiAqL1xuTW9kZWwucHJvdG90eXBlLm11bHRpdG9uS2V5O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIE1lc3NhZ2UgQ29uc3RhbnRzXG4gKiBcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbk1vZGVsLk1VTFRJVE9OX01TRz0gXCJNb2RlbCBpbnN0YW5jZSBmb3IgdGhpcyBNdWx0aXRvbiBrZXkgYWxyZWFkeSBjb25zdHJ1Y3RlZCFcIjtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLkNvbnRyb2xsZXJcbiAqIFxuICogSW4gUHVyZU1WQywgdGhlIENvbnRyb2xsZXIgY2xhc3MgZm9sbG93cyB0aGUgJ0NvbW1hbmQgYW5kIENvbnRyb2xsZXInIFxuICogc3RyYXRlZ3ksIGFuZCBhc3N1bWVzIHRoZXNlIHJlc3BvbnNpYmlsaXRpZXM6XG4gKiBcbiAqIC0gUmVtZW1iZXJpbmcgd2hpY2hcbiAqIHtAbGluayBwdXJlbXZjLlNpbXBsZUNvbW1hbmQgU2ltcGxlQ29tbWFuZH1zXG4gKiBvciBcbiAqIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmR9c1xuICogYXJlIGludGVuZGVkIHRvIGhhbmRsZSB3aGljaCBcbiAqIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259c1xuICogLSBSZWdpc3RlcmluZyBpdHNlbGYgYXMgYW4gXG4gKiB7QGxpbmsgcHVyZW12Yy5PYnNlcnZlciBPYnNlcnZlcn0gd2l0aFxuICogdGhlIHtAbGluayBwdXJlbXZjLlZpZXcgVmlld30gZm9yIGVhY2ggXG4gKiB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufVxuICogdGhhdCBpdCBoYXMgYW4gXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9IFxuICogb3Ige0BsaW5rIHB1cmVtdmMuTWFjcm9Db21tYW5kIE1hY3JvQ29tbWFuZH0gXG4gKiBtYXBwaW5nIGZvci5cbiAqIC0gQ3JlYXRpbmcgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHByb3BlciBcbiAqIHtAbGluayBwdXJlbXZjLlNpbXBsZUNvbW1hbmQgU2ltcGxlQ29tbWFuZH1zXG4gKiBvciBcbiAqIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmR9c1xuICogdG8gaGFuZGxlIGEgZ2l2ZW4gXG4gKiB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufSBcbiAqIHdoZW4gbm90aWZpZWQgYnkgdGhlXG4gKiB7QGxpbmsgcHVyZW12Yy5WaWV3IFZpZXd9LlxuICogLSBDYWxsaW5nIHRoZSBjb21tYW5kJ3MgZXhlY3V0ZSBtZXRob2QsIHBhc3NpbmcgaW4gdGhlIFxuICoge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn0uXG4gKlxuICogWW91ciBhcHBsaWNhdGlvbiBtdXN0IHJlZ2lzdGVyIFxuICoge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kfXNcbiAqIG9yIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmR9cyBcbiAqIHdpdGggdGhlIENvbnRyb2xsZXIuXG4gKlxuICogVGhlIHNpbXBsZXN0IHdheSBpcyB0byBzdWJjbGFzcyBcbiAqIHtAbGluayBwdXJlbXZjLkZhY2FkZSBGYWNhZGV9LFxuICogYW5kIHVzZSBpdHMgXG4gKiB7QGxpbmsgcHVyZW12Yy5GYWNhZGUjaW5pdGlhbGl6ZUNvbnRyb2xsZXIgaW5pdGlhbGl6ZUNvbnRyb2xsZXJ9IFxuICogbWV0aG9kIHRvIGFkZCB5b3VyIHJlZ2lzdHJhdGlvbnMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBUaGlzIENvbnRyb2xsZXIgaW1wbGVtZW50YXRpb24gaXMgYSBNdWx0aXRvbiwgc28geW91IHNob3VsZCBub3QgY2FsbCB0aGUgXG4gKiBjb25zdHJ1Y3RvciBkaXJlY3RseSwgYnV0IGluc3RlYWQgY2FsbCB0aGUgc3RhdGljICNnZXRJbnN0YW5jZSBmYWN0b3J5IG1ldGhvZCwgXG4gKiBwYXNzaW5nIHRoZSB1bmlxdWUga2V5IGZvciB0aGlzIGluc3RhbmNlIHRvIGl0LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogQHRocm93cyB7RXJyb3J9XG4gKiAgSWYgaW5zdGFuY2UgZm9yIHRoaXMgTXVsdGl0b24ga2V5IGhhcyBhbHJlYWR5IGJlZW4gY29uc3RydWN0ZWRcbiAqL1xuZnVuY3Rpb24gQ29udHJvbGxlcihrZXkpXG57XG4gICAgaWYoQ29udHJvbGxlci5pbnN0YW5jZU1hcFtrZXldICE9IG51bGwpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoQ29udHJvbGxlci5NVUxUSVRPTl9NU0cpO1xuICAgIH1cblxuICAgIHRoaXMubXVsdGl0b25LZXk9IGtleTtcbiAgICBDb250cm9sbGVyLmluc3RhbmNlTWFwW3RoaXMubXVsdGl0b25LZXldPSB0aGlzO1xuICAgIHRoaXMuY29tbWFuZE1hcD0gbmV3IEFycmF5KCk7XG4gICAgdGhpcy5pbml0aWFsaXplQ29udHJvbGxlcigpO1xufVxuXG4vKipcbiAqIEBwcm90ZWN0ZWRcbiAqIFxuICogSW5pdGlhbGl6ZSB0aGUgbXVsdGl0b24gQ29udHJvbGxlciBpbnN0YW5jZS5cbiAqXG4gKiBDYWxsZWQgYXV0b21hdGljYWxseSBieSB0aGUgY29uc3RydWN0b3IuXG4gKlxuICogTm90ZSB0aGF0IGlmIHlvdSBhcmUgdXNpbmcgYSBzdWJjbGFzcyBvZiBWaWV3XG4gKiBpbiB5b3VyIGFwcGxpY2F0aW9uLCB5b3Ugc2hvdWxkICphbHNvKiBzdWJjbGFzcyBDb250cm9sbGVyXG4gKiBhbmQgb3ZlcnJpZGUgdGhlIGluaXRpYWxpemVDb250cm9sbGVyIG1ldGhvZCBpbiB0aGVcbiAqIGZvbGxvd2luZyB3YXkuXG4gKiBcbiAqICAgICBNeUNvbnRyb2xsZXIucHJvdG90eXBlLmluaXRpYWxpemVDb250cm9sbGVyPSBmdW5jdGlvbiAoKVxuICogICAgIHtcbiAqICAgICAgICAgdGhpcy52aWV3PSBNeVZpZXcuZ2V0SW5zdGFuY2UodGhpcy5tdWx0aXRvbktleSk7XG4gKiAgICAgfTtcbiAqIFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdGlhbGl6ZUNvbnRyb2xsZXI9IGZ1bmN0aW9uKClcbntcbiAgICB0aGlzLnZpZXc9IFZpZXcuZ2V0SW5zdGFuY2UodGhpcy5tdWx0aXRvbktleSk7XG59O1xuXG4vKipcbiAqIFRoZSBDb250cm9sbGVycyBtdWx0aXRvbiBmYWN0b3J5IG1ldGhvZC4gXG4gKiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gbnVsbCBpZiBzdXBwbGllZCBhIG51bGwgXG4gKiBvciB1bmRlZmluZWQgbXVsdGl0b24ga2V5LiBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiAgQSBDb250cm9sbGVyJ3MgbXVsdGl0b24ga2V5XG4gKiBAcmV0dXJuIHtwdXJlbXZjLkNvbnRyb2xsZXJ9XG4gKiAgdGhlIE11bHRpdG9uIGluc3RhbmNlIG9mIENvbnRyb2xsZXJcbiAqL1xuQ29udHJvbGxlci5nZXRJbnN0YW5jZT0gZnVuY3Rpb24oa2V5KVxue1xuXHRpZiAobnVsbCA9PSBrZXkpXG5cdFx0cmV0dXJuIG51bGw7XG5cdFx0XG4gICAgaWYobnVsbCA9PSB0aGlzLmluc3RhbmNlTWFwW2tleV0pXG4gICAge1xuICAgICAgICB0aGlzLmluc3RhbmNlTWFwW2tleV09IG5ldyB0aGlzKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VNYXBba2V5XTtcbn07XG5cbi8qKlxuICogSWYgYSBTaW1wbGVDb21tYW5kIG9yIE1hY3JvQ29tbWFuZCBoYXMgcHJldmlvdXNseSBiZWVuIHJlZ2lzdGVyZWQgdG8gaGFuZGxlXG4gKiB0aGUgZ2l2ZW4gTm90aWZpY2F0aW9uIHRoZW4gaXQgaXMgZXhlY3V0ZWQuXG4gKlxuICogQHBhcmFtIHtwdXJlbXZjLk5vdGlmaWNhdGlvbn0gbm90ZVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuQ29udHJvbGxlci5wcm90b3R5cGUuZXhlY3V0ZUNvbW1hbmQ9IGZ1bmN0aW9uKG5vdGUpXG57XG4gICAgdmFyIGNvbW1hbmRDbGFzc1JlZj0gdGhpcy5jb21tYW5kTWFwW25vdGUuZ2V0TmFtZSgpXTtcbiAgICBpZihjb21tYW5kQ2xhc3NSZWYgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgdmFyIGNvbW1hbmRJbnN0YW5jZT0gbmV3IGNvbW1hbmRDbGFzc1JlZigpO1xuICAgIGNvbW1hbmRJbnN0YW5jZS5pbml0aWFsaXplTm90aWZpZXIodGhpcy5tdWx0aXRvbktleSk7XG4gICAgY29tbWFuZEluc3RhbmNlLmV4ZWN1dGUobm90ZSk7XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgcGFydGljdWxhciBTaW1wbGVDb21tYW5kIG9yIE1hY3JvQ29tbWFuZCBjbGFzcyBhcyB0aGUgaGFuZGxlciBmb3IgXG4gKiBhIHBhcnRpY3VsYXIgTm90aWZpY2F0aW9uLlxuICpcbiAqIElmIGFuIGNvbW1hbmQgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgdG8gaGFuZGxlIE5vdGlmaWNhdGlvbnMgd2l0aCB0aGlzIG5hbWUsIFxuICogaXQgaXMgbm8gbG9uZ2VyIHVzZWQsIHRoZSBuZXcgY29tbWFuZCBpcyB1c2VkIGluc3RlYWQuXG4gKlxuICogVGhlIE9ic2VydmVyIGZvciB0aGUgbmV3IGNvbW1hbmQgaXMgb25seSBjcmVhdGVkIGlmIHRoaXMgdGhlIGlyc3QgdGltZSBhXG4gKiBjb21tYW5kIGhhcyBiZWVuIHJlZ2lzZXJlZCBmb3IgdGhpcyBOb3RpZmljYXRpb24gbmFtZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbm90aWZpY2F0aW9uTmFtZVxuICogIHRoZSBuYW1lIG9mIHRoZSBOb3RpZmljYXRpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbW1hbmRDbGFzc1JlZlxuICogIGEgY29tbWFuZCBjb25zdHJ1Y3RvclxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJDb21tYW5kPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lLCBjb21tYW5kQ2xhc3NSZWYpXG57XG4gICAgaWYodGhpcy5jb21tYW5kTWFwW25vdGlmaWNhdGlvbk5hbWVdID09IG51bGwpXG4gICAge1xuICAgICAgICB0aGlzLnZpZXcucmVnaXN0ZXJPYnNlcnZlcihub3RpZmljYXRpb25OYW1lLCBuZXcgT2JzZXJ2ZXIodGhpcy5leGVjdXRlQ29tbWFuZCwgdGhpcykpO1xuICAgIH1cblxuICAgIHRoaXMuY29tbWFuZE1hcFtub3RpZmljYXRpb25OYW1lXT0gY29tbWFuZENsYXNzUmVmO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBhIGNvbW1hbmQgaXMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBOb3RpZmljYXRpb25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbm90aWZpY2F0aW9uTmFtZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqICB3aGV0aGVyIGEgQ29tbWFuZCBpcyBjdXJyZW50bHkgcmVnaXN0ZXJlZCBmb3IgdGhlIGdpdmVuIG5vdGlmaWNhdGlvbk5hbWUuXG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLmhhc0NvbW1hbmQ9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbk5hbWUpXG57XG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZE1hcFtub3RpZmljYXRpb25OYW1lXSAhPSBudWxsO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgY29tbWFuZCB0b1xuICoge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn1cbiAqIG1hcHBpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICB0aGUgbmFtZSBvZiB0aGUgTm90aWZpY2F0aW9uIHRvIHJlbW92ZSB0aGUgY29tbWFuZCBtYXBwaW5nIGZvclxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuQ29udHJvbGxlci5wcm90b3R5cGUucmVtb3ZlQ29tbWFuZD0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSlcbntcbiAgICBpZih0aGlzLmhhc0NvbW1hbmQobm90aWZpY2F0aW9uTmFtZSkpXG4gICAge1xuICAgICAgICB0aGlzLnZpZXcucmVtb3ZlT2JzZXJ2ZXIobm90aWZpY2F0aW9uTmFtZSwgdGhpcyk7XG4gICAgICAgIHRoaXMuY29tbWFuZE1hcFtub3RpZmljYXRpb25OYW1lXT0gbnVsbDtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBzdGF0aWNcbiAqIFJlbW92ZSBhIENvbnRyb2xsZXIgaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBcbiAqICBtdWx0aXRvbktleSBvZiBDb250cm9sbGVyIGluc3RhbmNlIHRvIHJlbW92ZVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuQ29udHJvbGxlci5yZW1vdmVDb250cm9sbGVyPSBmdW5jdGlvbihrZXkpXG57XG4gICAgZGVsZXRlIHRoaXMuaW5zdGFuY2VNYXBba2V5XTtcbn07XG5cbi8qKlxuICogTG9jYWwgcmVmZXJlbmNlIHRvIHRoZSBDb250cm9sbGVyJ3MgVmlld1xuICogXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSB7cHVyZW12Yy5WaWV3fVxuICovXG5Db250cm9sbGVyLnByb3RvdHlwZS52aWV3PSBudWxsO1xuXG4vKipcbiAqIE5vdGUgbmFtZSB0byBjb21tYW5kIGNvbnN0cnVjdG9yIG1hcHBpbmdzXG4gKiBcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLmNvbW1hbmRNYXA9IG51bGw7XG5cbi8qKlxuICogVGhlIENvbnRyb2xsZXIncyBtdWx0aXRvbiBrZXlcbiAqIFxuICogQHByb3RlY3RlZFxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuQ29udHJvbGxlci5wcm90b3R5cGUubXVsdGl0b25LZXk9IG51bGw7XG5cbi8qKlxuICogTXVsdGl0b24ga2V5IHRvIENvbnRyb2xsZXIgaW5zdGFuY2UgbWFwcGluZ3NcbiAqIFxuICogQHN0YXRpY1xuICogQHByb3RlY3RlZFxuICogQHR5cGUge09iamVjdH1cbiAqL1xuQ29udHJvbGxlci5pbnN0YW5jZU1hcD0gW107XG5cbi8qKlxuICogQGlnbm9yZVxuICogXG4gKiBNZXNzYWdlIGNvbnN0YW50c1xuICogQHN0YXRpY1xuICogQHByb3RlY3RlZFxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuQ29udHJvbGxlci5NVUxUSVRPTl9NU0c9IFwiY29udHJvbGxlciBrZXkgZm9yIHRoaXMgTXVsdGl0b24ga2V5IGFscmVhZHkgY29uc3RydWN0ZWRcIlxuLypcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAaGlkZVxuICogQSBhbiBpbnRlcm5hbCBoZWxwZXIgY2xhc3MgdXNlZCB0byBhc3Npc3QgY2xhc3NsZXQgaW1wbGVtZW50YXRpb24uIFRoaXNcbiAqIGNsYXNzIGlzIG5vdCBhY2Nlc3NpYmxlIGJ5IGNsaWVudCBjb2RlLlxuICovXG52YXIgT29wSGVscD1cbntcbiAgICAvKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBzY29wZS4gV2UgdXNlIHRoaXMgcmF0aGVyIHRoYW4gd2luZG93XG4gICAgICogaW4gb3JkZXIgdG8gc3VwcG9ydCBib3RoIGJyb3dzZXIgYmFzZWQgYW5kIG5vbiBicm93c2VyIGJhZWQgXG4gICAgICogSmF2YVNjcmlwdCBpbnRlcnByZXRlcnMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cblx0Z2xvYmFsOiAoZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30pKClcbiAgICBcbiAgICAvKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogRXh0ZW5kIG9uZSBGdW5jdGlvbidzIHByb3RvdHlwZSBieSBhbm90aGVyLCBlbXVsYXRpbmcgY2xhc3NpY1xuICAgICAqIGluaGVyaXRhbmNlLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNoaWxkXG4gICAgICogIFRoZSBGdW5jdGlvbiB0byBleHRlbmQgKHN1YmNsYXNzKVxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHBhcmVudFxuICAgICAqICBUaGUgRnVuY3Rpb24gdG8gZXh0ZW5kIGZyb20gKHN1cGVyY2xhc3MpXG4gICAgICogXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAgICogXG4gICAgICogIEEgcmVmZXJlbmNlIHRvIHRoZSBleHRlbmRlZCBGdW5jdGlvbiAoc3ViY2xhc3MpXG4gICAgICovXG4sICAgZXh0ZW5kOiBmdW5jdGlvbiAoY2hpbGQsIHBhcmVudClcbiAgICB7XG4gICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgY2hpbGQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCcjZXh0ZW5kLSBjaGlsZCBzaG91bGQgYmUgRnVuY3Rpb24nKTsgICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgcGFyZW50KVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignI2V4dGVuZC0gcGFyZW50IHNob3VsZCBiZSBGdW5jdGlvbicpO1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIChwYXJlbnQgPT09IGNoaWxkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgIHZhciBUcmFuc2l0aXZlPSBuZXcgRnVuY3Rpb247XG4gICAgICAgIFRyYW5zaXRpdmUucHJvdG90eXBlPSBwYXJlbnQucHJvdG90eXBlO1xuICAgICAgICBjaGlsZC5wcm90b3R5cGU9IG5ldyBUcmFuc2l0aXZlO1xuICAgICAgICByZXR1cm4gY2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yPSBjaGlsZDtcbiAgICB9XG4gICAgXG4gICAgLypcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIERlY29hcmF0ZSBvbmUgb2JqZWN0IHdpdGggdGhlIHByb3BlcnRpZXMgb2YgYW5vdGhlci4gXG4gICAgICogXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgICAqICBUaGUgb2JqZWN0IHRvIGRlY29yYXRlLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFpdHNcbiAgICAgKiAgVGhlIG9iamVjdCBwcm92aWRpbmcgdGhlIHByb3Blcml0ZXMgdGhhdCB0aGUgZmlyc3Qgb2JqZWN0XG4gICAgICogIHdpbGwgYmUgZGVjb3JhdGVkIHdpdGguIE5vdGUgdGhhdCBvbmx5IHByb3BlcnRpZXMgZGVmaW5lZCBvbiBcbiAgICAgKiAgdGhpcyBvYmplY3Qgd2lsbCBiZSBjb3BpZWQtIGkuZS4gaW5oZXJpdGVkIHByb3BlcnRpZXMgd2lsbFxuICAgICAqICBiZSBpZ25vcmVkLlxuICAgICAqIFxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKiAgVEhlIGRlY29yYXRlZCBvYmplY3QgKGZpcnN0IGFyZ3VtZW50KVxuICAgICAqL1xuLCAgIGRlY29yYXRlOiBmdW5jdGlvbiAob2JqZWN0LCB0cmFpdHMpXG4gICAgeyAgIFxuICAgICAgICBmb3IgKHZhciBhY2Nlc3NvciBpbiB0cmFpdHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9iamVjdFthY2Nlc3Nvcl09IHRyYWl0c1thY2Nlc3Nvcl07XG4gICAgICAgIH0gICAgXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiBAbWVtYmVyIHB1cmVtdmNcbiAqIFxuICogRGVjbGFyZSBhIG5hbWVzcGFjZSBhbmQgb3B0aW9uYWxseSBtYWtlIGFuIE9iamVjdCB0aGUgcmVmZXJlbnRcbiAqIG9mIHRoYXQgbmFtZXNwYWNlLlxuICogXG4gKiAgICAgY29uc29sZS5hc3NlcnQobnVsbCA9PSB3aW5kb3cudGxkLCAnTm8gdGxkIG5hbWVzcGFjZScpO1xuICogICAgIC8vIGRlY2xhcmUgdGhlIHRsZCBuYW1lc3BhY2VcbiAqICAgICBwdXJlbXZjLmRlY2xhcmUoJ3RsZCcpO1xuICogICAgIGNvbnNvbGUuYXNzZXJ0KCdvYmplY3QnID09PSB0eXBlb2YgdGxkLCAnVGhlIHRsZCBuYW1lc3BhY2Ugd2FzIGRlY2xhcmVkJyk7XG4gKiBcbiAqICAgICAvLyB0aGUgbWV0aG9kIHJldHVybnMgYSByZWZlcmVuY2UgdG8gbGFzdCBuYW1lc3BhY2Ugbm9kZSBpbiBhIGNyZWF0ZWQgaGllcmFyY2h5XG4gKiAgICAgdmFyIHJlZmVyZW5jZT0gcHVyZW12Yy5kZWNsYXJlKCd0bGQuZG9tYWluLmFwcCcpO1xuICogICAgIGNvbnNvbGUuYXNzZXJ0KHJlZmVyZW5jZSA9PT0gdGxkLmRvbWFpbi5hcHApXG4gKiAgICBcbiAqICAgICAvLyBvZiBjb3Vyc2UgeW91IGNhbiBhbHNvIGRlY2xhcmUgeW91ciBvd24gb2JqZWN0cyBhcyB3ZWxsXG4gKiAgICAgdmFyIEFwcENvbnN0YW50cz1cbiAqICAgICAgICAge1xuICogXHQgICAgICAgICAgIEFQUF9OQU1FOiAndGxkLmRvbWFpbi5hcHAuQXBwJ1xuICogICAgICAgICB9O1xuICogXG4gKiAgICAgcHVyZW12Yy5kZWNsYXJlKCd0bGQuZG9tYWluLmFwcC5BcHBDb25zdGFudHMnLCBBcHBDb25zdGFudHMpO1xuICogICAgIGNvbnNvbGUuYXNzZXJ0KEFwcENvbnN0YW50cyA9PT0gdGxkLmRvbWFpbi5hcHAuQXBwQ29uc3RhbnRzXG4gKiBcdCAgICwgJ0FwcENvbnN0YW50cyB3YXMgZXhwb3J0ZWQgdG8gdGhlIG5hbWVzcGFjZScpO1xuICogXG4gKiBOb3RlIHRoYXQgeW91IGNhbiBhbHNvICNkZWNsYXJlIHdpdGhpbiBhIGNsb3N1cmUuIFRoYXQgd2F5IHlvdVxuICogY2FuIHNlbGVjdGl2ZWx5IGV4cG9ydCBPYmplY3RzIHRvIHlvdXIgb3duIG5hbWVzcGFjZXMgd2l0aG91dFxuICogbGVha2luZyB2YXJpYWJsZXMgaW50byB0aGUgZ2xvYmFsIHNjb3BlLlxuICogICAgXG4gKiAgICAgKGZ1bmN0aW9uKCl7XG4gKiAgICAgICAgIC8vIHRoaXMgdmFyIGlzIG5vdCBhY2Nlc3NpYmxlIG91dHNpZGUgb2YgdGhpc1xuICogICAgICAgICAvLyBjbG9zdXJlcyBjYWxsIHNjb3BlXG4gKiAgICAgICAgIHZhciBoaWRkZW5WYWx1ZT0gJ2RlZmF1bHRWYWx1ZSc7XG4gKiBcbiAqICAgICAgICAgLy8gZXhwb3J0IGFuIG9iamVjdCB0aGF0IHJlZmVyZW5jZXMgdGhlIGhpZGRlblxuICogICAgICAgICAvLyB2YXJpYWJsZSBhbmQgd2hpY2ggY2FuIG11dGF0ZSBpdFxuICogICAgICAgICBwdXJlbXZjLmRlY2xhcmVcbiAqICAgICAgICAgKFxuICogICAgICAgICAgICAgICd0bGQuZG9tYWluLmFwcC5iYWNrZG9vcidcbiAqIFxuICogICAgICAgICAsICAgIHtcbiAqICAgICAgICAgICAgICAgICAgc2V0VmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSlcbiAqICAgICAgICAgICAgICAgICAge1xuICogICAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWducyB0byB0aGUgaGlkZGVuIHZhclxuICogICAgICAgICAgICAgICAgICAgICAgaGlkZGVuVmFsdWU9IHZhbHVlO1xuICogICAgICAgICAgICAgICAgICB9XG4gKiBcbiAqICAgICAgICAgLCAgICAgICAgZ2V0VmFsdWU6IGZ1bmN0aW9uICgpXG4gKiAgICAgICAgICAgICAgICAgIHtcbiAqICAgICAgICAgICAgICAgICAgICAgIC8vIHJlYWRzIGZyb20gdGhlIGhpZGRlbiB2YXJcbiAqICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoaWRkZW5WYWx1ZTtcbiAqICAgICAgICAgICAgICAgICAgfVxuICogICAgICAgICAgICAgIH1cbiAqICAgICAgICAgKTtcbiAqICAgICB9KSgpO1xuICogICAgIC8vIGluZGlyZWN0bHkgcmV0cmlldmUgdGhlIGhpZGRlbiB2YXJpYWJsZXMgdmFsdWVcbiAqICAgICBjb25zb2xlLmFzc2VydCgnZGVmYXVsdFZhbHVlJyA9PT0gdGxkLmRvbWFpbi5hcHAuYmFja2Rvb3IuZ2V0VmFsdWUoKSk7XG4gKiAgICAgLy8gaW5kaXJlY3RseSBzZXQgdGhlIGhpZGRlbiB2YXJpYWJsZXMgdmFsdWVcbiAqICAgICB0bGQuZG9tYWluLmFwcC5iYWNrZG9vci5zZXRWYWx1ZSgnbmV3VmFsdWUnKTtcbiAqICAgICAvLyB0aGUgaGlkZGVuIHZhciB3YXMgbXV0YXRlZFxuICogICAgIGNvbnNvbGUuYXNzZXJ0KCduZXdWYWx1ZScgPT09IHRsZC5kb21haW4uYXBwLmJhY2tkb29yLmdldFZhbHVlKCkpO1xuICogXG4gKiBPbiBvY2Nhc2lvbiwgcHJpbWFyaWx5IGR1cmluZyB0ZXN0aW5nLCB5b3UgbWF5IHdhbnQgdG8gdXNlIGRlY2xhcmUsIFxuICogYnV0IG5vdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGJlIHRoZSBuYW1lc3BhY2Ugcm9vdC4gSW4gdGhlc2UgY2FzZXMgeW91XG4gKiBjYW4gc3VwcGx5IHRoZSBvcHRpb25hbCB0aGlyZCBzY29wZSBhcmd1bWVudC5cbiAqIFxuICogICAgIHZhciBsb2NhbFNjb3BlPSB7fVxuICogICAgICwgICBvYmplY3Q9IHt9XG4gKiBcbiAqICAgICBwdXJlbXZjLmRlY2xhcmUoJ21vY2sub2JqZWN0Jywgb2JqZWN0LCBsb2NhbFNjb3BlKTtcbiAqIFxuICogICAgIGNvbnNvbGUuYXNzZXJ0KG51bGwgPT0gd2luZG93Lm1vY2ssICdtb2NrIG5hbWVzcGFjZSBpcyBub3QgaW4gZ2xvYmFsIHNjb3BlJyk7XG4gKiAgICAgY29uc29sZS5hc3NlcnQob2JqZWN0ID09PSBsb2NhbFNjb3BlLm1vY2sub2JqZWN0LCAnbW9jay5vYmplY3QgaXMgYXZhaWxhYmxlIGluIGxvY2FsU2NvcGUnKTsgICAgXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAqICBBIHF1YWxpZmllZCBvYmplY3QgbmFtZSwgZS5nLiAnY29tLmV4YW1wbGUuQ2xhc3MnXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XVxuICogIEFuIG9iamVjdCB0byBtYWtlIHRoZSByZWZlcmVudCBvZiB0aGUgbmFtZXNwYWNlLiBcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IFtzY29wZV1cbiAqICBUaGUgbmFtZXNwYWNlJ3Mgcm9vdCBub2RlLiBJZiBub3Qgc3VwcGxpZWQsIHRoZSBnbG9iYWxcbiAqICBzY29wZSB3aWxsIGJlIG5hbWVzcGFjZXMgcm9vdCBub2RlLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBcbiAqICBBIHJlZmVyZW5jZSB0byB0aGUgbGFzdCBub2RlIG9mIHRoZSBPYmplY3QgaGllcmFyY2h5IGNyZWF0ZWQuXG4gKi9cbmZ1bmN0aW9uIGRlY2xhcmUgKHF1YWxpZmllZE5hbWUsIG9iamVjdCwgc2NvcGUpXG57XG4gICAgdmFyIG5vZGVzPSBxdWFsaWZpZWROYW1lLnNwbGl0KCcuJylcbiAgICAsICAgbm9kZT0gc2NvcGUgfHwgT29wSGVscC5nbG9iYWxcbiAgICAsICAgbGFzdE5vZGVcbiAgICAsICAgbmV3Tm9kZVxuICAgICwgICBub2RlTmFtZTtcbiAgICAgICAgICAgICAgICBcbiAgICBmb3IgKHZhciBpPSAwLCBuPSBub2Rlcy5sZW5ndGg7IGkgPCBuOyBpKyspXG4gICAge1xuICAgICAgICBsYXN0Tm9kZT0gbm9kZTtcbiAgICAgICAgbm9kZU5hbWU9IG5vZGVzW2ldO1xuICAgICAgICBcbiAgICAgICAgbm9kZT0gKG51bGwgPT0gbm9kZVtub2RlTmFtZV0gPyBub2RlW25vZGVOYW1lXSA9IHt9IDogbm9kZVtub2RlTmFtZV0pO1xuICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgaWYgKG51bGwgPT0gb2JqZWN0KVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIHJldHVybiBsYXN0Tm9kZVtub2RlTmFtZV09IG9iamVjdDtcbn07XG5cblxuXG5cbi8qKlxuICogQG1lbWJlciBwdXJlbXZjXG4gKiBcbiAqIERlZmluZSBhIG5ldyBjbGFzc2xldC4gQ3VycmVudCBlZGl0aW9ucyBvZiBKYXZhU2NyaXB0IGRvIG5vdCBoYXZlIGNsYXNzZXMsXG4gKiBidXQgdGhleSBjYW4gYmUgZW11bGF0ZWQsIGFuZCB0aGlzIG1ldGhvZCBkb2VzIHRoaXMgZm9yIHlvdSwgc2F2aW5nIHlvdVxuICogZnJvbSBoYXZpbmcgdG8gd29yayB3aXRoIEZ1bmN0aW9uIHByb3RvdHlwZSBkaXJlY3RseS4gVGhlIG1ldGhvZCBkb2VzXG4gKiBub3QgZXh0ZW5kIGFueSBOYXRpdmUgb2JqZWN0cyBhbmQgaXMgZW50aXJlbHkgb3B0IGluLiBJdHMgcGFydGljdWxhcmx5XG4gKiB1c2VmdWxsIGlmIHlvdSB3YW50IHRvIG1ha2UgeW91ciBQdXJlTXZjIGFwcGxpY2F0aW9ucyBtb3JlIHBvcnRhYmxlLCBieVxuICogZGVjb3VwbGluZyB0aGVtIGZyb20gYSBzcGVjaWZpYyBPT1AgYWJzdHJhY3Rpb24gbGlicmFyeS5cbiAqIFxuICogXG4gKiAgICAgcHVyZW12Yy5kZWZpbmVcbiAqICAgICAoXG4gKiAgICAgICAgIC8vIHRoZSBmaXJzdCBvYmplY3Qgc3VwcGxpZWQgaXMgYSBjbGFzcyBkZXNjcmlwdG9yLiBOb25lIG9mIHRoZXNlXG4gKiAgICAgICAgIC8vIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIHlvdXIgY2xhc3MsIHRoZSBleGNlcHRpb24gYmVpbmcgdGhlXG4gKiAgICAgICAgIC8vIGNvbnN0cnVjdG9yIHByb3BlcnR5LCB3aGljaCBpZiBzdXBwbGllZCwgd2lsbCBiZSB5b3VyIGNsYXNzZXNcbiAqICAgICAgICAgLy8gY29uc3RydWN0b3IuXG4gKiAgICAgICAgIHtcbiAqICAgICAgICAgICAgIC8vIHlvdXIgY2xhc3NlcyBuYW1lc3BhY2UtIGlmIHN1cHBsaWVkLCBpdCB3aWxsIGJlIFxuICogICAgICAgICAgICAgLy8gY3JlYXRlZCBmb3IgeW91XG4gKiAgICAgICAgICAgICBuYW1lOiAnY29tLmV4YW1wbGUuVXNlck1lZGlhdG9yJ1xuICogXG4gKiAgICAgICAgICAgICAvLyB5b3VyIGNsYXNzZXMgcGFyZW50IGNsYXNzLiBJZiBzdXBwbGllZCwgaW5oZXJpdGFuY2UgXG4gKiAgICAgICAgICAgICAvLyB3aWxsIGJlIHRha2VuIGNhcmUgb2YgZm9yIHlvdVxuICogICAgICAgICAsICAgcGFyZW50OiBwdXJlbXZjLk1lZGlhdG9yXG4gKiBcbiAqICAgICAgICAgICAgIC8vIHlvdXIgY2xhc3NlcyBjb25zdHJ1Y3Rvci4gSWYgbm90IHN1cHBsaWVkLCBvbmUgd2lsbCBiZSBcbiAqICAgICAgICAgICAgIC8vIGNyZWF0ZWQgZm9yIHlvdVxuICogICAgICAgICAsICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIFVzZXJNZWRpYXRvciAoY29tcG9uZW50KVxuICogICAgICAgICAgICAge1xuICogICAgICAgICAgICAgICAgICBwdXJlbXZjLk1lZGlhdG9yLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FLCBjb21wb25lbnQpOyAgXG4gKiAgICAgICAgICAgICB9XG4gKiAgICAgICAgIH1cbiAqICAgICAgICAgXG4gKiAgICAgICAgIC8vIHRoZSBzZWNvbmQgb2JqZWN0IHN1cHBsaWVkIGRlZmluZXMgeW91ciBjbGFzcyB0cmFpdHMsIHRoYXQgaXNcbiAqICAgICAgICAgLy8gdGhlIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIGRlZmluZWQgb24geW91ciBjbGFzc2VzIHByb3RvdHlwZVxuICogICAgICAgICAvLyBhbmQgdGhlcmVieSBvbiBhbGwgaW5zdGFuY2VzIG9mIHRoaXMgY2xhc3NcbiAqICAgICAsICAge1xuICogICAgICAgICAgICAgYnVzaW5lc3NNZXRob2Q6IGZ1bmN0aW9uICgpXG4gKiAgICAgICAgICAgICB7XG4gKiAgICAgICAgICAgICAgICAgLy8gaW1wbCBcbiAqICAgICAgICAgICAgIH1cbiAqICAgICAgICAgfVxuICogXG4gKiAgICAgICAgIC8vIHRoZSB0aGlyZCBvYmplY3Qgc3VwcGxpZWQgZGVmaW5lcyB5b3VyIGNsYXNzZXMgJ3N0YXRpYycgdHJhaXRzXG4gKiAgICAgICAgIC8vIHRoYXQgaXMsIHRoZSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIHdoaWNoIHdpbGwgYmUgZGVmaW5lZCBvblxuICogICAgICAgICAvLyB5b3VyIGNsYXNzZXMgY29uc3RydWN0b3JcbiAqICAgICAsICAge1xuICogICAgICAgICAgICAgTkFNRTogJ3VzZXJNZWRpYXRvcidcbiAqICAgICAgICAgfVxuICogICAgICk7XG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY2xhc3NpbmZvXVxuICogIEFuIG9iamVjdCBkZXNjcmliaW5nIHRoZSBjbGFzcy4gVGhpcyBvYmplY3QgY2FuIGhhdmUgYW55IG9yIGFsbCBvZlxuICogIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqIFxuICogIC0gbmFtZTogU3RyaW5nICBcbiAqICAgICAgVGhlIGNsYXNzbGV0cyBuYW1lLiBUaGlzIGNhbiBiZSBhbnkgYXJiaXRyYXJ5IHF1YWxpZmllZCBvYmplY3RcbiAqICAgICAgbmFtZS4gJ2NvbS5leGFtcGxlLkNsYXNzbGV0JyBvciBzaW1wbHkgJ015Q2xhc3NsZXQnIGZvciBleGFtcGxlIFxuICogICAgICBUaGUgbWV0aG9kIHdpbGwgYXV0b21hdGljYWxseSBjcmVhdGUgYW4gb2JqZWN0IGhpZXJhcmNoeSByZWZlcmluZ1xuICogICAgICB0byB5b3VyIGNsYXNzIGZvciB5b3UuIE5vdGUgdGhhdCB5b3Ugd2lsbCBuZWVkIHRvIGNhcHR1cmUgdGhlIFxuICogICAgICBtZXRob2RzIHJldHVybiB2YWx1ZSB0byByZXRyaWV2ZSBhIHJlZmVyZW5jZSB0byB5b3VyIGNsYXNzIGlmIHRoZVxuICogICAgICBjbGFzcyBuYW1lIHByb3BlcnR5IGlzIG5vdCBkZWZpbmVkLlxuXG4gKiAgLSBwYXJlbnQ6IEZ1bmN0aW9uXG4gKiAgICAgIFRoZSBjbGFzc2xldHMgJ3N1cGVyY2xhc3MnLiBZb3VyIGNsYXNzIHdpbGwgYmUgZXh0ZW5kZWQgZnJvbSB0aGlzXG4gKiAgICAgIGlmIHN1cHBsaWVkLlxuICogXG4gKiAgLSBjb25zdHJ1Y3RvcjogRnVuY3Rpb25cbiAqICAgICAgVGhlIGNsYXNzbGV0cyBjb25zdHJ1Y3Rvci4gTm90ZSB0aGlzIGlzICpub3QqIGEgcG9zdCBjb25zdHJ1Y3QgXG4gKiAgICAgIGluaXRpYWxpemUgbWV0aG9kLCBidXQgeW91ciBjbGFzc2VzIGNvbnN0cnVjdG9yIEZ1bmN0aW9uLlxuICogICAgICBJZiB0aGlzIGF0dHJpYnV0ZSBpcyBub3QgZGVmaW5lZCwgYSBjb25zdHJ1Y3RvciB3aWxsIGJlIGNyZWF0ZWQgZm9yIFxuICogICAgICB5b3UgYXV0b21hdGljYWxseS4gSWYgeW91IGhhdmUgc3VwcGxpZWQgYSBwYXJlbnQgY2xhc3NcbiAqICAgICAgdmFsdWUgYW5kIG5vdCBkZWZpbmVkIHRoZSBjbGFzc2VzIGNvbnN0cnVjdG9yLCB0aGUgYXV0b21hdGljYWxseVxuICogICAgICBjcmVhdGVkIGNvbnN0cnVjdG9yIHdpbGwgaW52b2tlIHRoZSBzdXBlciBjbGFzcyBjb25zdHJ1Y3RvclxuICogICAgICBhdXRvbWF0aWNhbGx5LiBJZiB5b3UgaGF2ZSBzdXBwbGllZCB5b3VyIG93biBjb25zdHJ1Y3RvciBhbmQgeW91XG4gKiAgICAgIHdpc2ggdG8gaW52b2tlIGl0J3Mgc3VwZXIgY29uc3RydWN0b3IsIHlvdSBtdXN0IGRvIHRoaXMgbWFudWFsbHksIGFzXG4gKiAgICAgIHRoZXJlIGlzIG5vIHJlZmVyZW5jZSB0byB0aGUgY2xhc3NlcyBwYXJlbnQgYWRkZWQgdG8gdGhlIGNvbnN0cnVjdG9yXG4gKiAgICAgIHByb3RvdHlwZS5cbiAqICAgICAgXG4gKiAgLSBzY29wZTogT2JqZWN0LlxuICogICAgICBGb3IgdXNlIGluIGFkdmFuY2VkIHNjZW5hcmlvcy4gSWYgdGhlIG5hbWUgYXR0cmlidXRlIGhhcyBiZWVuIHN1cHBsaWVkLFxuICogICAgICB0aGlzIHZhbHVlIHdpbGwgYmUgdGhlIHJvb3Qgb2YgdGhlIG9iamVjdCBoaWVyYXJjaHkgY3JlYXRlZCBmb3IgeW91LlxuICogICAgICBVc2UgaXQgZG8gZGVmaW5lIHlvdXIgb3duIGNsYXNzIGhpZXJhcmNoaWVzIGluIHByaXZhdGUgc2NvcGVzLFxuICogICAgICBhY2Nyb3NzIGlGcmFtZXMsIGluIHlvdXIgdW5pdCB0ZXN0cywgb3IgYXZvaWQgY29sbGlzaW9uIHdpdGggdGhpcmRcbiAqICAgICAgcGFydHkgbGlicmFyeSBuYW1lc3BhY2VzLlxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gW3RyYWl0c11cbiAqICBBbiBPYmplY3QsIHRoZSBwcm9wZXJ0aWVzIG9mIHdoaWNoIHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4gKiAgY2xhc3MgY29uc3RydWN0b3JzIHByb3RvdHlwZS5cbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFpdGNUcmFpdHNdXG4gKiAgQW4gT2JqZWN0LCB0aGUgcHJvcGVydGllcyBvZiB3aGljaCB3aWxsIGJlIGFkZGVkIGRpcmVjdGx5XG4gKiAgdG8gdGhpcyBjbGFzcyBjb25zdHJ1Y3RvclxuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqICBBIHJlZmVyZW5jZSB0byB0aGUgY2xhc3NsZXRzIGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIGRlZmluZSAoY2xhc3NJbmZvLCB0cmFpdHMsIHN0YXRpY1RyYWl0cylcbntcbiAgICBpZiAoIWNsYXNzSW5mbylcbiAgICB7XG4gICAgICAgIGNsYXNzSW5mbz0ge31cbiAgICB9XG5cbiAgICB2YXIgY2xhc3NOYW1lPSBjbGFzc0luZm8ubmFtZVxuICAgICwgICBjbGFzc1BhcmVudD0gY2xhc3NJbmZvLnBhcmVudFxuICAgICwgICBkb0V4dGVuZD0gJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGNsYXNzUGFyZW50XG4gICAgLCAgIGNsYXNzQ29uc3RydWN0b3JcbiAgICAsICAgY2xhc3NTY29wZT0gY2xhc3NJbmZvLnNjb3BlIHx8IG51bGxcbiAgICAsICAgcHJvdG90eXBlXG5cbiAgICBpZiAoJ3BhcmVudCcgaW4gY2xhc3NJbmZvICYmICFkb0V4dGVuZClcbiAgICB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NsYXNzIHBhcmVudCBtdXN0IGJlIEZ1bmN0aW9uJyk7XG4gICAgfVxuICAgICAgICBcbiAgICBpZiAoY2xhc3NJbmZvLmhhc093blByb3BlcnR5KCdjb25zdHJ1Y3RvcicpKVxuICAgIHtcbiAgICAgICAgY2xhc3NDb25zdHJ1Y3Rvcj0gY2xhc3NJbmZvLmNvbnN0cnVjdG9yXG4gICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgY2xhc3NDb25zdHJ1Y3RvcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2xhc3MgY29uc3RydWN0b3IgbXVzdCBiZSBGdW5jdGlvbicpXG4gICAgICAgIH0gICBcbiAgICB9XG4gICAgZWxzZSAvLyB0aGVyZSBpcyBubyBjb25zdHJ1Y3RvciwgY3JlYXRlIG9uZVxuICAgIHtcbiAgICAgICAgaWYgKGRvRXh0ZW5kKSAvLyBlbnN1cmUgdG8gY2FsbCB0aGUgc3VwZXIgY29uc3RydWN0b3JcbiAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NDb25zdHJ1Y3Rvcj0gZnVuY3Rpb24gKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc1BhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgLy8ganVzdCBjcmVhdGUgYSBGdW5jdGlvblxuICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc0NvbnN0cnVjdG9yPSBuZXcgRnVuY3Rpb247XG4gICAgICAgIH0gXG4gICAgfVxuXG4gICAgaWYgKGRvRXh0ZW5kKVxuICAgIHtcbiAgICAgICAgT29wSGVscC5leHRlbmQoY2xhc3NDb25zdHJ1Y3RvciwgY2xhc3NQYXJlbnQpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodHJhaXRzKVxuICAgIHtcbiAgICAgICAgcHJvdG90eXBlPSBjbGFzc0NvbnN0cnVjdG9yLnByb3RvdHlwZVxuICAgICAgICBPb3BIZWxwLmRlY29yYXRlKHByb3RvdHlwZSwgdHJhaXRzKTtcbiAgICAgICAgLy8gcmVhc3NpZ24gY29uc3RydWN0b3IgXG4gICAgICAgIHByb3RvdHlwZS5jb25zdHJ1Y3Rvcj0gY2xhc3NDb25zdHJ1Y3RvcjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHN0YXRpY1RyYWl0cylcbiAgICB7XG4gICAgICAgIE9vcEhlbHAuZGVjb3JhdGUoY2xhc3NDb25zdHJ1Y3Rvciwgc3RhdGljVHJhaXRzKVxuICAgIH1cbiAgICBcbiAgICBpZiAoY2xhc3NOYW1lKVxuICAgIHtcbiAgICAgICAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgY2xhc3NOYW1lKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDbGFzcyBuYW1lIG11c3QgYmUgcHJpbWl0aXZlIHN0cmluZycpO1xuICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgZGVjbGFyZSAoY2xhc3NOYW1lLCBjbGFzc0NvbnN0cnVjdG9yLCBjbGFzc1Njb3BlKTtcbiAgICB9ICAgIFxuICAgIFxuICAgIHJldHVybiBjbGFzc0NvbnN0cnVjdG9yOyAgICAgICAgICAgIFxufTtcblxuXG5cdFxuIFx0LyogaW1wbGVtZW50YXRpb24gZW5kICovXG4gXHQgXG4gXHQvLyBkZWZpbmUgdGhlIHB1cmVtdmMgZ2xvYmFsIG5hbWVzcGFjZSBhbmQgZXhwb3J0IHRoZSBhY3RvcnNcbnZhciBwdXJlbXZjID1cbiBcdHtcbiBcdFx0VmlldzogVmlld1xuIFx0LFx0TW9kZWw6IE1vZGVsXG4gXHQsXHRDb250cm9sbGVyOiBDb250cm9sbGVyXG4gXHQsXHRTaW1wbGVDb21tYW5kOiBTaW1wbGVDb21tYW5kXG4gXHQsXHRNYWNyb0NvbW1hbmQ6IE1hY3JvQ29tbWFuZFxuIFx0LFx0RmFjYWRlOiBGYWNhZGVcbiBcdCxcdE1lZGlhdG9yOiBNZWRpYXRvclxuIFx0LFx0T2JzZXJ2ZXI6IE9ic2VydmVyXG4gXHQsXHROb3RpZmljYXRpb246IE5vdGlmaWNhdGlvblxuIFx0LFx0Tm90aWZpZXI6IE5vdGlmaWVyXG4gXHQsXHRQcm94eTogUHJveHlcbiBcdCxcdGRlZmluZTogZGVmaW5lXG4gXHQsXHRkZWNsYXJlOiBkZWNsYXJlXG4gXHR9O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjOyIsIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogUHVyZU1WQyBTdGF0ZSBNYWNoaW5lIFV0aWxpdHkgSlMgTmF0aXZlIFBvcnQgYnkgU2FhZCBTaGFtc1xuICogQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBSZXVzZSBnb3Zlcm5lZCBieSBDcmVhdGl2ZSBDb21tb25zIEF0dHJpYnV0aW9uIDMuMCBcbiAqIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMC91cy9cbiAqIEBhdXRob3Igc2FhZC5zaGFtc0BwdXJlbXZjLm9yZyBcbiAqL1xuXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoICcuL3B1cmVtdmMtMS4wLjEtbW9kLmpzJyApO1xuICAgIFxuLyoqXG4gKiBDb25zdHJ1Y3RvclxuICpcbiAqIERlZmluZXMgYSBTdGF0ZS5cbiAqIEBtZXRob2QgU3RhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGlkIHRoZSBpZCBvZiB0aGUgc3RhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbnRlcmluZyBhbiBvcHRpb25hbCBub3RpZmljYXRpb24gbmFtZSB0byBiZSBzZW50IHdoZW4gZW50ZXJpbmcgdGhpcyBzdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGV4aXRpbmcgYW4gb3B0aW9uYWwgbm90aWZpY2F0aW9uIG5hbWUgdG8gYmUgc2VudCB3aGVuIGV4aXRpbmcgdGhpcyBzdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGNoYW5nZWQgYW4gb3B0aW9uYWwgbm90aWZpY2F0aW9uIG5hbWUgdG8gYmUgc2VudCB3aGVuIGZ1bGx5IHRyYW5zaXRpb25lZCB0byB0aGlzIHN0YXRlXG4gKiBAcmV0dXJuIFxuICovXG5cbmZ1bmN0aW9uIFN0YXRlKG5hbWUsIGVudGVyaW5nLCBleGl0aW5nLCBjaGFuZ2VkKSB7ICBcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIGlmKGVudGVyaW5nKSB0aGlzLmVudGVyaW5nID0gZW50ZXJpbmc7XG4gICAgaWYoZXhpdGluZykgdGhpcy5leGl0aW5nID0gZXhpdGluZztcbiAgICBpZihjaGFuZ2VkKSB0aGlzLmNoYW5nZWQgPSBjaGFuZ2VkO1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSB7fTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSB0cmFuc2l0aW9uLlxuICogQG1ldGhvZCBkZWZpbmVUcmFuc1xuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbiB0aGUgbmFtZSBvZiB0aGUgU3RhdGVNYWNoaW5lLkFDVElPTiBOb3RpZmljYXRpb24gdHlwZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXQgdGhlIG5hbWUgb2YgdGhlIHRhcmdldCBzdGF0ZSB0byB0cmFuc2l0aW9uIHRvLlxuICogQHJldHVybiBcbiAqL1xuU3RhdGUucHJvdG90eXBlLmRlZmluZVRyYW5zID0gZnVuY3Rpb24oYWN0aW9uLCB0YXJnZXQpIHtcbiAgICBpZih0aGlzLmdldFRhcmdldChhY3Rpb24pICE9IG51bGwpIHJldHVybjtcbiAgICB0aGlzLnRyYW5zaXRpb25zW2FjdGlvbl0gPSB0YXJnZXQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgcHJldmlvdXNseSBkZWZpbmVkIHRyYW5zaXRpb24uXG4gKiBAbWV0aG9kIHJlbW92ZVRyYW5zXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uXG4gKiBAcmV0dXJuIFxuICovXG5TdGF0ZS5wcm90b3R5cGUucmVtb3ZlVHJhbnMgPSBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICBkZWxldGUgdGhpcy50cmFuc2l0aW9uc1thY3Rpb25dO1xufVxuXG4vKipcbiAqIEdldCB0aGUgdGFyZ2V0IHN0YXRlIG5hbWUgZm9yIGEgZ2l2ZW4gYWN0aW9uLlxuICogQG1ldGhvZCBnZXRUYXJnZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25cbiAqIEByZXR1cm4gU3RhdGVcbiAqL1xuLyoqXG4gKiBcbiAqL1xuU3RhdGUucHJvdG90eXBlLmdldFRhcmdldCA9IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25zW2FjdGlvbl0gPyB0aGlzLnRyYW5zaXRpb25zW2FjdGlvbl0gOiBudWxsO1xufVxuXG4vLyBUaGUgc3RhdGUgbmFtZVxuU3RhdGUucHJvdG90eXBlLm5hbWUgPSBudWxsO1xuXG4vLyBUaGUgbm90aWZpY2F0aW9uIHRvIGRpc3BhdGNoIHdoZW4gZW50ZXJpbmcgdGhlIHN0YXRlXG5TdGF0ZS5wcm90b3R5cGUuZW50ZXJpbmcgPSBudWxsO1xuXG4vLyBUaGUgbm90aWZpY2F0aW9uIHRvIGRpc3BhdGNoIHdoZW4gZXhpdGluZyB0aGUgc3RhdGVcblN0YXRlLnByb3RvdHlwZS5leGl0aW5nID0gbnVsbDtcblxuLy8gVGhlIG5vdGlmaWNhdGlvbiB0byBkaXNwYXRjaCB3aGVuIHRoZSBzdGF0ZSBoYXMgYWN0dWFsbHkgY2hhbmdlZFxuU3RhdGUucHJvdG90eXBlLmNoYW5nZWQgPSBudWxsO1xuXG4vKipcbiAqICBUcmFuc2l0aW9uIG1hcCBvZiBhY3Rpb25zIHRvIHRhcmdldCBzdGF0ZXNcbiAqLyBcblN0YXRlLnByb3RvdHlwZS50cmFuc2l0aW9ucyA9IG51bGw7XG4gICAgXG5cbiAgICBcbiAvKipcbiAqIEEgRmluaXRlIFN0YXRlIE1hY2hpbmUgaW1wbGltZW50YXRpb24uXG4gKiA8UD5cbiAqIEhhbmRsZXMgcmVnaXNpc3RyYXRpb24gYW5kIHJlbW92YWwgb2Ygc3RhdGUgZGVmaW5pdGlvbnMsIFxuICogd2hpY2ggaW5jbHVkZSBvcHRpb25hbCBlbnRyeSBhbmQgZXhpdCBjb21tYW5kcyBmb3IgZWFjaCBcbiAqIHN0YXRlLjwvUD5cbiAqL1xuXG4vKipcbiAqIENvbnN0cnVjdG9yXG4gKlxuICogQG1ldGhvZCBTdGF0ZU1hY2hpbmVcbiAqIEByZXR1cm4gXG4gKi9cbmZ1bmN0aW9uIFN0YXRlTWFjaGluZSgpIHtcbiAgICBwdXJlbXZjLk1lZGlhdG9yLmNhbGwodGhpcywgU3RhdGVNYWNoaW5lLk5BTUUsIG51bGwpO1xuICAgIHRoaXMuc3RhdGVzID0ge307XG59XG4gICAgXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlID0gbmV3IHB1cmVtdmMuTWVkaWF0b3I7XG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3RhdGVNYWNoaW5lO1xuXG4vKipcbiAqIFRyYW5zaXRpb25zIHRvIGluaXRpYWwgc3RhdGUgb25jZSByZWdpc3RlcmVkIHdpdGggRmFjYWRlXG4gKiBAbWV0aG9kIG9uUmVnaXN0ZXJcbiAqIEByZXR1cm4gXG4gKi9cblN0YXRlTWFjaGluZS5wcm90b3R5cGUub25SZWdpc3RlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuaW5pdGlhbCkgdGhpcy50cmFuc2l0aW9uVG8odGhpcy5pbml0aWFsLCBudWxsKTtcbn1cblxuLyoqXG4gKiBSZWdpc3RlcnMgdGhlIGVudHJ5IGFuZCBleGl0IGNvbW1hbmRzIGZvciBhIGdpdmVuIHN0YXRlLlxuICogQG1ldGhvZCByZWdpc3RlclN0YXRlXG4gKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZSB0aGUgc3RhdGUgdG8gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGFib3ZlIGNvbW1hbmRzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaXRpYWwgYm9vbGVhbiB0ZWxsaW5nIGlmIHRoaXMgaXMgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIHN5c3RlbVxuICogQHJldHVybiBcbiAqL1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5yZWdpc3RlclN0YXRlID0gZnVuY3Rpb24oc3RhdGUsIGluaXRpYWwpIHtcbiAgICBpZihzdGF0ZSA9PSBudWxsIHx8IHRoaXMuc3RhdGVzW3N0YXRlLm5hbWVdICE9IG51bGwpIHJldHVybjtcbiAgICB0aGlzLnN0YXRlc1tzdGF0ZS5uYW1lXSA9IHN0YXRlO1xuICAgIGlmKGluaXRpYWwpIHRoaXMuaW5pdGlhbCA9IHN0YXRlO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIHN0YXRlIG1hcHBpbmcuIFJlbW92ZXMgdGhlIGVudHJ5IGFuZCBleGl0IGNvbW1hbmRzIGZvciBhIGdpdmVuIHN0YXRlIGFzIHdlbGwgYXMgdGhlIHN0YXRlIG1hcHBpbmcgaXRzZWxmLlxuICogQG1ldGhvZCByZW1vdmVTdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlTmFtZVxuICogQHJldHVybiBcbiAqL1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5yZW1vdmVTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlTmFtZSkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGVzW3N0YXRlTmFtZV07XG4gICAgaWYoc3RhdGUgPT0gbnVsbCkgcmV0dXJuO1xuICAgIHRoaXMuc3RhdGVzW3N0YXRlTmFtZV0gPSBudWxsO1xufVxuXG4vKipcbiAqIFRyYW5zaXRpb25zIHRvIHRoZSBnaXZlbiBzdGF0ZSBmcm9tIHRoZSBjdXJyZW50IHN0YXRlLlxuICogPFA+XG4gKiBTZW5kcyB0aGUgPGNvZGU+ZXhpdGluZzwvY29kZT4gbm90aWZpY2F0aW9uIGZvciB0aGUgY3VycmVudCBzdGF0ZSBcbiAqIGZvbGxvd2VkIGJ5IHRoZSA8Y29kZT5lbnRlcmluZzwvY29kZT4gbm90aWZpY2F0aW9uIGZvciB0aGUgbmV3IHN0YXRlLlxuICogT25jZSBmaW5hbGx5IHRyYW5zaXRpb25lZCB0byB0aGUgbmV3IHN0YXRlLCB0aGUgPGNvZGU+Y2hhbmdlZDwvY29kZT4gXG4gKiBub3RpZmljYXRpb24gZm9yIHRoZSBuZXcgc3RhdGUgaXMgc2VudC48L1A+XG4gKiA8UD5cbiAqIElmIGEgZGF0YSBwYXJhbWV0ZXIgaXMgcHJvdmlkZWQsIGl0IGlzIGluY2x1ZGVkIGFzIHRoZSBib2R5IG9mIGFsbFxuICogdGhyZWUgc3RhdGUtc3BlY2lmaWMgdHJhbnNpdGlvbiBub3Rlcy48L1A+XG4gKiA8UD5cbiAqIEZpbmFsbHksIHdoZW4gYWxsIHRoZSBzdGF0ZS1zcGVjaWZpYyB0cmFuc2l0aW9uIG5vdGVzIGhhdmUgYmVlblxuICogc2VudCwgYSA8Y29kZT5TdGF0ZU1hY2hpbmUuQ0hBTkdFRDwvY29kZT4gbm90ZSBpcyBzZW50LCB3aXRoIHRoZVxuICogbmV3IDxjb2RlPlN0YXRlPC9jb2RlPiBvYmplY3QgYXMgdGhlIDxjb2RlPmJvZHk8L2NvZGU+IGFuZCB0aGUgbmFtZSBvZiB0aGUgXG4gKiBuZXcgc3RhdGUgaW4gdGhlIDxjb2RlPnR5cGU8L2NvZGU+LlxuICpcbiAqIEBtZXRob2QgdHJhbnNpdGlvblRvXG4gKiBAcGFyYW0ge1N0YXRlfSBuZXh0U3RhdGUgdGhlIG5leHQgU3RhdGUgdG8gdHJhbnNpdGlvbiB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIGlzIHRoZSBvcHRpb25hbCBPYmplY3QgdGhhdCB3YXMgc2VudCBpbiB0aGUgPGNvZGU+U3RhdGVNYWNoaW5lLkFDVElPTjwvY29kZT4gbm90aWZpY2F0aW9uIGJvZHlcbiAqIEByZXR1cm4gXG4gKi9cblN0YXRlTWFjaGluZS5wcm90b3R5cGUudHJhbnNpdGlvblRvID0gZnVuY3Rpb24obmV4dFN0YXRlLCBkYXRhKSB7XG4gICAgLy8gR29pbmcgbm93aGVyZT9cbiAgICBpZihuZXh0U3RhdGUgPT0gbnVsbCkgcmV0dXJuO1xuICAgIFxuICAgIC8vIENsZWFyIHRoZSBjYW5jZWwgZmxhZ1xuICAgIHRoaXMuY2FuY2VsZWQgPSBmYWxzZTtcbiAgICBcbiAgICAvLyBFeGl0IHRoZSBjdXJyZW50IFN0YXRlIFxuICAgIGlmKHRoaXMuZ2V0Q3VycmVudFN0YXRlKCkgJiYgdGhpcy5nZXRDdXJyZW50U3RhdGUoKS5leGl0aW5nKSBcbiAgICAgICAgdGhpcy5zZW5kTm90aWZpY2F0aW9uKHRoaXMuZ2V0Q3VycmVudFN0YXRlKCkuZXhpdGluZywgZGF0YSwgbmV4dFN0YXRlLm5hbWUpO1xuICAgIFxuICAgIC8vIENoZWNrIHRvIHNlZSB3aGV0aGVyIHRoZSBleGl0aW5nIGd1YXJkIGhhcyBjYW5jZWxlZCB0aGUgdHJhbnNpdGlvblxuICAgIGlmKHRoaXMuY2FuY2VsZWQpIHtcbiAgICAgICAgdGhpcy5jYW5jZWxlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIEVudGVyIHRoZSBuZXh0IFN0YXRlIFxuICAgIGlmKG5leHRTdGF0ZS5lbnRlcmluZylcbiAgICAgICAgdGhpcy5zZW5kTm90aWZpY2F0aW9uKG5leHRTdGF0ZS5lbnRlcmluZywgZGF0YSk7XG4gICAgXG4gICAgLy8gQ2hlY2sgdG8gc2VlIHdoZXRoZXIgdGhlIGVudGVyaW5nIGd1YXJkIGhhcyBjYW5jZWxlZCB0aGUgdHJhbnNpdGlvblxuICAgIGlmKHRoaXMuY2FuY2VsZWQpIHtcbiAgICAgICAgdGhpcy5jYW5jZWxlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIGNoYW5nZSB0aGUgY3VycmVudCBzdGF0ZSBvbmx5IHdoZW4gYm90aCBndWFyZHMgaGF2ZSBiZWVuIHBhc3NlZFxuICAgIHRoaXMuc2V0Q3VycmVudFN0YXRlKG5leHRTdGF0ZSk7XG4gICAgXG4gICAgLy8gU2VuZCB0aGUgbm90aWZpY2F0aW9uIGNvbmZpZ3VyZWQgdG8gYmUgc2VudCB3aGVuIHRoaXMgc3BlY2lmaWMgc3RhdGUgYmVjb21lcyBjdXJyZW50IFxuICAgIGlmKG5leHRTdGF0ZS5jaGFuZ2VkKSB7XG4gICAgICAgIHRoaXMuc2VuZE5vdGlmaWNhdGlvbih0aGlzLmdldEN1cnJlbnRTdGF0ZSgpLmNoYW5nZWQsIGRhdGEpO1xuICAgIH1cbiAgICBcbiAgICAvLyBOb3RpZnkgdGhlIGFwcCBnZW5lcmFsbHkgdGhhdCB0aGUgc3RhdGUgY2hhbmdlZCBhbmQgd2hhdCB0aGUgbmV3IHN0YXRlIGlzIFxuICAgIHRoaXMuc2VuZE5vdGlmaWNhdGlvbihTdGF0ZU1hY2hpbmUuQ0hBTkdFRCwgdGhpcy5nZXRDdXJyZW50U3RhdGUoKSwgdGhpcy5nZXRDdXJyZW50U3RhdGUoKS5uYW1lKTtcbn1cblxuLyoqXG4gKiBOb3RpZmljYXRpb24gaW50ZXJlc3RzIGZvciB0aGUgU3RhdGVNYWNoaW5lLlxuICogQG1ldGhvZCBsaXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzXG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgb2YgTm90aWZpY2F0aW9uc1xuICovXG5cblN0YXRlTWFjaGluZS5wcm90b3R5cGUubGlzdE5vdGlmaWNhdGlvbkludGVyZXN0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIFN0YXRlTWFjaGluZS5BQ1RJT04sXG4gICAgICAgIFN0YXRlTWFjaGluZS5DQU5DRUxcbiAgICBdO1xufVxuXG4vKipcbiAqIEhhbmRsZSBub3RpZmljYXRpb25zIHRoZSA8Y29kZT5TdGF0ZU1hY2hpbmU8L2NvZGU+IGlzIGludGVyZXN0ZWQgaW4uXG4gKiA8UD5cbiAqIDxjb2RlPlN0YXRlTWFjaGluZS5BQ1RJT048L2NvZGU+OiBUcmlnZ2VycyB0aGUgdHJhbnNpdGlvbiB0byBhIG5ldyBzdGF0ZS48QlI+XG4gKiA8Y29kZT5TdGF0ZU1hY2hpbmUuQ0FOQ0VMPC9jb2RlPjogQ2FuY2VscyB0aGUgdHJhbnNpdGlvbiBpZiBzZW50IGluIHJlc3BvbnNlIHRvIHRoZSBleGl0aW5nIG5vdGUgZm9yIHRoZSBjdXJyZW50IHN0YXRlLjxCUj5cbiAqXG4gKiBAbWV0aG9kIGhhbmRsZU5vdGlmaWNhdGlvblxuICogQHBhcmFtIHtOb3RpZmljYXRpb259IG5vdGlmaWNhdGlvblxuICogQHJldHVybiBcbiAqL1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5oYW5kbGVOb3RpZmljYXRpb24gPSBmdW5jdGlvbihub3RpZmljYXRpb24pIHtcbiAgICBzd2l0Y2gobm90aWZpY2F0aW9uLmdldE5hbWUoKSkge1xuICAgICAgICBjYXNlIFN0YXRlTWFjaGluZS5BQ1RJT046XG4gICAgICAgICAgICB2YXIgYWN0aW9uID0gbm90aWZpY2F0aW9uLmdldFR5cGUoKTtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLmdldEN1cnJlbnRTdGF0ZSgpLmdldFRhcmdldChhY3Rpb24pO1xuICAgICAgICAgICAgdmFyIG5ld1N0YXRlID0gdGhpcy5zdGF0ZXNbdGFyZ2V0XTtcbiAgICAgICAgICAgIGlmKG5ld1N0YXRlKSB0aGlzLnRyYW5zaXRpb25UbyhuZXdTdGF0ZSwgbm90aWZpY2F0aW9uLmdldEJvZHkoKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIFxuICAgICAgICBjYXNlIFN0YXRlTWFjaGluZS5DQU5DRUw6XG4gICAgICAgICAgICB0aGlzLmNhbmNlbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIGN1cnJlbnQgc3RhdGUuXG4gKiBAbWV0aG9kIGdldEN1cnJlbnRTdGF0ZVxuICogQHJldHVybiBhIFN0YXRlIGRlZmluaW5nIHRoZSBtYWNoaW5lJ3MgY3VycmVudCBzdGF0ZVxuICovXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLmdldEN1cnJlbnRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZpZXdDb21wb25lbnQ7XG59XG5cbi8qKlxuICogU2V0IHRoZSBjdXJyZW50IHN0YXRlLlxuICogQG1ldGhvZCBzZXRDdXJyZW50U3RhdGVcbiAqIEBwYXJhbSB7U3RhdGV9IHN0YXRlXG4gKiBAcmV0dXJuIFxuICovXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLnNldEN1cnJlbnRTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgdGhpcy52aWV3Q29tcG9uZW50ID0gc3RhdGU7XG59XG5cbi8qKlxuICogTWFwIG9mIFN0YXRlcyBvYmplY3RzIGJ5IG5hbWUuXG4gKi9cblN0YXRlTWFjaGluZS5wcm90b3R5cGUuc3RhdGVzID0gbnVsbDtcblxuLyoqXG4gKiBUaGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgRlNNLlxuICovXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLmluaXRpYWwgPSBudWxsO1xuXG4vKipcbiAqIFRoZSB0cmFuc2l0aW9uIGhhcyBiZWVuIGNhbmNlbGVkLlxuICovXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLmNhbmNlbGVkID0gbnVsbDtcbiAgICBcblN0YXRlTWFjaGluZS5OQU1FID0gXCJTdGF0ZU1hY2hpbmVcIjtcblxuLyoqXG4gKiBBY3Rpb24gTm90aWZpY2F0aW9uIG5hbWUuIFxuICovIFxuU3RhdGVNYWNoaW5lLkFDVElPTiA9IFN0YXRlTWFjaGluZS5OQU1FICsgXCIvbm90ZXMvYWN0aW9uXCI7XG5cbi8qKlxuICogIENoYW5nZWQgTm90aWZpY2F0aW9uIG5hbWUgIFxuICovIFxuU3RhdGVNYWNoaW5lLkNIQU5HRUQgPSBTdGF0ZU1hY2hpbmUuTkFNRSArIFwiL25vdGVzL2NoYW5nZWRcIjtcblxuLyoqXG4gKiAgQ2FuY2VsIE5vdGlmaWNhdGlvbiBuYW1lICBcbiAqLyBcblN0YXRlTWFjaGluZS5DQU5DRUwgPSBTdGF0ZU1hY2hpbmUuTkFNRSArIFwiL25vdGVzL2NhbmNlbFwiO1xuICAgIFxuICAgIFxuLyoqXG4gKiBDcmVhdGVzIGFuZCByZWdpc3RlcnMgYSBTdGF0ZU1hY2hpbmUgZGVzY3JpYmVkIGluIEpTT04uXG4gKiBcbiAqIDxQPlxuICogVGhpcyBhbGxvd3MgcmVjb25maWd1cmF0aW9uIG9mIHRoZSBTdGF0ZU1hY2hpbmUgXG4gKiB3aXRob3V0IGNoYW5naW5nIGFueSBjb2RlLCBhcyB3ZWxsIGFzIG1ha2luZyBpdCBcbiAqIGVhc2llciB0aGFuIGNyZWF0aW5nIGFsbCB0aGUgPGNvZGU+U3RhdGU8L2NvZGU+IFxuICogaW5zdGFuY2VzIGFuZCByZWdpc3RlcmluZyB0aGVtIHdpdGggdGhlIFxuICogPGNvZGU+U3RhdGVNYWNoaW5lPC9jb2RlPiBhdCBzdGFydHVwIHRpbWUuXG4gKiBcbiAqIEAgc2VlIFN0YXRlXG4gKiBAIHNlZSBTdGF0ZU1hY2hpbmVcbiAqL1xuXG4vKipcbiAqIENvbnN0cnVjdG9yXG4gKiBAbWV0aG9kIEZTTUluamVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gZnNtIEpTT04gT2JqZWN0XG4gKiBAcmV0dXJuIFxuICovXG5mdW5jdGlvbiBGU01JbmplY3Rvcihmc20pIHtcbiAgICBwdXJlbXZjLk5vdGlmaWVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5mc20gPSBmc207XG59XG4gIFxuRlNNSW5qZWN0b3IucHJvdG90eXBlID0gbmV3IHB1cmVtdmMuTm90aWZpZXI7XG5GU01JbmplY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBGU01JbmplY3RvcjtcblxuLyoqXG4gKiBJbmplY3QgdGhlIDxjb2RlPlN0YXRlTWFjaGluZTwvY29kZT4gaW50byB0aGUgUHVyZU1WQyBhcHBhcmF0dXMuXG4gKiA8UD5cbiAqIENyZWF0ZXMgdGhlIDxjb2RlPlN0YXRlTWFjaGluZTwvY29kZT4gaW5zdGFuY2UsIHJlZ2lzdGVycyBhbGwgdGhlIHN0YXRlc1xuICogYW5kIHJlZ2lzdGVycyB0aGUgPGNvZGU+U3RhdGVNYWNoaW5lPC9jb2RlPiB3aXRoIHRoZSA8Y29kZT5JRmFjYWRlPC9jb2RlPi5cbiAqIEBtZXRob2QgaW5qZWN0XG4gKiBAcmV0dXJuIFxuICovXG5GU01JbmplY3Rvci5wcm90b3R5cGUuaW5qZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBTdGF0ZU1hY2hpbmVcbiAgICB2YXIgc3RhdGVNYWNoaW5lID0gbmV3IHB1cmVtdmMuc3RhdGVtYWNoaW5lLlN0YXRlTWFjaGluZSgpO1xuICAgIFxuICAgIC8vIFJlZ2lzdGVyIGFsbCB0aGUgc3RhdGVzIHdpdGggdGhlIFN0YXRlTWFjaGluZVxuICAgIHZhciBzdGF0ZXMgPSB0aGlzLmdldFN0YXRlcygpO1xuICAgIGZvcih2YXIgaT0wOyBpPHN0YXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBzdGF0ZU1hY2hpbmUucmVnaXN0ZXJTdGF0ZShzdGF0ZXNbaV0sIHRoaXMuaXNJbml0aWFsKHN0YXRlc1tpXS5uYW1lKSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFJlZ2lzdGVyIHRoZSBTdGF0ZU1hY2hpbmUgd2l0aCB0aGUgZmFjYWRlXG4gICAgdGhpcy5mYWNhZGUucmVnaXN0ZXJNZWRpYXRvcihzdGF0ZU1hY2hpbmUpO1xufVxuXG4vKipcbiAqIEdldCB0aGUgc3RhdGUgZGVmaW5pdGlvbnMuXG4gKiA8UD5cbiAqIENyZWF0ZXMgYW5kIHJldHVybnMgdGhlIGFycmF5IG9mIFN0YXRlIG9iamVjdHMgXG4gKiBmcm9tIHRoZSBGU00gb24gZmlyc3QgY2FsbCwgc3Vic2VxdWVudGx5IHJldHVybnNcbiAqIHRoZSBleGlzdGluZyBhcnJheS48L1A+XG4gKlxuICogQG1ldGhvZCBnZXRTdGF0ZXNcbiAqIEByZXR1cm4ge0FycmF5fSBBcnJheSBvZiBTdGF0ZXNcbiAqL1xuRlNNSW5qZWN0b3IucHJvdG90eXBlLmdldFN0YXRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuc3RhdGVMaXN0ID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zdGF0ZUxpc3QgPSBbXTtcblxuICAgICAgICB2YXIgc3RhdGVEZWZzID0gdGhpcy5mc20uc3RhdGUgPyB0aGlzLmZzbS5zdGF0ZSA6IFtdO1xuICAgICAgICBmb3IodmFyIGk9MDsgaTxzdGF0ZURlZnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZURlZiA9IHN0YXRlRGVmc1tpXTtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuY3JlYXRlU3RhdGUoc3RhdGVEZWYpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZUxpc3QucHVzaChzdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVMaXN0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSA8Y29kZT5TdGF0ZTwvY29kZT4gaW5zdGFuY2UgZnJvbSBpdHMgSlNPTiBkZWZpbml0aW9uLlxuICogQG1ldGhvZCBjcmVhdGVTdGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlRGVmIEpTT04gT2JqZWN0XG4gKiBAcmV0dXJuIHtTdGF0ZX0gXG4gKi9cbi8qKlxuXG4gKi9cbkZTTUluamVjdG9yLnByb3RvdHlwZS5jcmVhdGVTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlRGVmKSB7XG4gICAgLy8gQ3JlYXRlIFN0YXRlIG9iamVjdFxuICAgIHZhciBuYW1lID0gc3RhdGVEZWZbJ0BuYW1lJ107XG4gICAgdmFyIGV4aXRpbmcgPSBzdGF0ZURlZlsnQGV4aXRpbmcnXTtcbiAgICB2YXIgZW50ZXJpbmcgPSBzdGF0ZURlZlsnQGVudGVyaW5nJ107XG4gICAgdmFyIGNoYW5nZWQgPSBzdGF0ZURlZlsnQGNoYW5nZWQnXTtcbiAgICB2YXIgc3RhdGUgPSBuZXcgcHVyZW12Yy5zdGF0ZW1hY2hpbmUuU3RhdGUobmFtZSwgZW50ZXJpbmcsIGV4aXRpbmcsIGNoYW5nZWQpO1xuICAgIFxuICAgIC8vIENyZWF0ZSB0cmFuc2l0aW9uc1xuICAgIHZhciB0cmFuc2l0aW9ucyA9IHN0YXRlRGVmLnRyYW5zaXRpb24gPyBzdGF0ZURlZi50cmFuc2l0aW9uIDogW107XG4gICAgZm9yKHZhciBpPTA7IGk8dHJhbnNpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRyYW5zRGVmID0gdHJhbnNpdGlvbnNbaV07XG4gICAgICAgIHN0YXRlLmRlZmluZVRyYW5zKHRyYW5zRGVmWydAYWN0aW9uJ10sIHRyYW5zRGVmWydAdGFyZ2V0J10pO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGU7XG59XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIHN0YXRlIHRoZSBpbml0aWFsIHN0YXRlP1xuICogQG1ldGhvZCBpc0luaXRpYWxcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZU5hbWVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbkZTTUluamVjdG9yLnByb3RvdHlwZS5pc0luaXRpYWwgPSBmdW5jdGlvbihzdGF0ZU5hbWUpIHtcbiAgICB2YXIgaW5pdGlhbCA9IHRoaXMuZnNtWydAaW5pdGlhbCddO1xuICAgIHJldHVybiBzdGF0ZU5hbWUgPT0gaW5pdGlhbDtcbn1cblxuLy8gVGhlIEpTT04gRlNNIGRlZmluaXRpb25cbkZTTUluamVjdG9yLnByb3RvdHlwZS5mc20gPSBudWxsO1xuXG4vLyBUaGUgTGlzdCBvZiBTdGF0ZSBvYmplY3RzXG5GU01JbmplY3Rvci5wcm90b3R5cGUuc3RhdGVMaXN0ID0gbnVsbDtcblxuXG5wdXJlbXZjLnN0YXRlbWFjaGluZSA9XG57XG4gICAgU3RhdGU6IFN0YXRlXG4gICAgLFx0U3RhdGVNYWNoaW5lOiBTdGF0ZU1hY2hpbmVcbiAgICAsXHRGU01JbmplY3RvcjogRlNNSW5qZWN0b3Jcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5zdGF0ZW1hY2hpbmU7Il19
