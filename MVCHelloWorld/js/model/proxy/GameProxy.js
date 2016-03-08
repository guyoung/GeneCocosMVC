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

        _life: 0,

        onRegister: function () {
            this._life = 10;
        },

        getLife: function (life) {
            return this._life;
        },

        setLife: function (life) {
            this._life = life;
        },

        incLife: function (cb) {
            this._life++;
        },

        decLife: function (cb) {
            this._life--;

            if (this._life <= 0) {
                this.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('GAME_OVER_ACTION'));
            } else {
                if (cb) {
                    cb(this._life);
                }
            }

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'GameProxy'
    }
);

