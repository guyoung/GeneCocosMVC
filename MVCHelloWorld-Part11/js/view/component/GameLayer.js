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