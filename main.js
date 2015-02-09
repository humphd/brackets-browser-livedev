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
        LiveDevelopment      = brackets.getModule("LiveDevelopment/LiveDevMultiBrowser"),
        // PostMessageTransport = require("LiveDevelopment/MultiBrowserImpl/transports/PostMessageTransport"),
        NoHostServer         = require("nohost/src/NoHostServer").NoHostServer;

    function _createServer() {
        var config = {
            pathResolver    : ProjectManager.makeProjectRelativeIfPossible,
            root            : ProjectManager.getProjectRoot().fullPath
        };

        return new NoHostServer(config);
    }

    function _configureIframeForUse() {
        // Set transport
            // PostMessageTransport.setIframe(browser.getIframe());
            // LiveDevelopment.setTransport(PostMessageTransport);
    }
    LiveDevelopment.one("statusChange", _configureIframeForUse);

    function _beginLivePreview() {
        // LiveDevelopment.open()
    }
    ProjectManager.one("projectOpen", _beginLivePreview);

    AppInit.extensionsLoaded(function () {
        // Flip livedev.multibrowser to true
        var prefs = PreferencesManager.getExtensionPrefs("livedev");
        prefs.set("multibrowser", true);

        // Register nohost server with highest priority
        LiveDevServerManager.registerServer({ create: _createServer }, 9001);

        // Turn preview iFrame On
        browser.browse();
    });

        // XXXnote: This block of code will need to live in a Launcher of some
        //          kind. It appears like the Brackets team were wanting to
        //          add multiple launchers, which would make sense for multiple
        //          transports. We might want to consider patching LiveDevMultBrowser
        //          to allow setting the launcher as well as the transport, and adding
        //          a launcher of our own rather than hacking on theirs.

        // // send instrumented response or null to fallback to static file
        // if (liveDocument && liveDocument.getResponseData) {
        //     response = liveDocument.getResponseData();
        // } else {
        //     response = {};  // let server fall back on loading file off disk
        // }
        // response.id = request.id;

        // this._send(request.location, response);


});
