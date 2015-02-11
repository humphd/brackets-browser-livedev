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
console.log('here')
    // First, we configure brackets to run the experimental live dev
    // with our nohost server and iframe combination. This has to
    // occur before the project is loaded, triggering the start of
    // the live preview.
    AppInit.extensionsLoaded(function () {
console.log('extensionsLoaded');
        // Next, we wait until the LiveDevelopment module is initialized
        // so we can safely swap our transport and launcher modules for
        // the defaults.
        function _configureLiveDev() {
            console.log('_configureLiveDev');
            // We wait for Brackets to open our project as the last step in
            // its loading process.  At this point, we have already configured live preview
            // to use an iframe instead of a browser, and we have ensured that
            // a file exists to be opened as a project. Once it's opened, we can
            // start the live preview.
            function _beginLivePreview() {
                console.log('_beginLivePreview');
                // Set up our transport and plug it into live-dev
                PostMessageTransport.setIframe(Browser.getBrowserIframe());
                LiveDevelopment.setTransport(PostMessageTransport);

                // Set up our launcher in a similar manner
                LiveDevelopment.setLauncher(new Launcher({
                    browser: Browser,
                    server: _getServer()
                }));

                LiveDevelopment.open();
            }
            ProjectManager.one("projectOpen", _beginLivePreview);
        }
        LiveDevelopment.one("statusChange", _configureLiveDev);

        // Flip livedev.multibrowser to true
        var prefs = PreferencesManager.getExtensionPrefs("livedev");
        prefs.set("multibrowser", true);

        // Register nohost server with highest priority
        LiveDevServerManager.registerServer({ create: _getServer }, 9001);

        // Turn preview iFrame On
        Browser.init();
    });
});
