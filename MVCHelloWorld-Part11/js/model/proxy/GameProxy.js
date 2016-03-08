"use strict";

var puremvc = require('puremvc').puremvc;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'model.proxy.GameProxy',
        parent: puremvc.Proxy,

        constructor: function () {
            puremvc.Proxy.call(this);
        }
    },

    // INSTANCE MEMBERS
    {
        onRegister: function () {

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'GameProxy'
    }
);

