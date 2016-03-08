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

