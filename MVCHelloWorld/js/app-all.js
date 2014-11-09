(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var StartupCommand = require('./controller/command/StartupCommand.js');

var AppFacade = module.exports = puremvc.define(
    // CLASS INFO
    {
        name: 'AppFacade',
        parent: puremvc.Facade,

        constructor: function (multitonKey) {
            puremvc.Facade.call(this, multitonKey);
        }
    },
    // INSTANCE MEMBERS
    {
        initializeController: function () {
            puremvc.Facade.prototype.initializeController.call(this);
            this.registerCommand(AppFacade.STARTUP, StartupCommand);
        },
        initializeModel: function () {
            puremvc.Facade.prototype.initializeModel.call(this);
        },
        initializeView: function () {
            puremvc.Facade.prototype.initializeView.call(this);
        },

        startup: function () {
            this.sendNotification(AppFacade.STARTUP);
        }
    },
    // STATIC MEMBERS
    {
        getInstance: function(multitonKey) {
            var instanceMap = puremvc.Facade.instanceMap;
            var instance = instanceMap[multitonKey];
            if(instance) {
                return instance;
            }
            return instanceMap[multitonKey] = new AppFacade(multitonKey);
        },
        NAME: 'AppFacade',
        STARTUP: 'Startup'
    }
);
},{"./controller/command/StartupCommand.js":7,"puremvc":36}],2:[function(require,module,exports){
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

},{"./AppFacade.js":1}],3:[function(require,module,exports){
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

},{"./../../profile/flow/SceneFsm.js":14,"puremvc":36}],4:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.PrepControllerCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (notification)
        {
            cc.log('PrepControllerCommand execute');
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepControllerCommand'
    }
);

},{"puremvc":36}],5:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var AppConfigProxy = require('./../../model/proxy/AppConfigProxy');
var GameProxy = require('./../../model/proxy/GameProxy');
var RectangleProxy = require('./../../model/proxy/RectangleProxy');
var BookProxy = require('./../../model/proxy/BookProxy');


module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.PrepModelCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (notification)
        {
            cc.log('PrepModelCommand execute');

            this.facade.registerProxy(new AppConfigProxy() );
            this.facade.registerProxy(new GameProxy() );
            this.facade.registerProxy(new RectangleProxy() );
            this.facade.registerProxy(new BookProxy() );

        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepModelCommand'
    }
);

},{"./../../model/proxy/AppConfigProxy":9,"./../../model/proxy/BookProxy":10,"./../../model/proxy/GameProxy":11,"./../../model/proxy/RectangleProxy":12,"puremvc":36}],6:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var DirectorMediator = require('./../../view/mediator/DirectorMediator.js');
var SceneMediator = require('./../../view/mediator/SceneMediator.js');
var MenuMediator = require('./../../view/mediator/MenuMediator.js');
var HelloMediator = require('./../../view/mediator/HelloMediator.js');
var GameMediator = require('./../../view/mediator/GameMediator.js');
var GameOverMediator = require('./../../view/mediator/GameOverMediator.js');
var DrawMediator = require('./../../view/mediator/DrawMediator.js');
var BookMediator = require('./../../view/mediator/BookMediator.js');


module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'controller.command.PrepViewCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (notification)
        {
            cc.log('PrepViewCommand execute');

            this.facade.registerMediator( new DirectorMediator() );
            this.facade.registerMediator( new SceneMediator() );
            this.facade.registerMediator( new MenuMediator() );
            this.facade.registerMediator( new HelloMediator() );
            this.facade.registerMediator( new GameMediator() );
            this.facade.registerMediator( new GameOverMediator() );
            this.facade.registerMediator( new DrawMediator () );
            this.facade.registerMediator( new BookMediator () );
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepViewCommand'
    }
);

},{"./../../view/mediator/BookMediator.js":23,"./../../view/mediator/DirectorMediator.js":24,"./../../view/mediator/DrawMediator.js":25,"./../../view/mediator/GameMediator.js":26,"./../../view/mediator/GameOverMediator.js":27,"./../../view/mediator/HelloMediator.js":28,"./../../view/mediator/MenuMediator.js":29,"./../../view/mediator/SceneMediator.js":30,"puremvc":36}],7:[function(require,module,exports){
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

},{"./InjectFSMCommand.js":3,"./PrepControllerCommand.js":4,"./PrepModelCommand.js":5,"./PrepViewCommand.js":6,"puremvc":36}],8:[function(require,module,exports){
"use strict";

var GeneJS = require('GeneJS');

var Rectangle = GeneJS.Class({

    'public _width': null,
    'private _height': null,

    'public __construct': function( width, height )
    {
        this._width = width;
        this._height = height;
    },

    'public getWidth': function()
    {
        return this._width;
    },

    'public setWidth': function(width)
    {
        this._width = width;
    },


    'public getHeight': function()
    {
        return this._height;
    },

    'public setHeight': function(height)
    {
        this._height = height;
    },

    'public getArea': function()
    {
        return this._width * this._height;
    },

    'public static getAreaStatic': function( width, height )
    {
        return width * height;
    }
});

exports.Rectangle = Rectangle;


},{"GeneJS":35}],9:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'model.proxy.AppConfigProxy',
        parent:puremvc.Proxy,

        constructor: function() {
            puremvc.Proxy.call(this);
        }
    },

    // INSTANCE MEMBERS
    {
        _config: null,

        onRegister: function() {
            this.loadData();
        },
        loadData: function() {
            var self = this;
            var xmlhttp = new XMLHttpRequest();
            var url = "js/app.config";

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    self._config = JSON.parse(xmlhttp.responseText);

                    self.sendNotification('WriteAppConfig');
                }
            }
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        },
        getAppName: function() {
            return this._config.AppName;
        },
        getAppVersion: function() {
            return this._config.AppVersion;
        },
        getAppDescription: function() {
            return this._config.AppDescription;
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'AppConfigProxy'
    }
);


},{"puremvc":36}],10:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'model.proxy.BookProxy',
        parent:puremvc.Proxy,

        constructor: function() {
            puremvc.Proxy.call(this);
        }
    },

    // INSTANCE MEMBERS
    {
        _books: null,
        _bookIndex: 0,

        onRegister: function() {
            this.loadData();
            this._bookIndex = 0;
        },

        loadData: function() {
            var self = this;
            var xmlhttp = new XMLHttpRequest();
            var url = "data/book.json";

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    self._books = JSON.parse(xmlhttp.responseText).books;
                }
            }
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        },


        getBook: function() {

             var book = this._books[this._bookIndex];

            if (this._bookIndex < this._books.length) {
                this._bookIndex++;
            }
            else {
                this._bookIndex = 0;
            }

            return book;
        },
        setBookIndex: function(index) {
            this._bookIndex = index;
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'BookProxy'
    }
);


},{"puremvc":36}],11:[function(require,module,exports){
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


},{"./../../profile/flow/SceneAction.js":13,"puremvc":36}],12:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var Rectangle = require('./../domain/Rectangle.js').Rectangle;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'model.proxy.RectangleProxy',
        parent:puremvc.Proxy,

        constructor: function(config) {
            puremvc.Proxy.call(this);

        }
    },
    // INSTANCE MEMBERS
    {
        _rectangle: null,

        onRegister: function() {
            this._rectangle = new Rectangle(40, 30);
        },
        getWidth: function() {
            return this._rectangle.getWidth();
        },
        setWidth: function(width) {
            this._rectangle.setWidth(width);
        },
        getHeight: function() {
            return this._rectangle.getHeight();
        },
        setHeight: function(height) {
            this._rectangle.setHeight(height);
        },
        getArea: function() {
            return this._rectangle.getArea();
        }

    },
    // STATIC MEMBERS
    {
        NAME: 'RectangleProxy'
    }
);


},{"./../domain/Rectangle.js":8,"puremvc":36}],13:[function(require,module,exports){
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
},{"GeneJS":35}],14:[function(require,module,exports){
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
},{"./SceneAction.js":13,"./SceneState.js":15,"./SceneTransition.js":16,"GeneJS":35}],15:[function(require,module,exports){
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
},{"GeneJS":35}],16:[function(require,module,exports){
var GeneJS = require('GeneJS');

// Transition 转变
var SceneTransition = GeneJS.Class({

});


exports.SceneTransition = SceneTransition;
},{"GeneJS":35}],17:[function(require,module,exports){
"use strict";

var res = require('./../ui/Resource.js').res;

var BookLayer = cc.Layer.extend({

    winSize:cc.Size(400, 300),
    onClose: null,

    book: null,

    ctor:function (space) {
        this._super();
    },

    init:function () {
        this._super();

        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            this.handleClose,
            this);

        closeItem.attr({
            x: this.winSize.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);


        var helloLabel = new cc.LabelTTF("Book", "Arial", 38);
        helloLabel.x = this.winSize.width / 2;
        helloLabel.y = this.winSize.height - 50;
        this.addChild(helloLabel, 1);

       this.showBook(this.book);

        return true;
    },

    handleClose: function(sender) {
        if (this.onClose){
            this.onClose();
        }
    },

    showBook: function(book) {
        var label = new cc.LabelTTF(book.title, "Arial", 38);
        label.x = this.winSize.width / 2;
        label.y = this.winSize.height/2 + 50;
        this.addChild(label, 1);

        label = new cc.LabelTTF(book.author, "Arial", 38);
        label.x = this.winSize.width / 2;
        label.y = this.winSize.height/2;
        this.addChild(label, 1);

        label = new cc.LabelTTF(book.publisher, "Arial", 38);
        label.x = this.winSize.width / 2;
        label.y = this.winSize.height/2 - 50;
        this.addChild(label, 1);
    }



});

exports.BookLayer = BookLayer;
},{"./../ui/Resource.js":31}],18:[function(require,module,exports){
"use strict";

var res = require('./../ui/Resource.js').res;

var DrawLayer = cc.Layer.extend({

    winSize:cc.Size(400, 300),
    onClose: null,

    rectangleWidth: 0,
    rectangleHeight: 0,
    rectangleArea: 0,

    ctor:function (space) {
        this._super();
    },

    init:function () {
        this._super();

        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            this.handleClose,
            this);

        closeItem.attr({
            x: this.winSize.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);


        var helloLabel = new cc.LabelTTF("Draw", "Arial", 38);
        helloLabel.x = this.winSize.width / 2;
        helloLabel.y = this.winSize.height - 50;
        this.addChild(helloLabel, 5);

        this.drawRectangle(this.rectangleWidth, this.rectangleHeight);

        var areaLabel = new cc.LabelTTF(this.rectangleArea, "Arial", 38);
        areaLabel.x = this.winSize.width -100;
        areaLabel.y = 100;
        this.addChild(areaLabel, 9);

        return true;
    },

    drawRectangle: function(width, height){
        var draw = new cc.DrawNode();
        this.addChild(draw, 10);

        draw.drawRect(cc.p(50, 50), cc.p(50 + width, 50 + height), null, 2, cc.color(255, 0, 255, 255));

    },

    handleClose: function(sender) {
        if (this.onClose){
            this.onClose();
        }
    }

});

exports.DrawLayer = DrawLayer;
},{"./../ui/Resource.js":31}],19:[function(require,module,exports){
"use strict";

var res = require('./../ui/Resource.js').res;

var GameLayer = cc.Layer.extend({

    winSize: cc.Size(400, 300),
    onKill: null,

    life: 0,
    _lifeLabel: null,

    ctor:function (space) {
        this._super();
    },

    init:function () {
        this._super();

        this._lifeLabel = new cc.LabelTTF();
        this._lifeLabel.fontName = "Arial";
        this._lifeLabel.fontSize = 60;
        this._lifeLabel.x = this.winSize.width / 2;
        this._lifeLabel.y = this.winSize.height / 2;
        this.addChild(this._lifeLabel, 5);

        this.showLife(this.life);

        var button = new ccui.Button();
        button.setTitleText("KILL");
        button.setTouchEnabled(true);
        button.loadTextures("res/animationbuttonnormal.png", "res/animationbuttonpressed.png", "");
        button.x = this.winSize.width / 2
        button.y = this.winSize.height / 2 -50;
        button.addTouchEventListener(this.handleKill ,this);
        this.addChild(button);

        return true;
    },

    showLife: function(life){
        this._lifeLabel.setString("LIFE:" + life)
    },

    handleKill: function(sender) {
        if (this.onKill){
            this.onKill();
        }
    }
});

exports.GameLayer = GameLayer;
},{"./../ui/Resource.js":31}],20:[function(require,module,exports){
"use strict";

var res = require('./../ui/Resource.js').res;

var GameOverLayer = cc.Layer.extend({

    winSize:cc.Size(400, 300),
    onClose: null,

    ctor:function (space) {
        this._super();
    },

    init:function () {
        this._super();

        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            this.handleClose,
            this);

        closeItem.attr({
            x: this.winSize.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);


        var helloLabel = new cc.LabelTTF("Game Over", "Arial", 80);
        helloLabel.x = this.winSize.width / 2;
        helloLabel.y = this.winSize.height / 2;
        this.addChild(helloLabel, 5);

        return true;
    },

    handleClose: function(sender) {
        if (this.onClose){
            this.onClose();
        }
    }

});

exports.GameOverLayer = GameOverLayer;
},{"./../ui/Resource.js":31}],21:[function(require,module,exports){
"use strict";

var res = require('./../ui/Resource.js').res;

var HelloLayer = cc.Layer.extend({

    winSize: cc.Size(400, 300),
    onClose: null,

    ctor:function (space) {
        this._super();
    },

    init:function () {
        this._super();

        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            this.handleClose,
            this);

        closeItem.attr({
            x: this.winSize.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);


        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        helloLabel.x = this.winSize.width / 2;
        helloLabel.y = 0;
        this.addChild(helloLabel, 5);


        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: this.winSize.width / 2,
            y: this.winSize.height / 2,
            scale: 0.5,
            rotation: 180
        });
        this.addChild(this.sprite, 0);

        this.sprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0),
                cc.scaleTo(2, 1, 1)
            )
        );

        helloLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, this.winSize.height - 40)),
                cc.tintTo(2.5, 255, 125, 0)
            )
        );
        return true;
    },

    handleClose: function(sender) {
        if (this.onClose){
            this.onClose();
        }
    }

});

exports.HelloLayer = HelloLayer;
},{"./../ui/Resource.js":31}],22:[function(require,module,exports){
"use strict";

var res = require('./../ui/Resource.js').res;

var MenuLayer = cc.Layer.extend({

    winSize: cc.Size(400, 300),

    onHello: null,
    onGame: null,
    onDraw: null,
    onBook: null,

    ctor:function (space) {
        this._super();
    },

    init:function () {
        this._super();

        var menuItem1 = new cc.MenuItemFont('Hello', this.handleHello, this);
        menuItem1.setPosition(new cc.Point(this.winSize.width/2, this.winSize.height/2+100));
        var menuItem2 = new cc.MenuItemFont('Game', this.handleGame, this);
        menuItem2.setPosition(new cc.Point(this.winSize.width/2, this.winSize.height/2+50));
        var menuItem3 = new cc.MenuItemFont('Draw', this.handleDraw, this);
        menuItem3.setPosition(new cc.Point(this.winSize.width/2, this.winSize.height/2));
        var menuItem4 = new cc.MenuItemFont('Book', this.handleBook, this);
        menuItem4.setPosition(new cc.Point(this.winSize.width/2, this.winSize.height/2-50));
        var menu = new cc.Menu( menuItem1, menuItem2, menuItem3, menuItem4);
        menu.setPosition(new cc.Point(0,0));
        this.addChild(menu);

        return true;
    },

    handleHello: function(sender) {
        if (this.onHello){
            this.onHello();
        }
    },

    handleGame: function(sender) {
        if (this.onGame){
            this.onGame();
        }
    },

    handleDraw: function(sender) {
        if (this.onDraw){
            this.onDraw();
        }
    },

    handleBook: function(sender) {
        if (this.onBook){
            this.onBook();
        }
    }

});

exports.MenuLayer = MenuLayer;
},{"./../ui/Resource.js":31}],23:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var BookLayer = require('./../component/BookLayer.js').BookLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;
var BookProxy = require('./../../model/proxy/BookProxy.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.BookMediator',
        parent: puremvc.Mediator,
        constructor: function() {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        _bookProxy: null,

        /** @override */
        listNotificationInterests: function () {
            return [ ];
        },

        /** @override */
        handleNotification: function (note) {

        },

        /** @override */
        onRegister: function () {
            this._bookProxy  = this.facade.retrieveProxy(BookProxy.NAME);
        },

        /** @override */
        onRemove: function () {

        },
        init: function() {
            var self = this;

            self.viewComponent = new BookLayer();
            self.viewComponent.winSize = cc.director.getWinSize();
            self.viewComponent.onClose = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('HOME_ACTION'));
            };

            self.viewComponent.book = this._bookProxy.getBook();

            self.viewComponent.init();
        },
        destroy: function() {
            this.viewComponent = null;
        },
        getResource: function () {
            return null;
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'BookMediator'
    }
);

},{"./../../model/proxy/BookProxy.js":10,"./../../profile/flow/SceneAction.js":13,"./../component/BookLayer.js":17,"puremvc":36}],24:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var SceneMediator = require('./SceneMediator.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.DirectorMediator',
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
                'SCENE_CHANGED'
            ];
        },

        /** @override */
        handleNotification: function (notification) {
            switch (notification.getName()) {
                case 'SCENE_CHANGED':
                    //cc.log('SCENE_CHANGED');

                    var sceneMediator = this.facade.retrieveMediator(SceneMediator.NAME );

                    if(sceneMediator && sceneMediator.getViewComponent()) {
                        cc.director.runScene(new cc.TransitionFade(1.2, sceneMediator.getViewComponent()));
                    }

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
        NAME: 'DirectorMediator'
    }
);

},{"./SceneMediator.js":30,"puremvc":36}],25:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var DrawLayer = require('./../component/DrawLayer.js').DrawLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;
var RectangleProxy = require('./../../model/proxy/RectangleProxy.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.DrawMediator',
        parent: puremvc.Mediator,
        constructor: function() {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        _rectangleProxy: null,

        /** @override */
        listNotificationInterests: function () {
            return [ ];
        },

        /** @override */
        handleNotification: function (note) {

        },

        /** @override */
        onRegister: function () {
            this._rectangleProxy  = this.facade.retrieveProxy(RectangleProxy.NAME );
        },

        /** @override */
        onRemove: function () {

        },
        init: function() {
            var self = this;

            self.viewComponent = new DrawLayer();
            self.viewComponent.winSize = cc.director.getWinSize();
            self.viewComponent.onClose = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('HOME_ACTION'));
            };

            self.viewComponent.rectangleWidth = this._rectangleProxy.getWidth();
            self.viewComponent.rectangleHeight = this._rectangleProxy.getHeight();
            self.viewComponent.rectangleArea = this._rectangleProxy.getArea();

            self._rectangleProxy.setWidth(self._rectangleProxy.getWidth() + 10);
            self._rectangleProxy.setHeight(self._rectangleProxy.getHeight() + 10);

            self.viewComponent.init();
        },
        destroy: function() {
            this.viewComponent = null;
        },
        getResource: function () {
            return null;
        }


    },
    // STATIC MEMBERS
    {
        NAME: 'DrawMediator'
    }
);

},{"./../../model/proxy/RectangleProxy.js":12,"./../../profile/flow/SceneAction.js":13,"./../component/DrawLayer.js":18,"puremvc":36}],26:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var GameLayer = require('./../component/GameLayer.js').GameLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;
var GameProxy = require('./../../model/proxy/GameProxy.js');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.GameMediator',
        parent: puremvc.Mediator,
        constructor: function() {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        _gameProxy: null,

        /** @override */
        listNotificationInterests: function () {
            return [ ];
        },

        /** @override */
        handleNotification: function (note) {

        },

        /** @override */
        onRegister: function () {
            this._gameProxy  = this.facade.retrieveProxy(GameProxy.NAME);
        },

        /** @override */
        onRemove: function () {

        },
        init: function() {
            var self = this;

            self.viewComponent = new GameLayer();
            self.viewComponent.winSize = cc.director.getWinSize();
            self.viewComponent.life = self._gameProxy.getLife();
            self.viewComponent.onKill = function() {
                var showLife = function (life) {
                    self.viewComponent.showLife(life)
                };

                self._gameProxy.decLife(showLife);
            };

            self.viewComponent.init();
        },
        destroy: function() {
            this.viewComponent = null;
        },
        getResource: function () {
            return null;
        }


    },
    // STATIC MEMBERS
    {
        NAME: 'GameMediator'
    }
);

},{"./../../model/proxy/GameProxy.js":11,"./../../profile/flow/SceneAction.js":13,"./../component/GameLayer.js":19,"puremvc":36}],27:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var GameOverLayer = require('./../component/GameOverLayer.js').GameOverLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.GameOverMediator',
        parent: puremvc.Mediator,
        constructor: function() {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        /** @override */
        listNotificationInterests: function () {
            return [ ];
        },

        /** @override */
        handleNotification: function (note) {

        },

        /** @override */
        onRegister: function () {

        },

        /** @override */
        onRemove: function () {

        },
        init: function() {
            var self = this;

            self.viewComponent = new GameOverLayer();
            self.viewComponent.winSize = cc.director.getWinSize();
            self.viewComponent.onClose = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('HOME_ACTION'));
            };


            self.viewComponent.init();
        },
        getResource: function () {
            return null;
        }


    },
    // STATIC MEMBERS
    {
        NAME: 'GameOverMediator'
    }
);

},{"./../../profile/flow/SceneAction.js":13,"./../component/GameOverLayer.js":20,"puremvc":36}],28:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var HelloLayer = require('./../component/HelloLayer.js').HelloLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.HelloMediator',
        parent: puremvc.Mediator,
        constructor: function() {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        /** @override */
        listNotificationInterests: function () {
            return [ ];
        },

        /** @override */
        handleNotification: function (note) {

        },

        /** @override */
        onRegister: function () {

        },

        /** @override */
        onRemove: function () {

        },
        init: function() {
            var self = this;

            self.viewComponent = new HelloLayer();
            self.viewComponent.winSize = cc.director.getWinSize();
            self.viewComponent.onClose = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('HOME_ACTION'));
            };

            self.viewComponent.init();
        },
        destroy: function() {
            this.viewComponent = null;
        },
        getResource: function () {
            return null;
        }


    },
    // STATIC MEMBERS
    {
        NAME: 'HelloMediator'
    }
);

},{"./../../profile/flow/SceneAction.js":13,"./../component/HelloLayer.js":21,"puremvc":36}],29:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var MenuLayer = require('./../component/MenuLayer.js').MenuLayer;
var SceneAction = require('./../../profile/flow/SceneAction.js').SceneAction;

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.MenuMediator',
        parent: puremvc.Mediator,
        constructor: function() {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        /** @override */
        listNotificationInterests: function () {
            return [ ];
        },

        /** @override */
        handleNotification: function (note) {

        },

        /** @override */
        onRegister: function () {

        },

        /** @override */
        onRemove: function () {

        },

        init: function() {
            var self = this;


            self.viewComponent = new MenuLayer();
            self.viewComponent.winSize = cc.director.getWinSize();
            self.viewComponent.onHello = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('HELLO_ACTION'));
            };
            self.viewComponent.onGame = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('GAME_ACTION'));
            };
            self.viewComponent.onDraw = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('DRAW_ACTION'));
            };
            self.viewComponent.onBook = function() {
                self.sendNotification(puremvc.statemachine.StateMachine.ACTION, null, SceneAction.$('BOOK_ACTION'));
            };

            self.viewComponent.init();
        },

        getResource: function () {

            var g_resources = require('./../ui/Resource.js').g_resources;
            return g_resources;
        }


    },
    // STATIC MEMBERS
    {
        NAME: 'MenuMediator'
    }
);

},{"./../../profile/flow/SceneAction.js":13,"./../component/MenuLayer.js":22,"./../ui/Resource.js":31,"puremvc":36}],30:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var GeneCocosJS = require('GeneCocosJS');

module.exports = puremvc.define
(
    // CLASS INFO
    {
        name: 'view.mediator.SceneMediator',
        parent: puremvc.Mediator,
        constructor: function () {
            puremvc.Mediator.call(this, this.constructor.NAME);
        }

    },
    // INSTANCE MEMBERS
    {
        _initialized: false,

        loaderImage: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAlAAD/4QMpaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM4MDBEMDY2QTU1MjExRTFBQTAzQjEzMUNFNzMxRkQwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM4MDBEMDY1QTU1MjExRTFBQTAzQjEzMUNFNzMxRkQwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU2RTk0OEM4OERCNDExRTE5NEUyRkE3M0M3QkE1NTlEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU2RTk0OEM5OERCNDExRTE5NEUyRkE3M0M3QkE1NTlEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQADQkJCQoJDQoKDRMMCwwTFhENDREWGhUVFhUVGhkUFhUVFhQZGR0fIB8dGScnKionJzk4ODg5QEBAQEBAQEBAQAEODAwOEA4RDw8RFA4RDhQVERISERUfFRUXFRUfKB0ZGRkZHSgjJiAgICYjLCwoKCwsNzc1NzdAQEBAQEBAQEBA/8AAEQgAyACgAwEiAAIRAQMRAf/EALAAAAEFAQEAAAAAAAAAAAAAAAQAAgMFBgcBAQEAAwEBAAAAAAAAAAAAAAAAAQMEAgUQAAIBAgIEBwoLBgQGAwAAAAECAwAEEQUhMRIGQVFxsTITFGGBwdEiQlKSMzWRoeFicqKyI1NzFYJjJDQWB9KjVCbxwkNkJWXik3QRAAIBAgMFBQcDBQEAAAAAAAABAhEDIRIEMUFRcTJhwVIUBZGhsSJyEzOB0ULhYpIjUxX/2gAMAwEAAhEDEQA/AMJSpUqAVKlXuFAeUq9wpUB5XuFe4V6ooDzZHDox0CnGMinzwl7Z8NajaHeoO3vmTBZBtp9YUIqTEV5ROxHKnWRnaU8VRMhFBUjpV7hSoSeUq9pUB5Sr2lhQHlKvcK8oBV7hSFSRrtaKAZs07YNPM1pG2xJIAw1jSeandry/8X4m8VCKkWwaWwam7Xl/4v1W8VLtmX/i/VbxUoKkWwakSM407tmX/i/VbxUmzGwjQsjdY41IARie/U0IbZO0kNtCXnOCkEBeFu4KI3Bs7DNb27ya+jDx3kJeEnpJJEcQVbWDsk17u5urd591ucZkWhym2Vnd9RkCDEpFxDRpbw0bunu5mlp2De2FMLYXOD2wB2xbOeraUcYGJ72mlSUiqzzdzMd3Z3mixltA2yzcK/NlHM1DQyRXce1HocdNOEfJXZ88y9ZojOqhiBszIRiHQ8Y4cK5TvHuzLljHNMqxNoDjLFraHHnjPxcNCGVbxEUzYNTx5jZSxhpW6qTzlwJ+DCvO2Zf+L9VvFSgqyHYNLYNTdssPxfibxUu15f8Ai/VPiqCakOwa82DU/a8v/F+JvFTDdWPBL8R8VKCvYRYV5UzoMAy6QdIIqI0B4KJtxiRQwou16QoGUkntH5Tz0RbZbmF2hktraSVBo2lUkY8tDye0flPPXTslVUyiyVRsjqUOA4yMT8dW2ram2m6UVTNq9S7EIyUVJydMTn/6DnP+im9Wl+g5z/opvVrpteEhQWY4AaSTwAVf5WPiZh/9S5/zj7zltzlmYWkfWXNvJDGTgGcYDHirR7i7mSbwXParsFMrgb7w6jKw/wCmnc9I14kF3vpvCljbMyWMOJL4aEiB8qU/ObUK7HYWVrl1pFZWiCOCBQqKOLjPGTrNZZqKbUXVHq2nNwTuJRk1VpbgXN8s7Rk5ym0UQQzhIG2NAjhxHWbI+gCBVjBBFbwxwQqEiiUJGg1BVGAFe7dV28WYLYZFmF2Th1UD7JGjymGyn1iK5OyzIBGB1HgrLZhamzumQAGJwSqnSCh1q3GOCodxt4cxurdcpzuN4cyhiWaF5Bg09udUmnWw1H/jV9nFuJ7Quo+8h8peThFA+047vduyMtk7fYqTl07YFdfUufMPzT5p71UdtlmYXaGS2t3mQHAsgxANdadYJopLe4QS2867EsZ4QfCNYrCFbjdDPmgkYyWFxgVf04ifJf6ScNdRUW1XBb6FU5TjF5EpSSrGu/s5lN+g5z/opvVpfoOc/wCim9WtdHnatvObJXDW7xLGhB8nrPaY9/HCr+tEdPCVaSeDoYLnqF63lzW4/PFSW3ecxbI84VSzWUwUaSdg0DXXK5nvAipnd6qgKvWnQO7pri9ZUEmm3Vl2j1kr8pRlFRyquBNZjGxQ/S56Y1S2fu9OVueon11Szahoou06QoQUXadIVCD2FJJ7R+U89dMydv8Axdn+TH9muZye0flPPXQstlK5Tbka1gUjlC1q0vVLkeb6r+O3Tx9xcY1nt8c0NrZCyiOE1108NYjGv1joo7Js1jzKyScYLIvkzL6LDwHXVJksH9Sb49dKNq0tj1jA6uriOCL+02FWX7iVtZX1/AzaHTyeoauKn2MX9W79zebiZCuR5MjSrhfXuEtwTrUeZH+yNfdrRNcxI6IzhXlJEak6WIGJ2Rw4ChWnChndtlVBLMdQA0k1gbXNMzzDfDLs6mjaPKppJbWwJ1bOwwxw43OnHh71YT3DpfWUJmFlb5jHHDdeXBHIsrRea5TSqvxqG04cNN62vetoCS4tre5mgnkGE9q+3DKOkuI2WX6LDQRRHWDh1UCtwj7QRg2wdl8Djgw1qe7XvW0BQ3kfZ7mSLgU+T9E6RVbnuVrnWVSWqj+Lt8ZbRuHEdKPkYVcZ2MJY5fSGyeVar45+rkWQHAqccalPE5km1htWK5nK4Wnt5FuUBUwOMG4nGkA/BXUrW4S6torlOjMgcd/xVn7rLo7zKs0uEjCNeSvdwoBhgsZxX1l2j36k3Lu+uyprdj5Vs5A+i/lD48a0aaVJOPi7jB6lbzWozpjB48pf1NDXNN4vfl7+Z4BXS65pvF78vfzPAK71XTHmZ/S/yT+jvJ7L3fHytz1E+upbL+Qj5W56jfXWRnsIYKLtekKEFGWvSFQgyjk9o/Keet3YthlMP/5x9msJJ7R+U89biyb/AMXEv7gD6tadL1T+kwepRrC39ZkLDMbiwMvUHRPG0bjlGg8ore/23sxBldxfMPLupNhT8yL/AORNZbdzJ484scytxgLqJY5LZj6Q2sV5G1Vud1mjjyG0ij0NEGSZToKyhjtqw4waztuiXA3qKTbSxltfGhbZlE95ZtZqxVbgiOZhrER9ph3Svk9+pJILZ4Y4DGBFCUMKjRsGPobPFhUfW0NJmljE2xJcIrcI2vFUEln1lRXd6lrazXT9GCNpD+yNqoI7mOVduNw6nzlOIoPOUa6yye1XXcbMR5GdQ3xY0BSbj31/FcTQZirJ+q431q7anbHCTZ72Bw7lbPrKBMcBWNNgbMBBh+bsjBdni0VJ1lARZs6yWiupxCuMDy6KpS2IwOo6DTr3Mre3e5tZZVUM4ZBjqOOJoWO4jkXajcOOMHGgDISvWIrdAkKR80+TzVl908bPPL3LzxOuHdifxVfiTAg92qI/w+/8gGgSyN/mR7XPVlp0lF/3L3mbVKtu5Hjbk/8AHE2Fc03i9+Xv5ngFdKNc13i9+Xv5ngFaNV0x5nn+l/kn9HeEWXu+PlbnqJ9dS2Xu9OVueon11kZ7CGCjLXpCgxRlr0hUIPYUcntH5Tz1s8vb+Bt1/dqPirGSe0flPPWusG/g4Py15q06XqlyMWvVYQ+ruI9xJOqzO9hOto/sP8tbGOFIrmWeM7IuMDMnAXXQJOUjQeOsJk0nY96ip0CYunrjaHx1t+srPJUbXBm2LrFPikwTOb+T+VhbZxGMrDXp83x1QSy2tucJpUjPETp+Cn5/ftaRvKvtp3Kx48HG3erHMzOxZiWZtLMdJNQSbbL71Vk6yynViOkqnEEfOWtPbXi3EQkGg6mXiNckjeSJxJGxR10qw0GtxuxmvbImD4CZMFlA4fRfv0BqesqqzTMZNMEDbIHtHH2QeCiZJSqMQdOGiue53mz3czQwsRbIcNHnkec3c4qAMuriz68gTIToxwOOnlp0MjxMJYW741Gs3RVldtbygE/dMcHX/moDaxTiWNZB53B3arb8/wC+4SOF4sf/AKxU9kcBsfOGHfoUHtG/RbzY5Die5HHhXdvavqiZ9Q8Jdlq4/gbKua7xe/L38zwCuhpf2Uk/Zo50kmwJKIdogDjw1VzzeL35e/meAVp1LTgqY4nn+mRauzqmqwrjzCLL3fHytz1E+upLL+Qj5W56jfXWRnroYKLtekKEFF2vSFQg9hSSe0flPPWosm/hIfoLzVl5PaPynnrRWb/w0X0F5q06XqlyM2sVYx5gmbFre/t71NY2T+0h8VbSO5SWNJUOKSAMp7jDGspmMPaLRlXS6eWve1/FRO7WYdbZm1Y/eW/R7qHxHRXGojlm3ulid6aVbaW+OALvgCLq2Hm9WxHKWqjhj6xsK1e8dm15l4niG1LZkswGsxtrPeOmsvayBJA1VItlWjptLuTdPMo7LtjRDq9naK4+WF9IrUW7BaHOljGqVHB7w2hzVoZt87d8vaNYSLl02CcRsDEbJbj71Uu7UBkvJ7/D7q2QoDxySaAO8MTXdxRVMpRp5XZOWdF/ms7R5XdyKfKWJsO/5PhrG5XlNxmEywW6bTnTxAAcJNbGSMXkM1pjgbiNo1PziPJ+Os7u7m/6ReM00ZOgxSpqYYHT3wRXMKN4ll9zUG4bQfNshu8sZVuEA2hirA4qe/VOwwrVbzbww5mI44UKRRYkbWG0S3JWctbd7u5WFfOOLHiUdJqmaipfLsIsObhWe001lMkMVvJNjhghIALMcBxCs7fxXQmkupx1bXDswGPlaTidVaEyKNXkoo4eBV+Sq7L7Vs9zcBgeyQ4GQ/MB1crmoim2orezqcowTuSeEY48jQ7oZX2PLzdyLhNd6RjrEY6I7+uspvH78vfzPAK6UAAAFGAGgAcArmu8Xvy9/M8ArTfio24RW5nnaG67uou3H/KPuqT2X8hHytz1G+upLL3enK3PUb66ys9RDBRdr0hQgou06QqEGUkntH5Tz1e238vF9BeaqKT2j8p56vbb+Xi+gvNWjTdUuRn1XTHmTh8KrJTJlt8t1CPIY44cGnpJVjTJYkmjaN9Ib4u7V923njTethRauZJV3PaW1rfLIiXEDYg6R4VYc9CXW7thfOZbKdbGZtLW8uPVY/u3GrkNUkM9zlcxUjbhfWOA90cRq4gv4LhdqN+VToNYWmnRm9NNVWNTyHc6VWBv8wt4YeHqm6xyPmroq1Z7WGFLSxTq7WLSuPSdjrkfumq5yHXDUeA92oO2SKpVumNAaoJLMXH3myp0rpJ4uKhc3tbDM5BMri1zAj79j7KTiY8TcdBpcsith0286o+sPCagEX9Pzg4zXUCp6QYse8oouCG3tk6m1BYv05W6T+IdyolxbHDAAa2OgDlNCz3ryN2WxBd5PJMg1t81eId2ukqnLlTBbfcuY+9uJLiRcvtPvHdsHK+cfRHcHDWsyawjyy0WBcDI3lTP6TeIcFV+S5OmXx9bJg1048o8Cj0V8Jq2DVu09nL80up7OxHi+oal3P8AXB/IsZS8T/YOV65zvCcc7vfzPAK3ivWCz445zeH954BXOr6I8yfSfyz+jvCLP3fHytz1G+upLP3fHytz1E+usbPaQ0UXadIUIKLtekKhB7Ckk9o/Keer22/l4/oLzVRSe0flPPV7b/y8X0F5q0abqlyM+q6Y8yQsBTDMor1o8aiaE1pbluMqS3sbLLHIhSRQyngqukhaJ9uBjo+H5aOa3ao2t34qouRlLajTalGP8v0IY8ylXQ+PKPFU/bYXOLPge6CKia0LaxTOxHu1Q7cuBd9yPEJ7TbjXKO8CajbMIF6CNIeNvJHjqIWJ7tSpYkalqVblwIdyG+RGXur0hXYJFxal+Dhq5y3slkv3Y2pD0pTr+QUClpJRUdo9XW4OLrTHtM16cZLLWkeC7y4jvlNEpcRtw1Ux27Ci448NZrTFy3nn3IQWxlgGrDZ3pza7/M8ArZo+ArF5171uvp+CqdV0R5l/psUrs2vB3hdl7vTlbnqJ9dS2Xu+PlbnqJ9dY2eshooq16QoQUXa9IVCD2FLJ7RuU89WNtmUSQqkgYMgw0accKrpPaPynnrZWG4Vi+VWmY5tnMWXG+XrIYnA0rhj0mdcTgdNdwnKDqjmduM1SRR/qlr8/4KX6pa8T/BVzDuLZXudRZblmbxXcPUNPc3KqCIwrbOzgrHEnHjoyD+3eSXkht7DeKG4umDGOJVUklfouThXfmbnZ7Cvy1vt9pmv1W1+d8FL9VteJvgq5yrcOGfLmzHN80iyyETPbptAEFo2ZG8pmUa1OFNn3Ky6W/sbDKM5hv5bx2WTZA+7RF2y52WOPJTzE+z2Dy1vt9pT/AKpacTerS/U7Tib1a04/t7kDXPY03jhN0W6sQ7K7W3q2dnrMccaDy/8At80kuZfqWYxWNtlcvUPPhiGYhWDeUy7IwYU8xPs9g8tb7faUn6pacTerTxm9oOBvVq3v9z927aynuId44LiWKNnjhAXF2UYhRg516qpsryjLr21665zFLSTaK9U2GOA87SwqY37knRU+BzOzags0s1Oyr+BKM6sxwP6tSDPLMen6vy0rvdm3Sxlu7K/S7WDDrFUDUTxgnTU826eXW7KlxmqQuwDBXUKcD+1Xee/wXuKX5XDGWLapSVcOyhEM/seJ/V+WnjeGx4pPV+Wkm6kKZlFay3Jlt7iFpYZY8ASVK6DjtDDA0f8A0Tl340/1f8Ndx8xJVWXB0KbktFFpNzdVXAC/qOwA0CQni2flrO3Vwbm5lnI2TKxbDirX/wBE5d+NcfV/wVR7xZPa5U9utvI8nWhmbbw0YEAYYAVxfhfy5rlKR4Fulu6X7mW1mzT8S4Yis/5CPlbnqJ9dSWfu9OVueon11mZvQ2i7XpChKKtekKhBlNJ7R+U89bDfGTb3a3ZX0Lcj6kdY+T2j8p560288m1kWQr6MJ+ylSAr+2cnV5renjs3H1loX+3j9XvbbtxLN9lqW4UnV5jdnjtXHxihtyZNjeSBu5J9k1BJe7xy7W5CJ/wCzuD/mTVTf2+fq97LJuLrPsNRueS7W6aJ/38x+vLVXuY+xvHaNxbf2GoCezf8A36j/APsSf8w1sLnqczTefJluYoLm5uo5F61sBshItP1cNFYe1f8A3ir/APfE/wCZUe9bB94r5jwuPsrQFhmG4l/Z2M17HdW90tuu3IkTHaCjWdIw0VVZdks9/C06yJFEp2dp+E1bbqybGTZ8vpQD7L1XRv8A7blT96Oda7tpNuuNE37Cq9KSisjyuUoxrStKllHbLlWTXsMs8chuSuwEPDqwoLe5y+YRE/gLzmqRekvKKtd4327yM/ulHxmrHJStySWVRyrjxKI2XC/CTlnlPPKTpTdFbP0L1bgrf5Lp0G3dPhQHwV0S1lzBsns3sESR8Crh9WAJGjSOKuU3E+zdZQ3oJh8IArdZXFDmOTpHa3i2+YrI2KtKy4ricBsBuHHgFXSo440+Wa2qqxjvM9uMoy+WvzWpLCWWWE28HxL6e43ojgkeSCBY1Ri5BGIUDT51cl3vm276BBqSEH4WbxV0tlkyXJcxTMb+OW6uY9mGHrCzDQwwAbTp2uKuTZ9N1uYsfRRR8WPhrm419mSSjRyiqxVK7y23B/ftuTm2oSdJyzNVw3BFn7vTlbnqF9dS2fu9OVueon11lZuQ2iLdsGFD05H2dNQGV0ntG5Tz1dWm9N1b2kVq8EVwsI2UaQaQOKhmitZGLOmk68DhSFvY+gfWNSAg7z3Qvo7yKCKIohiaNR5LKxx8qpxvjcqS0VpbxvwOAcRQPZ7D0G9Y0uz2HoH1jUCpLY7zXlpbm3eKO5QuzjrBqZji3x17PvNcyT288VvDBJbMWUovS2hslW7mFQ9nsPQPrGl2ew9A+saCod/WNxtbYsrfb17WBxx5ddD2281xC88klvDcSXEnWuzrqOGGC9zRUPZ7D0G9Y0uzWHoH1jQVCLreq6ntZbaO3it1mGy7RjTs1X2mYy20ZiCq8ZOODcdEdmsPQb1jS7PYegfWNdJuLqnQiSUlRqpFLmryxtH1Ma7Qw2gNNPOdSt0oI27p007s9h6B9Y0uz2HoH1jXX3Z+I4+1b8IJdX89xLHKQFMXQUahpxoiPN5P+onfU+A0/s9h6DesaXZ7D0D6xpG7OLbUtu0StW5JJx2bBsmbtiSiEk+cxoCWWSaVpZOk2vDVo0VYdnsPQb1jSNvZcCH1jSd2c+p1XAmFqEOmOPEfaH+BQd1ueo211IzrgFUYKNAAqI1WztCpUqVCRUqVKgFSpUqAVKlSoBUqVKgFSpUqAVKlSoBUqVKgFSpUqAVKlSoD/9k=",

        loaderText: "正在载入... ",

        loaderFont: "Arial",

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
                    cc.log(notification.getBody().name);
                    var viewMediator = this.facade.retrieveMediator(notification.getBody().name);
                    if (viewMediator) {
                        this.setView(viewMediator);
                    }
                    if (!this._initialized) {
                        this._initialized = true;
                    }

                    break;

            }
        },

        /** @override */
        onRegister: function () {

        },

        /** @override */
        onRemove: function () {

        },

        setView: function (viewMediator) {
            var self = this;

            self.viewComponent = new cc.Scene();

            viewMediator.init();

            var child = viewMediator.getViewComponent();
            if (child) {
                self.viewComponent.addChild(child);
            }

            var res = viewMediator.getResource();

            var handleSceneChanged = function () {
                self.sendNotification('SCENE_CHANGED');
            }

            if (res) {
                GeneCocosJS.LoaderScene.preload(res, handleSceneChanged, this);
            }
            else {
                handleSceneChanged();
            }
        }


    },
    // STATIC MEMBERS
    {
        NAME: 'SceneMediator',
        SCENE_CHANGE_VIEW: 'SceneChangeView'
    }
);

},{"GeneCocosJS":33,"puremvc":36}],31:[function(require,module,exports){
var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png"
};



var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

exports.res = res;
exports.g_resources = g_resources;
},{}],32:[function(require,module,exports){
var LoaderScene = cc.Scene.extend({
    _image: null,
    _text: "Loading... ",
    _font: "Arial",
    _label : null,
    _className: "GeneJS.Cocos.LoaderScene",

    init : function(image, text, font){
        var self = this;

        if (image) {
            self._image = image;
        }
        if (text) {
            self._text = text;
        }
        if (font) {
            self._font = font;
        }

        var logoWidth = 160;
        var logoHeight = 200;

        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
        bgLayer.setPosition(cc.visibleRect.bottomLeft);
        self.addChild(bgLayer, 0);

        var fontSize = 24, lblHeight =  -logoHeight / 2 + 100;

        if(self._image){
            cc.loader.loadImg(self._image, {isCrossOrigin : false }, function(err, img){
                logoWidth = img.width;
                logoHeight = img.height;
                self._initStage(img, cc.visibleRect.center);
            });
            fontSize = 14;
            lblHeight = -logoHeight / 2 - 10;
        }

        var label = self._label = new cc.LabelTTF(self._text +"0%",  self._font, fontSize);
        label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
        label.setColor(cc.color(180, 180, 180));
        bgLayer.addChild(this._label, 10);

        return true;
    },
    _initStage: function (img, centerPos) {
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        var logo = self._logo = new cc.Sprite(texture2d);
        logo.setScale(cc.contentScaleFactor());
        logo.x = centerPos.x;
        logo.y = centerPos.y;
        self._bgLayer.addChild(logo, 10);
    },
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
    },
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = self._text +"0%";
        this._label.setString(tmpStr);
    },
    initWithResources: function (resources, cb) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
    },
    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self._label.setString(self._text + percent + "%");
            }, function () {
                if (self.cb)
                    self.cb();
            });
    }
});
LoaderScene.setImage = function(image){

}

LoaderScene.preload = function(resources, cb, sender){

    if(!this.loaderScene) {
        this.loaderScene = new LoaderScene();
        this.loaderScene.init(sender.loaderImage, sender.loaderText, sender.loaderFont);
    }
    this.loaderScene.initWithResources(resources, cb);
    cc.director.runScene(this.loaderScene);
    return this.loaderScene;
};

module.exports = LoaderScene;
},{}],33:[function(require,module,exports){
var GeneCocosJS = {
    LoaderScene: require("./class/LoaderScene.js")
};

module.exports = GeneCocosJS;
},{"./class/LoaderScene.js":32}],34:[function(require,module,exports){
/*** ease.min-0.2.4.js ***/

var easejs={};
(function(B,n){var j={},h=function(b){var b=("/"===b.substr(0,1)?b:n+"/"+b).replace(/([^\/]+\/\.\.\/|\.\/|^\/)/g,""),c=j[b];if(void 0===c)throw"[ease.js] Undefined module: "+b;return c.exports};(function(b){function c(){if(!(this instanceof c))return new c;this.___$$id$$=e+f(1E8*a())}b.exports={};n="util/symbol";var a=Math.random,f=Math.floor,e=" "+String.fromCharCode(f(10*a())%31+1)+"$";c.prototype={toString:function(){return this.___$$id$$}};b.exports=c})(j["util/symbol/FallbackSymbol"]={},".");
    (function(b){function c(){if(!(this instanceof c))return new c;this._alt={}}b.exports={};n="util";(0,eval)("var _the_global=this");c.expose=function(){return _the_global};c.prototype={provideAlt:function(a,c){if(!(void 0!==_the_global[a]||void 0!==this._alt[a]))return this._alt[a]=c(),this},get:function(a){return void 0!==this._alt[a]?this._alt[a]:_the_global[a]}};b.exports=c})(j["util/Global"]={},".");(function(b){b.exports={};n="util";var c=h("./symbol/FallbackSymbol"),a=h("./Global").expose();
        b.exports=a.Symbol||c})(j["util/Symbol"]={},".");(function(b){b=b.exports={};n=".";var c={"public":1,"protected":2,"private":4,"static":8,"abstract":16,"const":32,virtual:64,override:128,proxy:256,weak:512},a={amods:c["public"]|c["protected"]|c["private"],virtual:c["abstract"]|c.virtual};b.kvals=c;b.kmasks=a;b.parseKeywords=function(b){var e=b,d=[],g=0,i={};if(1!==(d=(""+b).split(/\s+/)).length){e=d.pop();for(b=d.length;b--;){var C=d[b],r=c[C];if(!r)throw Error("Unexpected keyword for '"+e+"': "+
        C);i[C]=!0;g|=r}}e.match(/^_[^_]/)&&!(g&a.amods)&&(i["private"]=!0,g|=c["private"]);return{name:e,keywords:i,bitwords:g}}})(j.prop_parser={},".");(function(b){function c(a){throw a;}function a(a,c,b){for(var e=b.length;e--;)null===b[e].match(/^[a-z_][a-z0-9_]*$/i)&&a(SyntaxError("Member "+c+" contains invalid parameter '"+b[e]+"'"))}function f(){return g?function(a,c,b){Object.defineProperty(a,c,{value:b,enumerable:!1,writable:!1,configurable:!1})}:function(a,c,b){a[c]=b}}var e=b.exports={};n=".";
        var d=h("./prop_parser").parseKeywords,g;a:{if("function"===typeof Object.defineProperty)try{Object.defineProperty({},"x",{});g=!0;break a}catch(i){}g=!1}e.Global=h("./util/Global");e.freeze="function"===typeof Object.freeze?Object.freeze:function(){};e.definePropertyFallback=function(a){if(void 0===a)return!g;g=!a;e.defineSecureProp=f();return e};e.defineSecureProp=f();e.clone=function r(a,c){c=!!c;if(a instanceof Array){if(!c)return a.slice(0);for(var b=[],e=0,d=a.length;e<d;e++)b.push(r(a[e],c));
            return b}if("function"!==typeof a&&a instanceof Object){b={};e=Object.prototype.hasOwnProperty;for(d in a)e.call(a,d)&&(b[d]=c?r(a[d]):a[d]);return b}return a};e.copyTo=function(a,c,b){var b=!!b,d;if(!(a instanceof Object)||!(c instanceof Object))throw TypeError("Must provide both source and destination objects");if(g)for(var f in c)d=Object.getOwnPropertyDescriptor(c,f),d.get||d.set?Object.defineProperty(a,f,d):a[f]=b?e.clone(c[f],!0):c[f];else for(f in c)a[f]=b?e.clone(c[f],!0):c[f];return a};e.propParse=
            function(b,f,p){var v=function(){},i=f.each||void 0,h=f.property||v,m=f.method||v,v=f.getset||v,l=f.keywordParser||d,x=f._throw||c,j=Object.prototype.hasOwnProperty,s={},k="",s={},o=null,t=!1,u=!1,w;for(w in b)if(j.call(b,w)){if(g)k=Object.getOwnPropertyDescriptor(b,w),t=k.get,u=k.set;o="function"===typeof t?void 0:b[w];s=l(w)||{};k=s.name||w;s=s.keywords||{};if(f.assumeAbstract||s["abstract"]&&!s.override)s["abstract"]=!0,o instanceof Array||x(TypeError("Missing parameter list for abstract method: "+
                k)),a(x,k,o),o=e.createAbstractMethod.apply(this,o);i&&i.call(p,k,o,s);t||u?v.call(p,k,t,u,s):"function"===typeof o||s.proxy?m.call(p,k,o,e.isAbstractMethod(o),s):h.call(p,k,o,s)}};e.createAbstractMethod=function(a){for(var c=[],b=arguments.length;b--;)c[b]=arguments[b];b=function(){throw Error("Cannot call abstract method");};e.defineSecureProp(b,"abstractFlag",!0);e.defineSecureProp(b,"definition",c);e.defineSecureProp(b,"__length",arguments.length);return b};e.isAbstractMethod=function(a){return"function"===
            typeof a&&!0===a.abstractFlag?!0:!1};e.arrayShrink=function(a){for(var c=[],b=0,e=a.length;b<e;b++){var d=a[b];void 0!==d&&c.push(d)}return c};e.getOwnPropertyDescriptor=g&&Object.getOwnPropertyDescriptor||function(a,c){return!Object.prototype.hasOwnProperty.call(a,c)?void 0:{get:void 0,set:void 0,writable:!0,enumerable:!0,configurable:!0,value:a[c]}};e.getPrototypeOf=Object.getPrototypeOf||function(){};e.getPropertyDescriptor=function(a,c,b){var b=!!b,d=e.getOwnPropertyDescriptor(a,c),a=e.getPrototypeOf(a);
            return!d&&a&&(!b||e.getPrototypeOf(a))?e.getPropertyDescriptor(a,c,b):d};e.defineSecureProp(e.getPropertyDescriptor,"canTraverse",Object.getPrototypeOf?!0:!1)})(j.util={},".");(function(b){function c(a){if(!(this instanceof c))return new c(a);if(!(a instanceof Error))throw TypeError("Must provide exception to wrap");Error.prototype.constructor.call(this,a.message);this.message=a.message;this.name="Warning";this._error=a;this.stack=a.stack&&a.stack.replace(/^.*?\n+/,this.name+": "+this.message+"\n")}
        b.exports={};n="warn";c.prototype=Error();c.prototype.constructor=c;c.prototype.name="Warning";c.prototype.getError=function(){return this._error};b.exports=c})(j["warn/Warning"]={},".");(function(b){function c(){if(!(this instanceof c))return new c}b.exports={};n="warn";c.prototype={handle:function(){}};b.exports=c})(j["warn/DismissiveHandler"]={},".");(function(b){function c(a){if(!(this instanceof c))return new c(a);this._console=a||{}}b.exports={};n="warn";c.prototype={handle:function(a){var c=
        this._console.warn||this._console.log;c&&c.call(this._console,"Warning: "+a.message)}};b.exports=c})(j["warn/LogHandler"]={},".");(function(b){function c(){if(!(this instanceof c))return new c}b.exports={};n="warn";c.prototype={handle:function(a){throw a.getError();}};b.exports=c})(j["warn/ThrowHandler"]={},".");(function(b){b.exports={};n=".";b.exports={Warning:h("./warn/Warning"),DismissiveHandler:h("./warn/DismissiveHandler"),LogHandler:h("./warn/LogHandler"),ThrowHandler:h("./warn/ThrowHandler")}})(j.warn=
    {},".");(function(b){function c(w,a){try{if(a instanceof w)return!0}catch(c){}return!1}function a(w,a,c){a=this.defs;if(!0===o[w])throw Error(w+" is reserved");if(s.call(a,w)&&!c.weak&&!a[w].weak)throw Error("Cannot redefine method '"+w+"' in same declaration");a[w]=c}function f(a,c,b){this._cb._memberBuilder.buildProp(i(b)?this.static_members.props:this.prop_init,null,a,c,b,this.base)}function e(a,c,b,e){var d=i(e)?this.static_members.methods:this.members,k=i(e)?this.staticInstLookup:m.getMethodInstance;
        this._cb._memberBuilder.buildGetterSetter(d,null,a,c,b,e,k,this.class_id,this.base)}function d(a,c,b,e){var d=i(e),k=d?this.static_members.methods:this.members,d=d?this.staticInstLookup:m.getMethodInstance;if(!0===t[a]&&(e["protected"]||e["private"]))throw TypeError(a+" must be public");this._cb._memberBuilder.buildMethod(k,null,a,c,e,d,this.class_id,this.base,this.state)&&(b?(this.abstract_methods[a]=!0,this.abstract_methods.__length++):s.call(this.abstract_methods,a)&&!1===b&&(delete this.abstract_methods[a],
        this.abstract_methods.__length--),e.virtual&&(this.virtual_members[a]=!0))}function g(a,c,b,e){if(a.___$$abstract$$){if(!e&&0===b.__length)throw TypeError("Class "+(c||"(anonymous)")+" was declared as abstract, but contains no abstract members");}else if(0<b.__length)if(e)a.___$$abstract$$=!0;else throw TypeError("Class "+(c||"(anonymous)")+" contains abstract members and must therefore be declared abstract");}function i(a){return a["static"]||a["const"]?!0:!1}function C(a,c){var b=c.__cid?m.getMeta(c):
        void 0;return b?a[u].meta=l.clone(b,!0):a[u].meta={implemented:[]}}function r(a,c){l.defineSecureProp(a,"__iid",c)}function y(a){var c=function(){};c.prototype=a;l.defineSecureProp(a,u,{});a[u].vis=new c}function p(a){var c=function(c){return b.exports.isInstanceOf(c,a)};l.defineSecureProp(a,"isInstanceOf",c);l.defineSecureProp(a,"isA",c)}function v(a,c){var b=0<c.__length?!0:!1;l.defineSecureProp(a,"isAbstract",function(){return b})}function j(a,c){l.defineSecureProp(a,"__cid",c);l.defineSecureProp(a.prototype,
        "__cid",c)}function A(a,c){a.___$$final$$=!!c.___$$final$$;a.___$$abstract$$=!!c.___$$abstract$$;c.___$$final$$=c.___$$abstract$$=void 0}var m=b.exports={};n=".";var l=h("./util"),x=h("./warn").Warning,q=h("./util/Symbol"),s=Object.prototype.hasOwnProperty,k=!1===Object.prototype.propertyIsEnumerable.call({toString:function(){}},"toString")?!0:!1,o={__initProps:!0,constructor:!0},t={__construct:!0,__mixin:!0,toString:!0,__toString:!0},u=q();b.exports=m=function(a,c,e){if(!(this instanceof m))return new b.exports(a,
        c,e);this._warnHandler=a;this._memberBuilder=c;this._visFactory=e;this._instanceId=this._classId=0;this._spropInternal=this._extending=!1};m.ClassBase=function(){};l.defineSecureProp(m.ClassBase,"__cid",0);m.ClassBase.$=function(a,c){if(void 0!==c)throw ReferenceError("Cannot set value of undeclared static property '"+a+"'");};m.getReservedMembers=function(){return l.clone(o,!0)};m.getForcedPublicMethods=function(){return l.clone(t,!0)};m.getMeta=function(a){return(a[u]||{}).meta||null};m.isInstanceOf=
        function(a,b){return!a||!b?!1:!!(a.__isInstanceOf||c)(a,b)};m.prototype.build=function(a,c){var b=this;this._extending=!0;var e=arguments,d=e.length,f=(0<d?e[d-1]:0)||{},t=(1<d?e[d-2]:0)||m.ClassBase,e=this._getBase(t),d="",o=!1,r=this._memberBuilder.initMembers(),p=this._memberBuilder.initMembers(e),i={methods:this._memberBuilder.initMembers(),props:this._memberBuilder.initMembers()},o=m.getMeta(t)||{},y=l.clone(o.abstractMethods)||{__length:0},s=l.clone(o.virtualMembers)||{};if(!0===t.___$$final$$)throw Error("Cannot extend final class "+
        (t[u].meta.name||"(anonymous)"));(d=f.__name)&&delete f.__name;void 0!==(o=f.___$$auto$abstract$$)&&delete f.___$$auto$abstract$$;if(k&&f.toString!==Object.prototype.toString)f.__toString=f.toString;this._classId++;void 0===(e[u]||{}).vis&&this._discoverProtoProps(e,r);try{this.buildMembers(f,this._classId,t,r,{all:p,"abstract":y,"static":i,virtual:s},function(){return q.___$$svis$$})}catch(h){if(h instanceof x)this._warnHandler.handle(h);else throw h;}e.___$$parent$$=t.prototype;var q=this.createCtor(d,
        y,p);this.initStaticVisibilityObj(q);var n=this,B=function(a,c){n.attachStatic(a,i,t,c)};B(q,!1);this._attachPropInit(e,r,p,q,this._classId);q.prototype=e;q.prototype.constructor=q;q.___$$props$$=r;q.___$$methods$$=p;q.___$$sinit$$=B;A(q,f);g(q,d,y,o);l.defineSecureProp(e,"__self",q.___$$svis$$);o=C(q,t);o.abstractMethods=y;o.virtualMembers=s;o.name=d;v(q,y);j(q,this._classId);q.asPrototype=function(){b._extending=!0;var a=q();b._extending=!1;return a};this._extending=!1;return q};m.prototype._getBase=
        function(a){switch(typeof a){case "function":return new a;case "object":return a}throw TypeError("Must extend from Class, constructor or object");};m.prototype._discoverProtoProps=function(a,c){var b=Object.hasOwnProperty,e;for(e in a){var d=a[e];b.call(a,e)&&"function"!==typeof d&&this._memberBuilder.buildProp(c,null,e,d,{})}};m.prototype.buildMembers=function(c,b,k,t,u,C){var o={_cb:this,prop_init:t,class_id:b,base:k,staticInstLookup:C,defs:{},state:{},members:u.all,abstract_methods:u["abstract"],
        static_members:u["static"],virtual_members:u.virtual},g={each:a,property:f,getset:e,method:d};if(c.___$$parser$$){var r=c.___$$parser$$;delete c.___$$parser$$;b=function(a,c){g[a]=function(){for(var b=[],e=arguments.length;e--;)b[e]=arguments[e];b.push(c);r[a].apply(o,b)}};r.each&&b("each",g.each);r.property&&b("property",g.property);r.getset&&b("getset",g.getset);r.method&&b("method",g.method)}l.propParse(c,g,o);this._memberBuilder.end(o.state)};m.prototype.createCtor=function(a,c,b){a=0===c.__length?
        this.createConcreteCtor(a,b):this.createAbstractCtor(a);l.defineSecureProp(a,u,{});return a};m.prototype.createConcreteCtor=function(a,c){function b(){if(!(this instanceof b))return e=arguments,new b;y(this);this.__initProps();if(!d._extending){r(this,++d._instanceId);var k="function"===typeof this.___$$ctor$pre$$;k&&b.prototype.hasOwnProperty("___$$ctor$pre$$")&&(this.___$$ctor$pre$$(u),k=!1);"function"===typeof this.__construct&&this.__construct.apply(this,e||arguments);k&&this.___$$ctor$pre$$(u);
        "function"===typeof this.___$$ctor$post$$&&this.___$$ctor$post$$(u);e=null;p(this);if(!s.call(c["public"],"toString"))this.toString=c["public"].__toString||(a?function(){return"#<"+a+">"}:function(){return"#<anonymous>"})}}var e=null,d=this;b.toString=a?function(){return a}:function(){return"(Class)"};return b};m.prototype.createAbstractCtor=function(a){var c=this,b=function(){if(!c._extending)throw Error("Abstract class "+(a||"(anonymous)")+" cannot be instantiated");};b.toString=a?function(){return a}:
        function(){return"(AbstractClass)"};return b};m.prototype._attachPropInit=function(a,c,b,e,d){var k=this;l.defineSecureProp(a,"__initProps",function(e){var e=!!e,f=a.___$$parent$$,t=this[u].vis,f=f&&f.__initProps;"function"===typeof f&&f.call(this,!0);f=k._visFactory.createPropProxy(this,t,c["public"]);t=t[d]=k._visFactory.setup(f,c,b);e||l.defineSecureProp(t,"__inst",this)})};m.prototype.initStaticVisibilityObj=function(a){var c=this,b=function(){};b.prototype=a;b=new b;a.___$$svis$$=b;b.$=function(){c._spropInternal=
        !0;var b=a.$.apply(a,arguments);c._spropInternal=!1;return b}};m.prototype.attachStatic=function(a,c,b,e){var d=c.methods,k=c.props,f=this;(c=b.___$$sinit$$)&&c(a,!0);if(!e)a.___$$sprops$$=k,l.defineSecureProp(a,"$",function(c,e){var d=!1,t=this.___$$sprops$$?this:a,u=t!==a,d=s.call(k["public"],c)&&"public";!d&&f._spropInternal&&(d=s.call(k["protected"],c)&&"protected"||!u&&s.call(k["private"],c)&&"private");if(!1===d)return(b.__cid&&b.$||m.ClassBase.$).apply(t,arguments);d=k[d][c];if(1<arguments.length){if(d[1]["const"])throw TypeError("Cannot modify constant property '"+
        c+"'");d[0]=e;return t}return d[0]});l.copyTo(a,d["public"],!0);l.copyTo(a.___$$svis$$,d["protected"],!0);e||l.copyTo(a.___$$svis$$,d["private"],!0)};m.getMethodInstance=function(a,c){if(void 0===a)return null;var b=a[u],e;return a.__iid&&b&&(e=b.vis)?e[c]:null}})(j.ClassBuilder={},".");(function(b){var c=b.exports={};n=".";b.exports=c=function(a){if(!(this instanceof c))return new b.exports(a);this._factory=a};c.prototype.wrapMethod=function(a,c,b,d,g,i){return this._factory(a,c,b,d,g,i)}})(j.MethodWrapperFactory=
    {},".");(function(b){b=b.exports={};n=".";b.standard={wrapOverride:function(c,a,b,e){var d=function(){var d=e(this,b)||this||{},i=void 0,C=d.__super;d.__super=a;i=c.apply(d,arguments);d.__super=C;return i===d?this:i};d["super"]=a;return d},wrapNew:function(c,a,b,e){return function(){var a=e(this,b)||this,g=void 0,g=c.apply(a,arguments);return g===a?this:g}},wrapProxy:function(c,a,b,e,d,g){var i=g&&g["static"],a=function(){var a=e(this,b)||this,r=void 0,a=i?a.$(c):a[c];if(!(null!==a&&"object"===typeof a&&
        "function"===typeof a[d]))throw TypeError("Unable to proxy "+d+"() call to '"+c+"'; '"+c+"' is undefined or '"+d+"' is not a function.");r=a[d].apply(a,arguments);return r===a?this:r};a.__length=NaN;return a}}})(j.MethodWrappers={},".");(function(b){function c(a){return function(){return this.___$$super$$.prototype[a].apply(this.___$$pmo$$,arguments)}}function a(a,c,b){if(c["private"])return(c["public"]||c["protected"])&&f(b),a["private"];if(c["protected"])return(c["public"]||c["private"])&&f(b),
        a["protected"];(c["private"]||c["protected"])&&f(b);return a["public"]}function f(a){throw TypeError("Only one access modifier may be used for definition of '"+a+"'");}function e(a,c,b){for(var d=i.length,f=null;d--;)if(f=g.getPropertyDescriptor(a[i[d]],c,!0))return{get:f.get,set:f.set,member:f.value};return void 0!==b?(a=b.___$$methods$$,d=b.___$$props$$,b=((b.prototype||{}).___$$parent$$||{}).constructor,a&&e(a,c,b)||d&&e(d,c,b)||null):null}var d=b.exports={};n=".";var g=h("./util"),i=["public",
        "protected","private"];b.exports=function(a,c,e,d){if(!(this instanceof b.exports))return new b.exports(a,c,e,d);this._wrapMethod=a;this._wrapOverride=c;this._wrapProxy=e;this._validate=d};d=b.exports.prototype;d.initMembers=function(a,c,b){return{"public":a||{},"protected":c||{},"private":b||{}}};d.buildMethod=function(b,d,f,g,i,h,j,m,l){var x=this._methodKeywordDefaults,x=(d=(m=e(b,f,m))?m.member:null)&&(d.___$$keywords$$||x),b=a(b,i,f);this._validate.validateMethod(f,g,i,m,x,l);if(i.proxy&&(!d||
        !i.weak))b[f]=this._createProxy(g,h,j,f,i);else if(d){if(i.weak&&!x["abstract"])return!1;if(i.override||x["abstract"])l=i["abstract"]?c(f):d,b[f]=this._overrideMethod(l,g,h,j);else throw Error("Method hiding not yet implemented (we should never get here; bug).");}else b[f]=i["abstract"]||i["private"]?g:this._overrideMethod(null,g,h,j);b[f].___$$keywords$$=i;return!0};d._methodKeywordDefaults={virtual:!0};d.buildProp=function(c,b,d,f,g,i){i=(b=e(c,d,i))?b.member:null;this._validate.validateProperty(d,
        f,g,b,i?i[1]:null);a(c,g,d)[d]=[f,g]};d.buildGetterSetter=function(c,b,d,f,g,i,h,j,l){b=e(c,d,l);this._validate.validateGetterSetter(d,{},i,b,b&&b.get?b.get.___$$keywords$$:null);if(f)f=this._overrideMethod(null,f,h,j),f.___$$keywords$$=i;Object.defineProperty(a(c,i,d),d,{get:f,set:g?this._overrideMethod(null,g,h,j):g,enumerable:!0,configurable:!1})};d._createProxy=function(a,c,b,d,e){return this._wrapProxy.wrapMethod(a,null,b,c,d,e)};d._overrideMethod=function(a,c,b,d){var e=null,e=(a?this._wrapOverride:
        this._wrapMethod).wrapMethod(c,a,d,b||function(){});g.defineSecureProp(e,"__length",c.__length||c.length);return e};d._getVisibilityValue=function(a){return a["protected"]?1:a["private"]?2:0};d.end=function(a){this._validate&&this._validate.end(a)}})(j.MemberBuilder={},".");(function(b){var c=b.exports={};n=".";b.exports=c=function(a){if(!(this instanceof b.exports))return new b.exports(a);this._warningHandler=a||function(){}};c.prototype._initState=function(a){if(a.__vready)return a;a.warn={};a.__vready=
        !0;return a};c.prototype.end=function(a){for(var c in a.warn){var b=a.warn[c],d;for(d in b)this._warningHandler(b[d])}a.__vready=!1};c.prototype.validateMethod=function(a,c,b,d,g,i){this._initState(i);var h=d?d.member:null;if(b["abstract"]&&b["private"])throw TypeError("Method '"+a+"' cannot be both private and abstract");if(b["const"])throw TypeError("Cannot declare method '"+a+"' as constant; keyword is redundant");if(b.virtual&&b["static"])throw TypeError("Cannot declare static method '"+a+"' as virtual");
        if(d&&(d.get||d.set))throw TypeError("Cannot override getter/setter '"+a+"' with method");if(b.proxy){if("string"!==typeof c)throw TypeError("Cannot declare proxy method '"+a+"'; string value expected");if(b["abstract"])throw TypeError("Proxy method '"+a+"' cannot be abstract");}if(h){if(g["private"])throw TypeError("Private member name '"+a+"' conflicts with supertype");if("function"!==typeof h)throw TypeError("Cannot override property '"+a+"' with method");if(b.override&&!g.virtual){if(!b["abstract"])throw TypeError("Cannot override non-virtual method '"+
            a+"'");if(!g["abstract"])throw TypeError("Cannot perform abstract override on non-abstract method '"+a+"'");}if(b["abstract"]&&!b.weak&&!g["abstract"])throw TypeError("Cannot override concrete method '"+a+"' with abstract method");d=void 0===h.__length?h.length:h.__length;c=void 0===c.__length?c.length:c.__length;b.proxy&&(c=NaN);b.weak&&!g["abstract"]&&(h=d,d=c,c=h);if(c<d)throw TypeError("Declaration of method '"+a+"' must be compatible with that of its supertype");if(this._getVisibilityValue(g)<
            this._getVisibilityValue(b))throw TypeError("Cannot de-escalate visibility of method '"+a+"'");if(!b.override&&!g["abstract"]&&!b.weak)throw TypeError("Attempting to override method '"+a+"' without 'override' keyword");b.weak&&g.override&&delete (i.warn[a]||{}).no}else if(b.override)(i.warn[a]=i.warn[a]||{}).no=Error("Method '"+a+"' using 'override' keyword without super method")};c.prototype.validateProperty=function(a,c,b,d,g){if(c=d?d.member:null){if(g["private"])throw TypeError("Private member name '"+
        a+"' conflicts with supertype");if("function"===typeof c)throw new TypeError("Cannot override method '"+a+"' with property");if(this._getVisibilityValue(g)<this._getVisibilityValue(b))throw TypeError("Cannot de-escalate visibility of property '"+a+"'");}if(d&&(d.get||d.set))throw TypeError("Cannot override getter/setter '"+a+"' with property");if(b["abstract"])throw TypeError("Property '"+a+"' cannot be declared as abstract");if(b["static"]&&b["const"])throw TypeError("Static keyword cannot be used with const for property '"+
        a+"'");if(b.virtual)throw TypeError("Cannot declare property '"+a+"' as virtual");};c.prototype.validateGetterSetter=function(a,c,b,d,g){c=d?d.member:null;d=d&&(d.get||d.set)?!0:!1;if(b["abstract"])throw TypeError("Cannot declare getter/setter '"+a+"' as abstract");if(b["const"])throw TypeError("Cannot declare const getter/setter '"+a+"'");if(b.virtual&&b["static"])throw TypeError("Cannot declare static method '"+a+"' as virtual");if(c||d){if(g&&g["private"])throw TypeError("Private member name '"+
        a+"' conflicts with supertype");if(!d)throw TypeError("Cannot override method or property '"+a+"' with getter/setter");if(!g||!g.virtual)throw TypeError("Cannot override non-virtual getter/setter '"+a+"'");if(!b.override)throw TypeError("Attempting to override getter/setter '"+a+"' without 'override' keyword");if(this._getVisibilityValue(g||{})<this._getVisibilityValue(b))throw TypeError("Cannot de-escalate visibility of getter/setter '"+a+"'");}else b.override&&this._warningHandler(Error("Getter/setter '"+
        a+"' using 'override' keyword without super getter/setter"))};c.prototype._getVisibilityValue=function(a){return a["protected"]?1:a["private"]?2:0}})(j.MemberBuilderValidator={},".");(function(b){var c=b.exports={};n=".";var a=h("./util");b.exports=c=function(){if(!(this instanceof c))return new b.exports};c.prototype.setup=function(a,b,c){var g=this._createPrivateLayer(a,b);this._doSetup(a,b["public"]);this._doSetup(a,b["protected"],c["protected"],!0);this._doSetup(g,b["private"],c["private"]);return g};
        c.prototype._createPrivateLayer=function(a,b){var c=function(){};c.prototype=a;c=new c;this.createPropProxy(a,c,b["protected"]);return c};c.prototype._doSetup=function(b,c,d,g){var i=Array.prototype.hasOwnProperty;if(void 0!==d)for(var h in d)if(i.call(d,h)){var j=b[h],n=j&&j.___$$keywords$$;if(!g||void 0===j||n["private"]||n["protected"])b[h]=d[h]}for(var p in c)i.call(c,p)&&(b[p]=a.clone(c[p][0]))};c.prototype.createPropProxy=function(a,b,c){var g=Object.prototype.hasOwnProperty,i;for(i in c)g.call(c,
            i)&&function(c){b[c]=void 0;Object.defineProperty(b,c,{set:function(b){a[c]=b},get:function(){return a[c]},enumerable:!0})}.call(null,i);return b}})(j.VisibilityObjectFactory={},".");(function(b){var c=b.exports={};n=".";b.exports=c=function(){if(!(this instanceof c))return new b.exports};c.prototype=h("./VisibilityObjectFactory")();c.prototype._createPrivateLayer=function(a){return a};c.prototype.createPropProxy=function(a){return a}})(j.FallbackVisibilityObjectFactory={},".");(function(b){b=b.exports=
    {};n=".";var c=h("./util"),a=h("./VisibilityObjectFactory"),f=h("./FallbackVisibilityObjectFactory");b.fromEnvironment=function(){return c.definePropertyFallback()?f():a()}})(j.VisibilityObjectFactoryFactory={},".");(function(b){function c(a){if(1<arguments.length)throw Error("Expecting one argument for anonymous Class definition; "+arguments.length+" given.");return i(a)}function a(a,c){if(2<arguments.length)throw Error("Expecting at most two arguments for definition of named Class '"+a+"'; "+arguments.length+
        " given.");if(void 0===c)return f(a);if("object"!==typeof c)throw TypeError("Unexpected value for definition of named Class '"+a+"'; object expected");c.__name=a;return i(c)}function f(a){return{extend:function(){for(var c=[],b=arguments.length;b--;)c[b]=arguments[b];c[c.length-1].__name=a;return i.apply(null,c)},implement:function(){for(var c=[],b=arguments.length;b--;)c[b]=arguments[b];return e(null,c,a)},use:function(){for(var a=[],c=arguments.length;c--;)a[c]=arguments[c];return d(q,a)}}}function e(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    c,b){var e={extend:function(){var d=arguments.length,e=arguments[d-1],k=1<d?arguments[d-2]:null;if(2<d)throw Error("Expecting no more than two arguments for extend()");if(a&&k)throw Error("Cannot override parent "+a.toString()+" with "+k.toString()+" via extend()");if(b)e.__name=b;c.push(a||k||i({}));return i.call(null,o.apply(this,c),e)},use:function(){for(var a=[],c=arguments.length;c--;)a[c]=arguments[c];return d(function(){return e.__createBase()},a)},__createBase:function(){return e.extend({})}};
        return e}function d(a,c,b){var e=function(){if(!b)throw TypeError("Cannot instantiate incomplete class definition; did you forget to call `extend'?");return g(a(),c).apply(null,arguments)};e.extend=function(){var b=arguments.length,d=arguments[b-1],b=1<b?arguments[b-2]:null,e=a();return i.call(null,g(e||b,c),d)};e.use=function(){for(var a=[],c=arguments.length;c--;)a[c]=arguments[c];return d(function(){return e.__createBase()},a,b)};e.__createBase=function(){return e.extend({})};return e}function g(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                c){for(var b={___$$auto$abstract$$:!0},d=[],e=0,k=c.length;e<k;e++)c[e].__mixin(b,d,a||z.ClassBase);b=i.call(null,a,b);d=z.getMeta(b).implemented;e=0;for(k=c.length;e<k;e++)d.push(c[e]),c[e].__mixinImpl(d);return b}function i(a,c){for(var b=[],d=arguments.length;d--;)b[d]=arguments[d];b=x.build.apply(x,b);j(b);r(b);y(b);v.freeze(b);return b}function j(a){v.defineSecureProp(a,"extend",function(a){return i(this,a)})}function r(a){v.defineSecureProp(a,"implement",function(){for(var c=[],b=arguments.length;b--;)c[b]=
        arguments[b];return e(a,c)})}function y(a){v.defineSecureProp(a,"use",function(){for(var c=[],b=arguments.length;b--;)c[b]=arguments[b];return d(function(){return a},c,!0)})}b.exports={};n=".";var p="undefined"!==typeof console?console:void 0,v=h("./util"),z=h("./ClassBuilder"),A=h("./warn"),m=A.Warning,l=A.LogHandler(p),p=h("./MethodWrapperFactory"),A=h("./MethodWrappers").standard,x=z(l,h("./MemberBuilder")(p(A.wrapNew),p(A.wrapOverride),p(A.wrapProxy),h("./MemberBuilderValidator")(function(a){l.handle(m(a))})),
        h("./VisibilityObjectFactoryFactory").fromEnvironment()),q=function(){return null};b.exports=function(b,d){for(var e=typeof b,k=null,k=[],f=arguments.length;f--;)k[f]=arguments[f];switch(e){case "object":k=c.apply(null,k);break;case "string":k=a.apply(null,k);break;default:throw TypeError("Expecting anonymous class definition or named class definition");}return k};b.exports.extend=i;b.exports.implement=function(a){return e(null,Array.prototype.slice.call(arguments))};b.exports.use=function(a){for(var b=
        [],c=arguments.length;c--;)b[c]=arguments[c];return d(q,b)};var s={prototype:{}},k={constructor:{prototype:{}}};b.exports.isClass=function(a){a=a||s;if(!a.prototype)return!1;var c=z.getMeta(a);return null!==c&&c.implemented||a.prototype instanceof z.ClassBase?!0:!1};b.exports.isClassInstance=function(a){a=a||k;return b.exports.isClass(a.constructor)};b.exports.isInstanceOf=z.isInstanceOf;b.exports.isA=b.exports.isInstanceOf;var o=function(a,c){for(var d=arguments.length,e={},k=arguments[d-1],f=null,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                g=[],o=!1,i=0;i<d-1;i++)f=arguments[i],v.propParse(f.prototype,{method:function(a,c){e["abstract "+a]=c.definition;o=!0}}),g.push(f);if(o)e.___$$abstract$$=!0;d=b.exports.extend(k,e);z.getMeta(d).implemented=g;return d}})(j["class"]={},".");(function(b){function c(a){if("object"===typeof a)a.___$$abstract$$=!0}function a(b){var e=b.extend,f=b.implement,h=b.use;f&&(b.implement=function(){return a(f.apply(this,arguments))});h&&(b.use=function(){return a(h.apply(this,arguments))});b.extend=function(){c(arguments[arguments.length-
        1]);return e.apply(this,arguments)};b.__createBase=function(){return e({___$$auto$abstract$$:!0})};return b}var f=b.exports={};n=".";var e=h("./class");b.exports=f=function(){c(arguments[arguments.length-1]);var b=e.apply(this,arguments);e.isClass(b)||a(b);return b};f.extend=function(){c(arguments[arguments.length-1]);return e.extend.apply(this,arguments)};f.use=function(){return a(e.use.apply(this,arguments))};f.implement=function(){return a(e.implement.apply(this,arguments))}})(j.class_abstract=
    {},".");(function(b){function c(){}function a(a){if(1<arguments.length)throw Error("Expecting one argument for Interface definition; "+arguments.length+" given.");return l(a)}function f(a,b){if(2<arguments.length)throw Error("Expecting two arguments for definition of named Interface '"+a+"'; "+arguments.length+" given.");if("object"!==typeof b)throw TypeError("Unexpected value for definition of named Interface '"+a+"'; object expected");b.__name=a;return l(b)}function e(a,b){b.message="Failed to define interface "+
        (a?a:"(anonymous)")+": "+b.message;throw b;}function d(a){p.defineSecureProp(a,"extend",function(a){return l(this,a)})}function g(a,b){a.toString=b?function(){return"[object Interface <"+b+">]"}:function(){return"[object Interface]"}}function i(a){p.defineSecureProp(a,"isCompatible",function(b){return 0===j(a,b).length})}function j(a,b){var c=[];p.propParse(a.prototype,{method:function(a,d){"function"!==typeof b[a]?c.push([a,"missing"]):b[a].length<d.__length&&c.push([a,"incompatible"])}});return c}
        function r(a){p.defineSecureProp(a,"__isInstanceOf",function(a,b){return y(a,b)})}function y(a,b){var c=b.constructor,d;if(!b.__cid||!(d=m.getMeta(c)))return 0===j(a,b).length;c=d.implemented;for(d=c.length;d--;)if(c[d]===a)return!0;return!1}b.exports={};n=".";var p=h("./util"),v=h("./MethodWrapperFactory"),z=h("./MethodWrappers").standard,A=h("./MemberBuilder")(v(z.wrapNew),v(z.wrapOverride),v(z.wrapProxy),h("./MemberBuilderValidator")());h("./class");var m=h("./ClassBuilder");b.exports=function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              c){var d=null;switch(typeof b){case "object":d=a.apply(null,arguments);break;case "string":d=f.apply(null,arguments);break;default:throw TypeError("Expecting anonymous interface definition or named interface definition");}return d};b.exports.extend=function(){return l.apply(this,arguments)};b.exports.isInterface=function(a){a=a||{};return a.prototype instanceof c?!0:!1};var l=function(a){function b(c){return function(){if(!a)throw Error("Interface "+(c?c+" ":"")+" cannot be instantiated");}}return function(){a=
            !0;var f=arguments,k=f.length,o=(0<k?f[k-1]:0)||{},f=new ((1<k?f[k-2]:0)||c),h="",j={},w=A.initMembers(f,f,f);(h=o.__name)&&delete o.__name;if(!(f instanceof c))throw new TypeError("Interfaces may only extend other interfaces");k=b(h);p.propParse(o,{assumeAbstract:!0,_throw:function(a){e(h,a)},property:function(){e(h,TypeError("Unexpected internal error"))},getset:function(){e(h,TypeError("Unexpected internal error"))},method:function(a,b,c,d){(d["protected"]||d["private"])&&e(h,TypeError("Member "+
            a+" must be public"));A.buildMethod(w,null,a,b,d,null,0,{},j)}});d(k);g(k,h);i(k);r(k);k.prototype=f;k.constructor=k;p.freeze(k);a=!1;return k}}(!1);b.exports.isInstanceOf=y})(j["interface"]={},".");(function(b){function c(){}function a(){switch(arguments.length){case 0:throw Error("Missing trait name or definition");case 1:return"string"===typeof arguments[0]?e.apply(this,arguments):a.extend.apply(this,arguments);case 2:return f.apply(this,arguments)}throw Error("Expecting at most two arguments for definition of named Trait "+
        name+"'; "+arguments.length+" given");}function f(b,c){if("string"!==typeof b)throw Error("First argument of named class definition must be a string");c.__name=b;return a.extend(c)}function e(a){return{extend:function(b){return f(a,b)},implement:function(){return j(arguments,a)}}}function d(a,b,c,d){if("__construct"===a)throw Error("Traits may not define __construct");if(c["static"])throw Error("Cannot define member `"+a+"'; static trait members are currently unsupported");d.apply(this,arguments)}
        function g(a,b,c,d){if("___"!==a.substr(0,3)){if(!c["private"])throw Error("Cannot define property `"+a+"'; only private properties are permitted within Trait definitions");d.apply(this,arguments)}}function i(a){throw Error("Cannot define property `"+a+"'; getters/setters are currently unsupported");}function j(b,c){return{extend:function(d){if(c)d.__name=c;return a.extend.call({__$$meta:{ifaces:b}},d)}}}function r(a){var b={"protected ___$$pmo$$":null,"protected ___$$super$$":null,__construct:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    b){this.___$$super$$=a;this.___$$pmo$$=b},__name:"#ConcreteTrait#"},c=q.getMeta(a).abstractMethods,d;for(d in c)Object.hasOwnProperty.call(c,d)&&"__"!==d.substr(0,2)&&(b[(void 0!==a.___$$methods$$["public"][d]?"public":"protected")+" proxy "+d]="___$$pmo$$");y(a,b);return a.extend(b)}function y(a,b){var c=q.getMeta(a).virtualMembers,d;for(d in c){var e=void 0!==a.___$$methods$$["public"][d]?"public":"protected",f=a.___$$methods$$[e][d],g=f.__length;b[e+" virtual override "+d]=function(a){var b=function(){var b=
            this.___$$pmo$$,c=b[a];return c?c.apply(b,arguments):this.__super.apply(this,arguments)};b.__length=g;return b}(d);b[e+" virtual __$$"+d]=function(a){var b=function(){return a.apply(this,arguments)};b.__length=g;return b}(f)}}function p(a,b,d,e){var f=a.__acls,a=A(a,b,d,e);b["weak virtual ___$$ctor$pre$$"]=c;b["weak virtual ___$$ctor$post$$"]=c;e===q.ClassBase?(b["virtual override ___$$ctor$post$$"]=l,b["virtual override ___$$ctor$pre$$"]=c):(b["virtual override ___$$ctor$post$$"]=c,b["virtual override ___$$ctor$pre$$"]=
            l);v(f,b,a);return b}function v(a,b,c){a=a.___$$methods$$;z(a["public"],b,"public",c);z(a["protected"],b,"protected",c);(a=a["public"].___$$parent$$)&&a.constructor!==q.ClassBase&&v(a.constructor,b,c)}function z(a,b,c,d){for(var e in a)if(Object.hasOwnProperty.call(a,e)&&"__mixin"!==e&&a[e].___$$keywords$$){var f=a[e].___$$keywords$$,c=f["protected"]?"protected":"public";if(f["abstract"]&&!f.override)b[c+" weak abstract "+e]=a[e].definition;else{var g=f.virtual,c=(g?"":"proxy ")+(g?"virtual ":"")+
            (f.override?"override ":"")+c+" "+e;if(void 0!==b[c])throw Error("Trait member conflict: `"+e+"'");b[c]=f.virtual?function(b){var c=function(){var a=this[d],c=a["__$$"+b].apply(a,arguments);return c===a?this:c};c.__length=a[b].__length;return c}(e):d}}}function A(a,b,c,d){var e="___$to$"+a.__acls.__cid+"$"+d.__cid;c.push([e,a]);b["private "+e]=null;void 0===b.___$$tctor$$&&(b["weak virtual ___$$tctor$$"]=function(){},b["virtual override ___$$tctor$$"]=m(c,d));return e}function m(a,b){return function(c){for(var d in a){var e=
            a[d][0],f=a[d][1],g=f.__ccls||(f.__ccls=r(f.__acls));this[e]=g(b,this[c].vis)[c].vis;this[e].__mixin&&this[e].__mixin.apply(this[e],f.___$$mixinargs)}this.__super&&this.__super(c)}}function l(){this.___$$tctor$$.apply(this,arguments)}b.exports={};n=".";var x=h("./class_abstract"),q=h("./ClassBuilder"),s=h("./interface");a.extend=function(a){var b=(this||{}).__$$meta||{},c=a.__name||"(Trait)",e="function"===typeof a.__mixin?"param":"std";a.___$$parser$$={each:d,property:g,getset:i};a.___$$auto$abstract$$=
            !0;a.__name="#AbstractTrait#";var f="param"===e?function(){for(var a=[],b=arguments.length;b--;)a[b]=arguments[b];var c=function(){throw Error("Cannot re-configure argument trait");};c.___$$mixinargs=a;c.__trait="arg";c.__acls=f.__acls;c.__ccls=f.__ccls;c.toString=f.toString;c.__mixinImpl=f.__mixinImpl;c.__isInstanceOf=f.__isInstanceOf;c.__mixin=function(a,b,d){p(c,a,b,d)};return c}:function(){throw Error("Cannot instantiate non-parameterized trait");},h=x;b.ifaces&&(h=h.implement.apply(null,b.ifaces));
            var j=h.extend(a);f.__trait=e;f.__acls=j;f.__ccls=null;f.toString=function(){return""+c};f.___$$mixinargs=[];f.__mixin=function(a,b,c){p(f,a,b,c)};f.__mixinImpl=function(a){for(var b=q.getMeta(j).implemented||[],c=b.length;c--;)a.push(b[c])};f.__isInstanceOf=s.isInstanceOf;return f};a.implement=function(){return j(arguments)};a.isTrait=function(a){return!!(a||{}).__trait};a.isParameterTrait=function(a){return"param"===(a||{}).__trait};a.isArgumentTrait=function(a){return"arg"===(a||{}).__trait};b.exports=
            a})(j.Trait={},".");(function(b){function c(a){if("object"===typeof a)a.___$$final$$=!0}function a(a){var b=a.extend;a.extend=function(){c(arguments[arguments.length-1]);return b.apply(this,arguments)}}var f=b.exports={};n=".";var e=h("./class"),f=b.exports=function(){c(arguments[arguments.length-1]);var b=e.apply(this,arguments);e.isClass(b)||a(b);return b};f.extend=function(){c(arguments[arguments.length-1]);return e.extend.apply(this,arguments)}})(j.class_final={},".");(function(b){var c=b.exports=
    {};n=".";var a=h("./MemberBuilder");b.exports=c=function(a,c){if(!(this instanceof b.exports))return new b.exports(a,c);b.exports.prototype.constructor.call(this,a,c)};b.exports.prototype=new a;b.exports.constructor=b.exports;c.prototype.buildGetterSetter=function(){throw Error("Getters/setters are unsupported in this environment");}})(j.FallbackMemberBuilder={},".");(function(b){function c(){if(!(this instanceof c))return new c;this._alt={}}b.exports={};n="util";(0,eval)("var _the_global=this");
        c.expose=function(){return _the_global};c.prototype={provideAlt:function(a,b){if(!(void 0!==_the_global[a]||void 0!==this._alt[a]))return this._alt[a]=b(),this},get:function(a){return void 0!==this._alt[a]?this._alt[a]:_the_global[a]}};b.exports=c})(j["util/Global"]={},".");(function(b){b.exports={};n="util";var c=h("./symbol/FallbackSymbol"),a=h("./Global").expose();b.exports=a.Symbol||c})(j["util/Symbol"]={},".");(function(b){function c(){if(!(this instanceof c))return new c;this.___$$id$$=e+f(1E8*
        a())}b.exports={};n="util/symbol";var a=Math.random,f=Math.floor,e=" "+String.fromCharCode(f(10*a())%31+1)+"$";c.prototype={toString:function(){return this.___$$id$$}};b.exports=c})(j["util/symbol/FallbackSymbol"]={},".");(function(b){b.exports={};n=".";var c=[0,2,4,""];c.major=0;c.minor=2;c.rev=4;c.suffix="";c.toString=function(){return this.join(".").replace(/\.([^.]*)$/,"-$1").replace(/-$/,"")};b.exports=c})(j.version={},".");(function(b){function c(){if(!(this instanceof c))return new c}b.exports=
    {};n="warn";c.prototype={handle:function(){}};b.exports=c})(j["warn/DismissiveHandler"]={},".");(function(b){function c(a){if(!(this instanceof c))return new c(a);this._console=a||{}}b.exports={};n="warn";c.prototype={handle:function(a){var b=this._console.warn||this._console.log;b&&b.call(this._console,"Warning: "+a.message)}};b.exports=c})(j["warn/LogHandler"]={},".");(function(b){function c(){if(!(this instanceof c))return new c}b.exports={};n="warn";c.prototype={handle:function(a){throw a.getError();
    }};b.exports=c})(j["warn/ThrowHandler"]={},".");(function(b){function c(a){if(!(this instanceof c))return new c(a);if(!(a instanceof Error))throw TypeError("Must provide exception to wrap");Error.prototype.constructor.call(this,a.message);this.message=a.message;this.name="Warning";this._error=a;this.stack=a.stack&&a.stack.replace(/^.*?\n+/,this.name+": "+this.message+"\n")}b.exports={};n="warn";c.prototype=Error();c.prototype.constructor=c;c.prototype.name="Warning";c.prototype.getError=function(){return this._error};
        b.exports=c})(j["warn/Warning"]={},".");B.Class=j["class"].exports;B.AbstractClass=j.class_abstract.exports;B.FinalClass=j.class_final.exports;B.Interface=j["interface"].exports;B.Trait=j.Trait.exports;B.version=j.version.exports})(easejs,".");

module.exports = easejs;
},{}],35:[function(require,module,exports){
var GeneJS = {
    Class: require('./easejs.js').Class
};

module.exports = GeneJS;
},{"./easejs.js":34}],36:[function(require,module,exports){
exports.puremvc = require("./lib/puremvc-1.0.1-mod.js");
exports.puremvc.statemachine = require("./lib/puremvc-statemachine-1.0-mod.js");
},{"./lib/puremvc-1.0.1-mod.js":37,"./lib/puremvc-statemachine-1.0-mod.js":38}],37:[function(require,module,exports){
/**
 * @fileOverview
 * PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * Reuse governed by Creative Commons Attribution 3.0 
 * http://creativecommons.org/licenses/by/3.0/us/
 * @author david.foley@puremvc.org 
 */


 	/* implementation begin */
	
	
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Observer
 * 
 * A base Observer implementation.
 * 
 * An Observer is an object that encapsulates information
 * about an interested object with a method that should 
 * be called when a particular Notification is broadcast. 
 * 
 * In PureMVC, the Observer class assumes these responsibilities:
 * 
 * - Encapsulate the notification (callback) method of the interested object.
 * - Encapsulate the notification context (this) of the interested object.
 * - Provide methods for setting the notification method and context.
 * - Provide a method for notifying the interested object.
 * 
 * 
 * The notification method on the interested object should take 
 * one parameter of type Notification.
 * 
 * 
 * @param {Function} notifyMethod 
 *  the notification method of the interested object
 * @param {Object} notifyContext 
 *  the notification context of the interested object
 * @constructor
 */
function Observer (notifyMethod, notifyContext)
{
    this.setNotifyMethod(notifyMethod);
    this.setNotifyContext(notifyContext);
};

/**
 * Set the Observers notification method.
 * 
 * The notification method should take one parameter of type Notification
 * @param {Function} notifyMethod
 *  the notification (callback) method of the interested object.
 * @return {void}
 */
Observer.prototype.setNotifyMethod= function (notifyMethod)
{
    this.notify= notifyMethod;
};

/**
 * Set the Observers notification context.
 * 
 * @param {Object} notifyContext
 *  the notification context (this) of the interested object.
 * 
 * @return {void}
 */
Observer.prototype.setNotifyContext= function (notifyContext)
{
    this.context= notifyContext;
};

/**
 * Get the Function that this Observer will invoke when it is notified.
 * 
 * @private
 * @return {Function}
 */
Observer.prototype.getNotifyMethod= function ()
{
    return this.notify;
};

/**
 * Get the Object that will serve as the Observers callback execution context
 * 
 * @private
 * @return {Object}
 */
Observer.prototype.getNotifyContext= function ()
{
    return this.context;
};

/**
 * Notify the interested object.
 * 
 * @param {puremvc.Notification} notification
 *  The Notification to pass to the interested objects notification method
 * @return {void}
 */
Observer.prototype.notifyObserver= function (notification)
{
    this.getNotifyMethod().call(this.getNotifyContext(), notification);
};

/**
 * Compare an object to this Observers notification context.
 * 
 * @param {Object} object
 *  
 * @return {boolean}
 */
Observer.prototype.compareNotifyContext= function (object)
{
    return object === this.context;
};

/**
 * The Observers callback Function
 * 
 * @private
 * @type {Function}
 */
Observer.prototype.notify= null;

/**
 * The Observers callback Object
 * @private
 * @type {Object}
 */
Observer.prototype.context= null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Notification
 * 
 * A base Notification implementation.
 * 
 * PureMVC does not rely upon underlying event models such as the one provided 
 * with the DOM or other browser centric W3C event models.
 * 
 * The Observer Pattern as implemented within PureMVC exists to support 
 * event-driven communication between the application and the actors of the MVC 
 * triad.
 * 
 * Notifications are not meant to be a replacement for events in the browser. 
 * Generally, Mediator implementors place event listeners on their view 
 * components, which they then handle in the usual way. This may lead to the 
 * broadcast of Notifications to trigger commands or to communicate with other 
 * Mediators. {@link puremvc.Proxy Proxy},
 * {@link puremvc.SimpleCommand SimpleCommand}
 * and {@link puremvc.MacroCommand MacroCommand}
 * instances communicate with each other and 
 * {@link puremvc.Mediator Mediator}s
 * by broadcasting Notifications.
 * 
 * A key difference between browser events and PureMVC Notifications is that
 * events follow the 'Chain of Responsibility' pattern, 'bubbling' up the 
 * display hierarchy until some parent component handles the event, while 
 * PureMVC Notification follow a 'Publish/Subscribe' pattern. PureMVC classes 
 * need not be related to each other in a parent/child relationship in order to 
 * communicate with one another using Notifications.
 * 
 * @constructor 
 * @param {string} name
 *  The Notification name
 * @param {Object} [body]
 *  The Notification body
 * @param {Object} [type]
 *  The Notification type
 */
function Notification(name, body, type)
{
    this.name= name;
    this.body= body;
    this.type= type;
};

/**
 * Get the name of the Notification instance
 *
 * @return {string}
 *  The name of the Notification instance
 */
Notification.prototype.getName= function()
{
    return this.name;
};

/**
 * Set this Notifications body. 
 * @param {Object} body
 * @return {void}
 */
Notification.prototype.setBody= function(body)
{
    this.body= body;
};

/**
 * Get the Notification body.
 *
 * @return {Object}
 */
Notification.prototype.getBody= function()
{
    return this.body
};

/**
 * Set the type of the Notification instance.
 *
 * @param {Object} type
 * @return {void}
 */
Notification.prototype.setType= function(type)
{
    this.type= type;
};

/**
 * Get the type of the Notification instance.
 * 
 * @return {Object}
 */
Notification.prototype.getType= function()
{
    return this.type;
};

/**
 * Get a string representation of the Notification instance
 *
 * @return {string}
 */
Notification.prototype.toString= function()
{
    var msg= "Notification Name: " + this.getName();
    msg+= "\nBody:" + ((this.body == null ) ? "null" : this.body.toString());
    msg+= "\nType:" + ((this.type == null ) ? "null" : this.type);
    return msg;
};

/**
 * The Notifications name.
 *
 * @type {string}
 * @private
 */
Notification.prototype.name= null;

/**
 * The Notifications type.
 *
 * @type {string}
 * @private
 */
Notification.prototype.type= null;

/**
 * The Notifications body.
 *
 * @type {Object}
 * @private
 */
Notification.prototype.body= null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Notifier
 * 
 * A Base Notifier implementation.
 * 
 * {@link puremvc.MacroCommand MacroCommand}, 
 * {@link puremvc.SimpleCommand SimpleCommand}, 
 * {@link puremvc.Mediator Mediator} and 
 * {@link puremvc.Proxy Proxy}
 * all have a need to send Notifications
 * 
 * The Notifier interface provides a common method called #sendNotification that 
 * relieves implementation code of the necessity to actually construct 
 * Notifications.
 * 
 * The Notifier class, which all of the above mentioned classes
 * extend, provides an initialized reference to the 
 * {@link puremvc.Facade Facade}
 * Multiton, which is required for the convienience method
 * for sending Notifications but also eases implementation as these
 * classes have frequent 
 * {@link puremvc.Facade Facade} interactions 
 * and usually require access to the facade anyway.
 * 
 * NOTE: In the MultiCore version of the framework, there is one caveat to
 * notifiers, they cannot send notifications or reach the facade until they
 * have a valid multitonKey. 
 * 
 * The multitonKey is set:
 *   - on a Command when it is executed by the Controller
 *   - on a Mediator is registered with the View
 *   - on a Proxy is registered with the Model. 
 * 
 * @constructor
 */
function Notifier()
{
};

/**
 * Create and send a Notification.
 *
 * Keeps us from having to construct new Notification instances in our 
 * implementation code.
 * 
 * @param {string} notificationName
 *  A notification name
 * @param {Object} [body]
 *  The body of the notification
 * @param {string} [type]
 *  The notification type
 * @return {void}
 */
Notifier.prototype.sendNotification = function(notificationName, body, type)
{
    var facade = this.getFacade();
    if(facade)
    {
        facade.sendNotification(notificationName, body, type);
    }
};


/**
 * @protected
 * A reference to this Notifier's Facade. This reference will not be available
 * until #initializeNotifier has been called. 
 * 
 * @type {puremvc.Facade}
 */
Notifier.prototype.facade;

/**
 * Initialize this Notifier instance.
 * 
 * This is how a Notifier gets its multitonKey. 
 * Calls to #sendNotification or to access the
 * facade will fail until after this method 
 * has been called.
 * 
 * Mediators, Commands or Proxies may override 
 * this method in order to send notifications
 * or access the Multiton Facade instance as
 * soon as possible. They CANNOT access the facade
 * in their constructors, since this method will not
 * yet have been called.
 * 
 *
 * @param {string} key
 *  The Notifiers multiton key;
 * @return {void}
 */
Notifier.prototype.initializeNotifier = function(key)
{
    this.multitonKey = String(key);
    this.facade= this.getFacade();
};

/**
 * Retrieve the Multiton Facade instance
 *
 *
 * @protected
 * @return {puremvc.Facade}
 */
Notifier.prototype.getFacade = function()
{
    if(this.multitonKey == null)
    {
        throw new Error(Notifier.MULTITON_MSG);
    };

    return Facade.getInstance(this.multitonKey);
};

/**
 * @ignore
 * The Notifiers internal multiton key.
 *
 * @protected
 * @type string
 */
Notifier.prototype.multitonKey = null;

/**
 * @ignore
 * The error message used if the Notifier is not initialized correctly and
 * attempts to retrieve its own multiton key
 *
 * @static
 * @protected
 * @const
 * @type string
 */
Notifier.MULTITON_MSG = "multitonKey for this Notifier not yet initialized!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.SimpleCommand
 * @extends puremvc.Notifier
 *
 * SimpleCommands encapsulate the business logic of your application. Your 
 * subclass should override the #execute method where your business logic will
 * handle the 
 * {@link puremvc.Notification Notification}
 * 
 * Take a look at 
 * {@link puremvc.Facade#registerCommand Facade's registerCommand}
 * or {@link puremvc.Controller#registerCommand Controllers registerCommand}
 * methods to see how to add commands to your application.
 * 
 * @constructor
 */
function SimpleCommand () { };

SimpleCommand.prototype= new Notifier;
SimpleCommand.prototype.constructor= SimpleCommand;

/**
 * Fulfill the use-case initiated by the given Notification
 * 
 * In the Command Pattern, an application use-case typically begins with some
 * user action, which results in a Notification is handled by the business logic
 * in the #execute method of a command.
 * 
 * @param {puremvc.Notification} notification
 *  The notification to handle.
 * @return {void}
 */
SimpleCommand.prototype.execute= function (notification) { };
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.MacroCommand
 * @extends puremvc.Notifier
 * 
 * A base command implementation that executes other commands, such as
 * {@link puremvc.SimpleCommand SimpleCommand}
 * or {@link puremvc.MacroCommand MacroCommand}
 * subclasses.
 *  
 * A MacroCommand maintains an list of
 * command constructor references called *SubCommands*.
 * 
 * When #execute is called, the MacroCommand
 * instantiates and calls #execute on each of its *SubCommands* in turn.
 * Each *SubCommand* will be passed a reference to the original
 * {@link puremvc.Notification Notification} 
 * that was passed to the MacroCommands #execute method
 * 
 * Unlike {@link puremvc.SimpleCommand SimpleCommand}, 
 * your subclass should not override #execute but instead, should 
 * override the #initializeMacroCommand method, calling #addSubCommand once for 
 * each *SubCommand* to be executed.
 * 
 * If your subclass does define a constructor, be sure to call "super" like so
 * 
 *     function MyMacroCommand ()
 *     {
 *         MacroCommand.call(this);
 *     };
 * @constructor
 */
function MacroCommand()
{
    this.subCommands= [];
    this.initializeMacroCommand();
};

/* subclass Notifier */
MacroCommand.prototype= new Notifier;
MacroCommand.prototype.constructor= MacroCommand;

/**
 * @private
 * @type {Array.<puremvc.SimpleCommand|puremvc.MacroCommand>}
 */
MacroCommand.prototype.subCommands= null;

/**
 * @protected
 * Initialize the MacroCommand.
 * 
 * In your subclass, override this method to 
 * initialize the MacroCommand's *SubCommand*  
 * list with command class references like 
 * this:
 * 
 *     // Initialize MyMacroCommand
 *     MyMacroCommand.prototype.initializeMacroCommand= function ()
 *     {
 *         this.addSubCommand( com.me.myapp.controller.FirstCommand );
 *         this.addSubCommand( com.me.myapp.controller.SecondCommand );
 *         this.addSubCommand( com.me.myapp.controller.ThirdCommand );
 *     };
 * 
 * Note that *SubCommand*s may be any command implementor,
 * MacroCommands or SimpleCommands are both acceptable.
 * @return {void}
 */
MacroCommand.prototype.initializeMacroCommand= function() {}

/**
 * @protected
 * Add a *SubCommand*
 * 
 * The *SubCommand*s will be called in First In / First Out (FIFO) order
 * @param {Function} commandClassRef
 *  A reference to a subclassed SimpleCommand or MacroCommand constructor
 */
MacroCommand.prototype.addSubCommand= function(commandClassRef)
{
    this.subCommands.push(commandClassRef);
};

/**
 * Execute this MacroCommands *SubCommands*
 * 
 * The *SubCommand*s will be called in First In / First Out (FIFO) order
 * @param {puremvc.Notification} note
 *  The Notification object to be passed to each *SubCommand*
 */
MacroCommand.prototype.execute= function(note)
{
    // SIC- TODO optimize
    while(this.subCommands.length > 0)
    {
        var ref= this.subCommands.shift();
        var cmd= new ref;
        cmd.initializeNotifier(this.multitonKey);
        cmd.execute(note);
    }
};
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Mediator
 * @extends puremvc.Notifier
 * 
 * A base Mediator implementation.
 *
 * In PureMVC, Mediator classes are used to mediate communication between a view 
 * component and the rest of the application.
 *
 * A Mediator should listen to its view components for events, and handle them 
 * by sending notifications (to be handled by other Mediators, 
 * {@link puremvc.SimpleCommand SimpleCommands} 
 * or
 * {@link puremvc.MacroCommand MacroCommands}) 
 * or passing data from the view component directly to a 
 * {@link puremvc.Proxy Proxy}, such as submitting 
 * the contents of a form to a service.
 * 
 * Mediators should not perform business logic, maintain state or other 
 * information for its view component, or break the encapsulation of the view 
 * component by manipulating the view component's children. It should only call 
 * methods or set properties on the view component.
 *  
 * The view component should encapsulate its own behavior and implementation by 
 * exposing methods and properties that the Mediator can call without having to 
 * know about the view component's children.
 * 
 * @constructor
 * @param {string} [mediatorName]
 *  The Mediators name. The Mediators static #NAME value is used by default
 * @param {Object} [viewComponent]
 *  The Mediators {@link #setViewComponent viewComponent}.
 */
function Mediator (mediatorName, viewComponent)
{
    this.mediatorName= mediatorName || this.constructor.NAME;
    this.viewComponent=viewComponent;  
};

/**
 * @static
 * The name of the Mediator.
 * 
 * Typically, a Mediator will be written to serve one specific control or group
 * of controls and so, will not have a need to be dynamically named.
 * 
 * @type {string}
 */
Mediator.NAME= "Mediator";

/* subclass */
Mediator.prototype= new Notifier;
Mediator.prototype.constructor= Mediator;

/**
 * Get the name of the Mediator
 * 
 * @return {string}
 *  The Mediator name
 */
Mediator.prototype.getMediatorName= function ()
{
    return this.mediatorName;
};

/**
 * Set the Mediators view component. This could
 * be a HTMLElement, a bespoke UiComponent wrapper
 * class, a MooTools Element, a jQuery result or a
 * css selector, depending on which DOM abstraction 
 * library you are using.
 * 
 * 
 * @param {Object} the view component
 * @return {void}
 */
Mediator.prototype.setViewComponent= function (viewComponent)
{
    this.viewComponent= viewComponent;
};

/**
 * Get the Mediators view component.
 * 
 * Additionally, an optional explicit getter can be
 * be defined in the subclass that defines the 
 * view components, providing a more semantic interface
 * to the Mediator.
 * 
 * This is different from the AS3 implementation in
 * the sense that no casting is required from the
 * object supplied as the view component.
 * 
 *     MyMediator.prototype.getComboBox= function ()
 *     {
 *         return this.viewComponent;  
 *     }
 * 
 * @return {Object}
 *  The view component
 */
Mediator.prototype.getViewComponent= function ()
{
    return this.viewComponent;
};

/**
 * List the Notification names this Mediator is interested
 * in being notified of.
 * 
 * @return {Array} 
 *  The list of Notification names.
 */
Mediator.prototype.listNotificationInterests= function ()
{
    return [];
};

/**
 * Handle Notifications.
 * 
 * Typically this will be handled in a switch statement
 * with one 'case' entry per Notification the Mediator
 * is interested in
 * 
 * @param {puremvc.Notification} notification
 * @return {void}
 */
Mediator.prototype.handleNotification= function (notification)
{
    return;
};

/**
 * Called by the View when the Mediator is registered
 * @return {void}
 */
Mediator.prototype.onRegister= function ()
{
    return;
};

/**
 * Called by the View when the Mediator is removed
 */
Mediator.prototype.onRemove= function ()
{
    return;
};

/**
 * @ignore
 * The Mediators name. Should only be accessed by Mediator subclasses.
 * 
 * @protected
 * @type string
 */
Mediator.prototype.mediatorName= null;

/**
 * @ignore
 * The Mediators viewComponent. Should only be accessed by Mediator subclasses.
 * 
 * @protected
 * @type Object
 */
Mediator.prototype.viewComponent=null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Proxy
 * @extends puremvc.Notifier
 *
 * A base Proxy implementation. 
 * 
 * In PureMVC, Proxy classes are used to manage parts of the application's data 
 * model.
 * 
 * A Proxy might simply manage a reference to a local data object, in which case 
 * interacting with it might involve setting and getting of its data in 
 * synchronous fashion.
 * 
 * Proxy classes are also used to encapsulate the application's interaction with 
 * remote services to save or retrieve data, in which case, we adopt an 
 * asyncronous idiom; setting data (or calling a method) on the Proxy and 
 * listening for a 
 * {@link puremvc.Notification Notification} 
 * to be sent  when the Proxy has retrieved the data from the service. 
 * 
 * 
 * @param {string} [proxyName]
 *  The Proxy's name. If none is provided, the Proxy will use its constructors
 *  NAME property.
 * @param {Object} [data]
 *  The Proxy's data object
 * @constructor
 */
function Proxy(proxyName, data)
{
    this.proxyName= proxyName || this.constructor.NAME;
    if(data != null)
    {
        this.setData(data);
    }
};


Proxy.NAME= "Proxy";

Proxy.prototype= new Notifier;
Proxy.prototype.constructor= Proxy;

/**
 * Get the Proxy's name.
 *
 * @return {string}
 */
Proxy.prototype.getProxyName= function()
{
    return this.proxyName;
};

/**
 * Set the Proxy's data object
 *
 * @param {Object} data
 * @return {void}
 */
Proxy.prototype.setData= function(data)
{
    this.data= data;
};

/**
 * Get the Proxy's data object
 *
 * @return {Object}
 */
Proxy.prototype.getData= function()
{
    return this.data;
};

/**
 * Called by the {@link puremvc.Model Model} when
 * the Proxy is registered.
 *
 * @return {void}
 */
Proxy.prototype.onRegister= function()
{
    return;
};

/**
 * Called by the {@link puremvc.Model Model} when
 * the Proxy is removed.
 * 
 * @return {void}
 */
Proxy.prototype.onRemove= function()
{
    return;
};

/**
 * @ignore
 * The Proxys name.
 *
 * @protected
 * @type String
 */
Proxy.prototype.proxyName= null;

/**
 * @ignore
 * The Proxy's data object.
 *
 * @protected
 * @type Object
 */
Proxy.prototype.data= null;
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Facade
 * Facade exposes the functionality of the Controller, Model and View
 * actors to client facing code. 
 * 
 * This Facade implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the static Factory method, 
 * passing the unique key for this instance to #getInstance
 *
 * @constructor
 * @param {string} key
 * 	The multiton key to use to retrieve the Facade instance.
 * @throws {Error} 
 *  If an attempt is made to instantiate Facade directly
 */
function Facade(key)
{
    if(Facade.instanceMap[key] != null)
    {
        throw new Error(Facade.MULTITON_MSG);
    }

    this.initializeNotifier(key);
    Facade.instanceMap[key] = this;
    this.initializeFacade();
};

/**
 * Initialize the Multiton Facade instance.
 * 
 * Called automatically by the constructor. Override in your subclass to any
 * subclass specific initializations. Be sure to call the 'super' 
 * initializeFacade method, though
 * 
 *     MyFacade.prototype.initializeFacade= function ()
 *     {
 *         Facade.call(this);
 *     };
 * @protected
 * @return {void}
 */
Facade.prototype.initializeFacade = function()
{
    this.initializeModel();
    this.initializeController();
    this.initializeView();
};

/**
 * Facade Multiton Factory method. 
 * Note that this method will return null if supplied a
 * null or undefined multiton key.
 * 
 * @param {string} key
 * 	The multiton key use to retrieve a particular Facade instance
 * @return {puremvc.Facade}
 */
Facade.getInstance = function(key)
{
	if (null == key)
		return null;
		
    if(Facade.instanceMap[key] == null)
    {
        Facade.instanceMap[key] = new Facade(key);
    }

    return Facade.instanceMap[key];
};

/**
 * Initialize the {@link puremvc.Controller Controller}.
 * 
 * Called by the #initializeFacade method.
 * 
 * Override this method in your subclass of Facade
 * if one or both of the following are true:

 * - You wish to initialize a different Controller
 * - You have 
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or {@link puremvc.MacroCommand MacroCommand}s
 * to register with the Controllerat startup.   
 * 
 * If you don't want to initialize a different Controller, 
 * call the 'super' initializeControlle method at the beginning of your
 * method, then register commands.
 * 
 *     MyFacade.prototype.initializeController= function ()
 *     {
 *         Facade.prototype.initializeController.call(this);
 *         this.registerCommand(AppConstants.A_NOTE_NAME, ABespokeCommand)
 *     }
 * 
 * @protected
 * @return {void}
 */
Facade.prototype.initializeController = function()
{
    if(this.controller != null)
        return;

    this.controller = Controller.getInstance(this.multitonKey);
};

/**
 * @protected
 * Initialize the {@link puremvc.Model Model};
 * 
 * Called by the #initializeFacade method.
 * Override this method in your subclass of Facade if one of the following are
 * true:
 * 
 * - You wish to initialize a different Model.
 * 
 * - You have {@link puremvc.Proxy Proxy}s to 
 *   register with the Model that do not retrieve a reference to the Facade at 
 *   construction time.
 * 
 * If you don't want to initialize a different Model
 * call 'super' #initializeModel at the beginning of your method, then register 
 * Proxys.
 * 
 * Note: This method is *rarely* overridden; in practice you are more
 * likely to use a command to create and registerProxys with the Model>, 
 * since Proxys with mutable data will likely
 * need to send Notifications and thus will likely want to fetch a reference to 
 * the Facade during their construction. 
 * 
 * @return {void}
 */
Facade.prototype.initializeModel = function()
{
    if(this.model != null)
        return;

    this.model = Model.getInstance(this.multitonKey);
};

/**
 * @protected
 * 
 * Initialize the {@link puremvc.View View}.
 * 
 * Called by the #initializeFacade method.
 * 
 * Override this method in your subclass of Facade if one or both of the 
 * following are true:
 *
 * - You wish to initialize a different View.
 * - You have Observers to register with the View
 * 
 * If you don't want to initialize a different View 
 * call 'super' #initializeView at the beginning of your
 * method, then register Mediator instances.
 * 
 *     MyFacade.prototype.initializeView= function ()
 *     {
 *         Facade.prototype.initializeView.call(this);
 *         this.registerMediator(new MyMediator());
 *     };
 * 
 * Note: This method is *rarely* overridden; in practice you are more
 * likely to use a command to create and register Mediators
 * with the View, since Mediator instances will need to send 
 * Notifications and thus will likely want to fetch a reference 
 * to the Facade during their construction. 
 * @return {void}
 */
Facade.prototype.initializeView = function()
{
    if(this.view != null)
        return;

    this.view = View.getInstance(this.multitonKey);
};

/**
 * Register a command with the Controller by Notification name
 * @param {string} notificationName
 *  The name of the Notification to associate the command with
 * @param {Function} commandClassRef
 *  A reference ot the commands constructor.
 * @return {void}
 */
Facade.prototype.registerCommand = function(notificationName, commandClassRef)
{
    this.controller.registerCommand(notificationName, commandClassRef);
};

/**
 * Remove a previously registered command to Notification mapping from the
 * {@link puremvc.Controller#removeCommand Controller}
 * @param {string} notificationName
 *  The name of the the Notification to remove from the command mapping for.
 * @return {void}
 */
Facade.prototype.removeCommand = function(notificationName)
{
    this.controller.removeCommand(notificationName);
};

/**
 * Check if a command is registered for a given notification.
 * 
 * @param {string} notificationName
 *  A Notification name
 * @return {boolean}
 *  Whether a comman is currently registered for the given notificationName
 */
Facade.prototype.hasCommand = function(notificationName)
{
    return this.controller.hasCommand(notificationName);
};

/**
 * Register a Proxy with the {@link puremvc.Model#registerProxy Model}
 * by name.
 * 
 * @param {puremvc.Proxy} proxy
 *  The Proxy instance to be registered with the Model.
 * @return {void}
 */
Facade.prototype.registerProxy = function(proxy)
{
    this.model.registerProxy(proxy);
};

/**
 * Retrieve a Proxy from the Model
 * 
 * @param {string} proxyName
 * @return {puremvc.Proxy}
 */
Facade.prototype.retrieveProxy = function(proxyName)
{
    return this.model.retrieveProxy(proxyName);
};

/**
 * Remove a Proxy from the Model by name
 * @param {string} proxyName
 *  The name of the Proxy
 * @return {puremvc.Proxy}
 *  The Proxy that was removed from the Model
 */
Facade.prototype.removeProxy = function(proxyName)
{
    var proxy = null;
    if(this.model != null)
    {
        proxy = this.model.removeProxy(proxyName);
    }

    return proxy;
};

/**
 * Check it a Proxy is registered.
 * @param {string} proxyName
 *  A Proxy name
 * @return {boolean}
 *  Whether a Proxy is currently registered with the given proxyName
 */
Facade.prototype.hasProxy = function(proxyName)
{
    return this.model.hasProxy(proxyName);
};

/**
 * Register a Mediator with with the View.
 * 
 * @param {puremvc.Mediator} mediator
 *  A reference to the Mediator to register
 * @return {void}
 */
Facade.prototype.registerMediator = function(mediator)
{
    if(this.view != null)
    {
        this.view.registerMediator(mediator);
    }
};

/**
 * Retrieve a Mediator from the View by name
 * 
 * @param {string} mediatorName
 *  The Mediators name
 * @return {puremvc.Mediator}
 *  The retrieved Mediator
 */
Facade.prototype.retrieveMediator = function(mediatorName)
{
    return this.view.retrieveMediator(mediatorName);
};

/**
 * Remove a Mediator from the View.
 * 
 * @param {string} mediatorName
 *  The name of the Mediator to remove.
 * @return {puremvc.Mediator}
 *  The removed Mediator
 */
Facade.prototype.removeMediator = function(mediatorName)
{
    var mediator = null;
    if(this.view != null)
    {
        mediator = this.view.removeMediator(mediatorName);
    }

    return mediator;
};

/**
 * Check if a Mediator is registered or not.
 * 
 * @param {string} mediatorName
 *  A Mediator name
 * @return {boolean}
 *  Whether a Mediator is registered with the given mediatorName
 */
Facade.prototype.hasMediator = function(mediatorName)
{
    return this.view.hasMediator(mediatorName);
};

/**
 * Create and send a 
 * {@link puremvc.Notification Notification}
 * 
 * Keeps us from having to construct new Notification instances in our
 * implementation
 * 
 * @param {string} notificationName
 *  The name of the Notification to send
 * @param {Object} [body]
 *  The body of the notification
 * @param {string} [type]
 *  The type of the notification
 * @return {void}
 */
Facade.prototype.sendNotification = function(notificationName, body, type)
{
    this.notifyObservers(new Notification(notificationName, body, type));
};

/**
 * Notify {@link puremvc.Observer Observer}s
 * 
 * This method is left public mostly for backward compatibility, and to allow
 * you to send custom notification classes using the facade.
 * 
 * Usually you should just call sendNotification and pass the parameters, never 
 * having to construct the notification yourself.
 * 
 * @param {puremvc.Notification} notification
 *  The Notification to send
 * @return {void}
 */
Facade.prototype.notifyObservers = function(notification)
{
    if(this.view != null)
    {
        this.view.notifyObservers(notification);
    }
};

/**
 * Initialize the Facades Notifier capabilities by setting the Multiton key for 
 * this facade instance.
 * 
 * Not called directly, but instead from the constructor when #getInstance is 
 * invoked. It is necessary to be public in order to implement Notifier
 * 
 * @param {string} key
 * @return {void}
 */
Facade.prototype.initializeNotifier = function(key)
{
    this.multitonKey = key;
};

/**
 * Check if a *Core* is registered or not
 *
 * @static
 * @param {string} key
 *  The multiton key for the *Core* in question
 * @return {boolean}
 *  Whether a *Core* is registered with the given key
 */
Facade.hasCore = function(key)
{
    return Facade.instanceMap[key] != null;
};

/**
 * Remove a *Core* 
 * 
 * Remove the Model, View, Controller and Facade for a given key.
 *
 * @static
 * @param {string} key
 * @return {void}
 */
Facade.removeCore = function(key)
{
    if(Facade.instanceMap[key] == null)
        return;

    Model.removeModel(key);
    View.removeView(key);
    Controller.removeController(key);
    delete Facade.instanceMap[key];
};

/**
 * @ignore
 * The Facades corresponding Controller
 *
 * @protected
 * @type puremvc.Controller
 */
Facade.prototype.controller = null;

/**
 * @ignore
 * The Facades corresponding Model instance
 *
 * @protected
 * @type puremvc.Model
 */
Facade.prototype.model = null;

/**
 * @ignore
 * The Facades correspnding View instance.
 *
 * @protected
 * @type puremvc.View
 */
Facade.prototype.view = null;

/**
 * @ignore
 * The Facades multiton key.
 *
 * @protected
 * @type string
 */
Facade.prototype.multitonKey = null;

/**
 * @ignore
 * The Multiton Facade instance map.
 * @static
 * @protected
 * @type Array
 */
Facade.instanceMap = [];

/**
 * @ignore
 * Message Constants
 * @protected
 * @type {string}
 * @const
 * @static
 */
Facade.MULTITON_MSG = "Facade instance for this Multiton key already constructed!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.View
 * 
 * A Multiton View implementation.
 * 
 * In PureMVC, the View class assumes these responsibilities
 * 
 * - Maintain a cache of {@link puremvc.Mediator Mediator}
 *   instances.
 * 
 * - Provide methods for registering, retrieving, and removing 
 *   {@link puremvc.Mediator Mediator}.
 * 
 * - Notifiying {@link puremvc.Mediator Mediator} when they are registered or 
 *   removed.
 * 
 * - Managing the observer lists for each {@link puremvc.Notification Notification}  
 *   in the application.
 * 
 * - Providing a method for attaching {@link puremvc.Observer Observer} to an 
 *   {@link puremvc.Notification Notification}'s observer list.
 * 
 * - Providing a method for broadcasting a {@link puremvc.Notification Notification}.
 * 
 * - Notifying the {@link puremvc.Observer Observer}s of a given 
 *   {@link puremvc.Notification Notification} when it broadcast.
 * 
 * This View implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the static Multiton 
 * Factory #getInstance method.
 * 
 * @param {string} key
 * @constructor
 * @throws {Error} 
 *  if instance for this Multiton key has already been constructed
 */
function View(key)
{
    if(View.instanceMap[key] != null)
    {
        throw new Error(View.MULTITON_MSG);
    };

    this.multitonKey = key;
    View.instanceMap[this.multitonKey] = this;
    this.mediatorMap = [];
    this.observerMap = [];
    this.initializeView();
};

/**
 * @protected
 * Initialize the Singleton View instance
 * 
 * Called automatically by the constructor, this is your opportunity to
 * initialize the Singleton instance in your subclass without overriding the
 * constructor
 * 
 * @return {void}
 */
View.prototype.initializeView = function()
{
    return;
};

/**
 * View Singleton Factory method.
 * Note that this method will return null if supplied a null 
 * or undefined multiton key.
 *  
 * @return {puremvc.View}
 *  The Singleton instance of View
 */
View.getInstance = function(key)
{
	if (null == key)
		return null;
		
    if(View.instanceMap[key] == null)
    {
        View.instanceMap[key] = new View(key);
    };

    return View.instanceMap[key];
};

/**
 * Register an Observer to be notified of Notifications with a given name
 * 
 * @param {string} notificationName
 *  The name of the Notifications to notify this Observer of
 * @param {puremvc.Observer} observer
 *  The Observer to register.
 * @return {void}
 */
View.prototype.registerObserver = function(notificationName, observer)
{
    if(this.observerMap[notificationName] != null)
    {
        this.observerMap[notificationName].push(observer);
    }
    else
    {
        this.observerMap[notificationName] = [observer];
    }
};

/**
 * Notify the Observersfor a particular Notification.
 * 
 * All previously attached Observers for this Notification's
 * list are notified and are passed a reference to the INotification in 
 * the order in which they were registered.
 * 
 * @param {puremvc.Notification} notification
 *  The Notification to notify Observers of
 * @return {void}
 */
View.prototype.notifyObservers = function(notification)
{
    // SIC
    if(this.observerMap[notification.getName()] != null)
    {
        var observers_ref = this.observerMap[notification.getName()], observers = [], observer

        for(var i = 0; i < observers_ref.length; i++)
        {
            observer = observers_ref[i];
            observers.push(observer);
        }

        for(var i = 0; i < observers.length; i++)
        {
            observer = observers[i];
            observer.notifyObserver(notification);
        }
    }
};

/**
 * Remove the Observer for a given notifyContext from an observer list for
 * a given Notification name
 * 
 * @param {string} notificationName
 *  Which observer list to remove from
 * @param {Object} notifyContext
 *  Remove the Observer with this object as its notifyContext
 * @return {void}
 */
View.prototype.removeObserver = function(notificationName, notifyContext)
{
    // SIC
    var observers = this.observerMap[notificationName];
    for(var i = 0; i < observers.length; i++)
    {
        if(observers[i].compareNotifyContext(notifyContext) == true)
        {
            observers.splice(i, 1);
            break;
        }
    }

    if(observers.length == 0)
    {
        delete this.observerMap[notificationName];
    }
};

/**
 * Register a Mediator instance with the View.
 * 
 * Registers the Mediator so that it can be retrieved by name,
 * and further interrogates the Mediator for its 
 * {@link puremvc.Mediator#listNotificationInterests interests}.
 *
 * If the Mediator returns any Notification
 * names to be notified about, an Observer is created encapsulating 
 * the Mediator instance's 
 * {@link puremvc.Mediator#handleNotification handleNotification}
 * method and registering it as an Observer for all Notifications the 
 * Mediator is interested in.
 * 
 * @param {puremvc.Mediator} 
 *  a reference to the Mediator instance
 */
View.prototype.registerMediator = function(mediator)
{
    if(this.mediatorMap[mediator.getMediatorName()] != null)
    {
        return;
    }

    mediator.initializeNotifier(this.multitonKey);
    // register the mediator for retrieval by name
    this.mediatorMap[mediator.getMediatorName()] = mediator;

    // get notification interests if any
    var interests = mediator.listNotificationInterests();

    // register mediator as an observer for each notification
    if(interests.length > 0)
    {
        // create observer referencing this mediators handleNotification method
        var observer = new Observer(mediator.handleNotification, mediator);
        for(var i = 0; i < interests.length; i++)
        {
            this.registerObserver(interests[i], observer);
        }
    }

    mediator.onRegister();
}

/**
 * Retrieve a Mediator from the View
 * 
 * @param {string} mediatorName
 *  The name of the Mediator instance to retrieve
 * @return {puremvc.Mediator}
 *  The Mediator instance previously registered with the given mediatorName
 */
View.prototype.retrieveMediator = function(mediatorName)
{
    return this.mediatorMap[mediatorName];
};

/**
 * Remove a Mediator from the View.
 * 
 * @param {string} mediatorName
 *  Name of the Mediator instance to be removed
 * @return {puremvc.Mediator}
 *  The Mediator that was removed from the View
 */
View.prototype.removeMediator = function(mediatorName)
{
    var mediator = this.mediatorMap[mediatorName];
    if(mediator)
    {
        // for every notification the mediator is interested in...
        var interests = mediator.listNotificationInterests();
        for(var i = 0; i < interests.length; i++)
        {
            // remove the observer linking the mediator to the notification
            // interest
            this.removeObserver(interests[i], mediator);
        }

        // remove the mediator from the map
        delete this.mediatorMap[mediatorName];

        // alert the mediator that it has been removed
        mediator.onRemove();
    }

    return mediator;
};

/**
 * Check if a Mediator is registered or not.
 * 
 * @param {string} mediatorName
 * @return {boolean}
 *  Whether a Mediator is registered with the given mediatorname
 */
View.prototype.hasMediator = function(mediatorName)
{
    return this.mediatorMap[mediatorName] != null;
};

/**
 * Remove a View instance
 * 
 * @return {void}
 */
View.removeView = function(key)
{
    delete View.instanceMap[key];
};

/**
 * @ignore
 * The Views internal mapping of mediator names to mediator instances
 *
 * @type Array
 * @protected
 */
View.prototype.mediatorMap = null;

/**
 * @ignore
 * The Views internal mapping of Notification names to Observer lists
 *
 * @type Array
 * @protected
 */
View.prototype.observerMap = null;

/**
 * @ignore
 * The internal map used to store multiton View instances
 *
 * @type Array
 * @protected
 */
View.instanceMap = [];

/**
 * @ignore
 * The Views internal multiton key.
 *
 * @type string
 * @protected
 */
View.prototype.multitonKey = null;

/**
 * @ignore
 * The error message used if an attempt is made to instantiate View directly
 *
 * @type string
 * @protected
 * @const
 * @static
 */
View.MULTITON_MSG = "View instance for this Multiton key already constructed!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Model
 *
 * A Multiton Model implementation.
 *
 * In PureMVC, the Model class provides
 * access to model objects (Proxies) by named lookup.
 *
 * The Model assumes these responsibilities:
 *
 * - Maintain a cache of {@link puremvc.Proxy Proxy}
 *   instances.
 * - Provide methods for registering, retrieving, and removing
 *   {@link puremvc.Proxy Proxy} instances.
 *
 * Your application must register 
 * {@link puremvc.Proxy Proxy} instances with the Model. 
 * Typically, you use a 
 * {@link puremvc.SimpleCommand SimpleCommand} 
 * or
 * {@link puremvc.MacroCommand MacroCommand} 
 * to create and register Proxy instances once the Facade has initialized the 
 * *Core* actors.
 *
 * This Model implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the 
 * {@link #getInstance static Multiton Factory method} 
 * @constructor
 * @param {string} key
 *  The Models multiton key
 * @throws {Error}
 *  An error is thrown if this multitons key is already in use by another instance
 */
function Model(key)
{
    if(Model.instanceMap[key])
    {
        throw new Error(Model.MULTITON_MSG);
    }

    this.multitonKey= key;
    Model.instanceMap[key]= this;
    this.proxyMap= [];
    this.initializeModel();
};

/**
 * Initialize the Model instance.
 * 
 * Called automatically by the constructor, this
 * is your opportunity to initialize the Singleton
 * instance in your subclass without overriding the
 * constructor.
 * 
 * @return void
 */
Model.prototype.initializeModel= function(){};


/**
 * Model Multiton Factory method.
 * Note that this method will return null if supplied a null 
 * or undefined multiton key.
 *  
 * @param {string} key
 *  The multiton key for the Model to retrieve
 * @return {puremvc.Model}
 *  the instance for this Multiton key 
 */
Model.getInstance= function(key)
{
	if (null == key)
		return null;
		
    if(Model.instanceMap[key] == null)
    {
        Model.instanceMap[key]= new Model(key);
    }

    return Model.instanceMap[key];
};

/**
 * Register a Proxy with the Model
 * @param {puremvc.Proxy}
 */
Model.prototype.registerProxy= function(proxy)
{
    proxy.initializeNotifier(this.multitonKey);
    this.proxyMap[proxy.getProxyName()]= proxy;
    proxy.onRegister();
};

/**
 * Retrieve a Proxy from the Model
 * 
 * @param {string} proxyName
 * @return {puremvc.Proxy}
 *  The Proxy instance previously registered with the provided proxyName
 */
Model.prototype.retrieveProxy= function(proxyName)
{
    return this.proxyMap[proxyName];
};

/**
 * Check if a Proxy is registered
 * @param {string} proxyName
 * @return {boolean}
 *  whether a Proxy is currently registered with the given proxyName.
 */
Model.prototype.hasProxy= function(proxyName)
{
    return this.proxyMap[proxyName] != null;
};

/**
 * Remove a Proxy from the Model.
 * 
 * @param {string} proxyName
 *  The name of the Proxy instance to remove
 * @return {puremvc.Proxy}
 *  The Proxy that was removed from the Model
 */
Model.prototype.removeProxy= function(proxyName)
{
    var proxy= this.proxyMap[proxyName];
    if(proxy)
    {
        this.proxyMap[proxyName]= null;
        proxy.onRemove();
    }

    return proxy;
};

/**
 * @static
 * Remove a Model instance.
 * 
 * @param {string} key
 * @return {void}
 */
Model.removeModel= function(key)
{
    delete Model.instanceMap[key];
};

/**
 * @ignore
 * The map used by the Model to store Proxy instances.
 *
 * @protected
 * @type Array
 */
Model.prototype.proxyMap= null;

/**
 * @ignore
 * The map used by the Model to store multiton instances
 *
 * @protected
 * @static
 * @type Array
 */
Model.instanceMap= [];

/**
 * @ignore
 * The Models multiton key.
 *
 * @protected
 * @type string
 */
Model.prototype.multitonKey;

/**
 * @ignore
 * Message Constants
 * 
 * @static
 * @type {string}
 */
Model.MULTITON_MSG= "Model instance for this Multiton key already constructed!";
/**
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @class puremvc.Controller
 * 
 * In PureMVC, the Controller class follows the 'Command and Controller' 
 * strategy, and assumes these responsibilities:
 * 
 * - Remembering which
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or 
 * {@link puremvc.MacroCommand MacroCommand}s
 * are intended to handle which 
 * {@link puremvc.Notification Notification}s
 * - Registering itself as an 
 * {@link puremvc.Observer Observer} with
 * the {@link puremvc.View View} for each 
 * {@link puremvc.Notification Notification}
 * that it has an 
 * {@link puremvc.SimpleCommand SimpleCommand} 
 * or {@link puremvc.MacroCommand MacroCommand} 
 * mapping for.
 * - Creating a new instance of the proper 
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or 
 * {@link puremvc.MacroCommand MacroCommand}s
 * to handle a given 
 * {@link puremvc.Notification Notification} 
 * when notified by the
 * {@link puremvc.View View}.
 * - Calling the command's execute method, passing in the 
 * {@link puremvc.Notification Notification}.
 *
 * Your application must register 
 * {@link puremvc.SimpleCommand SimpleCommand}s
 * or {@link puremvc.MacroCommand MacroCommand}s 
 * with the Controller.
 *
 * The simplest way is to subclass 
 * {@link puremvc.Facade Facade},
 * and use its 
 * {@link puremvc.Facade#initializeController initializeController} 
 * method to add your registrations.
 *
 * @constructor
 * This Controller implementation is a Multiton, so you should not call the 
 * constructor directly, but instead call the static #getInstance factory method, 
 * passing the unique key for this instance to it.
 * @param {string} key
 * @throws {Error}
 *  If instance for this Multiton key has already been constructed
 */
function Controller(key)
{
    if(Controller.instanceMap[key] != null)
    {
        throw new Error(Controller.MULTITON_MSG);
    }

    this.multitonKey= key;
    Controller.instanceMap[this.multitonKey]= this;
    this.commandMap= new Array();
    this.initializeController();
}

/**
 * @protected
 * 
 * Initialize the multiton Controller instance.
 *
 * Called automatically by the constructor.
 *
 * Note that if you are using a subclass of View
 * in your application, you should *also* subclass Controller
 * and override the initializeController method in the
 * following way.
 * 
 *     MyController.prototype.initializeController= function ()
 *     {
 *         this.view= MyView.getInstance(this.multitonKey);
 *     };
 * 
 * @return {void}
 */
Controller.prototype.initializeController= function()
{
    this.view= View.getInstance(this.multitonKey);
};

/**
 * The Controllers multiton factory method. 
 * Note that this method will return null if supplied a null 
 * or undefined multiton key. 
 *
 * @param {string} key
 *  A Controller's multiton key
 * @return {puremvc.Controller}
 *  the Multiton instance of Controller
 */
Controller.getInstance= function(key)
{
	if (null == key)
		return null;
		
    if(null == this.instanceMap[key])
    {
        this.instanceMap[key]= new this(key);
    }

    return this.instanceMap[key];
};

/**
 * If a SimpleCommand or MacroCommand has previously been registered to handle
 * the given Notification then it is executed.
 *
 * @param {puremvc.Notification} note
 * @return {void}
 */
Controller.prototype.executeCommand= function(note)
{
    var commandClassRef= this.commandMap[note.getName()];
    if(commandClassRef == null)
        return;

    var commandInstance= new commandClassRef();
    commandInstance.initializeNotifier(this.multitonKey);
    commandInstance.execute(note);
};

/**
 * Register a particular SimpleCommand or MacroCommand class as the handler for 
 * a particular Notification.
 *
 * If an command already been registered to handle Notifications with this name, 
 * it is no longer used, the new command is used instead.
 *
 * The Observer for the new command is only created if this the irst time a
 * command has been regisered for this Notification name.
 *
 * @param {string} notificationName
 *  the name of the Notification
 * @param {Function} commandClassRef
 *  a command constructor
 * @return {void}
 */
Controller.prototype.registerCommand= function(notificationName, commandClassRef)
{
    if(this.commandMap[notificationName] == null)
    {
        this.view.registerObserver(notificationName, new Observer(this.executeCommand, this));
    }

    this.commandMap[notificationName]= commandClassRef;
};

/**
 * Check if a command is registered for a given Notification
 *
 * @param {string} notificationName
 * @return {boolean}
 *  whether a Command is currently registered for the given notificationName.
 */
Controller.prototype.hasCommand= function(notificationName)
{
    return this.commandMap[notificationName] != null;
};

/**
 * Remove a previously registered command to
 * {@link puremvc.Notification Notification}
 * mapping.
 *
 * @param {string} notificationName
 *  the name of the Notification to remove the command mapping for
 * @return {void}
 */
Controller.prototype.removeCommand= function(notificationName)
{
    if(this.hasCommand(notificationName))
    {
        this.view.removeObserver(notificationName, this);
        this.commandMap[notificationName]= null;
    }
};

/**
 * @static
 * Remove a Controller instance.
 *
 * @param {string} key 
 *  multitonKey of Controller instance to remove
 * @return {void}
 */
Controller.removeController= function(key)
{
    delete this.instanceMap[key];
};

/**
 * Local reference to the Controller's View
 * 
 * @protected
 * @type {puremvc.View}
 */
Controller.prototype.view= null;

/**
 * Note name to command constructor mappings
 * 
 * @protected
 * @type {Object}
 */
Controller.prototype.commandMap= null;

/**
 * The Controller's multiton key
 * 
 * @protected
 * @type {string}
 */
Controller.prototype.multitonKey= null;

/**
 * Multiton key to Controller instance mappings
 * 
 * @static
 * @protected
 * @type {Object}
 */
Controller.instanceMap= [];

/**
 * @ignore
 * 
 * Message constants
 * @static
 * @protected
 * @type {string}
 */
Controller.MULTITON_MSG= "controller key for this Multiton key already constructed"
/*
 * @author PureMVC JS Native Port by David Foley, Frédéric Saunier, & Alain Duchesneau 
 * @author Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * 
 * @hide
 * A an internal helper class used to assist classlet implementation. This
 * class is not accessible by client code.
 */
var OopHelp=
{
    /*
     * @private
     * A reference to the global scope. We use this rather than window
     * in order to support both browser based and non browser baed 
     * JavaScript interpreters.
     * @type {Object}
     */
	global: (function(){return this})()
    
    /*
     * @private
     * Extend one Function's prototype by another, emulating classic
     * inheritance.
     * 
     * @param {Function} child
     *  The Function to extend (subclass)
     * 
     * @param {Function} parent
     *  The Function to extend from (superclass)
     * 
     * @return {Function}
     * 
     *  A reference to the extended Function (subclass)
     */
,   extend: function (child, parent)
    {
        if ('function' !== typeof child)
            throw new TypeError('#extend- child should be Function');            
        
        if ('function' !== typeof parent)
            throw new TypeError('#extend- parent should be Function');
            
        if (parent === child)
            return;
            
        var Transitive= new Function;
        Transitive.prototype= parent.prototype;
        child.prototype= new Transitive;
        return child.prototype.constructor= child;
    }
    
    /*
     * @private
     * Decoarate one object with the properties of another. 
     * 
     * @param {Object} object
     *  The object to decorate.
     * 
     * @param {Object} traits
     *  The object providing the properites that the first object
     *  will be decorated with. Note that only properties defined on 
     *  this object will be copied- i.e. inherited properties will
     *  be ignored.
     * 
     * @return {Object}
     *  THe decorated object (first argument)
     */
,   decorate: function (object, traits)
    {   
        for (var accessor in traits)
        {
            object[accessor]= traits[accessor];
        }    
        
        return object;
    }
};


/**
 * @member puremvc
 * 
 * Declare a namespace and optionally make an Object the referent
 * of that namespace.
 * 
 *     console.assert(null == window.tld, 'No tld namespace');
 *     // declare the tld namespace
 *     puremvc.declare('tld');
 *     console.assert('object' === typeof tld, 'The tld namespace was declared');
 * 
 *     // the method returns a reference to last namespace node in a created hierarchy
 *     var reference= puremvc.declare('tld.domain.app');
 *     console.assert(reference === tld.domain.app)
 *    
 *     // of course you can also declare your own objects as well
 *     var AppConstants=
 *         {
 * 	           APP_NAME: 'tld.domain.app.App'
 *         };
 * 
 *     puremvc.declare('tld.domain.app.AppConstants', AppConstants);
 *     console.assert(AppConstants === tld.domain.app.AppConstants
 * 	   , 'AppConstants was exported to the namespace');
 * 
 * Note that you can also #declare within a closure. That way you
 * can selectively export Objects to your own namespaces without
 * leaking variables into the global scope.
 *    
 *     (function(){
 *         // this var is not accessible outside of this
 *         // closures call scope
 *         var hiddenValue= 'defaultValue';
 * 
 *         // export an object that references the hidden
 *         // variable and which can mutate it
 *         puremvc.declare
 *         (
 *              'tld.domain.app.backdoor'
 * 
 *         ,    {
 *                  setValue: function (value)
 *                  {
 *                      // assigns to the hidden var
 *                      hiddenValue= value;
 *                  }
 * 
 *         ,        getValue: function ()
 *                  {
 *                      // reads from the hidden var
 *                      return hiddenValue;
 *                  }
 *              }
 *         );
 *     })();
 *     // indirectly retrieve the hidden variables value
 *     console.assert('defaultValue' === tld.domain.app.backdoor.getValue());
 *     // indirectly set the hidden variables value
 *     tld.domain.app.backdoor.setValue('newValue');
 *     // the hidden var was mutated
 *     console.assert('newValue' === tld.domain.app.backdoor.getValue());
 * 
 * On occasion, primarily during testing, you may want to use declare, 
 * but not have the global object be the namespace root. In these cases you
 * can supply the optional third scope argument.
 * 
 *     var localScope= {}
 *     ,   object= {}
 * 
 *     puremvc.declare('mock.object', object, localScope);
 * 
 *     console.assert(null == window.mock, 'mock namespace is not in global scope');
 *     console.assert(object === localScope.mock.object, 'mock.object is available in localScope');    
 * 
 * @param {string} string
 *  A qualified object name, e.g. 'com.example.Class'
 * 
 * @param {Object} [object]
 *  An object to make the referent of the namespace. 
 * 
 * @param {Object} [scope]
 *  The namespace's root node. If not supplied, the global
 *  scope will be namespaces root node.
 * 
 * @return {Object}
 * 
 *  A reference to the last node of the Object hierarchy created.
 */
function declare (qualifiedName, object, scope)
{
    var nodes= qualifiedName.split('.')
    ,   node= scope || OopHelp.global
    ,   lastNode
    ,   newNode
    ,   nodeName;
                
    for (var i= 0, n= nodes.length; i < n; i++)
    {
        lastNode= node;
        nodeName= nodes[i];
        
        node= (null == node[nodeName] ? node[nodeName] = {} : node[nodeName]);
    }
                    
    if (null == object)
        return node;
                        
    return lastNode[nodeName]= object;
};




/**
 * @member puremvc
 * 
 * Define a new classlet. Current editions of JavaScript do not have classes,
 * but they can be emulated, and this method does this for you, saving you
 * from having to work with Function prototype directly. The method does
 * not extend any Native objects and is entirely opt in. Its particularly
 * usefull if you want to make your PureMvc applications more portable, by
 * decoupling them from a specific OOP abstraction library.
 * 
 * 
 *     puremvc.define
 *     (
 *         // the first object supplied is a class descriptor. None of these
 *         // properties are added to your class, the exception being the
 *         // constructor property, which if supplied, will be your classes
 *         // constructor.
 *         {
 *             // your classes namespace- if supplied, it will be 
 *             // created for you
 *             name: 'com.example.UserMediator'
 * 
 *             // your classes parent class. If supplied, inheritance 
 *             // will be taken care of for you
 *         ,   parent: puremvc.Mediator
 * 
 *             // your classes constructor. If not supplied, one will be 
 *             // created for you
 *         ,   constructor: function UserMediator (component)
 *             {
 *                  puremvc.Mediator.call(this, this.constructor.NAME, component);  
 *             }
 *         }
 *         
 *         // the second object supplied defines your class traits, that is
 *         // the properties that will be defined on your classes prototype
 *         // and thereby on all instances of this class
 *     ,   {
 *             businessMethod: function ()
 *             {
 *                 // impl 
 *             }
 *         }
 * 
 *         // the third object supplied defines your classes 'static' traits
 *         // that is, the methods and properties which will be defined on
 *         // your classes constructor
 *     ,   {
 *             NAME: 'userMediator'
 *         }
 *     );
 * 
 * @param {Object} [classinfo]
 *  An object describing the class. This object can have any or all of
 *  the following properties:
 * 
 *  - name: String  
 *      The classlets name. This can be any arbitrary qualified object
 *      name. 'com.example.Classlet' or simply 'MyClasslet' for example 
 *      The method will automatically create an object hierarchy refering
 *      to your class for you. Note that you will need to capture the 
 *      methods return value to retrieve a reference to your class if the
 *      class name property is not defined.

 *  - parent: Function
 *      The classlets 'superclass'. Your class will be extended from this
 *      if supplied.
 * 
 *  - constructor: Function
 *      The classlets constructor. Note this is *not* a post construct 
 *      initialize method, but your classes constructor Function.
 *      If this attribute is not defined, a constructor will be created for 
 *      you automatically. If you have supplied a parent class
 *      value and not defined the classes constructor, the automatically
 *      created constructor will invoke the super class constructor
 *      automatically. If you have supplied your own constructor and you
 *      wish to invoke it's super constructor, you must do this manually, as
 *      there is no reference to the classes parent added to the constructor
 *      prototype.
 *      
 *  - scope: Object.
 *      For use in advanced scenarios. If the name attribute has been supplied,
 *      this value will be the root of the object hierarchy created for you.
 *      Use it do define your own class hierarchies in private scopes,
 *      accross iFrames, in your unit tests, or avoid collision with third
 *      party library namespaces.
 * 
 * @param {Object} [traits]
 *  An Object, the properties of which will be added to the
 *  class constructors prototype.
 * 
 * @param {Object} [staitcTraits]
 *  An Object, the properties of which will be added directly
 *  to this class constructor
 * 
 * @return {Function}
 *  A reference to the classlets constructor
 */
function define (classInfo, traits, staticTraits)
{
    if (!classInfo)
    {
        classInfo= {}
    }

    var className= classInfo.name
    ,   classParent= classInfo.parent
    ,   doExtend= 'function' === typeof classParent
    ,   classConstructor
    ,   classScope= classInfo.scope || null
    ,   prototype

    if ('parent' in classInfo && !doExtend)
    {
        throw new TypeError('Class parent must be Function');
    }
        
    if (classInfo.hasOwnProperty('constructor'))
    {
        classConstructor= classInfo.constructor
        if ('function' !== typeof classConstructor)
        {
            throw new TypeError('Class constructor must be Function')
        }   
    }
    else // there is no constructor, create one
    {
        if (doExtend) // ensure to call the super constructor
        {
            classConstructor= function ()
            {
                classParent.apply(this, arguments);
            }
        }
        else // just create a Function
        {
            classConstructor= new Function;
        } 
    }

    if (doExtend)
    {
        OopHelp.extend(classConstructor, classParent);
    }
    
    if (traits)
    {
        prototype= classConstructor.prototype
        OopHelp.decorate(prototype, traits);
        // reassign constructor 
        prototype.constructor= classConstructor;
    }
    
    if (staticTraits)
    {
        OopHelp.decorate(classConstructor, staticTraits)
    }
    
    if (className)
    {
        if ('string' !== typeof className)
        {
            throw new TypeError('Class name must be primitive string');
        }
            
        declare (className, classConstructor, classScope);
    }    
    
    return classConstructor;            
};


	
 	/* implementation end */
 	 
 	// define the puremvc global namespace and export the actors
var puremvc =
 	{
 		View: View
 	,	Model: Model
 	,	Controller: Controller
 	,	SimpleCommand: SimpleCommand
 	,	MacroCommand: MacroCommand
 	,	Facade: Facade
 	,	Mediator: Mediator
 	,	Observer: Observer
 	,	Notification: Notification
 	,	Notifier: Notifier
 	,	Proxy: Proxy
 	,	define: define
 	,	declare: declare
 	};



module.exports = puremvc;
},{}],38:[function(require,module,exports){
/**
 * @fileOverview
 * PureMVC State Machine Utility JS Native Port by Saad Shams
 * Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * Reuse governed by Creative Commons Attribution 3.0 
 * http://creativecommons.org/licenses/by/3.0/us/
 * @author saad.shams@puremvc.org 
 */

var puremvc = require( './puremvc-1.0.1-mod.js' );
    
/**
 * Constructor
 *
 * Defines a State.
 * @method State
 * @param {string} name id the id of the state
 * @param {string} entering an optional notification name to be sent when entering this state
 * @param {string} exiting an optional notification name to be sent when exiting this state
 * @param {string} changed an optional notification name to be sent when fully transitioned to this state
 * @return 
 */

function State(name, entering, exiting, changed) {  
    this.name = name;
    if(entering) this.entering = entering;
    if(exiting) this.exiting = exiting;
    if(changed) this.changed = changed;
    this.transitions = {};
}

/**
 * Define a transition.
 * @method defineTrans
 * @param {string} action the name of the StateMachine.ACTION Notification type.
 * @param {string} target the name of the target state to transition to.
 * @return 
 */
State.prototype.defineTrans = function(action, target) {
    if(this.getTarget(action) != null) return;
    this.transitions[action] = target;
}

/**
 * Remove a previously defined transition.
 * @method removeTrans
 * @param {string} action
 * @return 
 */
State.prototype.removeTrans = function(action) {
    delete this.transitions[action];
}

/**
 * Get the target state name for a given action.
 * @method getTarget
 * @param {string} action
 * @return State
 */
/**
 * 
 */
State.prototype.getTarget = function(action) {
    return this.transitions[action] ? this.transitions[action] : null;
}

// The state name
State.prototype.name = null;

// The notification to dispatch when entering the state
State.prototype.entering = null;

// The notification to dispatch when exiting the state
State.prototype.exiting = null;

// The notification to dispatch when the state has actually changed
State.prototype.changed = null;

/**
 *  Transition map of actions to target states
 */ 
State.prototype.transitions = null;
    

    
 /**
 * A Finite State Machine implimentation.
 * <P>
 * Handles regisistration and removal of state definitions, 
 * which include optional entry and exit commands for each 
 * state.</P>
 */

/**
 * Constructor
 *
 * @method StateMachine
 * @return 
 */
function StateMachine() {
    puremvc.Mediator.call(this, StateMachine.NAME, null);
    this.states = {};
}
    
StateMachine.prototype = new puremvc.Mediator;
StateMachine.prototype.constructor = StateMachine;

/**
 * Transitions to initial state once registered with Facade
 * @method onRegister
 * @return 
 */
StateMachine.prototype.onRegister = function() {
    if(this.initial) this.transitionTo(this.initial, null);
}

/**
 * Registers the entry and exit commands for a given state.
 * @method registerState
 * @param {State} state the state to which to register the above commands
 * @param {boolean} initial boolean telling if this is the initial state of the system
 * @return 
 */
StateMachine.prototype.registerState = function(state, initial) {
    if(state == null || this.states[state.name] != null) return;
    this.states[state.name] = state;
    if(initial) this.initial = state;
}

/**
 * Remove a state mapping. Removes the entry and exit commands for a given state as well as the state mapping itself.
 * @method removeState
 * @param {string} stateName
 * @return 
 */
StateMachine.prototype.removeState = function(stateName) {
    var state = this.states[stateName];
    if(state == null) return;
    this.states[stateName] = null;
}

/**
 * Transitions to the given state from the current state.
 * <P>
 * Sends the <code>exiting</code> notification for the current state 
 * followed by the <code>entering</code> notification for the new state.
 * Once finally transitioned to the new state, the <code>changed</code> 
 * notification for the new state is sent.</P>
 * <P>
 * If a data parameter is provided, it is included as the body of all
 * three state-specific transition notes.</P>
 * <P>
 * Finally, when all the state-specific transition notes have been
 * sent, a <code>StateMachine.CHANGED</code> note is sent, with the
 * new <code>State</code> object as the <code>body</code> and the name of the 
 * new state in the <code>type</code>.
 *
 * @method transitionTo
 * @param {State} nextState the next State to transition to.
 * @param {Object} data is the optional Object that was sent in the <code>StateMachine.ACTION</code> notification body
 * @return 
 */
StateMachine.prototype.transitionTo = function(nextState, data) {
    // Going nowhere?
    if(nextState == null) return;
    
    // Clear the cancel flag
    this.canceled = false;
    
    // Exit the current State 
    if(this.getCurrentState() && this.getCurrentState().exiting) 
        this.sendNotification(this.getCurrentState().exiting, data, nextState.name);
    
    // Check to see whether the exiting guard has canceled the transition
    if(this.canceled) {
        this.canceled = false;
        return;
    }
    
    // Enter the next State 
    if(nextState.entering)
        this.sendNotification(nextState.entering, data);
    
    // Check to see whether the entering guard has canceled the transition
    if(this.canceled) {
        this.canceled = false;
        return;
    }
    
    // change the current state only when both guards have been passed
    this.setCurrentState(nextState);
    
    // Send the notification configured to be sent when this specific state becomes current 
    if(nextState.changed) {
        this.sendNotification(this.getCurrentState().changed, data);
    }
    
    // Notify the app generally that the state changed and what the new state is 
    this.sendNotification(StateMachine.CHANGED, this.getCurrentState(), this.getCurrentState().name);
}

/**
 * Notification interests for the StateMachine.
 * @method listNotificationInterests
 * @return {Array} Array of Notifications
 */

StateMachine.prototype.listNotificationInterests = function() {
    return [
        StateMachine.ACTION,
        StateMachine.CANCEL
    ];
}

/**
 * Handle notifications the <code>StateMachine</code> is interested in.
 * <P>
 * <code>StateMachine.ACTION</code>: Triggers the transition to a new state.<BR>
 * <code>StateMachine.CANCEL</code>: Cancels the transition if sent in response to the exiting note for the current state.<BR>
 *
 * @method handleNotification
 * @param {Notification} notification
 * @return 
 */
StateMachine.prototype.handleNotification = function(notification) {
    switch(notification.getName()) {
        case StateMachine.ACTION:
            var action = notification.getType();
            var target = this.getCurrentState().getTarget(action);
            var newState = this.states[target];
            if(newState) this.transitionTo(newState, notification.getBody());
            break;
            
        case StateMachine.CANCEL:
            this.canceled = true;
            break;
    }
}

/**
 * Get the current state.
 * @method getCurrentState
 * @return a State defining the machine's current state
 */
StateMachine.prototype.getCurrentState = function() {
    return this.viewComponent;
}

/**
 * Set the current state.
 * @method setCurrentState
 * @param {State} state
 * @return 
 */
StateMachine.prototype.setCurrentState = function(state) {
    this.viewComponent = state;
}

/**
 * Map of States objects by name.
 */
StateMachine.prototype.states = null;

/**
 * The initial state of the FSM.
 */
StateMachine.prototype.initial = null;

/**
 * The transition has been canceled.
 */
StateMachine.prototype.canceled = null;
    
StateMachine.NAME = "StateMachine";

/**
 * Action Notification name. 
 */ 
StateMachine.ACTION = StateMachine.NAME + "/notes/action";

/**
 *  Changed Notification name  
 */ 
StateMachine.CHANGED = StateMachine.NAME + "/notes/changed";

/**
 *  Cancel Notification name  
 */ 
StateMachine.CANCEL = StateMachine.NAME + "/notes/cancel";
    
    
/**
 * Creates and registers a StateMachine described in JSON.
 * 
 * <P>
 * This allows reconfiguration of the StateMachine 
 * without changing any code, as well as making it 
 * easier than creating all the <code>State</code> 
 * instances and registering them with the 
 * <code>StateMachine</code> at startup time.
 * 
 * @ see State
 * @ see StateMachine
 */

/**
 * Constructor
 * @method FSMInjector
 * @param {Object} fsm JSON Object
 * @return 
 */
function FSMInjector(fsm) {
    puremvc.Notifier.call(this);
    this.fsm = fsm;
}
  
FSMInjector.prototype = new puremvc.Notifier;
FSMInjector.prototype.constructor = FSMInjector;

/**
 * Inject the <code>StateMachine</code> into the PureMVC apparatus.
 * <P>
 * Creates the <code>StateMachine</code> instance, registers all the states
 * and registers the <code>StateMachine</code> with the <code>IFacade</code>.
 * @method inject
 * @return 
 */
FSMInjector.prototype.inject = function() {
    // Create the StateMachine
    var stateMachine = new puremvc.statemachine.StateMachine();
    
    // Register all the states with the StateMachine
    var states = this.getStates();
    for(var i=0; i<states.length; i++) {
        stateMachine.registerState(states[i], this.isInitial(states[i].name));
    }
    
    // Register the StateMachine with the facade
    this.facade.registerMediator(stateMachine);
}

/**
 * Get the state definitions.
 * <P>
 * Creates and returns the array of State objects 
 * from the FSM on first call, subsequently returns
 * the existing array.</P>
 *
 * @method getStates
 * @return {Array} Array of States
 */
FSMInjector.prototype.getStates = function() {
    if(this.stateList == null) {
        this.stateList = [];

        var stateDefs = this.fsm.state ? this.fsm.state : [];
        for(var i=0; i<stateDefs.length; i++) {
            var stateDef = stateDefs[i];
            var state = this.createState(stateDef);
            this.stateList.push(state);
        }
    }
    return this.stateList;
}

/**
 * Creates a <code>State</code> instance from its JSON definition.
 * @method createState
 * @param {Object} stateDef JSON Object
 * @return {State} 
 */
/**

 */
FSMInjector.prototype.createState = function(stateDef) {
    // Create State object
    var name = stateDef['@name'];
    var exiting = stateDef['@exiting'];
    var entering = stateDef['@entering'];
    var changed = stateDef['@changed'];
    var state = new puremvc.statemachine.State(name, entering, exiting, changed);
    
    // Create transitions
    var transitions = stateDef.transition ? stateDef.transition : [];
    for(var i=0; i<transitions.length; i++) {
        var transDef = transitions[i];
        state.defineTrans(transDef['@action'], transDef['@target']);
    }
    return state;
}

/**
 * Is the given state the initial state?
 * @method isInitial
 * @param {string} stateName
 * @return {boolean}
 */
FSMInjector.prototype.isInitial = function(stateName) {
    var initial = this.fsm['@initial'];
    return stateName == initial;
}

// The JSON FSM definition
FSMInjector.prototype.fsm = null;

// The List of State objects
FSMInjector.prototype.stateList = null;


puremvc.statemachine =
{
    State: State
    ,	StateMachine: StateMachine
    ,	FSMInjector: FSMInjector
};

module.exports = puremvc.statemachine;
},{"./puremvc-1.0.1-mod.js":37}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxub2RlanNcXG5wbV9nbG9iYWxcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiTVZDSGVsbG9Xb3JsZFxcanNcXEFwcEZhY2FkZS5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFxhcHAuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcY29udHJvbGxlclxcY29tbWFuZFxcSW5qZWN0RlNNQ29tbWFuZC5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFxjb250cm9sbGVyXFxjb21tYW5kXFxQcmVwQ29udHJvbGxlckNvbW1hbmQuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcY29udHJvbGxlclxcY29tbWFuZFxcUHJlcE1vZGVsQ29tbWFuZC5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFxjb250cm9sbGVyXFxjb21tYW5kXFxQcmVwVmlld0NvbW1hbmQuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcY29udHJvbGxlclxcY29tbWFuZFxcU3RhcnR1cENvbW1hbmQuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcbW9kZWxcXGRvbWFpblxcUmVjdGFuZ2xlLmpzIiwiTVZDSGVsbG9Xb3JsZFxcanNcXG1vZGVsXFxwcm94eVxcQXBwQ29uZmlnUHJveHkuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcbW9kZWxcXHByb3h5XFxCb29rUHJveHkuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcbW9kZWxcXHByb3h5XFxHYW1lUHJveHkuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcbW9kZWxcXHByb3h5XFxSZWN0YW5nbGVQcm94eS5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFxwcm9maWxlXFxmbG93XFxTY2VuZUFjdGlvbi5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFxwcm9maWxlXFxmbG93XFxTY2VuZUZzbS5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFxwcm9maWxlXFxmbG93XFxTY2VuZVN0YXRlLmpzIiwiTVZDSGVsbG9Xb3JsZFxcanNcXHByb2ZpbGVcXGZsb3dcXFNjZW5lVHJhbnNpdGlvbi5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFx2aWV3XFxjb21wb25lbnRcXEJvb2tMYXllci5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFx2aWV3XFxjb21wb25lbnRcXERyYXdMYXllci5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFx2aWV3XFxjb21wb25lbnRcXEdhbWVMYXllci5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFx2aWV3XFxjb21wb25lbnRcXEdhbWVPdmVyTGF5ZXIuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcdmlld1xcY29tcG9uZW50XFxIZWxsb0xheWVyLmpzIiwiTVZDSGVsbG9Xb3JsZFxcanNcXHZpZXdcXGNvbXBvbmVudFxcTWVudUxheWVyLmpzIiwiTVZDSGVsbG9Xb3JsZFxcanNcXHZpZXdcXG1lZGlhdG9yXFxCb29rTWVkaWF0b3IuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcdmlld1xcbWVkaWF0b3JcXERpcmVjdG9yTWVkaWF0b3IuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcdmlld1xcbWVkaWF0b3JcXERyYXdNZWRpYXRvci5qcyIsIk1WQ0hlbGxvV29ybGRcXGpzXFx2aWV3XFxtZWRpYXRvclxcR2FtZU1lZGlhdG9yLmpzIiwiTVZDSGVsbG9Xb3JsZFxcanNcXHZpZXdcXG1lZGlhdG9yXFxHYW1lT3Zlck1lZGlhdG9yLmpzIiwiTVZDSGVsbG9Xb3JsZFxcanNcXHZpZXdcXG1lZGlhdG9yXFxIZWxsb01lZGlhdG9yLmpzIiwiTVZDSGVsbG9Xb3JsZFxcanNcXHZpZXdcXG1lZGlhdG9yXFxNZW51TWVkaWF0b3IuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcdmlld1xcbWVkaWF0b3JcXFNjZW5lTWVkaWF0b3IuanMiLCJNVkNIZWxsb1dvcmxkXFxqc1xcdmlld1xcdWlcXFJlc291cmNlLmpzIiwibm9kZV9tb2R1bGVzXFxHZW5lQ29jb3NKU1xcY2xhc3NcXExvYWRlclNjZW5lLmpzIiwibm9kZV9tb2R1bGVzXFxHZW5lQ29jb3NKU1xcaW5kZXguanMiLCJub2RlX21vZHVsZXNcXEdlbmVKU1xcZWFzZWpzLmpzIiwibm9kZV9tb2R1bGVzXFxHZW5lSlNcXGluZGV4LmpzIiwibm9kZV9tb2R1bGVzXFxwdXJlbXZjXFxpbmRleC5qcyIsIm5vZGVfbW9kdWxlc1xccHVyZW12Y1xcbGliXFxwdXJlbXZjLTEuMC4xLW1vZC5qcyIsIm5vZGVfbW9kdWxlc1xccHVyZW12Y1xcbGliXFxwdXJlbXZjLXN0YXRlbWFjaGluZS0xLjAtbW9kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3g1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxudmFyIFN0YXJ0dXBDb21tYW5kID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL2NvbW1hbmQvU3RhcnR1cENvbW1hbmQuanMnKTtcclxuXHJcbnZhciBBcHBGYWNhZGUgPSBtb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lKFxyXG4gICAgLy8gQ0xBU1MgSU5GT1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdBcHBGYWNhZGUnLFxyXG4gICAgICAgIHBhcmVudDogcHVyZW12Yy5GYWNhZGUsXHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAobXVsdGl0b25LZXkpIHtcclxuICAgICAgICAgICAgcHVyZW12Yy5GYWNhZGUuY2FsbCh0aGlzLCBtdWx0aXRvbktleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBpbml0aWFsaXplQ29udHJvbGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBwdXJlbXZjLkZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZUNvbnRyb2xsZXIuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckNvbW1hbmQoQXBwRmFjYWRlLlNUQVJUVVAsIFN0YXJ0dXBDb21tYW5kKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXRpYWxpemVNb2RlbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBwdXJlbXZjLkZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZU1vZGVsLmNhbGwodGhpcyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0aWFsaXplVmlldzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBwdXJlbXZjLkZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZVZpZXcuY2FsbCh0aGlzKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdGFydHVwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZE5vdGlmaWNhdGlvbihBcHBGYWNhZGUuU1RBUlRVUCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgZ2V0SW5zdGFuY2U6IGZ1bmN0aW9uKG11bHRpdG9uS2V5KSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZU1hcCA9IHB1cmVtdmMuRmFjYWRlLmluc3RhbmNlTWFwO1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBpbnN0YW5jZU1hcFttdWx0aXRvbktleV07XHJcbiAgICAgICAgICAgIGlmKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlTWFwW211bHRpdG9uS2V5XSA9IG5ldyBBcHBGYWNhZGUobXVsdGl0b25LZXkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgTkFNRTogJ0FwcEZhY2FkZScsXHJcbiAgICAgICAgU1RBUlRVUDogJ1N0YXJ0dXAnXHJcbiAgICB9XHJcbik7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgQXBwRmFjYWRlID0gcmVxdWlyZSgnLi9BcHBGYWNhZGUuanMnKTtcclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgIGNjLmdhbWUuY29uZmlnW2NjLmdhbWUuQ09ORklHX0tFWS5kZWJ1Z01vZGVdID0gMTtcclxuICAgIGNjLmdhbWUuY29uZmlnW2NjLmdhbWUuQ09ORklHX0tFWS5zaG93RlBTXSA9IHRydWU7XHJcbiAgICBjYy5nYW1lLmNvbmZpZ1tjYy5nYW1lLkNPTkZJR19LRVkuZnJhbWVSYXRlXSA9IDYwO1xyXG4gICAgY2MuZ2FtZS5jb25maWdbY2MuZ2FtZS5DT05GSUdfS0VZLmlkXSA9ICdnYW1lQ2FudmFzJztcclxuICAgIGNjLmdhbWUuY29uZmlnW2NjLmdhbWUuQ09ORklHX0tFWS5yZW5kZXJNb2RlXSA9IDA7XHJcblxyXG4gICAgY2MuZ2FtZS5vblN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBjYy52aWV3LmFkanVzdFZpZXdQb3J0KHRydWUpO1xyXG4gICAgICAgIGNjLnZpZXcuc2V0RGVzaWduUmVzb2x1dGlvblNpemUoODAwLDQ1MCxjYy5SZXNvbHV0aW9uUG9saWN5LlNIT1dfQUxMKTtcclxuICAgICAgICBjYy52aWV3LnJlc2l6ZVdpdGhCcm93c2VyU2l6ZSh0cnVlKTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5zZXRQcm9qZWN0aW9uKGNjLkRpcmVjdG9yLlBST0pFQ1RJT05fMkQpO1xyXG5cclxuICAgICAgICB2YXIga2V5ID0gJ01WQ19IRUxMT1dPUkxEJztcclxuICAgICAgICBBcHBGYWNhZGUuZ2V0SW5zdGFuY2Uoa2V5KS5zdGFydHVwKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNjLmdhbWUucnVuKCk7XHJcbn0pKCk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxudmFyIFNjZW5lRnNtID0gcmVxdWlyZSgnLi8uLi8uLi9wcm9maWxlL2Zsb3cvU2NlbmVGc20uanMnKS5TY2VuZUZzbTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmVcclxuKFxyXG4gICAgLy8gQ0xBU1MgSU5GT1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdjb250cm9sbGVyLmNvbW1hbmQuSW5qZWN0RlNNQ29tbWFuZCcsXHJcbiAgICAgICAgcGFyZW50OnB1cmVtdmMuU2ltcGxlQ29tbWFuZFxyXG4gICAgfSxcclxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgZXhlY3V0ZTogZnVuY3Rpb24gKG5vdGlmaWNhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNjLmxvZygnSW5qZWN0RlNNQ29tbWFuZCBleGVjdXRlJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2NlbmVGc20gPSBuZXcgU2NlbmVGc20oKTtcclxuICAgICAgICAgICAgdmFyIGZzbSA9IHNjZW5lRnNtLmNyZWF0ZUZzbSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGluamVjdG9yID0gbmV3IHB1cmVtdmMuc3RhdGVtYWNoaW5lLkZTTUluamVjdG9yKGZzbSk7XHJcbiAgICAgICAgICAgIGluamVjdG9yLmluaXRpYWxpemVOb3RpZmllcih0aGlzLm11bHRpdG9uS2V5KTtcclxuICAgICAgICAgICAgaW5qZWN0b3IuaW5qZWN0KCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdQcmVwQ29udHJvbGxlckNvbW1hbmQnXHJcbiAgICB9XHJcbik7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmVcclxuKFxyXG4gICAgLy8gQ0xBU1MgSU5GT1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdjb250cm9sbGVyLmNvbW1hbmQuUHJlcENvbnRyb2xsZXJDb21tYW5kJyxcclxuICAgICAgICBwYXJlbnQ6cHVyZW12Yy5TaW1wbGVDb21tYW5kXHJcbiAgICB9LFxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBleGVjdXRlOiBmdW5jdGlvbiAobm90aWZpY2F0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2MubG9nKCdQcmVwQ29udHJvbGxlckNvbW1hbmQgZXhlY3V0ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdQcmVwQ29udHJvbGxlckNvbW1hbmQnXHJcbiAgICB9XHJcbik7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxudmFyIEFwcENvbmZpZ1Byb3h5ID0gcmVxdWlyZSgnLi8uLi8uLi9tb2RlbC9wcm94eS9BcHBDb25maWdQcm94eScpO1xyXG52YXIgR2FtZVByb3h5ID0gcmVxdWlyZSgnLi8uLi8uLi9tb2RlbC9wcm94eS9HYW1lUHJveHknKTtcclxudmFyIFJlY3RhbmdsZVByb3h5ID0gcmVxdWlyZSgnLi8uLi8uLi9tb2RlbC9wcm94eS9SZWN0YW5nbGVQcm94eScpO1xyXG52YXIgQm9va1Byb3h5ID0gcmVxdWlyZSgnLi8uLi8uLi9tb2RlbC9wcm94eS9Cb29rUHJveHknKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lXHJcbihcclxuICAgIC8vIENMQVNTIElORk9cclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnY29udHJvbGxlci5jb21tYW5kLlByZXBNb2RlbENvbW1hbmQnLFxyXG4gICAgICAgIHBhcmVudDpwdXJlbXZjLlNpbXBsZUNvbW1hbmRcclxuICAgIH0sXHJcbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uIChub3RpZmljYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYy5sb2coJ1ByZXBNb2RlbENvbW1hbmQgZXhlY3V0ZScpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5mYWNhZGUucmVnaXN0ZXJQcm94eShuZXcgQXBwQ29uZmlnUHJveHkoKSApO1xyXG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3RlclByb3h5KG5ldyBHYW1lUHJveHkoKSApO1xyXG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3RlclByb3h5KG5ldyBSZWN0YW5nbGVQcm94eSgpICk7XHJcbiAgICAgICAgICAgIHRoaXMuZmFjYWRlLnJlZ2lzdGVyUHJveHkobmV3IEJvb2tQcm94eSgpICk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdQcmVwTW9kZWxDb21tYW5kJ1xyXG4gICAgfVxyXG4pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XHJcbnZhciBEaXJlY3Rvck1lZGlhdG9yID0gcmVxdWlyZSgnLi8uLi8uLi92aWV3L21lZGlhdG9yL0RpcmVjdG9yTWVkaWF0b3IuanMnKTtcclxudmFyIFNjZW5lTWVkaWF0b3IgPSByZXF1aXJlKCcuLy4uLy4uL3ZpZXcvbWVkaWF0b3IvU2NlbmVNZWRpYXRvci5qcycpO1xyXG52YXIgTWVudU1lZGlhdG9yID0gcmVxdWlyZSgnLi8uLi8uLi92aWV3L21lZGlhdG9yL01lbnVNZWRpYXRvci5qcycpO1xyXG52YXIgSGVsbG9NZWRpYXRvciA9IHJlcXVpcmUoJy4vLi4vLi4vdmlldy9tZWRpYXRvci9IZWxsb01lZGlhdG9yLmpzJyk7XHJcbnZhciBHYW1lTWVkaWF0b3IgPSByZXF1aXJlKCcuLy4uLy4uL3ZpZXcvbWVkaWF0b3IvR2FtZU1lZGlhdG9yLmpzJyk7XHJcbnZhciBHYW1lT3Zlck1lZGlhdG9yID0gcmVxdWlyZSgnLi8uLi8uLi92aWV3L21lZGlhdG9yL0dhbWVPdmVyTWVkaWF0b3IuanMnKTtcclxudmFyIERyYXdNZWRpYXRvciA9IHJlcXVpcmUoJy4vLi4vLi4vdmlldy9tZWRpYXRvci9EcmF3TWVkaWF0b3IuanMnKTtcclxudmFyIEJvb2tNZWRpYXRvciA9IHJlcXVpcmUoJy4vLi4vLi4vdmlldy9tZWRpYXRvci9Cb29rTWVkaWF0b3IuanMnKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lXHJcbihcclxuICAgIC8vIENMQVNTIElORk9cclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnY29udHJvbGxlci5jb21tYW5kLlByZXBWaWV3Q29tbWFuZCcsXHJcbiAgICAgICAgcGFyZW50OnB1cmVtdmMuU2ltcGxlQ29tbWFuZFxyXG4gICAgfSxcclxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgZXhlY3V0ZTogZnVuY3Rpb24gKG5vdGlmaWNhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNjLmxvZygnUHJlcFZpZXdDb21tYW5kIGV4ZWN1dGUnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmFjYWRlLnJlZ2lzdGVyTWVkaWF0b3IoIG5ldyBEaXJlY3Rvck1lZGlhdG9yKCkgKTtcclxuICAgICAgICAgICAgdGhpcy5mYWNhZGUucmVnaXN0ZXJNZWRpYXRvciggbmV3IFNjZW5lTWVkaWF0b3IoKSApO1xyXG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3Rlck1lZGlhdG9yKCBuZXcgTWVudU1lZGlhdG9yKCkgKTtcclxuICAgICAgICAgICAgdGhpcy5mYWNhZGUucmVnaXN0ZXJNZWRpYXRvciggbmV3IEhlbGxvTWVkaWF0b3IoKSApO1xyXG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3Rlck1lZGlhdG9yKCBuZXcgR2FtZU1lZGlhdG9yKCkgKTtcclxuICAgICAgICAgICAgdGhpcy5mYWNhZGUucmVnaXN0ZXJNZWRpYXRvciggbmV3IEdhbWVPdmVyTWVkaWF0b3IoKSApO1xyXG4gICAgICAgICAgICB0aGlzLmZhY2FkZS5yZWdpc3Rlck1lZGlhdG9yKCBuZXcgRHJhd01lZGlhdG9yICgpICk7XHJcbiAgICAgICAgICAgIHRoaXMuZmFjYWRlLnJlZ2lzdGVyTWVkaWF0b3IoIG5ldyBCb29rTWVkaWF0b3IgKCkgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBOQU1FOiAnUHJlcFZpZXdDb21tYW5kJ1xyXG4gICAgfVxyXG4pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XHJcbnZhciBQcmVwTW9kZWxDb21tYW5kID0gcmVxdWlyZSgnLi9QcmVwTW9kZWxDb21tYW5kLmpzJyk7XHJcbnZhciBQcmVwVmlld0NvbW1hbmQgPSByZXF1aXJlKCcuL1ByZXBWaWV3Q29tbWFuZC5qcycpO1xyXG52YXIgUHJlcENvbnRyb2xsZXJDb21tYW5kID0gcmVxdWlyZSgnLi9QcmVwQ29udHJvbGxlckNvbW1hbmQuanMnKTtcclxudmFyIEluamVjdEZTTUNvbW1hbmQgPSByZXF1aXJlKCcuL0luamVjdEZTTUNvbW1hbmQuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmVcclxuKFxyXG4gICAgLy8gQ0xBU1MgSU5GT1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdjb250cm9sbGVyLmNvbW1hbmQuU3RhcnR1cENvbW1hbmQnLFxyXG4gICAgICAgIHBhcmVudDpwdXJlbXZjLk1hY3JvQ29tbWFuZFxyXG4gICAgfSxcclxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgaW5pdGlhbGl6ZU1hY3JvQ29tbWFuZDogZnVuY3Rpb24gKG5vdGlmaWNhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU3ViQ29tbWFuZChQcmVwTW9kZWxDb21tYW5kKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRTdWJDb21tYW5kKFByZXBWaWV3Q29tbWFuZCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU3ViQ29tbWFuZChQcmVwQ29udHJvbGxlckNvbW1hbmQpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFN1YkNvbW1hbmQoSW5qZWN0RlNNQ29tbWFuZCApO1xyXG5cclxuICAgICAgICB9XHJcbn0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdTdGFydHVwQ29tbWFuZCdcclxuICAgIH1cclxuKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgR2VuZUpTID0gcmVxdWlyZSgnR2VuZUpTJyk7XHJcblxyXG52YXIgUmVjdGFuZ2xlID0gR2VuZUpTLkNsYXNzKHtcclxuXHJcbiAgICAncHVibGljIF93aWR0aCc6IG51bGwsXHJcbiAgICAncHJpdmF0ZSBfaGVpZ2h0JzogbnVsbCxcclxuXHJcbiAgICAncHVibGljIF9fY29uc3RydWN0JzogZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICAncHVibGljIGdldFdpZHRoJzogZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcclxuICAgIH0sXHJcblxyXG4gICAgJ3B1YmxpYyBzZXRXaWR0aCc6IGZ1bmN0aW9uKHdpZHRoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAncHVibGljIGdldEhlaWdodCc6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICAncHVibGljIHNldEhlaWdodCc6IGZ1bmN0aW9uKGhlaWdodClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgICdwdWJsaWMgZ2V0QXJlYSc6IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGggKiB0aGlzLl9oZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgICdwdWJsaWMgc3RhdGljIGdldEFyZWFTdGF0aWMnOiBmdW5jdGlvbiggd2lkdGgsIGhlaWdodCApXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHdpZHRoICogaGVpZ2h0O1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydHMuUmVjdGFuZ2xlID0gUmVjdGFuZ2xlO1xyXG5cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ21vZGVsLnByb3h5LkFwcENvbmZpZ1Byb3h5JyxcclxuICAgICAgICBwYXJlbnQ6cHVyZW12Yy5Qcm94eSxcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBwdXJlbXZjLlByb3h5LmNhbGwodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgX2NvbmZpZzogbnVsbCxcclxuXHJcbiAgICAgICAgb25SZWdpc3RlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZERhdGEoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxvYWREYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gXCJqcy9hcHAuY29uZmlnXCI7XHJcblxyXG4gICAgICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0ICYmIHhtbGh0dHAuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2NvbmZpZyA9IEpTT04ucGFyc2UoeG1saHR0cC5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbmROb3RpZmljYXRpb24oJ1dyaXRlQXBwQ29uZmlnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeG1saHR0cC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhtbGh0dHAuc2VuZCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0QXBwTmFtZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuQXBwTmFtZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldEFwcFZlcnNpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLkFwcFZlcnNpb247XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRBcHBEZXNjcmlwdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuQXBwRGVzY3JpcHRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgTkFNRTogJ0FwcENvbmZpZ1Byb3h5J1xyXG4gICAgfVxyXG4pO1xyXG5cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ21vZGVsLnByb3h5LkJvb2tQcm94eScsXHJcbiAgICAgICAgcGFyZW50OnB1cmVtdmMuUHJveHksXHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcHVyZW12Yy5Qcm94eS5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIF9ib29rczogbnVsbCxcclxuICAgICAgICBfYm9va0luZGV4OiAwLFxyXG5cclxuICAgICAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkRGF0YSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9ib29rSW5kZXggPSAwO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGxvYWREYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gXCJkYXRhL2Jvb2suanNvblwiO1xyXG5cclxuICAgICAgICAgICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICh4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiB4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLl9ib29rcyA9IEpTT04ucGFyc2UoeG1saHR0cC5yZXNwb25zZVRleHQpLmJvb2tzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHhtbGh0dHAub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgICAgICAgICB4bWxodHRwLnNlbmQoKTtcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgZ2V0Qm9vazogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgdmFyIGJvb2sgPSB0aGlzLl9ib29rc1t0aGlzLl9ib29rSW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Jvb2tJbmRleCA8IHRoaXMuX2Jvb2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYm9va0luZGV4Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ib29rSW5kZXggPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYm9vaztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldEJvb2tJbmRleDogZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9va0luZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgTkFNRTogJ0Jvb2tQcm94eSdcclxuICAgIH1cclxuKTtcclxuXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxudmFyIFNjZW5lQWN0aW9uID0gcmVxdWlyZSgnLi8uLi8uLi9wcm9maWxlL2Zsb3cvU2NlbmVBY3Rpb24uanMnKS5TY2VuZUFjdGlvbjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmVcclxuKFxyXG4gICAgLy8gQ0xBU1MgSU5GT1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdtb2RlbC5wcm94eS5HYW1lUHJveHknLFxyXG4gICAgICAgIHBhcmVudDogcHVyZW12Yy5Qcm94eSxcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcHVyZW12Yy5Qcm94eS5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG5cclxuICAgICAgICBfbGlmZTogMCxcclxuXHJcbiAgICAgICAgb25SZWdpc3RlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9saWZlID0gMTA7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0TGlmZTogZnVuY3Rpb24gKGxpZmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpZmU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0TGlmZTogZnVuY3Rpb24gKGxpZmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlmZSA9IGxpZmU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5jTGlmZTogZnVuY3Rpb24gKGNiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpZmUrKztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkZWNMaWZlOiBmdW5jdGlvbiAoY2IpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlmZS0tO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpZmUgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kTm90aWZpY2F0aW9uKHB1cmVtdmMuc3RhdGVtYWNoaW5lLlN0YXRlTWFjaGluZS5BQ1RJT04sIG51bGwsIFNjZW5lQWN0aW9uLiQoJ0dBTUVfT1ZFUl9BQ1RJT04nKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYih0aGlzLl9saWZlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBOQU1FOiAnR2FtZVByb3h5J1xyXG4gICAgfVxyXG4pO1xyXG5cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xyXG52YXIgUmVjdGFuZ2xlID0gcmVxdWlyZSgnLi8uLi9kb21haW4vUmVjdGFuZ2xlLmpzJykuUmVjdGFuZ2xlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ21vZGVsLnByb3h5LlJlY3RhbmdsZVByb3h5JyxcclxuICAgICAgICBwYXJlbnQ6cHVyZW12Yy5Qcm94eSxcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKGNvbmZpZykge1xyXG4gICAgICAgICAgICBwdXJlbXZjLlByb3h5LmNhbGwodGhpcyk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgX3JlY3RhbmdsZTogbnVsbCxcclxuXHJcbiAgICAgICAgb25SZWdpc3RlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoNDAsIDMwKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFdpZHRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlY3RhbmdsZS5nZXRXaWR0aCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0V2lkdGg6IGZ1bmN0aW9uKHdpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3RhbmdsZS5zZXRXaWR0aCh3aWR0aCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRIZWlnaHQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVjdGFuZ2xlLmdldEhlaWdodCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0SGVpZ2h0OiBmdW5jdGlvbihoZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjdGFuZ2xlLnNldEhlaWdodChoZWlnaHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0QXJlYTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWN0YW5nbGUuZ2V0QXJlYSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBOQU1FOiAnUmVjdGFuZ2xlUHJveHknXHJcbiAgICB9XHJcbik7XHJcblxyXG4iLCJ2YXIgR2VuZUpTID0gcmVxdWlyZSgnR2VuZUpTJyk7XHJcblxyXG4vLyBBY3Rpb24g5Yqo5L2cXHJcbnZhciBTY2VuZUFjdGlvbiA9IEdlbmVKUy5DbGFzcyh7XHJcbiAgICAncHVibGljIGNvbnN0IEhPTUVfQUNUSU9OJzogJ0hvbWVBY3Rpb24nLFxyXG4gICAgJ3B1YmxpYyBjb25zdCBNRU5VX0FDVElPTic6ICdNZW51QWN0aW9uJyxcclxuICAgICdwdWJsaWMgY29uc3QgSEVMTE9fQUNUSU9OJzogJ0hlbGxvQWN0aW9uJyxcclxuICAgICdwdWJsaWMgY29uc3QgR0FNRV9BQ1RJT04nOiAnR2FtZUFjdGlvbicsXHJcbiAgICAncHVibGljIGNvbnN0IEdBTUVfT1ZFUl9BQ1RJT04nOiAnR2FtZU92ZXJBY3Rpb24nLFxyXG4gICAgJ3B1YmxpYyBjb25zdCBEUkFXX0FDVElPTic6ICdEcmF3QWN0aW9uJyxcclxuICAgICdwdWJsaWMgY29uc3QgQk9PS19BQ1RJT04nOiAnQm9va0FjdGlvbidcclxuXHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydHMuU2NlbmVBY3Rpb24gPSBTY2VuZUFjdGlvbjsiLCJ2YXIgR2VuZUpTID0gcmVxdWlyZSgnR2VuZUpTJyk7XHJcblxyXG52YXIgU2NlbmVTdGF0ZSA9IHJlcXVpcmUoJy4vU2NlbmVTdGF0ZS5qcycpLlNjZW5lU3RhdGU7XHJcbnZhciBTY2VuZUFjdGlvbiA9IHJlcXVpcmUoJy4vU2NlbmVBY3Rpb24uanMnKS5TY2VuZUFjdGlvbjtcclxudmFyIFNjZW5lVHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vU2NlbmVUcmFuc2l0aW9uLmpzJykuU2NlbmVUcmFuc2l0aW9uO1xyXG5cclxudmFyIFNjZW5lRnNtID0gR2VuZUpTLkNsYXNzKHtcclxuICAgICdwdWJsaWMgY3JlYXRlRnNtJzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGZzbSA9IHtcclxuICAgICAgICAgICAgLy8g5byA5aeL54q25oCBXHJcbiAgICAgICAgICAgIFwiQGluaXRpYWxcIjogU2NlbmVTdGF0ZS4kKCdNRU5VX01FRElBVE9SJyksXHJcbiAgICAgICAgICAgIFwic3RhdGVcIjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE1lbnVcclxuICAgICAgICAgICAgICAgICAgICBcIkBuYW1lXCI6IFNjZW5lU3RhdGUuJCgnTUVOVV9NRURJQVRPUicpLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vXCJAY2hhbmdlZFwiOiBTY2VuZVRyYW5zaXRpb24gLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHJhbnNpdGlvblwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGFjdGlvblwiOiBTY2VuZUFjdGlvbi4kKCdIRUxMT19BQ1RJT04nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQHRhcmdldFwiOiBTY2VuZVN0YXRlLiQoJ0hFTExPX01FRElBVE9SJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAYWN0aW9uXCI6IFNjZW5lQWN0aW9uLiQoJ0dBTUVfQUNUSU9OJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkB0YXJnZXRcIjogU2NlbmVTdGF0ZS4kKCdHQU1FX01FRElBVE9SJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAYWN0aW9uXCI6IFNjZW5lQWN0aW9uLiQoJ0RSQVdfQUNUSU9OJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkB0YXJnZXRcIjogU2NlbmVTdGF0ZS4kKCdEUkFXX01FRElBVE9SJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAYWN0aW9uXCI6IFNjZW5lQWN0aW9uLiQoJ0JPT0tfQUNUSU9OJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkB0YXJnZXRcIjogU2NlbmVTdGF0ZS4kKCdCT09LX01FRElBVE9SJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGVsbG9cclxuICAgICAgICAgICAgICAgICAgICBcIkBuYW1lXCI6IFNjZW5lU3RhdGUuJCgnSEVMTE9fTUVESUFUT1InKSxcclxuICAgICAgICAgICAgICAgICAgICAvL1wiQGNoYW5nZWRcIjogU2NlbmVUcmFuc2l0aW9uICxcclxuICAgICAgICAgICAgICAgICAgICBcInRyYW5zaXRpb25cIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkBhY3Rpb25cIjogU2NlbmVBY3Rpb24uJCgnSE9NRV9BQ1RJT04nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQHRhcmdldFwiOiBTY2VuZVN0YXRlLiQoJ01FTlVfTUVESUFUT1InKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBHYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgXCJAbmFtZVwiOiBTY2VuZVN0YXRlLiQoJ0dBTUVfTUVESUFUT1InKSxcclxuICAgICAgICAgICAgICAgICAgICAvL1wiQGNoYW5nZWRcIjogU2NlbmVUcmFuc2l0aW9uICxcclxuICAgICAgICAgICAgICAgICAgICBcInRyYW5zaXRpb25cIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkBhY3Rpb25cIjogU2NlbmVBY3Rpb24uJCgnR0FNRV9PVkVSX0FDVElPTicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAdGFyZ2V0XCI6IFNjZW5lU3RhdGUuJCgnR0FNRV9PVkVSX01FRElBVE9SJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2FtZU92ZXJcclxuICAgICAgICAgICAgICAgICAgICBcIkBuYW1lXCI6IFNjZW5lU3RhdGUuJCgnR0FNRV9PVkVSX01FRElBVE9SJyksXHJcbiAgICAgICAgICAgICAgICAgICAgLy9cIkBjaGFuZ2VkXCI6IFNjZW5lVHJhbnNpdGlvbiAsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0cmFuc2l0aW9uXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAYWN0aW9uXCI6IFNjZW5lQWN0aW9uLiQoJ0hPTUVfQUNUSU9OJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkB0YXJnZXRcIjogU2NlbmVTdGF0ZS4kKCdNRU5VX01FRElBVE9SJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRHJhd1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQG5hbWVcIjogU2NlbmVTdGF0ZS4kKCdEUkFXX01FRElBVE9SJyksXHJcbiAgICAgICAgICAgICAgICAgICAgLy9cIkBjaGFuZ2VkXCI6IFNjZW5lVHJhbnNpdGlvbiAsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0cmFuc2l0aW9uXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAYWN0aW9uXCI6IFNjZW5lQWN0aW9uLiQoJ0hPTUVfQUNUSU9OJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkB0YXJnZXRcIjogU2NlbmVTdGF0ZS4kKCdNRU5VX01FRElBVE9SJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQm9va1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQG5hbWVcIjogU2NlbmVTdGF0ZS4kKCdCT09LX01FRElBVE9SJyksXHJcbiAgICAgICAgICAgICAgICAgICAgLy9cIkBjaGFuZ2VkXCI6IFNjZW5lVHJhbnNpdGlvbiAsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0cmFuc2l0aW9uXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAYWN0aW9uXCI6IFNjZW5lQWN0aW9uLiQoJ0hPTUVfQUNUSU9OJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkB0YXJnZXRcIjogU2NlbmVTdGF0ZS4kKCdNRU5VX01FRElBVE9SJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBmc207XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0cy5TY2VuZUZzbSA9IFNjZW5lRnNtOyIsInZhciBHZW5lSlMgPSByZXF1aXJlKCdHZW5lSlMnKTtcclxuXHJcbi8vIFN0YXRlIOeKtuaAgVxyXG52YXIgU2NlbmVTdGF0ZSA9IEdlbmVKUy5DbGFzcyh7XHJcbiAgICAncHVibGljIGNvbnN0IE1FTlVfTUVESUFUT1InOiAnTWVudU1lZGlhdG9yJyxcclxuICAgICdwdWJsaWMgY29uc3QgSEVMTE9fTUVESUFUT1InOiAnSGVsbG9NZWRpYXRvcicsXHJcbiAgICAncHVibGljIGNvbnN0IEdBTUVfTUVESUFUT1InOiAnR2FtZU1lZGlhdG9yJyxcclxuICAgICdwdWJsaWMgY29uc3QgR0FNRV9PVkVSX01FRElBVE9SJzogJ0dhbWVPdmVyTWVkaWF0b3InLFxyXG4gICAgJ3B1YmxpYyBjb25zdCBEUkFXX01FRElBVE9SJzogJ0RyYXdNZWRpYXRvcicsXHJcbiAgICAncHVibGljIGNvbnN0IEJPT0tfTUVESUFUT1InOiAnQm9va01lZGlhdG9yJ1xyXG59KTtcclxuXHJcblxyXG5leHBvcnRzLlNjZW5lU3RhdGUgPSBTY2VuZVN0YXRlOyIsInZhciBHZW5lSlMgPSByZXF1aXJlKCdHZW5lSlMnKTtcclxuXHJcbi8vIFRyYW5zaXRpb24g6L2s5Y+YXHJcbnZhciBTY2VuZVRyYW5zaXRpb24gPSBHZW5lSlMuQ2xhc3Moe1xyXG5cclxufSk7XHJcblxyXG5cclxuZXhwb3J0cy5TY2VuZVRyYW5zaXRpb24gPSBTY2VuZVRyYW5zaXRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcmVzID0gcmVxdWlyZSgnLi8uLi91aS9SZXNvdXJjZS5qcycpLnJlcztcclxuXHJcbnZhciBCb29rTGF5ZXIgPSBjYy5MYXllci5leHRlbmQoe1xyXG5cclxuICAgIHdpblNpemU6Y2MuU2l6ZSg0MDAsIDMwMCksXHJcbiAgICBvbkNsb3NlOiBudWxsLFxyXG5cclxuICAgIGJvb2s6IG51bGwsXHJcblxyXG4gICAgY3RvcjpmdW5jdGlvbiAoc3BhY2UpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG5cclxuICAgICAgICB2YXIgY2xvc2VJdGVtID0gbmV3IGNjLk1lbnVJdGVtSW1hZ2UoXHJcbiAgICAgICAgICAgIHJlcy5DbG9zZU5vcm1hbF9wbmcsXHJcbiAgICAgICAgICAgIHJlcy5DbG9zZVNlbGVjdGVkX3BuZyxcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbG9zZSxcclxuICAgICAgICAgICAgdGhpcyk7XHJcblxyXG4gICAgICAgIGNsb3NlSXRlbS5hdHRyKHtcclxuICAgICAgICAgICAgeDogdGhpcy53aW5TaXplLndpZHRoIC0gMjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICBhbmNob3JYOiAwLjUsXHJcbiAgICAgICAgICAgIGFuY2hvclk6IDAuNVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbWVudSA9IG5ldyBjYy5NZW51KGNsb3NlSXRlbSk7XHJcbiAgICAgICAgbWVudS54ID0gMDtcclxuICAgICAgICBtZW51LnkgPSAwO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQobWVudSwgMSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgaGVsbG9MYWJlbCA9IG5ldyBjYy5MYWJlbFRURihcIkJvb2tcIiwgXCJBcmlhbFwiLCAzOCk7XHJcbiAgICAgICAgaGVsbG9MYWJlbC54ID0gdGhpcy53aW5TaXplLndpZHRoIC8gMjtcclxuICAgICAgICBoZWxsb0xhYmVsLnkgPSB0aGlzLndpblNpemUuaGVpZ2h0IC0gNTA7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChoZWxsb0xhYmVsLCAxKTtcclxuXHJcbiAgICAgICB0aGlzLnNob3dCb29rKHRoaXMuYm9vayk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24oc2VuZGVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub25DbG9zZSl7XHJcbiAgICAgICAgICAgIHRoaXMub25DbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2hvd0Jvb2s6IGZ1bmN0aW9uKGJvb2spIHtcclxuICAgICAgICB2YXIgbGFiZWwgPSBuZXcgY2MuTGFiZWxUVEYoYm9vay50aXRsZSwgXCJBcmlhbFwiLCAzOCk7XHJcbiAgICAgICAgbGFiZWwueCA9IHRoaXMud2luU2l6ZS53aWR0aCAvIDI7XHJcbiAgICAgICAgbGFiZWwueSA9IHRoaXMud2luU2l6ZS5oZWlnaHQvMiArIDUwO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQobGFiZWwsIDEpO1xyXG5cclxuICAgICAgICBsYWJlbCA9IG5ldyBjYy5MYWJlbFRURihib29rLmF1dGhvciwgXCJBcmlhbFwiLCAzOCk7XHJcbiAgICAgICAgbGFiZWwueCA9IHRoaXMud2luU2l6ZS53aWR0aCAvIDI7XHJcbiAgICAgICAgbGFiZWwueSA9IHRoaXMud2luU2l6ZS5oZWlnaHQvMjtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGxhYmVsLCAxKTtcclxuXHJcbiAgICAgICAgbGFiZWwgPSBuZXcgY2MuTGFiZWxUVEYoYm9vay5wdWJsaXNoZXIsIFwiQXJpYWxcIiwgMzgpO1xyXG4gICAgICAgIGxhYmVsLnggPSB0aGlzLndpblNpemUud2lkdGggLyAyO1xyXG4gICAgICAgIGxhYmVsLnkgPSB0aGlzLndpblNpemUuaGVpZ2h0LzIgLSA1MDtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGxhYmVsLCAxKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxufSk7XHJcblxyXG5leHBvcnRzLkJvb2tMYXllciA9IEJvb2tMYXllcjsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciByZXMgPSByZXF1aXJlKCcuLy4uL3VpL1Jlc291cmNlLmpzJykucmVzO1xyXG5cclxudmFyIERyYXdMYXllciA9IGNjLkxheWVyLmV4dGVuZCh7XHJcblxyXG4gICAgd2luU2l6ZTpjYy5TaXplKDQwMCwgMzAwKSxcclxuICAgIG9uQ2xvc2U6IG51bGwsXHJcblxyXG4gICAgcmVjdGFuZ2xlV2lkdGg6IDAsXHJcbiAgICByZWN0YW5nbGVIZWlnaHQ6IDAsXHJcbiAgICByZWN0YW5nbGVBcmVhOiAwLFxyXG5cclxuICAgIGN0b3I6ZnVuY3Rpb24gKHNwYWNlKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdmFyIGNsb3NlSXRlbSA9IG5ldyBjYy5NZW51SXRlbUltYWdlKFxyXG4gICAgICAgICAgICByZXMuQ2xvc2VOb3JtYWxfcG5nLFxyXG4gICAgICAgICAgICByZXMuQ2xvc2VTZWxlY3RlZF9wbmcsXHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UsXHJcbiAgICAgICAgICAgIHRoaXMpO1xyXG5cclxuICAgICAgICBjbG9zZUl0ZW0uYXR0cih7XHJcbiAgICAgICAgICAgIHg6IHRoaXMud2luU2l6ZS53aWR0aCAtIDIwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgYW5jaG9yWDogMC41LFxyXG4gICAgICAgICAgICBhbmNob3JZOiAwLjVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1lbnUgPSBuZXcgY2MuTWVudShjbG9zZUl0ZW0pO1xyXG4gICAgICAgIG1lbnUueCA9IDA7XHJcbiAgICAgICAgbWVudS55ID0gMDtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKG1lbnUsIDEpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGhlbGxvTGFiZWwgPSBuZXcgY2MuTGFiZWxUVEYoXCJEcmF3XCIsIFwiQXJpYWxcIiwgMzgpO1xyXG4gICAgICAgIGhlbGxvTGFiZWwueCA9IHRoaXMud2luU2l6ZS53aWR0aCAvIDI7XHJcbiAgICAgICAgaGVsbG9MYWJlbC55ID0gdGhpcy53aW5TaXplLmhlaWdodCAtIDUwO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoaGVsbG9MYWJlbCwgNSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd1JlY3RhbmdsZSh0aGlzLnJlY3RhbmdsZVdpZHRoLCB0aGlzLnJlY3RhbmdsZUhlaWdodCk7XHJcblxyXG4gICAgICAgIHZhciBhcmVhTGFiZWwgPSBuZXcgY2MuTGFiZWxUVEYodGhpcy5yZWN0YW5nbGVBcmVhLCBcIkFyaWFsXCIsIDM4KTtcclxuICAgICAgICBhcmVhTGFiZWwueCA9IHRoaXMud2luU2l6ZS53aWR0aCAtMTAwO1xyXG4gICAgICAgIGFyZWFMYWJlbC55ID0gMTAwO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoYXJlYUxhYmVsLCA5KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGRyYXdSZWN0YW5nbGU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpe1xyXG4gICAgICAgIHZhciBkcmF3ID0gbmV3IGNjLkRyYXdOb2RlKCk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChkcmF3LCAxMCk7XHJcblxyXG4gICAgICAgIGRyYXcuZHJhd1JlY3QoY2MucCg1MCwgNTApLCBjYy5wKDUwICsgd2lkdGgsIDUwICsgaGVpZ2h0KSwgbnVsbCwgMiwgY2MuY29sb3IoMjU1LCAwLCAyNTUsIDI1NSkpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uKHNlbmRlcikge1xyXG4gICAgICAgIGlmICh0aGlzLm9uQ2xvc2Upe1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydHMuRHJhd0xheWVyID0gRHJhd0xheWVyOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHJlcyA9IHJlcXVpcmUoJy4vLi4vdWkvUmVzb3VyY2UuanMnKS5yZXM7XHJcblxyXG52YXIgR2FtZUxheWVyID0gY2MuTGF5ZXIuZXh0ZW5kKHtcclxuXHJcbiAgICB3aW5TaXplOiBjYy5TaXplKDQwMCwgMzAwKSxcclxuICAgIG9uS2lsbDogbnVsbCxcclxuXHJcbiAgICBsaWZlOiAwLFxyXG4gICAgX2xpZmVMYWJlbDogbnVsbCxcclxuXHJcbiAgICBjdG9yOmZ1bmN0aW9uIChzcGFjZSkge1xyXG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2xpZmVMYWJlbCA9IG5ldyBjYy5MYWJlbFRURigpO1xyXG4gICAgICAgIHRoaXMuX2xpZmVMYWJlbC5mb250TmFtZSA9IFwiQXJpYWxcIjtcclxuICAgICAgICB0aGlzLl9saWZlTGFiZWwuZm9udFNpemUgPSA2MDtcclxuICAgICAgICB0aGlzLl9saWZlTGFiZWwueCA9IHRoaXMud2luU2l6ZS53aWR0aCAvIDI7XHJcbiAgICAgICAgdGhpcy5fbGlmZUxhYmVsLnkgPSB0aGlzLndpblNpemUuaGVpZ2h0IC8gMjtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2xpZmVMYWJlbCwgNSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd0xpZmUodGhpcy5saWZlKTtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9IG5ldyBjY3VpLkJ1dHRvbigpO1xyXG4gICAgICAgIGJ1dHRvbi5zZXRUaXRsZVRleHQoXCJLSUxMXCIpO1xyXG4gICAgICAgIGJ1dHRvbi5zZXRUb3VjaEVuYWJsZWQodHJ1ZSk7XHJcbiAgICAgICAgYnV0dG9uLmxvYWRUZXh0dXJlcyhcInJlcy9hbmltYXRpb25idXR0b25ub3JtYWwucG5nXCIsIFwicmVzL2FuaW1hdGlvbmJ1dHRvbnByZXNzZWQucG5nXCIsIFwiXCIpO1xyXG4gICAgICAgIGJ1dHRvbi54ID0gdGhpcy53aW5TaXplLndpZHRoIC8gMlxyXG4gICAgICAgIGJ1dHRvbi55ID0gdGhpcy53aW5TaXplLmhlaWdodCAvIDIgLTUwO1xyXG4gICAgICAgIGJ1dHRvbi5hZGRUb3VjaEV2ZW50TGlzdGVuZXIodGhpcy5oYW5kbGVLaWxsICx0aGlzKTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGJ1dHRvbik7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaG93TGlmZTogZnVuY3Rpb24obGlmZSl7XHJcbiAgICAgICAgdGhpcy5fbGlmZUxhYmVsLnNldFN0cmluZyhcIkxJRkU6XCIgKyBsaWZlKVxyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVLaWxsOiBmdW5jdGlvbihzZW5kZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5vbktpbGwpe1xyXG4gICAgICAgICAgICB0aGlzLm9uS2lsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnRzLkdhbWVMYXllciA9IEdhbWVMYXllcjsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciByZXMgPSByZXF1aXJlKCcuLy4uL3VpL1Jlc291cmNlLmpzJykucmVzO1xyXG5cclxudmFyIEdhbWVPdmVyTGF5ZXIgPSBjYy5MYXllci5leHRlbmQoe1xyXG5cclxuICAgIHdpblNpemU6Y2MuU2l6ZSg0MDAsIDMwMCksXHJcbiAgICBvbkNsb3NlOiBudWxsLFxyXG5cclxuICAgIGN0b3I6ZnVuY3Rpb24gKHNwYWNlKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdmFyIGNsb3NlSXRlbSA9IG5ldyBjYy5NZW51SXRlbUltYWdlKFxyXG4gICAgICAgICAgICByZXMuQ2xvc2VOb3JtYWxfcG5nLFxyXG4gICAgICAgICAgICByZXMuQ2xvc2VTZWxlY3RlZF9wbmcsXHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UsXHJcbiAgICAgICAgICAgIHRoaXMpO1xyXG5cclxuICAgICAgICBjbG9zZUl0ZW0uYXR0cih7XHJcbiAgICAgICAgICAgIHg6IHRoaXMud2luU2l6ZS53aWR0aCAtIDIwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgYW5jaG9yWDogMC41LFxyXG4gICAgICAgICAgICBhbmNob3JZOiAwLjVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG1lbnUgPSBuZXcgY2MuTWVudShjbG9zZUl0ZW0pO1xyXG4gICAgICAgIG1lbnUueCA9IDA7XHJcbiAgICAgICAgbWVudS55ID0gMDtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKG1lbnUsIDEpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGhlbGxvTGFiZWwgPSBuZXcgY2MuTGFiZWxUVEYoXCJHYW1lIE92ZXJcIiwgXCJBcmlhbFwiLCA4MCk7XHJcbiAgICAgICAgaGVsbG9MYWJlbC54ID0gdGhpcy53aW5TaXplLndpZHRoIC8gMjtcclxuICAgICAgICBoZWxsb0xhYmVsLnkgPSB0aGlzLndpblNpemUuaGVpZ2h0IC8gMjtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGhlbGxvTGFiZWwsIDUpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uKHNlbmRlcikge1xyXG4gICAgICAgIGlmICh0aGlzLm9uQ2xvc2Upe1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydHMuR2FtZU92ZXJMYXllciA9IEdhbWVPdmVyTGF5ZXI7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcmVzID0gcmVxdWlyZSgnLi8uLi91aS9SZXNvdXJjZS5qcycpLnJlcztcclxuXHJcbnZhciBIZWxsb0xheWVyID0gY2MuTGF5ZXIuZXh0ZW5kKHtcclxuXHJcbiAgICB3aW5TaXplOiBjYy5TaXplKDQwMCwgMzAwKSxcclxuICAgIG9uQ2xvc2U6IG51bGwsXHJcblxyXG4gICAgY3RvcjpmdW5jdGlvbiAoc3BhY2UpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9zdXBlcigpO1xyXG5cclxuICAgICAgICB2YXIgY2xvc2VJdGVtID0gbmV3IGNjLk1lbnVJdGVtSW1hZ2UoXHJcbiAgICAgICAgICAgIHJlcy5DbG9zZU5vcm1hbF9wbmcsXHJcbiAgICAgICAgICAgIHJlcy5DbG9zZVNlbGVjdGVkX3BuZyxcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbG9zZSxcclxuICAgICAgICAgICAgdGhpcyk7XHJcblxyXG4gICAgICAgIGNsb3NlSXRlbS5hdHRyKHtcclxuICAgICAgICAgICAgeDogdGhpcy53aW5TaXplLndpZHRoIC0gMjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICBhbmNob3JYOiAwLjUsXHJcbiAgICAgICAgICAgIGFuY2hvclk6IDAuNVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbWVudSA9IG5ldyBjYy5NZW51KGNsb3NlSXRlbSk7XHJcbiAgICAgICAgbWVudS54ID0gMDtcclxuICAgICAgICBtZW51LnkgPSAwO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQobWVudSwgMSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgaGVsbG9MYWJlbCA9IG5ldyBjYy5MYWJlbFRURihcIkhlbGxvIFdvcmxkXCIsIFwiQXJpYWxcIiwgMzgpO1xyXG4gICAgICAgIGhlbGxvTGFiZWwueCA9IHRoaXMud2luU2l6ZS53aWR0aCAvIDI7XHJcbiAgICAgICAgaGVsbG9MYWJlbC55ID0gMDtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGhlbGxvTGFiZWwsIDUpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBuZXcgY2MuU3ByaXRlKHJlcy5IZWxsb1dvcmxkX3BuZyk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUuYXR0cih7XHJcbiAgICAgICAgICAgIHg6IHRoaXMud2luU2l6ZS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIHk6IHRoaXMud2luU2l6ZS5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICBzY2FsZTogMC41LFxyXG4gICAgICAgICAgICByb3RhdGlvbjogMTgwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLnNwcml0ZSwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlLnJ1bkFjdGlvbihcclxuICAgICAgICAgICAgY2Muc2VxdWVuY2UoXHJcbiAgICAgICAgICAgICAgICBjYy5yb3RhdGVUbygyLCAwKSxcclxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oMiwgMSwgMSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGhlbGxvTGFiZWwucnVuQWN0aW9uKFxyXG4gICAgICAgICAgICBjYy5zcGF3bihcclxuICAgICAgICAgICAgICAgIGNjLm1vdmVCeSgyLjUsIGNjLnAoMCwgdGhpcy53aW5TaXplLmhlaWdodCAtIDQwKSksXHJcbiAgICAgICAgICAgICAgICBjYy50aW50VG8oMi41LCAyNTUsIDEyNSwgMClcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbihzZW5kZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5vbkNsb3NlKXtcclxuICAgICAgICAgICAgdGhpcy5vbkNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5leHBvcnRzLkhlbGxvTGF5ZXIgPSBIZWxsb0xheWVyOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHJlcyA9IHJlcXVpcmUoJy4vLi4vdWkvUmVzb3VyY2UuanMnKS5yZXM7XHJcblxyXG52YXIgTWVudUxheWVyID0gY2MuTGF5ZXIuZXh0ZW5kKHtcclxuXHJcbiAgICB3aW5TaXplOiBjYy5TaXplKDQwMCwgMzAwKSxcclxuXHJcbiAgICBvbkhlbGxvOiBudWxsLFxyXG4gICAgb25HYW1lOiBudWxsLFxyXG4gICAgb25EcmF3OiBudWxsLFxyXG4gICAgb25Cb29rOiBudWxsLFxyXG5cclxuICAgIGN0b3I6ZnVuY3Rpb24gKHNwYWNlKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdmFyIG1lbnVJdGVtMSA9IG5ldyBjYy5NZW51SXRlbUZvbnQoJ0hlbGxvJywgdGhpcy5oYW5kbGVIZWxsbywgdGhpcyk7XHJcbiAgICAgICAgbWVudUl0ZW0xLnNldFBvc2l0aW9uKG5ldyBjYy5Qb2ludCh0aGlzLndpblNpemUud2lkdGgvMiwgdGhpcy53aW5TaXplLmhlaWdodC8yKzEwMCkpO1xyXG4gICAgICAgIHZhciBtZW51SXRlbTIgPSBuZXcgY2MuTWVudUl0ZW1Gb250KCdHYW1lJywgdGhpcy5oYW5kbGVHYW1lLCB0aGlzKTtcclxuICAgICAgICBtZW51SXRlbTIuc2V0UG9zaXRpb24obmV3IGNjLlBvaW50KHRoaXMud2luU2l6ZS53aWR0aC8yLCB0aGlzLndpblNpemUuaGVpZ2h0LzIrNTApKTtcclxuICAgICAgICB2YXIgbWVudUl0ZW0zID0gbmV3IGNjLk1lbnVJdGVtRm9udCgnRHJhdycsIHRoaXMuaGFuZGxlRHJhdywgdGhpcyk7XHJcbiAgICAgICAgbWVudUl0ZW0zLnNldFBvc2l0aW9uKG5ldyBjYy5Qb2ludCh0aGlzLndpblNpemUud2lkdGgvMiwgdGhpcy53aW5TaXplLmhlaWdodC8yKSk7XHJcbiAgICAgICAgdmFyIG1lbnVJdGVtNCA9IG5ldyBjYy5NZW51SXRlbUZvbnQoJ0Jvb2snLCB0aGlzLmhhbmRsZUJvb2ssIHRoaXMpO1xyXG4gICAgICAgIG1lbnVJdGVtNC5zZXRQb3NpdGlvbihuZXcgY2MuUG9pbnQodGhpcy53aW5TaXplLndpZHRoLzIsIHRoaXMud2luU2l6ZS5oZWlnaHQvMi01MCkpO1xyXG4gICAgICAgIHZhciBtZW51ID0gbmV3IGNjLk1lbnUoIG1lbnVJdGVtMSwgbWVudUl0ZW0yLCBtZW51SXRlbTMsIG1lbnVJdGVtNCk7XHJcbiAgICAgICAgbWVudS5zZXRQb3NpdGlvbihuZXcgY2MuUG9pbnQoMCwwKSk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChtZW51KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZUhlbGxvOiBmdW5jdGlvbihzZW5kZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5vbkhlbGxvKXtcclxuICAgICAgICAgICAgdGhpcy5vbkhlbGxvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBoYW5kbGVHYW1lOiBmdW5jdGlvbihzZW5kZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5vbkdhbWUpe1xyXG4gICAgICAgICAgICB0aGlzLm9uR2FtZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaGFuZGxlRHJhdzogZnVuY3Rpb24oc2VuZGVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub25EcmF3KXtcclxuICAgICAgICAgICAgdGhpcy5vbkRyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGhhbmRsZUJvb2s6IGZ1bmN0aW9uKHNlbmRlcikge1xyXG4gICAgICAgIGlmICh0aGlzLm9uQm9vayl7XHJcbiAgICAgICAgICAgIHRoaXMub25Cb29rKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5leHBvcnRzLk1lbnVMYXllciA9IE1lbnVMYXllcjsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XHJcbnZhciBCb29rTGF5ZXIgPSByZXF1aXJlKCcuLy4uL2NvbXBvbmVudC9Cb29rTGF5ZXIuanMnKS5Cb29rTGF5ZXI7XHJcbnZhciBTY2VuZUFjdGlvbiA9IHJlcXVpcmUoJy4vLi4vLi4vcHJvZmlsZS9mbG93L1NjZW5lQWN0aW9uLmpzJykuU2NlbmVBY3Rpb247XHJcbnZhciBCb29rUHJveHkgPSByZXF1aXJlKCcuLy4uLy4uL21vZGVsL3Byb3h5L0Jvb2tQcm94eS5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3ZpZXcubWVkaWF0b3IuQm9va01lZGlhdG9yJyxcclxuICAgICAgICBwYXJlbnQ6IHB1cmVtdmMuTWVkaWF0b3IsXHJcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBwdXJlbXZjLk1lZGlhdG9yLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBfYm9va1Byb3h5OiBudWxsLFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgbGlzdE5vdGlmaWNhdGlvbkludGVyZXN0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gWyBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBoYW5kbGVOb3RpZmljYXRpb246IGZ1bmN0aW9uIChub3RlKSB7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jvb2tQcm94eSAgPSB0aGlzLmZhY2FkZS5yZXRyaWV2ZVByb3h5KEJvb2tQcm94eS5OQU1FKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgb25SZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50ID0gbmV3IEJvb2tMYXllcigpO1xyXG4gICAgICAgICAgICBzZWxmLnZpZXdDb21wb25lbnQud2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50Lm9uQ2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VuZE5vdGlmaWNhdGlvbihwdXJlbXZjLnN0YXRlbWFjaGluZS5TdGF0ZU1hY2hpbmUuQUNUSU9OLCBudWxsLCBTY2VuZUFjdGlvbi4kKCdIT01FX0FDVElPTicpKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5ib29rID0gdGhpcy5fYm9va1Byb3h5LmdldEJvb2soKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5pbml0KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50ID0gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFJlc291cmNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdCb29rTWVkaWF0b3InXHJcbiAgICB9XHJcbik7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxudmFyIFNjZW5lTWVkaWF0b3IgPSByZXF1aXJlKCcuL1NjZW5lTWVkaWF0b3IuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmVcclxuKFxyXG4gICAgLy8gQ0xBU1MgSU5GT1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICd2aWV3Lm1lZGlhdG9yLkRpcmVjdG9yTWVkaWF0b3InLFxyXG4gICAgICAgIHBhcmVudDogcHVyZW12Yy5NZWRpYXRvcixcclxuICAgICAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHB1cmVtdmMuTWVkaWF0b3IuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIGxpc3ROb3RpZmljYXRpb25JbnRlcmVzdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICdTQ0VORV9DSEFOR0VEJ1xyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBoYW5kbGVOb3RpZmljYXRpb246IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcclxuICAgICAgICAgICAgc3dpdGNoIChub3RpZmljYXRpb24uZ2V0TmFtZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdTQ0VORV9DSEFOR0VEJzpcclxuICAgICAgICAgICAgICAgICAgICAvL2NjLmxvZygnU0NFTkVfQ0hBTkdFRCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2NlbmVNZWRpYXRvciA9IHRoaXMuZmFjYWRlLnJldHJpZXZlTWVkaWF0b3IoU2NlbmVNZWRpYXRvci5OQU1FICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNjZW5lTWVkaWF0b3IgJiYgc2NlbmVNZWRpYXRvci5nZXRWaWV3Q29tcG9uZW50KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IucnVuU2NlbmUobmV3IGNjLlRyYW5zaXRpb25GYWRlKDEuMiwgc2NlbmVNZWRpYXRvci5nZXRWaWV3Q29tcG9uZW50KCkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIG9uUmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBvblJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBOQU1FOiAnRGlyZWN0b3JNZWRpYXRvcidcclxuICAgIH1cclxuKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xyXG52YXIgRHJhd0xheWVyID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvRHJhd0xheWVyLmpzJykuRHJhd0xheWVyO1xyXG52YXIgU2NlbmVBY3Rpb24gPSByZXF1aXJlKCcuLy4uLy4uL3Byb2ZpbGUvZmxvdy9TY2VuZUFjdGlvbi5qcycpLlNjZW5lQWN0aW9uO1xyXG52YXIgUmVjdGFuZ2xlUHJveHkgPSByZXF1aXJlKCcuLy4uLy4uL21vZGVsL3Byb3h5L1JlY3RhbmdsZVByb3h5LmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lXHJcbihcclxuICAgIC8vIENMQVNTIElORk9cclxuICAgIHtcclxuICAgICAgICBuYW1lOiAndmlldy5tZWRpYXRvci5EcmF3TWVkaWF0b3InLFxyXG4gICAgICAgIHBhcmVudDogcHVyZW12Yy5NZWRpYXRvcixcclxuICAgICAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHB1cmVtdmMuTWVkaWF0b3IuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIF9yZWN0YW5nbGVQcm94eTogbnVsbCxcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIGxpc3ROb3RpZmljYXRpb25JbnRlcmVzdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFsgXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgaGFuZGxlTm90aWZpY2F0aW9uOiBmdW5jdGlvbiAobm90ZSkge1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgb25SZWdpc3RlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWN0YW5nbGVQcm94eSAgPSB0aGlzLmZhY2FkZS5yZXRyaWV2ZVByb3h5KFJlY3RhbmdsZVByb3h5Lk5BTUUgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgb25SZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50ID0gbmV3IERyYXdMYXllcigpO1xyXG4gICAgICAgICAgICBzZWxmLnZpZXdDb21wb25lbnQud2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50Lm9uQ2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VuZE5vdGlmaWNhdGlvbihwdXJlbXZjLnN0YXRlbWFjaGluZS5TdGF0ZU1hY2hpbmUuQUNUSU9OLCBudWxsLCBTY2VuZUFjdGlvbi4kKCdIT01FX0FDVElPTicpKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5yZWN0YW5nbGVXaWR0aCA9IHRoaXMuX3JlY3RhbmdsZVByb3h5LmdldFdpZHRoKCk7XHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5yZWN0YW5nbGVIZWlnaHQgPSB0aGlzLl9yZWN0YW5nbGVQcm94eS5nZXRIZWlnaHQoKTtcclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50LnJlY3RhbmdsZUFyZWEgPSB0aGlzLl9yZWN0YW5nbGVQcm94eS5nZXRBcmVhKCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLl9yZWN0YW5nbGVQcm94eS5zZXRXaWR0aChzZWxmLl9yZWN0YW5nbGVQcm94eS5nZXRXaWR0aCgpICsgMTApO1xyXG4gICAgICAgICAgICBzZWxmLl9yZWN0YW5nbGVQcm94eS5zZXRIZWlnaHQoc2VsZi5fcmVjdGFuZ2xlUHJveHkuZ2V0SGVpZ2h0KCkgKyAxMCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnZpZXdDb21wb25lbnQuaW5pdCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbXBvbmVudCA9IG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRSZXNvdXJjZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH0sXHJcbiAgICAvLyBTVEFUSUMgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIE5BTUU6ICdEcmF3TWVkaWF0b3InXHJcbiAgICB9XHJcbik7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxudmFyIEdhbWVMYXllciA9IHJlcXVpcmUoJy4vLi4vY29tcG9uZW50L0dhbWVMYXllci5qcycpLkdhbWVMYXllcjtcclxudmFyIFNjZW5lQWN0aW9uID0gcmVxdWlyZSgnLi8uLi8uLi9wcm9maWxlL2Zsb3cvU2NlbmVBY3Rpb24uanMnKS5TY2VuZUFjdGlvbjtcclxudmFyIEdhbWVQcm94eSA9IHJlcXVpcmUoJy4vLi4vLi4vbW9kZWwvcHJveHkvR2FtZVByb3h5LmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lXHJcbihcclxuICAgIC8vIENMQVNTIElORk9cclxuICAgIHtcclxuICAgICAgICBuYW1lOiAndmlldy5tZWRpYXRvci5HYW1lTWVkaWF0b3InLFxyXG4gICAgICAgIHBhcmVudDogcHVyZW12Yy5NZWRpYXRvcixcclxuICAgICAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHB1cmVtdmMuTWVkaWF0b3IuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIF9nYW1lUHJveHk6IG51bGwsXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBsaXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIGhhbmRsZU5vdGlmaWNhdGlvbjogZnVuY3Rpb24gKG5vdGUpIHtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIG9uUmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZVByb3h5ICA9IHRoaXMuZmFjYWRlLnJldHJpZXZlUHJveHkoR2FtZVByb3h5Lk5BTUUpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBvblJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnZpZXdDb21wb25lbnQgPSBuZXcgR2FtZUxheWVyKCk7XHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC53aW5TaXplID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpO1xyXG4gICAgICAgICAgICBzZWxmLnZpZXdDb21wb25lbnQubGlmZSA9IHNlbGYuX2dhbWVQcm94eS5nZXRMaWZlKCk7XHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5vbktpbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzaG93TGlmZSA9IGZ1bmN0aW9uIChsaWZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50LnNob3dMaWZlKGxpZmUpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuX2dhbWVQcm94eS5kZWNMaWZlKHNob3dMaWZlKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5pbml0KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50ID0gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFJlc291cmNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfSxcclxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgTkFNRTogJ0dhbWVNZWRpYXRvcidcclxuICAgIH1cclxuKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xyXG52YXIgR2FtZU92ZXJMYXllciA9IHJlcXVpcmUoJy4vLi4vY29tcG9uZW50L0dhbWVPdmVyTGF5ZXIuanMnKS5HYW1lT3ZlckxheWVyO1xyXG52YXIgU2NlbmVBY3Rpb24gPSByZXF1aXJlKCcuLy4uLy4uL3Byb2ZpbGUvZmxvdy9TY2VuZUFjdGlvbi5qcycpLlNjZW5lQWN0aW9uO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3ZpZXcubWVkaWF0b3IuR2FtZU92ZXJNZWRpYXRvcicsXHJcbiAgICAgICAgcGFyZW50OiBwdXJlbXZjLk1lZGlhdG9yLFxyXG4gICAgICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcHVyZW12Yy5NZWRpYXRvci5jYWxsKHRoaXMsIHRoaXMuY29uc3RydWN0b3IuTkFNRSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIGxpc3ROb3RpZmljYXRpb25JbnRlcmVzdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFsgXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgaGFuZGxlTm90aWZpY2F0aW9uOiBmdW5jdGlvbiAobm90ZSkge1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgb25SZWdpc3RlcjogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgb25SZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50ID0gbmV3IEdhbWVPdmVyTGF5ZXIoKTtcclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50LndpblNpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5vbkNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbmROb3RpZmljYXRpb24ocHVyZW12Yy5zdGF0ZW1hY2hpbmUuU3RhdGVNYWNoaW5lLkFDVElPTiwgbnVsbCwgU2NlbmVBY3Rpb24uJCgnSE9NRV9BQ1RJT04nKSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50LmluaXQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFJlc291cmNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfSxcclxuICAgIC8vIFNUQVRJQyBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgTkFNRTogJ0dhbWVPdmVyTWVkaWF0b3InXHJcbiAgICB9XHJcbik7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCdwdXJlbXZjJykucHVyZW12YztcclxudmFyIEhlbGxvTGF5ZXIgPSByZXF1aXJlKCcuLy4uL2NvbXBvbmVudC9IZWxsb0xheWVyLmpzJykuSGVsbG9MYXllcjtcclxudmFyIFNjZW5lQWN0aW9uID0gcmVxdWlyZSgnLi8uLi8uLi9wcm9maWxlL2Zsb3cvU2NlbmVBY3Rpb24uanMnKS5TY2VuZUFjdGlvbjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcHVyZW12Yy5kZWZpbmVcclxuKFxyXG4gICAgLy8gQ0xBU1MgSU5GT1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICd2aWV3Lm1lZGlhdG9yLkhlbGxvTWVkaWF0b3InLFxyXG4gICAgICAgIHBhcmVudDogcHVyZW12Yy5NZWRpYXRvcixcclxuICAgICAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHB1cmVtdmMuTWVkaWF0b3IuY2FsbCh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yLk5BTUUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgLy8gSU5TVEFOQ0UgTUVNQkVSU1xyXG4gICAge1xyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBsaXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIGhhbmRsZU5vdGlmaWNhdGlvbjogZnVuY3Rpb24gKG5vdGUpIHtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIG9uUmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIG9uUmVtb3ZlOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudCA9IG5ldyBIZWxsb0xheWVyKCk7XHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC53aW5TaXplID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpO1xyXG4gICAgICAgICAgICBzZWxmLnZpZXdDb21wb25lbnQub25DbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZW5kTm90aWZpY2F0aW9uKHB1cmVtdmMuc3RhdGVtYWNoaW5lLlN0YXRlTWFjaGluZS5BQ1RJT04sIG51bGwsIFNjZW5lQWN0aW9uLiQoJ0hPTUVfQUNUSU9OJykpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50LmluaXQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb21wb25lbnQgPSBudWxsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9LFxyXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBOQU1FOiAnSGVsbG9NZWRpYXRvcidcclxuICAgIH1cclxuKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgcHVyZW12YyA9IHJlcXVpcmUoJ3B1cmVtdmMnKS5wdXJlbXZjO1xyXG52YXIgTWVudUxheWVyID0gcmVxdWlyZSgnLi8uLi9jb21wb25lbnQvTWVudUxheWVyLmpzJykuTWVudUxheWVyO1xyXG52YXIgU2NlbmVBY3Rpb24gPSByZXF1aXJlKCcuLy4uLy4uL3Byb2ZpbGUvZmxvdy9TY2VuZUFjdGlvbi5qcycpLlNjZW5lQWN0aW9uO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwdXJlbXZjLmRlZmluZVxyXG4oXHJcbiAgICAvLyBDTEFTUyBJTkZPXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3ZpZXcubWVkaWF0b3IuTWVudU1lZGlhdG9yJyxcclxuICAgICAgICBwYXJlbnQ6IHB1cmVtdmMuTWVkaWF0b3IsXHJcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBwdXJlbXZjLk1lZGlhdG9yLmNhbGwodGhpcywgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIC8vIElOU1RBTkNFIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICAgICAgbGlzdE5vdGlmaWNhdGlvbkludGVyZXN0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gWyBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBoYW5kbGVOb3RpZmljYXRpb246IGZ1bmN0aW9uIChub3RlKSB7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBvblJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudCA9IG5ldyBNZW51TGF5ZXIoKTtcclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50LndpblNpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5vbkhlbGxvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbmROb3RpZmljYXRpb24ocHVyZW12Yy5zdGF0ZW1hY2hpbmUuU3RhdGVNYWNoaW5lLkFDVElPTiwgbnVsbCwgU2NlbmVBY3Rpb24uJCgnSEVMTE9fQUNUSU9OJykpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzZWxmLnZpZXdDb21wb25lbnQub25HYW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbmROb3RpZmljYXRpb24ocHVyZW12Yy5zdGF0ZW1hY2hpbmUuU3RhdGVNYWNoaW5lLkFDVElPTiwgbnVsbCwgU2NlbmVBY3Rpb24uJCgnR0FNRV9BQ1RJT04nKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudC5vbkRyYXcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VuZE5vdGlmaWNhdGlvbihwdXJlbXZjLnN0YXRlbWFjaGluZS5TdGF0ZU1hY2hpbmUuQUNUSU9OLCBudWxsLCBTY2VuZUFjdGlvbi4kKCdEUkFXX0FDVElPTicpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50Lm9uQm9vayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZW5kTm90aWZpY2F0aW9uKHB1cmVtdmMuc3RhdGVtYWNoaW5lLlN0YXRlTWFjaGluZS5BQ1RJT04sIG51bGwsIFNjZW5lQWN0aW9uLiQoJ0JPT0tfQUNUSU9OJykpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50LmluaXQoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRSZXNvdXJjZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGdfcmVzb3VyY2VzID0gcmVxdWlyZSgnLi8uLi91aS9SZXNvdXJjZS5qcycpLmdfcmVzb3VyY2VzO1xyXG4gICAgICAgICAgICByZXR1cm4gZ19yZXNvdXJjZXM7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9LFxyXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBOQU1FOiAnTWVudU1lZGlhdG9yJ1xyXG4gICAgfVxyXG4pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBwdXJlbXZjID0gcmVxdWlyZSgncHVyZW12YycpLnB1cmVtdmM7XHJcbnZhciBHZW5lQ29jb3NKUyA9IHJlcXVpcmUoJ0dlbmVDb2Nvc0pTJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuZGVmaW5lXHJcbihcclxuICAgIC8vIENMQVNTIElORk9cclxuICAgIHtcclxuICAgICAgICBuYW1lOiAndmlldy5tZWRpYXRvci5TY2VuZU1lZGlhdG9yJyxcclxuICAgICAgICBwYXJlbnQ6IHB1cmVtdmMuTWVkaWF0b3IsXHJcbiAgICAgICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcHVyZW12Yy5NZWRpYXRvci5jYWxsKHRoaXMsIHRoaXMuY29uc3RydWN0b3IuTkFNRSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICAvLyBJTlNUQU5DRSBNRU1CRVJTXHJcbiAgICB7XHJcbiAgICAgICAgX2luaXRpYWxpemVkOiBmYWxzZSxcclxuXHJcbiAgICAgICAgbG9hZGVySW1hZ2U6IFwiZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNFFBWVJYaHBaZ0FBU1VrcUFBZ0FBQUFBQUFBQUFBQUFBUC9zQUJGRWRXTnJlUUFCQUFRQUFBQWxBQUQvNFFNcGFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0x3QThQM2h3WVdOclpYUWdZbVZuYVc0OUl1Kzd2eUlnYVdROUlsYzFUVEJOY0VObGFHbEllbkpsVTNwT1ZHTjZhMk01WkNJL1BpQThlRHA0YlhCdFpYUmhJSGh0Ykc1ek9uZzlJbUZrYjJKbE9tNXpPbTFsZEdFdklpQjRPbmh0Y0hSclBTSkJaRzlpWlNCWVRWQWdRMjl5WlNBMUxqQXRZekEyTUNBMk1TNHhNelEzTnpjc0lESXdNVEF2TURJdk1USXRNVGM2TXpJNk1EQWdJQ0FnSUNBZ0lDSStJRHh5WkdZNlVrUkdJSGh0Ykc1ek9uSmtaajBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TVRrNU9TOHdNaTh5TWkxeVpHWXRjM2x1ZEdGNExXNXpJeUkrSUR4eVpHWTZSR1Z6WTNKcGNIUnBiMjRnY21SbU9tRmliM1YwUFNJaUlIaHRiRzV6T25odGNFMU5QU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2YlcwdklpQjRiV3h1Y3pwemRGSmxaajBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDNOVWVYQmxMMUpsYzI5MWNtTmxVbVZtSXlJZ2VHMXNibk02ZUcxd1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPak00TURCRU1EWTJRVFUxTWpFeFJURkJRVEF6UWpFek1VTkZOek14UmtRd0lpQjRiWEJOVFRwSmJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qTTRNREJFTURZMVFUVTFNakV4UlRGQlFUQXpRakV6TVVORk56TXhSa1F3SWlCNGJYQTZRM0psWVhSdmNsUnZiMnc5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEVXpVZ1YybHVaRzkzY3lJK0lEeDRiWEJOVFRwRVpYSnBkbVZrUm5KdmJTQnpkRkpsWmpwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09rVTJSVGswT0VNNE9FUkNOREV4UlRFNU5FVXlSa0UzTTBNM1FrRTFOVGxFSWlCemRGSmxaanBrYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2tVMlJUazBPRU01T0VSQ05ERXhSVEU1TkVVeVJrRTNNME0zUWtFMU5UbEVJaTgrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrLys0QURrRmtiMkpsQUdUQUFBQUFBZi9iQUlRQURRa0pDUW9KRFFvS0RSTU1Dd3dURmhFTkRSRVdHaFVWRmhVVkdoa1VGaFVWRmhRWkdSMGZJQjhkR1Njbktpb25Kems0T0RnNVFFQkFRRUJBUUVCQVFBRU9EQXdPRUE0UkR3OFJGQTRSRGhRVkVSSVNFUlVmRlJVWEZSVWZLQjBaR1JrWkhTZ2pKaUFnSUNZakxDd29LQ3dzTnpjMU56ZEFRRUJBUUVCQVFFQkEvOEFBRVFnQXlBQ2dBd0VpQUFJUkFRTVJBZi9FQUxBQUFBRUZBUUVBQUFBQUFBQUFBQUFBQUFRQUFnTUZCZ2NCQVFFQUF3RUJBQUFBQUFBQUFBQUFBQUFBQVFNRUFnVVFBQUlCQWdJRUJ3b0xCZ1FHQXdBQUFBRUNBd0FFRVFVaE1SSUdRVkZ4c1RJVEZHR0J3ZEVpUWxLU016V1JvZUZpY3FLeUkxTnpGWUpqSkRRV0I5S2pWQ2J4d2tOa0pXWGlrM1FSQUFJQkFnTUZCUWNEQlFFQUFBQUFBQUFCQWhFRElSSUVNVUZSY1RKaHdWSVVCWkdoc1NKeUV6T0IwVUxoWXBJalV4WC8yZ0FNQXdFQUFoRURFUUEvQU1KU3BVcUFWS2xYdUZBZVVxOXdwVUI1WHVGZTRWNm9vRHpaSERveDBDbkdNaW56d2w3WjhOYWphSGVvTzN2bVRCWkJ0cDlZVUlxVEVWNVJPeEhLbldSbmFVOFZSTWhGQlVqcFY3aFNvU2VVcTlwVUI1U3IybGhRSGxLdmNLOG9CVjdoU0ZTUnJ0YUtBWnMwN1lOUE0xcEcyeEpJQXcxalNlYW5kcnkvOFg0bThWQ0trV3dhV3dhbTdYbC80djFXOFZMdG1YL2kvVmJ4VW9La1d3YWtTTTQwN3RtWC9pL1ZieFVtekd3alFzamRZNDFJQVJpZS9VMEliWk8wa050Q1huT0NrRUJlRnU0S0kzQnM3RE5iMjd5YStqRHgza0plRW5wSkpFY1FWYldEc2sxN3U1dXJkNTkxdWNaa1doeW0yVm5kOVJrQ0RFcEZ4RFJwYncwYnVudTVtbHAyRGUyRk1MWVhPRDJ3QjJ4Yk9lcmFVY1lHSjcybWxTVWlxenpkek1kM1ozbWl4bHRBMnl6Y0svTmxITTFEUXlSWGNlMUhvY2ROT0VmSlhaODh5OVpvak9xaGlCc3pJUmlIUThZNGNLNVR2SHV6TGxqSE5NcXhOb0RqTEZyYUhIbmpQeGNOQ0dWYnhFVXpZTlR4NWpaU3hocFc2cVR6bHdKK0RDdk8yWmYrTDlWdkZTZ3F5SFlOTFlOVGRzc1B4ZmlieFV1MTVmOEFpL1ZQaXFDYWtPd2E4MkRVL2E4di9GK0p2RlREZFdQQkw4UjhWS0N2WVJZVjVVem9NQXk2UWRJSXFJMEI0S0p0eGlSUXdvdTE2UW9HVWtudEg1VHowUmJaYm1GMmhrdHJhU1ZCbzJsVWtZOHREeWUwZmxQUFhUc2xWVXlpeVZSc2pxVU9BNHlNVDhkVzJyYW0ybTZVVlROcTlTN0VJeVVWSnlkTVRuLzZEblAraW05V2wrZzV6L29wdlZycHRlRWhRV1k0QWFTVHdBVmY1V1BpWmgvOVM1L3pqN3psdHpsbVlXa2ZXWE52SkRHVGdHY1lESGlyUjdpN21TYndYUGFyc0ZNcmdiN3c2akt3L3dDbW5jOUkxNGtGM3ZwdkNsamJNeVdNT0pMNGFFaUI4cVUvT2JVSzdIWVdWcmwxcEZaV2lDT0NCUXFLT0xqUEdUck5aWnFLYlVYVkhxMm5Od1R1SlJrMVZwYmdYTjhzN1JrNXltMFVRUXpoSUcyTkFqaHhIV2JJK2dDQlZqQkJGYnd4d1FxRWlpVUpHZzFCVkdBRmU3ZFYyOFdZTFlaRm1GMlRoMVVEN0pHanltR3luMWlLNU95eklCR0IxSGdyTFpoYW16dW1RQUdKd1NxblNDaDFxM0dPQ29keHQ0Y3h1cmRjcHp1TjRjeWhpV2FGNUJnMDl1ZFVtbld3MUgvalY5bkZ1SjdRdW8rOGg4cGVUaEZBKzA0N3ZkdXlNdGs3ZllxVGwwN1lGZGZVdWZNUHpUNXA3MVVkdGxtWVhhR1MydDNtUUhBc2d4QU5kYWRZSm9wTGU0UVMyODY3RXNaNFFmQ05ZckNGYmpkRFBtZ2tZeVdGeGdWZjA0aWZKZjZTY05kUlVXMVhCYjZGVTVUakY1RXBTU3JHdS9zNWxOK2c1ei9vcHZWcGZvT2Mvd0NpbTlXdGRIbmF0dk9iSlhEVzd4TEdoQjhuclBhWTkvSENyK3RFZFBDVmFTZURvWUxucUY2M2x6VzQvUEZTVzNlY3hiSTg0VlN6V1V3VWFTZGcwRFhYSzVudkFpcG5kNnFnS3ZXblFPN3ByaTlaVUVtbTNWbDJqMWtyOHBSbEZSeXF1Qk5aakd4US9TNTZZMVMyZnU5T1Z1ZW9uMTFTemFob291MDZRb1FVWGFkSVZDRDJGSko3UitVODlkTXlkdjhBeGRuK1RIOW11WnllMGZsUFBYUXN0bEs1VGJrYTFnVWpsQzFxMHZWTGtlYjZyK08zVHg5eGNZMW50OGMwTnJaQ3lpT0UxMTA4TllqR3Yxam9vN0pzMWp6S3lTY1lMSXZrekw2TER3SFhWSmtzSDlTYjQ5ZEtOcTB0ajFqQTZ1cmlPQ0wrMDJGV1g3aVZ0WlgxL0F6YUhUeWVvYXVLbjJNWDlXNzl6ZWJpWkN1UjVNalNyaGZYdUV0d1RyVWVaSCt5TmZkclJOY3hJNkl6aFhsSkVhazZXSUdKMlJ3NENoV25DaG5kdGxWQkxNZFFBMGsxZ2JYTk16ekRmRExzNm1qYVBLcHBKYld3SjFiT3d3eHc0M09uSGg3MVlUM0RwZldVSm1GbGI1akhIRGRlWEJISXNyUmVhNVRTcXZ4cUcwNGNOTjYydmV0b0NTNHRyZTVtZ25rR0U5cSszREtPa3VJMldYNkxEUVJSSFdEaDFVQ3R3ajdRUmcyd2RsOERqZ3cxcWU3WHZXMEJRM2tmWjdtU0xnVStUOUU2UlZibnVWcm5XVlNXcWorTHQ4WmJSdUhFZEtQa1lWY1oyTUpZNWZTR3llVmFyNDUrcmtXUUhBcWNjYWxQRTVrbTFodFdLNW5LNFdudDVGdVVCVXdPTUc0bkdrQS9CWFVyVzRTNnRvcmxPak1nY2QveFZuN3JMbzd6S3MwdUVqQ05lU3Zkd29CaGdzWnhYMWwyajM2azNMdSt1eXByZGo1VnM1QStpL2xENDhhMGFhVkpPUGk3akI2bGJ6V296cGpCNDhwZjFORFhOTjR2Zmw3K1o0QlhTNjVwdkY3OHZmelBBSzcxWFRIbVovUy95VCtqdko3TDNmSHl0ejFFK3VwYkwrUWo1VzU2amZYV1Juc0lZS0x0ZWtLRUZHV3ZTRlFneWprOW8vS2VldDNZdGhsTVAvNXg5bXNKSjdSK1U4OWJpeWIvQU1YRXY3Z0Q2dGFkTDFUK2t3ZXBSckMzOVprTERNYml3TXZVSFJQRzBiamxHZzhvcmUvMjNzeEJsZHhmTVBMdXBOaFQ4eUwvQU9STlpiZHpKNDg0c2N5dHhnTHFKWTVMWmo2UTJzVjVHMVZ1ZDFtamp5RzBpajBORUdTWlRvS3loanRxdzR3YXp0dWlYQTNxS1RiU3hsdGZHaGJabEU5NVp0WnF4VmJnaU9aaHJFUjlwaDNTdms5K3BKSUxaNFk0REdCRkNVTUtqUnNHUG9iUEZoVWZXME5KbWxqRTJ4SmNJcmNJMnZGVUVsbjFsUlhkNmxyYXpYVDlHQ05wRCt5TnFvSTdtT1ZkdU53Nm56bE9Jb1BPVWE2eXllMVhYY2JNUjVHZFEzeFkwQlNiajMxL0ZjVFFaaXJKK3E0MzFxN2FuYkhDVFo3MkJ3N2xiUHJLQk1jQldOTmdiTUJCaCtic2pCZG5pMFZKMWxBUlpzNnlXaXVweEN1TUR5NktwUzJJd09vNkRUcjNNcmUzZTV0WlpWVU00WkJqcU9PSm9XTzRqa1hhamNPT01IR2dESVN2V0lyZEFrS1I4MCtUelZsOTA4YlBQTDNMenhPdUhkaWZ4VmZpVEFnOTJxSS93Ky84Z0dnU3lOL21SN1hQVmxwMGxGLzNMM21iVkt0dTVIamJrLzhBSEUyRmMwM2k5K1h2NW5nRmRLTmMxM2k5K1h2NW5nRmFOVjB4NW5uK2wva245SGVFV1h1K1BsYm5xSjlkUzJYdTlPVnVlb24xMWtaN0NHQ2pMWHBDZ3hSbHIwaFVJUFlVY250SDVUejFzOHZiK0J0MS9kcVBpckdTZTBmbFBQV3VzRy9nNFB5MTVxMDZYcWx5TVd2VllRK3J1STl4Sk9xek85aE90by9zUDh0YkdPRklybVdlTTdJdU1ETW5BWFhRSk9ValFlT3NKazBuWTk2aXAwQ1l1bnJqYUh4MXQrc3JQSlViWEJtMkxyRlBpa3dUT2IrVCtWaGJaeEdNckRYcDgzeDFRU3kydHVjSnBValBFVHArQ241L2Z0YVJ2S3Z0cDNLeDQ4SEczZXJITXpPeFppV1p0TE1kSk5RU2JiTDcxVms2eXluVmlPa3FuRUVmT1d0UGJYaTNFUWtHZzZtWGlOY2tqZVNKeEpHeFIxMHF3MEd0eHV4bXZiSW1ENENaTUZsQTRmUmZ2MEJxZXNxcXpUTVpOTUVEYklIdEhIMlFlQ2laSlNxTVFkT0dpdWU1M216M2N6UXdzUmJJY05IbmtlYzNjNHFBTXVyaXo2OGdUSVRveHdPT25scDBNanhNSllXNzQxR3MzUlZsZHRieWdFL2RNY0hYL21vRGF4VGlXTlpCNTNCM2FyYjgvd0MrNFNPRjRzZi9BS3hVOWtjQnNmT0dIZm9VSHRHL1Jielk1RGllNUhIaFhkdmF2cWlaOVE4SmRscTQvZ2JLdWE3eGUvTDM4endDdWhwZjJVay9abzUwa213SktJZG9nRGp3MVZ6emVMMzVlL21lQVZwMUxUZ3FZNG5uK21SYXV6cW1xd3JqekNMTDNmSHl0ejFFK3VwTEwrUWo1VzU2amZYV1Jucm9ZS0x0ZWtLRUZGMnZTRlFnOWhTU2UwZmxQUFdvc20vaElmb0x6Vmw1UGFQeW5uclJXYi93MFgwRjVxMDZYcWx5TTJzVll4NWdtYkZyZS90NzFOWTJUKzBoOFZiU081U1dOSlVPS1NBTXA3akRHc3BtTVBhTFJsWFM2ZVd2ZTEvRlJPN1dZZGJabTFZL2VXL1I3cUh4SFJYR29qbG0zdWxpZDZhVmJhVytPQUx2Z0NMcTJIbTlXeEhLV3FqaGo2eHNLMWU4ZG0xNWw0bmlHMUxaa3N3R3N4dHJQZU9tc3ZheUJKQTFWSXRsV2pwdEx1VGRQTW83THRqUkRxOW5hSzQrV0Y5SXJVVzdCYUhPbGpHcVZIQjd3Mmh6Vm9adDg3ZDh2YU5ZU0xsMDJDY1JzREViSmJqNzFVdTdVQmt2SjcvRDdxMlFvRHh5U2FBTzhNVFhkeFJWTXBScDVYWk9XZEYvbXM3UjVYZHlLZktXSnNPLzVQaHJHNVhsTnhtRXl3VzZiVG5UeEFBY0pOYkdTTVhrTTFwamdiaU5vMVB6aVBKK09zN3U3bS82UmVNMDBaT2d4U3BxWVlIVDN3UlhNS040bGw5elVHNGJRZk5zaHU4c1pWdUVBMmhpckE0cWUvVk93d3JWYnpid3c1bUk0NFVLUlJZa2JXRzBTM0pXY3RiZDd1NVdGZk9PTEhpVWRKcW1haXBmTHNJc09iaFdlMDAxbE1rTVZ2Sk5qaGdoSUFMTWNCeENzN2Z4WFFta3VweDFiWERzd0dQbGFUaWRWYUV5S05Ya29vNGVCVitTcTdMN1ZzOXpjQmdleVE0R1EvTUIxY3Jtb2ltMm9yZXpxY293VHVTZUVZNDhqUTdvWlgyUEx6ZHlMaE5kNlJqckVZNkk3K3VzcHZINzh2ZnpQQUs2VUFBQUZHQUdnQWNBcm11OFh2eTkvTThBclRmaW8yNFJXNW5uYUc2N3VvdTNIL0tQdXFUMlg4aEh5dHoxRyt1cExMM2VuSzNQVWI2NnlzOVJEQlJkcjBoUWdvdTA2UXFFR1VrbnRINVR6MWUyMzh2RjlCZWFxS1QyajhwNTZ2YmIrWGkrZ3ZOV2pUZFV1Um4xWFRIbVRoOEtySlRKbHQ4dDFDUElZNDRjR25wSlZqVEpZa21qYU45SWI0dTdWOTIzbmpUZXRoUmF1WkpWM1BhVzFyZkxJaVhFRFlnNlI0VlljOUNYVzd0aGZPWmJLZGJHWnRMVzh1UFZZL3UzR3JrTlVrTTl6bGN4VWpiaGZXT0E5MGNScTRndjRMaGRxTitWVG9OWVdtblJtOU5OVldOVHlIYzZWV0J2OHd0NFllSHFtNnh5UG1yb3ExWjdXR0ZMU3hUcTdXTFN1UFNkanJrZnVtcTV5SFhEVWVBOTJvTzJTS3BWdW1OQWFvSkxNWEgzbXlwMHJwSjR1S2hjM3RiRE01Qk1yaTF6QWo3OWo3S1RpWThUY2RCcGNzaXRoMDI4Nm8rc1BDYWdFWDlQemc0elhVQ3A2UVlzZThvb3VDRzN0azZtMUJZdjA1VzZUK0lkeW9seGJIREFBYTJPZ0RsTkN6M3J5TjJXeEJkNVBKTWcxdDgxZUlkMnVrcW5MbFRCYmZjdVkrOXVKTGlSY3Z0UHZIZHNISytjZlJIY0hEV3N5YXdqeXkwV0JjREkzbFRQNlRlSWNGVitTNU9tWHg5YkpnMTA0OG84Q2owVjhKcTJEVnUwOW5MODB1cDdPeEhpK29hbDNQOEFYQi9Jc1pTOFQvWU9WNjV6dkNjYzd2ZnpQQUszaXZXQ3o0NDV6ZUg5NTRCWE9yNkk4eWZTZnl6K2p2Q0xQM2ZIeXR6MUcrdXBMUDNmSHl0ejFFK3VzYlBhUTBVWGFkSVVJS0x0ZWtLaEI3Q2trOW8vS2VlcjIyL2w0L29MelZSU2UwZmxQUFY3Yi95OFgwRjVxMGFicWx5TStxNlk4eVFzQlRETW9yMW84YWlhRTFwYmx1TXFTM3NiTExISWhTUlF5bmdxdWtoYUo5dUJqbytINWFPYTNhbzJ0MzRxb3VSbExhalRhbEdQOHYwSVk4eWxYUStQS1BGVS9iWVhPTFBnZTZDS2lhMExheFRPeEh1MVE3Y3VCZDl5UEVKN1RialhLTzhDYWpiTUlGNkNOSWVOdkpIanFJV0o3dFNwWWthbHFWYmx3SWR5RytSR1h1cjBoWFlKRnhhbCtEaHE1eTNzbGt2M1kycEQwcFRyK1FVQ2xwSlJVZG85WFc0T0xyVEh0TTE2Y1pMTFdrZUM3eTRqdmxORXBjUnR3MVV4MjdDaTQ0OE5aclRGeTNubjNJUVd4bGdHckRaM3B6YTcvTThBclpvK0FyRjUxNzF1dnArQ3FkVjBSNWwvcHNVcnMydkIzaGRsN3ZUbGJucUo5ZFMyWHUrUGxibnFKOWRZMmVzaG9vcTE2UW9RVVhhOUlWQ0QyRkxKN1J1VTg5V050bVVTUXFrZ1lNZ3cwYWNjS3JwUGFQeW5uclpXRzRWaStWV21ZNXRuTVdYRytYcklZbkEwcmhqMG1kY1RnZE5kd25LRHFqbWR1TTFTUlIvcWxyOC80S1g2cGE4VC9CVnpEdUxaWHVkUlpibG1ieFhjUFVOUGMzS3FDSXdyYk96Z3JIRW5Iam95RCszZVNYa2h0N0RlS0c0dW1ER09KVlVrbGZvdVRoWGZtYm5aN0N2eTF2dDlwbXYxVzErZDhGTDlWdGVKdmdxNXlyY09HZkxtekhOODBpeXlFVFBicHRBRUZvMlpHOHBtVWExT0ZObjNLeTZXL3NiREtNNWh2NWJ4MldUWkErN1JGMnk1MldPUEpUekUrejJEeTF2dDlwVC9BS3BhY1RlclMvVTdUaWIxYTA0L3Q3a0RYUFkwM2poTjBXNnNRN0s3VzNxMmRuck1jY2FEeS84QXQ4MGt1WmZxV1l4V050bGN2VVBQaGlHWWhXRGVVeTdJd1lVOHhQczlnOHRiN2ZhVW42cGFjVGVyVHhtOW9PQnZWcTN2OXo5MjdheW51SWQ0NExpV0tObmpoQVhGMlVZaFJnNTE2cXBzcnlqTHIyMTY2NXpGTFNUYUs5VTJHT0E4N1N3cVkzN2tuUlUrQnpPemFnczBzMU95citCS002c3h3UDZ0U0RQTE1lbjZ2eTBydmRtM1N4bHU3Sy9TN1dERHJGVURVVHhnblRVODI2ZVhXN0tseG1xUXV3REJYVUtjRCsxWGVlL3dYdUtYNVhER1dMYXBTVmNPeWhFTS9zZUovVitXbmplR3g0cFBWK1drbTZrS1psRmF5M0psdDdpRnBZWlk4QVNWSzZEanREREEwZjhBMFRsMzQwLzFmOE5keDh4SlZXWEIwS2JrdEZGcE56ZFZYQUMvcU93QTBDUW5pMmZsck8zVndibTVsbkkyVEt4YkRpclgvd0JFNWQrTmNmVi93VlI3eFpQYTVVOXV0dkk4bldobWJidzBZRUFZWUFWeGZoZnk1cmxLUjRGdWx1Nlg3bVcxbXpUOFM0WWlzLzVDUGxibnFKOWRTV2Z1OU9WdWVvbjExbVp2UTJpN1hwQ2hLS3Rla0toQmxOSjdSK1U4OWJEZkdUYjNhM1pYMExjajZrZFkrVDJqOHA1NjAyODhtMWtXUXI2TUoreWxTQXIrMmNuVjVyZW5qczNIMWxvWCszajlYdmJidHhMTjlscVc0VW5WNWpkbmp0WEh4aWh0eVpOamVTQnU1SjlrMUJKZTd4eTdXNUNKL3dDenVEL21UVlRmMitmcTk3TEp1THJQc05SdWVTN1c2YUovMzh4K3ZMVlh1WSt4dkhhTnhiZjJHb0NlemY4QTM2ai9BUHNTZjh3MXNMbnFjelRlZkpsdVlvTG01dW81RjYxc0JzaEl0UDFjTkZZZTFmOEEzaXIvQVBmRS93Q1pVZTliQjk0cjVqd3VQc3JRRmhtRzRsL1oyTTE3SGRXOTB0dXUzSWtUSGFDaldkSXcwVlZaZGtzOS9DMDZ5SkZFcDJkcCtFMWJicXliR1RaOHZwUUQ3TDFYUnY4QTdibFQ5Nk9kYTd0cE51dU5FMzdDcTlLU2lzanl1VW94clN0S2xsSGJMbFdUWHNNczhjaHVTdXdFUERxd29MZTV5K1lSRS9nTHptcVJla3ZLS3RkNDMyN3lNL3VsSHhtckhKU3R5U1dWUnlyanhLSTJYQy9DVGxubFBQS1RwVGRGYlAwTDFiZ3JmNUxwMEczZFBoUUh3VjBTMWx6QnNuczNzRVNSOENyaDlXQUpHalNPS3VVM0UremRaUTNvSmg4SUFyZFpYRkRtT1RwSGEzaTIrWXJJMkt0S3k0cmljQnNCdUhIZ0ZYU280NDArV2EycXF4anZNOXVNb3krV3Z6V3BMQ1dXV0UyOEh4TDZlNDNvamdrZVNDQlkxUmk1QkdJVURUNTFjbDN2bTI3NkJCcVNFSDRXYnhWMHRsa3lYSmN4VE1iK09XNnVZOW1HSHJDekRRd3dBYlRwMnVLdVRaOU4xdVlzZlJSUjhXUGhybTQxOW1TU2pSeWlxeFZLN3kyM0IvZnR1VG0yb1NkSnl6TlZ3M0JGbjd2VGxibnFGOWRTMmZ1OU9WdWVvbjExbFp1UTJpTGRzR0ZEMDVIMmROUUdWMG50RzVUejFkV205TjFiMmtWcThFVndzSTJVYVFhUU9LaG1pdFpHTE9tazY4RGhTRnZZK2dmV05TQWc3ejNRdm83eUtDS0lvaGlhTlI1TEt4eDhxcHh2amNxUzBWcGJ4dndPQWNSUVBaN0QwRzlZMHV6MkhvSDFqVUNwTFk3elhscGJtM2VLTzVRdXpqckJxWmppM3gxN1B2TmN5VDI4OFZ2REJKYk1XVW92UzJoc2xXN21GUTluc1BRUHJHbDJldzlBK3NhQ29kL1dOeHRiWXNyZmIxN1dCeHg1ZGREMjI4MXhDODhrbHZEY1NYRW5XdXpycU9HR0M5elJVUFo3RDBHOVkwdXpXSG9IMWpRVkNMcmVxNm50WmJhTzNpdDFtR3k3UmpUczFYMm1ZeTIwWmlDcThaT09EY2RFZG1zUFFiMWpTN1BZZWdmV05kSnVMcW5RaVNVbFJxcEZMbXJ5eHRIMU1hN1F3MmdOTlBPZFN0MG9JMjdwMDA3czloNkI5WTB1ejJIb0gxalhYM1orSTQrMWI4SUpkWDg5eExIS1FGTVhRVWFocHhvaVBONVArb25mVStBMC9zOWg2RGVzYVhaN0QwRDZ4cEc3T0xiVXR1MFN0VzVKSngyYkJzbWJ0aVNpRWsrY3hvQ1dXU2FWcFpPazJ2RFZvMFZZZG5zUFFiMWpTTnZaY0NIMWpTZDJjK3AxWEFtRnFFT21PUEVmYUgrQlFkMXVlbzIxMUl6cmdGVVlLTkFBcUkxV3p0Q3BVcVZDUlVxVktnRlNwVXFBVktsU29CVXFWS2dGU3BVcUFWS2xTb0JVcVZLZ0ZTcFVxQVZLbFNvRC85az1cIixcclxuXHJcbiAgICAgICAgbG9hZGVyVGV4dDogXCLmraPlnKjovb3lhaUuLi4gXCIsXHJcblxyXG4gICAgICAgIGxvYWRlckZvbnQ6IFwiQXJpYWxcIixcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIGxpc3ROb3RpZmljYXRpb25JbnRlcmVzdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIHB1cmVtdmMuc3RhdGVtYWNoaW5lLlN0YXRlTWFjaGluZS5DSEFOR0VEXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqIEBvdmVycmlkZSAqL1xyXG4gICAgICAgIGhhbmRsZU5vdGlmaWNhdGlvbjogZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG5vdGlmaWNhdGlvbi5nZXROYW1lKCkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgcHVyZW12Yy5zdGF0ZW1hY2hpbmUuU3RhdGVNYWNoaW5lLkNIQU5HRUQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKG5vdGlmaWNhdGlvbi5nZXRCb2R5KCkubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXdNZWRpYXRvciA9IHRoaXMuZmFjYWRlLnJldHJpZXZlTWVkaWF0b3Iobm90aWZpY2F0aW9uLmdldEJvZHkoKS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmlld01lZGlhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0Vmlldyh2aWV3TWVkaWF0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2luaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgICAgICBvblJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXRWaWV3OiBmdW5jdGlvbiAodmlld01lZGlhdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHNlbGYudmlld0NvbXBvbmVudCA9IG5ldyBjYy5TY2VuZSgpO1xyXG5cclxuICAgICAgICAgICAgdmlld01lZGlhdG9yLmluaXQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHZpZXdNZWRpYXRvci5nZXRWaWV3Q29tcG9uZW50KCk7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi52aWV3Q29tcG9uZW50LmFkZENoaWxkKGNoaWxkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHJlcyA9IHZpZXdNZWRpYXRvci5nZXRSZXNvdXJjZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGhhbmRsZVNjZW5lQ2hhbmdlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VuZE5vdGlmaWNhdGlvbignU0NFTkVfQ0hBTkdFRCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBHZW5lQ29jb3NKUy5Mb2FkZXJTY2VuZS5wcmVsb2FkKHJlcywgaGFuZGxlU2NlbmVDaGFuZ2VkLCB0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVNjZW5lQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9LFxyXG4gICAgLy8gU1RBVElDIE1FTUJFUlNcclxuICAgIHtcclxuICAgICAgICBOQU1FOiAnU2NlbmVNZWRpYXRvcicsXHJcbiAgICAgICAgU0NFTkVfQ0hBTkdFX1ZJRVc6ICdTY2VuZUNoYW5nZVZpZXcnXHJcbiAgICB9XHJcbik7XHJcbiIsInZhciByZXMgPSB7XG4gICAgSGVsbG9Xb3JsZF9wbmcgOiBcInJlcy9IZWxsb1dvcmxkLnBuZ1wiLFxuICAgIENsb3NlTm9ybWFsX3BuZyA6IFwicmVzL0Nsb3NlTm9ybWFsLnBuZ1wiLFxuICAgIENsb3NlU2VsZWN0ZWRfcG5nIDogXCJyZXMvQ2xvc2VTZWxlY3RlZC5wbmdcIlxufTtcblxuXG5cbnZhciBnX3Jlc291cmNlcyA9IFtdO1xuZm9yICh2YXIgaSBpbiByZXMpIHtcbiAgICBnX3Jlc291cmNlcy5wdXNoKHJlc1tpXSk7XG59XG5cbmV4cG9ydHMucmVzID0gcmVzO1xuZXhwb3J0cy5nX3Jlc291cmNlcyA9IGdfcmVzb3VyY2VzOyIsInZhciBMb2FkZXJTY2VuZSA9IGNjLlNjZW5lLmV4dGVuZCh7XHJcbiAgICBfaW1hZ2U6IG51bGwsXHJcbiAgICBfdGV4dDogXCJMb2FkaW5nLi4uIFwiLFxyXG4gICAgX2ZvbnQ6IFwiQXJpYWxcIixcclxuICAgIF9sYWJlbCA6IG51bGwsXHJcbiAgICBfY2xhc3NOYW1lOiBcIkdlbmVKUy5Db2Nvcy5Mb2FkZXJTY2VuZVwiLFxyXG5cclxuICAgIGluaXQgOiBmdW5jdGlvbihpbWFnZSwgdGV4dCwgZm9udCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoaW1hZ2UpIHtcclxuICAgICAgICAgICAgc2VsZi5faW1hZ2UgPSBpbWFnZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRleHQpIHtcclxuICAgICAgICAgICAgc2VsZi5fdGV4dCA9IHRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmb250KSB7XHJcbiAgICAgICAgICAgIHNlbGYuX2ZvbnQgPSBmb250O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxvZ29XaWR0aCA9IDE2MDtcclxuICAgICAgICB2YXIgbG9nb0hlaWdodCA9IDIwMDtcclxuXHJcbiAgICAgICAgdmFyIGJnTGF5ZXIgPSBzZWxmLl9iZ0xheWVyID0gbmV3IGNjLkxheWVyQ29sb3IoY2MuY29sb3IoMzIsIDMyLCAzMiwgMjU1KSk7XHJcbiAgICAgICAgYmdMYXllci5zZXRQb3NpdGlvbihjYy52aXNpYmxlUmVjdC5ib3R0b21MZWZ0KTtcclxuICAgICAgICBzZWxmLmFkZENoaWxkKGJnTGF5ZXIsIDApO1xyXG5cclxuICAgICAgICB2YXIgZm9udFNpemUgPSAyNCwgbGJsSGVpZ2h0ID0gIC1sb2dvSGVpZ2h0IC8gMiArIDEwMDtcclxuXHJcbiAgICAgICAgaWYoc2VsZi5faW1hZ2Upe1xyXG4gICAgICAgICAgICBjYy5sb2FkZXIubG9hZEltZyhzZWxmLl9pbWFnZSwge2lzQ3Jvc3NPcmlnaW4gOiBmYWxzZSB9LCBmdW5jdGlvbihlcnIsIGltZyl7XHJcbiAgICAgICAgICAgICAgICBsb2dvV2lkdGggPSBpbWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBsb2dvSGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHNlbGYuX2luaXRTdGFnZShpbWcsIGNjLnZpc2libGVSZWN0LmNlbnRlcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBmb250U2l6ZSA9IDE0O1xyXG4gICAgICAgICAgICBsYmxIZWlnaHQgPSAtbG9nb0hlaWdodCAvIDIgLSAxMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBsYWJlbCA9IHNlbGYuX2xhYmVsID0gbmV3IGNjLkxhYmVsVFRGKHNlbGYuX3RleHQgK1wiMCVcIiwgIHNlbGYuX2ZvbnQsIGZvbnRTaXplKTtcclxuICAgICAgICBsYWJlbC5zZXRQb3NpdGlvbihjYy5wQWRkKGNjLnZpc2libGVSZWN0LmNlbnRlciwgY2MucCgwLCBsYmxIZWlnaHQpKSk7XHJcbiAgICAgICAgbGFiZWwuc2V0Q29sb3IoY2MuY29sb3IoMTgwLCAxODAsIDE4MCkpO1xyXG4gICAgICAgIGJnTGF5ZXIuYWRkQ2hpbGQodGhpcy5fbGFiZWwsIDEwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG4gICAgX2luaXRTdGFnZTogZnVuY3Rpb24gKGltZywgY2VudGVyUG9zKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciB0ZXh0dXJlMmQgPSBzZWxmLl90ZXh0dXJlMmQgPSBuZXcgY2MuVGV4dHVyZTJEKCk7XHJcbiAgICAgICAgdGV4dHVyZTJkLmluaXRXaXRoRWxlbWVudChpbWcpO1xyXG4gICAgICAgIHRleHR1cmUyZC5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcbiAgICAgICAgdmFyIGxvZ28gPSBzZWxmLl9sb2dvID0gbmV3IGNjLlNwcml0ZSh0ZXh0dXJlMmQpO1xyXG4gICAgICAgIGxvZ28uc2V0U2NhbGUoY2MuY29udGVudFNjYWxlRmFjdG9yKCkpO1xyXG4gICAgICAgIGxvZ28ueCA9IGNlbnRlclBvcy54O1xyXG4gICAgICAgIGxvZ28ueSA9IGNlbnRlclBvcy55O1xyXG4gICAgICAgIHNlbGYuX2JnTGF5ZXIuYWRkQ2hpbGQobG9nbywgMTApO1xyXG4gICAgfSxcclxuICAgIG9uRW50ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY2MuTm9kZS5wcm90b3R5cGUub25FbnRlci5jYWxsKHNlbGYpO1xyXG4gICAgICAgIHNlbGYuc2NoZWR1bGUoc2VsZi5fc3RhcnRMb2FkaW5nLCAwLjMpO1xyXG4gICAgfSxcclxuICAgIG9uRXhpdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNjLk5vZGUucHJvdG90eXBlLm9uRXhpdC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIHZhciB0bXBTdHIgPSBzZWxmLl90ZXh0ICtcIjAlXCI7XHJcbiAgICAgICAgdGhpcy5fbGFiZWwuc2V0U3RyaW5nKHRtcFN0cik7XHJcbiAgICB9LFxyXG4gICAgaW5pdFdpdGhSZXNvdXJjZXM6IGZ1bmN0aW9uIChyZXNvdXJjZXMsIGNiKSB7XHJcbiAgICAgICAgaWYoY2MuaXNTdHJpbmcocmVzb3VyY2VzKSlcclxuICAgICAgICAgICAgcmVzb3VyY2VzID0gW3Jlc291cmNlc107XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSByZXNvdXJjZXMgfHwgW107XHJcbiAgICAgICAgdGhpcy5jYiA9IGNiO1xyXG4gICAgfSxcclxuICAgIF9zdGFydExvYWRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi51bnNjaGVkdWxlKHNlbGYuX3N0YXJ0TG9hZGluZyk7XHJcbiAgICAgICAgdmFyIHJlcyA9IHNlbGYucmVzb3VyY2VzO1xyXG4gICAgICAgIGNjLmxvYWRlci5sb2FkKHJlcyxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCwgY291bnQsIGxvYWRlZENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudCA9IChsb2FkZWRDb3VudCAvIGNvdW50ICogMTAwKSB8IDA7XHJcbiAgICAgICAgICAgICAgICBwZXJjZW50ID0gTWF0aC5taW4ocGVyY2VudCwgMTAwKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuX2xhYmVsLnNldFN0cmluZyhzZWxmLl90ZXh0ICsgcGVyY2VudCArIFwiJVwiKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY2IpXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jYigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufSk7XHJcbkxvYWRlclNjZW5lLnNldEltYWdlID0gZnVuY3Rpb24oaW1hZ2Upe1xyXG5cclxufVxyXG5cclxuTG9hZGVyU2NlbmUucHJlbG9hZCA9IGZ1bmN0aW9uKHJlc291cmNlcywgY2IsIHNlbmRlcil7XHJcblxyXG4gICAgaWYoIXRoaXMubG9hZGVyU2NlbmUpIHtcclxuICAgICAgICB0aGlzLmxvYWRlclNjZW5lID0gbmV3IExvYWRlclNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJTY2VuZS5pbml0KHNlbmRlci5sb2FkZXJJbWFnZSwgc2VuZGVyLmxvYWRlclRleHQsIHNlbmRlci5sb2FkZXJGb250KTtcclxuICAgIH1cclxuICAgIHRoaXMubG9hZGVyU2NlbmUuaW5pdFdpdGhSZXNvdXJjZXMocmVzb3VyY2VzLCBjYik7XHJcbiAgICBjYy5kaXJlY3Rvci5ydW5TY2VuZSh0aGlzLmxvYWRlclNjZW5lKTtcclxuICAgIHJldHVybiB0aGlzLmxvYWRlclNjZW5lO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMb2FkZXJTY2VuZTsiLCJ2YXIgR2VuZUNvY29zSlMgPSB7XHJcbiAgICBMb2FkZXJTY2VuZTogcmVxdWlyZShcIi4vY2xhc3MvTG9hZGVyU2NlbmUuanNcIilcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VuZUNvY29zSlM7IiwiLyoqKiBlYXNlLm1pbi0wLjIuNC5qcyAqKiovXHJcblxyXG52YXIgZWFzZWpzPXt9O1xyXG4oZnVuY3Rpb24oQixuKXt2YXIgaj17fSxoPWZ1bmN0aW9uKGIpe3ZhciBiPShcIi9cIj09PWIuc3Vic3RyKDAsMSk/YjpuK1wiL1wiK2IpLnJlcGxhY2UoLyhbXlxcL10rXFwvXFwuXFwuXFwvfFxcLlxcL3xeXFwvKS9nLFwiXCIpLGM9altiXTtpZih2b2lkIDA9PT1jKXRocm93XCJbZWFzZS5qc10gVW5kZWZpbmVkIG1vZHVsZTogXCIrYjtyZXR1cm4gYy5leHBvcnRzfTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYygpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGMpKXJldHVybiBuZXcgYzt0aGlzLl9fXyQkaWQkJD1lK2YoMUU4KmEoKSl9Yi5leHBvcnRzPXt9O249XCJ1dGlsL3N5bWJvbFwiO3ZhciBhPU1hdGgucmFuZG9tLGY9TWF0aC5mbG9vcixlPVwiIFwiK1N0cmluZy5mcm9tQ2hhckNvZGUoZigxMCphKCkpJTMxKzEpK1wiJFwiO2MucHJvdG90eXBlPXt0b1N0cmluZzpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9fXyQkaWQkJH19O2IuZXhwb3J0cz1jfSkoaltcInV0aWwvc3ltYm9sL0ZhbGxiYWNrU3ltYm9sXCJdPXt9LFwiLlwiKTtcclxuICAgIChmdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBjO3RoaXMuX2FsdD17fX1iLmV4cG9ydHM9e307bj1cInV0aWxcIjsoMCxldmFsKShcInZhciBfdGhlX2dsb2JhbD10aGlzXCIpO2MuZXhwb3NlPWZ1bmN0aW9uKCl7cmV0dXJuIF90aGVfZ2xvYmFsfTtjLnByb3RvdHlwZT17cHJvdmlkZUFsdDpmdW5jdGlvbihhLGMpe2lmKCEodm9pZCAwIT09X3RoZV9nbG9iYWxbYV18fHZvaWQgMCE9PXRoaXMuX2FsdFthXSkpcmV0dXJuIHRoaXMuX2FsdFthXT1jKCksdGhpc30sZ2V0OmZ1bmN0aW9uKGEpe3JldHVybiB2b2lkIDAhPT10aGlzLl9hbHRbYV0/dGhpcy5fYWx0W2FdOl90aGVfZ2xvYmFsW2FdfX07Yi5leHBvcnRzPWN9KShqW1widXRpbC9HbG9iYWxcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtiLmV4cG9ydHM9e307bj1cInV0aWxcIjt2YXIgYz1oKFwiLi9zeW1ib2wvRmFsbGJhY2tTeW1ib2xcIiksYT1oKFwiLi9HbG9iYWxcIikuZXhwb3NlKCk7XHJcbiAgICAgICAgYi5leHBvcnRzPWEuU3ltYm9sfHxjfSkoaltcInV0aWwvU3ltYm9sXCJdPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7Yj1iLmV4cG9ydHM9e307bj1cIi5cIjt2YXIgYz17XCJwdWJsaWNcIjoxLFwicHJvdGVjdGVkXCI6MixcInByaXZhdGVcIjo0LFwic3RhdGljXCI6OCxcImFic3RyYWN0XCI6MTYsXCJjb25zdFwiOjMyLHZpcnR1YWw6NjQsb3ZlcnJpZGU6MTI4LHByb3h5OjI1Nix3ZWFrOjUxMn0sYT17YW1vZHM6Y1tcInB1YmxpY1wiXXxjW1wicHJvdGVjdGVkXCJdfGNbXCJwcml2YXRlXCJdLHZpcnR1YWw6Y1tcImFic3RyYWN0XCJdfGMudmlydHVhbH07Yi5rdmFscz1jO2Iua21hc2tzPWE7Yi5wYXJzZUtleXdvcmRzPWZ1bmN0aW9uKGIpe3ZhciBlPWIsZD1bXSxnPTAsaT17fTtpZigxIT09KGQ9KFwiXCIrYikuc3BsaXQoL1xccysvKSkubGVuZ3RoKXtlPWQucG9wKCk7Zm9yKGI9ZC5sZW5ndGg7Yi0tOyl7dmFyIEM9ZFtiXSxyPWNbQ107aWYoIXIpdGhyb3cgRXJyb3IoXCJVbmV4cGVjdGVkIGtleXdvcmQgZm9yICdcIitlK1wiJzogXCIrXHJcbiAgICAgICAgQyk7aVtDXT0hMDtnfD1yfX1lLm1hdGNoKC9eX1teX10vKSYmIShnJmEuYW1vZHMpJiYoaVtcInByaXZhdGVcIl09ITAsZ3w9Y1tcInByaXZhdGVcIl0pO3JldHVybntuYW1lOmUsa2V5d29yZHM6aSxiaXR3b3JkczpnfX19KShqLnByb3BfcGFyc2VyPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYyhhKXt0aHJvdyBhO31mdW5jdGlvbiBhKGEsYyxiKXtmb3IodmFyIGU9Yi5sZW5ndGg7ZS0tOyludWxsPT09YltlXS5tYXRjaCgvXlthLXpfXVthLXowLTlfXSokL2kpJiZhKFN5bnRheEVycm9yKFwiTWVtYmVyIFwiK2MrXCIgY29udGFpbnMgaW52YWxpZCBwYXJhbWV0ZXIgJ1wiK2JbZV0rXCInXCIpKX1mdW5jdGlvbiBmKCl7cmV0dXJuIGc/ZnVuY3Rpb24oYSxjLGIpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShhLGMse3ZhbHVlOmIsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMSxjb25maWd1cmFibGU6ITF9KX06ZnVuY3Rpb24oYSxjLGIpe2FbY109Yn19dmFyIGU9Yi5leHBvcnRzPXt9O249XCIuXCI7XHJcbiAgICAgICAgdmFyIGQ9aChcIi4vcHJvcF9wYXJzZXJcIikucGFyc2VLZXl3b3JkcyxnO2E6e2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkpdHJ5e09iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSxcInhcIix7fSk7Zz0hMDticmVhayBhfWNhdGNoKGkpe31nPSExfWUuR2xvYmFsPWgoXCIuL3V0aWwvR2xvYmFsXCIpO2UuZnJlZXplPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBPYmplY3QuZnJlZXplP09iamVjdC5mcmVlemU6ZnVuY3Rpb24oKXt9O2UuZGVmaW5lUHJvcGVydHlGYWxsYmFjaz1mdW5jdGlvbihhKXtpZih2b2lkIDA9PT1hKXJldHVybiFnO2c9IWE7ZS5kZWZpbmVTZWN1cmVQcm9wPWYoKTtyZXR1cm4gZX07ZS5kZWZpbmVTZWN1cmVQcm9wPWYoKTtlLmNsb25lPWZ1bmN0aW9uIHIoYSxjKXtjPSEhYztpZihhIGluc3RhbmNlb2YgQXJyYXkpe2lmKCFjKXJldHVybiBhLnNsaWNlKDApO2Zvcih2YXIgYj1bXSxlPTAsZD1hLmxlbmd0aDtlPGQ7ZSsrKWIucHVzaChyKGFbZV0sYykpO1xyXG4gICAgICAgICAgICByZXR1cm4gYn1pZihcImZ1bmN0aW9uXCIhPT10eXBlb2YgYSYmYSBpbnN0YW5jZW9mIE9iamVjdCl7Yj17fTtlPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7Zm9yKGQgaW4gYSllLmNhbGwoYSxkKSYmKGJbZF09Yz9yKGFbZF0pOmFbZF0pO3JldHVybiBifXJldHVybiBhfTtlLmNvcHlUbz1mdW5jdGlvbihhLGMsYil7dmFyIGI9ISFiLGQ7aWYoIShhIGluc3RhbmNlb2YgT2JqZWN0KXx8IShjIGluc3RhbmNlb2YgT2JqZWN0KSl0aHJvdyBUeXBlRXJyb3IoXCJNdXN0IHByb3ZpZGUgYm90aCBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIG9iamVjdHNcIik7aWYoZylmb3IodmFyIGYgaW4gYylkPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYyxmKSxkLmdldHx8ZC5zZXQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsZixkKTphW2ZdPWI/ZS5jbG9uZShjW2ZdLCEwKTpjW2ZdO2Vsc2UgZm9yKGYgaW4gYylhW2ZdPWI/ZS5jbG9uZShjW2ZdLCEwKTpjW2ZdO3JldHVybiBhfTtlLnByb3BQYXJzZT1cclxuICAgICAgICAgICAgZnVuY3Rpb24oYixmLHApe3ZhciB2PWZ1bmN0aW9uKCl7fSxpPWYuZWFjaHx8dm9pZCAwLGg9Zi5wcm9wZXJ0eXx8dixtPWYubWV0aG9kfHx2LHY9Zi5nZXRzZXR8fHYsbD1mLmtleXdvcmRQYXJzZXJ8fGQseD1mLl90aHJvd3x8YyxqPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkscz17fSxrPVwiXCIscz17fSxvPW51bGwsdD0hMSx1PSExLHc7Zm9yKHcgaW4gYilpZihqLmNhbGwoYix3KSl7aWYoZylrPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYix3KSx0PWsuZ2V0LHU9ay5zZXQ7bz1cImZ1bmN0aW9uXCI9PT10eXBlb2YgdD92b2lkIDA6Ylt3XTtzPWwodyl8fHt9O2s9cy5uYW1lfHx3O3M9cy5rZXl3b3Jkc3x8e307aWYoZi5hc3N1bWVBYnN0cmFjdHx8c1tcImFic3RyYWN0XCJdJiYhcy5vdmVycmlkZSlzW1wiYWJzdHJhY3RcIl09ITAsbyBpbnN0YW5jZW9mIEFycmF5fHx4KFR5cGVFcnJvcihcIk1pc3NpbmcgcGFyYW1ldGVyIGxpc3QgZm9yIGFic3RyYWN0IG1ldGhvZDogXCIrXHJcbiAgICAgICAgICAgICAgICBrKSksYSh4LGssbyksbz1lLmNyZWF0ZUFic3RyYWN0TWV0aG9kLmFwcGx5KHRoaXMsbyk7aSYmaS5jYWxsKHAsayxvLHMpO3R8fHU/di5jYWxsKHAsayx0LHUscyk6XCJmdW5jdGlvblwiPT09dHlwZW9mIG98fHMucHJveHk/bS5jYWxsKHAsayxvLGUuaXNBYnN0cmFjdE1ldGhvZChvKSxzKTpoLmNhbGwocCxrLG8scyl9fTtlLmNyZWF0ZUFic3RyYWN0TWV0aG9kPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1bXSxiPWFyZ3VtZW50cy5sZW5ndGg7Yi0tOyljW2JdPWFyZ3VtZW50c1tiXTtiPWZ1bmN0aW9uKCl7dGhyb3cgRXJyb3IoXCJDYW5ub3QgY2FsbCBhYnN0cmFjdCBtZXRob2RcIik7fTtlLmRlZmluZVNlY3VyZVByb3AoYixcImFic3RyYWN0RmxhZ1wiLCEwKTtlLmRlZmluZVNlY3VyZVByb3AoYixcImRlZmluaXRpb25cIixjKTtlLmRlZmluZVNlY3VyZVByb3AoYixcIl9fbGVuZ3RoXCIsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIGJ9O2UuaXNBYnN0cmFjdE1ldGhvZD1mdW5jdGlvbihhKXtyZXR1cm5cImZ1bmN0aW9uXCI9PT1cclxuICAgICAgICAgICAgdHlwZW9mIGEmJiEwPT09YS5hYnN0cmFjdEZsYWc/ITA6ITF9O2UuYXJyYXlTaHJpbms9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGI9MCxlPWEubGVuZ3RoO2I8ZTtiKyspe3ZhciBkPWFbYl07dm9pZCAwIT09ZCYmYy5wdXNoKGQpfXJldHVybiBjfTtlLmdldE93blByb3BlcnR5RGVzY3JpcHRvcj1nJiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yfHxmdW5jdGlvbihhLGMpe3JldHVybiFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSxjKT92b2lkIDA6e2dldDp2b2lkIDAsc2V0OnZvaWQgMCx3cml0YWJsZTohMCxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx2YWx1ZTphW2NdfX07ZS5nZXRQcm90b3R5cGVPZj1PYmplY3QuZ2V0UHJvdG90eXBlT2Z8fGZ1bmN0aW9uKCl7fTtlLmdldFByb3BlcnR5RGVzY3JpcHRvcj1mdW5jdGlvbihhLGMsYil7dmFyIGI9ISFiLGQ9ZS5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYSxjKSxhPWUuZ2V0UHJvdG90eXBlT2YoYSk7XHJcbiAgICAgICAgICAgIHJldHVybiFkJiZhJiYoIWJ8fGUuZ2V0UHJvdG90eXBlT2YoYSkpP2UuZ2V0UHJvcGVydHlEZXNjcmlwdG9yKGEsYyxiKTpkfTtlLmRlZmluZVNlY3VyZVByb3AoZS5nZXRQcm9wZXJ0eURlc2NyaXB0b3IsXCJjYW5UcmF2ZXJzZVwiLE9iamVjdC5nZXRQcm90b3R5cGVPZj8hMDohMSl9KShqLnV0aWw9e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKGEpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGMpKXJldHVybiBuZXcgYyhhKTtpZighKGEgaW5zdGFuY2VvZiBFcnJvcikpdGhyb3cgVHlwZUVycm9yKFwiTXVzdCBwcm92aWRlIGV4Y2VwdGlvbiB0byB3cmFwXCIpO0Vycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsYS5tZXNzYWdlKTt0aGlzLm1lc3NhZ2U9YS5tZXNzYWdlO3RoaXMubmFtZT1cIldhcm5pbmdcIjt0aGlzLl9lcnJvcj1hO3RoaXMuc3RhY2s9YS5zdGFjayYmYS5zdGFjay5yZXBsYWNlKC9eLio/XFxuKy8sdGhpcy5uYW1lK1wiOiBcIit0aGlzLm1lc3NhZ2UrXCJcXG5cIil9XHJcbiAgICAgICAgYi5leHBvcnRzPXt9O249XCJ3YXJuXCI7Yy5wcm90b3R5cGU9RXJyb3IoKTtjLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1jO2MucHJvdG90eXBlLm5hbWU9XCJXYXJuaW5nXCI7Yy5wcm90b3R5cGUuZ2V0RXJyb3I9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZXJyb3J9O2IuZXhwb3J0cz1jfSkoaltcIndhcm4vV2FybmluZ1wiXT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoKXtpZighKHRoaXMgaW5zdGFuY2VvZiBjKSlyZXR1cm4gbmV3IGN9Yi5leHBvcnRzPXt9O249XCJ3YXJuXCI7Yy5wcm90b3R5cGU9e2hhbmRsZTpmdW5jdGlvbigpe319O2IuZXhwb3J0cz1jfSkoaltcIndhcm4vRGlzbWlzc2l2ZUhhbmRsZXJcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKGEpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGMpKXJldHVybiBuZXcgYyhhKTt0aGlzLl9jb25zb2xlPWF8fHt9fWIuZXhwb3J0cz17fTtuPVwid2FyblwiO2MucHJvdG90eXBlPXtoYW5kbGU6ZnVuY3Rpb24oYSl7dmFyIGM9XHJcbiAgICAgICAgdGhpcy5fY29uc29sZS53YXJufHx0aGlzLl9jb25zb2xlLmxvZztjJiZjLmNhbGwodGhpcy5fY29uc29sZSxcIldhcm5pbmc6IFwiK2EubWVzc2FnZSl9fTtiLmV4cG9ydHM9Y30pKGpbXCJ3YXJuL0xvZ0hhbmRsZXJcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBjfWIuZXhwb3J0cz17fTtuPVwid2FyblwiO2MucHJvdG90eXBlPXtoYW5kbGU6ZnVuY3Rpb24oYSl7dGhyb3cgYS5nZXRFcnJvcigpO319O2IuZXhwb3J0cz1jfSkoaltcIndhcm4vVGhyb3dIYW5kbGVyXCJdPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7Yi5leHBvcnRzPXt9O249XCIuXCI7Yi5leHBvcnRzPXtXYXJuaW5nOmgoXCIuL3dhcm4vV2FybmluZ1wiKSxEaXNtaXNzaXZlSGFuZGxlcjpoKFwiLi93YXJuL0Rpc21pc3NpdmVIYW5kbGVyXCIpLExvZ0hhbmRsZXI6aChcIi4vd2Fybi9Mb2dIYW5kbGVyXCIpLFRocm93SGFuZGxlcjpoKFwiLi93YXJuL1Rocm93SGFuZGxlclwiKX19KShqLndhcm49XHJcbiAgICB7fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGModyxhKXt0cnl7aWYoYSBpbnN0YW5jZW9mIHcpcmV0dXJuITB9Y2F0Y2goYyl7fXJldHVybiExfWZ1bmN0aW9uIGEodyxhLGMpe2E9dGhpcy5kZWZzO2lmKCEwPT09b1t3XSl0aHJvdyBFcnJvcih3K1wiIGlzIHJlc2VydmVkXCIpO2lmKHMuY2FsbChhLHcpJiYhYy53ZWFrJiYhYVt3XS53ZWFrKXRocm93IEVycm9yKFwiQ2Fubm90IHJlZGVmaW5lIG1ldGhvZCAnXCIrdytcIicgaW4gc2FtZSBkZWNsYXJhdGlvblwiKTthW3ddPWN9ZnVuY3Rpb24gZihhLGMsYil7dGhpcy5fY2IuX21lbWJlckJ1aWxkZXIuYnVpbGRQcm9wKGkoYik/dGhpcy5zdGF0aWNfbWVtYmVycy5wcm9wczp0aGlzLnByb3BfaW5pdCxudWxsLGEsYyxiLHRoaXMuYmFzZSl9ZnVuY3Rpb24gZShhLGMsYixlKXt2YXIgZD1pKGUpP3RoaXMuc3RhdGljX21lbWJlcnMubWV0aG9kczp0aGlzLm1lbWJlcnMsaz1pKGUpP3RoaXMuc3RhdGljSW5zdExvb2t1cDptLmdldE1ldGhvZEluc3RhbmNlO1xyXG4gICAgICAgIHRoaXMuX2NiLl9tZW1iZXJCdWlsZGVyLmJ1aWxkR2V0dGVyU2V0dGVyKGQsbnVsbCxhLGMsYixlLGssdGhpcy5jbGFzc19pZCx0aGlzLmJhc2UpfWZ1bmN0aW9uIGQoYSxjLGIsZSl7dmFyIGQ9aShlKSxrPWQ/dGhpcy5zdGF0aWNfbWVtYmVycy5tZXRob2RzOnRoaXMubWVtYmVycyxkPWQ/dGhpcy5zdGF0aWNJbnN0TG9va3VwOm0uZ2V0TWV0aG9kSW5zdGFuY2U7aWYoITA9PT10W2FdJiYoZVtcInByb3RlY3RlZFwiXXx8ZVtcInByaXZhdGVcIl0pKXRocm93IFR5cGVFcnJvcihhK1wiIG11c3QgYmUgcHVibGljXCIpO3RoaXMuX2NiLl9tZW1iZXJCdWlsZGVyLmJ1aWxkTWV0aG9kKGssbnVsbCxhLGMsZSxkLHRoaXMuY2xhc3NfaWQsdGhpcy5iYXNlLHRoaXMuc3RhdGUpJiYoYj8odGhpcy5hYnN0cmFjdF9tZXRob2RzW2FdPSEwLHRoaXMuYWJzdHJhY3RfbWV0aG9kcy5fX2xlbmd0aCsrKTpzLmNhbGwodGhpcy5hYnN0cmFjdF9tZXRob2RzLGEpJiYhMT09PWImJihkZWxldGUgdGhpcy5hYnN0cmFjdF9tZXRob2RzW2FdLFxyXG4gICAgICAgIHRoaXMuYWJzdHJhY3RfbWV0aG9kcy5fX2xlbmd0aC0tKSxlLnZpcnR1YWwmJih0aGlzLnZpcnR1YWxfbWVtYmVyc1thXT0hMCkpfWZ1bmN0aW9uIGcoYSxjLGIsZSl7aWYoYS5fX18kJGFic3RyYWN0JCQpe2lmKCFlJiYwPT09Yi5fX2xlbmd0aCl0aHJvdyBUeXBlRXJyb3IoXCJDbGFzcyBcIisoY3x8XCIoYW5vbnltb3VzKVwiKStcIiB3YXMgZGVjbGFyZWQgYXMgYWJzdHJhY3QsIGJ1dCBjb250YWlucyBubyBhYnN0cmFjdCBtZW1iZXJzXCIpO31lbHNlIGlmKDA8Yi5fX2xlbmd0aClpZihlKWEuX19fJCRhYnN0cmFjdCQkPSEwO2Vsc2UgdGhyb3cgVHlwZUVycm9yKFwiQ2xhc3MgXCIrKGN8fFwiKGFub255bW91cylcIikrXCIgY29udGFpbnMgYWJzdHJhY3QgbWVtYmVycyBhbmQgbXVzdCB0aGVyZWZvcmUgYmUgZGVjbGFyZWQgYWJzdHJhY3RcIik7fWZ1bmN0aW9uIGkoYSl7cmV0dXJuIGFbXCJzdGF0aWNcIl18fGFbXCJjb25zdFwiXT8hMDohMX1mdW5jdGlvbiBDKGEsYyl7dmFyIGI9Yy5fX2NpZD9tLmdldE1ldGEoYyk6XHJcbiAgICAgICAgdm9pZCAwO3JldHVybiBiP2FbdV0ubWV0YT1sLmNsb25lKGIsITApOmFbdV0ubWV0YT17aW1wbGVtZW50ZWQ6W119fWZ1bmN0aW9uIHIoYSxjKXtsLmRlZmluZVNlY3VyZVByb3AoYSxcIl9faWlkXCIsYyl9ZnVuY3Rpb24geShhKXt2YXIgYz1mdW5jdGlvbigpe307Yy5wcm90b3R5cGU9YTtsLmRlZmluZVNlY3VyZVByb3AoYSx1LHt9KTthW3VdLnZpcz1uZXcgY31mdW5jdGlvbiBwKGEpe3ZhciBjPWZ1bmN0aW9uKGMpe3JldHVybiBiLmV4cG9ydHMuaXNJbnN0YW5jZU9mKGMsYSl9O2wuZGVmaW5lU2VjdXJlUHJvcChhLFwiaXNJbnN0YW5jZU9mXCIsYyk7bC5kZWZpbmVTZWN1cmVQcm9wKGEsXCJpc0FcIixjKX1mdW5jdGlvbiB2KGEsYyl7dmFyIGI9MDxjLl9fbGVuZ3RoPyEwOiExO2wuZGVmaW5lU2VjdXJlUHJvcChhLFwiaXNBYnN0cmFjdFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGJ9KX1mdW5jdGlvbiBqKGEsYyl7bC5kZWZpbmVTZWN1cmVQcm9wKGEsXCJfX2NpZFwiLGMpO2wuZGVmaW5lU2VjdXJlUHJvcChhLnByb3RvdHlwZSxcclxuICAgICAgICBcIl9fY2lkXCIsYyl9ZnVuY3Rpb24gQShhLGMpe2EuX19fJCRmaW5hbCQkPSEhYy5fX18kJGZpbmFsJCQ7YS5fX18kJGFic3RyYWN0JCQ9ISFjLl9fXyQkYWJzdHJhY3QkJDtjLl9fXyQkZmluYWwkJD1jLl9fXyQkYWJzdHJhY3QkJD12b2lkIDB9dmFyIG09Yi5leHBvcnRzPXt9O249XCIuXCI7dmFyIGw9aChcIi4vdXRpbFwiKSx4PWgoXCIuL3dhcm5cIikuV2FybmluZyxxPWgoXCIuL3V0aWwvU3ltYm9sXCIpLHM9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxrPSExPT09T2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHt0b1N0cmluZzpmdW5jdGlvbigpe319LFwidG9TdHJpbmdcIik/ITA6ITEsbz17X19pbml0UHJvcHM6ITAsY29uc3RydWN0b3I6ITB9LHQ9e19fY29uc3RydWN0OiEwLF9fbWl4aW46ITAsdG9TdHJpbmc6ITAsX190b1N0cmluZzohMH0sdT1xKCk7Yi5leHBvcnRzPW09ZnVuY3Rpb24oYSxjLGUpe2lmKCEodGhpcyBpbnN0YW5jZW9mIG0pKXJldHVybiBuZXcgYi5leHBvcnRzKGEsXHJcbiAgICAgICAgYyxlKTt0aGlzLl93YXJuSGFuZGxlcj1hO3RoaXMuX21lbWJlckJ1aWxkZXI9Yzt0aGlzLl92aXNGYWN0b3J5PWU7dGhpcy5faW5zdGFuY2VJZD10aGlzLl9jbGFzc0lkPTA7dGhpcy5fc3Byb3BJbnRlcm5hbD10aGlzLl9leHRlbmRpbmc9ITF9O20uQ2xhc3NCYXNlPWZ1bmN0aW9uKCl7fTtsLmRlZmluZVNlY3VyZVByb3AobS5DbGFzc0Jhc2UsXCJfX2NpZFwiLDApO20uQ2xhc3NCYXNlLiQ9ZnVuY3Rpb24oYSxjKXtpZih2b2lkIDAhPT1jKXRocm93IFJlZmVyZW5jZUVycm9yKFwiQ2Fubm90IHNldCB2YWx1ZSBvZiB1bmRlY2xhcmVkIHN0YXRpYyBwcm9wZXJ0eSAnXCIrYStcIidcIik7fTttLmdldFJlc2VydmVkTWVtYmVycz1mdW5jdGlvbigpe3JldHVybiBsLmNsb25lKG8sITApfTttLmdldEZvcmNlZFB1YmxpY01ldGhvZHM9ZnVuY3Rpb24oKXtyZXR1cm4gbC5jbG9uZSh0LCEwKX07bS5nZXRNZXRhPWZ1bmN0aW9uKGEpe3JldHVybihhW3VdfHx7fSkubWV0YXx8bnVsbH07bS5pc0luc3RhbmNlT2Y9XHJcbiAgICAgICAgZnVuY3Rpb24oYSxiKXtyZXR1cm4hYXx8IWI/ITE6ISEoYS5fX2lzSW5zdGFuY2VPZnx8YykoYSxiKX07bS5wcm90b3R5cGUuYnVpbGQ9ZnVuY3Rpb24oYSxjKXt2YXIgYj10aGlzO3RoaXMuX2V4dGVuZGluZz0hMDt2YXIgZT1hcmd1bWVudHMsZD1lLmxlbmd0aCxmPSgwPGQ/ZVtkLTFdOjApfHx7fSx0PSgxPGQ/ZVtkLTJdOjApfHxtLkNsYXNzQmFzZSxlPXRoaXMuX2dldEJhc2UodCksZD1cIlwiLG89ITEscj10aGlzLl9tZW1iZXJCdWlsZGVyLmluaXRNZW1iZXJzKCkscD10aGlzLl9tZW1iZXJCdWlsZGVyLmluaXRNZW1iZXJzKGUpLGk9e21ldGhvZHM6dGhpcy5fbWVtYmVyQnVpbGRlci5pbml0TWVtYmVycygpLHByb3BzOnRoaXMuX21lbWJlckJ1aWxkZXIuaW5pdE1lbWJlcnMoKX0sbz1tLmdldE1ldGEodCl8fHt9LHk9bC5jbG9uZShvLmFic3RyYWN0TWV0aG9kcyl8fHtfX2xlbmd0aDowfSxzPWwuY2xvbmUoby52aXJ0dWFsTWVtYmVycyl8fHt9O2lmKCEwPT09dC5fX18kJGZpbmFsJCQpdGhyb3cgRXJyb3IoXCJDYW5ub3QgZXh0ZW5kIGZpbmFsIGNsYXNzIFwiK1xyXG4gICAgICAgICh0W3VdLm1ldGEubmFtZXx8XCIoYW5vbnltb3VzKVwiKSk7KGQ9Zi5fX25hbWUpJiZkZWxldGUgZi5fX25hbWU7dm9pZCAwIT09KG89Zi5fX18kJGF1dG8kYWJzdHJhY3QkJCkmJmRlbGV0ZSBmLl9fXyQkYXV0byRhYnN0cmFjdCQkO2lmKGsmJmYudG9TdHJpbmchPT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKWYuX190b1N0cmluZz1mLnRvU3RyaW5nO3RoaXMuX2NsYXNzSWQrKzt2b2lkIDA9PT0oZVt1XXx8e30pLnZpcyYmdGhpcy5fZGlzY292ZXJQcm90b1Byb3BzKGUscik7dHJ5e3RoaXMuYnVpbGRNZW1iZXJzKGYsdGhpcy5fY2xhc3NJZCx0LHIse2FsbDpwLFwiYWJzdHJhY3RcIjp5LFwic3RhdGljXCI6aSx2aXJ0dWFsOnN9LGZ1bmN0aW9uKCl7cmV0dXJuIHEuX19fJCRzdmlzJCR9KX1jYXRjaChoKXtpZihoIGluc3RhbmNlb2YgeCl0aGlzLl93YXJuSGFuZGxlci5oYW5kbGUoaCk7ZWxzZSB0aHJvdyBoO31lLl9fXyQkcGFyZW50JCQ9dC5wcm90b3R5cGU7dmFyIHE9dGhpcy5jcmVhdGVDdG9yKGQsXHJcbiAgICAgICAgeSxwKTt0aGlzLmluaXRTdGF0aWNWaXNpYmlsaXR5T2JqKHEpO3ZhciBuPXRoaXMsQj1mdW5jdGlvbihhLGMpe24uYXR0YWNoU3RhdGljKGEsaSx0LGMpfTtCKHEsITEpO3RoaXMuX2F0dGFjaFByb3BJbml0KGUscixwLHEsdGhpcy5fY2xhc3NJZCk7cS5wcm90b3R5cGU9ZTtxLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1xO3EuX19fJCRwcm9wcyQkPXI7cS5fX18kJG1ldGhvZHMkJD1wO3EuX19fJCRzaW5pdCQkPUI7QShxLGYpO2cocSxkLHksbyk7bC5kZWZpbmVTZWN1cmVQcm9wKGUsXCJfX3NlbGZcIixxLl9fXyQkc3ZpcyQkKTtvPUMocSx0KTtvLmFic3RyYWN0TWV0aG9kcz15O28udmlydHVhbE1lbWJlcnM9cztvLm5hbWU9ZDt2KHEseSk7aihxLHRoaXMuX2NsYXNzSWQpO3EuYXNQcm90b3R5cGU9ZnVuY3Rpb24oKXtiLl9leHRlbmRpbmc9ITA7dmFyIGE9cSgpO2IuX2V4dGVuZGluZz0hMTtyZXR1cm4gYX07dGhpcy5fZXh0ZW5kaW5nPSExO3JldHVybiBxfTttLnByb3RvdHlwZS5fZ2V0QmFzZT1cclxuICAgICAgICBmdW5jdGlvbihhKXtzd2l0Y2godHlwZW9mIGEpe2Nhc2UgXCJmdW5jdGlvblwiOnJldHVybiBuZXcgYTtjYXNlIFwib2JqZWN0XCI6cmV0dXJuIGF9dGhyb3cgVHlwZUVycm9yKFwiTXVzdCBleHRlbmQgZnJvbSBDbGFzcywgY29uc3RydWN0b3Igb3Igb2JqZWN0XCIpO307bS5wcm90b3R5cGUuX2Rpc2NvdmVyUHJvdG9Qcm9wcz1mdW5jdGlvbihhLGMpe3ZhciBiPU9iamVjdC5oYXNPd25Qcm9wZXJ0eSxlO2ZvcihlIGluIGEpe3ZhciBkPWFbZV07Yi5jYWxsKGEsZSkmJlwiZnVuY3Rpb25cIiE9PXR5cGVvZiBkJiZ0aGlzLl9tZW1iZXJCdWlsZGVyLmJ1aWxkUHJvcChjLG51bGwsZSxkLHt9KX19O20ucHJvdG90eXBlLmJ1aWxkTWVtYmVycz1mdW5jdGlvbihjLGIsayx0LHUsQyl7dmFyIG89e19jYjp0aGlzLHByb3BfaW5pdDp0LGNsYXNzX2lkOmIsYmFzZTprLHN0YXRpY0luc3RMb29rdXA6QyxkZWZzOnt9LHN0YXRlOnt9LG1lbWJlcnM6dS5hbGwsYWJzdHJhY3RfbWV0aG9kczp1W1wiYWJzdHJhY3RcIl0sXHJcbiAgICAgICAgc3RhdGljX21lbWJlcnM6dVtcInN0YXRpY1wiXSx2aXJ0dWFsX21lbWJlcnM6dS52aXJ0dWFsfSxnPXtlYWNoOmEscHJvcGVydHk6ZixnZXRzZXQ6ZSxtZXRob2Q6ZH07aWYoYy5fX18kJHBhcnNlciQkKXt2YXIgcj1jLl9fXyQkcGFyc2VyJCQ7ZGVsZXRlIGMuX19fJCRwYXJzZXIkJDtiPWZ1bmN0aW9uKGEsYyl7Z1thXT1mdW5jdGlvbigpe2Zvcih2YXIgYj1bXSxlPWFyZ3VtZW50cy5sZW5ndGg7ZS0tOyliW2VdPWFyZ3VtZW50c1tlXTtiLnB1c2goYyk7clthXS5hcHBseShvLGIpfX07ci5lYWNoJiZiKFwiZWFjaFwiLGcuZWFjaCk7ci5wcm9wZXJ0eSYmYihcInByb3BlcnR5XCIsZy5wcm9wZXJ0eSk7ci5nZXRzZXQmJmIoXCJnZXRzZXRcIixnLmdldHNldCk7ci5tZXRob2QmJmIoXCJtZXRob2RcIixnLm1ldGhvZCl9bC5wcm9wUGFyc2UoYyxnLG8pO3RoaXMuX21lbWJlckJ1aWxkZXIuZW5kKG8uc3RhdGUpfTttLnByb3RvdHlwZS5jcmVhdGVDdG9yPWZ1bmN0aW9uKGEsYyxiKXthPTA9PT1jLl9fbGVuZ3RoP1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQ29uY3JldGVDdG9yKGEsYik6dGhpcy5jcmVhdGVBYnN0cmFjdEN0b3IoYSk7bC5kZWZpbmVTZWN1cmVQcm9wKGEsdSx7fSk7cmV0dXJuIGF9O20ucHJvdG90eXBlLmNyZWF0ZUNvbmNyZXRlQ3Rvcj1mdW5jdGlvbihhLGMpe2Z1bmN0aW9uIGIoKXtpZighKHRoaXMgaW5zdGFuY2VvZiBiKSlyZXR1cm4gZT1hcmd1bWVudHMsbmV3IGI7eSh0aGlzKTt0aGlzLl9faW5pdFByb3BzKCk7aWYoIWQuX2V4dGVuZGluZyl7cih0aGlzLCsrZC5faW5zdGFuY2VJZCk7dmFyIGs9XCJmdW5jdGlvblwiPT09dHlwZW9mIHRoaXMuX19fJCRjdG9yJHByZSQkO2smJmIucHJvdG90eXBlLmhhc093blByb3BlcnR5KFwiX19fJCRjdG9yJHByZSQkXCIpJiYodGhpcy5fX18kJGN0b3IkcHJlJCQodSksaz0hMSk7XCJmdW5jdGlvblwiPT09dHlwZW9mIHRoaXMuX19jb25zdHJ1Y3QmJnRoaXMuX19jb25zdHJ1Y3QuYXBwbHkodGhpcyxlfHxhcmd1bWVudHMpO2smJnRoaXMuX19fJCRjdG9yJHByZSQkKHUpO1xyXG4gICAgICAgIFwiZnVuY3Rpb25cIj09PXR5cGVvZiB0aGlzLl9fXyQkY3RvciRwb3N0JCQmJnRoaXMuX19fJCRjdG9yJHBvc3QkJCh1KTtlPW51bGw7cCh0aGlzKTtpZighcy5jYWxsKGNbXCJwdWJsaWNcIl0sXCJ0b1N0cmluZ1wiKSl0aGlzLnRvU3RyaW5nPWNbXCJwdWJsaWNcIl0uX190b1N0cmluZ3x8KGE/ZnVuY3Rpb24oKXtyZXR1cm5cIiM8XCIrYStcIj5cIn06ZnVuY3Rpb24oKXtyZXR1cm5cIiM8YW5vbnltb3VzPlwifSl9fXZhciBlPW51bGwsZD10aGlzO2IudG9TdHJpbmc9YT9mdW5jdGlvbigpe3JldHVybiBhfTpmdW5jdGlvbigpe3JldHVyblwiKENsYXNzKVwifTtyZXR1cm4gYn07bS5wcm90b3R5cGUuY3JlYXRlQWJzdHJhY3RDdG9yPWZ1bmN0aW9uKGEpe3ZhciBjPXRoaXMsYj1mdW5jdGlvbigpe2lmKCFjLl9leHRlbmRpbmcpdGhyb3cgRXJyb3IoXCJBYnN0cmFjdCBjbGFzcyBcIisoYXx8XCIoYW5vbnltb3VzKVwiKStcIiBjYW5ub3QgYmUgaW5zdGFudGlhdGVkXCIpO307Yi50b1N0cmluZz1hP2Z1bmN0aW9uKCl7cmV0dXJuIGF9OlxyXG4gICAgICAgIGZ1bmN0aW9uKCl7cmV0dXJuXCIoQWJzdHJhY3RDbGFzcylcIn07cmV0dXJuIGJ9O20ucHJvdG90eXBlLl9hdHRhY2hQcm9wSW5pdD1mdW5jdGlvbihhLGMsYixlLGQpe3ZhciBrPXRoaXM7bC5kZWZpbmVTZWN1cmVQcm9wKGEsXCJfX2luaXRQcm9wc1wiLGZ1bmN0aW9uKGUpe3ZhciBlPSEhZSxmPWEuX19fJCRwYXJlbnQkJCx0PXRoaXNbdV0udmlzLGY9ZiYmZi5fX2luaXRQcm9wcztcImZ1bmN0aW9uXCI9PT10eXBlb2YgZiYmZi5jYWxsKHRoaXMsITApO2Y9ay5fdmlzRmFjdG9yeS5jcmVhdGVQcm9wUHJveHkodGhpcyx0LGNbXCJwdWJsaWNcIl0pO3Q9dFtkXT1rLl92aXNGYWN0b3J5LnNldHVwKGYsYyxiKTtlfHxsLmRlZmluZVNlY3VyZVByb3AodCxcIl9faW5zdFwiLHRoaXMpfSl9O20ucHJvdG90eXBlLmluaXRTdGF0aWNWaXNpYmlsaXR5T2JqPWZ1bmN0aW9uKGEpe3ZhciBjPXRoaXMsYj1mdW5jdGlvbigpe307Yi5wcm90b3R5cGU9YTtiPW5ldyBiO2EuX19fJCRzdmlzJCQ9YjtiLiQ9ZnVuY3Rpb24oKXtjLl9zcHJvcEludGVybmFsPVxyXG4gICAgICAgICEwO3ZhciBiPWEuJC5hcHBseShhLGFyZ3VtZW50cyk7Yy5fc3Byb3BJbnRlcm5hbD0hMTtyZXR1cm4gYn19O20ucHJvdG90eXBlLmF0dGFjaFN0YXRpYz1mdW5jdGlvbihhLGMsYixlKXt2YXIgZD1jLm1ldGhvZHMsaz1jLnByb3BzLGY9dGhpczsoYz1iLl9fXyQkc2luaXQkJCkmJmMoYSwhMCk7aWYoIWUpYS5fX18kJHNwcm9wcyQkPWssbC5kZWZpbmVTZWN1cmVQcm9wKGEsXCIkXCIsZnVuY3Rpb24oYyxlKXt2YXIgZD0hMSx0PXRoaXMuX19fJCRzcHJvcHMkJD90aGlzOmEsdT10IT09YSxkPXMuY2FsbChrW1wicHVibGljXCJdLGMpJiZcInB1YmxpY1wiOyFkJiZmLl9zcHJvcEludGVybmFsJiYoZD1zLmNhbGwoa1tcInByb3RlY3RlZFwiXSxjKSYmXCJwcm90ZWN0ZWRcInx8IXUmJnMuY2FsbChrW1wicHJpdmF0ZVwiXSxjKSYmXCJwcml2YXRlXCIpO2lmKCExPT09ZClyZXR1cm4oYi5fX2NpZCYmYi4kfHxtLkNsYXNzQmFzZS4kKS5hcHBseSh0LGFyZ3VtZW50cyk7ZD1rW2RdW2NdO2lmKDE8YXJndW1lbnRzLmxlbmd0aCl7aWYoZFsxXVtcImNvbnN0XCJdKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBtb2RpZnkgY29uc3RhbnQgcHJvcGVydHkgJ1wiK1xyXG4gICAgICAgIGMrXCInXCIpO2RbMF09ZTtyZXR1cm4gdH1yZXR1cm4gZFswXX0pO2wuY29weVRvKGEsZFtcInB1YmxpY1wiXSwhMCk7bC5jb3B5VG8oYS5fX18kJHN2aXMkJCxkW1wicHJvdGVjdGVkXCJdLCEwKTtlfHxsLmNvcHlUbyhhLl9fXyQkc3ZpcyQkLGRbXCJwcml2YXRlXCJdLCEwKX07bS5nZXRNZXRob2RJbnN0YW5jZT1mdW5jdGlvbihhLGMpe2lmKHZvaWQgMD09PWEpcmV0dXJuIG51bGw7dmFyIGI9YVt1XSxlO3JldHVybiBhLl9faWlkJiZiJiYoZT1iLnZpcyk/ZVtjXTpudWxsfX0pKGouQ2xhc3NCdWlsZGVyPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7dmFyIGM9Yi5leHBvcnRzPXt9O249XCIuXCI7Yi5leHBvcnRzPWM9ZnVuY3Rpb24oYSl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBiLmV4cG9ydHMoYSk7dGhpcy5fZmFjdG9yeT1hfTtjLnByb3RvdHlwZS53cmFwTWV0aG9kPWZ1bmN0aW9uKGEsYyxiLGQsZyxpKXtyZXR1cm4gdGhpcy5fZmFjdG9yeShhLGMsYixkLGcsaSl9fSkoai5NZXRob2RXcmFwcGVyRmFjdG9yeT1cclxuICAgIHt9LFwiLlwiKTsoZnVuY3Rpb24oYil7Yj1iLmV4cG9ydHM9e307bj1cIi5cIjtiLnN0YW5kYXJkPXt3cmFwT3ZlcnJpZGU6ZnVuY3Rpb24oYyxhLGIsZSl7dmFyIGQ9ZnVuY3Rpb24oKXt2YXIgZD1lKHRoaXMsYil8fHRoaXN8fHt9LGk9dm9pZCAwLEM9ZC5fX3N1cGVyO2QuX19zdXBlcj1hO2k9Yy5hcHBseShkLGFyZ3VtZW50cyk7ZC5fX3N1cGVyPUM7cmV0dXJuIGk9PT1kP3RoaXM6aX07ZFtcInN1cGVyXCJdPWE7cmV0dXJuIGR9LHdyYXBOZXc6ZnVuY3Rpb24oYyxhLGIsZSl7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGE9ZSh0aGlzLGIpfHx0aGlzLGc9dm9pZCAwLGc9Yy5hcHBseShhLGFyZ3VtZW50cyk7cmV0dXJuIGc9PT1hP3RoaXM6Z319LHdyYXBQcm94eTpmdW5jdGlvbihjLGEsYixlLGQsZyl7dmFyIGk9ZyYmZ1tcInN0YXRpY1wiXSxhPWZ1bmN0aW9uKCl7dmFyIGE9ZSh0aGlzLGIpfHx0aGlzLHI9dm9pZCAwLGE9aT9hLiQoYyk6YVtjXTtpZighKG51bGwhPT1hJiZcIm9iamVjdFwiPT09dHlwZW9mIGEmJlxyXG4gICAgICAgIFwiZnVuY3Rpb25cIj09PXR5cGVvZiBhW2RdKSl0aHJvdyBUeXBlRXJyb3IoXCJVbmFibGUgdG8gcHJveHkgXCIrZCtcIigpIGNhbGwgdG8gJ1wiK2MrXCInOyAnXCIrYytcIicgaXMgdW5kZWZpbmVkIG9yICdcIitkK1wiJyBpcyBub3QgYSBmdW5jdGlvbi5cIik7cj1hW2RdLmFwcGx5KGEsYXJndW1lbnRzKTtyZXR1cm4gcj09PWE/dGhpczpyfTthLl9fbGVuZ3RoPU5hTjtyZXR1cm4gYX19fSkoai5NZXRob2RXcmFwcGVycz17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoYSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX19fJCRzdXBlciQkLnByb3RvdHlwZVthXS5hcHBseSh0aGlzLl9fXyQkcG1vJCQsYXJndW1lbnRzKX19ZnVuY3Rpb24gYShhLGMsYil7aWYoY1tcInByaXZhdGVcIl0pcmV0dXJuKGNbXCJwdWJsaWNcIl18fGNbXCJwcm90ZWN0ZWRcIl0pJiZmKGIpLGFbXCJwcml2YXRlXCJdO2lmKGNbXCJwcm90ZWN0ZWRcIl0pcmV0dXJuKGNbXCJwdWJsaWNcIl18fGNbXCJwcml2YXRlXCJdKSYmZihiKSxcclxuICAgICAgICBhW1wicHJvdGVjdGVkXCJdOyhjW1wicHJpdmF0ZVwiXXx8Y1tcInByb3RlY3RlZFwiXSkmJmYoYik7cmV0dXJuIGFbXCJwdWJsaWNcIl19ZnVuY3Rpb24gZihhKXt0aHJvdyBUeXBlRXJyb3IoXCJPbmx5IG9uZSBhY2Nlc3MgbW9kaWZpZXIgbWF5IGJlIHVzZWQgZm9yIGRlZmluaXRpb24gb2YgJ1wiK2ErXCInXCIpO31mdW5jdGlvbiBlKGEsYyxiKXtmb3IodmFyIGQ9aS5sZW5ndGgsZj1udWxsO2QtLTspaWYoZj1nLmdldFByb3BlcnR5RGVzY3JpcHRvcihhW2lbZF1dLGMsITApKXJldHVybntnZXQ6Zi5nZXQsc2V0OmYuc2V0LG1lbWJlcjpmLnZhbHVlfTtyZXR1cm4gdm9pZCAwIT09Yj8oYT1iLl9fXyQkbWV0aG9kcyQkLGQ9Yi5fX18kJHByb3BzJCQsYj0oKGIucHJvdG90eXBlfHx7fSkuX19fJCRwYXJlbnQkJHx8e30pLmNvbnN0cnVjdG9yLGEmJmUoYSxjLGIpfHxkJiZlKGQsYyxiKXx8bnVsbCk6bnVsbH12YXIgZD1iLmV4cG9ydHM9e307bj1cIi5cIjt2YXIgZz1oKFwiLi91dGlsXCIpLGk9W1wicHVibGljXCIsXHJcbiAgICAgICAgXCJwcm90ZWN0ZWRcIixcInByaXZhdGVcIl07Yi5leHBvcnRzPWZ1bmN0aW9uKGEsYyxlLGQpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGIuZXhwb3J0cykpcmV0dXJuIG5ldyBiLmV4cG9ydHMoYSxjLGUsZCk7dGhpcy5fd3JhcE1ldGhvZD1hO3RoaXMuX3dyYXBPdmVycmlkZT1jO3RoaXMuX3dyYXBQcm94eT1lO3RoaXMuX3ZhbGlkYXRlPWR9O2Q9Yi5leHBvcnRzLnByb3RvdHlwZTtkLmluaXRNZW1iZXJzPWZ1bmN0aW9uKGEsYyxiKXtyZXR1cm57XCJwdWJsaWNcIjphfHx7fSxcInByb3RlY3RlZFwiOmN8fHt9LFwicHJpdmF0ZVwiOmJ8fHt9fX07ZC5idWlsZE1ldGhvZD1mdW5jdGlvbihiLGQsZixnLGksaCxqLG0sbCl7dmFyIHg9dGhpcy5fbWV0aG9kS2V5d29yZERlZmF1bHRzLHg9KGQ9KG09ZShiLGYsbSkpP20ubWVtYmVyOm51bGwpJiYoZC5fX18kJGtleXdvcmRzJCR8fHgpLGI9YShiLGksZik7dGhpcy5fdmFsaWRhdGUudmFsaWRhdGVNZXRob2QoZixnLGksbSx4LGwpO2lmKGkucHJveHkmJighZHx8XHJcbiAgICAgICAgIWkud2VhaykpYltmXT10aGlzLl9jcmVhdGVQcm94eShnLGgsaixmLGkpO2Vsc2UgaWYoZCl7aWYoaS53ZWFrJiYheFtcImFic3RyYWN0XCJdKXJldHVybiExO2lmKGkub3ZlcnJpZGV8fHhbXCJhYnN0cmFjdFwiXSlsPWlbXCJhYnN0cmFjdFwiXT9jKGYpOmQsYltmXT10aGlzLl9vdmVycmlkZU1ldGhvZChsLGcsaCxqKTtlbHNlIHRocm93IEVycm9yKFwiTWV0aG9kIGhpZGluZyBub3QgeWV0IGltcGxlbWVudGVkICh3ZSBzaG91bGQgbmV2ZXIgZ2V0IGhlcmU7IGJ1ZykuXCIpO31lbHNlIGJbZl09aVtcImFic3RyYWN0XCJdfHxpW1wicHJpdmF0ZVwiXT9nOnRoaXMuX292ZXJyaWRlTWV0aG9kKG51bGwsZyxoLGopO2JbZl0uX19fJCRrZXl3b3JkcyQkPWk7cmV0dXJuITB9O2QuX21ldGhvZEtleXdvcmREZWZhdWx0cz17dmlydHVhbDohMH07ZC5idWlsZFByb3A9ZnVuY3Rpb24oYyxiLGQsZixnLGkpe2k9KGI9ZShjLGQsaSkpP2IubWVtYmVyOm51bGw7dGhpcy5fdmFsaWRhdGUudmFsaWRhdGVQcm9wZXJ0eShkLFxyXG4gICAgICAgIGYsZyxiLGk/aVsxXTpudWxsKTthKGMsZyxkKVtkXT1bZixnXX07ZC5idWlsZEdldHRlclNldHRlcj1mdW5jdGlvbihjLGIsZCxmLGcsaSxoLGosbCl7Yj1lKGMsZCxsKTt0aGlzLl92YWxpZGF0ZS52YWxpZGF0ZUdldHRlclNldHRlcihkLHt9LGksYixiJiZiLmdldD9iLmdldC5fX18kJGtleXdvcmRzJCQ6bnVsbCk7aWYoZilmPXRoaXMuX292ZXJyaWRlTWV0aG9kKG51bGwsZixoLGopLGYuX19fJCRrZXl3b3JkcyQkPWk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEoYyxpLGQpLGQse2dldDpmLHNldDpnP3RoaXMuX292ZXJyaWRlTWV0aG9kKG51bGwsZyxoLGopOmcsZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITF9KX07ZC5fY3JlYXRlUHJveHk9ZnVuY3Rpb24oYSxjLGIsZCxlKXtyZXR1cm4gdGhpcy5fd3JhcFByb3h5LndyYXBNZXRob2QoYSxudWxsLGIsYyxkLGUpfTtkLl9vdmVycmlkZU1ldGhvZD1mdW5jdGlvbihhLGMsYixkKXt2YXIgZT1udWxsLGU9KGE/dGhpcy5fd3JhcE92ZXJyaWRlOlxyXG4gICAgICAgIHRoaXMuX3dyYXBNZXRob2QpLndyYXBNZXRob2QoYyxhLGQsYnx8ZnVuY3Rpb24oKXt9KTtnLmRlZmluZVNlY3VyZVByb3AoZSxcIl9fbGVuZ3RoXCIsYy5fX2xlbmd0aHx8Yy5sZW5ndGgpO3JldHVybiBlfTtkLl9nZXRWaXNpYmlsaXR5VmFsdWU9ZnVuY3Rpb24oYSl7cmV0dXJuIGFbXCJwcm90ZWN0ZWRcIl0/MTphW1wicHJpdmF0ZVwiXT8yOjB9O2QuZW5kPWZ1bmN0aW9uKGEpe3RoaXMuX3ZhbGlkYXRlJiZ0aGlzLl92YWxpZGF0ZS5lbmQoYSl9fSkoai5NZW1iZXJCdWlsZGVyPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7dmFyIGM9Yi5leHBvcnRzPXt9O249XCIuXCI7Yi5leHBvcnRzPWM9ZnVuY3Rpb24oYSl7aWYoISh0aGlzIGluc3RhbmNlb2YgYi5leHBvcnRzKSlyZXR1cm4gbmV3IGIuZXhwb3J0cyhhKTt0aGlzLl93YXJuaW5nSGFuZGxlcj1hfHxmdW5jdGlvbigpe319O2MucHJvdG90eXBlLl9pbml0U3RhdGU9ZnVuY3Rpb24oYSl7aWYoYS5fX3ZyZWFkeSlyZXR1cm4gYTthLndhcm49e307YS5fX3ZyZWFkeT1cclxuICAgICAgICAhMDtyZXR1cm4gYX07Yy5wcm90b3R5cGUuZW5kPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYyBpbiBhLndhcm4pe3ZhciBiPWEud2FybltjXSxkO2ZvcihkIGluIGIpdGhpcy5fd2FybmluZ0hhbmRsZXIoYltkXSl9YS5fX3ZyZWFkeT0hMX07Yy5wcm90b3R5cGUudmFsaWRhdGVNZXRob2Q9ZnVuY3Rpb24oYSxjLGIsZCxnLGkpe3RoaXMuX2luaXRTdGF0ZShpKTt2YXIgaD1kP2QubWVtYmVyOm51bGw7aWYoYltcImFic3RyYWN0XCJdJiZiW1wicHJpdmF0ZVwiXSl0aHJvdyBUeXBlRXJyb3IoXCJNZXRob2QgJ1wiK2ErXCInIGNhbm5vdCBiZSBib3RoIHByaXZhdGUgYW5kIGFic3RyYWN0XCIpO2lmKGJbXCJjb25zdFwiXSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3QgZGVjbGFyZSBtZXRob2QgJ1wiK2ErXCInIGFzIGNvbnN0YW50OyBrZXl3b3JkIGlzIHJlZHVuZGFudFwiKTtpZihiLnZpcnR1YWwmJmJbXCJzdGF0aWNcIl0pdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGRlY2xhcmUgc3RhdGljIG1ldGhvZCAnXCIrYStcIicgYXMgdmlydHVhbFwiKTtcclxuICAgICAgICBpZihkJiYoZC5nZXR8fGQuc2V0KSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3Qgb3ZlcnJpZGUgZ2V0dGVyL3NldHRlciAnXCIrYStcIicgd2l0aCBtZXRob2RcIik7aWYoYi5wcm94eSl7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBjKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBkZWNsYXJlIHByb3h5IG1ldGhvZCAnXCIrYStcIic7IHN0cmluZyB2YWx1ZSBleHBlY3RlZFwiKTtpZihiW1wiYWJzdHJhY3RcIl0pdGhyb3cgVHlwZUVycm9yKFwiUHJveHkgbWV0aG9kICdcIithK1wiJyBjYW5ub3QgYmUgYWJzdHJhY3RcIik7fWlmKGgpe2lmKGdbXCJwcml2YXRlXCJdKXRocm93IFR5cGVFcnJvcihcIlByaXZhdGUgbWVtYmVyIG5hbWUgJ1wiK2ErXCInIGNvbmZsaWN0cyB3aXRoIHN1cGVydHlwZVwiKTtpZihcImZ1bmN0aW9uXCIhPT10eXBlb2YgaCl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3Qgb3ZlcnJpZGUgcHJvcGVydHkgJ1wiK2ErXCInIHdpdGggbWV0aG9kXCIpO2lmKGIub3ZlcnJpZGUmJiFnLnZpcnR1YWwpe2lmKCFiW1wiYWJzdHJhY3RcIl0pdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IG92ZXJyaWRlIG5vbi12aXJ0dWFsIG1ldGhvZCAnXCIrXHJcbiAgICAgICAgICAgIGErXCInXCIpO2lmKCFnW1wiYWJzdHJhY3RcIl0pdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IHBlcmZvcm0gYWJzdHJhY3Qgb3ZlcnJpZGUgb24gbm9uLWFic3RyYWN0IG1ldGhvZCAnXCIrYStcIidcIik7fWlmKGJbXCJhYnN0cmFjdFwiXSYmIWIud2VhayYmIWdbXCJhYnN0cmFjdFwiXSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3Qgb3ZlcnJpZGUgY29uY3JldGUgbWV0aG9kICdcIithK1wiJyB3aXRoIGFic3RyYWN0IG1ldGhvZFwiKTtkPXZvaWQgMD09PWguX19sZW5ndGg/aC5sZW5ndGg6aC5fX2xlbmd0aDtjPXZvaWQgMD09PWMuX19sZW5ndGg/Yy5sZW5ndGg6Yy5fX2xlbmd0aDtiLnByb3h5JiYoYz1OYU4pO2Iud2VhayYmIWdbXCJhYnN0cmFjdFwiXSYmKGg9ZCxkPWMsYz1oKTtpZihjPGQpdGhyb3cgVHlwZUVycm9yKFwiRGVjbGFyYXRpb24gb2YgbWV0aG9kICdcIithK1wiJyBtdXN0IGJlIGNvbXBhdGlibGUgd2l0aCB0aGF0IG9mIGl0cyBzdXBlcnR5cGVcIik7aWYodGhpcy5fZ2V0VmlzaWJpbGl0eVZhbHVlKGcpPFxyXG4gICAgICAgICAgICB0aGlzLl9nZXRWaXNpYmlsaXR5VmFsdWUoYikpdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGRlLWVzY2FsYXRlIHZpc2liaWxpdHkgb2YgbWV0aG9kICdcIithK1wiJ1wiKTtpZighYi5vdmVycmlkZSYmIWdbXCJhYnN0cmFjdFwiXSYmIWIud2Vhayl0aHJvdyBUeXBlRXJyb3IoXCJBdHRlbXB0aW5nIHRvIG92ZXJyaWRlIG1ldGhvZCAnXCIrYStcIicgd2l0aG91dCAnb3ZlcnJpZGUnIGtleXdvcmRcIik7Yi53ZWFrJiZnLm92ZXJyaWRlJiZkZWxldGUgKGkud2FyblthXXx8e30pLm5vfWVsc2UgaWYoYi5vdmVycmlkZSkoaS53YXJuW2FdPWkud2FyblthXXx8e30pLm5vPUVycm9yKFwiTWV0aG9kICdcIithK1wiJyB1c2luZyAnb3ZlcnJpZGUnIGtleXdvcmQgd2l0aG91dCBzdXBlciBtZXRob2RcIil9O2MucHJvdG90eXBlLnZhbGlkYXRlUHJvcGVydHk9ZnVuY3Rpb24oYSxjLGIsZCxnKXtpZihjPWQ/ZC5tZW1iZXI6bnVsbCl7aWYoZ1tcInByaXZhdGVcIl0pdGhyb3cgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZW1iZXIgbmFtZSAnXCIrXHJcbiAgICAgICAgYStcIicgY29uZmxpY3RzIHdpdGggc3VwZXJ0eXBlXCIpO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBjKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgb3ZlcnJpZGUgbWV0aG9kICdcIithK1wiJyB3aXRoIHByb3BlcnR5XCIpO2lmKHRoaXMuX2dldFZpc2liaWxpdHlWYWx1ZShnKTx0aGlzLl9nZXRWaXNpYmlsaXR5VmFsdWUoYikpdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGRlLWVzY2FsYXRlIHZpc2liaWxpdHkgb2YgcHJvcGVydHkgJ1wiK2ErXCInXCIpO31pZihkJiYoZC5nZXR8fGQuc2V0KSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3Qgb3ZlcnJpZGUgZ2V0dGVyL3NldHRlciAnXCIrYStcIicgd2l0aCBwcm9wZXJ0eVwiKTtpZihiW1wiYWJzdHJhY3RcIl0pdGhyb3cgVHlwZUVycm9yKFwiUHJvcGVydHkgJ1wiK2ErXCInIGNhbm5vdCBiZSBkZWNsYXJlZCBhcyBhYnN0cmFjdFwiKTtpZihiW1wic3RhdGljXCJdJiZiW1wiY29uc3RcIl0pdGhyb3cgVHlwZUVycm9yKFwiU3RhdGljIGtleXdvcmQgY2Fubm90IGJlIHVzZWQgd2l0aCBjb25zdCBmb3IgcHJvcGVydHkgJ1wiK1xyXG4gICAgICAgIGErXCInXCIpO2lmKGIudmlydHVhbCl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3QgZGVjbGFyZSBwcm9wZXJ0eSAnXCIrYStcIicgYXMgdmlydHVhbFwiKTt9O2MucHJvdG90eXBlLnZhbGlkYXRlR2V0dGVyU2V0dGVyPWZ1bmN0aW9uKGEsYyxiLGQsZyl7Yz1kP2QubWVtYmVyOm51bGw7ZD1kJiYoZC5nZXR8fGQuc2V0KT8hMDohMTtpZihiW1wiYWJzdHJhY3RcIl0pdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGRlY2xhcmUgZ2V0dGVyL3NldHRlciAnXCIrYStcIicgYXMgYWJzdHJhY3RcIik7aWYoYltcImNvbnN0XCJdKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBkZWNsYXJlIGNvbnN0IGdldHRlci9zZXR0ZXIgJ1wiK2ErXCInXCIpO2lmKGIudmlydHVhbCYmYltcInN0YXRpY1wiXSl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3QgZGVjbGFyZSBzdGF0aWMgbWV0aG9kICdcIithK1wiJyBhcyB2aXJ0dWFsXCIpO2lmKGN8fGQpe2lmKGcmJmdbXCJwcml2YXRlXCJdKXRocm93IFR5cGVFcnJvcihcIlByaXZhdGUgbWVtYmVyIG5hbWUgJ1wiK1xyXG4gICAgICAgIGErXCInIGNvbmZsaWN0cyB3aXRoIHN1cGVydHlwZVwiKTtpZighZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3Qgb3ZlcnJpZGUgbWV0aG9kIG9yIHByb3BlcnR5ICdcIithK1wiJyB3aXRoIGdldHRlci9zZXR0ZXJcIik7aWYoIWd8fCFnLnZpcnR1YWwpdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IG92ZXJyaWRlIG5vbi12aXJ0dWFsIGdldHRlci9zZXR0ZXIgJ1wiK2ErXCInXCIpO2lmKCFiLm92ZXJyaWRlKXRocm93IFR5cGVFcnJvcihcIkF0dGVtcHRpbmcgdG8gb3ZlcnJpZGUgZ2V0dGVyL3NldHRlciAnXCIrYStcIicgd2l0aG91dCAnb3ZlcnJpZGUnIGtleXdvcmRcIik7aWYodGhpcy5fZ2V0VmlzaWJpbGl0eVZhbHVlKGd8fHt9KTx0aGlzLl9nZXRWaXNpYmlsaXR5VmFsdWUoYikpdGhyb3cgVHlwZUVycm9yKFwiQ2Fubm90IGRlLWVzY2FsYXRlIHZpc2liaWxpdHkgb2YgZ2V0dGVyL3NldHRlciAnXCIrYStcIidcIik7fWVsc2UgYi5vdmVycmlkZSYmdGhpcy5fd2FybmluZ0hhbmRsZXIoRXJyb3IoXCJHZXR0ZXIvc2V0dGVyICdcIitcclxuICAgICAgICBhK1wiJyB1c2luZyAnb3ZlcnJpZGUnIGtleXdvcmQgd2l0aG91dCBzdXBlciBnZXR0ZXIvc2V0dGVyXCIpKX07Yy5wcm90b3R5cGUuX2dldFZpc2liaWxpdHlWYWx1ZT1mdW5jdGlvbihhKXtyZXR1cm4gYVtcInByb3RlY3RlZFwiXT8xOmFbXCJwcml2YXRlXCJdPzI6MH19KShqLk1lbWJlckJ1aWxkZXJWYWxpZGF0b3I9e30sXCIuXCIpOyhmdW5jdGlvbihiKXt2YXIgYz1iLmV4cG9ydHM9e307bj1cIi5cIjt2YXIgYT1oKFwiLi91dGlsXCIpO2IuZXhwb3J0cz1jPWZ1bmN0aW9uKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBiLmV4cG9ydHN9O2MucHJvdG90eXBlLnNldHVwPWZ1bmN0aW9uKGEsYixjKXt2YXIgZz10aGlzLl9jcmVhdGVQcml2YXRlTGF5ZXIoYSxiKTt0aGlzLl9kb1NldHVwKGEsYltcInB1YmxpY1wiXSk7dGhpcy5fZG9TZXR1cChhLGJbXCJwcm90ZWN0ZWRcIl0sY1tcInByb3RlY3RlZFwiXSwhMCk7dGhpcy5fZG9TZXR1cChnLGJbXCJwcml2YXRlXCJdLGNbXCJwcml2YXRlXCJdKTtyZXR1cm4gZ307XHJcbiAgICAgICAgYy5wcm90b3R5cGUuX2NyZWF0ZVByaXZhdGVMYXllcj1mdW5jdGlvbihhLGIpe3ZhciBjPWZ1bmN0aW9uKCl7fTtjLnByb3RvdHlwZT1hO2M9bmV3IGM7dGhpcy5jcmVhdGVQcm9wUHJveHkoYSxjLGJbXCJwcm90ZWN0ZWRcIl0pO3JldHVybiBjfTtjLnByb3RvdHlwZS5fZG9TZXR1cD1mdW5jdGlvbihiLGMsZCxnKXt2YXIgaT1BcnJheS5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7aWYodm9pZCAwIT09ZClmb3IodmFyIGggaW4gZClpZihpLmNhbGwoZCxoKSl7dmFyIGo9YltoXSxuPWomJmouX19fJCRrZXl3b3JkcyQkO2lmKCFnfHx2b2lkIDA9PT1qfHxuW1wicHJpdmF0ZVwiXXx8bltcInByb3RlY3RlZFwiXSliW2hdPWRbaF19Zm9yKHZhciBwIGluIGMpaS5jYWxsKGMscCkmJihiW3BdPWEuY2xvbmUoY1twXVswXSkpfTtjLnByb3RvdHlwZS5jcmVhdGVQcm9wUHJveHk9ZnVuY3Rpb24oYSxiLGMpe3ZhciBnPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksaTtmb3IoaSBpbiBjKWcuY2FsbChjLFxyXG4gICAgICAgICAgICBpKSYmZnVuY3Rpb24oYyl7YltjXT12b2lkIDA7T2JqZWN0LmRlZmluZVByb3BlcnR5KGIsYyx7c2V0OmZ1bmN0aW9uKGIpe2FbY109Yn0sZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGFbY119LGVudW1lcmFibGU6ITB9KX0uY2FsbChudWxsLGkpO3JldHVybiBifX0pKGouVmlzaWJpbGl0eU9iamVjdEZhY3Rvcnk9e30sXCIuXCIpOyhmdW5jdGlvbihiKXt2YXIgYz1iLmV4cG9ydHM9e307bj1cIi5cIjtiLmV4cG9ydHM9Yz1mdW5jdGlvbigpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGMpKXJldHVybiBuZXcgYi5leHBvcnRzfTtjLnByb3RvdHlwZT1oKFwiLi9WaXNpYmlsaXR5T2JqZWN0RmFjdG9yeVwiKSgpO2MucHJvdG90eXBlLl9jcmVhdGVQcml2YXRlTGF5ZXI9ZnVuY3Rpb24oYSl7cmV0dXJuIGF9O2MucHJvdG90eXBlLmNyZWF0ZVByb3BQcm94eT1mdW5jdGlvbihhKXtyZXR1cm4gYX19KShqLkZhbGxiYWNrVmlzaWJpbGl0eU9iamVjdEZhY3Rvcnk9e30sXCIuXCIpOyhmdW5jdGlvbihiKXtiPWIuZXhwb3J0cz1cclxuICAgIHt9O249XCIuXCI7dmFyIGM9aChcIi4vdXRpbFwiKSxhPWgoXCIuL1Zpc2liaWxpdHlPYmplY3RGYWN0b3J5XCIpLGY9aChcIi4vRmFsbGJhY2tWaXNpYmlsaXR5T2JqZWN0RmFjdG9yeVwiKTtiLmZyb21FbnZpcm9ubWVudD1mdW5jdGlvbigpe3JldHVybiBjLmRlZmluZVByb3BlcnR5RmFsbGJhY2soKT9mKCk6YSgpfX0pKGouVmlzaWJpbGl0eU9iamVjdEZhY3RvcnlGYWN0b3J5PXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYyhhKXtpZigxPGFyZ3VtZW50cy5sZW5ndGgpdGhyb3cgRXJyb3IoXCJFeHBlY3Rpbmcgb25lIGFyZ3VtZW50IGZvciBhbm9ueW1vdXMgQ2xhc3MgZGVmaW5pdGlvbjsgXCIrYXJndW1lbnRzLmxlbmd0aCtcIiBnaXZlbi5cIik7cmV0dXJuIGkoYSl9ZnVuY3Rpb24gYShhLGMpe2lmKDI8YXJndW1lbnRzLmxlbmd0aCl0aHJvdyBFcnJvcihcIkV4cGVjdGluZyBhdCBtb3N0IHR3byBhcmd1bWVudHMgZm9yIGRlZmluaXRpb24gb2YgbmFtZWQgQ2xhc3MgJ1wiK2ErXCInOyBcIithcmd1bWVudHMubGVuZ3RoK1xyXG4gICAgICAgIFwiIGdpdmVuLlwiKTtpZih2b2lkIDA9PT1jKXJldHVybiBmKGEpO2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYyl0aHJvdyBUeXBlRXJyb3IoXCJVbmV4cGVjdGVkIHZhbHVlIGZvciBkZWZpbml0aW9uIG9mIG5hbWVkIENsYXNzICdcIithK1wiJzsgb2JqZWN0IGV4cGVjdGVkXCIpO2MuX19uYW1lPWE7cmV0dXJuIGkoYyl9ZnVuY3Rpb24gZihhKXtyZXR1cm57ZXh0ZW5kOmZ1bmN0aW9uKCl7Zm9yKHZhciBjPVtdLGI9YXJndW1lbnRzLmxlbmd0aDtiLS07KWNbYl09YXJndW1lbnRzW2JdO2NbYy5sZW5ndGgtMV0uX19uYW1lPWE7cmV0dXJuIGkuYXBwbHkobnVsbCxjKX0saW1wbGVtZW50OmZ1bmN0aW9uKCl7Zm9yKHZhciBjPVtdLGI9YXJndW1lbnRzLmxlbmd0aDtiLS07KWNbYl09YXJndW1lbnRzW2JdO3JldHVybiBlKG51bGwsYyxhKX0sdXNlOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPVtdLGM9YXJndW1lbnRzLmxlbmd0aDtjLS07KWFbY109YXJndW1lbnRzW2NdO3JldHVybiBkKHEsYSl9fX1mdW5jdGlvbiBlKGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMsYil7dmFyIGU9e2V4dGVuZDpmdW5jdGlvbigpe3ZhciBkPWFyZ3VtZW50cy5sZW5ndGgsZT1hcmd1bWVudHNbZC0xXSxrPTE8ZD9hcmd1bWVudHNbZC0yXTpudWxsO2lmKDI8ZCl0aHJvdyBFcnJvcihcIkV4cGVjdGluZyBubyBtb3JlIHRoYW4gdHdvIGFyZ3VtZW50cyBmb3IgZXh0ZW5kKClcIik7aWYoYSYmayl0aHJvdyBFcnJvcihcIkNhbm5vdCBvdmVycmlkZSBwYXJlbnQgXCIrYS50b1N0cmluZygpK1wiIHdpdGggXCIray50b1N0cmluZygpK1wiIHZpYSBleHRlbmQoKVwiKTtpZihiKWUuX19uYW1lPWI7Yy5wdXNoKGF8fGt8fGkoe30pKTtyZXR1cm4gaS5jYWxsKG51bGwsby5hcHBseSh0aGlzLGMpLGUpfSx1c2U6ZnVuY3Rpb24oKXtmb3IodmFyIGE9W10sYz1hcmd1bWVudHMubGVuZ3RoO2MtLTspYVtjXT1hcmd1bWVudHNbY107cmV0dXJuIGQoZnVuY3Rpb24oKXtyZXR1cm4gZS5fX2NyZWF0ZUJhc2UoKX0sYSl9LF9fY3JlYXRlQmFzZTpmdW5jdGlvbigpe3JldHVybiBlLmV4dGVuZCh7fSl9fTtcclxuICAgICAgICByZXR1cm4gZX1mdW5jdGlvbiBkKGEsYyxiKXt2YXIgZT1mdW5jdGlvbigpe2lmKCFiKXRocm93IFR5cGVFcnJvcihcIkNhbm5vdCBpbnN0YW50aWF0ZSBpbmNvbXBsZXRlIGNsYXNzIGRlZmluaXRpb247IGRpZCB5b3UgZm9yZ2V0IHRvIGNhbGwgYGV4dGVuZCc/XCIpO3JldHVybiBnKGEoKSxjKS5hcHBseShudWxsLGFyZ3VtZW50cyl9O2UuZXh0ZW5kPWZ1bmN0aW9uKCl7dmFyIGI9YXJndW1lbnRzLmxlbmd0aCxkPWFyZ3VtZW50c1tiLTFdLGI9MTxiP2FyZ3VtZW50c1tiLTJdOm51bGwsZT1hKCk7cmV0dXJuIGkuY2FsbChudWxsLGcoZXx8YixjKSxkKX07ZS51c2U9ZnVuY3Rpb24oKXtmb3IodmFyIGE9W10sYz1hcmd1bWVudHMubGVuZ3RoO2MtLTspYVtjXT1hcmd1bWVudHNbY107cmV0dXJuIGQoZnVuY3Rpb24oKXtyZXR1cm4gZS5fX2NyZWF0ZUJhc2UoKX0sYSxiKX07ZS5fX2NyZWF0ZUJhc2U9ZnVuY3Rpb24oKXtyZXR1cm4gZS5leHRlbmQoe30pfTtyZXR1cm4gZX1mdW5jdGlvbiBnKGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyl7Zm9yKHZhciBiPXtfX18kJGF1dG8kYWJzdHJhY3QkJDohMH0sZD1bXSxlPTAsaz1jLmxlbmd0aDtlPGs7ZSsrKWNbZV0uX19taXhpbihiLGQsYXx8ei5DbGFzc0Jhc2UpO2I9aS5jYWxsKG51bGwsYSxiKTtkPXouZ2V0TWV0YShiKS5pbXBsZW1lbnRlZDtlPTA7Zm9yKGs9Yy5sZW5ndGg7ZTxrO2UrKylkLnB1c2goY1tlXSksY1tlXS5fX21peGluSW1wbChkKTtyZXR1cm4gYn1mdW5jdGlvbiBpKGEsYyl7Zm9yKHZhciBiPVtdLGQ9YXJndW1lbnRzLmxlbmd0aDtkLS07KWJbZF09YXJndW1lbnRzW2RdO2I9eC5idWlsZC5hcHBseSh4LGIpO2ooYik7cihiKTt5KGIpO3YuZnJlZXplKGIpO3JldHVybiBifWZ1bmN0aW9uIGooYSl7di5kZWZpbmVTZWN1cmVQcm9wKGEsXCJleHRlbmRcIixmdW5jdGlvbihhKXtyZXR1cm4gaSh0aGlzLGEpfSl9ZnVuY3Rpb24gcihhKXt2LmRlZmluZVNlY3VyZVByb3AoYSxcImltcGxlbWVudFwiLGZ1bmN0aW9uKCl7Zm9yKHZhciBjPVtdLGI9YXJndW1lbnRzLmxlbmd0aDtiLS07KWNbYl09XHJcbiAgICAgICAgYXJndW1lbnRzW2JdO3JldHVybiBlKGEsYyl9KX1mdW5jdGlvbiB5KGEpe3YuZGVmaW5lU2VjdXJlUHJvcChhLFwidXNlXCIsZnVuY3Rpb24oKXtmb3IodmFyIGM9W10sYj1hcmd1bWVudHMubGVuZ3RoO2ItLTspY1tiXT1hcmd1bWVudHNbYl07cmV0dXJuIGQoZnVuY3Rpb24oKXtyZXR1cm4gYX0sYywhMCl9KX1iLmV4cG9ydHM9e307bj1cIi5cIjt2YXIgcD1cInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGU/Y29uc29sZTp2b2lkIDAsdj1oKFwiLi91dGlsXCIpLHo9aChcIi4vQ2xhc3NCdWlsZGVyXCIpLEE9aChcIi4vd2FyblwiKSxtPUEuV2FybmluZyxsPUEuTG9nSGFuZGxlcihwKSxwPWgoXCIuL01ldGhvZFdyYXBwZXJGYWN0b3J5XCIpLEE9aChcIi4vTWV0aG9kV3JhcHBlcnNcIikuc3RhbmRhcmQseD16KGwsaChcIi4vTWVtYmVyQnVpbGRlclwiKShwKEEud3JhcE5ldykscChBLndyYXBPdmVycmlkZSkscChBLndyYXBQcm94eSksaChcIi4vTWVtYmVyQnVpbGRlclZhbGlkYXRvclwiKShmdW5jdGlvbihhKXtsLmhhbmRsZShtKGEpKX0pKSxcclxuICAgICAgICBoKFwiLi9WaXNpYmlsaXR5T2JqZWN0RmFjdG9yeUZhY3RvcnlcIikuZnJvbUVudmlyb25tZW50KCkpLHE9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07Yi5leHBvcnRzPWZ1bmN0aW9uKGIsZCl7Zm9yKHZhciBlPXR5cGVvZiBiLGs9bnVsbCxrPVtdLGY9YXJndW1lbnRzLmxlbmd0aDtmLS07KWtbZl09YXJndW1lbnRzW2ZdO3N3aXRjaChlKXtjYXNlIFwib2JqZWN0XCI6az1jLmFwcGx5KG51bGwsayk7YnJlYWs7Y2FzZSBcInN0cmluZ1wiOms9YS5hcHBseShudWxsLGspO2JyZWFrO2RlZmF1bHQ6dGhyb3cgVHlwZUVycm9yKFwiRXhwZWN0aW5nIGFub255bW91cyBjbGFzcyBkZWZpbml0aW9uIG9yIG5hbWVkIGNsYXNzIGRlZmluaXRpb25cIik7fXJldHVybiBrfTtiLmV4cG9ydHMuZXh0ZW5kPWk7Yi5leHBvcnRzLmltcGxlbWVudD1mdW5jdGlvbihhKXtyZXR1cm4gZShudWxsLEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpfTtiLmV4cG9ydHMudXNlPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1cclxuICAgICAgICBbXSxjPWFyZ3VtZW50cy5sZW5ndGg7Yy0tOyliW2NdPWFyZ3VtZW50c1tjXTtyZXR1cm4gZChxLGIpfTt2YXIgcz17cHJvdG90eXBlOnt9fSxrPXtjb25zdHJ1Y3Rvcjp7cHJvdG90eXBlOnt9fX07Yi5leHBvcnRzLmlzQ2xhc3M9ZnVuY3Rpb24oYSl7YT1hfHxzO2lmKCFhLnByb3RvdHlwZSlyZXR1cm4hMTt2YXIgYz16LmdldE1ldGEoYSk7cmV0dXJuIG51bGwhPT1jJiZjLmltcGxlbWVudGVkfHxhLnByb3RvdHlwZSBpbnN0YW5jZW9mIHouQ2xhc3NCYXNlPyEwOiExfTtiLmV4cG9ydHMuaXNDbGFzc0luc3RhbmNlPWZ1bmN0aW9uKGEpe2E9YXx8aztyZXR1cm4gYi5leHBvcnRzLmlzQ2xhc3MoYS5jb25zdHJ1Y3Rvcil9O2IuZXhwb3J0cy5pc0luc3RhbmNlT2Y9ei5pc0luc3RhbmNlT2Y7Yi5leHBvcnRzLmlzQT1iLmV4cG9ydHMuaXNJbnN0YW5jZU9mO3ZhciBvPWZ1bmN0aW9uKGEsYyl7Zm9yKHZhciBkPWFyZ3VtZW50cy5sZW5ndGgsZT17fSxrPWFyZ3VtZW50c1tkLTFdLGY9bnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnPVtdLG89ITEsaT0wO2k8ZC0xO2krKylmPWFyZ3VtZW50c1tpXSx2LnByb3BQYXJzZShmLnByb3RvdHlwZSx7bWV0aG9kOmZ1bmN0aW9uKGEsYyl7ZVtcImFic3RyYWN0IFwiK2FdPWMuZGVmaW5pdGlvbjtvPSEwfX0pLGcucHVzaChmKTtpZihvKWUuX19fJCRhYnN0cmFjdCQkPSEwO2Q9Yi5leHBvcnRzLmV4dGVuZChrLGUpO3ouZ2V0TWV0YShkKS5pbXBsZW1lbnRlZD1nO3JldHVybiBkfX0pKGpbXCJjbGFzc1wiXT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoYSl7aWYoXCJvYmplY3RcIj09PXR5cGVvZiBhKWEuX19fJCRhYnN0cmFjdCQkPSEwfWZ1bmN0aW9uIGEoYil7dmFyIGU9Yi5leHRlbmQsZj1iLmltcGxlbWVudCxoPWIudXNlO2YmJihiLmltcGxlbWVudD1mdW5jdGlvbigpe3JldHVybiBhKGYuYXBwbHkodGhpcyxhcmd1bWVudHMpKX0pO2gmJihiLnVzZT1mdW5jdGlvbigpe3JldHVybiBhKGguYXBwbHkodGhpcyxhcmd1bWVudHMpKX0pO2IuZXh0ZW5kPWZ1bmN0aW9uKCl7Yyhhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aC1cclxuICAgICAgICAxXSk7cmV0dXJuIGUuYXBwbHkodGhpcyxhcmd1bWVudHMpfTtiLl9fY3JlYXRlQmFzZT1mdW5jdGlvbigpe3JldHVybiBlKHtfX18kJGF1dG8kYWJzdHJhY3QkJDohMH0pfTtyZXR1cm4gYn12YXIgZj1iLmV4cG9ydHM9e307bj1cIi5cIjt2YXIgZT1oKFwiLi9jbGFzc1wiKTtiLmV4cG9ydHM9Zj1mdW5jdGlvbigpe2MoYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGgtMV0pO3ZhciBiPWUuYXBwbHkodGhpcyxhcmd1bWVudHMpO2UuaXNDbGFzcyhiKXx8YShiKTtyZXR1cm4gYn07Zi5leHRlbmQ9ZnVuY3Rpb24oKXtjKGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoLTFdKTtyZXR1cm4gZS5leHRlbmQuYXBwbHkodGhpcyxhcmd1bWVudHMpfTtmLnVzZT1mdW5jdGlvbigpe3JldHVybiBhKGUudXNlLmFwcGx5KHRoaXMsYXJndW1lbnRzKSl9O2YuaW1wbGVtZW50PWZ1bmN0aW9uKCl7cmV0dXJuIGEoZS5pbXBsZW1lbnQuYXBwbHkodGhpcyxhcmd1bWVudHMpKX19KShqLmNsYXNzX2Fic3RyYWN0PVxyXG4gICAge30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7fWZ1bmN0aW9uIGEoYSl7aWYoMTxhcmd1bWVudHMubGVuZ3RoKXRocm93IEVycm9yKFwiRXhwZWN0aW5nIG9uZSBhcmd1bWVudCBmb3IgSW50ZXJmYWNlIGRlZmluaXRpb247IFwiK2FyZ3VtZW50cy5sZW5ndGgrXCIgZ2l2ZW4uXCIpO3JldHVybiBsKGEpfWZ1bmN0aW9uIGYoYSxiKXtpZigyPGFyZ3VtZW50cy5sZW5ndGgpdGhyb3cgRXJyb3IoXCJFeHBlY3RpbmcgdHdvIGFyZ3VtZW50cyBmb3IgZGVmaW5pdGlvbiBvZiBuYW1lZCBJbnRlcmZhY2UgJ1wiK2ErXCInOyBcIithcmd1bWVudHMubGVuZ3RoK1wiIGdpdmVuLlwiKTtpZihcIm9iamVjdFwiIT09dHlwZW9mIGIpdGhyb3cgVHlwZUVycm9yKFwiVW5leHBlY3RlZCB2YWx1ZSBmb3IgZGVmaW5pdGlvbiBvZiBuYW1lZCBJbnRlcmZhY2UgJ1wiK2ErXCInOyBvYmplY3QgZXhwZWN0ZWRcIik7Yi5fX25hbWU9YTtyZXR1cm4gbChiKX1mdW5jdGlvbiBlKGEsYil7Yi5tZXNzYWdlPVwiRmFpbGVkIHRvIGRlZmluZSBpbnRlcmZhY2UgXCIrXHJcbiAgICAgICAgKGE/YTpcIihhbm9ueW1vdXMpXCIpK1wiOiBcIitiLm1lc3NhZ2U7dGhyb3cgYjt9ZnVuY3Rpb24gZChhKXtwLmRlZmluZVNlY3VyZVByb3AoYSxcImV4dGVuZFwiLGZ1bmN0aW9uKGEpe3JldHVybiBsKHRoaXMsYSl9KX1mdW5jdGlvbiBnKGEsYil7YS50b1N0cmluZz1iP2Z1bmN0aW9uKCl7cmV0dXJuXCJbb2JqZWN0IEludGVyZmFjZSA8XCIrYitcIj5dXCJ9OmZ1bmN0aW9uKCl7cmV0dXJuXCJbb2JqZWN0IEludGVyZmFjZV1cIn19ZnVuY3Rpb24gaShhKXtwLmRlZmluZVNlY3VyZVByb3AoYSxcImlzQ29tcGF0aWJsZVwiLGZ1bmN0aW9uKGIpe3JldHVybiAwPT09aihhLGIpLmxlbmd0aH0pfWZ1bmN0aW9uIGooYSxiKXt2YXIgYz1bXTtwLnByb3BQYXJzZShhLnByb3RvdHlwZSx7bWV0aG9kOmZ1bmN0aW9uKGEsZCl7XCJmdW5jdGlvblwiIT09dHlwZW9mIGJbYV0/Yy5wdXNoKFthLFwibWlzc2luZ1wiXSk6YlthXS5sZW5ndGg8ZC5fX2xlbmd0aCYmYy5wdXNoKFthLFwiaW5jb21wYXRpYmxlXCJdKX19KTtyZXR1cm4gY31cclxuICAgICAgICBmdW5jdGlvbiByKGEpe3AuZGVmaW5lU2VjdXJlUHJvcChhLFwiX19pc0luc3RhbmNlT2ZcIixmdW5jdGlvbihhLGIpe3JldHVybiB5KGEsYil9KX1mdW5jdGlvbiB5KGEsYil7dmFyIGM9Yi5jb25zdHJ1Y3RvcixkO2lmKCFiLl9fY2lkfHwhKGQ9bS5nZXRNZXRhKGMpKSlyZXR1cm4gMD09PWooYSxiKS5sZW5ndGg7Yz1kLmltcGxlbWVudGVkO2ZvcihkPWMubGVuZ3RoO2QtLTspaWYoY1tkXT09PWEpcmV0dXJuITA7cmV0dXJuITF9Yi5leHBvcnRzPXt9O249XCIuXCI7dmFyIHA9aChcIi4vdXRpbFwiKSx2PWgoXCIuL01ldGhvZFdyYXBwZXJGYWN0b3J5XCIpLHo9aChcIi4vTWV0aG9kV3JhcHBlcnNcIikuc3RhbmRhcmQsQT1oKFwiLi9NZW1iZXJCdWlsZGVyXCIpKHYoei53cmFwTmV3KSx2KHoud3JhcE92ZXJyaWRlKSx2KHoud3JhcFByb3h5KSxoKFwiLi9NZW1iZXJCdWlsZGVyVmFsaWRhdG9yXCIpKCkpO2goXCIuL2NsYXNzXCIpO3ZhciBtPWgoXCIuL0NsYXNzQnVpbGRlclwiKTtiLmV4cG9ydHM9ZnVuY3Rpb24oYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyl7dmFyIGQ9bnVsbDtzd2l0Y2godHlwZW9mIGIpe2Nhc2UgXCJvYmplY3RcIjpkPWEuYXBwbHkobnVsbCxhcmd1bWVudHMpO2JyZWFrO2Nhc2UgXCJzdHJpbmdcIjpkPWYuYXBwbHkobnVsbCxhcmd1bWVudHMpO2JyZWFrO2RlZmF1bHQ6dGhyb3cgVHlwZUVycm9yKFwiRXhwZWN0aW5nIGFub255bW91cyBpbnRlcmZhY2UgZGVmaW5pdGlvbiBvciBuYW1lZCBpbnRlcmZhY2UgZGVmaW5pdGlvblwiKTt9cmV0dXJuIGR9O2IuZXhwb3J0cy5leHRlbmQ9ZnVuY3Rpb24oKXtyZXR1cm4gbC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2IuZXhwb3J0cy5pc0ludGVyZmFjZT1mdW5jdGlvbihhKXthPWF8fHt9O3JldHVybiBhLnByb3RvdHlwZSBpbnN0YW5jZW9mIGM/ITA6ITF9O3ZhciBsPWZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoYyl7cmV0dXJuIGZ1bmN0aW9uKCl7aWYoIWEpdGhyb3cgRXJyb3IoXCJJbnRlcmZhY2UgXCIrKGM/YytcIiBcIjpcIlwiKStcIiBjYW5ub3QgYmUgaW5zdGFudGlhdGVkXCIpO319cmV0dXJuIGZ1bmN0aW9uKCl7YT1cclxuICAgICAgICAgICAgITA7dmFyIGY9YXJndW1lbnRzLGs9Zi5sZW5ndGgsbz0oMDxrP2Zbay0xXTowKXx8e30sZj1uZXcgKCgxPGs/ZltrLTJdOjApfHxjKSxoPVwiXCIsaj17fSx3PUEuaW5pdE1lbWJlcnMoZixmLGYpOyhoPW8uX19uYW1lKSYmZGVsZXRlIG8uX19uYW1lO2lmKCEoZiBpbnN0YW5jZW9mIGMpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnRlcmZhY2VzIG1heSBvbmx5IGV4dGVuZCBvdGhlciBpbnRlcmZhY2VzXCIpO2s9YihoKTtwLnByb3BQYXJzZShvLHthc3N1bWVBYnN0cmFjdDohMCxfdGhyb3c6ZnVuY3Rpb24oYSl7ZShoLGEpfSxwcm9wZXJ0eTpmdW5jdGlvbigpe2UoaCxUeXBlRXJyb3IoXCJVbmV4cGVjdGVkIGludGVybmFsIGVycm9yXCIpKX0sZ2V0c2V0OmZ1bmN0aW9uKCl7ZShoLFR5cGVFcnJvcihcIlVuZXhwZWN0ZWQgaW50ZXJuYWwgZXJyb3JcIikpfSxtZXRob2Q6ZnVuY3Rpb24oYSxiLGMsZCl7KGRbXCJwcm90ZWN0ZWRcIl18fGRbXCJwcml2YXRlXCJdKSYmZShoLFR5cGVFcnJvcihcIk1lbWJlciBcIitcclxuICAgICAgICAgICAgYStcIiBtdXN0IGJlIHB1YmxpY1wiKSk7QS5idWlsZE1ldGhvZCh3LG51bGwsYSxiLGQsbnVsbCwwLHt9LGopfX0pO2Qoayk7ZyhrLGgpO2koayk7cihrKTtrLnByb3RvdHlwZT1mO2suY29uc3RydWN0b3I9aztwLmZyZWV6ZShrKTthPSExO3JldHVybiBrfX0oITEpO2IuZXhwb3J0cy5pc0luc3RhbmNlT2Y9eX0pKGpbXCJpbnRlcmZhY2VcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7fWZ1bmN0aW9uIGEoKXtzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7Y2FzZSAwOnRocm93IEVycm9yKFwiTWlzc2luZyB0cmFpdCBuYW1lIG9yIGRlZmluaXRpb25cIik7Y2FzZSAxOnJldHVyblwic3RyaW5nXCI9PT10eXBlb2YgYXJndW1lbnRzWzBdP2UuYXBwbHkodGhpcyxhcmd1bWVudHMpOmEuZXh0ZW5kLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtjYXNlIDI6cmV0dXJuIGYuYXBwbHkodGhpcyxhcmd1bWVudHMpfXRocm93IEVycm9yKFwiRXhwZWN0aW5nIGF0IG1vc3QgdHdvIGFyZ3VtZW50cyBmb3IgZGVmaW5pdGlvbiBvZiBuYW1lZCBUcmFpdCBcIitcclxuICAgICAgICBuYW1lK1wiJzsgXCIrYXJndW1lbnRzLmxlbmd0aCtcIiBnaXZlblwiKTt9ZnVuY3Rpb24gZihiLGMpe2lmKFwic3RyaW5nXCIhPT10eXBlb2YgYil0aHJvdyBFcnJvcihcIkZpcnN0IGFyZ3VtZW50IG9mIG5hbWVkIGNsYXNzIGRlZmluaXRpb24gbXVzdCBiZSBhIHN0cmluZ1wiKTtjLl9fbmFtZT1iO3JldHVybiBhLmV4dGVuZChjKX1mdW5jdGlvbiBlKGEpe3JldHVybntleHRlbmQ6ZnVuY3Rpb24oYil7cmV0dXJuIGYoYSxiKX0saW1wbGVtZW50OmZ1bmN0aW9uKCl7cmV0dXJuIGooYXJndW1lbnRzLGEpfX19ZnVuY3Rpb24gZChhLGIsYyxkKXtpZihcIl9fY29uc3RydWN0XCI9PT1hKXRocm93IEVycm9yKFwiVHJhaXRzIG1heSBub3QgZGVmaW5lIF9fY29uc3RydWN0XCIpO2lmKGNbXCJzdGF0aWNcIl0pdGhyb3cgRXJyb3IoXCJDYW5ub3QgZGVmaW5lIG1lbWJlciBgXCIrYStcIic7IHN0YXRpYyB0cmFpdCBtZW1iZXJzIGFyZSBjdXJyZW50bHkgdW5zdXBwb3J0ZWRcIik7ZC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9XHJcbiAgICAgICAgZnVuY3Rpb24gZyhhLGIsYyxkKXtpZihcIl9fX1wiIT09YS5zdWJzdHIoMCwzKSl7aWYoIWNbXCJwcml2YXRlXCJdKXRocm93IEVycm9yKFwiQ2Fubm90IGRlZmluZSBwcm9wZXJ0eSBgXCIrYStcIic7IG9ubHkgcHJpdmF0ZSBwcm9wZXJ0aWVzIGFyZSBwZXJtaXR0ZWQgd2l0aGluIFRyYWl0IGRlZmluaXRpb25zXCIpO2QuYXBwbHkodGhpcyxhcmd1bWVudHMpfX1mdW5jdGlvbiBpKGEpe3Rocm93IEVycm9yKFwiQ2Fubm90IGRlZmluZSBwcm9wZXJ0eSBgXCIrYStcIic7IGdldHRlcnMvc2V0dGVycyBhcmUgY3VycmVudGx5IHVuc3VwcG9ydGVkXCIpO31mdW5jdGlvbiBqKGIsYyl7cmV0dXJue2V4dGVuZDpmdW5jdGlvbihkKXtpZihjKWQuX19uYW1lPWM7cmV0dXJuIGEuZXh0ZW5kLmNhbGwoe19fJCRtZXRhOntpZmFjZXM6Yn19LGQpfX19ZnVuY3Rpb24gcihhKXt2YXIgYj17XCJwcm90ZWN0ZWQgX19fJCRwbW8kJFwiOm51bGwsXCJwcm90ZWN0ZWQgX19fJCRzdXBlciQkXCI6bnVsbCxfX2NvbnN0cnVjdDpmdW5jdGlvbihhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiKXt0aGlzLl9fXyQkc3VwZXIkJD1hO3RoaXMuX19fJCRwbW8kJD1ifSxfX25hbWU6XCIjQ29uY3JldGVUcmFpdCNcIn0sYz1xLmdldE1ldGEoYSkuYWJzdHJhY3RNZXRob2RzLGQ7Zm9yKGQgaW4gYylPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChjLGQpJiZcIl9fXCIhPT1kLnN1YnN0cigwLDIpJiYoYlsodm9pZCAwIT09YS5fX18kJG1ldGhvZHMkJFtcInB1YmxpY1wiXVtkXT9cInB1YmxpY1wiOlwicHJvdGVjdGVkXCIpK1wiIHByb3h5IFwiK2RdPVwiX19fJCRwbW8kJFwiKTt5KGEsYik7cmV0dXJuIGEuZXh0ZW5kKGIpfWZ1bmN0aW9uIHkoYSxiKXt2YXIgYz1xLmdldE1ldGEoYSkudmlydHVhbE1lbWJlcnMsZDtmb3IoZCBpbiBjKXt2YXIgZT12b2lkIDAhPT1hLl9fXyQkbWV0aG9kcyQkW1wicHVibGljXCJdW2RdP1wicHVibGljXCI6XCJwcm90ZWN0ZWRcIixmPWEuX19fJCRtZXRob2RzJCRbZV1bZF0sZz1mLl9fbGVuZ3RoO2JbZStcIiB2aXJ0dWFsIG92ZXJyaWRlIFwiK2RdPWZ1bmN0aW9uKGEpe3ZhciBiPWZ1bmN0aW9uKCl7dmFyIGI9XHJcbiAgICAgICAgICAgIHRoaXMuX19fJCRwbW8kJCxjPWJbYV07cmV0dXJuIGM/Yy5hcHBseShiLGFyZ3VtZW50cyk6dGhpcy5fX3N1cGVyLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07Yi5fX2xlbmd0aD1nO3JldHVybiBifShkKTtiW2UrXCIgdmlydHVhbCBfXyQkXCIrZF09ZnVuY3Rpb24oYSl7dmFyIGI9ZnVuY3Rpb24oKXtyZXR1cm4gYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2IuX19sZW5ndGg9ZztyZXR1cm4gYn0oZil9fWZ1bmN0aW9uIHAoYSxiLGQsZSl7dmFyIGY9YS5fX2FjbHMsYT1BKGEsYixkLGUpO2JbXCJ3ZWFrIHZpcnR1YWwgX19fJCRjdG9yJHByZSQkXCJdPWM7YltcIndlYWsgdmlydHVhbCBfX18kJGN0b3IkcG9zdCQkXCJdPWM7ZT09PXEuQ2xhc3NCYXNlPyhiW1widmlydHVhbCBvdmVycmlkZSBfX18kJGN0b3IkcG9zdCQkXCJdPWwsYltcInZpcnR1YWwgb3ZlcnJpZGUgX19fJCRjdG9yJHByZSQkXCJdPWMpOihiW1widmlydHVhbCBvdmVycmlkZSBfX18kJGN0b3IkcG9zdCQkXCJdPWMsYltcInZpcnR1YWwgb3ZlcnJpZGUgX19fJCRjdG9yJHByZSQkXCJdPVxyXG4gICAgICAgICAgICBsKTt2KGYsYixhKTtyZXR1cm4gYn1mdW5jdGlvbiB2KGEsYixjKXthPWEuX19fJCRtZXRob2RzJCQ7eihhW1wicHVibGljXCJdLGIsXCJwdWJsaWNcIixjKTt6KGFbXCJwcm90ZWN0ZWRcIl0sYixcInByb3RlY3RlZFwiLGMpOyhhPWFbXCJwdWJsaWNcIl0uX19fJCRwYXJlbnQkJCkmJmEuY29uc3RydWN0b3IhPT1xLkNsYXNzQmFzZSYmdihhLmNvbnN0cnVjdG9yLGIsYyl9ZnVuY3Rpb24geihhLGIsYyxkKXtmb3IodmFyIGUgaW4gYSlpZihPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChhLGUpJiZcIl9fbWl4aW5cIiE9PWUmJmFbZV0uX19fJCRrZXl3b3JkcyQkKXt2YXIgZj1hW2VdLl9fXyQka2V5d29yZHMkJCxjPWZbXCJwcm90ZWN0ZWRcIl0/XCJwcm90ZWN0ZWRcIjpcInB1YmxpY1wiO2lmKGZbXCJhYnN0cmFjdFwiXSYmIWYub3ZlcnJpZGUpYltjK1wiIHdlYWsgYWJzdHJhY3QgXCIrZV09YVtlXS5kZWZpbml0aW9uO2Vsc2V7dmFyIGc9Zi52aXJ0dWFsLGM9KGc/XCJcIjpcInByb3h5IFwiKSsoZz9cInZpcnR1YWwgXCI6XCJcIikrXHJcbiAgICAgICAgICAgIChmLm92ZXJyaWRlP1wib3ZlcnJpZGUgXCI6XCJcIikrYytcIiBcIitlO2lmKHZvaWQgMCE9PWJbY10pdGhyb3cgRXJyb3IoXCJUcmFpdCBtZW1iZXIgY29uZmxpY3Q6IGBcIitlK1wiJ1wiKTtiW2NdPWYudmlydHVhbD9mdW5jdGlvbihiKXt2YXIgYz1mdW5jdGlvbigpe3ZhciBhPXRoaXNbZF0sYz1hW1wiX18kJFwiK2JdLmFwcGx5KGEsYXJndW1lbnRzKTtyZXR1cm4gYz09PWE/dGhpczpjfTtjLl9fbGVuZ3RoPWFbYl0uX19sZW5ndGg7cmV0dXJuIGN9KGUpOmR9fX1mdW5jdGlvbiBBKGEsYixjLGQpe3ZhciBlPVwiX19fJHRvJFwiK2EuX19hY2xzLl9fY2lkK1wiJFwiK2QuX19jaWQ7Yy5wdXNoKFtlLGFdKTtiW1wicHJpdmF0ZSBcIitlXT1udWxsO3ZvaWQgMD09PWIuX19fJCR0Y3RvciQkJiYoYltcIndlYWsgdmlydHVhbCBfX18kJHRjdG9yJCRcIl09ZnVuY3Rpb24oKXt9LGJbXCJ2aXJ0dWFsIG92ZXJyaWRlIF9fXyQkdGN0b3IkJFwiXT1tKGMsZCkpO3JldHVybiBlfWZ1bmN0aW9uIG0oYSxiKXtyZXR1cm4gZnVuY3Rpb24oYyl7Zm9yKHZhciBkIGluIGEpe3ZhciBlPVxyXG4gICAgICAgICAgICBhW2RdWzBdLGY9YVtkXVsxXSxnPWYuX19jY2xzfHwoZi5fX2NjbHM9cihmLl9fYWNscykpO3RoaXNbZV09ZyhiLHRoaXNbY10udmlzKVtjXS52aXM7dGhpc1tlXS5fX21peGluJiZ0aGlzW2VdLl9fbWl4aW4uYXBwbHkodGhpc1tlXSxmLl9fXyQkbWl4aW5hcmdzKX10aGlzLl9fc3VwZXImJnRoaXMuX19zdXBlcihjKX19ZnVuY3Rpb24gbCgpe3RoaXMuX19fJCR0Y3RvciQkLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1iLmV4cG9ydHM9e307bj1cIi5cIjt2YXIgeD1oKFwiLi9jbGFzc19hYnN0cmFjdFwiKSxxPWgoXCIuL0NsYXNzQnVpbGRlclwiKSxzPWgoXCIuL2ludGVyZmFjZVwiKTthLmV4dGVuZD1mdW5jdGlvbihhKXt2YXIgYj0odGhpc3x8e30pLl9fJCRtZXRhfHx7fSxjPWEuX19uYW1lfHxcIihUcmFpdClcIixlPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBhLl9fbWl4aW4/XCJwYXJhbVwiOlwic3RkXCI7YS5fX18kJHBhcnNlciQkPXtlYWNoOmQscHJvcGVydHk6ZyxnZXRzZXQ6aX07YS5fX18kJGF1dG8kYWJzdHJhY3QkJD1cclxuICAgICAgICAgICAgITA7YS5fX25hbWU9XCIjQWJzdHJhY3RUcmFpdCNcIjt2YXIgZj1cInBhcmFtXCI9PT1lP2Z1bmN0aW9uKCl7Zm9yKHZhciBhPVtdLGI9YXJndW1lbnRzLmxlbmd0aDtiLS07KWFbYl09YXJndW1lbnRzW2JdO3ZhciBjPWZ1bmN0aW9uKCl7dGhyb3cgRXJyb3IoXCJDYW5ub3QgcmUtY29uZmlndXJlIGFyZ3VtZW50IHRyYWl0XCIpO307Yy5fX18kJG1peGluYXJncz1hO2MuX190cmFpdD1cImFyZ1wiO2MuX19hY2xzPWYuX19hY2xzO2MuX19jY2xzPWYuX19jY2xzO2MudG9TdHJpbmc9Zi50b1N0cmluZztjLl9fbWl4aW5JbXBsPWYuX19taXhpbkltcGw7Yy5fX2lzSW5zdGFuY2VPZj1mLl9faXNJbnN0YW5jZU9mO2MuX19taXhpbj1mdW5jdGlvbihhLGIsZCl7cChjLGEsYixkKX07cmV0dXJuIGN9OmZ1bmN0aW9uKCl7dGhyb3cgRXJyb3IoXCJDYW5ub3QgaW5zdGFudGlhdGUgbm9uLXBhcmFtZXRlcml6ZWQgdHJhaXRcIik7fSxoPXg7Yi5pZmFjZXMmJihoPWguaW1wbGVtZW50LmFwcGx5KG51bGwsYi5pZmFjZXMpKTtcclxuICAgICAgICAgICAgdmFyIGo9aC5leHRlbmQoYSk7Zi5fX3RyYWl0PWU7Zi5fX2FjbHM9ajtmLl9fY2Nscz1udWxsO2YudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIlwiK2N9O2YuX19fJCRtaXhpbmFyZ3M9W107Zi5fX21peGluPWZ1bmN0aW9uKGEsYixjKXtwKGYsYSxiLGMpfTtmLl9fbWl4aW5JbXBsPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1xLmdldE1ldGEoaikuaW1wbGVtZW50ZWR8fFtdLGM9Yi5sZW5ndGg7Yy0tOylhLnB1c2goYltjXSl9O2YuX19pc0luc3RhbmNlT2Y9cy5pc0luc3RhbmNlT2Y7cmV0dXJuIGZ9O2EuaW1wbGVtZW50PWZ1bmN0aW9uKCl7cmV0dXJuIGooYXJndW1lbnRzKX07YS5pc1RyYWl0PWZ1bmN0aW9uKGEpe3JldHVybiEhKGF8fHt9KS5fX3RyYWl0fTthLmlzUGFyYW1ldGVyVHJhaXQ9ZnVuY3Rpb24oYSl7cmV0dXJuXCJwYXJhbVwiPT09KGF8fHt9KS5fX3RyYWl0fTthLmlzQXJndW1lbnRUcmFpdD1mdW5jdGlvbihhKXtyZXR1cm5cImFyZ1wiPT09KGF8fHt9KS5fX3RyYWl0fTtiLmV4cG9ydHM9XHJcbiAgICAgICAgICAgIGF9KShqLlRyYWl0PXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYyhhKXtpZihcIm9iamVjdFwiPT09dHlwZW9mIGEpYS5fX18kJGZpbmFsJCQ9ITB9ZnVuY3Rpb24gYShhKXt2YXIgYj1hLmV4dGVuZDthLmV4dGVuZD1mdW5jdGlvbigpe2MoYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGgtMV0pO3JldHVybiBiLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19dmFyIGY9Yi5leHBvcnRzPXt9O249XCIuXCI7dmFyIGU9aChcIi4vY2xhc3NcIiksZj1iLmV4cG9ydHM9ZnVuY3Rpb24oKXtjKGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoLTFdKTt2YXIgYj1lLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtlLmlzQ2xhc3MoYil8fGEoYik7cmV0dXJuIGJ9O2YuZXh0ZW5kPWZ1bmN0aW9uKCl7Yyhhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aC0xXSk7cmV0dXJuIGUuZXh0ZW5kLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19KShqLmNsYXNzX2ZpbmFsPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7dmFyIGM9Yi5leHBvcnRzPVxyXG4gICAge307bj1cIi5cIjt2YXIgYT1oKFwiLi9NZW1iZXJCdWlsZGVyXCIpO2IuZXhwb3J0cz1jPWZ1bmN0aW9uKGEsYyl7aWYoISh0aGlzIGluc3RhbmNlb2YgYi5leHBvcnRzKSlyZXR1cm4gbmV3IGIuZXhwb3J0cyhhLGMpO2IuZXhwb3J0cy5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLGEsYyl9O2IuZXhwb3J0cy5wcm90b3R5cGU9bmV3IGE7Yi5leHBvcnRzLmNvbnN0cnVjdG9yPWIuZXhwb3J0cztjLnByb3RvdHlwZS5idWlsZEdldHRlclNldHRlcj1mdW5jdGlvbigpe3Rocm93IEVycm9yKFwiR2V0dGVycy9zZXR0ZXJzIGFyZSB1bnN1cHBvcnRlZCBpbiB0aGlzIGVudmlyb25tZW50XCIpO319KShqLkZhbGxiYWNrTWVtYmVyQnVpbGRlcj17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoKXtpZighKHRoaXMgaW5zdGFuY2VvZiBjKSlyZXR1cm4gbmV3IGM7dGhpcy5fYWx0PXt9fWIuZXhwb3J0cz17fTtuPVwidXRpbFwiOygwLGV2YWwpKFwidmFyIF90aGVfZ2xvYmFsPXRoaXNcIik7XHJcbiAgICAgICAgYy5leHBvc2U9ZnVuY3Rpb24oKXtyZXR1cm4gX3RoZV9nbG9iYWx9O2MucHJvdG90eXBlPXtwcm92aWRlQWx0OmZ1bmN0aW9uKGEsYil7aWYoISh2b2lkIDAhPT1fdGhlX2dsb2JhbFthXXx8dm9pZCAwIT09dGhpcy5fYWx0W2FdKSlyZXR1cm4gdGhpcy5fYWx0W2FdPWIoKSx0aGlzfSxnZXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHZvaWQgMCE9PXRoaXMuX2FsdFthXT90aGlzLl9hbHRbYV06X3RoZV9nbG9iYWxbYV19fTtiLmV4cG9ydHM9Y30pKGpbXCJ1dGlsL0dsb2JhbFwiXT17fSxcIi5cIik7KGZ1bmN0aW9uKGIpe2IuZXhwb3J0cz17fTtuPVwidXRpbFwiO3ZhciBjPWgoXCIuL3N5bWJvbC9GYWxsYmFja1N5bWJvbFwiKSxhPWgoXCIuL0dsb2JhbFwiKS5leHBvc2UoKTtiLmV4cG9ydHM9YS5TeW1ib2x8fGN9KShqW1widXRpbC9TeW1ib2xcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgYykpcmV0dXJuIG5ldyBjO3RoaXMuX19fJCRpZCQkPWUrZigxRTgqXHJcbiAgICAgICAgYSgpKX1iLmV4cG9ydHM9e307bj1cInV0aWwvc3ltYm9sXCI7dmFyIGE9TWF0aC5yYW5kb20sZj1NYXRoLmZsb29yLGU9XCIgXCIrU3RyaW5nLmZyb21DaGFyQ29kZShmKDEwKmEoKSklMzErMSkrXCIkXCI7Yy5wcm90b3R5cGU9e3RvU3RyaW5nOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX19fJCRpZCQkfX07Yi5leHBvcnRzPWN9KShqW1widXRpbC9zeW1ib2wvRmFsbGJhY2tTeW1ib2xcIl09e30sXCIuXCIpOyhmdW5jdGlvbihiKXtiLmV4cG9ydHM9e307bj1cIi5cIjt2YXIgYz1bMCwyLDQsXCJcIl07Yy5tYWpvcj0wO2MubWlub3I9MjtjLnJldj00O2Muc3VmZml4PVwiXCI7Yy50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmpvaW4oXCIuXCIpLnJlcGxhY2UoL1xcLihbXi5dKikkLyxcIi0kMVwiKS5yZXBsYWNlKC8tJC8sXCJcIil9O2IuZXhwb3J0cz1jfSkoai52ZXJzaW9uPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYygpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGMpKXJldHVybiBuZXcgY31iLmV4cG9ydHM9XHJcbiAgICB7fTtuPVwid2FyblwiO2MucHJvdG90eXBlPXtoYW5kbGU6ZnVuY3Rpb24oKXt9fTtiLmV4cG9ydHM9Y30pKGpbXCJ3YXJuL0Rpc21pc3NpdmVIYW5kbGVyXCJdPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYyhhKXtpZighKHRoaXMgaW5zdGFuY2VvZiBjKSlyZXR1cm4gbmV3IGMoYSk7dGhpcy5fY29uc29sZT1hfHx7fX1iLmV4cG9ydHM9e307bj1cIndhcm5cIjtjLnByb3RvdHlwZT17aGFuZGxlOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuX2NvbnNvbGUud2Fybnx8dGhpcy5fY29uc29sZS5sb2c7YiYmYi5jYWxsKHRoaXMuX2NvbnNvbGUsXCJXYXJuaW5nOiBcIithLm1lc3NhZ2UpfX07Yi5leHBvcnRzPWN9KShqW1wid2Fybi9Mb2dIYW5kbGVyXCJdPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYygpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGMpKXJldHVybiBuZXcgY31iLmV4cG9ydHM9e307bj1cIndhcm5cIjtjLnByb3RvdHlwZT17aGFuZGxlOmZ1bmN0aW9uKGEpe3Rocm93IGEuZ2V0RXJyb3IoKTtcclxuICAgIH19O2IuZXhwb3J0cz1jfSkoaltcIndhcm4vVGhyb3dIYW5kbGVyXCJdPXt9LFwiLlwiKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYyhhKXtpZighKHRoaXMgaW5zdGFuY2VvZiBjKSlyZXR1cm4gbmV3IGMoYSk7aWYoIShhIGluc3RhbmNlb2YgRXJyb3IpKXRocm93IFR5cGVFcnJvcihcIk11c3QgcHJvdmlkZSBleGNlcHRpb24gdG8gd3JhcFwiKTtFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLGEubWVzc2FnZSk7dGhpcy5tZXNzYWdlPWEubWVzc2FnZTt0aGlzLm5hbWU9XCJXYXJuaW5nXCI7dGhpcy5fZXJyb3I9YTt0aGlzLnN0YWNrPWEuc3RhY2smJmEuc3RhY2sucmVwbGFjZSgvXi4qP1xcbisvLHRoaXMubmFtZStcIjogXCIrdGhpcy5tZXNzYWdlK1wiXFxuXCIpfWIuZXhwb3J0cz17fTtuPVwid2FyblwiO2MucHJvdG90eXBlPUVycm9yKCk7Yy5wcm90b3R5cGUuY29uc3RydWN0b3I9YztjLnByb3RvdHlwZS5uYW1lPVwiV2FybmluZ1wiO2MucHJvdG90eXBlLmdldEVycm9yPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Vycm9yfTtcclxuICAgICAgICBiLmV4cG9ydHM9Y30pKGpbXCJ3YXJuL1dhcm5pbmdcIl09e30sXCIuXCIpO0IuQ2xhc3M9altcImNsYXNzXCJdLmV4cG9ydHM7Qi5BYnN0cmFjdENsYXNzPWouY2xhc3NfYWJzdHJhY3QuZXhwb3J0cztCLkZpbmFsQ2xhc3M9ai5jbGFzc19maW5hbC5leHBvcnRzO0IuSW50ZXJmYWNlPWpbXCJpbnRlcmZhY2VcIl0uZXhwb3J0cztCLlRyYWl0PWouVHJhaXQuZXhwb3J0cztCLnZlcnNpb249ai52ZXJzaW9uLmV4cG9ydHN9KShlYXNlanMsXCIuXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlanM7IiwidmFyIEdlbmVKUyA9IHtcclxuICAgIENsYXNzOiByZXF1aXJlKCcuL2Vhc2Vqcy5qcycpLkNsYXNzXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVKUzsiLCJleHBvcnRzLnB1cmVtdmMgPSByZXF1aXJlKFwiLi9saWIvcHVyZW12Yy0xLjAuMS1tb2QuanNcIik7XHJcbmV4cG9ydHMucHVyZW12Yy5zdGF0ZW1hY2hpbmUgPSByZXF1aXJlKFwiLi9saWIvcHVyZW12Yy1zdGF0ZW1hY2hpbmUtMS4wLW1vZC5qc1wiKTsiLCIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIFB1cmVNVkMgSlMgTmF0aXZlIFBvcnQgYnkgRGF2aWQgRm9sZXksIEZyw6lkw6lyaWMgU2F1bmllciwgJiBBbGFpbiBEdWNoZXNuZWF1IFxuICogQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBSZXVzZSBnb3Zlcm5lZCBieSBDcmVhdGl2ZSBDb21tb25zIEF0dHJpYnV0aW9uIDMuMCBcbiAqIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMC91cy9cbiAqIEBhdXRob3IgZGF2aWQuZm9sZXlAcHVyZW12Yy5vcmcgXG4gKi9cblxuXG4gXHQvKiBpbXBsZW1lbnRhdGlvbiBiZWdpbiAqL1xuXHRcblx0XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5PYnNlcnZlclxuICogXG4gKiBBIGJhc2UgT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24uXG4gKiBcbiAqIEFuIE9ic2VydmVyIGlzIGFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyBpbmZvcm1hdGlvblxuICogYWJvdXQgYW4gaW50ZXJlc3RlZCBvYmplY3Qgd2l0aCBhIG1ldGhvZCB0aGF0IHNob3VsZCBcbiAqIGJlIGNhbGxlZCB3aGVuIGEgcGFydGljdWxhciBOb3RpZmljYXRpb24gaXMgYnJvYWRjYXN0LiBcbiAqIFxuICogSW4gUHVyZU1WQywgdGhlIE9ic2VydmVyIGNsYXNzIGFzc3VtZXMgdGhlc2UgcmVzcG9uc2liaWxpdGllczpcbiAqIFxuICogLSBFbmNhcHN1bGF0ZSB0aGUgbm90aWZpY2F0aW9uIChjYWxsYmFjaykgbWV0aG9kIG9mIHRoZSBpbnRlcmVzdGVkIG9iamVjdC5cbiAqIC0gRW5jYXBzdWxhdGUgdGhlIG5vdGlmaWNhdGlvbiBjb250ZXh0ICh0aGlzKSBvZiB0aGUgaW50ZXJlc3RlZCBvYmplY3QuXG4gKiAtIFByb3ZpZGUgbWV0aG9kcyBmb3Igc2V0dGluZyB0aGUgbm90aWZpY2F0aW9uIG1ldGhvZCBhbmQgY29udGV4dC5cbiAqIC0gUHJvdmlkZSBhIG1ldGhvZCBmb3Igbm90aWZ5aW5nIHRoZSBpbnRlcmVzdGVkIG9iamVjdC5cbiAqIFxuICogXG4gKiBUaGUgbm90aWZpY2F0aW9uIG1ldGhvZCBvbiB0aGUgaW50ZXJlc3RlZCBvYmplY3Qgc2hvdWxkIHRha2UgXG4gKiBvbmUgcGFyYW1ldGVyIG9mIHR5cGUgTm90aWZpY2F0aW9uLlxuICogXG4gKiBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG5vdGlmeU1ldGhvZCBcbiAqICB0aGUgbm90aWZpY2F0aW9uIG1ldGhvZCBvZiB0aGUgaW50ZXJlc3RlZCBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBub3RpZnlDb250ZXh0IFxuICogIHRoZSBub3RpZmljYXRpb24gY29udGV4dCBvZiB0aGUgaW50ZXJlc3RlZCBvYmplY3RcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPYnNlcnZlciAobm90aWZ5TWV0aG9kLCBub3RpZnlDb250ZXh0KVxue1xuICAgIHRoaXMuc2V0Tm90aWZ5TWV0aG9kKG5vdGlmeU1ldGhvZCk7XG4gICAgdGhpcy5zZXROb3RpZnlDb250ZXh0KG5vdGlmeUNvbnRleHQpO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIE9ic2VydmVycyBub3RpZmljYXRpb24gbWV0aG9kLlxuICogXG4gKiBUaGUgbm90aWZpY2F0aW9uIG1ldGhvZCBzaG91bGQgdGFrZSBvbmUgcGFyYW1ldGVyIG9mIHR5cGUgTm90aWZpY2F0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBub3RpZnlNZXRob2RcbiAqICB0aGUgbm90aWZpY2F0aW9uIChjYWxsYmFjaykgbWV0aG9kIG9mIHRoZSBpbnRlcmVzdGVkIG9iamVjdC5cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5zZXROb3RpZnlNZXRob2Q9IGZ1bmN0aW9uIChub3RpZnlNZXRob2QpXG57XG4gICAgdGhpcy5ub3RpZnk9IG5vdGlmeU1ldGhvZDtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBPYnNlcnZlcnMgbm90aWZpY2F0aW9uIGNvbnRleHQuXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBub3RpZnlDb250ZXh0XG4gKiAgdGhlIG5vdGlmaWNhdGlvbiBjb250ZXh0ICh0aGlzKSBvZiB0aGUgaW50ZXJlc3RlZCBvYmplY3QuXG4gKiBcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5zZXROb3RpZnlDb250ZXh0PSBmdW5jdGlvbiAobm90aWZ5Q29udGV4dClcbntcbiAgICB0aGlzLmNvbnRleHQ9IG5vdGlmeUNvbnRleHQ7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgRnVuY3Rpb24gdGhhdCB0aGlzIE9ic2VydmVyIHdpbGwgaW52b2tlIHdoZW4gaXQgaXMgbm90aWZpZWQuXG4gKiBcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuT2JzZXJ2ZXIucHJvdG90eXBlLmdldE5vdGlmeU1ldGhvZD0gZnVuY3Rpb24gKClcbntcbiAgICByZXR1cm4gdGhpcy5ub3RpZnk7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgT2JqZWN0IHRoYXQgd2lsbCBzZXJ2ZSBhcyB0aGUgT2JzZXJ2ZXJzIGNhbGxiYWNrIGV4ZWN1dGlvbiBjb250ZXh0XG4gKiBcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5nZXROb3RpZnlDb250ZXh0PSBmdW5jdGlvbiAoKVxue1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQ7XG59O1xuXG4vKipcbiAqIE5vdGlmeSB0aGUgaW50ZXJlc3RlZCBvYmplY3QuXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5Ob3RpZmljYXRpb259IG5vdGlmaWNhdGlvblxuICogIFRoZSBOb3RpZmljYXRpb24gdG8gcGFzcyB0byB0aGUgaW50ZXJlc3RlZCBvYmplY3RzIG5vdGlmaWNhdGlvbiBtZXRob2RcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5ub3RpZnlPYnNlcnZlcj0gZnVuY3Rpb24gKG5vdGlmaWNhdGlvbilcbntcbiAgICB0aGlzLmdldE5vdGlmeU1ldGhvZCgpLmNhbGwodGhpcy5nZXROb3RpZnlDb250ZXh0KCksIG5vdGlmaWNhdGlvbik7XG59O1xuXG4vKipcbiAqIENvbXBhcmUgYW4gb2JqZWN0IHRvIHRoaXMgT2JzZXJ2ZXJzIG5vdGlmaWNhdGlvbiBjb250ZXh0LlxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gKiAgXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5PYnNlcnZlci5wcm90b3R5cGUuY29tcGFyZU5vdGlmeUNvbnRleHQ9IGZ1bmN0aW9uIChvYmplY3QpXG57XG4gICAgcmV0dXJuIG9iamVjdCA9PT0gdGhpcy5jb250ZXh0O1xufTtcblxuLyoqXG4gKiBUaGUgT2JzZXJ2ZXJzIGNhbGxiYWNrIEZ1bmN0aW9uXG4gKiBcbiAqIEBwcml2YXRlXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5ub3RpZnk9IG51bGw7XG5cbi8qKlxuICogVGhlIE9ic2VydmVycyBjYWxsYmFjayBPYmplY3RcbiAqIEBwcml2YXRlXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5PYnNlcnZlci5wcm90b3R5cGUuY29udGV4dD0gbnVsbDtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLk5vdGlmaWNhdGlvblxuICogXG4gKiBBIGJhc2UgTm90aWZpY2F0aW9uIGltcGxlbWVudGF0aW9uLlxuICogXG4gKiBQdXJlTVZDIGRvZXMgbm90IHJlbHkgdXBvbiB1bmRlcmx5aW5nIGV2ZW50IG1vZGVscyBzdWNoIGFzIHRoZSBvbmUgcHJvdmlkZWQgXG4gKiB3aXRoIHRoZSBET00gb3Igb3RoZXIgYnJvd3NlciBjZW50cmljIFczQyBldmVudCBtb2RlbHMuXG4gKiBcbiAqIFRoZSBPYnNlcnZlciBQYXR0ZXJuIGFzIGltcGxlbWVudGVkIHdpdGhpbiBQdXJlTVZDIGV4aXN0cyB0byBzdXBwb3J0IFxuICogZXZlbnQtZHJpdmVuIGNvbW11bmljYXRpb24gYmV0d2VlbiB0aGUgYXBwbGljYXRpb24gYW5kIHRoZSBhY3RvcnMgb2YgdGhlIE1WQyBcbiAqIHRyaWFkLlxuICogXG4gKiBOb3RpZmljYXRpb25zIGFyZSBub3QgbWVhbnQgdG8gYmUgYSByZXBsYWNlbWVudCBmb3IgZXZlbnRzIGluIHRoZSBicm93c2VyLiBcbiAqIEdlbmVyYWxseSwgTWVkaWF0b3IgaW1wbGVtZW50b3JzIHBsYWNlIGV2ZW50IGxpc3RlbmVycyBvbiB0aGVpciB2aWV3IFxuICogY29tcG9uZW50cywgd2hpY2ggdGhleSB0aGVuIGhhbmRsZSBpbiB0aGUgdXN1YWwgd2F5LiBUaGlzIG1heSBsZWFkIHRvIHRoZSBcbiAqIGJyb2FkY2FzdCBvZiBOb3RpZmljYXRpb25zIHRvIHRyaWdnZXIgY29tbWFuZHMgb3IgdG8gY29tbXVuaWNhdGUgd2l0aCBvdGhlciBcbiAqIE1lZGlhdG9ycy4ge0BsaW5rIHB1cmVtdmMuUHJveHkgUHJveHl9LFxuICoge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kfVxuICogYW5kIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmR9XG4gKiBpbnN0YW5jZXMgY29tbXVuaWNhdGUgd2l0aCBlYWNoIG90aGVyIGFuZCBcbiAqIHtAbGluayBwdXJlbXZjLk1lZGlhdG9yIE1lZGlhdG9yfXNcbiAqIGJ5IGJyb2FkY2FzdGluZyBOb3RpZmljYXRpb25zLlxuICogXG4gKiBBIGtleSBkaWZmZXJlbmNlIGJldHdlZW4gYnJvd3NlciBldmVudHMgYW5kIFB1cmVNVkMgTm90aWZpY2F0aW9ucyBpcyB0aGF0XG4gKiBldmVudHMgZm9sbG93IHRoZSAnQ2hhaW4gb2YgUmVzcG9uc2liaWxpdHknIHBhdHRlcm4sICdidWJibGluZycgdXAgdGhlIFxuICogZGlzcGxheSBoaWVyYXJjaHkgdW50aWwgc29tZSBwYXJlbnQgY29tcG9uZW50IGhhbmRsZXMgdGhlIGV2ZW50LCB3aGlsZSBcbiAqIFB1cmVNVkMgTm90aWZpY2F0aW9uIGZvbGxvdyBhICdQdWJsaXNoL1N1YnNjcmliZScgcGF0dGVybi4gUHVyZU1WQyBjbGFzc2VzIFxuICogbmVlZCBub3QgYmUgcmVsYXRlZCB0byBlYWNoIG90aGVyIGluIGEgcGFyZW50L2NoaWxkIHJlbGF0aW9uc2hpcCBpbiBvcmRlciB0byBcbiAqIGNvbW11bmljYXRlIHdpdGggb25lIGFub3RoZXIgdXNpbmcgTm90aWZpY2F0aW9ucy5cbiAqIFxuICogQGNvbnN0cnVjdG9yIFxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqICBUaGUgTm90aWZpY2F0aW9uIG5hbWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbYm9keV1cbiAqICBUaGUgTm90aWZpY2F0aW9uIGJvZHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBbdHlwZV1cbiAqICBUaGUgTm90aWZpY2F0aW9uIHR5cGVcbiAqL1xuZnVuY3Rpb24gTm90aWZpY2F0aW9uKG5hbWUsIGJvZHksIHR5cGUpXG57XG4gICAgdGhpcy5uYW1lPSBuYW1lO1xuICAgIHRoaXMuYm9keT0gYm9keTtcbiAgICB0aGlzLnR5cGU9IHR5cGU7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgbmFtZSBvZiB0aGUgTm90aWZpY2F0aW9uIGluc3RhbmNlXG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICogIFRoZSBuYW1lIG9mIHRoZSBOb3RpZmljYXRpb24gaW5zdGFuY2VcbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5nZXROYW1lPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbn07XG5cbi8qKlxuICogU2V0IHRoaXMgTm90aWZpY2F0aW9ucyBib2R5LiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBib2R5XG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLnNldEJvZHk9IGZ1bmN0aW9uKGJvZHkpXG57XG4gICAgdGhpcy5ib2R5PSBib2R5O1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIE5vdGlmaWNhdGlvbiBib2R5LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5nZXRCb2R5PSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIHRoaXMuYm9keVxufTtcblxuLyoqXG4gKiBTZXQgdGhlIHR5cGUgb2YgdGhlIE5vdGlmaWNhdGlvbiBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5zZXRUeXBlPSBmdW5jdGlvbih0eXBlKVxue1xuICAgIHRoaXMudHlwZT0gdHlwZTtcbn07XG5cbi8qKlxuICogR2V0IHRoZSB0eXBlIG9mIHRoZSBOb3RpZmljYXRpb24gaW5zdGFuY2UuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5nZXRUeXBlPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIHRoaXMudHlwZTtcbn07XG5cbi8qKlxuICogR2V0IGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBOb3RpZmljYXRpb24gaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUudG9TdHJpbmc9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgbXNnPSBcIk5vdGlmaWNhdGlvbiBOYW1lOiBcIiArIHRoaXMuZ2V0TmFtZSgpO1xuICAgIG1zZys9IFwiXFxuQm9keTpcIiArICgodGhpcy5ib2R5ID09IG51bGwgKSA/IFwibnVsbFwiIDogdGhpcy5ib2R5LnRvU3RyaW5nKCkpO1xuICAgIG1zZys9IFwiXFxuVHlwZTpcIiArICgodGhpcy50eXBlID09IG51bGwgKSA/IFwibnVsbFwiIDogdGhpcy50eXBlKTtcbiAgICByZXR1cm4gbXNnO1xufTtcblxuLyoqXG4gKiBUaGUgTm90aWZpY2F0aW9ucyBuYW1lLlxuICpcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLm5hbWU9IG51bGw7XG5cbi8qKlxuICogVGhlIE5vdGlmaWNhdGlvbnMgdHlwZS5cbiAqXG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQHByaXZhdGVcbiAqL1xuTm90aWZpY2F0aW9uLnByb3RvdHlwZS50eXBlPSBudWxsO1xuXG4vKipcbiAqIFRoZSBOb3RpZmljYXRpb25zIGJvZHkuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuYm9keT0gbnVsbDtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLk5vdGlmaWVyXG4gKiBcbiAqIEEgQmFzZSBOb3RpZmllciBpbXBsZW1lbnRhdGlvbi5cbiAqIFxuICoge0BsaW5rIHB1cmVtdmMuTWFjcm9Db21tYW5kIE1hY3JvQ29tbWFuZH0sIFxuICoge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kfSwgXG4gKiB7QGxpbmsgcHVyZW12Yy5NZWRpYXRvciBNZWRpYXRvcn0gYW5kIFxuICoge0BsaW5rIHB1cmVtdmMuUHJveHkgUHJveHl9XG4gKiBhbGwgaGF2ZSBhIG5lZWQgdG8gc2VuZCBOb3RpZmljYXRpb25zXG4gKiBcbiAqIFRoZSBOb3RpZmllciBpbnRlcmZhY2UgcHJvdmlkZXMgYSBjb21tb24gbWV0aG9kIGNhbGxlZCAjc2VuZE5vdGlmaWNhdGlvbiB0aGF0IFxuICogcmVsaWV2ZXMgaW1wbGVtZW50YXRpb24gY29kZSBvZiB0aGUgbmVjZXNzaXR5IHRvIGFjdHVhbGx5IGNvbnN0cnVjdCBcbiAqIE5vdGlmaWNhdGlvbnMuXG4gKiBcbiAqIFRoZSBOb3RpZmllciBjbGFzcywgd2hpY2ggYWxsIG9mIHRoZSBhYm92ZSBtZW50aW9uZWQgY2xhc3Nlc1xuICogZXh0ZW5kLCBwcm92aWRlcyBhbiBpbml0aWFsaXplZCByZWZlcmVuY2UgdG8gdGhlIFxuICoge0BsaW5rIHB1cmVtdmMuRmFjYWRlIEZhY2FkZX1cbiAqIE11bHRpdG9uLCB3aGljaCBpcyByZXF1aXJlZCBmb3IgdGhlIGNvbnZpZW5pZW5jZSBtZXRob2RcbiAqIGZvciBzZW5kaW5nIE5vdGlmaWNhdGlvbnMgYnV0IGFsc28gZWFzZXMgaW1wbGVtZW50YXRpb24gYXMgdGhlc2VcbiAqIGNsYXNzZXMgaGF2ZSBmcmVxdWVudCBcbiAqIHtAbGluayBwdXJlbXZjLkZhY2FkZSBGYWNhZGV9IGludGVyYWN0aW9ucyBcbiAqIGFuZCB1c3VhbGx5IHJlcXVpcmUgYWNjZXNzIHRvIHRoZSBmYWNhZGUgYW55d2F5LlxuICogXG4gKiBOT1RFOiBJbiB0aGUgTXVsdGlDb3JlIHZlcnNpb24gb2YgdGhlIGZyYW1ld29yaywgdGhlcmUgaXMgb25lIGNhdmVhdCB0b1xuICogbm90aWZpZXJzLCB0aGV5IGNhbm5vdCBzZW5kIG5vdGlmaWNhdGlvbnMgb3IgcmVhY2ggdGhlIGZhY2FkZSB1bnRpbCB0aGV5XG4gKiBoYXZlIGEgdmFsaWQgbXVsdGl0b25LZXkuIFxuICogXG4gKiBUaGUgbXVsdGl0b25LZXkgaXMgc2V0OlxuICogICAtIG9uIGEgQ29tbWFuZCB3aGVuIGl0IGlzIGV4ZWN1dGVkIGJ5IHRoZSBDb250cm9sbGVyXG4gKiAgIC0gb24gYSBNZWRpYXRvciBpcyByZWdpc3RlcmVkIHdpdGggdGhlIFZpZXdcbiAqICAgLSBvbiBhIFByb3h5IGlzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgTW9kZWwuIFxuICogXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gTm90aWZpZXIoKVxue1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYW5kIHNlbmQgYSBOb3RpZmljYXRpb24uXG4gKlxuICogS2VlcHMgdXMgZnJvbSBoYXZpbmcgdG8gY29uc3RydWN0IG5ldyBOb3RpZmljYXRpb24gaW5zdGFuY2VzIGluIG91ciBcbiAqIGltcGxlbWVudGF0aW9uIGNvZGUuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb25OYW1lXG4gKiAgQSBub3RpZmljYXRpb24gbmFtZVxuICogQHBhcmFtIHtPYmplY3R9IFtib2R5XVxuICogIFRoZSBib2R5IG9mIHRoZSBub3RpZmljYXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV1cbiAqICBUaGUgbm90aWZpY2F0aW9uIHR5cGVcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5zZW5kTm90aWZpY2F0aW9uID0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSwgYm9keSwgdHlwZSlcbntcbiAgICB2YXIgZmFjYWRlID0gdGhpcy5nZXRGYWNhZGUoKTtcbiAgICBpZihmYWNhZGUpXG4gICAge1xuICAgICAgICBmYWNhZGUuc2VuZE5vdGlmaWNhdGlvbihub3RpZmljYXRpb25OYW1lLCBib2R5LCB0eXBlKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogQHByb3RlY3RlZFxuICogQSByZWZlcmVuY2UgdG8gdGhpcyBOb3RpZmllcidzIEZhY2FkZS4gVGhpcyByZWZlcmVuY2Ugd2lsbCBub3QgYmUgYXZhaWxhYmxlXG4gKiB1bnRpbCAjaW5pdGlhbGl6ZU5vdGlmaWVyIGhhcyBiZWVuIGNhbGxlZC4gXG4gKiBcbiAqIEB0eXBlIHtwdXJlbXZjLkZhY2FkZX1cbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLmZhY2FkZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoaXMgTm90aWZpZXIgaW5zdGFuY2UuXG4gKiBcbiAqIFRoaXMgaXMgaG93IGEgTm90aWZpZXIgZ2V0cyBpdHMgbXVsdGl0b25LZXkuIFxuICogQ2FsbHMgdG8gI3NlbmROb3RpZmljYXRpb24gb3IgdG8gYWNjZXNzIHRoZVxuICogZmFjYWRlIHdpbGwgZmFpbCB1bnRpbCBhZnRlciB0aGlzIG1ldGhvZCBcbiAqIGhhcyBiZWVuIGNhbGxlZC5cbiAqIFxuICogTWVkaWF0b3JzLCBDb21tYW5kcyBvciBQcm94aWVzIG1heSBvdmVycmlkZSBcbiAqIHRoaXMgbWV0aG9kIGluIG9yZGVyIHRvIHNlbmQgbm90aWZpY2F0aW9uc1xuICogb3IgYWNjZXNzIHRoZSBNdWx0aXRvbiBGYWNhZGUgaW5zdGFuY2UgYXNcbiAqIHNvb24gYXMgcG9zc2libGUuIFRoZXkgQ0FOTk9UIGFjY2VzcyB0aGUgZmFjYWRlXG4gKiBpbiB0aGVpciBjb25zdHJ1Y3RvcnMsIHNpbmNlIHRoaXMgbWV0aG9kIHdpbGwgbm90XG4gKiB5ZXQgaGF2ZSBiZWVuIGNhbGxlZC5cbiAqIFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqICBUaGUgTm90aWZpZXJzIG11bHRpdG9uIGtleTtcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5pbml0aWFsaXplTm90aWZpZXIgPSBmdW5jdGlvbihrZXkpXG57XG4gICAgdGhpcy5tdWx0aXRvbktleSA9IFN0cmluZyhrZXkpO1xuICAgIHRoaXMuZmFjYWRlPSB0aGlzLmdldEZhY2FkZSgpO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgTXVsdGl0b24gRmFjYWRlIGluc3RhbmNlXG4gKlxuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEByZXR1cm4ge3B1cmVtdmMuRmFjYWRlfVxuICovXG5Ob3RpZmllci5wcm90b3R5cGUuZ2V0RmFjYWRlID0gZnVuY3Rpb24oKVxue1xuICAgIGlmKHRoaXMubXVsdGl0b25LZXkgPT0gbnVsbClcbiAgICB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihOb3RpZmllci5NVUxUSVRPTl9NU0cpO1xuICAgIH07XG5cbiAgICByZXR1cm4gRmFjYWRlLmdldEluc3RhbmNlKHRoaXMubXVsdGl0b25LZXkpO1xufTtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgTm90aWZpZXJzIGludGVybmFsIG11bHRpdG9uIGtleS5cbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBzdHJpbmdcbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLm11bHRpdG9uS2V5ID0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgZXJyb3IgbWVzc2FnZSB1c2VkIGlmIHRoZSBOb3RpZmllciBpcyBub3QgaW5pdGlhbGl6ZWQgY29ycmVjdGx5IGFuZFxuICogYXR0ZW1wdHMgdG8gcmV0cmlldmUgaXRzIG93biBtdWx0aXRvbiBrZXlcbiAqXG4gKiBAc3RhdGljXG4gKiBAcHJvdGVjdGVkXG4gKiBAY29uc3RcbiAqIEB0eXBlIHN0cmluZ1xuICovXG5Ob3RpZmllci5NVUxUSVRPTl9NU0cgPSBcIm11bHRpdG9uS2V5IGZvciB0aGlzIE5vdGlmaWVyIG5vdCB5ZXQgaW5pdGlhbGl6ZWQhXCI7XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5TaW1wbGVDb21tYW5kXG4gKiBAZXh0ZW5kcyBwdXJlbXZjLk5vdGlmaWVyXG4gKlxuICogU2ltcGxlQ29tbWFuZHMgZW5jYXBzdWxhdGUgdGhlIGJ1c2luZXNzIGxvZ2ljIG9mIHlvdXIgYXBwbGljYXRpb24uIFlvdXIgXG4gKiBzdWJjbGFzcyBzaG91bGQgb3ZlcnJpZGUgdGhlICNleGVjdXRlIG1ldGhvZCB3aGVyZSB5b3VyIGJ1c2luZXNzIGxvZ2ljIHdpbGxcbiAqIGhhbmRsZSB0aGUgXG4gKiB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufVxuICogXG4gKiBUYWtlIGEgbG9vayBhdCBcbiAqIHtAbGluayBwdXJlbXZjLkZhY2FkZSNyZWdpc3RlckNvbW1hbmQgRmFjYWRlJ3MgcmVnaXN0ZXJDb21tYW5kfVxuICogb3Ige0BsaW5rIHB1cmVtdmMuQ29udHJvbGxlciNyZWdpc3RlckNvbW1hbmQgQ29udHJvbGxlcnMgcmVnaXN0ZXJDb21tYW5kfVxuICogbWV0aG9kcyB0byBzZWUgaG93IHRvIGFkZCBjb21tYW5kcyB0byB5b3VyIGFwcGxpY2F0aW9uLlxuICogXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gU2ltcGxlQ29tbWFuZCAoKSB7IH07XG5cblNpbXBsZUNvbW1hbmQucHJvdG90eXBlPSBuZXcgTm90aWZpZXI7XG5TaW1wbGVDb21tYW5kLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj0gU2ltcGxlQ29tbWFuZDtcblxuLyoqXG4gKiBGdWxmaWxsIHRoZSB1c2UtY2FzZSBpbml0aWF0ZWQgYnkgdGhlIGdpdmVuIE5vdGlmaWNhdGlvblxuICogXG4gKiBJbiB0aGUgQ29tbWFuZCBQYXR0ZXJuLCBhbiBhcHBsaWNhdGlvbiB1c2UtY2FzZSB0eXBpY2FsbHkgYmVnaW5zIHdpdGggc29tZVxuICogdXNlciBhY3Rpb24sIHdoaWNoIHJlc3VsdHMgaW4gYSBOb3RpZmljYXRpb24gaXMgaGFuZGxlZCBieSB0aGUgYnVzaW5lc3MgbG9naWNcbiAqIGluIHRoZSAjZXhlY3V0ZSBtZXRob2Qgb2YgYSBjb21tYW5kLlxuICogXG4gKiBAcGFyYW0ge3B1cmVtdmMuTm90aWZpY2F0aW9ufSBub3RpZmljYXRpb25cbiAqICBUaGUgbm90aWZpY2F0aW9uIHRvIGhhbmRsZS5cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cblNpbXBsZUNvbW1hbmQucHJvdG90eXBlLmV4ZWN1dGU9IGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHsgfTtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLk1hY3JvQ29tbWFuZFxuICogQGV4dGVuZHMgcHVyZW12Yy5Ob3RpZmllclxuICogXG4gKiBBIGJhc2UgY29tbWFuZCBpbXBsZW1lbnRhdGlvbiB0aGF0IGV4ZWN1dGVzIG90aGVyIGNvbW1hbmRzLCBzdWNoIGFzXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9XG4gKiBvciB7QGxpbmsgcHVyZW12Yy5NYWNyb0NvbW1hbmQgTWFjcm9Db21tYW5kfVxuICogc3ViY2xhc3Nlcy5cbiAqICBcbiAqIEEgTWFjcm9Db21tYW5kIG1haW50YWlucyBhbiBsaXN0IG9mXG4gKiBjb21tYW5kIGNvbnN0cnVjdG9yIHJlZmVyZW5jZXMgY2FsbGVkICpTdWJDb21tYW5kcyouXG4gKiBcbiAqIFdoZW4gI2V4ZWN1dGUgaXMgY2FsbGVkLCB0aGUgTWFjcm9Db21tYW5kXG4gKiBpbnN0YW50aWF0ZXMgYW5kIGNhbGxzICNleGVjdXRlIG9uIGVhY2ggb2YgaXRzICpTdWJDb21tYW5kcyogaW4gdHVybi5cbiAqIEVhY2ggKlN1YkNvbW1hbmQqIHdpbGwgYmUgcGFzc2VkIGEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbFxuICoge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn0gXG4gKiB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlIE1hY3JvQ29tbWFuZHMgI2V4ZWN1dGUgbWV0aG9kXG4gKiBcbiAqIFVubGlrZSB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9LCBcbiAqIHlvdXIgc3ViY2xhc3Mgc2hvdWxkIG5vdCBvdmVycmlkZSAjZXhlY3V0ZSBidXQgaW5zdGVhZCwgc2hvdWxkIFxuICogb3ZlcnJpZGUgdGhlICNpbml0aWFsaXplTWFjcm9Db21tYW5kIG1ldGhvZCwgY2FsbGluZyAjYWRkU3ViQ29tbWFuZCBvbmNlIGZvciBcbiAqIGVhY2ggKlN1YkNvbW1hbmQqIHRvIGJlIGV4ZWN1dGVkLlxuICogXG4gKiBJZiB5b3VyIHN1YmNsYXNzIGRvZXMgZGVmaW5lIGEgY29uc3RydWN0b3IsIGJlIHN1cmUgdG8gY2FsbCBcInN1cGVyXCIgbGlrZSBzb1xuICogXG4gKiAgICAgZnVuY3Rpb24gTXlNYWNyb0NvbW1hbmQgKClcbiAqICAgICB7XG4gKiAgICAgICAgIE1hY3JvQ29tbWFuZC5jYWxsKHRoaXMpO1xuICogICAgIH07XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gTWFjcm9Db21tYW5kKClcbntcbiAgICB0aGlzLnN1YkNvbW1hbmRzPSBbXTtcbiAgICB0aGlzLmluaXRpYWxpemVNYWNyb0NvbW1hbmQoKTtcbn07XG5cbi8qIHN1YmNsYXNzIE5vdGlmaWVyICovXG5NYWNyb0NvbW1hbmQucHJvdG90eXBlPSBuZXcgTm90aWZpZXI7XG5NYWNyb0NvbW1hbmQucHJvdG90eXBlLmNvbnN0cnVjdG9yPSBNYWNyb0NvbW1hbmQ7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEB0eXBlIHtBcnJheS48cHVyZW12Yy5TaW1wbGVDb21tYW5kfHB1cmVtdmMuTWFjcm9Db21tYW5kPn1cbiAqL1xuTWFjcm9Db21tYW5kLnByb3RvdHlwZS5zdWJDb21tYW5kcz0gbnVsbDtcblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBJbml0aWFsaXplIHRoZSBNYWNyb0NvbW1hbmQuXG4gKiBcbiAqIEluIHlvdXIgc3ViY2xhc3MsIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIFxuICogaW5pdGlhbGl6ZSB0aGUgTWFjcm9Db21tYW5kJ3MgKlN1YkNvbW1hbmQqICBcbiAqIGxpc3Qgd2l0aCBjb21tYW5kIGNsYXNzIHJlZmVyZW5jZXMgbGlrZSBcbiAqIHRoaXM6XG4gKiBcbiAqICAgICAvLyBJbml0aWFsaXplIE15TWFjcm9Db21tYW5kXG4gKiAgICAgTXlNYWNyb0NvbW1hbmQucHJvdG90eXBlLmluaXRpYWxpemVNYWNyb0NvbW1hbmQ9IGZ1bmN0aW9uICgpXG4gKiAgICAge1xuICogICAgICAgICB0aGlzLmFkZFN1YkNvbW1hbmQoIGNvbS5tZS5teWFwcC5jb250cm9sbGVyLkZpcnN0Q29tbWFuZCApO1xuICogICAgICAgICB0aGlzLmFkZFN1YkNvbW1hbmQoIGNvbS5tZS5teWFwcC5jb250cm9sbGVyLlNlY29uZENvbW1hbmQgKTtcbiAqICAgICAgICAgdGhpcy5hZGRTdWJDb21tYW5kKCBjb20ubWUubXlhcHAuY29udHJvbGxlci5UaGlyZENvbW1hbmQgKTtcbiAqICAgICB9O1xuICogXG4gKiBOb3RlIHRoYXQgKlN1YkNvbW1hbmQqcyBtYXkgYmUgYW55IGNvbW1hbmQgaW1wbGVtZW50b3IsXG4gKiBNYWNyb0NvbW1hbmRzIG9yIFNpbXBsZUNvbW1hbmRzIGFyZSBib3RoIGFjY2VwdGFibGUuXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5NYWNyb0NvbW1hbmQucHJvdG90eXBlLmluaXRpYWxpemVNYWNyb0NvbW1hbmQ9IGZ1bmN0aW9uKCkge31cblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBBZGQgYSAqU3ViQ29tbWFuZCpcbiAqIFxuICogVGhlICpTdWJDb21tYW5kKnMgd2lsbCBiZSBjYWxsZWQgaW4gRmlyc3QgSW4gLyBGaXJzdCBPdXQgKEZJRk8pIG9yZGVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21tYW5kQ2xhc3NSZWZcbiAqICBBIHJlZmVyZW5jZSB0byBhIHN1YmNsYXNzZWQgU2ltcGxlQ29tbWFuZCBvciBNYWNyb0NvbW1hbmQgY29uc3RydWN0b3JcbiAqL1xuTWFjcm9Db21tYW5kLnByb3RvdHlwZS5hZGRTdWJDb21tYW5kPSBmdW5jdGlvbihjb21tYW5kQ2xhc3NSZWYpXG57XG4gICAgdGhpcy5zdWJDb21tYW5kcy5wdXNoKGNvbW1hbmRDbGFzc1JlZik7XG59O1xuXG4vKipcbiAqIEV4ZWN1dGUgdGhpcyBNYWNyb0NvbW1hbmRzICpTdWJDb21tYW5kcypcbiAqIFxuICogVGhlICpTdWJDb21tYW5kKnMgd2lsbCBiZSBjYWxsZWQgaW4gRmlyc3QgSW4gLyBGaXJzdCBPdXQgKEZJRk8pIG9yZGVyXG4gKiBAcGFyYW0ge3B1cmVtdmMuTm90aWZpY2F0aW9ufSBub3RlXG4gKiAgVGhlIE5vdGlmaWNhdGlvbiBvYmplY3QgdG8gYmUgcGFzc2VkIHRvIGVhY2ggKlN1YkNvbW1hbmQqXG4gKi9cbk1hY3JvQ29tbWFuZC5wcm90b3R5cGUuZXhlY3V0ZT0gZnVuY3Rpb24obm90ZSlcbntcbiAgICAvLyBTSUMtIFRPRE8gb3B0aW1pemVcbiAgICB3aGlsZSh0aGlzLnN1YkNvbW1hbmRzLmxlbmd0aCA+IDApXG4gICAge1xuICAgICAgICB2YXIgcmVmPSB0aGlzLnN1YkNvbW1hbmRzLnNoaWZ0KCk7XG4gICAgICAgIHZhciBjbWQ9IG5ldyByZWY7XG4gICAgICAgIGNtZC5pbml0aWFsaXplTm90aWZpZXIodGhpcy5tdWx0aXRvbktleSk7XG4gICAgICAgIGNtZC5leGVjdXRlKG5vdGUpO1xuICAgIH1cbn07XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5NZWRpYXRvclxuICogQGV4dGVuZHMgcHVyZW12Yy5Ob3RpZmllclxuICogXG4gKiBBIGJhc2UgTWVkaWF0b3IgaW1wbGVtZW50YXRpb24uXG4gKlxuICogSW4gUHVyZU1WQywgTWVkaWF0b3IgY2xhc3NlcyBhcmUgdXNlZCB0byBtZWRpYXRlIGNvbW11bmljYXRpb24gYmV0d2VlbiBhIHZpZXcgXG4gKiBjb21wb25lbnQgYW5kIHRoZSByZXN0IG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBBIE1lZGlhdG9yIHNob3VsZCBsaXN0ZW4gdG8gaXRzIHZpZXcgY29tcG9uZW50cyBmb3IgZXZlbnRzLCBhbmQgaGFuZGxlIHRoZW0gXG4gKiBieSBzZW5kaW5nIG5vdGlmaWNhdGlvbnMgKHRvIGJlIGhhbmRsZWQgYnkgb3RoZXIgTWVkaWF0b3JzLCBcbiAqIHtAbGluayBwdXJlbXZjLlNpbXBsZUNvbW1hbmQgU2ltcGxlQ29tbWFuZHN9IFxuICogb3JcbiAqIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmRzfSkgXG4gKiBvciBwYXNzaW5nIGRhdGEgZnJvbSB0aGUgdmlldyBjb21wb25lbnQgZGlyZWN0bHkgdG8gYSBcbiAqIHtAbGluayBwdXJlbXZjLlByb3h5IFByb3h5fSwgc3VjaCBhcyBzdWJtaXR0aW5nIFxuICogdGhlIGNvbnRlbnRzIG9mIGEgZm9ybSB0byBhIHNlcnZpY2UuXG4gKiBcbiAqIE1lZGlhdG9ycyBzaG91bGQgbm90IHBlcmZvcm0gYnVzaW5lc3MgbG9naWMsIG1haW50YWluIHN0YXRlIG9yIG90aGVyIFxuICogaW5mb3JtYXRpb24gZm9yIGl0cyB2aWV3IGNvbXBvbmVudCwgb3IgYnJlYWsgdGhlIGVuY2Fwc3VsYXRpb24gb2YgdGhlIHZpZXcgXG4gKiBjb21wb25lbnQgYnkgbWFuaXB1bGF0aW5nIHRoZSB2aWV3IGNvbXBvbmVudCdzIGNoaWxkcmVuLiBJdCBzaG91bGQgb25seSBjYWxsIFxuICogbWV0aG9kcyBvciBzZXQgcHJvcGVydGllcyBvbiB0aGUgdmlldyBjb21wb25lbnQuXG4gKiAgXG4gKiBUaGUgdmlldyBjb21wb25lbnQgc2hvdWxkIGVuY2Fwc3VsYXRlIGl0cyBvd24gYmVoYXZpb3IgYW5kIGltcGxlbWVudGF0aW9uIGJ5IFxuICogZXhwb3NpbmcgbWV0aG9kcyBhbmQgcHJvcGVydGllcyB0aGF0IHRoZSBNZWRpYXRvciBjYW4gY2FsbCB3aXRob3V0IGhhdmluZyB0byBcbiAqIGtub3cgYWJvdXQgdGhlIHZpZXcgY29tcG9uZW50J3MgY2hpbGRyZW4uXG4gKiBcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtzdHJpbmd9IFttZWRpYXRvck5hbWVdXG4gKiAgVGhlIE1lZGlhdG9ycyBuYW1lLiBUaGUgTWVkaWF0b3JzIHN0YXRpYyAjTkFNRSB2YWx1ZSBpcyB1c2VkIGJ5IGRlZmF1bHRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbdmlld0NvbXBvbmVudF1cbiAqICBUaGUgTWVkaWF0b3JzIHtAbGluayAjc2V0Vmlld0NvbXBvbmVudCB2aWV3Q29tcG9uZW50fS5cbiAqL1xuZnVuY3Rpb24gTWVkaWF0b3IgKG1lZGlhdG9yTmFtZSwgdmlld0NvbXBvbmVudClcbntcbiAgICB0aGlzLm1lZGlhdG9yTmFtZT0gbWVkaWF0b3JOYW1lIHx8IHRoaXMuY29uc3RydWN0b3IuTkFNRTtcbiAgICB0aGlzLnZpZXdDb21wb25lbnQ9dmlld0NvbXBvbmVudDsgIFxufTtcblxuLyoqXG4gKiBAc3RhdGljXG4gKiBUaGUgbmFtZSBvZiB0aGUgTWVkaWF0b3IuXG4gKiBcbiAqIFR5cGljYWxseSwgYSBNZWRpYXRvciB3aWxsIGJlIHdyaXR0ZW4gdG8gc2VydmUgb25lIHNwZWNpZmljIGNvbnRyb2wgb3IgZ3JvdXBcbiAqIG9mIGNvbnRyb2xzIGFuZCBzbywgd2lsbCBub3QgaGF2ZSBhIG5lZWQgdG8gYmUgZHluYW1pY2FsbHkgbmFtZWQuXG4gKiBcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbk1lZGlhdG9yLk5BTUU9IFwiTWVkaWF0b3JcIjtcblxuLyogc3ViY2xhc3MgKi9cbk1lZGlhdG9yLnByb3RvdHlwZT0gbmV3IE5vdGlmaWVyO1xuTWVkaWF0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yPSBNZWRpYXRvcjtcblxuLyoqXG4gKiBHZXQgdGhlIG5hbWUgb2YgdGhlIE1lZGlhdG9yXG4gKiBcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqICBUaGUgTWVkaWF0b3IgbmFtZVxuICovXG5NZWRpYXRvci5wcm90b3R5cGUuZ2V0TWVkaWF0b3JOYW1lPSBmdW5jdGlvbiAoKVxue1xuICAgIHJldHVybiB0aGlzLm1lZGlhdG9yTmFtZTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBNZWRpYXRvcnMgdmlldyBjb21wb25lbnQuIFRoaXMgY291bGRcbiAqIGJlIGEgSFRNTEVsZW1lbnQsIGEgYmVzcG9rZSBVaUNvbXBvbmVudCB3cmFwcGVyXG4gKiBjbGFzcywgYSBNb29Ub29scyBFbGVtZW50LCBhIGpRdWVyeSByZXN1bHQgb3IgYVxuICogY3NzIHNlbGVjdG9yLCBkZXBlbmRpbmcgb24gd2hpY2ggRE9NIGFic3RyYWN0aW9uIFxuICogbGlicmFyeSB5b3UgYXJlIHVzaW5nLlxuICogXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGUgdmlldyBjb21wb25lbnRcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbk1lZGlhdG9yLnByb3RvdHlwZS5zZXRWaWV3Q29tcG9uZW50PSBmdW5jdGlvbiAodmlld0NvbXBvbmVudClcbntcbiAgICB0aGlzLnZpZXdDb21wb25lbnQ9IHZpZXdDb21wb25lbnQ7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgTWVkaWF0b3JzIHZpZXcgY29tcG9uZW50LlxuICogXG4gKiBBZGRpdGlvbmFsbHksIGFuIG9wdGlvbmFsIGV4cGxpY2l0IGdldHRlciBjYW4gYmVcbiAqIGJlIGRlZmluZWQgaW4gdGhlIHN1YmNsYXNzIHRoYXQgZGVmaW5lcyB0aGUgXG4gKiB2aWV3IGNvbXBvbmVudHMsIHByb3ZpZGluZyBhIG1vcmUgc2VtYW50aWMgaW50ZXJmYWNlXG4gKiB0byB0aGUgTWVkaWF0b3IuXG4gKiBcbiAqIFRoaXMgaXMgZGlmZmVyZW50IGZyb20gdGhlIEFTMyBpbXBsZW1lbnRhdGlvbiBpblxuICogdGhlIHNlbnNlIHRoYXQgbm8gY2FzdGluZyBpcyByZXF1aXJlZCBmcm9tIHRoZVxuICogb2JqZWN0IHN1cHBsaWVkIGFzIHRoZSB2aWV3IGNvbXBvbmVudC5cbiAqIFxuICogICAgIE15TWVkaWF0b3IucHJvdG90eXBlLmdldENvbWJvQm94PSBmdW5jdGlvbiAoKVxuICogICAgIHtcbiAqICAgICAgICAgcmV0dXJuIHRoaXMudmlld0NvbXBvbmVudDsgIFxuICogICAgIH1cbiAqIFxuICogQHJldHVybiB7T2JqZWN0fVxuICogIFRoZSB2aWV3IGNvbXBvbmVudFxuICovXG5NZWRpYXRvci5wcm90b3R5cGUuZ2V0Vmlld0NvbXBvbmVudD0gZnVuY3Rpb24gKClcbntcbiAgICByZXR1cm4gdGhpcy52aWV3Q29tcG9uZW50O1xufTtcblxuLyoqXG4gKiBMaXN0IHRoZSBOb3RpZmljYXRpb24gbmFtZXMgdGhpcyBNZWRpYXRvciBpcyBpbnRlcmVzdGVkXG4gKiBpbiBiZWluZyBub3RpZmllZCBvZi5cbiAqIFxuICogQHJldHVybiB7QXJyYXl9IFxuICogIFRoZSBsaXN0IG9mIE5vdGlmaWNhdGlvbiBuYW1lcy5cbiAqL1xuTWVkaWF0b3IucHJvdG90eXBlLmxpc3ROb3RpZmljYXRpb25JbnRlcmVzdHM9IGZ1bmN0aW9uICgpXG57XG4gICAgcmV0dXJuIFtdO1xufTtcblxuLyoqXG4gKiBIYW5kbGUgTm90aWZpY2F0aW9ucy5cbiAqIFxuICogVHlwaWNhbGx5IHRoaXMgd2lsbCBiZSBoYW5kbGVkIGluIGEgc3dpdGNoIHN0YXRlbWVudFxuICogd2l0aCBvbmUgJ2Nhc2UnIGVudHJ5IHBlciBOb3RpZmljYXRpb24gdGhlIE1lZGlhdG9yXG4gKiBpcyBpbnRlcmVzdGVkIGluXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5Ob3RpZmljYXRpb259IG5vdGlmaWNhdGlvblxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuTWVkaWF0b3IucHJvdG90eXBlLmhhbmRsZU5vdGlmaWNhdGlvbj0gZnVuY3Rpb24gKG5vdGlmaWNhdGlvbilcbntcbiAgICByZXR1cm47XG59O1xuXG4vKipcbiAqIENhbGxlZCBieSB0aGUgVmlldyB3aGVuIHRoZSBNZWRpYXRvciBpcyByZWdpc3RlcmVkXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5NZWRpYXRvci5wcm90b3R5cGUub25SZWdpc3Rlcj0gZnVuY3Rpb24gKClcbntcbiAgICByZXR1cm47XG59O1xuXG4vKipcbiAqIENhbGxlZCBieSB0aGUgVmlldyB3aGVuIHRoZSBNZWRpYXRvciBpcyByZW1vdmVkXG4gKi9cbk1lZGlhdG9yLnByb3RvdHlwZS5vblJlbW92ZT0gZnVuY3Rpb24gKClcbntcbiAgICByZXR1cm47XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBNZWRpYXRvcnMgbmFtZS4gU2hvdWxkIG9ubHkgYmUgYWNjZXNzZWQgYnkgTWVkaWF0b3Igc3ViY2xhc3Nlcy5cbiAqIFxuICogQHByb3RlY3RlZFxuICogQHR5cGUgc3RyaW5nXG4gKi9cbk1lZGlhdG9yLnByb3RvdHlwZS5tZWRpYXRvck5hbWU9IG51bGw7XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIE1lZGlhdG9ycyB2aWV3Q29tcG9uZW50LiBTaG91bGQgb25seSBiZSBhY2Nlc3NlZCBieSBNZWRpYXRvciBzdWJjbGFzc2VzLlxuICogXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBPYmplY3RcbiAqL1xuTWVkaWF0b3IucHJvdG90eXBlLnZpZXdDb21wb25lbnQ9bnVsbDtcbi8qKlxuICogQGF1dGhvciBQdXJlTVZDIEpTIE5hdGl2ZSBQb3J0IGJ5IERhdmlkIEZvbGV5LCBGcsOpZMOpcmljIFNhdW5pZXIsICYgQWxhaW4gRHVjaGVzbmVhdSBcbiAqIEBhdXRob3IgQ29weXJpZ2h0KGMpIDIwMDYtMjAxMiBGdXR1cmVzY2FsZSwgSW5jLiwgU29tZSByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIEBjbGFzcyBwdXJlbXZjLlByb3h5XG4gKiBAZXh0ZW5kcyBwdXJlbXZjLk5vdGlmaWVyXG4gKlxuICogQSBiYXNlIFByb3h5IGltcGxlbWVudGF0aW9uLiBcbiAqIFxuICogSW4gUHVyZU1WQywgUHJveHkgY2xhc3NlcyBhcmUgdXNlZCB0byBtYW5hZ2UgcGFydHMgb2YgdGhlIGFwcGxpY2F0aW9uJ3MgZGF0YSBcbiAqIG1vZGVsLlxuICogXG4gKiBBIFByb3h5IG1pZ2h0IHNpbXBseSBtYW5hZ2UgYSByZWZlcmVuY2UgdG8gYSBsb2NhbCBkYXRhIG9iamVjdCwgaW4gd2hpY2ggY2FzZSBcbiAqIGludGVyYWN0aW5nIHdpdGggaXQgbWlnaHQgaW52b2x2ZSBzZXR0aW5nIGFuZCBnZXR0aW5nIG9mIGl0cyBkYXRhIGluIFxuICogc3luY2hyb25vdXMgZmFzaGlvbi5cbiAqIFxuICogUHJveHkgY2xhc3NlcyBhcmUgYWxzbyB1c2VkIHRvIGVuY2Fwc3VsYXRlIHRoZSBhcHBsaWNhdGlvbidzIGludGVyYWN0aW9uIHdpdGggXG4gKiByZW1vdGUgc2VydmljZXMgdG8gc2F2ZSBvciByZXRyaWV2ZSBkYXRhLCBpbiB3aGljaCBjYXNlLCB3ZSBhZG9wdCBhbiBcbiAqIGFzeW5jcm9ub3VzIGlkaW9tOyBzZXR0aW5nIGRhdGEgKG9yIGNhbGxpbmcgYSBtZXRob2QpIG9uIHRoZSBQcm94eSBhbmQgXG4gKiBsaXN0ZW5pbmcgZm9yIGEgXG4gKiB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufSBcbiAqIHRvIGJlIHNlbnQgIHdoZW4gdGhlIFByb3h5IGhhcyByZXRyaWV2ZWQgdGhlIGRhdGEgZnJvbSB0aGUgc2VydmljZS4gXG4gKiBcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IFtwcm94eU5hbWVdXG4gKiAgVGhlIFByb3h5J3MgbmFtZS4gSWYgbm9uZSBpcyBwcm92aWRlZCwgdGhlIFByb3h5IHdpbGwgdXNlIGl0cyBjb25zdHJ1Y3RvcnNcbiAqICBOQU1FIHByb3BlcnR5LlxuICogQHBhcmFtIHtPYmplY3R9IFtkYXRhXVxuICogIFRoZSBQcm94eSdzIGRhdGEgb2JqZWN0XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gUHJveHkocHJveHlOYW1lLCBkYXRhKVxue1xuICAgIHRoaXMucHJveHlOYW1lPSBwcm94eU5hbWUgfHwgdGhpcy5jb25zdHJ1Y3Rvci5OQU1FO1xuICAgIGlmKGRhdGEgIT0gbnVsbClcbiAgICB7XG4gICAgICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcbiAgICB9XG59O1xuXG5cblByb3h5Lk5BTUU9IFwiUHJveHlcIjtcblxuUHJveHkucHJvdG90eXBlPSBuZXcgTm90aWZpZXI7XG5Qcm94eS5wcm90b3R5cGUuY29uc3RydWN0b3I9IFByb3h5O1xuXG4vKipcbiAqIEdldCB0aGUgUHJveHkncyBuYW1lLlxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuUHJveHkucHJvdG90eXBlLmdldFByb3h5TmFtZT0gZnVuY3Rpb24oKVxue1xuICAgIHJldHVybiB0aGlzLnByb3h5TmFtZTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBQcm94eSdzIGRhdGEgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cblByb3h5LnByb3RvdHlwZS5zZXREYXRhPSBmdW5jdGlvbihkYXRhKVxue1xuICAgIHRoaXMuZGF0YT0gZGF0YTtcbn07XG5cbi8qKlxuICogR2V0IHRoZSBQcm94eSdzIGRhdGEgb2JqZWN0XG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5Qcm94eS5wcm90b3R5cGUuZ2V0RGF0YT0gZnVuY3Rpb24oKVxue1xuICAgIHJldHVybiB0aGlzLmRhdGE7XG59O1xuXG4vKipcbiAqIENhbGxlZCBieSB0aGUge0BsaW5rIHB1cmVtdmMuTW9kZWwgTW9kZWx9IHdoZW5cbiAqIHRoZSBQcm94eSBpcyByZWdpc3RlcmVkLlxuICpcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cblByb3h5LnByb3RvdHlwZS5vblJlZ2lzdGVyPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuO1xufTtcblxuLyoqXG4gKiBDYWxsZWQgYnkgdGhlIHtAbGluayBwdXJlbXZjLk1vZGVsIE1vZGVsfSB3aGVuXG4gKiB0aGUgUHJveHkgaXMgcmVtb3ZlZC5cbiAqIFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuUHJveHkucHJvdG90eXBlLm9uUmVtb3ZlPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuO1xufTtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgUHJveHlzIG5hbWUuXG4gKlxuICogQHByb3RlY3RlZFxuICogQHR5cGUgU3RyaW5nXG4gKi9cblByb3h5LnByb3RvdHlwZS5wcm94eU5hbWU9IG51bGw7XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIFByb3h5J3MgZGF0YSBvYmplY3QuXG4gKlxuICogQHByb3RlY3RlZFxuICogQHR5cGUgT2JqZWN0XG4gKi9cblByb3h5LnByb3RvdHlwZS5kYXRhPSBudWxsO1xuLyoqXG4gKiBAYXV0aG9yIFB1cmVNVkMgSlMgTmF0aXZlIFBvcnQgYnkgRGF2aWQgRm9sZXksIEZyw6lkw6lyaWMgU2F1bmllciwgJiBBbGFpbiBEdWNoZXNuZWF1IFxuICogQGF1dGhvciBDb3B5cmlnaHQoYykgMjAwNi0yMDEyIEZ1dHVyZXNjYWxlLCBJbmMuLCBTb21lIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogQGNsYXNzIHB1cmVtdmMuRmFjYWRlXG4gKiBGYWNhZGUgZXhwb3NlcyB0aGUgZnVuY3Rpb25hbGl0eSBvZiB0aGUgQ29udHJvbGxlciwgTW9kZWwgYW5kIFZpZXdcbiAqIGFjdG9ycyB0byBjbGllbnQgZmFjaW5nIGNvZGUuIFxuICogXG4gKiBUaGlzIEZhY2FkZSBpbXBsZW1lbnRhdGlvbiBpcyBhIE11bHRpdG9uLCBzbyB5b3Ugc2hvdWxkIG5vdCBjYWxsIHRoZSBcbiAqIGNvbnN0cnVjdG9yIGRpcmVjdGx5LCBidXQgaW5zdGVhZCBjYWxsIHRoZSBzdGF0aWMgRmFjdG9yeSBtZXRob2QsIFxuICogcGFzc2luZyB0aGUgdW5pcXVlIGtleSBmb3IgdGhpcyBpbnN0YW5jZSB0byAjZ2V0SW5zdGFuY2VcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIFx0VGhlIG11bHRpdG9uIGtleSB0byB1c2UgdG8gcmV0cmlldmUgdGhlIEZhY2FkZSBpbnN0YW5jZS5cbiAqIEB0aHJvd3Mge0Vycm9yfSBcbiAqICBJZiBhbiBhdHRlbXB0IGlzIG1hZGUgdG8gaW5zdGFudGlhdGUgRmFjYWRlIGRpcmVjdGx5XG4gKi9cbmZ1bmN0aW9uIEZhY2FkZShrZXkpXG57XG4gICAgaWYoRmFjYWRlLmluc3RhbmNlTWFwW2tleV0gIT0gbnVsbClcbiAgICB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihGYWNhZGUuTVVMVElUT05fTVNHKTtcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWxpemVOb3RpZmllcihrZXkpO1xuICAgIEZhY2FkZS5pbnN0YW5jZU1hcFtrZXldID0gdGhpcztcbiAgICB0aGlzLmluaXRpYWxpemVGYWNhZGUoKTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgTXVsdGl0b24gRmFjYWRlIGluc3RhbmNlLlxuICogXG4gKiBDYWxsZWQgYXV0b21hdGljYWxseSBieSB0aGUgY29uc3RydWN0b3IuIE92ZXJyaWRlIGluIHlvdXIgc3ViY2xhc3MgdG8gYW55XG4gKiBzdWJjbGFzcyBzcGVjaWZpYyBpbml0aWFsaXphdGlvbnMuIEJlIHN1cmUgdG8gY2FsbCB0aGUgJ3N1cGVyJyBcbiAqIGluaXRpYWxpemVGYWNhZGUgbWV0aG9kLCB0aG91Z2hcbiAqIFxuICogICAgIE15RmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplRmFjYWRlPSBmdW5jdGlvbiAoKVxuICogICAgIHtcbiAqICAgICAgICAgRmFjYWRlLmNhbGwodGhpcyk7XG4gKiAgICAgfTtcbiAqIEBwcm90ZWN0ZWRcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZUZhY2FkZSA9IGZ1bmN0aW9uKClcbntcbiAgICB0aGlzLmluaXRpYWxpemVNb2RlbCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRyb2xsZXIoKTtcbiAgICB0aGlzLmluaXRpYWxpemVWaWV3KCk7XG59O1xuXG4vKipcbiAqIEZhY2FkZSBNdWx0aXRvbiBGYWN0b3J5IG1ldGhvZC4gXG4gKiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gbnVsbCBpZiBzdXBwbGllZCBhXG4gKiBudWxsIG9yIHVuZGVmaW5lZCBtdWx0aXRvbiBrZXkuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIFx0VGhlIG11bHRpdG9uIGtleSB1c2UgdG8gcmV0cmlldmUgYSBwYXJ0aWN1bGFyIEZhY2FkZSBpbnN0YW5jZVxuICogQHJldHVybiB7cHVyZW12Yy5GYWNhZGV9XG4gKi9cbkZhY2FkZS5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uKGtleSlcbntcblx0aWYgKG51bGwgPT0ga2V5KVxuXHRcdHJldHVybiBudWxsO1xuXHRcdFxuICAgIGlmKEZhY2FkZS5pbnN0YW5jZU1hcFtrZXldID09IG51bGwpXG4gICAge1xuICAgICAgICBGYWNhZGUuaW5zdGFuY2VNYXBba2V5XSA9IG5ldyBGYWNhZGUoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gRmFjYWRlLmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIHtAbGluayBwdXJlbXZjLkNvbnRyb2xsZXIgQ29udHJvbGxlcn0uXG4gKiBcbiAqIENhbGxlZCBieSB0aGUgI2luaXRpYWxpemVGYWNhZGUgbWV0aG9kLlxuICogXG4gKiBPdmVycmlkZSB0aGlzIG1ldGhvZCBpbiB5b3VyIHN1YmNsYXNzIG9mIEZhY2FkZVxuICogaWYgb25lIG9yIGJvdGggb2YgdGhlIGZvbGxvd2luZyBhcmUgdHJ1ZTpcblxuICogLSBZb3Ugd2lzaCB0byBpbml0aWFsaXplIGEgZGlmZmVyZW50IENvbnRyb2xsZXJcbiAqIC0gWW91IGhhdmUgXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9c1xuICogb3Ige0BsaW5rIHB1cmVtdmMuTWFjcm9Db21tYW5kIE1hY3JvQ29tbWFuZH1zXG4gKiB0byByZWdpc3RlciB3aXRoIHRoZSBDb250cm9sbGVyYXQgc3RhcnR1cC4gICBcbiAqIFxuICogSWYgeW91IGRvbid0IHdhbnQgdG8gaW5pdGlhbGl6ZSBhIGRpZmZlcmVudCBDb250cm9sbGVyLCBcbiAqIGNhbGwgdGhlICdzdXBlcicgaW5pdGlhbGl6ZUNvbnRyb2xsZSBtZXRob2QgYXQgdGhlIGJlZ2lubmluZyBvZiB5b3VyXG4gKiBtZXRob2QsIHRoZW4gcmVnaXN0ZXIgY29tbWFuZHMuXG4gKiBcbiAqICAgICBNeUZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZUNvbnRyb2xsZXI9IGZ1bmN0aW9uICgpXG4gKiAgICAge1xuICogICAgICAgICBGYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gKiAgICAgICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kKEFwcENvbnN0YW50cy5BX05PVEVfTkFNRSwgQUJlc3Bva2VDb21tYW5kKVxuICogICAgIH1cbiAqIFxuICogQHByb3RlY3RlZFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplQ29udHJvbGxlciA9IGZ1bmN0aW9uKClcbntcbiAgICBpZih0aGlzLmNvbnRyb2xsZXIgIT0gbnVsbClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgdGhpcy5jb250cm9sbGVyID0gQ29udHJvbGxlci5nZXRJbnN0YW5jZSh0aGlzLm11bHRpdG9uS2V5KTtcbn07XG5cbi8qKlxuICogQHByb3RlY3RlZFxuICogSW5pdGlhbGl6ZSB0aGUge0BsaW5rIHB1cmVtdmMuTW9kZWwgTW9kZWx9O1xuICogXG4gKiBDYWxsZWQgYnkgdGhlICNpbml0aWFsaXplRmFjYWRlIG1ldGhvZC5cbiAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIGluIHlvdXIgc3ViY2xhc3Mgb2YgRmFjYWRlIGlmIG9uZSBvZiB0aGUgZm9sbG93aW5nIGFyZVxuICogdHJ1ZTpcbiAqIFxuICogLSBZb3Ugd2lzaCB0byBpbml0aWFsaXplIGEgZGlmZmVyZW50IE1vZGVsLlxuICogXG4gKiAtIFlvdSBoYXZlIHtAbGluayBwdXJlbXZjLlByb3h5IFByb3h5fXMgdG8gXG4gKiAgIHJlZ2lzdGVyIHdpdGggdGhlIE1vZGVsIHRoYXQgZG8gbm90IHJldHJpZXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBGYWNhZGUgYXQgXG4gKiAgIGNvbnN0cnVjdGlvbiB0aW1lLlxuICogXG4gKiBJZiB5b3UgZG9uJ3Qgd2FudCB0byBpbml0aWFsaXplIGEgZGlmZmVyZW50IE1vZGVsXG4gKiBjYWxsICdzdXBlcicgI2luaXRpYWxpemVNb2RlbCBhdCB0aGUgYmVnaW5uaW5nIG9mIHlvdXIgbWV0aG9kLCB0aGVuIHJlZ2lzdGVyIFxuICogUHJveHlzLlxuICogXG4gKiBOb3RlOiBUaGlzIG1ldGhvZCBpcyAqcmFyZWx5KiBvdmVycmlkZGVuOyBpbiBwcmFjdGljZSB5b3UgYXJlIG1vcmVcbiAqIGxpa2VseSB0byB1c2UgYSBjb21tYW5kIHRvIGNyZWF0ZSBhbmQgcmVnaXN0ZXJQcm94eXMgd2l0aCB0aGUgTW9kZWw+LCBcbiAqIHNpbmNlIFByb3h5cyB3aXRoIG11dGFibGUgZGF0YSB3aWxsIGxpa2VseVxuICogbmVlZCB0byBzZW5kIE5vdGlmaWNhdGlvbnMgYW5kIHRodXMgd2lsbCBsaWtlbHkgd2FudCB0byBmZXRjaCBhIHJlZmVyZW5jZSB0byBcbiAqIHRoZSBGYWNhZGUgZHVyaW5nIHRoZWlyIGNvbnN0cnVjdGlvbi4gXG4gKiBcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZU1vZGVsID0gZnVuY3Rpb24oKVxue1xuICAgIGlmKHRoaXMubW9kZWwgIT0gbnVsbClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgdGhpcy5tb2RlbCA9IE1vZGVsLmdldEluc3RhbmNlKHRoaXMubXVsdGl0b25LZXkpO1xufTtcblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBcbiAqIEluaXRpYWxpemUgdGhlIHtAbGluayBwdXJlbXZjLlZpZXcgVmlld30uXG4gKiBcbiAqIENhbGxlZCBieSB0aGUgI2luaXRpYWxpemVGYWNhZGUgbWV0aG9kLlxuICogXG4gKiBPdmVycmlkZSB0aGlzIG1ldGhvZCBpbiB5b3VyIHN1YmNsYXNzIG9mIEZhY2FkZSBpZiBvbmUgb3IgYm90aCBvZiB0aGUgXG4gKiBmb2xsb3dpbmcgYXJlIHRydWU6XG4gKlxuICogLSBZb3Ugd2lzaCB0byBpbml0aWFsaXplIGEgZGlmZmVyZW50IFZpZXcuXG4gKiAtIFlvdSBoYXZlIE9ic2VydmVycyB0byByZWdpc3RlciB3aXRoIHRoZSBWaWV3XG4gKiBcbiAqIElmIHlvdSBkb24ndCB3YW50IHRvIGluaXRpYWxpemUgYSBkaWZmZXJlbnQgVmlldyBcbiAqIGNhbGwgJ3N1cGVyJyAjaW5pdGlhbGl6ZVZpZXcgYXQgdGhlIGJlZ2lubmluZyBvZiB5b3VyXG4gKiBtZXRob2QsIHRoZW4gcmVnaXN0ZXIgTWVkaWF0b3IgaW5zdGFuY2VzLlxuICogXG4gKiAgICAgTXlGYWNhZGUucHJvdG90eXBlLmluaXRpYWxpemVWaWV3PSBmdW5jdGlvbiAoKVxuICogICAgIHtcbiAqICAgICAgICAgRmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplVmlldy5jYWxsKHRoaXMpO1xuICogICAgICAgICB0aGlzLnJlZ2lzdGVyTWVkaWF0b3IobmV3IE15TWVkaWF0b3IoKSk7XG4gKiAgICAgfTtcbiAqIFxuICogTm90ZTogVGhpcyBtZXRob2QgaXMgKnJhcmVseSogb3ZlcnJpZGRlbjsgaW4gcHJhY3RpY2UgeW91IGFyZSBtb3JlXG4gKiBsaWtlbHkgdG8gdXNlIGEgY29tbWFuZCB0byBjcmVhdGUgYW5kIHJlZ2lzdGVyIE1lZGlhdG9yc1xuICogd2l0aCB0aGUgVmlldywgc2luY2UgTWVkaWF0b3IgaW5zdGFuY2VzIHdpbGwgbmVlZCB0byBzZW5kIFxuICogTm90aWZpY2F0aW9ucyBhbmQgdGh1cyB3aWxsIGxpa2VseSB3YW50IHRvIGZldGNoIGEgcmVmZXJlbmNlIFxuICogdG8gdGhlIEZhY2FkZSBkdXJpbmcgdGhlaXIgY29uc3RydWN0aW9uLiBcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUuaW5pdGlhbGl6ZVZpZXcgPSBmdW5jdGlvbigpXG57XG4gICAgaWYodGhpcy52aWV3ICE9IG51bGwpXG4gICAgICAgIHJldHVybjtcblxuICAgIHRoaXMudmlldyA9IFZpZXcuZ2V0SW5zdGFuY2UodGhpcy5tdWx0aXRvbktleSk7XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgY29tbWFuZCB3aXRoIHRoZSBDb250cm9sbGVyIGJ5IE5vdGlmaWNhdGlvbiBuYW1lXG4gKiBAcGFyYW0ge3N0cmluZ30gbm90aWZpY2F0aW9uTmFtZVxuICogIFRoZSBuYW1lIG9mIHRoZSBOb3RpZmljYXRpb24gdG8gYXNzb2NpYXRlIHRoZSBjb21tYW5kIHdpdGhcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbW1hbmRDbGFzc1JlZlxuICogIEEgcmVmZXJlbmNlIG90IHRoZSBjb21tYW5kcyBjb25zdHJ1Y3Rvci5cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUucmVnaXN0ZXJDb21tYW5kID0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSwgY29tbWFuZENsYXNzUmVmKVxue1xuICAgIHRoaXMuY29udHJvbGxlci5yZWdpc3RlckNvbW1hbmQobm90aWZpY2F0aW9uTmFtZSwgY29tbWFuZENsYXNzUmVmKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIGNvbW1hbmQgdG8gTm90aWZpY2F0aW9uIG1hcHBpbmcgZnJvbSB0aGVcbiAqIHtAbGluayBwdXJlbXZjLkNvbnRyb2xsZXIjcmVtb3ZlQ29tbWFuZCBDb250cm9sbGVyfVxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICBUaGUgbmFtZSBvZiB0aGUgdGhlIE5vdGlmaWNhdGlvbiB0byByZW1vdmUgZnJvbSB0aGUgY29tbWFuZCBtYXBwaW5nIGZvci5cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUucmVtb3ZlQ29tbWFuZCA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbk5hbWUpXG57XG4gICAgdGhpcy5jb250cm9sbGVyLnJlbW92ZUNvbW1hbmQobm90aWZpY2F0aW9uTmFtZSk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGEgY29tbWFuZCBpcyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIG5vdGlmaWNhdGlvbi5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICBBIE5vdGlmaWNhdGlvbiBuYW1lXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICogIFdoZXRoZXIgYSBjb21tYW4gaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQgZm9yIHRoZSBnaXZlbiBub3RpZmljYXRpb25OYW1lXG4gKi9cbkZhY2FkZS5wcm90b3R5cGUuaGFzQ29tbWFuZCA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbk5hbWUpXG57XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci5oYXNDb21tYW5kKG5vdGlmaWNhdGlvbk5hbWUpO1xufTtcblxuLyoqXG4gKiBSZWdpc3RlciBhIFByb3h5IHdpdGggdGhlIHtAbGluayBwdXJlbXZjLk1vZGVsI3JlZ2lzdGVyUHJveHkgTW9kZWx9XG4gKiBieSBuYW1lLlxuICogXG4gKiBAcGFyYW0ge3B1cmVtdmMuUHJveHl9IHByb3h5XG4gKiAgVGhlIFByb3h5IGluc3RhbmNlIHRvIGJlIHJlZ2lzdGVyZWQgd2l0aCB0aGUgTW9kZWwuXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLnJlZ2lzdGVyUHJveHkgPSBmdW5jdGlvbihwcm94eSlcbntcbiAgICB0aGlzLm1vZGVsLnJlZ2lzdGVyUHJveHkocHJveHkpO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSBhIFByb3h5IGZyb20gdGhlIE1vZGVsXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm94eU5hbWVcbiAqIEByZXR1cm4ge3B1cmVtdmMuUHJveHl9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUucmV0cmlldmVQcm94eSA9IGZ1bmN0aW9uKHByb3h5TmFtZSlcbntcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5yZXRyaWV2ZVByb3h5KHByb3h5TmFtZSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhIFByb3h5IGZyb20gdGhlIE1vZGVsIGJ5IG5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm94eU5hbWVcbiAqICBUaGUgbmFtZSBvZiB0aGUgUHJveHlcbiAqIEByZXR1cm4ge3B1cmVtdmMuUHJveHl9XG4gKiAgVGhlIFByb3h5IHRoYXQgd2FzIHJlbW92ZWQgZnJvbSB0aGUgTW9kZWxcbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5yZW1vdmVQcm94eSA9IGZ1bmN0aW9uKHByb3h5TmFtZSlcbntcbiAgICB2YXIgcHJveHkgPSBudWxsO1xuICAgIGlmKHRoaXMubW9kZWwgIT0gbnVsbClcbiAgICB7XG4gICAgICAgIHByb3h5ID0gdGhpcy5tb2RlbC5yZW1vdmVQcm94eShwcm94eU5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm94eTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaXQgYSBQcm94eSBpcyByZWdpc3RlcmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IHByb3h5TmFtZVxuICogIEEgUHJveHkgbmFtZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqICBXaGV0aGVyIGEgUHJveHkgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ2l2ZW4gcHJveHlOYW1lXG4gKi9cbkZhY2FkZS5wcm90b3R5cGUuaGFzUHJveHkgPSBmdW5jdGlvbihwcm94eU5hbWUpXG57XG4gICAgcmV0dXJuIHRoaXMubW9kZWwuaGFzUHJveHkocHJveHlOYW1lKTtcbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBNZWRpYXRvciB3aXRoIHdpdGggdGhlIFZpZXcuXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5NZWRpYXRvcn0gbWVkaWF0b3JcbiAqICBBIHJlZmVyZW5jZSB0byB0aGUgTWVkaWF0b3IgdG8gcmVnaXN0ZXJcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkZhY2FkZS5wcm90b3R5cGUucmVnaXN0ZXJNZWRpYXRvciA9IGZ1bmN0aW9uKG1lZGlhdG9yKVxue1xuICAgIGlmKHRoaXMudmlldyAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhpcy52aWV3LnJlZ2lzdGVyTWVkaWF0b3IobWVkaWF0b3IpO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmV0cmlldmUgYSBNZWRpYXRvciBmcm9tIHRoZSBWaWV3IGJ5IG5hbWVcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG1lZGlhdG9yTmFtZVxuICogIFRoZSBNZWRpYXRvcnMgbmFtZVxuICogQHJldHVybiB7cHVyZW12Yy5NZWRpYXRvcn1cbiAqICBUaGUgcmV0cmlldmVkIE1lZGlhdG9yXG4gKi9cbkZhY2FkZS5wcm90b3R5cGUucmV0cmlldmVNZWRpYXRvciA9IGZ1bmN0aW9uKG1lZGlhdG9yTmFtZSlcbntcbiAgICByZXR1cm4gdGhpcy52aWV3LnJldHJpZXZlTWVkaWF0b3IobWVkaWF0b3JOYW1lKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgTWVkaWF0b3IgZnJvbSB0aGUgVmlldy5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG1lZGlhdG9yTmFtZVxuICogIFRoZSBuYW1lIG9mIHRoZSBNZWRpYXRvciB0byByZW1vdmUuXG4gKiBAcmV0dXJuIHtwdXJlbXZjLk1lZGlhdG9yfVxuICogIFRoZSByZW1vdmVkIE1lZGlhdG9yXG4gKi9cbkZhY2FkZS5wcm90b3R5cGUucmVtb3ZlTWVkaWF0b3IgPSBmdW5jdGlvbihtZWRpYXRvck5hbWUpXG57XG4gICAgdmFyIG1lZGlhdG9yID0gbnVsbDtcbiAgICBpZih0aGlzLnZpZXcgIT0gbnVsbClcbiAgICB7XG4gICAgICAgIG1lZGlhdG9yID0gdGhpcy52aWV3LnJlbW92ZU1lZGlhdG9yKG1lZGlhdG9yTmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lZGlhdG9yO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBhIE1lZGlhdG9yIGlzIHJlZ2lzdGVyZWQgb3Igbm90LlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVkaWF0b3JOYW1lXG4gKiAgQSBNZWRpYXRvciBuYW1lXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICogIFdoZXRoZXIgYSBNZWRpYXRvciBpcyByZWdpc3RlcmVkIHdpdGggdGhlIGdpdmVuIG1lZGlhdG9yTmFtZVxuICovXG5GYWNhZGUucHJvdG90eXBlLmhhc01lZGlhdG9yID0gZnVuY3Rpb24obWVkaWF0b3JOYW1lKVxue1xuICAgIHJldHVybiB0aGlzLnZpZXcuaGFzTWVkaWF0b3IobWVkaWF0b3JOYW1lKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGFuZCBzZW5kIGEgXG4gKiB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufVxuICogXG4gKiBLZWVwcyB1cyBmcm9tIGhhdmluZyB0byBjb25zdHJ1Y3QgbmV3IE5vdGlmaWNhdGlvbiBpbnN0YW5jZXMgaW4gb3VyXG4gKiBpbXBsZW1lbnRhdGlvblxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gbm90aWZpY2F0aW9uTmFtZVxuICogIFRoZSBuYW1lIG9mIHRoZSBOb3RpZmljYXRpb24gdG8gc2VuZFxuICogQHBhcmFtIHtPYmplY3R9IFtib2R5XVxuICogIFRoZSBib2R5IG9mIHRoZSBub3RpZmljYXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV1cbiAqICBUaGUgdHlwZSBvZiB0aGUgbm90aWZpY2F0aW9uXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5GYWNhZGUucHJvdG90eXBlLnNlbmROb3RpZmljYXRpb24gPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lLCBib2R5LCB0eXBlKVxue1xuICAgIHRoaXMubm90aWZ5T2JzZXJ2ZXJzKG5ldyBOb3RpZmljYXRpb24obm90aWZpY2F0aW9uTmFtZSwgYm9keSwgdHlwZSkpO1xufTtcblxuLyoqXG4gKiBOb3RpZnkge0BsaW5rIHB1cmVtdmMuT2JzZXJ2ZXIgT2JzZXJ2ZXJ9c1xuICogXG4gKiBUaGlzIG1ldGhvZCBpcyBsZWZ0IHB1YmxpYyBtb3N0bHkgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIGFuZCB0byBhbGxvd1xuICogeW91IHRvIHNlbmQgY3VzdG9tIG5vdGlmaWNhdGlvbiBjbGFzc2VzIHVzaW5nIHRoZSBmYWNhZGUuXG4gKiBcbiAqIFVzdWFsbHkgeW91IHNob3VsZCBqdXN0IGNhbGwgc2VuZE5vdGlmaWNhdGlvbiBhbmQgcGFzcyB0aGUgcGFyYW1ldGVycywgbmV2ZXIgXG4gKiBoYXZpbmcgdG8gY29uc3RydWN0IHRoZSBub3RpZmljYXRpb24geW91cnNlbGYuXG4gKiBcbiAqIEBwYXJhbSB7cHVyZW12Yy5Ob3RpZmljYXRpb259IG5vdGlmaWNhdGlvblxuICogIFRoZSBOb3RpZmljYXRpb24gdG8gc2VuZFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5ub3RpZnlPYnNlcnZlcnMgPSBmdW5jdGlvbihub3RpZmljYXRpb24pXG57XG4gICAgaWYodGhpcy52aWV3ICE9IG51bGwpXG4gICAge1xuICAgICAgICB0aGlzLnZpZXcubm90aWZ5T2JzZXJ2ZXJzKG5vdGlmaWNhdGlvbik7XG4gICAgfVxufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBGYWNhZGVzIE5vdGlmaWVyIGNhcGFiaWxpdGllcyBieSBzZXR0aW5nIHRoZSBNdWx0aXRvbiBrZXkgZm9yIFxuICogdGhpcyBmYWNhZGUgaW5zdGFuY2UuXG4gKiBcbiAqIE5vdCBjYWxsZWQgZGlyZWN0bHksIGJ1dCBpbnN0ZWFkIGZyb20gdGhlIGNvbnN0cnVjdG9yIHdoZW4gI2dldEluc3RhbmNlIGlzIFxuICogaW52b2tlZC4gSXQgaXMgbmVjZXNzYXJ5IHRvIGJlIHB1YmxpYyBpbiBvcmRlciB0byBpbXBsZW1lbnQgTm90aWZpZXJcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5pbml0aWFsaXplTm90aWZpZXIgPSBmdW5jdGlvbihrZXkpXG57XG4gICAgdGhpcy5tdWx0aXRvbktleSA9IGtleTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYSAqQ29yZSogaXMgcmVnaXN0ZXJlZCBvciBub3RcbiAqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiAgVGhlIG11bHRpdG9uIGtleSBmb3IgdGhlICpDb3JlKiBpbiBxdWVzdGlvblxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqICBXaGV0aGVyIGEgKkNvcmUqIGlzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ2l2ZW4ga2V5XG4gKi9cbkZhY2FkZS5oYXNDb3JlID0gZnVuY3Rpb24oa2V5KVxue1xuICAgIHJldHVybiBGYWNhZGUuaW5zdGFuY2VNYXBba2V5XSAhPSBudWxsO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYSAqQ29yZSogXG4gKiBcbiAqIFJlbW92ZSB0aGUgTW9kZWwsIFZpZXcsIENvbnRyb2xsZXIgYW5kIEZhY2FkZSBmb3IgYSBnaXZlbiBrZXkuXG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuRmFjYWRlLnJlbW92ZUNvcmUgPSBmdW5jdGlvbihrZXkpXG57XG4gICAgaWYoRmFjYWRlLmluc3RhbmNlTWFwW2tleV0gPT0gbnVsbClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgTW9kZWwucmVtb3ZlTW9kZWwoa2V5KTtcbiAgICBWaWV3LnJlbW92ZVZpZXcoa2V5KTtcbiAgICBDb250cm9sbGVyLnJlbW92ZUNvbnRyb2xsZXIoa2V5KTtcbiAgICBkZWxldGUgRmFjYWRlLmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBGYWNhZGVzIGNvcnJlc3BvbmRpbmcgQ29udHJvbGxlclxuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHB1cmVtdmMuQ29udHJvbGxlclxuICovXG5GYWNhZGUucHJvdG90eXBlLmNvbnRyb2xsZXIgPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBGYWNhZGVzIGNvcnJlc3BvbmRpbmcgTW9kZWwgaW5zdGFuY2VcbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBwdXJlbXZjLk1vZGVsXG4gKi9cbkZhY2FkZS5wcm90b3R5cGUubW9kZWwgPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBGYWNhZGVzIGNvcnJlc3BuZGluZyBWaWV3IGluc3RhbmNlLlxuICpcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHB1cmVtdmMuVmlld1xuICovXG5GYWNhZGUucHJvdG90eXBlLnZpZXcgPSBudWxsO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBGYWNhZGVzIG11bHRpdG9uIGtleS5cbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBzdHJpbmdcbiAqL1xuRmFjYWRlLnByb3RvdHlwZS5tdWx0aXRvbktleSA9IG51bGw7XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIE11bHRpdG9uIEZhY2FkZSBpbnN0YW5jZSBtYXAuXG4gKiBAc3RhdGljXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBBcnJheVxuICovXG5GYWNhZGUuaW5zdGFuY2VNYXAgPSBbXTtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBNZXNzYWdlIENvbnN0YW50c1xuICogQHByb3RlY3RlZFxuICogQHR5cGUge3N0cmluZ31cbiAqIEBjb25zdFxuICogQHN0YXRpY1xuICovXG5GYWNhZGUuTVVMVElUT05fTVNHID0gXCJGYWNhZGUgaW5zdGFuY2UgZm9yIHRoaXMgTXVsdGl0b24ga2V5IGFscmVhZHkgY29uc3RydWN0ZWQhXCI7XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5WaWV3XG4gKiBcbiAqIEEgTXVsdGl0b24gVmlldyBpbXBsZW1lbnRhdGlvbi5cbiAqIFxuICogSW4gUHVyZU1WQywgdGhlIFZpZXcgY2xhc3MgYXNzdW1lcyB0aGVzZSByZXNwb25zaWJpbGl0aWVzXG4gKiBcbiAqIC0gTWFpbnRhaW4gYSBjYWNoZSBvZiB7QGxpbmsgcHVyZW12Yy5NZWRpYXRvciBNZWRpYXRvcn1cbiAqICAgaW5zdGFuY2VzLlxuICogXG4gKiAtIFByb3ZpZGUgbWV0aG9kcyBmb3IgcmVnaXN0ZXJpbmcsIHJldHJpZXZpbmcsIGFuZCByZW1vdmluZyBcbiAqICAge0BsaW5rIHB1cmVtdmMuTWVkaWF0b3IgTWVkaWF0b3J9LlxuICogXG4gKiAtIE5vdGlmaXlpbmcge0BsaW5rIHB1cmVtdmMuTWVkaWF0b3IgTWVkaWF0b3J9IHdoZW4gdGhleSBhcmUgcmVnaXN0ZXJlZCBvciBcbiAqICAgcmVtb3ZlZC5cbiAqIFxuICogLSBNYW5hZ2luZyB0aGUgb2JzZXJ2ZXIgbGlzdHMgZm9yIGVhY2gge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn0gIFxuICogICBpbiB0aGUgYXBwbGljYXRpb24uXG4gKiBcbiAqIC0gUHJvdmlkaW5nIGEgbWV0aG9kIGZvciBhdHRhY2hpbmcge0BsaW5rIHB1cmVtdmMuT2JzZXJ2ZXIgT2JzZXJ2ZXJ9IHRvIGFuIFxuICogICB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufSdzIG9ic2VydmVyIGxpc3QuXG4gKiBcbiAqIC0gUHJvdmlkaW5nIGEgbWV0aG9kIGZvciBicm9hZGNhc3RpbmcgYSB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufS5cbiAqIFxuICogLSBOb3RpZnlpbmcgdGhlIHtAbGluayBwdXJlbXZjLk9ic2VydmVyIE9ic2VydmVyfXMgb2YgYSBnaXZlbiBcbiAqICAge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn0gd2hlbiBpdCBicm9hZGNhc3QuXG4gKiBcbiAqIFRoaXMgVmlldyBpbXBsZW1lbnRhdGlvbiBpcyBhIE11bHRpdG9uLCBzbyB5b3Ugc2hvdWxkIG5vdCBjYWxsIHRoZSBcbiAqIGNvbnN0cnVjdG9yIGRpcmVjdGx5LCBidXQgaW5zdGVhZCBjYWxsIHRoZSBzdGF0aWMgTXVsdGl0b24gXG4gKiBGYWN0b3J5ICNnZXRJbnN0YW5jZSBtZXRob2QuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIEBjb25zdHJ1Y3RvclxuICogQHRocm93cyB7RXJyb3J9IFxuICogIGlmIGluc3RhbmNlIGZvciB0aGlzIE11bHRpdG9uIGtleSBoYXMgYWxyZWFkeSBiZWVuIGNvbnN0cnVjdGVkXG4gKi9cbmZ1bmN0aW9uIFZpZXcoa2V5KVxue1xuICAgIGlmKFZpZXcuaW5zdGFuY2VNYXBba2V5XSAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFZpZXcuTVVMVElUT05fTVNHKTtcbiAgICB9O1xuXG4gICAgdGhpcy5tdWx0aXRvbktleSA9IGtleTtcbiAgICBWaWV3Lmluc3RhbmNlTWFwW3RoaXMubXVsdGl0b25LZXldID0gdGhpcztcbiAgICB0aGlzLm1lZGlhdG9yTWFwID0gW107XG4gICAgdGhpcy5vYnNlcnZlck1hcCA9IFtdO1xuICAgIHRoaXMuaW5pdGlhbGl6ZVZpZXcoKTtcbn07XG5cbi8qKlxuICogQHByb3RlY3RlZFxuICogSW5pdGlhbGl6ZSB0aGUgU2luZ2xldG9uIFZpZXcgaW5zdGFuY2VcbiAqIFxuICogQ2FsbGVkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIGNvbnN0cnVjdG9yLCB0aGlzIGlzIHlvdXIgb3Bwb3J0dW5pdHkgdG9cbiAqIGluaXRpYWxpemUgdGhlIFNpbmdsZXRvbiBpbnN0YW5jZSBpbiB5b3VyIHN1YmNsYXNzIHdpdGhvdXQgb3ZlcnJpZGluZyB0aGVcbiAqIGNvbnN0cnVjdG9yXG4gKiBcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cblZpZXcucHJvdG90eXBlLmluaXRpYWxpemVWaWV3ID0gZnVuY3Rpb24oKVxue1xuICAgIHJldHVybjtcbn07XG5cbi8qKlxuICogVmlldyBTaW5nbGV0b24gRmFjdG9yeSBtZXRob2QuXG4gKiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gbnVsbCBpZiBzdXBwbGllZCBhIG51bGwgXG4gKiBvciB1bmRlZmluZWQgbXVsdGl0b24ga2V5LlxuICogIFxuICogQHJldHVybiB7cHVyZW12Yy5WaWV3fVxuICogIFRoZSBTaW5nbGV0b24gaW5zdGFuY2Ugb2YgVmlld1xuICovXG5WaWV3LmdldEluc3RhbmNlID0gZnVuY3Rpb24oa2V5KVxue1xuXHRpZiAobnVsbCA9PSBrZXkpXG5cdFx0cmV0dXJuIG51bGw7XG5cdFx0XG4gICAgaWYoVmlldy5pbnN0YW5jZU1hcFtrZXldID09IG51bGwpXG4gICAge1xuICAgICAgICBWaWV3Lmluc3RhbmNlTWFwW2tleV0gPSBuZXcgVmlldyhrZXkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gVmlldy5pbnN0YW5jZU1hcFtrZXldO1xufTtcblxuLyoqXG4gKiBSZWdpc3RlciBhbiBPYnNlcnZlciB0byBiZSBub3RpZmllZCBvZiBOb3RpZmljYXRpb25zIHdpdGggYSBnaXZlbiBuYW1lXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb25OYW1lXG4gKiAgVGhlIG5hbWUgb2YgdGhlIE5vdGlmaWNhdGlvbnMgdG8gbm90aWZ5IHRoaXMgT2JzZXJ2ZXIgb2ZcbiAqIEBwYXJhbSB7cHVyZW12Yy5PYnNlcnZlcn0gb2JzZXJ2ZXJcbiAqICBUaGUgT2JzZXJ2ZXIgdG8gcmVnaXN0ZXIuXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5WaWV3LnByb3RvdHlwZS5yZWdpc3Rlck9ic2VydmVyID0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSwgb2JzZXJ2ZXIpXG57XG4gICAgaWYodGhpcy5vYnNlcnZlck1hcFtub3RpZmljYXRpb25OYW1lXSAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlck1hcFtub3RpZmljYXRpb25OYW1lXS5wdXNoKG9ic2VydmVyKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlck1hcFtub3RpZmljYXRpb25OYW1lXSA9IFtvYnNlcnZlcl07XG4gICAgfVxufTtcblxuLyoqXG4gKiBOb3RpZnkgdGhlIE9ic2VydmVyc2ZvciBhIHBhcnRpY3VsYXIgTm90aWZpY2F0aW9uLlxuICogXG4gKiBBbGwgcHJldmlvdXNseSBhdHRhY2hlZCBPYnNlcnZlcnMgZm9yIHRoaXMgTm90aWZpY2F0aW9uJ3NcbiAqIGxpc3QgYXJlIG5vdGlmaWVkIGFuZCBhcmUgcGFzc2VkIGEgcmVmZXJlbmNlIHRvIHRoZSBJTm90aWZpY2F0aW9uIGluIFxuICogdGhlIG9yZGVyIGluIHdoaWNoIHRoZXkgd2VyZSByZWdpc3RlcmVkLlxuICogXG4gKiBAcGFyYW0ge3B1cmVtdmMuTm90aWZpY2F0aW9ufSBub3RpZmljYXRpb25cbiAqICBUaGUgTm90aWZpY2F0aW9uIHRvIG5vdGlmeSBPYnNlcnZlcnMgb2ZcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cblZpZXcucHJvdG90eXBlLm5vdGlmeU9ic2VydmVycyA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbilcbntcbiAgICAvLyBTSUNcbiAgICBpZih0aGlzLm9ic2VydmVyTWFwW25vdGlmaWNhdGlvbi5nZXROYW1lKCldICE9IG51bGwpXG4gICAge1xuICAgICAgICB2YXIgb2JzZXJ2ZXJzX3JlZiA9IHRoaXMub2JzZXJ2ZXJNYXBbbm90aWZpY2F0aW9uLmdldE5hbWUoKV0sIG9ic2VydmVycyA9IFtdLCBvYnNlcnZlclxuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBvYnNlcnZlcnNfcmVmLmxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBvYnNlcnZlciA9IG9ic2VydmVyc19yZWZbaV07XG4gICAgICAgICAgICBvYnNlcnZlcnMucHVzaChvYnNlcnZlcik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgb2JzZXJ2ZXJzLmxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBvYnNlcnZlciA9IG9ic2VydmVyc1tpXTtcbiAgICAgICAgICAgIG9ic2VydmVyLm5vdGlmeU9ic2VydmVyKG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgT2JzZXJ2ZXIgZm9yIGEgZ2l2ZW4gbm90aWZ5Q29udGV4dCBmcm9tIGFuIG9ic2VydmVyIGxpc3QgZm9yXG4gKiBhIGdpdmVuIE5vdGlmaWNhdGlvbiBuYW1lXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb25OYW1lXG4gKiAgV2hpY2ggb2JzZXJ2ZXIgbGlzdCB0byByZW1vdmUgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IG5vdGlmeUNvbnRleHRcbiAqICBSZW1vdmUgdGhlIE9ic2VydmVyIHdpdGggdGhpcyBvYmplY3QgYXMgaXRzIG5vdGlmeUNvbnRleHRcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cblZpZXcucHJvdG90eXBlLnJlbW92ZU9ic2VydmVyID0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSwgbm90aWZ5Q29udGV4dClcbntcbiAgICAvLyBTSUNcbiAgICB2YXIgb2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlck1hcFtub3RpZmljYXRpb25OYW1lXTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgb2JzZXJ2ZXJzLmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgICAgaWYob2JzZXJ2ZXJzW2ldLmNvbXBhcmVOb3RpZnlDb250ZXh0KG5vdGlmeUNvbnRleHQpID09IHRydWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9ic2VydmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKG9ic2VydmVycy5sZW5ndGggPT0gMClcbiAgICB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVyTWFwW25vdGlmaWNhdGlvbk5hbWVdO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBNZWRpYXRvciBpbnN0YW5jZSB3aXRoIHRoZSBWaWV3LlxuICogXG4gKiBSZWdpc3RlcnMgdGhlIE1lZGlhdG9yIHNvIHRoYXQgaXQgY2FuIGJlIHJldHJpZXZlZCBieSBuYW1lLFxuICogYW5kIGZ1cnRoZXIgaW50ZXJyb2dhdGVzIHRoZSBNZWRpYXRvciBmb3IgaXRzIFxuICoge0BsaW5rIHB1cmVtdmMuTWVkaWF0b3IjbGlzdE5vdGlmaWNhdGlvbkludGVyZXN0cyBpbnRlcmVzdHN9LlxuICpcbiAqIElmIHRoZSBNZWRpYXRvciByZXR1cm5zIGFueSBOb3RpZmljYXRpb25cbiAqIG5hbWVzIHRvIGJlIG5vdGlmaWVkIGFib3V0LCBhbiBPYnNlcnZlciBpcyBjcmVhdGVkIGVuY2Fwc3VsYXRpbmcgXG4gKiB0aGUgTWVkaWF0b3IgaW5zdGFuY2UncyBcbiAqIHtAbGluayBwdXJlbXZjLk1lZGlhdG9yI2hhbmRsZU5vdGlmaWNhdGlvbiBoYW5kbGVOb3RpZmljYXRpb259XG4gKiBtZXRob2QgYW5kIHJlZ2lzdGVyaW5nIGl0IGFzIGFuIE9ic2VydmVyIGZvciBhbGwgTm90aWZpY2F0aW9ucyB0aGUgXG4gKiBNZWRpYXRvciBpcyBpbnRlcmVzdGVkIGluLlxuICogXG4gKiBAcGFyYW0ge3B1cmVtdmMuTWVkaWF0b3J9IFxuICogIGEgcmVmZXJlbmNlIHRvIHRoZSBNZWRpYXRvciBpbnN0YW5jZVxuICovXG5WaWV3LnByb3RvdHlwZS5yZWdpc3Rlck1lZGlhdG9yID0gZnVuY3Rpb24obWVkaWF0b3IpXG57XG4gICAgaWYodGhpcy5tZWRpYXRvck1hcFttZWRpYXRvci5nZXRNZWRpYXRvck5hbWUoKV0gIT0gbnVsbClcbiAgICB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBtZWRpYXRvci5pbml0aWFsaXplTm90aWZpZXIodGhpcy5tdWx0aXRvbktleSk7XG4gICAgLy8gcmVnaXN0ZXIgdGhlIG1lZGlhdG9yIGZvciByZXRyaWV2YWwgYnkgbmFtZVxuICAgIHRoaXMubWVkaWF0b3JNYXBbbWVkaWF0b3IuZ2V0TWVkaWF0b3JOYW1lKCldID0gbWVkaWF0b3I7XG5cbiAgICAvLyBnZXQgbm90aWZpY2F0aW9uIGludGVyZXN0cyBpZiBhbnlcbiAgICB2YXIgaW50ZXJlc3RzID0gbWVkaWF0b3IubGlzdE5vdGlmaWNhdGlvbkludGVyZXN0cygpO1xuXG4gICAgLy8gcmVnaXN0ZXIgbWVkaWF0b3IgYXMgYW4gb2JzZXJ2ZXIgZm9yIGVhY2ggbm90aWZpY2F0aW9uXG4gICAgaWYoaW50ZXJlc3RzLmxlbmd0aCA+IDApXG4gICAge1xuICAgICAgICAvLyBjcmVhdGUgb2JzZXJ2ZXIgcmVmZXJlbmNpbmcgdGhpcyBtZWRpYXRvcnMgaGFuZGxlTm90aWZpY2F0aW9uIG1ldGhvZFxuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgT2JzZXJ2ZXIobWVkaWF0b3IuaGFuZGxlTm90aWZpY2F0aW9uLCBtZWRpYXRvcik7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBpbnRlcmVzdHMubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJPYnNlcnZlcihpbnRlcmVzdHNbaV0sIG9ic2VydmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1lZGlhdG9yLm9uUmVnaXN0ZXIoKTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBhIE1lZGlhdG9yIGZyb20gdGhlIFZpZXdcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IG1lZGlhdG9yTmFtZVxuICogIFRoZSBuYW1lIG9mIHRoZSBNZWRpYXRvciBpbnN0YW5jZSB0byByZXRyaWV2ZVxuICogQHJldHVybiB7cHVyZW12Yy5NZWRpYXRvcn1cbiAqICBUaGUgTWVkaWF0b3IgaW5zdGFuY2UgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggdGhlIGdpdmVuIG1lZGlhdG9yTmFtZVxuICovXG5WaWV3LnByb3RvdHlwZS5yZXRyaWV2ZU1lZGlhdG9yID0gZnVuY3Rpb24obWVkaWF0b3JOYW1lKVxue1xuICAgIHJldHVybiB0aGlzLm1lZGlhdG9yTWFwW21lZGlhdG9yTmFtZV07XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhIE1lZGlhdG9yIGZyb20gdGhlIFZpZXcuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZWRpYXRvck5hbWVcbiAqICBOYW1lIG9mIHRoZSBNZWRpYXRvciBpbnN0YW5jZSB0byBiZSByZW1vdmVkXG4gKiBAcmV0dXJuIHtwdXJlbXZjLk1lZGlhdG9yfVxuICogIFRoZSBNZWRpYXRvciB0aGF0IHdhcyByZW1vdmVkIGZyb20gdGhlIFZpZXdcbiAqL1xuVmlldy5wcm90b3R5cGUucmVtb3ZlTWVkaWF0b3IgPSBmdW5jdGlvbihtZWRpYXRvck5hbWUpXG57XG4gICAgdmFyIG1lZGlhdG9yID0gdGhpcy5tZWRpYXRvck1hcFttZWRpYXRvck5hbWVdO1xuICAgIGlmKG1lZGlhdG9yKVxuICAgIHtcbiAgICAgICAgLy8gZm9yIGV2ZXJ5IG5vdGlmaWNhdGlvbiB0aGUgbWVkaWF0b3IgaXMgaW50ZXJlc3RlZCBpbi4uLlxuICAgICAgICB2YXIgaW50ZXJlc3RzID0gbWVkaWF0b3IubGlzdE5vdGlmaWNhdGlvbkludGVyZXN0cygpO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgaW50ZXJlc3RzLmxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIG9ic2VydmVyIGxpbmtpbmcgdGhlIG1lZGlhdG9yIHRvIHRoZSBub3RpZmljYXRpb25cbiAgICAgICAgICAgIC8vIGludGVyZXN0XG4gICAgICAgICAgICB0aGlzLnJlbW92ZU9ic2VydmVyKGludGVyZXN0c1tpXSwgbWVkaWF0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBtZWRpYXRvciBmcm9tIHRoZSBtYXBcbiAgICAgICAgZGVsZXRlIHRoaXMubWVkaWF0b3JNYXBbbWVkaWF0b3JOYW1lXTtcblxuICAgICAgICAvLyBhbGVydCB0aGUgbWVkaWF0b3IgdGhhdCBpdCBoYXMgYmVlbiByZW1vdmVkXG4gICAgICAgIG1lZGlhdG9yLm9uUmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lZGlhdG9yO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBhIE1lZGlhdG9yIGlzIHJlZ2lzdGVyZWQgb3Igbm90LlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVkaWF0b3JOYW1lXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICogIFdoZXRoZXIgYSBNZWRpYXRvciBpcyByZWdpc3RlcmVkIHdpdGggdGhlIGdpdmVuIG1lZGlhdG9ybmFtZVxuICovXG5WaWV3LnByb3RvdHlwZS5oYXNNZWRpYXRvciA9IGZ1bmN0aW9uKG1lZGlhdG9yTmFtZSlcbntcbiAgICByZXR1cm4gdGhpcy5tZWRpYXRvck1hcFttZWRpYXRvck5hbWVdICE9IG51bGw7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhIFZpZXcgaW5zdGFuY2VcbiAqIFxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuVmlldy5yZW1vdmVWaWV3ID0gZnVuY3Rpb24oa2V5KVxue1xuICAgIGRlbGV0ZSBWaWV3Lmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBWaWV3cyBpbnRlcm5hbCBtYXBwaW5nIG9mIG1lZGlhdG9yIG5hbWVzIHRvIG1lZGlhdG9yIGluc3RhbmNlc1xuICpcbiAqIEB0eXBlIEFycmF5XG4gKiBAcHJvdGVjdGVkXG4gKi9cblZpZXcucHJvdG90eXBlLm1lZGlhdG9yTWFwID0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgVmlld3MgaW50ZXJuYWwgbWFwcGluZyBvZiBOb3RpZmljYXRpb24gbmFtZXMgdG8gT2JzZXJ2ZXIgbGlzdHNcbiAqXG4gKiBAdHlwZSBBcnJheVxuICogQHByb3RlY3RlZFxuICovXG5WaWV3LnByb3RvdHlwZS5vYnNlcnZlck1hcCA9IG51bGw7XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIGludGVybmFsIG1hcCB1c2VkIHRvIHN0b3JlIG11bHRpdG9uIFZpZXcgaW5zdGFuY2VzXG4gKlxuICogQHR5cGUgQXJyYXlcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuVmlldy5pbnN0YW5jZU1hcCA9IFtdO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFRoZSBWaWV3cyBpbnRlcm5hbCBtdWx0aXRvbiBrZXkuXG4gKlxuICogQHR5cGUgc3RyaW5nXG4gKiBAcHJvdGVjdGVkXG4gKi9cblZpZXcucHJvdG90eXBlLm11bHRpdG9uS2V5ID0gbnVsbDtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgZXJyb3IgbWVzc2FnZSB1c2VkIGlmIGFuIGF0dGVtcHQgaXMgbWFkZSB0byBpbnN0YW50aWF0ZSBWaWV3IGRpcmVjdGx5XG4gKlxuICogQHR5cGUgc3RyaW5nXG4gKiBAcHJvdGVjdGVkXG4gKiBAY29uc3RcbiAqIEBzdGF0aWNcbiAqL1xuVmlldy5NVUxUSVRPTl9NU0cgPSBcIlZpZXcgaW5zdGFuY2UgZm9yIHRoaXMgTXVsdGl0b24ga2V5IGFscmVhZHkgY29uc3RydWN0ZWQhXCI7XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5Nb2RlbFxuICpcbiAqIEEgTXVsdGl0b24gTW9kZWwgaW1wbGVtZW50YXRpb24uXG4gKlxuICogSW4gUHVyZU1WQywgdGhlIE1vZGVsIGNsYXNzIHByb3ZpZGVzXG4gKiBhY2Nlc3MgdG8gbW9kZWwgb2JqZWN0cyAoUHJveGllcykgYnkgbmFtZWQgbG9va3VwLlxuICpcbiAqIFRoZSBNb2RlbCBhc3N1bWVzIHRoZXNlIHJlc3BvbnNpYmlsaXRpZXM6XG4gKlxuICogLSBNYWludGFpbiBhIGNhY2hlIG9mIHtAbGluayBwdXJlbXZjLlByb3h5IFByb3h5fVxuICogICBpbnN0YW5jZXMuXG4gKiAtIFByb3ZpZGUgbWV0aG9kcyBmb3IgcmVnaXN0ZXJpbmcsIHJldHJpZXZpbmcsIGFuZCByZW1vdmluZ1xuICogICB7QGxpbmsgcHVyZW12Yy5Qcm94eSBQcm94eX0gaW5zdGFuY2VzLlxuICpcbiAqIFlvdXIgYXBwbGljYXRpb24gbXVzdCByZWdpc3RlciBcbiAqIHtAbGluayBwdXJlbXZjLlByb3h5IFByb3h5fSBpbnN0YW5jZXMgd2l0aCB0aGUgTW9kZWwuIFxuICogVHlwaWNhbGx5LCB5b3UgdXNlIGEgXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9IFxuICogb3JcbiAqIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmR9IFxuICogdG8gY3JlYXRlIGFuZCByZWdpc3RlciBQcm94eSBpbnN0YW5jZXMgb25jZSB0aGUgRmFjYWRlIGhhcyBpbml0aWFsaXplZCB0aGUgXG4gKiAqQ29yZSogYWN0b3JzLlxuICpcbiAqIFRoaXMgTW9kZWwgaW1wbGVtZW50YXRpb24gaXMgYSBNdWx0aXRvbiwgc28geW91IHNob3VsZCBub3QgY2FsbCB0aGUgXG4gKiBjb25zdHJ1Y3RvciBkaXJlY3RseSwgYnV0IGluc3RlYWQgY2FsbCB0aGUgXG4gKiB7QGxpbmsgI2dldEluc3RhbmNlIHN0YXRpYyBNdWx0aXRvbiBGYWN0b3J5IG1ldGhvZH0gXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqICBUaGUgTW9kZWxzIG11bHRpdG9uIGtleVxuICogQHRocm93cyB7RXJyb3J9XG4gKiAgQW4gZXJyb3IgaXMgdGhyb3duIGlmIHRoaXMgbXVsdGl0b25zIGtleSBpcyBhbHJlYWR5IGluIHVzZSBieSBhbm90aGVyIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIE1vZGVsKGtleSlcbntcbiAgICBpZihNb2RlbC5pbnN0YW5jZU1hcFtrZXldKVxuICAgIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKE1vZGVsLk1VTFRJVE9OX01TRyk7XG4gICAgfVxuXG4gICAgdGhpcy5tdWx0aXRvbktleT0ga2V5O1xuICAgIE1vZGVsLmluc3RhbmNlTWFwW2tleV09IHRoaXM7XG4gICAgdGhpcy5wcm94eU1hcD0gW107XG4gICAgdGhpcy5pbml0aWFsaXplTW9kZWwoKTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgTW9kZWwgaW5zdGFuY2UuXG4gKiBcbiAqIENhbGxlZCBhdXRvbWF0aWNhbGx5IGJ5IHRoZSBjb25zdHJ1Y3RvciwgdGhpc1xuICogaXMgeW91ciBvcHBvcnR1bml0eSB0byBpbml0aWFsaXplIHRoZSBTaW5nbGV0b25cbiAqIGluc3RhbmNlIGluIHlvdXIgc3ViY2xhc3Mgd2l0aG91dCBvdmVycmlkaW5nIHRoZVxuICogY29uc3RydWN0b3IuXG4gKiBcbiAqIEByZXR1cm4gdm9pZFxuICovXG5Nb2RlbC5wcm90b3R5cGUuaW5pdGlhbGl6ZU1vZGVsPSBmdW5jdGlvbigpe307XG5cblxuLyoqXG4gKiBNb2RlbCBNdWx0aXRvbiBGYWN0b3J5IG1ldGhvZC5cbiAqIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBudWxsIGlmIHN1cHBsaWVkIGEgbnVsbCBcbiAqIG9yIHVuZGVmaW5lZCBtdWx0aXRvbiBrZXkuXG4gKiAgXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiAgVGhlIG11bHRpdG9uIGtleSBmb3IgdGhlIE1vZGVsIHRvIHJldHJpZXZlXG4gKiBAcmV0dXJuIHtwdXJlbXZjLk1vZGVsfVxuICogIHRoZSBpbnN0YW5jZSBmb3IgdGhpcyBNdWx0aXRvbiBrZXkgXG4gKi9cbk1vZGVsLmdldEluc3RhbmNlPSBmdW5jdGlvbihrZXkpXG57XG5cdGlmIChudWxsID09IGtleSlcblx0XHRyZXR1cm4gbnVsbDtcblx0XHRcbiAgICBpZihNb2RlbC5pbnN0YW5jZU1hcFtrZXldID09IG51bGwpXG4gICAge1xuICAgICAgICBNb2RlbC5pbnN0YW5jZU1hcFtrZXldPSBuZXcgTW9kZWwoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gTW9kZWwuaW5zdGFuY2VNYXBba2V5XTtcbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBQcm94eSB3aXRoIHRoZSBNb2RlbFxuICogQHBhcmFtIHtwdXJlbXZjLlByb3h5fVxuICovXG5Nb2RlbC5wcm90b3R5cGUucmVnaXN0ZXJQcm94eT0gZnVuY3Rpb24ocHJveHkpXG57XG4gICAgcHJveHkuaW5pdGlhbGl6ZU5vdGlmaWVyKHRoaXMubXVsdGl0b25LZXkpO1xuICAgIHRoaXMucHJveHlNYXBbcHJveHkuZ2V0UHJveHlOYW1lKCldPSBwcm94eTtcbiAgICBwcm94eS5vblJlZ2lzdGVyKCk7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIGEgUHJveHkgZnJvbSB0aGUgTW9kZWxcbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IHByb3h5TmFtZVxuICogQHJldHVybiB7cHVyZW12Yy5Qcm94eX1cbiAqICBUaGUgUHJveHkgaW5zdGFuY2UgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggdGhlIHByb3ZpZGVkIHByb3h5TmFtZVxuICovXG5Nb2RlbC5wcm90b3R5cGUucmV0cmlldmVQcm94eT0gZnVuY3Rpb24ocHJveHlOYW1lKVxue1xuICAgIHJldHVybiB0aGlzLnByb3h5TWFwW3Byb3h5TmFtZV07XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGEgUHJveHkgaXMgcmVnaXN0ZXJlZFxuICogQHBhcmFtIHtzdHJpbmd9IHByb3h5TmFtZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqICB3aGV0aGVyIGEgUHJveHkgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ2l2ZW4gcHJveHlOYW1lLlxuICovXG5Nb2RlbC5wcm90b3R5cGUuaGFzUHJveHk9IGZ1bmN0aW9uKHByb3h5TmFtZSlcbntcbiAgICByZXR1cm4gdGhpcy5wcm94eU1hcFtwcm94eU5hbWVdICE9IG51bGw7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhIFByb3h5IGZyb20gdGhlIE1vZGVsLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJveHlOYW1lXG4gKiAgVGhlIG5hbWUgb2YgdGhlIFByb3h5IGluc3RhbmNlIHRvIHJlbW92ZVxuICogQHJldHVybiB7cHVyZW12Yy5Qcm94eX1cbiAqICBUaGUgUHJveHkgdGhhdCB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBNb2RlbFxuICovXG5Nb2RlbC5wcm90b3R5cGUucmVtb3ZlUHJveHk9IGZ1bmN0aW9uKHByb3h5TmFtZSlcbntcbiAgICB2YXIgcHJveHk9IHRoaXMucHJveHlNYXBbcHJveHlOYW1lXTtcbiAgICBpZihwcm94eSlcbiAgICB7XG4gICAgICAgIHRoaXMucHJveHlNYXBbcHJveHlOYW1lXT0gbnVsbDtcbiAgICAgICAgcHJveHkub25SZW1vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJveHk7XG59O1xuXG4vKipcbiAqIEBzdGF0aWNcbiAqIFJlbW92ZSBhIE1vZGVsIGluc3RhbmNlLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5Nb2RlbC5yZW1vdmVNb2RlbD0gZnVuY3Rpb24oa2V5KVxue1xuICAgIGRlbGV0ZSBNb2RlbC5pbnN0YW5jZU1hcFtrZXldO1xufTtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBUaGUgbWFwIHVzZWQgYnkgdGhlIE1vZGVsIHRvIHN0b3JlIFByb3h5IGluc3RhbmNlcy5cbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSBBcnJheVxuICovXG5Nb2RlbC5wcm90b3R5cGUucHJveHlNYXA9IG51bGw7XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIG1hcCB1c2VkIGJ5IHRoZSBNb2RlbCB0byBzdG9yZSBtdWx0aXRvbiBpbnN0YW5jZXNcbiAqXG4gKiBAcHJvdGVjdGVkXG4gKiBAc3RhdGljXG4gKiBAdHlwZSBBcnJheVxuICovXG5Nb2RlbC5pbnN0YW5jZU1hcD0gW107XG5cbi8qKlxuICogQGlnbm9yZVxuICogVGhlIE1vZGVscyBtdWx0aXRvbiBrZXkuXG4gKlxuICogQHByb3RlY3RlZFxuICogQHR5cGUgc3RyaW5nXG4gKi9cbk1vZGVsLnByb3RvdHlwZS5tdWx0aXRvbktleTtcblxuLyoqXG4gKiBAaWdub3JlXG4gKiBNZXNzYWdlIENvbnN0YW50c1xuICogXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5Nb2RlbC5NVUxUSVRPTl9NU0c9IFwiTW9kZWwgaW5zdGFuY2UgZm9yIHRoaXMgTXVsdGl0b24ga2V5IGFscmVhZHkgY29uc3RydWN0ZWQhXCI7XG4vKipcbiAqIEBhdXRob3IgUHVyZU1WQyBKUyBOYXRpdmUgUG9ydCBieSBEYXZpZCBGb2xleSwgRnLDqWTDqXJpYyBTYXVuaWVyLCAmIEFsYWluIER1Y2hlc25lYXUgXG4gKiBAYXV0aG9yIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBAY2xhc3MgcHVyZW12Yy5Db250cm9sbGVyXG4gKiBcbiAqIEluIFB1cmVNVkMsIHRoZSBDb250cm9sbGVyIGNsYXNzIGZvbGxvd3MgdGhlICdDb21tYW5kIGFuZCBDb250cm9sbGVyJyBcbiAqIHN0cmF0ZWd5LCBhbmQgYXNzdW1lcyB0aGVzZSByZXNwb25zaWJpbGl0aWVzOlxuICogXG4gKiAtIFJlbWVtYmVyaW5nIHdoaWNoXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9c1xuICogb3IgXG4gKiB7QGxpbmsgcHVyZW12Yy5NYWNyb0NvbW1hbmQgTWFjcm9Db21tYW5kfXNcbiAqIGFyZSBpbnRlbmRlZCB0byBoYW5kbGUgd2hpY2ggXG4gKiB7QGxpbmsgcHVyZW12Yy5Ob3RpZmljYXRpb24gTm90aWZpY2F0aW9ufXNcbiAqIC0gUmVnaXN0ZXJpbmcgaXRzZWxmIGFzIGFuIFxuICoge0BsaW5rIHB1cmVtdmMuT2JzZXJ2ZXIgT2JzZXJ2ZXJ9IHdpdGhcbiAqIHRoZSB7QGxpbmsgcHVyZW12Yy5WaWV3IFZpZXd9IGZvciBlYWNoIFxuICoge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn1cbiAqIHRoYXQgaXQgaGFzIGFuIFxuICoge0BsaW5rIHB1cmVtdmMuU2ltcGxlQ29tbWFuZCBTaW1wbGVDb21tYW5kfSBcbiAqIG9yIHtAbGluayBwdXJlbXZjLk1hY3JvQ29tbWFuZCBNYWNyb0NvbW1hbmR9IFxuICogbWFwcGluZyBmb3IuXG4gKiAtIENyZWF0aW5nIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBwcm9wZXIgXG4gKiB7QGxpbmsgcHVyZW12Yy5TaW1wbGVDb21tYW5kIFNpbXBsZUNvbW1hbmR9c1xuICogb3IgXG4gKiB7QGxpbmsgcHVyZW12Yy5NYWNyb0NvbW1hbmQgTWFjcm9Db21tYW5kfXNcbiAqIHRvIGhhbmRsZSBhIGdpdmVuIFxuICoge0BsaW5rIHB1cmVtdmMuTm90aWZpY2F0aW9uIE5vdGlmaWNhdGlvbn0gXG4gKiB3aGVuIG5vdGlmaWVkIGJ5IHRoZVxuICoge0BsaW5rIHB1cmVtdmMuVmlldyBWaWV3fS5cbiAqIC0gQ2FsbGluZyB0aGUgY29tbWFuZCdzIGV4ZWN1dGUgbWV0aG9kLCBwYXNzaW5nIGluIHRoZSBcbiAqIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259LlxuICpcbiAqIFlvdXIgYXBwbGljYXRpb24gbXVzdCByZWdpc3RlciBcbiAqIHtAbGluayBwdXJlbXZjLlNpbXBsZUNvbW1hbmQgU2ltcGxlQ29tbWFuZH1zXG4gKiBvciB7QGxpbmsgcHVyZW12Yy5NYWNyb0NvbW1hbmQgTWFjcm9Db21tYW5kfXMgXG4gKiB3aXRoIHRoZSBDb250cm9sbGVyLlxuICpcbiAqIFRoZSBzaW1wbGVzdCB3YXkgaXMgdG8gc3ViY2xhc3MgXG4gKiB7QGxpbmsgcHVyZW12Yy5GYWNhZGUgRmFjYWRlfSxcbiAqIGFuZCB1c2UgaXRzIFxuICoge0BsaW5rIHB1cmVtdmMuRmFjYWRlI2luaXRpYWxpemVDb250cm9sbGVyIGluaXRpYWxpemVDb250cm9sbGVyfSBcbiAqIG1ldGhvZCB0byBhZGQgeW91ciByZWdpc3RyYXRpb25zLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogVGhpcyBDb250cm9sbGVyIGltcGxlbWVudGF0aW9uIGlzIGEgTXVsdGl0b24sIHNvIHlvdSBzaG91bGQgbm90IGNhbGwgdGhlIFxuICogY29uc3RydWN0b3IgZGlyZWN0bHksIGJ1dCBpbnN0ZWFkIGNhbGwgdGhlIHN0YXRpYyAjZ2V0SW5zdGFuY2UgZmFjdG9yeSBtZXRob2QsIFxuICogcGFzc2luZyB0aGUgdW5pcXVlIGtleSBmb3IgdGhpcyBpbnN0YW5jZSB0byBpdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIEB0aHJvd3Mge0Vycm9yfVxuICogIElmIGluc3RhbmNlIGZvciB0aGlzIE11bHRpdG9uIGtleSBoYXMgYWxyZWFkeSBiZWVuIGNvbnN0cnVjdGVkXG4gKi9cbmZ1bmN0aW9uIENvbnRyb2xsZXIoa2V5KVxue1xuICAgIGlmKENvbnRyb2xsZXIuaW5zdGFuY2VNYXBba2V5XSAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKENvbnRyb2xsZXIuTVVMVElUT05fTVNHKTtcbiAgICB9XG5cbiAgICB0aGlzLm11bHRpdG9uS2V5PSBrZXk7XG4gICAgQ29udHJvbGxlci5pbnN0YW5jZU1hcFt0aGlzLm11bHRpdG9uS2V5XT0gdGhpcztcbiAgICB0aGlzLmNvbW1hbmRNYXA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRyb2xsZXIoKTtcbn1cblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBcbiAqIEluaXRpYWxpemUgdGhlIG11bHRpdG9uIENvbnRyb2xsZXIgaW5zdGFuY2UuXG4gKlxuICogQ2FsbGVkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIGNvbnN0cnVjdG9yLlxuICpcbiAqIE5vdGUgdGhhdCBpZiB5b3UgYXJlIHVzaW5nIGEgc3ViY2xhc3Mgb2YgVmlld1xuICogaW4geW91ciBhcHBsaWNhdGlvbiwgeW91IHNob3VsZCAqYWxzbyogc3ViY2xhc3MgQ29udHJvbGxlclxuICogYW5kIG92ZXJyaWRlIHRoZSBpbml0aWFsaXplQ29udHJvbGxlciBtZXRob2QgaW4gdGhlXG4gKiBmb2xsb3dpbmcgd2F5LlxuICogXG4gKiAgICAgTXlDb250cm9sbGVyLnByb3RvdHlwZS5pbml0aWFsaXplQ29udHJvbGxlcj0gZnVuY3Rpb24gKClcbiAqICAgICB7XG4gKiAgICAgICAgIHRoaXMudmlldz0gTXlWaWV3LmdldEluc3RhbmNlKHRoaXMubXVsdGl0b25LZXkpO1xuICogICAgIH07XG4gKiBcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXRpYWxpemVDb250cm9sbGVyPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy52aWV3PSBWaWV3LmdldEluc3RhbmNlKHRoaXMubXVsdGl0b25LZXkpO1xufTtcblxuLyoqXG4gKiBUaGUgQ29udHJvbGxlcnMgbXVsdGl0b24gZmFjdG9yeSBtZXRob2QuIFxuICogTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIG51bGwgaWYgc3VwcGxpZWQgYSBudWxsIFxuICogb3IgdW5kZWZpbmVkIG11bHRpdG9uIGtleS4gXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogIEEgQ29udHJvbGxlcidzIG11bHRpdG9uIGtleVxuICogQHJldHVybiB7cHVyZW12Yy5Db250cm9sbGVyfVxuICogIHRoZSBNdWx0aXRvbiBpbnN0YW5jZSBvZiBDb250cm9sbGVyXG4gKi9cbkNvbnRyb2xsZXIuZ2V0SW5zdGFuY2U9IGZ1bmN0aW9uKGtleSlcbntcblx0aWYgKG51bGwgPT0ga2V5KVxuXHRcdHJldHVybiBudWxsO1xuXHRcdFxuICAgIGlmKG51bGwgPT0gdGhpcy5pbnN0YW5jZU1hcFtrZXldKVxuICAgIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZU1hcFtrZXldPSBuZXcgdGhpcyhrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIElmIGEgU2ltcGxlQ29tbWFuZCBvciBNYWNyb0NvbW1hbmQgaGFzIHByZXZpb3VzbHkgYmVlbiByZWdpc3RlcmVkIHRvIGhhbmRsZVxuICogdGhlIGdpdmVuIE5vdGlmaWNhdGlvbiB0aGVuIGl0IGlzIGV4ZWN1dGVkLlxuICpcbiAqIEBwYXJhbSB7cHVyZW12Yy5Ob3RpZmljYXRpb259IG5vdGVcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLmV4ZWN1dGVDb21tYW5kPSBmdW5jdGlvbihub3RlKVxue1xuICAgIHZhciBjb21tYW5kQ2xhc3NSZWY9IHRoaXMuY29tbWFuZE1hcFtub3RlLmdldE5hbWUoKV07XG4gICAgaWYoY29tbWFuZENsYXNzUmVmID09IG51bGwpXG4gICAgICAgIHJldHVybjtcblxuICAgIHZhciBjb21tYW5kSW5zdGFuY2U9IG5ldyBjb21tYW5kQ2xhc3NSZWYoKTtcbiAgICBjb21tYW5kSW5zdGFuY2UuaW5pdGlhbGl6ZU5vdGlmaWVyKHRoaXMubXVsdGl0b25LZXkpO1xuICAgIGNvbW1hbmRJbnN0YW5jZS5leGVjdXRlKG5vdGUpO1xufTtcblxuLyoqXG4gKiBSZWdpc3RlciBhIHBhcnRpY3VsYXIgU2ltcGxlQ29tbWFuZCBvciBNYWNyb0NvbW1hbmQgY2xhc3MgYXMgdGhlIGhhbmRsZXIgZm9yIFxuICogYSBwYXJ0aWN1bGFyIE5vdGlmaWNhdGlvbi5cbiAqXG4gKiBJZiBhbiBjb21tYW5kIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIHRvIGhhbmRsZSBOb3RpZmljYXRpb25zIHdpdGggdGhpcyBuYW1lLCBcbiAqIGl0IGlzIG5vIGxvbmdlciB1c2VkLCB0aGUgbmV3IGNvbW1hbmQgaXMgdXNlZCBpbnN0ZWFkLlxuICpcbiAqIFRoZSBPYnNlcnZlciBmb3IgdGhlIG5ldyBjb21tYW5kIGlzIG9ubHkgY3JlYXRlZCBpZiB0aGlzIHRoZSBpcnN0IHRpbWUgYVxuICogY29tbWFuZCBoYXMgYmVlbiByZWdpc2VyZWQgZm9yIHRoaXMgTm90aWZpY2F0aW9uIG5hbWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqICB0aGUgbmFtZSBvZiB0aGUgTm90aWZpY2F0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21tYW5kQ2xhc3NSZWZcbiAqICBhIGNvbW1hbmQgY29uc3RydWN0b3JcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyQ29tbWFuZD0gZnVuY3Rpb24obm90aWZpY2F0aW9uTmFtZSwgY29tbWFuZENsYXNzUmVmKVxue1xuICAgIGlmKHRoaXMuY29tbWFuZE1hcFtub3RpZmljYXRpb25OYW1lXSA9PSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhpcy52aWV3LnJlZ2lzdGVyT2JzZXJ2ZXIobm90aWZpY2F0aW9uTmFtZSwgbmV3IE9ic2VydmVyKHRoaXMuZXhlY3V0ZUNvbW1hbmQsIHRoaXMpKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbW1hbmRNYXBbbm90aWZpY2F0aW9uTmFtZV09IGNvbW1hbmRDbGFzc1JlZjtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBjb21tYW5kIGlzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gTm90aWZpY2F0aW9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbk5hbWVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKiAgd2hldGhlciBhIENvbW1hbmQgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQgZm9yIHRoZSBnaXZlbiBub3RpZmljYXRpb25OYW1lLlxuICovXG5Db250cm9sbGVyLnByb3RvdHlwZS5oYXNDb21tYW5kPSBmdW5jdGlvbihub3RpZmljYXRpb25OYW1lKVxue1xuICAgIHJldHVybiB0aGlzLmNvbW1hbmRNYXBbbm90aWZpY2F0aW9uTmFtZV0gIT0gbnVsbDtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIGNvbW1hbmQgdG9cbiAqIHtAbGluayBwdXJlbXZjLk5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb259XG4gKiBtYXBwaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb25OYW1lXG4gKiAgdGhlIG5hbWUgb2YgdGhlIE5vdGlmaWNhdGlvbiB0byByZW1vdmUgdGhlIGNvbW1hbmQgbWFwcGluZyBmb3JcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbW92ZUNvbW1hbmQ9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbk5hbWUpXG57XG4gICAgaWYodGhpcy5oYXNDb21tYW5kKG5vdGlmaWNhdGlvbk5hbWUpKVxuICAgIHtcbiAgICAgICAgdGhpcy52aWV3LnJlbW92ZU9ic2VydmVyKG5vdGlmaWNhdGlvbk5hbWUsIHRoaXMpO1xuICAgICAgICB0aGlzLmNvbW1hbmRNYXBbbm90aWZpY2F0aW9uTmFtZV09IG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBAc3RhdGljXG4gKiBSZW1vdmUgYSBDb250cm9sbGVyIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgXG4gKiAgbXVsdGl0b25LZXkgb2YgQ29udHJvbGxlciBpbnN0YW5jZSB0byByZW1vdmVcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbkNvbnRyb2xsZXIucmVtb3ZlQ29udHJvbGxlcj0gZnVuY3Rpb24oa2V5KVxue1xuICAgIGRlbGV0ZSB0aGlzLmluc3RhbmNlTWFwW2tleV07XG59O1xuXG4vKipcbiAqIExvY2FsIHJlZmVyZW5jZSB0byB0aGUgQ29udHJvbGxlcidzIFZpZXdcbiAqIFxuICogQHByb3RlY3RlZFxuICogQHR5cGUge3B1cmVtdmMuVmlld31cbiAqL1xuQ29udHJvbGxlci5wcm90b3R5cGUudmlldz0gbnVsbDtcblxuLyoqXG4gKiBOb3RlIG5hbWUgdG8gY29tbWFuZCBjb25zdHJ1Y3RvciBtYXBwaW5nc1xuICogXG4gKiBAcHJvdGVjdGVkXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5Db250cm9sbGVyLnByb3RvdHlwZS5jb21tYW5kTWFwPSBudWxsO1xuXG4vKipcbiAqIFRoZSBDb250cm9sbGVyJ3MgbXVsdGl0b24ga2V5XG4gKiBcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbkNvbnRyb2xsZXIucHJvdG90eXBlLm11bHRpdG9uS2V5PSBudWxsO1xuXG4vKipcbiAqIE11bHRpdG9uIGtleSB0byBDb250cm9sbGVyIGluc3RhbmNlIG1hcHBpbmdzXG4gKiBcbiAqIEBzdGF0aWNcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbkNvbnRyb2xsZXIuaW5zdGFuY2VNYXA9IFtdO1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqIFxuICogTWVzc2FnZSBjb25zdGFudHNcbiAqIEBzdGF0aWNcbiAqIEBwcm90ZWN0ZWRcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbkNvbnRyb2xsZXIuTVVMVElUT05fTVNHPSBcImNvbnRyb2xsZXIga2V5IGZvciB0aGlzIE11bHRpdG9uIGtleSBhbHJlYWR5IGNvbnN0cnVjdGVkXCJcbi8qXG4gKiBAYXV0aG9yIFB1cmVNVkMgSlMgTmF0aXZlIFBvcnQgYnkgRGF2aWQgRm9sZXksIEZyw6lkw6lyaWMgU2F1bmllciwgJiBBbGFpbiBEdWNoZXNuZWF1IFxuICogQGF1dGhvciBDb3B5cmlnaHQoYykgMjAwNi0yMDEyIEZ1dHVyZXNjYWxlLCBJbmMuLCBTb21lIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogQGhpZGVcbiAqIEEgYW4gaW50ZXJuYWwgaGVscGVyIGNsYXNzIHVzZWQgdG8gYXNzaXN0IGNsYXNzbGV0IGltcGxlbWVudGF0aW9uLiBUaGlzXG4gKiBjbGFzcyBpcyBub3QgYWNjZXNzaWJsZSBieSBjbGllbnQgY29kZS5cbiAqL1xudmFyIE9vcEhlbHA9XG57XG4gICAgLypcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgc2NvcGUuIFdlIHVzZSB0aGlzIHJhdGhlciB0aGFuIHdpbmRvd1xuICAgICAqIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBicm93c2VyIGJhc2VkIGFuZCBub24gYnJvd3NlciBiYWVkIFxuICAgICAqIEphdmFTY3JpcHQgaW50ZXJwcmV0ZXJzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG5cdGdsb2JhbDogKGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KSgpXG4gICAgXG4gICAgLypcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEV4dGVuZCBvbmUgRnVuY3Rpb24ncyBwcm90b3R5cGUgYnkgYW5vdGhlciwgZW11bGF0aW5nIGNsYXNzaWNcbiAgICAgKiBpbmhlcml0YW5jZS5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjaGlsZFxuICAgICAqICBUaGUgRnVuY3Rpb24gdG8gZXh0ZW5kIChzdWJjbGFzcylcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJlbnRcbiAgICAgKiAgVGhlIEZ1bmN0aW9uIHRvIGV4dGVuZCBmcm9tIChzdXBlcmNsYXNzKVxuICAgICAqIFxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgICAqIFxuICAgICAqICBBIHJlZmVyZW5jZSB0byB0aGUgZXh0ZW5kZWQgRnVuY3Rpb24gKHN1YmNsYXNzKVxuICAgICAqL1xuLCAgIGV4dGVuZDogZnVuY3Rpb24gKGNoaWxkLCBwYXJlbnQpXG4gICAge1xuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGNoaWxkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignI2V4dGVuZC0gY2hpbGQgc2hvdWxkIGJlIEZ1bmN0aW9uJyk7ICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHBhcmVudClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJyNleHRlbmQtIHBhcmVudCBzaG91bGQgYmUgRnVuY3Rpb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAocGFyZW50ID09PSBjaGlsZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICB2YXIgVHJhbnNpdGl2ZT0gbmV3IEZ1bmN0aW9uO1xuICAgICAgICBUcmFuc2l0aXZlLnByb3RvdHlwZT0gcGFyZW50LnByb3RvdHlwZTtcbiAgICAgICAgY2hpbGQucHJvdG90eXBlPSBuZXcgVHJhbnNpdGl2ZTtcbiAgICAgICAgcmV0dXJuIGNoaWxkLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj0gY2hpbGQ7XG4gICAgfVxuICAgIFxuICAgIC8qXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBEZWNvYXJhdGUgb25lIG9iamVjdCB3aXRoIHRoZSBwcm9wZXJ0aWVzIG9mIGFub3RoZXIuIFxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICAgKiAgVGhlIG9iamVjdCB0byBkZWNvcmF0ZS5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdHJhaXRzXG4gICAgICogIFRoZSBvYmplY3QgcHJvdmlkaW5nIHRoZSBwcm9wZXJpdGVzIHRoYXQgdGhlIGZpcnN0IG9iamVjdFxuICAgICAqICB3aWxsIGJlIGRlY29yYXRlZCB3aXRoLiBOb3RlIHRoYXQgb25seSBwcm9wZXJ0aWVzIGRlZmluZWQgb24gXG4gICAgICogIHRoaXMgb2JqZWN0IHdpbGwgYmUgY29waWVkLSBpLmUuIGluaGVyaXRlZCBwcm9wZXJ0aWVzIHdpbGxcbiAgICAgKiAgYmUgaWdub3JlZC5cbiAgICAgKiBcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICogIFRIZSBkZWNvcmF0ZWQgb2JqZWN0IChmaXJzdCBhcmd1bWVudClcbiAgICAgKi9cbiwgICBkZWNvcmF0ZTogZnVuY3Rpb24gKG9iamVjdCwgdHJhaXRzKVxuICAgIHsgICBcbiAgICAgICAgZm9yICh2YXIgYWNjZXNzb3IgaW4gdHJhaXRzKVxuICAgICAgICB7XG4gICAgICAgICAgICBvYmplY3RbYWNjZXNzb3JdPSB0cmFpdHNbYWNjZXNzb3JdO1xuICAgICAgICB9ICAgIFxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogQG1lbWJlciBwdXJlbXZjXG4gKiBcbiAqIERlY2xhcmUgYSBuYW1lc3BhY2UgYW5kIG9wdGlvbmFsbHkgbWFrZSBhbiBPYmplY3QgdGhlIHJlZmVyZW50XG4gKiBvZiB0aGF0IG5hbWVzcGFjZS5cbiAqIFxuICogICAgIGNvbnNvbGUuYXNzZXJ0KG51bGwgPT0gd2luZG93LnRsZCwgJ05vIHRsZCBuYW1lc3BhY2UnKTtcbiAqICAgICAvLyBkZWNsYXJlIHRoZSB0bGQgbmFtZXNwYWNlXG4gKiAgICAgcHVyZW12Yy5kZWNsYXJlKCd0bGQnKTtcbiAqICAgICBjb25zb2xlLmFzc2VydCgnb2JqZWN0JyA9PT0gdHlwZW9mIHRsZCwgJ1RoZSB0bGQgbmFtZXNwYWNlIHdhcyBkZWNsYXJlZCcpO1xuICogXG4gKiAgICAgLy8gdGhlIG1ldGhvZCByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIGxhc3QgbmFtZXNwYWNlIG5vZGUgaW4gYSBjcmVhdGVkIGhpZXJhcmNoeVxuICogICAgIHZhciByZWZlcmVuY2U9IHB1cmVtdmMuZGVjbGFyZSgndGxkLmRvbWFpbi5hcHAnKTtcbiAqICAgICBjb25zb2xlLmFzc2VydChyZWZlcmVuY2UgPT09IHRsZC5kb21haW4uYXBwKVxuICogICAgXG4gKiAgICAgLy8gb2YgY291cnNlIHlvdSBjYW4gYWxzbyBkZWNsYXJlIHlvdXIgb3duIG9iamVjdHMgYXMgd2VsbFxuICogICAgIHZhciBBcHBDb25zdGFudHM9XG4gKiAgICAgICAgIHtcbiAqIFx0ICAgICAgICAgICBBUFBfTkFNRTogJ3RsZC5kb21haW4uYXBwLkFwcCdcbiAqICAgICAgICAgfTtcbiAqIFxuICogICAgIHB1cmVtdmMuZGVjbGFyZSgndGxkLmRvbWFpbi5hcHAuQXBwQ29uc3RhbnRzJywgQXBwQ29uc3RhbnRzKTtcbiAqICAgICBjb25zb2xlLmFzc2VydChBcHBDb25zdGFudHMgPT09IHRsZC5kb21haW4uYXBwLkFwcENvbnN0YW50c1xuICogXHQgICAsICdBcHBDb25zdGFudHMgd2FzIGV4cG9ydGVkIHRvIHRoZSBuYW1lc3BhY2UnKTtcbiAqIFxuICogTm90ZSB0aGF0IHlvdSBjYW4gYWxzbyAjZGVjbGFyZSB3aXRoaW4gYSBjbG9zdXJlLiBUaGF0IHdheSB5b3VcbiAqIGNhbiBzZWxlY3RpdmVseSBleHBvcnQgT2JqZWN0cyB0byB5b3VyIG93biBuYW1lc3BhY2VzIHdpdGhvdXRcbiAqIGxlYWtpbmcgdmFyaWFibGVzIGludG8gdGhlIGdsb2JhbCBzY29wZS5cbiAqICAgIFxuICogICAgIChmdW5jdGlvbigpe1xuICogICAgICAgICAvLyB0aGlzIHZhciBpcyBub3QgYWNjZXNzaWJsZSBvdXRzaWRlIG9mIHRoaXNcbiAqICAgICAgICAgLy8gY2xvc3VyZXMgY2FsbCBzY29wZVxuICogICAgICAgICB2YXIgaGlkZGVuVmFsdWU9ICdkZWZhdWx0VmFsdWUnO1xuICogXG4gKiAgICAgICAgIC8vIGV4cG9ydCBhbiBvYmplY3QgdGhhdCByZWZlcmVuY2VzIHRoZSBoaWRkZW5cbiAqICAgICAgICAgLy8gdmFyaWFibGUgYW5kIHdoaWNoIGNhbiBtdXRhdGUgaXRcbiAqICAgICAgICAgcHVyZW12Yy5kZWNsYXJlXG4gKiAgICAgICAgIChcbiAqICAgICAgICAgICAgICAndGxkLmRvbWFpbi5hcHAuYmFja2Rvb3InXG4gKiBcbiAqICAgICAgICAgLCAgICB7XG4gKiAgICAgICAgICAgICAgICAgIHNldFZhbHVlOiBmdW5jdGlvbiAodmFsdWUpXG4gKiAgICAgICAgICAgICAgICAgIHtcbiAqICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc2lnbnMgdG8gdGhlIGhpZGRlbiB2YXJcbiAqICAgICAgICAgICAgICAgICAgICAgIGhpZGRlblZhbHVlPSB2YWx1ZTtcbiAqICAgICAgICAgICAgICAgICAgfVxuICogXG4gKiAgICAgICAgICwgICAgICAgIGdldFZhbHVlOiBmdW5jdGlvbiAoKVxuICogICAgICAgICAgICAgICAgICB7XG4gKiAgICAgICAgICAgICAgICAgICAgICAvLyByZWFkcyBmcm9tIHRoZSBoaWRkZW4gdmFyXG4gKiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGlkZGVuVmFsdWU7XG4gKiAgICAgICAgICAgICAgICAgIH1cbiAqICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICk7XG4gKiAgICAgfSkoKTtcbiAqICAgICAvLyBpbmRpcmVjdGx5IHJldHJpZXZlIHRoZSBoaWRkZW4gdmFyaWFibGVzIHZhbHVlXG4gKiAgICAgY29uc29sZS5hc3NlcnQoJ2RlZmF1bHRWYWx1ZScgPT09IHRsZC5kb21haW4uYXBwLmJhY2tkb29yLmdldFZhbHVlKCkpO1xuICogICAgIC8vIGluZGlyZWN0bHkgc2V0IHRoZSBoaWRkZW4gdmFyaWFibGVzIHZhbHVlXG4gKiAgICAgdGxkLmRvbWFpbi5hcHAuYmFja2Rvb3Iuc2V0VmFsdWUoJ25ld1ZhbHVlJyk7XG4gKiAgICAgLy8gdGhlIGhpZGRlbiB2YXIgd2FzIG11dGF0ZWRcbiAqICAgICBjb25zb2xlLmFzc2VydCgnbmV3VmFsdWUnID09PSB0bGQuZG9tYWluLmFwcC5iYWNrZG9vci5nZXRWYWx1ZSgpKTtcbiAqIFxuICogT24gb2NjYXNpb24sIHByaW1hcmlseSBkdXJpbmcgdGVzdGluZywgeW91IG1heSB3YW50IHRvIHVzZSBkZWNsYXJlLCBcbiAqIGJ1dCBub3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBiZSB0aGUgbmFtZXNwYWNlIHJvb3QuIEluIHRoZXNlIGNhc2VzIHlvdVxuICogY2FuIHN1cHBseSB0aGUgb3B0aW9uYWwgdGhpcmQgc2NvcGUgYXJndW1lbnQuXG4gKiBcbiAqICAgICB2YXIgbG9jYWxTY29wZT0ge31cbiAqICAgICAsICAgb2JqZWN0PSB7fVxuICogXG4gKiAgICAgcHVyZW12Yy5kZWNsYXJlKCdtb2NrLm9iamVjdCcsIG9iamVjdCwgbG9jYWxTY29wZSk7XG4gKiBcbiAqICAgICBjb25zb2xlLmFzc2VydChudWxsID09IHdpbmRvdy5tb2NrLCAnbW9jayBuYW1lc3BhY2UgaXMgbm90IGluIGdsb2JhbCBzY29wZScpO1xuICogICAgIGNvbnNvbGUuYXNzZXJ0KG9iamVjdCA9PT0gbG9jYWxTY29wZS5tb2NrLm9iamVjdCwgJ21vY2sub2JqZWN0IGlzIGF2YWlsYWJsZSBpbiBsb2NhbFNjb3BlJyk7ICAgIFxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gKiAgQSBxdWFsaWZpZWQgb2JqZWN0IG5hbWUsIGUuZy4gJ2NvbS5leGFtcGxlLkNsYXNzJ1xuICogXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF1cbiAqICBBbiBvYmplY3QgdG8gbWFrZSB0aGUgcmVmZXJlbnQgb2YgdGhlIG5hbWVzcGFjZS4gXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbc2NvcGVdXG4gKiAgVGhlIG5hbWVzcGFjZSdzIHJvb3Qgbm9kZS4gSWYgbm90IHN1cHBsaWVkLCB0aGUgZ2xvYmFsXG4gKiAgc2NvcGUgd2lsbCBiZSBuYW1lc3BhY2VzIHJvb3Qgbm9kZS5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0fVxuICogXG4gKiAgQSByZWZlcmVuY2UgdG8gdGhlIGxhc3Qgbm9kZSBvZiB0aGUgT2JqZWN0IGhpZXJhcmNoeSBjcmVhdGVkLlxuICovXG5mdW5jdGlvbiBkZWNsYXJlIChxdWFsaWZpZWROYW1lLCBvYmplY3QsIHNjb3BlKVxue1xuICAgIHZhciBub2Rlcz0gcXVhbGlmaWVkTmFtZS5zcGxpdCgnLicpXG4gICAgLCAgIG5vZGU9IHNjb3BlIHx8IE9vcEhlbHAuZ2xvYmFsXG4gICAgLCAgIGxhc3ROb2RlXG4gICAgLCAgIG5ld05vZGVcbiAgICAsICAgbm9kZU5hbWU7XG4gICAgICAgICAgICAgICAgXG4gICAgZm9yICh2YXIgaT0gMCwgbj0gbm9kZXMubGVuZ3RoOyBpIDwgbjsgaSsrKVxuICAgIHtcbiAgICAgICAgbGFzdE5vZGU9IG5vZGU7XG4gICAgICAgIG5vZGVOYW1lPSBub2Rlc1tpXTtcbiAgICAgICAgXG4gICAgICAgIG5vZGU9IChudWxsID09IG5vZGVbbm9kZU5hbWVdID8gbm9kZVtub2RlTmFtZV0gPSB7fSA6IG5vZGVbbm9kZU5hbWVdKTtcbiAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgIGlmIChudWxsID09IG9iamVjdClcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICByZXR1cm4gbGFzdE5vZGVbbm9kZU5hbWVdPSBvYmplY3Q7XG59O1xuXG5cblxuXG4vKipcbiAqIEBtZW1iZXIgcHVyZW12Y1xuICogXG4gKiBEZWZpbmUgYSBuZXcgY2xhc3NsZXQuIEN1cnJlbnQgZWRpdGlvbnMgb2YgSmF2YVNjcmlwdCBkbyBub3QgaGF2ZSBjbGFzc2VzLFxuICogYnV0IHRoZXkgY2FuIGJlIGVtdWxhdGVkLCBhbmQgdGhpcyBtZXRob2QgZG9lcyB0aGlzIGZvciB5b3UsIHNhdmluZyB5b3VcbiAqIGZyb20gaGF2aW5nIHRvIHdvcmsgd2l0aCBGdW5jdGlvbiBwcm90b3R5cGUgZGlyZWN0bHkuIFRoZSBtZXRob2QgZG9lc1xuICogbm90IGV4dGVuZCBhbnkgTmF0aXZlIG9iamVjdHMgYW5kIGlzIGVudGlyZWx5IG9wdCBpbi4gSXRzIHBhcnRpY3VsYXJseVxuICogdXNlZnVsbCBpZiB5b3Ugd2FudCB0byBtYWtlIHlvdXIgUHVyZU12YyBhcHBsaWNhdGlvbnMgbW9yZSBwb3J0YWJsZSwgYnlcbiAqIGRlY291cGxpbmcgdGhlbSBmcm9tIGEgc3BlY2lmaWMgT09QIGFic3RyYWN0aW9uIGxpYnJhcnkuXG4gKiBcbiAqIFxuICogICAgIHB1cmVtdmMuZGVmaW5lXG4gKiAgICAgKFxuICogICAgICAgICAvLyB0aGUgZmlyc3Qgb2JqZWN0IHN1cHBsaWVkIGlzIGEgY2xhc3MgZGVzY3JpcHRvci4gTm9uZSBvZiB0aGVzZVxuICogICAgICAgICAvLyBwcm9wZXJ0aWVzIGFyZSBhZGRlZCB0byB5b3VyIGNsYXNzLCB0aGUgZXhjZXB0aW9uIGJlaW5nIHRoZVxuICogICAgICAgICAvLyBjb25zdHJ1Y3RvciBwcm9wZXJ0eSwgd2hpY2ggaWYgc3VwcGxpZWQsIHdpbGwgYmUgeW91ciBjbGFzc2VzXG4gKiAgICAgICAgIC8vIGNvbnN0cnVjdG9yLlxuICogICAgICAgICB7XG4gKiAgICAgICAgICAgICAvLyB5b3VyIGNsYXNzZXMgbmFtZXNwYWNlLSBpZiBzdXBwbGllZCwgaXQgd2lsbCBiZSBcbiAqICAgICAgICAgICAgIC8vIGNyZWF0ZWQgZm9yIHlvdVxuICogICAgICAgICAgICAgbmFtZTogJ2NvbS5leGFtcGxlLlVzZXJNZWRpYXRvcidcbiAqIFxuICogICAgICAgICAgICAgLy8geW91ciBjbGFzc2VzIHBhcmVudCBjbGFzcy4gSWYgc3VwcGxpZWQsIGluaGVyaXRhbmNlIFxuICogICAgICAgICAgICAgLy8gd2lsbCBiZSB0YWtlbiBjYXJlIG9mIGZvciB5b3VcbiAqICAgICAgICAgLCAgIHBhcmVudDogcHVyZW12Yy5NZWRpYXRvclxuICogXG4gKiAgICAgICAgICAgICAvLyB5b3VyIGNsYXNzZXMgY29uc3RydWN0b3IuIElmIG5vdCBzdXBwbGllZCwgb25lIHdpbGwgYmUgXG4gKiAgICAgICAgICAgICAvLyBjcmVhdGVkIGZvciB5b3VcbiAqICAgICAgICAgLCAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBVc2VyTWVkaWF0b3IgKGNvbXBvbmVudClcbiAqICAgICAgICAgICAgIHtcbiAqICAgICAgICAgICAgICAgICAgcHVyZW12Yy5NZWRpYXRvci5jYWxsKHRoaXMsIHRoaXMuY29uc3RydWN0b3IuTkFNRSwgY29tcG9uZW50KTsgIFxuICogICAgICAgICAgICAgfVxuICogICAgICAgICB9XG4gKiAgICAgICAgIFxuICogICAgICAgICAvLyB0aGUgc2Vjb25kIG9iamVjdCBzdXBwbGllZCBkZWZpbmVzIHlvdXIgY2xhc3MgdHJhaXRzLCB0aGF0IGlzXG4gKiAgICAgICAgIC8vIHRoZSBwcm9wZXJ0aWVzIHRoYXQgd2lsbCBiZSBkZWZpbmVkIG9uIHlvdXIgY2xhc3NlcyBwcm90b3R5cGVcbiAqICAgICAgICAgLy8gYW5kIHRoZXJlYnkgb24gYWxsIGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzXG4gKiAgICAgLCAgIHtcbiAqICAgICAgICAgICAgIGJ1c2luZXNzTWV0aG9kOiBmdW5jdGlvbiAoKVxuICogICAgICAgICAgICAge1xuICogICAgICAgICAgICAgICAgIC8vIGltcGwgXG4gKiAgICAgICAgICAgICB9XG4gKiAgICAgICAgIH1cbiAqIFxuICogICAgICAgICAvLyB0aGUgdGhpcmQgb2JqZWN0IHN1cHBsaWVkIGRlZmluZXMgeW91ciBjbGFzc2VzICdzdGF0aWMnIHRyYWl0c1xuICogICAgICAgICAvLyB0aGF0IGlzLCB0aGUgbWV0aG9kcyBhbmQgcHJvcGVydGllcyB3aGljaCB3aWxsIGJlIGRlZmluZWQgb25cbiAqICAgICAgICAgLy8geW91ciBjbGFzc2VzIGNvbnN0cnVjdG9yXG4gKiAgICAgLCAgIHtcbiAqICAgICAgICAgICAgIE5BTUU6ICd1c2VyTWVkaWF0b3InXG4gKiAgICAgICAgIH1cbiAqICAgICApO1xuICogXG4gKiBAcGFyYW0ge09iamVjdH0gW2NsYXNzaW5mb11cbiAqICBBbiBvYmplY3QgZGVzY3JpYmluZyB0aGUgY2xhc3MuIFRoaXMgb2JqZWN0IGNhbiBoYXZlIGFueSBvciBhbGwgb2ZcbiAqICB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiBcbiAqICAtIG5hbWU6IFN0cmluZyAgXG4gKiAgICAgIFRoZSBjbGFzc2xldHMgbmFtZS4gVGhpcyBjYW4gYmUgYW55IGFyYml0cmFyeSBxdWFsaWZpZWQgb2JqZWN0XG4gKiAgICAgIG5hbWUuICdjb20uZXhhbXBsZS5DbGFzc2xldCcgb3Igc2ltcGx5ICdNeUNsYXNzbGV0JyBmb3IgZXhhbXBsZSBcbiAqICAgICAgVGhlIG1ldGhvZCB3aWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlIGFuIG9iamVjdCBoaWVyYXJjaHkgcmVmZXJpbmdcbiAqICAgICAgdG8geW91ciBjbGFzcyBmb3IgeW91LiBOb3RlIHRoYXQgeW91IHdpbGwgbmVlZCB0byBjYXB0dXJlIHRoZSBcbiAqICAgICAgbWV0aG9kcyByZXR1cm4gdmFsdWUgdG8gcmV0cmlldmUgYSByZWZlcmVuY2UgdG8geW91ciBjbGFzcyBpZiB0aGVcbiAqICAgICAgY2xhc3MgbmFtZSBwcm9wZXJ0eSBpcyBub3QgZGVmaW5lZC5cblxuICogIC0gcGFyZW50OiBGdW5jdGlvblxuICogICAgICBUaGUgY2xhc3NsZXRzICdzdXBlcmNsYXNzJy4gWW91ciBjbGFzcyB3aWxsIGJlIGV4dGVuZGVkIGZyb20gdGhpc1xuICogICAgICBpZiBzdXBwbGllZC5cbiAqIFxuICogIC0gY29uc3RydWN0b3I6IEZ1bmN0aW9uXG4gKiAgICAgIFRoZSBjbGFzc2xldHMgY29uc3RydWN0b3IuIE5vdGUgdGhpcyBpcyAqbm90KiBhIHBvc3QgY29uc3RydWN0IFxuICogICAgICBpbml0aWFsaXplIG1ldGhvZCwgYnV0IHlvdXIgY2xhc3NlcyBjb25zdHJ1Y3RvciBGdW5jdGlvbi5cbiAqICAgICAgSWYgdGhpcyBhdHRyaWJ1dGUgaXMgbm90IGRlZmluZWQsIGEgY29uc3RydWN0b3Igd2lsbCBiZSBjcmVhdGVkIGZvciBcbiAqICAgICAgeW91IGF1dG9tYXRpY2FsbHkuIElmIHlvdSBoYXZlIHN1cHBsaWVkIGEgcGFyZW50IGNsYXNzXG4gKiAgICAgIHZhbHVlIGFuZCBub3QgZGVmaW5lZCB0aGUgY2xhc3NlcyBjb25zdHJ1Y3RvciwgdGhlIGF1dG9tYXRpY2FsbHlcbiAqICAgICAgY3JlYXRlZCBjb25zdHJ1Y3RvciB3aWxsIGludm9rZSB0aGUgc3VwZXIgY2xhc3MgY29uc3RydWN0b3JcbiAqICAgICAgYXV0b21hdGljYWxseS4gSWYgeW91IGhhdmUgc3VwcGxpZWQgeW91ciBvd24gY29uc3RydWN0b3IgYW5kIHlvdVxuICogICAgICB3aXNoIHRvIGludm9rZSBpdCdzIHN1cGVyIGNvbnN0cnVjdG9yLCB5b3UgbXVzdCBkbyB0aGlzIG1hbnVhbGx5LCBhc1xuICogICAgICB0aGVyZSBpcyBubyByZWZlcmVuY2UgdG8gdGhlIGNsYXNzZXMgcGFyZW50IGFkZGVkIHRvIHRoZSBjb25zdHJ1Y3RvclxuICogICAgICBwcm90b3R5cGUuXG4gKiAgICAgIFxuICogIC0gc2NvcGU6IE9iamVjdC5cbiAqICAgICAgRm9yIHVzZSBpbiBhZHZhbmNlZCBzY2VuYXJpb3MuIElmIHRoZSBuYW1lIGF0dHJpYnV0ZSBoYXMgYmVlbiBzdXBwbGllZCxcbiAqICAgICAgdGhpcyB2YWx1ZSB3aWxsIGJlIHRoZSByb290IG9mIHRoZSBvYmplY3QgaGllcmFyY2h5IGNyZWF0ZWQgZm9yIHlvdS5cbiAqICAgICAgVXNlIGl0IGRvIGRlZmluZSB5b3VyIG93biBjbGFzcyBoaWVyYXJjaGllcyBpbiBwcml2YXRlIHNjb3BlcyxcbiAqICAgICAgYWNjcm9zcyBpRnJhbWVzLCBpbiB5b3VyIHVuaXQgdGVzdHMsIG9yIGF2b2lkIGNvbGxpc2lvbiB3aXRoIHRoaXJkXG4gKiAgICAgIHBhcnR5IGxpYnJhcnkgbmFtZXNwYWNlcy5cbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IFt0cmFpdHNdXG4gKiAgQW4gT2JqZWN0LCB0aGUgcHJvcGVydGllcyBvZiB3aGljaCB3aWxsIGJlIGFkZGVkIHRvIHRoZVxuICogIGNsYXNzIGNvbnN0cnVjdG9ycyBwcm90b3R5cGUuXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhaXRjVHJhaXRzXVxuICogIEFuIE9iamVjdCwgdGhlIHByb3BlcnRpZXMgb2Ygd2hpY2ggd2lsbCBiZSBhZGRlZCBkaXJlY3RseVxuICogIHRvIHRoaXMgY2xhc3MgY29uc3RydWN0b3JcbiAqIFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiAgQSByZWZlcmVuY2UgdG8gdGhlIGNsYXNzbGV0cyBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBkZWZpbmUgKGNsYXNzSW5mbywgdHJhaXRzLCBzdGF0aWNUcmFpdHMpXG57XG4gICAgaWYgKCFjbGFzc0luZm8pXG4gICAge1xuICAgICAgICBjbGFzc0luZm89IHt9XG4gICAgfVxuXG4gICAgdmFyIGNsYXNzTmFtZT0gY2xhc3NJbmZvLm5hbWVcbiAgICAsICAgY2xhc3NQYXJlbnQ9IGNsYXNzSW5mby5wYXJlbnRcbiAgICAsICAgZG9FeHRlbmQ9ICdmdW5jdGlvbicgPT09IHR5cGVvZiBjbGFzc1BhcmVudFxuICAgICwgICBjbGFzc0NvbnN0cnVjdG9yXG4gICAgLCAgIGNsYXNzU2NvcGU9IGNsYXNzSW5mby5zY29wZSB8fCBudWxsXG4gICAgLCAgIHByb3RvdHlwZVxuXG4gICAgaWYgKCdwYXJlbnQnIGluIGNsYXNzSW5mbyAmJiAhZG9FeHRlbmQpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDbGFzcyBwYXJlbnQgbXVzdCBiZSBGdW5jdGlvbicpO1xuICAgIH1cbiAgICAgICAgXG4gICAgaWYgKGNsYXNzSW5mby5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSlcbiAgICB7XG4gICAgICAgIGNsYXNzQ29uc3RydWN0b3I9IGNsYXNzSW5mby5jb25zdHJ1Y3RvclxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGNsYXNzQ29uc3RydWN0b3IpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NsYXNzIGNvbnN0cnVjdG9yIG11c3QgYmUgRnVuY3Rpb24nKVxuICAgICAgICB9ICAgXG4gICAgfVxuICAgIGVsc2UgLy8gdGhlcmUgaXMgbm8gY29uc3RydWN0b3IsIGNyZWF0ZSBvbmVcbiAgICB7XG4gICAgICAgIGlmIChkb0V4dGVuZCkgLy8gZW5zdXJlIHRvIGNhbGwgdGhlIHN1cGVyIGNvbnN0cnVjdG9yXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzQ29uc3RydWN0b3I9IGZ1bmN0aW9uICgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3NQYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIC8vIGp1c3QgY3JlYXRlIGEgRnVuY3Rpb25cbiAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NDb25zdHJ1Y3Rvcj0gbmV3IEZ1bmN0aW9uO1xuICAgICAgICB9IFxuICAgIH1cblxuICAgIGlmIChkb0V4dGVuZClcbiAgICB7XG4gICAgICAgIE9vcEhlbHAuZXh0ZW5kKGNsYXNzQ29uc3RydWN0b3IsIGNsYXNzUGFyZW50KTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRyYWl0cylcbiAgICB7XG4gICAgICAgIHByb3RvdHlwZT0gY2xhc3NDb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICAgICAgT29wSGVscC5kZWNvcmF0ZShwcm90b3R5cGUsIHRyYWl0cyk7XG4gICAgICAgIC8vIHJlYXNzaWduIGNvbnN0cnVjdG9yIFxuICAgICAgICBwcm90b3R5cGUuY29uc3RydWN0b3I9IGNsYXNzQ29uc3RydWN0b3I7XG4gICAgfVxuICAgIFxuICAgIGlmIChzdGF0aWNUcmFpdHMpXG4gICAge1xuICAgICAgICBPb3BIZWxwLmRlY29yYXRlKGNsYXNzQ29uc3RydWN0b3IsIHN0YXRpY1RyYWl0cylcbiAgICB9XG4gICAgXG4gICAgaWYgKGNsYXNzTmFtZSlcbiAgICB7XG4gICAgICAgIGlmICgnc3RyaW5nJyAhPT0gdHlwZW9mIGNsYXNzTmFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2xhc3MgbmFtZSBtdXN0IGJlIHByaW1pdGl2ZSBzdHJpbmcnKTtcbiAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIGRlY2xhcmUgKGNsYXNzTmFtZSwgY2xhc3NDb25zdHJ1Y3RvciwgY2xhc3NTY29wZSk7XG4gICAgfSAgICBcbiAgICBcbiAgICByZXR1cm4gY2xhc3NDb25zdHJ1Y3RvcjsgICAgICAgICAgICBcbn07XG5cblxuXHRcbiBcdC8qIGltcGxlbWVudGF0aW9uIGVuZCAqL1xuIFx0IFxuIFx0Ly8gZGVmaW5lIHRoZSBwdXJlbXZjIGdsb2JhbCBuYW1lc3BhY2UgYW5kIGV4cG9ydCB0aGUgYWN0b3JzXG52YXIgcHVyZW12YyA9XG4gXHR7XG4gXHRcdFZpZXc6IFZpZXdcbiBcdCxcdE1vZGVsOiBNb2RlbFxuIFx0LFx0Q29udHJvbGxlcjogQ29udHJvbGxlclxuIFx0LFx0U2ltcGxlQ29tbWFuZDogU2ltcGxlQ29tbWFuZFxuIFx0LFx0TWFjcm9Db21tYW5kOiBNYWNyb0NvbW1hbmRcbiBcdCxcdEZhY2FkZTogRmFjYWRlXG4gXHQsXHRNZWRpYXRvcjogTWVkaWF0b3JcbiBcdCxcdE9ic2VydmVyOiBPYnNlcnZlclxuIFx0LFx0Tm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb25cbiBcdCxcdE5vdGlmaWVyOiBOb3RpZmllclxuIFx0LFx0UHJveHk6IFByb3h5XG4gXHQsXHRkZWZpbmU6IGRlZmluZVxuIFx0LFx0ZGVjbGFyZTogZGVjbGFyZVxuIFx0fTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcHVyZW12YzsiLCIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIFB1cmVNVkMgU3RhdGUgTWFjaGluZSBVdGlsaXR5IEpTIE5hdGl2ZSBQb3J0IGJ5IFNhYWQgU2hhbXNcbiAqIENvcHlyaWdodChjKSAyMDA2LTIwMTIgRnV0dXJlc2NhbGUsIEluYy4sIFNvbWUgcmlnaHRzIHJlc2VydmVkLlxuICogUmV1c2UgZ292ZXJuZWQgYnkgQ3JlYXRpdmUgQ29tbW9ucyBBdHRyaWJ1dGlvbiAzLjAgXG4gKiBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjAvdXMvXG4gKiBAYXV0aG9yIHNhYWQuc2hhbXNAcHVyZW12Yy5vcmcgXG4gKi9cblxudmFyIHB1cmVtdmMgPSByZXF1aXJlKCAnLi9wdXJlbXZjLTEuMC4xLW1vZC5qcycgKTtcbiAgICBcbi8qKlxuICogQ29uc3RydWN0b3JcbiAqXG4gKiBEZWZpbmVzIGEgU3RhdGUuXG4gKiBAbWV0aG9kIFN0YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBpZCB0aGUgaWQgb2YgdGhlIHN0YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gZW50ZXJpbmcgYW4gb3B0aW9uYWwgbm90aWZpY2F0aW9uIG5hbWUgdG8gYmUgc2VudCB3aGVuIGVudGVyaW5nIHRoaXMgc3RhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBleGl0aW5nIGFuIG9wdGlvbmFsIG5vdGlmaWNhdGlvbiBuYW1lIHRvIGJlIHNlbnQgd2hlbiBleGl0aW5nIHRoaXMgc3RhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaGFuZ2VkIGFuIG9wdGlvbmFsIG5vdGlmaWNhdGlvbiBuYW1lIHRvIGJlIHNlbnQgd2hlbiBmdWxseSB0cmFuc2l0aW9uZWQgdG8gdGhpcyBzdGF0ZVxuICogQHJldHVybiBcbiAqL1xuXG5mdW5jdGlvbiBTdGF0ZShuYW1lLCBlbnRlcmluZywgZXhpdGluZywgY2hhbmdlZCkgeyAgXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICBpZihlbnRlcmluZykgdGhpcy5lbnRlcmluZyA9IGVudGVyaW5nO1xuICAgIGlmKGV4aXRpbmcpIHRoaXMuZXhpdGluZyA9IGV4aXRpbmc7XG4gICAgaWYoY2hhbmdlZCkgdGhpcy5jaGFuZ2VkID0gY2hhbmdlZDtcbiAgICB0aGlzLnRyYW5zaXRpb25zID0ge307XG59XG5cbi8qKlxuICogRGVmaW5lIGEgdHJhbnNpdGlvbi5cbiAqIEBtZXRob2QgZGVmaW5lVHJhbnNcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb24gdGhlIG5hbWUgb2YgdGhlIFN0YXRlTWFjaGluZS5BQ1RJT04gTm90aWZpY2F0aW9uIHR5cGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0IHRoZSBuYW1lIG9mIHRoZSB0YXJnZXQgc3RhdGUgdG8gdHJhbnNpdGlvbiB0by5cbiAqIEByZXR1cm4gXG4gKi9cblN0YXRlLnByb3RvdHlwZS5kZWZpbmVUcmFucyA9IGZ1bmN0aW9uKGFjdGlvbiwgdGFyZ2V0KSB7XG4gICAgaWYodGhpcy5nZXRUYXJnZXQoYWN0aW9uKSAhPSBudWxsKSByZXR1cm47XG4gICAgdGhpcy50cmFuc2l0aW9uc1thY3Rpb25dID0gdGFyZ2V0O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIHByZXZpb3VzbHkgZGVmaW5lZCB0cmFuc2l0aW9uLlxuICogQG1ldGhvZCByZW1vdmVUcmFuc1xuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblxuICogQHJldHVybiBcbiAqL1xuU3RhdGUucHJvdG90eXBlLnJlbW92ZVRyYW5zID0gZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgZGVsZXRlIHRoaXMudHJhbnNpdGlvbnNbYWN0aW9uXTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHRhcmdldCBzdGF0ZSBuYW1lIGZvciBhIGdpdmVuIGFjdGlvbi5cbiAqIEBtZXRob2QgZ2V0VGFyZ2V0XG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uXG4gKiBAcmV0dXJuIFN0YXRlXG4gKi9cbi8qKlxuICogXG4gKi9cblN0YXRlLnByb3RvdHlwZS5nZXRUYXJnZXQgPSBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uc1thY3Rpb25dID8gdGhpcy50cmFuc2l0aW9uc1thY3Rpb25dIDogbnVsbDtcbn1cblxuLy8gVGhlIHN0YXRlIG5hbWVcblN0YXRlLnByb3RvdHlwZS5uYW1lID0gbnVsbDtcblxuLy8gVGhlIG5vdGlmaWNhdGlvbiB0byBkaXNwYXRjaCB3aGVuIGVudGVyaW5nIHRoZSBzdGF0ZVxuU3RhdGUucHJvdG90eXBlLmVudGVyaW5nID0gbnVsbDtcblxuLy8gVGhlIG5vdGlmaWNhdGlvbiB0byBkaXNwYXRjaCB3aGVuIGV4aXRpbmcgdGhlIHN0YXRlXG5TdGF0ZS5wcm90b3R5cGUuZXhpdGluZyA9IG51bGw7XG5cbi8vIFRoZSBub3RpZmljYXRpb24gdG8gZGlzcGF0Y2ggd2hlbiB0aGUgc3RhdGUgaGFzIGFjdHVhbGx5IGNoYW5nZWRcblN0YXRlLnByb3RvdHlwZS5jaGFuZ2VkID0gbnVsbDtcblxuLyoqXG4gKiAgVHJhbnNpdGlvbiBtYXAgb2YgYWN0aW9ucyB0byB0YXJnZXQgc3RhdGVzXG4gKi8gXG5TdGF0ZS5wcm90b3R5cGUudHJhbnNpdGlvbnMgPSBudWxsO1xuICAgIFxuXG4gICAgXG4gLyoqXG4gKiBBIEZpbml0ZSBTdGF0ZSBNYWNoaW5lIGltcGxpbWVudGF0aW9uLlxuICogPFA+XG4gKiBIYW5kbGVzIHJlZ2lzaXN0cmF0aW9uIGFuZCByZW1vdmFsIG9mIHN0YXRlIGRlZmluaXRpb25zLCBcbiAqIHdoaWNoIGluY2x1ZGUgb3B0aW9uYWwgZW50cnkgYW5kIGV4aXQgY29tbWFuZHMgZm9yIGVhY2ggXG4gKiBzdGF0ZS48L1A+XG4gKi9cblxuLyoqXG4gKiBDb25zdHJ1Y3RvclxuICpcbiAqIEBtZXRob2QgU3RhdGVNYWNoaW5lXG4gKiBAcmV0dXJuIFxuICovXG5mdW5jdGlvbiBTdGF0ZU1hY2hpbmUoKSB7XG4gICAgcHVyZW12Yy5NZWRpYXRvci5jYWxsKHRoaXMsIFN0YXRlTWFjaGluZS5OQU1FLCBudWxsKTtcbiAgICB0aGlzLnN0YXRlcyA9IHt9O1xufVxuICAgIFxuU3RhdGVNYWNoaW5lLnByb3RvdHlwZSA9IG5ldyBwdXJlbXZjLk1lZGlhdG9yO1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN0YXRlTWFjaGluZTtcblxuLyoqXG4gKiBUcmFuc2l0aW9ucyB0byBpbml0aWFsIHN0YXRlIG9uY2UgcmVnaXN0ZXJlZCB3aXRoIEZhY2FkZVxuICogQG1ldGhvZCBvblJlZ2lzdGVyXG4gKiBAcmV0dXJuIFxuICovXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLm9uUmVnaXN0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLmluaXRpYWwpIHRoaXMudHJhbnNpdGlvblRvKHRoaXMuaW5pdGlhbCwgbnVsbCk7XG59XG5cbi8qKlxuICogUmVnaXN0ZXJzIHRoZSBlbnRyeSBhbmQgZXhpdCBjb21tYW5kcyBmb3IgYSBnaXZlbiBzdGF0ZS5cbiAqIEBtZXRob2QgcmVnaXN0ZXJTdGF0ZVxuICogQHBhcmFtIHtTdGF0ZX0gc3RhdGUgdGhlIHN0YXRlIHRvIHdoaWNoIHRvIHJlZ2lzdGVyIHRoZSBhYm92ZSBjb21tYW5kc1xuICogQHBhcmFtIHtib29sZWFufSBpbml0aWFsIGJvb2xlYW4gdGVsbGluZyBpZiB0aGlzIGlzIHRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSBzeXN0ZW1cbiAqIEByZXR1cm4gXG4gKi9cblN0YXRlTWFjaGluZS5wcm90b3R5cGUucmVnaXN0ZXJTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlLCBpbml0aWFsKSB7XG4gICAgaWYoc3RhdGUgPT0gbnVsbCB8fCB0aGlzLnN0YXRlc1tzdGF0ZS5uYW1lXSAhPSBudWxsKSByZXR1cm47XG4gICAgdGhpcy5zdGF0ZXNbc3RhdGUubmFtZV0gPSBzdGF0ZTtcbiAgICBpZihpbml0aWFsKSB0aGlzLmluaXRpYWwgPSBzdGF0ZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBzdGF0ZSBtYXBwaW5nLiBSZW1vdmVzIHRoZSBlbnRyeSBhbmQgZXhpdCBjb21tYW5kcyBmb3IgYSBnaXZlbiBzdGF0ZSBhcyB3ZWxsIGFzIHRoZSBzdGF0ZSBtYXBwaW5nIGl0c2VsZi5cbiAqIEBtZXRob2QgcmVtb3ZlU3RhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZU5hbWVcbiAqIEByZXR1cm4gXG4gKi9cblN0YXRlTWFjaGluZS5wcm90b3R5cGUucmVtb3ZlU3RhdGUgPSBmdW5jdGlvbihzdGF0ZU5hbWUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlc1tzdGF0ZU5hbWVdO1xuICAgIGlmKHN0YXRlID09IG51bGwpIHJldHVybjtcbiAgICB0aGlzLnN0YXRlc1tzdGF0ZU5hbWVdID0gbnVsbDtcbn1cblxuLyoqXG4gKiBUcmFuc2l0aW9ucyB0byB0aGUgZ2l2ZW4gc3RhdGUgZnJvbSB0aGUgY3VycmVudCBzdGF0ZS5cbiAqIDxQPlxuICogU2VuZHMgdGhlIDxjb2RlPmV4aXRpbmc8L2NvZGU+IG5vdGlmaWNhdGlvbiBmb3IgdGhlIGN1cnJlbnQgc3RhdGUgXG4gKiBmb2xsb3dlZCBieSB0aGUgPGNvZGU+ZW50ZXJpbmc8L2NvZGU+IG5vdGlmaWNhdGlvbiBmb3IgdGhlIG5ldyBzdGF0ZS5cbiAqIE9uY2UgZmluYWxseSB0cmFuc2l0aW9uZWQgdG8gdGhlIG5ldyBzdGF0ZSwgdGhlIDxjb2RlPmNoYW5nZWQ8L2NvZGU+IFxuICogbm90aWZpY2F0aW9uIGZvciB0aGUgbmV3IHN0YXRlIGlzIHNlbnQuPC9QPlxuICogPFA+XG4gKiBJZiBhIGRhdGEgcGFyYW1ldGVyIGlzIHByb3ZpZGVkLCBpdCBpcyBpbmNsdWRlZCBhcyB0aGUgYm9keSBvZiBhbGxcbiAqIHRocmVlIHN0YXRlLXNwZWNpZmljIHRyYW5zaXRpb24gbm90ZXMuPC9QPlxuICogPFA+XG4gKiBGaW5hbGx5LCB3aGVuIGFsbCB0aGUgc3RhdGUtc3BlY2lmaWMgdHJhbnNpdGlvbiBub3RlcyBoYXZlIGJlZW5cbiAqIHNlbnQsIGEgPGNvZGU+U3RhdGVNYWNoaW5lLkNIQU5HRUQ8L2NvZGU+IG5vdGUgaXMgc2VudCwgd2l0aCB0aGVcbiAqIG5ldyA8Y29kZT5TdGF0ZTwvY29kZT4gb2JqZWN0IGFzIHRoZSA8Y29kZT5ib2R5PC9jb2RlPiBhbmQgdGhlIG5hbWUgb2YgdGhlIFxuICogbmV3IHN0YXRlIGluIHRoZSA8Y29kZT50eXBlPC9jb2RlPi5cbiAqXG4gKiBAbWV0aG9kIHRyYW5zaXRpb25Ub1xuICogQHBhcmFtIHtTdGF0ZX0gbmV4dFN0YXRlIHRoZSBuZXh0IFN0YXRlIHRvIHRyYW5zaXRpb24gdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBpcyB0aGUgb3B0aW9uYWwgT2JqZWN0IHRoYXQgd2FzIHNlbnQgaW4gdGhlIDxjb2RlPlN0YXRlTWFjaGluZS5BQ1RJT048L2NvZGU+IG5vdGlmaWNhdGlvbiBib2R5XG4gKiBAcmV0dXJuIFxuICovXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLnRyYW5zaXRpb25UbyA9IGZ1bmN0aW9uKG5leHRTdGF0ZSwgZGF0YSkge1xuICAgIC8vIEdvaW5nIG5vd2hlcmU/XG4gICAgaWYobmV4dFN0YXRlID09IG51bGwpIHJldHVybjtcbiAgICBcbiAgICAvLyBDbGVhciB0aGUgY2FuY2VsIGZsYWdcbiAgICB0aGlzLmNhbmNlbGVkID0gZmFsc2U7XG4gICAgXG4gICAgLy8gRXhpdCB0aGUgY3VycmVudCBTdGF0ZSBcbiAgICBpZih0aGlzLmdldEN1cnJlbnRTdGF0ZSgpICYmIHRoaXMuZ2V0Q3VycmVudFN0YXRlKCkuZXhpdGluZykgXG4gICAgICAgIHRoaXMuc2VuZE5vdGlmaWNhdGlvbih0aGlzLmdldEN1cnJlbnRTdGF0ZSgpLmV4aXRpbmcsIGRhdGEsIG5leHRTdGF0ZS5uYW1lKTtcbiAgICBcbiAgICAvLyBDaGVjayB0byBzZWUgd2hldGhlciB0aGUgZXhpdGluZyBndWFyZCBoYXMgY2FuY2VsZWQgdGhlIHRyYW5zaXRpb25cbiAgICBpZih0aGlzLmNhbmNlbGVkKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBFbnRlciB0aGUgbmV4dCBTdGF0ZSBcbiAgICBpZihuZXh0U3RhdGUuZW50ZXJpbmcpXG4gICAgICAgIHRoaXMuc2VuZE5vdGlmaWNhdGlvbihuZXh0U3RhdGUuZW50ZXJpbmcsIGRhdGEpO1xuICAgIFxuICAgIC8vIENoZWNrIHRvIHNlZSB3aGV0aGVyIHRoZSBlbnRlcmluZyBndWFyZCBoYXMgY2FuY2VsZWQgdGhlIHRyYW5zaXRpb25cbiAgICBpZih0aGlzLmNhbmNlbGVkKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBjaGFuZ2UgdGhlIGN1cnJlbnQgc3RhdGUgb25seSB3aGVuIGJvdGggZ3VhcmRzIGhhdmUgYmVlbiBwYXNzZWRcbiAgICB0aGlzLnNldEN1cnJlbnRTdGF0ZShuZXh0U3RhdGUpO1xuICAgIFxuICAgIC8vIFNlbmQgdGhlIG5vdGlmaWNhdGlvbiBjb25maWd1cmVkIHRvIGJlIHNlbnQgd2hlbiB0aGlzIHNwZWNpZmljIHN0YXRlIGJlY29tZXMgY3VycmVudCBcbiAgICBpZihuZXh0U3RhdGUuY2hhbmdlZCkge1xuICAgICAgICB0aGlzLnNlbmROb3RpZmljYXRpb24odGhpcy5nZXRDdXJyZW50U3RhdGUoKS5jaGFuZ2VkLCBkYXRhKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTm90aWZ5IHRoZSBhcHAgZ2VuZXJhbGx5IHRoYXQgdGhlIHN0YXRlIGNoYW5nZWQgYW5kIHdoYXQgdGhlIG5ldyBzdGF0ZSBpcyBcbiAgICB0aGlzLnNlbmROb3RpZmljYXRpb24oU3RhdGVNYWNoaW5lLkNIQU5HRUQsIHRoaXMuZ2V0Q3VycmVudFN0YXRlKCksIHRoaXMuZ2V0Q3VycmVudFN0YXRlKCkubmFtZSk7XG59XG5cbi8qKlxuICogTm90aWZpY2F0aW9uIGludGVyZXN0cyBmb3IgdGhlIFN0YXRlTWFjaGluZS5cbiAqIEBtZXRob2QgbGlzdE5vdGlmaWNhdGlvbkludGVyZXN0c1xuICogQHJldHVybiB7QXJyYXl9IEFycmF5IG9mIE5vdGlmaWNhdGlvbnNcbiAqL1xuXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLmxpc3ROb3RpZmljYXRpb25JbnRlcmVzdHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICBTdGF0ZU1hY2hpbmUuQUNUSU9OLFxuICAgICAgICBTdGF0ZU1hY2hpbmUuQ0FOQ0VMXG4gICAgXTtcbn1cblxuLyoqXG4gKiBIYW5kbGUgbm90aWZpY2F0aW9ucyB0aGUgPGNvZGU+U3RhdGVNYWNoaW5lPC9jb2RlPiBpcyBpbnRlcmVzdGVkIGluLlxuICogPFA+XG4gKiA8Y29kZT5TdGF0ZU1hY2hpbmUuQUNUSU9OPC9jb2RlPjogVHJpZ2dlcnMgdGhlIHRyYW5zaXRpb24gdG8gYSBuZXcgc3RhdGUuPEJSPlxuICogPGNvZGU+U3RhdGVNYWNoaW5lLkNBTkNFTDwvY29kZT46IENhbmNlbHMgdGhlIHRyYW5zaXRpb24gaWYgc2VudCBpbiByZXNwb25zZSB0byB0aGUgZXhpdGluZyBub3RlIGZvciB0aGUgY3VycmVudCBzdGF0ZS48QlI+XG4gKlxuICogQG1ldGhvZCBoYW5kbGVOb3RpZmljYXRpb25cbiAqIEBwYXJhbSB7Tm90aWZpY2F0aW9ufSBub3RpZmljYXRpb25cbiAqIEByZXR1cm4gXG4gKi9cblN0YXRlTWFjaGluZS5wcm90b3R5cGUuaGFuZGxlTm90aWZpY2F0aW9uID0gZnVuY3Rpb24obm90aWZpY2F0aW9uKSB7XG4gICAgc3dpdGNoKG5vdGlmaWNhdGlvbi5nZXROYW1lKCkpIHtcbiAgICAgICAgY2FzZSBTdGF0ZU1hY2hpbmUuQUNUSU9OOlxuICAgICAgICAgICAgdmFyIGFjdGlvbiA9IG5vdGlmaWNhdGlvbi5nZXRUeXBlKCk7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5nZXRDdXJyZW50U3RhdGUoKS5nZXRUYXJnZXQoYWN0aW9uKTtcbiAgICAgICAgICAgIHZhciBuZXdTdGF0ZSA9IHRoaXMuc3RhdGVzW3RhcmdldF07XG4gICAgICAgICAgICBpZihuZXdTdGF0ZSkgdGhpcy50cmFuc2l0aW9uVG8obmV3U3RhdGUsIG5vdGlmaWNhdGlvbi5nZXRCb2R5KCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgY2FzZSBTdGF0ZU1hY2hpbmUuQ0FOQ0VMOlxuICAgICAgICAgICAgdGhpcy5jYW5jZWxlZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5cbi8qKlxuICogR2V0IHRoZSBjdXJyZW50IHN0YXRlLlxuICogQG1ldGhvZCBnZXRDdXJyZW50U3RhdGVcbiAqIEByZXR1cm4gYSBTdGF0ZSBkZWZpbmluZyB0aGUgbWFjaGluZSdzIGN1cnJlbnQgc3RhdGVcbiAqL1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5nZXRDdXJyZW50U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3Q29tcG9uZW50O1xufVxuXG4vKipcbiAqIFNldCB0aGUgY3VycmVudCBzdGF0ZS5cbiAqIEBtZXRob2Qgc2V0Q3VycmVudFN0YXRlXG4gKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZVxuICogQHJldHVybiBcbiAqL1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5zZXRDdXJyZW50U3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xuICAgIHRoaXMudmlld0NvbXBvbmVudCA9IHN0YXRlO1xufVxuXG4vKipcbiAqIE1hcCBvZiBTdGF0ZXMgb2JqZWN0cyBieSBuYW1lLlxuICovXG5TdGF0ZU1hY2hpbmUucHJvdG90eXBlLnN0YXRlcyA9IG51bGw7XG5cbi8qKlxuICogVGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIEZTTS5cbiAqL1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5pbml0aWFsID0gbnVsbDtcblxuLyoqXG4gKiBUaGUgdHJhbnNpdGlvbiBoYXMgYmVlbiBjYW5jZWxlZC5cbiAqL1xuU3RhdGVNYWNoaW5lLnByb3RvdHlwZS5jYW5jZWxlZCA9IG51bGw7XG4gICAgXG5TdGF0ZU1hY2hpbmUuTkFNRSA9IFwiU3RhdGVNYWNoaW5lXCI7XG5cbi8qKlxuICogQWN0aW9uIE5vdGlmaWNhdGlvbiBuYW1lLiBcbiAqLyBcblN0YXRlTWFjaGluZS5BQ1RJT04gPSBTdGF0ZU1hY2hpbmUuTkFNRSArIFwiL25vdGVzL2FjdGlvblwiO1xuXG4vKipcbiAqICBDaGFuZ2VkIE5vdGlmaWNhdGlvbiBuYW1lICBcbiAqLyBcblN0YXRlTWFjaGluZS5DSEFOR0VEID0gU3RhdGVNYWNoaW5lLk5BTUUgKyBcIi9ub3Rlcy9jaGFuZ2VkXCI7XG5cbi8qKlxuICogIENhbmNlbCBOb3RpZmljYXRpb24gbmFtZSAgXG4gKi8gXG5TdGF0ZU1hY2hpbmUuQ0FOQ0VMID0gU3RhdGVNYWNoaW5lLk5BTUUgKyBcIi9ub3Rlcy9jYW5jZWxcIjtcbiAgICBcbiAgICBcbi8qKlxuICogQ3JlYXRlcyBhbmQgcmVnaXN0ZXJzIGEgU3RhdGVNYWNoaW5lIGRlc2NyaWJlZCBpbiBKU09OLlxuICogXG4gKiA8UD5cbiAqIFRoaXMgYWxsb3dzIHJlY29uZmlndXJhdGlvbiBvZiB0aGUgU3RhdGVNYWNoaW5lIFxuICogd2l0aG91dCBjaGFuZ2luZyBhbnkgY29kZSwgYXMgd2VsbCBhcyBtYWtpbmcgaXQgXG4gKiBlYXNpZXIgdGhhbiBjcmVhdGluZyBhbGwgdGhlIDxjb2RlPlN0YXRlPC9jb2RlPiBcbiAqIGluc3RhbmNlcyBhbmQgcmVnaXN0ZXJpbmcgdGhlbSB3aXRoIHRoZSBcbiAqIDxjb2RlPlN0YXRlTWFjaGluZTwvY29kZT4gYXQgc3RhcnR1cCB0aW1lLlxuICogXG4gKiBAIHNlZSBTdGF0ZVxuICogQCBzZWUgU3RhdGVNYWNoaW5lXG4gKi9cblxuLyoqXG4gKiBDb25zdHJ1Y3RvclxuICogQG1ldGhvZCBGU01JbmplY3RvclxuICogQHBhcmFtIHtPYmplY3R9IGZzbSBKU09OIE9iamVjdFxuICogQHJldHVybiBcbiAqL1xuZnVuY3Rpb24gRlNNSW5qZWN0b3IoZnNtKSB7XG4gICAgcHVyZW12Yy5Ob3RpZmllci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuZnNtID0gZnNtO1xufVxuICBcbkZTTUluamVjdG9yLnByb3RvdHlwZSA9IG5ldyBwdXJlbXZjLk5vdGlmaWVyO1xuRlNNSW5qZWN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRlNNSW5qZWN0b3I7XG5cbi8qKlxuICogSW5qZWN0IHRoZSA8Y29kZT5TdGF0ZU1hY2hpbmU8L2NvZGU+IGludG8gdGhlIFB1cmVNVkMgYXBwYXJhdHVzLlxuICogPFA+XG4gKiBDcmVhdGVzIHRoZSA8Y29kZT5TdGF0ZU1hY2hpbmU8L2NvZGU+IGluc3RhbmNlLCByZWdpc3RlcnMgYWxsIHRoZSBzdGF0ZXNcbiAqIGFuZCByZWdpc3RlcnMgdGhlIDxjb2RlPlN0YXRlTWFjaGluZTwvY29kZT4gd2l0aCB0aGUgPGNvZGU+SUZhY2FkZTwvY29kZT4uXG4gKiBAbWV0aG9kIGluamVjdFxuICogQHJldHVybiBcbiAqL1xuRlNNSW5qZWN0b3IucHJvdG90eXBlLmluamVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIENyZWF0ZSB0aGUgU3RhdGVNYWNoaW5lXG4gICAgdmFyIHN0YXRlTWFjaGluZSA9IG5ldyBwdXJlbXZjLnN0YXRlbWFjaGluZS5TdGF0ZU1hY2hpbmUoKTtcbiAgICBcbiAgICAvLyBSZWdpc3RlciBhbGwgdGhlIHN0YXRlcyB3aXRoIHRoZSBTdGF0ZU1hY2hpbmVcbiAgICB2YXIgc3RhdGVzID0gdGhpcy5nZXRTdGF0ZXMoKTtcbiAgICBmb3IodmFyIGk9MDsgaTxzdGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RhdGVNYWNoaW5lLnJlZ2lzdGVyU3RhdGUoc3RhdGVzW2ldLCB0aGlzLmlzSW5pdGlhbChzdGF0ZXNbaV0ubmFtZSkpO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZWdpc3RlciB0aGUgU3RhdGVNYWNoaW5lIHdpdGggdGhlIGZhY2FkZVxuICAgIHRoaXMuZmFjYWRlLnJlZ2lzdGVyTWVkaWF0b3Ioc3RhdGVNYWNoaW5lKTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHN0YXRlIGRlZmluaXRpb25zLlxuICogPFA+XG4gKiBDcmVhdGVzIGFuZCByZXR1cm5zIHRoZSBhcnJheSBvZiBTdGF0ZSBvYmplY3RzIFxuICogZnJvbSB0aGUgRlNNIG9uIGZpcnN0IGNhbGwsIHN1YnNlcXVlbnRseSByZXR1cm5zXG4gKiB0aGUgZXhpc3RpbmcgYXJyYXkuPC9QPlxuICpcbiAqIEBtZXRob2QgZ2V0U3RhdGVzXG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgb2YgU3RhdGVzXG4gKi9cbkZTTUluamVjdG9yLnByb3RvdHlwZS5nZXRTdGF0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLnN0YXRlTGlzdCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuc3RhdGVMaXN0ID0gW107XG5cbiAgICAgICAgdmFyIHN0YXRlRGVmcyA9IHRoaXMuZnNtLnN0YXRlID8gdGhpcy5mc20uc3RhdGUgOiBbXTtcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8c3RhdGVEZWZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGVEZWYgPSBzdGF0ZURlZnNbaV07XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLmNyZWF0ZVN0YXRlKHN0YXRlRGVmKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVMaXN0LnB1c2goc3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YXRlTGlzdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgPGNvZGU+U3RhdGU8L2NvZGU+IGluc3RhbmNlIGZyb20gaXRzIEpTT04gZGVmaW5pdGlvbi5cbiAqIEBtZXRob2QgY3JlYXRlU3RhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZURlZiBKU09OIE9iamVjdFxuICogQHJldHVybiB7U3RhdGV9IFxuICovXG4vKipcblxuICovXG5GU01JbmplY3Rvci5wcm90b3R5cGUuY3JlYXRlU3RhdGUgPSBmdW5jdGlvbihzdGF0ZURlZikge1xuICAgIC8vIENyZWF0ZSBTdGF0ZSBvYmplY3RcbiAgICB2YXIgbmFtZSA9IHN0YXRlRGVmWydAbmFtZSddO1xuICAgIHZhciBleGl0aW5nID0gc3RhdGVEZWZbJ0BleGl0aW5nJ107XG4gICAgdmFyIGVudGVyaW5nID0gc3RhdGVEZWZbJ0BlbnRlcmluZyddO1xuICAgIHZhciBjaGFuZ2VkID0gc3RhdGVEZWZbJ0BjaGFuZ2VkJ107XG4gICAgdmFyIHN0YXRlID0gbmV3IHB1cmVtdmMuc3RhdGVtYWNoaW5lLlN0YXRlKG5hbWUsIGVudGVyaW5nLCBleGl0aW5nLCBjaGFuZ2VkKTtcbiAgICBcbiAgICAvLyBDcmVhdGUgdHJhbnNpdGlvbnNcbiAgICB2YXIgdHJhbnNpdGlvbnMgPSBzdGF0ZURlZi50cmFuc2l0aW9uID8gc3RhdGVEZWYudHJhbnNpdGlvbiA6IFtdO1xuICAgIGZvcih2YXIgaT0wOyBpPHRyYW5zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0cmFuc0RlZiA9IHRyYW5zaXRpb25zW2ldO1xuICAgICAgICBzdGF0ZS5kZWZpbmVUcmFucyh0cmFuc0RlZlsnQGFjdGlvbiddLCB0cmFuc0RlZlsnQHRhcmdldCddKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlO1xufVxuXG4vKipcbiAqIElzIHRoZSBnaXZlbiBzdGF0ZSB0aGUgaW5pdGlhbCBzdGF0ZT9cbiAqIEBtZXRob2QgaXNJbml0aWFsXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVOYW1lXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5GU01JbmplY3Rvci5wcm90b3R5cGUuaXNJbml0aWFsID0gZnVuY3Rpb24oc3RhdGVOYW1lKSB7XG4gICAgdmFyIGluaXRpYWwgPSB0aGlzLmZzbVsnQGluaXRpYWwnXTtcbiAgICByZXR1cm4gc3RhdGVOYW1lID09IGluaXRpYWw7XG59XG5cbi8vIFRoZSBKU09OIEZTTSBkZWZpbml0aW9uXG5GU01JbmplY3Rvci5wcm90b3R5cGUuZnNtID0gbnVsbDtcblxuLy8gVGhlIExpc3Qgb2YgU3RhdGUgb2JqZWN0c1xuRlNNSW5qZWN0b3IucHJvdG90eXBlLnN0YXRlTGlzdCA9IG51bGw7XG5cblxucHVyZW12Yy5zdGF0ZW1hY2hpbmUgPVxue1xuICAgIFN0YXRlOiBTdGF0ZVxuICAgICxcdFN0YXRlTWFjaGluZTogU3RhdGVNYWNoaW5lXG4gICAgLFx0RlNNSW5qZWN0b3I6IEZTTUluamVjdG9yXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmVtdmMuc3RhdGVtYWNoaW5lOyJdfQ==
