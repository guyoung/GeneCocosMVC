"use strict";

var puremvc = require('puremvc').puremvc;
var SceneFsm = require('./../../profile/flow/SceneFsm.js').SceneFsm;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.InjectFSMCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (notification)
        {
            cc.log('InjectFSMCommand execute');

            var sceneFsm = new SceneFsm();
            var fsm = sceneFsm.createFsm();

            var injector = new puremvc.statemachine.FSMInjector(fsm);
            injector.initializeNotifier(this.multitonKey);
            injector.inject();

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepControllerCommand'
    }
);
