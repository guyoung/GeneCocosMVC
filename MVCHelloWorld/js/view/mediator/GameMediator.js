"use strict";

var puremvc = require('puremvc').puremvc;
var GameLayer = require('./../component/GameLayer.js').GameLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;
var GameProxy = require('./../../model/proxy/GameProxy.js');

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
        _gameProxy: null,

        /** @override */
        listNotificationInterests: function () {
            return [ ];
        },

        /** @override */
        handleNotification: function (note) {

        },

        /** @override */
        onRegister: function () {
            this._gameProxy  = this.facade.retrieveProxy(GameProxy.NAME);
        },

        /** @override */
        onRemove: function () {

        },
        init: function() {
            var self = this;

            self.viewComponent = new GameLayer();
            self.viewComponent.winSize = cc.director.getWinSize();
            self.viewComponent.life = self._gameProxy.getLife();
            self.viewComponent.onKill = function() {
                var showLife = function (life) {
                    self.viewComponent.showLife(life)
                };

                self._gameProxy.decLife(showLife);
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
