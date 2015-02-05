/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, appshell */
define(function (require, exports, module) {
    "use strict";

    var BaseServer  = brackets.getModule("LiveDevelopment/Servers/BaseServer").BaseServer;

    var Content = require("nohost/src/content");
    var Handlers = require("nohost/src/handlers");
    var Rewriter = require("nohost/src/rewriter");

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
     * Serve the contents of a path into the filesystem,
     * invoking the appropriate content handler, and rewriting any resources
     * in the local filesystem to Blob URLs.
     */
    NoHostServer.prototype.servePath = function(path, callback) {
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

    /**
     * Serve an existing HTML fragment/file (i.e., one that has already been read
     * for a given path) from the local filesystem, rewriting any resources
     * in the local filesystem to Blob URLs. The original path of the file is needed
     * in order to locate other resources with paths relative to this file.
     */
    NoHostServer.prototype.serveHTML = function(html, path, callback) {
        var fs = this.fs;

        Rewriter.rewriteHTML(html, path, fs, function(err, rewrittenHTML) {
            if(err) {
                Log.error('unable to rewrite HTML for `' + path + '`');
                // TODO: best way to deal with error here? 500?
                return handle404(path, callback);
            }

            callback(null, rewrittenHTML);
        });
    };

    exports.NoHostServer = NoHostServer;
});
