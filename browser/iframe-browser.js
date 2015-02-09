define(function (require, exports, module) {
    "use strict";

    var CommandManager      = brackets.getModule("command/CommandManager"),
        MainViewManager     = brackets.getModule("view/MainViewManager"),
        Commands            = brackets.getModule("command/Commands"),
        _panel		        = null,
        horizontal          = true,
        vertical            = false;



    /*
     * Function that manages initial arguments
     * html: We are expecting the user to send us a url to the blob for use
     *      if undefined we will not fill the iframe with an src
     */
    function browse(html) {
        //Get current GUI layout
        var result = MainViewManager.getLayoutScheme();

        // If iframe does not exist, then show it
        if(result.rows === 1 && result.columns === 1) {
            _show();
        }
        // Fill the iframe with data
        _update(html);
    }

    /**
     * Show the default iFrame Preview Pane
     */
    function _show() {
        CommandManager.execute(Commands.CMD_SPLITVIEW_VERTICAL);
    }

    /*
     * Allows us to set the layout independent of the other functions
     */
    function setOrientation(orientation) {
        if(orientation) {
            CommandManager.execute(Commands.CMD_SPLITVIEW_HORIZONTAL);
        }
        else {
            CommandManager.execute(Commands.CMD_SPLITVIEW_VERTICAL);
        }
    }

    /**
     * Function used to fill the iFrame with a url
     * Takes in a url, and uses it as the iFrames src
     */
    function _update(url) {
        //Empty the Second Pane for use
        _panel = $("#second-pane").empty();

        // Make the iframe for the blob to live in
        var iframeConfig = {
            id: "bramble-iframe-browser",
            frameborder: 0
        };

        //If we were sent data, then make the iFrames' src of the url
        if(url) {
            iframeConfig.src = url;
        }

        //Append iFrame to _panel
        $("<iframe>", iframeConfig).css({"width":"100%", "height":"100%"}).appendTo(_panel);
    }

    // Define public API
    exports.browse = browse;
    exports.setOrientation = setOrientation;
    exports.HORIZONTAL_ORIENTATION = horizontal;
    exports.VERTICAL_ORIENTATION = vertical;
});
