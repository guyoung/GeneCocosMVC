"use strict";

var AppFacade = require('./AppFacade.js');

(function() {

    var key = 'MVC_HELLOWORLD';
    AppFacade.getInstance(key).startup();
})();
