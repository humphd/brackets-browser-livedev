/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets: true, $*/

define(function (require, exports, module) {
    "use strict";

    var Menus       = brackets.getModule("command/Menus"),
        Resizer     = brackets.getModule("utils/Resizer"),
        UrlParams   = brackets.getModule("utils/UrlParams").UrlParams,
        StatusBar   = brackets.getModule("widgets/StatusBar"),
        Strings     = brackets.getModule("strings");

    var PhonePreview  = require("text!lib/Mobile.html");
    var PostMessageTransport = require("lib/PostMessageTransport");

    /**
     * This function calls all the hide functions and listens
     * for bramble to be loaded
     */
    function hide() {
        toggleMobileViewButton();

        if(shouldHideUI()) {
            removeMainToolBar();
            removeLeftSideToolBar();
            removeRightSideToolBar();
            removeTitleBar();
        }
    }

    /**
     * This function parses brackets URL, and looks for the GET parameter "ui"
     * if ui is set to 1, then the UI is shown
     */
    function shouldHideUI() {
        var params = new UrlParams();
        params.parse();
        return params.get("ui") !== "1";
    }

    /**
     * This function merely removes the left side tool bar
     */
    function removeLeftSideToolBar() {
        //Hide second pane working set list
        $("#working-set-list-second-pane").css({"visibility" : "hidden"});
        //Remove splitview button
        $("#sidebar .working-set-splitview-btn").remove();
        Resizer.hide("#sidebar");
    }

    /**
     * This function merely removes the title bar
     * and the header of the first pane
     */
    function removeTitleBar() {
        $("#titlebar").remove();
        $("#first-pane .pane-header").remove();
        //Alter the height of the affected elements
        $("#editor-holder").css({"height" : "96%"});
        $("#first-pane .pane-content, .cm-s-light-theme").css({"height": "100%"});
    }

    /**
     * Used to remove the top tool bar
     */
    function removeMainToolBar() {
        //remove the file menu
        Menus.removeMenu(Menus.AppMenuBar.FILE_MENU);

        //remove the edit menu
        Menus.removeMenu(Menus.AppMenuBar.EDIT_MENU);

        //remove the find menu
        Menus.removeMenu(Menus.AppMenuBar.FIND_MENU);

        //remove the view menu
        Menus.removeMenu(Menus.AppMenuBar.VIEW_MENU);

        //remove the navigate menu
        Menus.removeMenu(Menus.AppMenuBar.NAVIGATE_MENU);

        //remove the help menu
        Menus.removeMenu(Menus.AppMenuBar.HELP_MENU);
    }

    /**
     * Used to remove the right side tool bar
     */
    function removeRightSideToolBar() {
        Resizer.makeResizable("#main-toolbar");
        Resizer.hide("#main-toolbar");
        $(".content").css("right","0");
    }

    /**
     * Used to show the mobile view.
     */
    function showMobile() {
        $("#bramble-iframe-browser").addClass("phone-body");
        $("#second-pane").append(PhonePreview);
        $("#bramble-iframe-browser").appendTo("#phone-content");
        $("#second-pane").addClass("second-pane-scroll");
    }
    
    /**
     * Used to hide the mobile view.
     */
    function hideMobile() {
        $("#bramble-iframe-browser").appendTo("#second-pane");
        $(".phone-container").detach();
        $("#second-pane").removeClass("second-pane-scroll");
    }

    /**
     * Used to add a button to the status bar to toggle
     * between mobile view and desktop view.
     */
    function toggleMobileViewButton() {
        var isMobileViewOpen = false;

        var mobileView = Mustache.render("<div><a id='mobileViewButton' href=#></a></div>", Strings);
        StatusBar.addIndicator("mobileViewButtonBox", $(mobileView), true, "",
                               "Click to open preview in a mobile view", "status-overwrite");
        $("#mobileViewButton").addClass("mobileButton");

        $("#mobileViewButton").click(function () {
            PostMessageTransport.reload();

            if(!isMobileViewOpen) {
                // Switch the icon
                $("#mobileViewButton").removeClass("mobileButton");
                $("#mobileViewButton").addClass("desktopButton");
                // Updates the tooltip
                StatusBar.updateIndicator("mobileViewButtonBox", true, "", 
                                          "Click to open preview in a desktop view");

                showMobile();

                isMobileViewOpen = true;
            }
            else {
                // Switch the icon
                $("#mobileViewButton").removeClass("desktopButton");
                $("#mobileViewButton").addClass("mobileButton");
                // Updates the tooltip
                StatusBar.updateIndicator("mobileViewButtonBox", true, "", 
                                          "Click to open preview in a mobile view");

                hideMobile();

                isMobileViewOpen = false;
            }
        });
    }

    // Define public API
    exports.hide                   = hide;
    exports.removeLeftSideToolBar  = removeLeftSideToolBar;
    exports.removeMainToolBar      = removeMainToolBar;
    exports.removeRightSideToolBar = removeRightSideToolBar;
});
