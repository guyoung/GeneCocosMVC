var GeneJS = require('GeneJS');

// Action 动作
var SceneAction = GeneJS.Class({
    'public const HOME_ACTION': 'HomeAction',
    'public const MENU_ACTION': 'MenuAction',
    'public const HELLO_ACTION': 'HelloAction',
    'public const GAME_ACTION': 'GameAction',
    'public const GAME_OVER_ACTION': 'GameOverAction',
    'public const DRAW_ACTION': 'DrawAction',
    'public const BOOK_ACTION': 'BookAction'

});


exports.SceneAction = SceneAction;