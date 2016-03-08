"use strict";

var res = require('./../ui/Resource.js').res;

var BookLayer = cc.Layer.extend({

    winSize:cc.Size(400, 300),
    onClose: null,

    book: null,

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


        var helloLabel = new cc.LabelTTF("Book", "Arial", 38);
        helloLabel.x = this.winSize.width / 2;
        helloLabel.y = this.winSize.height - 50;
        this.addChild(helloLabel, 5);

       this.showBook(this.book);

        return true;
    },

    handleClose: function(sender) {
        if (this.onClose){
            this.onClose();
        }
    },

    showBook: function(book) {

    }



});

exports.BookLayer = BookLayer;