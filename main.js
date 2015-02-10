/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, browser: true */
/*global define, brackets */

define(function (require, exports, module) {
    "use strict";

    var AppInit              = brackets.getModule("utils/AppInit"),
        LiveDevServerManager = brackets.getModule("LiveDevelopment/LiveDevServerManager"),
        PreferencesManager   = brackets.getModule("preferences/PreferencesManager"),
        ProjectManager       = brackets.getModule("project/ProjectManager"),
        browser              = require("lib/iframe-browser");
        NoHostServer         = require("nohost/src/NoHostServer").NoHostServer;
    
    function _createServer() {
        var config = {
            pathResolver    : ProjectManager.makeProjectRelativeIfPossible,
            root            : ProjectManager.getProjectRoot().fullPath
        };
        
        return new NoHostServer(config);
    }

    AppInit.appReady(function () {
        // Flip livedev.multibrowser to true
        var prefs = PreferencesManager.getExtensionPrefs("livedev");
        prefs.set("multibrowser", true);

        // Register nohost server with highest priority
        LiveDevServerManager.registerServer({ create: _createServer }, 9001);

        // Turn preview iFrame On
        browser.browse();
    });
    
});
