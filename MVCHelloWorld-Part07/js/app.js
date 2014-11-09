"use strict";

var AppFacade = require('./AppFacade.js');

(function() {
    cc.game.config[cc.game.CONFIG_KEY.debugMode] = 1;
    cc.game.config[cc.game.CONFIG_KEY.showFPS] = true;
    cc.game.config[cc.game.CONFIG_KEY.frameRate] = 60;
    cc.game.config[cc.game.CONFIG_KEY.id] = 'gameCanvas';
    cc.game.config[cc.game.CONFIG_KEY.renderMode] = 0;

    cc.game.onStart = function(){
        cc.view.adjustViewPort(true);
        cc.view.setDesignResolutionSize(800,450,cc.ResolutionPolicy.SHOW_ALL);
        cc.view.resizeWithBrowserSize(true);
        cc.director.setProjection(cc.Director.PROJECTION_2D);

        var key = 'MVC_HELLOWORLD';
        AppFacade.getInstance(key).startup();
    };

    cc.game.run();
})();
