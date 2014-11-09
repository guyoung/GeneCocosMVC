"use strict";

var res = require('./../ui/Resource.js').res;

var GameLayer = cc.Layer.extend({

    winSize: cc.Size(400, 300),
    onKill: null,

    life: 0,
    _lifeLabel: null,

    ctor:function (space) {
        this._super();
    },

    init:function () {
        this._super();

        this._lifeLabel = new cc.LabelTTF();
        this._lifeLabel.fontName = "Arial";
        this._lifeLabel.fontSize = 60;
        this._lifeLabel.x = this.winSize.width / 2;
        this._lifeLabel.y = this.winSize.height / 2;
        this.addChild(this._lifeLabel, 5);

        this.showLife(this.life);

        var button = new ccui.Button();
        button.setTitleText("KILL");
        button.setTouchEnabled(true);
        button.loadTextures("res/animationbuttonnormal.png", "res/animationbuttonpressed.png", "");
        button.x = this.winSize.width / 2
        button.y = this.winSize.height / 2 -50;
        button.addTouchEventListener(this.handleKill ,this);
        this.addChild(button);

        return true;
    },

    showLife: function(life){
        this._lifeLabel.setString("LIFE:" + life)
    },

    handleKill: function(sender) {
        if (this.onKill){
            this.onKill();
        }
    }
});

exports.GameLayer = GameLayer;