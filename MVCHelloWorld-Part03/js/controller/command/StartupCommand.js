"use strict";

var puremvc = require('puremvc').puremvc;
var AppConfigProxy = require('./../../model/proxy/AppConfigProxy');
var AppMediator = require('./../../view/mediator/AppMediator.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.StartupCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (notification)
        {
            this.facade.registerProxy( new AppConfigProxy() );
            this.facade.registerMediator( new AppMediator() );
        }
},
    // STATIC MEMBERS
    {
        NAME: 'StartupCommand'
    }
);
