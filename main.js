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
        browser              = require("lib/iframe-browser");
        LiveDevelopment      = brackets.getModule("LiveDevelopment/LiveDevMultiBrowser"),
        PostMessageTransport = require("lib/PostMessageTransport"),
        Launcher             = require("lib/Launcher"),
        NoHostServer         = require("nohost/src/NoHostServer").NoHostServer;

    var _server = new NoHostServer({
        pathResolver    : ProjectManager.makeProjectRelativeIfPossible,
        root            : ProjectManager.getProjectRoot().fullPath
    });

    function _getServer() {
        return _server;
    }

    // First, we configure brackets to run the experimental live dev
    // with our nohost server and iframe combination. This has to
    // occur before the project is loaded, triggering the start of
    // the live preview.
    AppInit.extensionsLoaded(function () {
        // Flip livedev.multibrowser to true
        var prefs = PreferencesManager.getExtensionPrefs("livedev");
        prefs.set("multibrowser", true);

        // Register nohost server with highest priority
        LiveDevServerManager.registerServer({ create: _getServer }, 9001);

        // Turn preview iFrame On
        browser.init();
    });

    // Next, we wait until the LiveDevelopment module is initialized
    // so we can safely swap our transport and launcher modules for
    // the defaults.
    function _configureLiveDev() {
        // Set up our transport and plug it into live-dev
        PostMessageTransport.setIframe(browser.getBrowserIframe());
        LiveDevelopment.setTransport(PostMessageTransport);

        // Set up our launcher in a similar manner
        LiveDevelopment.setLauncher(new Launcher({
            browser: browser,
            server: _server
        }));

        // Lastly, we wait for brackets to open our project as the last step in
        // its loading process.  At this point, we have already configured live preview
        // to use an iframe instead of a browser, and we have ensured that
        // a file exists to be opened as a project. Once it's opened, we can
        // start the live preview.
        function _beginLivePreview() {
            LiveDevelopment.open();
        }
        ProjectManager.one("projectOpen", _beginLivePreview);
    }
    LiveDevelopment.one("statusChange", _configureLiveDev);
});
