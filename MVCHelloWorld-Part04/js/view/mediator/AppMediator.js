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
        /** @override */
        listNotificationInterests: function () {
            return [
                puremvc.statemachine.StateMachine.CHANGED
            ];
        },

        /** @override */
        handleNotification: function (notification) {
            switch (notification.getName()) {
                case puremvc.statemachine.StateMachine.CHANGED:
                    alert(notification.getBody().name);

                    break;
            }
        },

        /** @override */
        onRegister: function () {

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
