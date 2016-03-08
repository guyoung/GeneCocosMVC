var GeneJS = require('GeneJS');

var SceneState = require('./SceneState.js').SceneState;
var SceneAction = require('./SceneAction.js').SceneAction;
var SceneTransition = require('./SceneTransition.js').SceneTransition;

var SceneFsm = GeneJS.Class({
    'public createFsm': function() {
        var fsm = {
            // 开始状态
            "@initial": SceneState.$('MENU_MEDIATOR'),
            "state": [
                {
                    // Menu
                    "@name": SceneState.$('MENU_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('HELLO_ACTION'),
                            "@target": SceneState.$('HELLO_MEDIATOR')
                        },
                        {
                            "@action": SceneAction.$('GAME_ACTION'),
                            "@target": SceneState.$('GAME_MEDIATOR')
                        },
                        {
                            "@action": SceneAction.$('DRAW_ACTION'),
                            "@target": SceneState.$('DRAW_MEDIATOR')
                        },
                        {
                            "@action": SceneAction.$('BOOK_ACTION'),
                            "@target": SceneState.$('BOOK_MEDIATOR')
                        }
                    ]
                },
                {
                    // Hello
                    "@name": SceneState.$('HELLO_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('HOME_ACTION'),
                            "@target": SceneState.$('MENU_MEDIATOR')
                        }
                    ]
                },
                {
                    // Game
                    "@name": SceneState.$('GAME_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('GAME_OVER_ACTION'),
                            "@target": SceneState.$('GAME_OVER_MEDIATOR')
                        }
                    ]
                },
                {
                    // GameOver
                    "@name": SceneState.$('GAME_OVER_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('HOME_ACTION'),
                            "@target": SceneState.$('MENU_MEDIATOR')
                        }
                    ]
                },
                {
                    // Draw
                    "@name": SceneState.$('DRAW_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('HOME_ACTION'),
                            "@target": SceneState.$('MENU_MEDIATOR')
                        }
                    ]
                },
                {
                    // Book
                    "@name": SceneState.$('BOOK_MEDIATOR'),
                    //"@changed": SceneTransition ,
                    "transition": [
                        {
                            "@action": SceneAction.$('HOME_ACTION'),
                            "@target": SceneState.$('MENU_MEDIATOR')
                        }
                    ]
                }
            ]
        };

        return fsm;
    }
});

exports.SceneFsm = SceneFsm;