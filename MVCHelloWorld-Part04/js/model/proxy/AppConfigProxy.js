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

