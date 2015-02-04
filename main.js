/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, browser: true */
/*global define, brackets */

define(function (require, exports, module) {
    "use strict";

    var AppInit              = brackets.getModule("utils/AppInit"),
        ExtensionUtils       = brackets.getModule("utils/ExtensionUtils"),
        LiveDevServerManager = brackets.getModule("LiveDevelopment/LiveDevServerManager"),
        ProjectManager       = brackets.getModule("project/ProjectManager"),
        NoHostServer         = require("nohost/src/NoHostServer").NoHostServer;
    
    function _createServer() {
        var config = {
            pathResolver    : ProjectManager.makeProjectRelativeIfPossible,
            root            : ProjectManager.getProjectRoot().fullPath
        };
        
        return new NoHostServer(config);
    }

    AppInit.appReady(function () {
        LiveDevServerManager.registerServer({ create: _createServer }, 9001);
    });
    
});
