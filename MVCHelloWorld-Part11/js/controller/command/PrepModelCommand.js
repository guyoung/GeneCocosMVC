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
