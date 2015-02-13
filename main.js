/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, browser: true */
/*global define, brackets */

/**
 * This extension provides in-editor livepreview through an iframe,
 * and leverages the experimental Multi Browser implementation of brackets
 * (see https://github.com/adobe/brackets/tree/master/src/LiveDevelopment/MultiBrowserImpl)
 */
define(function (require, exports, module) {
    "use strict";

    var AppInit              = brackets.getModule("utils/AppInit"),
        LiveDevServerManager = brackets.getModule("LiveDevelopment/LiveDevServerManager"),
        PreferencesManager   = brackets.getModule("preferences/PreferencesManager"),
        ProjectManager       = brackets.getModule("project/ProjectManager"),
        Browser              = require("lib/iframe-browser"),
        LiveDevelopment      = brackets.getModule("LiveDevelopment/LiveDevMultiBrowser"),
        PostMessageTransport = require("lib/PostMessageTransport"),
        Launcher             = require("lib/Launcher").Launcher,
        NoHostServer         = require("nohost/src/NoHostServer").NoHostServer;

    var _server;

    function _getServer() {
        if (!_server) {
            _server = new NoHostServer({
                pathResolver    : ProjectManager.makeProjectRelativeIfPossible,
                root            : ProjectManager.getProjectRoot()
            });
        }
        return _server;
    }

    // We wait until the LiveDevelopment module is initialized and the project loaded
    // so we can safely swap our transport and launcher modules for
    // the defaults and start LiveDev.
    function _configureLiveDev() {
        // Turn preview iFrame On
        Browser.init();

        function _configureModules() {
            // Set up our transport and plug it into live-dev
            PostMessageTransport.setIframe(Browser.getBrowserIFrame());
            LiveDevelopment.setTransport(PostMessageTransport);

            // Set up our launcher in a similar manner
            // XXXhumph - this depends on setLauncher() from https://github.com/adobe/brackets/pull/10558
            LiveDevelopment.setLauncher(new Launcher({
                browser: Browser,
                server: _getServer()
            }));

            LiveDevelopment.open();
        }
        LiveDevelopment.one("statusChange", _configureModules);
    }
    ProjectManager.one("projectOpen", _configureLiveDev);

    // We configure Brackets to run the experimental live dev
    // with our nohost server and iframe combination. This has to
    // occur before the project is loaded, triggering the start of
    // the live preview.
    AppInit.extensionsLoaded(function () {
        // Flip livedev.multibrowser to true
        var prefs = PreferencesManager.getExtensionPrefs("livedev");
        prefs.set("multibrowser", true);

        // Register nohost server with highest priority
        LiveDevServerManager.registerServer({ create: _getServer }, 9001);
    });
});
