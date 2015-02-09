define(function (require, exports, module) {
    "use strict";

    var CommandManager      = brackets.getModule("command/CommandManager"),
        MainViewManager     = brackets.getModule("view/MainViewManager"),
        Commands            = brackets.getModule("command/Commands");
    // Orientation
    var VERTICAL_ORIENTATION    = 0,
        HORIZONTAL_ORIENTATION  = 1;
    // by default we use vertical orientation
    var _orientation = VERTICAL_ORIENTATION;


    /*
     * Function that manages initial arguments
     * html: We are expecting the user to send us a url to the blob for use
     *      if undefined we will not fill the iframe with an src
     */
    function browse(url) {
        //Get current GUI layout
        var result = MainViewManager.getLayoutScheme();

        // If iframe does not exist, then show it
        if(result.rows === 1 && result.columns === 1) {
            setOrientation(_orientation);
        }
        // Fill the iframe with data
        _update(url);
    }

    /*
     * Allows us to set the layout independent of the other functions
     */
    function setOrientation(orientation) {
        if(orientation === VERTICAL_ORIENTATION) {
            CommandManager.execute(Commands.CMD_SPLITVIEW_VERTICAL);
        }
        else if (orientation === HORIZONTAL_ORIENTATION) {
            CommandManager.execute(Commands.CMD_SPLITVIEW_HORIZONTAL);
        }
    }

    /**
     * Function used to fill the iFrame with a url
     * Takes in a url, and uses it as the iFrames src
     */
    function _update(url) {
        //Empty the Second Pane for use
        var _panel = $("#second-pane").empty();

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

    // Return reference to iframe element or null if not available.
    function getBrowserIFrame() {
        return document.getElementById("bramble-iframe-browser");
    }

    // Define public API
    exports.browse = browse;
    exports.setOrientation = setOrientation;
    // Expose these constants on our module, so callers can use them with setOrientation()
    exports.HORIZONTAL_ORIENTATION = HORIZONTAL_ORIENTATION;
    exports.VERTICAL_ORIENTATION = VERTICAL_ORIENTATION;
    exports.getBrowserIFrame = getBrowserIFrame;
});
