/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $*/

define(function (require, exports, module) {
    "use strict";

    var CommandManager      = brackets.getModule("command/CommandManager"),
        Menus               = brackets.getModule("command/Menus"),
        MainViewManager     = brackets.getModule("view/MainViewManager"),
        Commands            = brackets.getModule("command/Commands"),
        _panel		        = null;



    /*
     * Function that manages intialial arguments
     * url refers to the html we will be using to fill the second iframe
     * if url is empty, then we'll still display the iFrame, we just won't fill in the src
     * While vertical refers to which format the second iFrame will take, either vertical or horizontal
     * If vert is undefined then we'll default to  either showing vertical panel, 
     *      or updating the current content of the second iframe
     */
    function browse(html, vertical) {
        /*
         *Retrieve Current layout State
         *result has 2 values in it, row and column
         *these together will help us get what kind of layout the application is currenlty in
         */
        var result = MainViewManager.getLayoutScheme();
        //If undefined do some checking to figure out what to do
        if(vertical === undefined) {
            // If the split does not exist, create default Vertical Split
            if(result.rows === 1 && result.columns === 1) {
                show(html, true);
            }
            //If Split Does exist, and its Vertical Update
            else if(result.rows === 1 && result.columns === 2) {
                update(html);
            }
            //If Split Does exist, and its Horizontal Update
            else if (result.rows === 2 && result.columns === 1) {
                update(html);
            }
        }
        //If vertical is defined, merely show a view with the settings sent
        else {
            show(html, vertical);
        }
    }

    /**
     * Show the iFrame Preview Pane
     */
    function show(html, vertical) {
        //Depending vertical value, pop out a splitview of vert or hori
        if(vertical) {
            CommandManager.execute(Commands.CMD_SPLITVIEW_VERTICAL);
        }
        else {
            CommandManager.execute(Commands.CMD_SPLITVIEW_HORIZONTAL);
        }
        //Send url to update to update the iFrames data
        update(html);
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
    function update(r_url) {
        //Empty the Second Pane for use
        _panel      = $("#second-pane").empty();
        //If we were not sent any data in r_url, merely make the iFrame
        if(r_url === undefined) {
            $("<iframe>", {
                id:  "bramble-iframe-browser",
                frameborder: 0,
            }).css({ "width":"100%", "height":"100%" }).appendTo(_panel);
        }
        //If we were sent data, then put that in the iFrame
        else {
            var blob    = new Blob([r_url], {type: "text/html"});
            var url     = URL.createObjectURL(blob);
            $("<iframe>", {
                src: url,
                id:  "bramble-iframe-browser",
                frameborder: 0,
            }).css({ "width":"100%", "height":"100%" }).appendTo(_panel);
        }
    }
    /**
     * Runs the extension with the default iFrame and src
     */
    // Define public API
    exports.browse = browse;
});
