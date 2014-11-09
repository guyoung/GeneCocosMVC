"use strict";

var puremvc = require('puremvc').puremvc;
var MenuLayer = require('./../component/MenuLayer.js').MenuLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.MenuMediator',
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


            self.viewComponent = new MenuLayer();
            self.viewComponent.winSize = cc.director.getWinSize();
            self.viewComponent.onHello = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('HELLO_ACTION'));
            };
            self.viewComponent.onGame = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('GAME_ACTION'));
            };
            self.viewComponent.onDraw = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('DRAW_ACTION'));
            };
            self.viewComponent.onBook = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('BOOK_ACTION'));
            };

            self.viewComponent.init();
        },

        getResource: function () {

            var g_resources = require('./../ui/Resource.js').g_resources;
            return g_resources;
        }


    },
    // STATIC MEMBERS
    {
        NAME: 'MenuMediator'
    }
);
