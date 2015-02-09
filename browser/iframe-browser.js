define(function (require, exports, module) {
    "use strict";

    var CommandManager      = brackets.getModule("command/CommandManager"),
        Menus               = brackets.getModule("command/Menus"),
        MainViewManager     = brackets.getModule("view/MainViewManager"),
        Commands            = brackets.getModule("command/Commands"),
        _panel		        = null;



    /*
     * Function that manages initial arguments
     * html: We are expecting the user to send us a packaged blob object for use
     *      if undefined we will not fill the iframe with an src
     * vertical: We are expecting a boolean value, true for vert, false for horizontal
     *      if vertical, we will display the sidepanel vertically with the html sent
     *      if horizontal, we will display the sidepanel horizontally with the html sent
     *      if undefinied, we will default to vertical layout
     */
    function browse(html, vertical) {
        /*
         *Retrieve Current layout State
         *result has 2 values in it, row and column
         *these together will help us get what kind of layout the application is currenlty in
         */

         /*
          * Retrieving Current Layout State
          *     Will return 2 values, row and column
          *     These refer to the current layout state, (no split, split vert, split hori)
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
     * Takes in a blob object, and uses it as the iFrames src
     */
    function update(url) {
        //Empty the Second Pane for use
        _panel      = $("#second-pane").empty();
        //If we were not sent any data in r_url, merely make the iFrame
        if(url === undefined) {
            $("<iframe>", {
                id:  "bramble-iframe-browser",
                frameborder: 0,
            }).css({ "width":"100%", "height":"100%" }).appendTo(_panel);
        }
        //If we were sent data, then put that in the iFrame
        else {
            var urlObj     = URL.createObjectURL(url);
            $("<iframe>", {
                src: urlObj,
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
