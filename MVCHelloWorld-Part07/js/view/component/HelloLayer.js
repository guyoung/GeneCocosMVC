"use strict";

var res = require('./../ui/Resource.js').res;

var HelloLayer = cc.Layer.extend({

    winSize: cc.Size(400, 300),
    onClose: null,

    ctor:function (space) {
        this._super();
    },

    init:function () {
        this._super();

        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            this.handleClose,
            this);

        closeItem.attr({
            x: this.winSize.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);


        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        helloLabel.x = this.winSize.width / 2;
        helloLabel.y = 0;
        this.addChild(helloLabel, 5);


        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: this.winSize.width / 2,
            y: this.winSize.height / 2,
            scale: 0.5,
            rotation: 180
        });
        this.addChild(this.sprite, 0);

        this.sprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0),
                cc.scaleTo(2, 1, 1)
            )
        );

        helloLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, this.winSize.height - 40)),
                cc.tintTo(2.5, 255, 125, 0)
            )
        );
        return true;
    },

    handleClose: function(sender) {
        if (this.onClose){
            this.onClose();
        }
    }

});

exports.HelloLayer = HelloLayer;