"use strict";

var res = require('./../ui/Resource.js').res;

var MenuLayer = cc.Layer.extend({

    winSize: cc.Size(400, 300),

    onHello: null,
    onGame: null,
    onDraw: null,
    onBook: null,

    ctor:function (space) {
        this._super();
    },

    init:function () {
        this._super();

        var menuItem1 = new cc.MenuItemFont('Hello', this.handleHello, this);
        menuItem1.setPosition(new cc.Point(this.winSize.width/2, this.winSize.height/2+100));
        var menuItem2 = new cc.MenuItemFont('Game', this.handleGame, this);
        menuItem2.setPosition(new cc.Point(this.winSize.width/2, this.winSize.height/2+50));
        var menuItem3 = new cc.MenuItemFont('Draw', this.handleDraw, this);
        menuItem3.setPosition(new cc.Point(this.winSize.width/2, this.winSize.height/2));
        var menuItem4 = new cc.MenuItemFont('Book', this.handleBook, this);
        menuItem4.setPosition(new cc.Point(this.winSize.width/2, this.winSize.height/2-50));
        var menu = new cc.Menu( menuItem1, menuItem2, menuItem3, menuItem4);
        menu.setPosition(new cc.Point(0,0));
        this.addChild(menu);

        return true;
    },

    handleHello: function(sender) {
        if (this.onHello){
            this.onHello();
        }
    },

    handleGame: function(sender) {
        if (this.onGame){
            this.onGame();
        }
    },

    handleDraw: function(sender) {
        if (this.onDraw){
            this.onDraw();
        }
    },

    handleBook: function(sender) {
        if (this.onBook){
            this.onBook();
        }
    }

});

exports.MenuLayer = MenuLayer;