/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $*/

define(function (require, exports, module) {
    "use strict";

    var CommandManager      = brackets.getModule("command/CommandManager"),
        Menus               = brackets.getModule("command/Menus"),
        AppInit             = brackets.getModule("utils/AppInit"),
        Commands            = brackets.getModule("command/Commands"),
        _panel;

    /**
     * Show the iFrame Preview Pane
     */
    function show() {
        CommandManager.execute(Commands.CMD_SPLITVIEW_VERTICAL);
        _panel = $("#second-pane").empty();
    }

    /**
     * Hide the iFrame Preview Pane
     */
    function hide() {
        CommandManager.execute(Commands.CMD_SPLITVIEW_NONE);
    }

    /**
     * Function used to fill the iFrame with a blob
     * Takes in html with text! require statement
     */
    function fill(r_url) {
        var blob = new Blob([r_url], {type: "text/html"});
        var url = URL.createObjectURL(blob);
        $("<iframe>", {
            src: url,
            id:  "iFramePreviewPane",
            frameborder: 0,
        }).css({ "width":"100%", "height":"100%" }).appendTo(_panel);
    }
    /**
     * Runs the extension with the default iFrame and src
     */
    // Define public API
    exports.show = show;
    exports.hide = hide;
    exports.fill = fill;
});
