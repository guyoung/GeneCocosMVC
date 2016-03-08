"use strict";

var puremvc = require('puremvc').puremvc;
var AppMediator = require('./../../view/mediator/AppMediator.js');

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

            this.facade.registerMediator( new AppMediator() );
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepViewCommand'
    }
);
