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

