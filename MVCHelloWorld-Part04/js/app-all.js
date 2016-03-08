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
},{"./controller/command/StartupCommand.js":7,"puremvc":16}],2:[function(require,module,exports){
"use strict";

var AppFacade = require('./AppFacade.js');

(function() {

    var key = 'MVC_HELLOWORLD';
    AppFacade.getInstance(key).startup();
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

},{"./../../profile/flow/SceneFsm.js":10,"puremvc":16}],4:[function(require,module,exports){
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

},{"puremvc":16}],5:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var AppConfigProxy = require('./../../model/proxy/AppConfigProxy');

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

            this.facade.registerProxy( new AppConfigProxy() );
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepModelCommand'
    }
);

},{"./../../model/proxy/AppConfigProxy":8,"puremvc":16}],6:[function(require,module,exports){
"use strict";

var puremvc = require('puremvc').puremvc;
var AppMediator = require('./../../view/mediator/AppMediator.js');

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

            this.facade.registerMediator( new AppMediator() );
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepViewCommand'
    }
);

},{"./../../view/mediator/AppMediator.js":13,"puremvc":16}],7:[function(require,module,exports){
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

},{"./InjectFSMCommand.js":3,"./PrepControllerCommand.js":4,"./PrepModelCommand.js":5,"./PrepViewCommand.js":6,"puremvc":16}],8:[function(require,module,exports){
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


},{"puremvc":16}],9:[function(require,module,exports){
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
},{"GeneJS":15}],10:[function(require,module,exports){
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
},{"./SceneAction.js":9,"./SceneState.js":11,"./SceneTransition.js":12,"GeneJS":15}],11:[function(require,module,exports){
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
},{"GeneJS":15}],12:[function(require,module,exports){
var GeneJS = require('GeneJS');

// Transition 转变
var SceneTransition = GeneJS.Class({

});


exports.SceneTransition = SceneTransition;
},{"GeneJS":15}],13:[function(require,module,exports){
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

},{"puremvc":16}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
var GeneJS = {
    Class: require('./easejs.js').Class
};

module.exports = GeneJS;
},{"./easejs.js":14}],16:[function(require,module,exports){
exports.puremvc = require("./lib/puremvc-1.0.1-mod.js");
exports.puremvc.statemachine = require("./lib/puremvc-statemachine-1.0-mod.js");
},{"./lib/puremvc-1.0.1-mod.js":17,"./lib/puremvc-statemachine-1.0-mod.js":18}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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
},{"./puremvc-1.0.1-mod.js":17}]},{},[2]);
