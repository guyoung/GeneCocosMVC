"use strict";

var puremvc = require('puremvc').puremvc;
var PrepModelCommand = require('./PrepModelCommand.js');
var PrepViewCommand = require('./PrepViewCommand.js');
var PrepControllerCommand = require('./PrepControllerCommand.js');
var InjectFSMCommand = require('./InjectFSMCommand.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.StartupCommand',
        parent:puremvc.MacroCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        initializeMacroCommand: function (notification)
        {
            this.addSubCommand(PrepModelCommand);
            this.addSubCommand(PrepViewCommand);
            this.addSubCommand(PrepControllerCommand);
            this.addSubCommand(InjectFSMCommand );

        }
},
    // STATIC MEMBERS
    {
        NAME: 'StartupCommand'
    }
);
