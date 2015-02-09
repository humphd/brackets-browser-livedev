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
     * Publicly avaialble function used to create an iframe within the second-panel
     * url: Takes one argument of a url to a blob for the _update() function to use 
     *      - if undefined we will not fill the iframe with an src
     */
    function browse(url) {
        //Get current GUI layout
        var result = MainViewManager.getLayoutScheme();

        // If iframe does not exist, then show it
        if(result.rows === 1 && result.columns === 1) {
            setOrientation(_orientation);
        }
        // Call function that is used to create the iframe and fill it with url
        _update(url);
    }

    /*
     * Publicly available function used to change the orientation of the panel
     * orientation: Takes one argument of either VERTICAL_ORIENTATION OR
     * HORIZONTAL_ORIENTATION and uses that to change the layout accordingly
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
     * Function used to interact with the second-pane
     * In which our iFrame will exists and will be filled
     * with the url that has been passed to this function
     */
    function _update(url) {
        // Empty all contents of #second-pane
        var _panel = $("#second-pane").empty();

        // Create the iFrame for the blob to live in
        var iframeConfig = {
            id: "bramble-iframe-browser",
            frameborder: 0
        };

        // If url has been sent, make the iFrames' src that of the url
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
    exports.getBrowserIFrame = getBrowserIFrame;
    // Expose these constants on our module, so callers can use them with setOrientation()
    exports.HORIZONTAL_ORIENTATION = HORIZONTAL_ORIENTATION;
    exports.VERTICAL_ORIENTATION = VERTICAL_ORIENTATION;
    exports.setOrientation = setOrientation;
    
});
