"use strict";

var puremvc = require('puremvc').puremvc;
var DrawLayer = require('./../component/DrawLayer.js').DrawLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;
var RectangleProxy = require('./../../model/proxy/RectangleProxy.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.DrawMediator',
        parent: puremvc.Mediator,
        constructor: function() {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        _rectangleProxy: null,

        /** @override */
        listNotificationInterests: function () {
            return [ ];
        },

        /** @override */
        handleNotification: function (note) {

        },

        /** @override */
        onRegister: function () {
            this._rectangleProxy  = this.facade.retrieveProxy(RectangleProxy.NAME );
        },

        /** @override */
        onRemove: function () {

        },
        init: function() {
            var self = this;

            self.viewComponent = new DrawLayer();
            self.viewComponent.winSize = cc.director.getWinSize();
            self.viewComponent.onClose = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('HOME_ACTION'));
            };

            self.viewComponent.rectangleWidth = this._rectangleProxy.getWidth();
            self.viewComponent.rectangleHeight = this._rectangleProxy.getHeight();
            self.viewComponent.rectangleArea = this._rectangleProxy.getArea();

            self._rectangleProxy.setWidth(self._rectangleProxy.getWidth() + 10);
            self._rectangleProxy.setHeight(self._rectangleProxy.getHeight() + 10);

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
        NAME: 'DrawMediator'
    }
);
