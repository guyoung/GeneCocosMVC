"use strict";

var calcu = {
    add: function(a, b){
        return a + b;
    },
    subtract: function(a, b){
        return a - b;
    }
}
// 此处对外导出模块功能
module.exports = calcu;
  