"use strict";

var puremvc = require('puremvc').puremvc;
var DirectorMediator = require('./../../view/mediator/DirectorMediator.js');
var SceneMediator = require('./../../view/mediator/SceneMediator.js');
var MenuMediator = require('./../../view/mediator/MenuMediator.js');
var HelloMediator = require('./../../view/mediator/HelloMediator.js');
var GameMediator = require('./../../view/mediator/GameMediator.js');
var GameOverMediator = require('./../../view/mediator/GameOverMediator.js');
var DrawMediator = require('./../../view/mediator/DrawMediator.js');
var BookMediator = require('./../../view/mediator/BookMediator.js');


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
            this.facade.registerMediator( new MenuMediator() );
            this.facade.registerMediator( new HelloMediator() );
            this.facade.registerMediator( new GameMediator() );
            this.facade.registerMediator( new GameOverMediator() );
            this.facade.registerMediator( new DrawMediator () );
            this.facade.registerMediator( new BookMediator () );
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepViewCommand'
    }
);
