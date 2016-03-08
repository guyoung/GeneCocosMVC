"use strict";

var puremvc = require('puremvc').puremvc;
var DirectorMediator = require('./../../view/mediator/DirectorMediator.js');
var SceneMediator = require('./../../view/mediator/SceneMediator.js');
var GameMediator = require('./../../view/mediator/GameMediator.js');

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

            this.facade.registerMediator( new DirectorMediator() );
            this.facade.registerMediator( new SceneMediator() );
            this.facade.registerMediator( new GameMediator() );
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepViewCommand'
    }
);
