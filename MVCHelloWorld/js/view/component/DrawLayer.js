"use strict";

var res = require('./../ui/Resource.js').res;

var DrawLayer = cc.Layer.extend({

    winSize:cc.Size(400, 300),
    onClose: null,

    rectangleWidth: 0,
    rectangleHeight: 0,
    rectangleArea: 0,

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


        var helloLabel = new cc.LabelTTF("Draw", "Arial", 38);
        helloLabel.x = this.winSize.width / 2;
        helloLabel.y = this.winSize.height - 50;
        this.addChild(helloLabel, 5);

        this.drawRectangle(this.rectangleWidth, this.rectangleHeight);

        var areaLabel = new cc.LabelTTF(this.rectangleArea, "Arial", 38);
        areaLabel.x = this.winSize.width -100;
        areaLabel.y = 100;
        this.addChild(areaLabel, 9);

        return true;
    },

    drawRectangle: function(width, height){
        var draw = new cc.DrawNode();
        this.addChild(draw, 10);

        draw.drawRect(cc.p(50, 50), cc.p(50 + width, 50 + height), null, 2, cc.color(255, 0, 255, 255));

    },

    handleClose: function(sender) {
        if (this.onClose){
            this.onClose();
        }
    }

});

exports.DrawLayer = DrawLayer;