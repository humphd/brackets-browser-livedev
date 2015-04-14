/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets: true, $*/

define(function (require, exports, module) {
    "use strict";

    var Menus       = brackets.getModule("command/Menus"),
        Resizer     = brackets.getModule("utils/Resizer"),
        UrlParams   = brackets.getModule("utils/UrlParams").UrlParams;

    /**
     * This function calls all the hide functions and listens
     * for bramble to be loaded
     */
    function initUI() {
        if(shouldHideUI()) {
            removeMainToolBar();
            removeLeftSideToolBar();
            removeRightSideToolBar();
            removeTitleBar();
            addLivePreviewButton();
        }
    }

    /**
     * This function parses brackets URL, and looks for the GET parameter "ui"
     * if ui is set to 1, then the UI is shown
     */
    function shouldHideUI() {
        var params = new UrlParams();
        params.parse();
        return !(params.get("ui") === "1");
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
     * Used to add a button to the status bar for the
     * detached live preview.
     */
    function addLivePreviewButton() {
        $("#status-indicators").append("<button id=liveDevButton>Live Preview</button>");
        $("#liveDevButton").click(function () {
            // call function to open window
        });
    }

    // Define public API
    exports.initUI                 = initUI;
    exports.removeLeftSideToolBar  = removeLeftSideToolBar;
    exports.removeMainToolBar      = removeMainToolBar;
    exports.removeRightSideToolBar = removeRightSideToolBar;
});
