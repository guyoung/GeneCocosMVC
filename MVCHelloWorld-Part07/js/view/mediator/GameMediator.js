"use strict";

var puremvc = require('puremvc').puremvc;
var GameLayer = require('./../component/GameLayer.js').GameLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.GameMediator',
        parent: puremvc.Mediator,
        constructor: function() {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        /** @override */
        listNotificationInterests: function () {
            return [ ];
        },

        /** @override */
        handleNotification: function (note) {

        },

        /** @override */
        onRegister: function () {
        },

        /** @override */
        onRemove: function () {

        },
        init: function() {
            var self = this;

            self.viewComponent = new GameLayer();
            self.viewComponent.winSize = cc.director.getWinSize();
            self.viewComponent.life = 1;
            self.viewComponent.onKill = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('GAME_OVER_ACTION'));
            };

            self.viewComponent.init();
        },
        destroy: function() {
            this.viewComponent = null;
        },
        getResource: function () {
            return null;
        }


    },
    // STATIC MEMBERS
    {
        NAME: 'GameMediator'
    }
);
