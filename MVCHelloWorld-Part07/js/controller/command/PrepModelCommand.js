"use strict";

var puremvc = require('puremvc').puremvc;
var AppConfigProxy = require('./../../model/proxy/AppConfigProxy');
var GameProxy = require('./../../model/proxy/GameProxy');
var RectangleProxy = require('./../../model/proxy/RectangleProxy');
var BookProxy = require('./../../model/proxy/BookProxy');


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

            this.facade.registerProxy(new AppConfigProxy() );
            this.facade.registerProxy(new GameProxy() );
            this.facade.registerProxy(new RectangleProxy() );
            this.facade.registerProxy(new BookProxy() );

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepModelCommand'
    }
);
