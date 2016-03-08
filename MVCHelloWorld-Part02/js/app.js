"use strict";

var calcu = require("./test/calcu.js");
var _ = require("underscore")._;

(function() {

    alert(calcu.add(8, 5));

    alert(calcu.subtract(8, 5));

    _.each([1, 2, 3], function (ele, idx) {
        alert(idx + ":" + ele);
    });

})();
