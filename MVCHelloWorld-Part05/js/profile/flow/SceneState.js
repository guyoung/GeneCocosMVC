var GeneJS = require('GeneJS');

// State 状态
var SceneState = GeneJS.Class({
    'public const MENU_MEDIATOR': 'MenuMediator',
    'public const HELLO_MEDIATOR': 'HelloMediator',
    'public const GAME_MEDIATOR': 'GameMediator',
    'public const GAME_OVER_MEDIATOR': 'GameOverMediator',
    'public const DRAW_MEDIATOR': 'DrawMediator',
    'public const BOOK_MEDIATOR': 'BookMediator'
});


exports.SceneState = SceneState;