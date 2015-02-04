/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, appshell, $ */
define(function (require, exports, module) {
    "use strict";

    var BaseServer  = brackets.getModule("LiveDevelopment/Servers/BaseServer").BaseServer;

    var Content = require('content');
    var Handlers = require('handlers');

    var Filer = appshell.MakeDrive;
    var Path = Filer.Path;

    function NoHostServer(config) {
        config = config || {};
        BaseServer.call(this, config);
    }

    NoHostServer.prototype = Object.create(BaseServer.prototype);
    NoHostServer.prototype.constructor = NoHostServer;

    // TODO: I *think* I want to return these unmodified...
    NoHostServer.prototype.pathToUrl = function(path) {
        return path;
    };
    NoHostServer.prototype.urlToPath = function(url) {
        return url;
    };

    NoHostServer.prototype.start = function() {
        this.fs = Filer.fs();
    };

    NoHostServer.prototype.stop = function() {
        this.fs = null;
    };

    /**
     * Serve the contents of path, invoking the appropriate content handler.
     */
    NoHostServer.prototype.serve = function(path, callback) {
        var fs = this.fs;

        fs.stat(path, function(err, stats) {
            if(err) {
                return callback(err);
            }

            // If this is a dir, error
            if(stats.isDirectory()) {
                return callback(new Error('expected file path'));
            }

            // This is a file, pick the right content handler based on extension
            var ext = Path.extname(path);

            if(Content.isHTML(ext)) {
                Handlers.handleHTML(path, fs, callback);
            } else {
                Handlers.handleFile(path, fs, callback);
            }
        });
    };

    exports.NoHostServer = NoHostServer;
});
