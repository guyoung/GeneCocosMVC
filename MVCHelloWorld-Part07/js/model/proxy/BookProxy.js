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

