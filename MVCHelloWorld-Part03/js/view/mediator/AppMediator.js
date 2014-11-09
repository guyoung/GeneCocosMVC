"use strict";

var puremvc = require('puremvc').puremvc;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.AppMediator',
        parent: puremvc.Mediator,
        constructor: function() {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }
    },
    // INSTANCE MEMBERS
    {
        _appConfigProxy: null,

        /** @override */
        listNotificationInterests: function () {
            return [ 'WriteAppConfig' ];
        },

        /** @override */
        handleNotification: function (notification) {
            switch (notification.getName()) {
                case 'WriteAppConfig':
                    document.write('<p>AppName:' + this._appConfigProxy.getAppName() + '</p>');
                    document.write('<p>AppVersion:' + this._appConfigProxy.getAppVersion() + '</p>');
                    document.write('<p>AppVersion:' + this._appConfigProxy.getAppDescription() + '</p>');

                    break;
            }
        },

        /** @override */
        onRegister: function () {
            this._appConfigProxy  = this.facade.retrieveProxy('AppConfigProxy');
         },

        /** @override */
        onRemove: function () {

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'AppMediator'
    }
);
