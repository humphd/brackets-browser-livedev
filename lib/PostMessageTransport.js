/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, forin: true, maxerr: 50, regexp: true */
/*global define, brackets*/

// This transport provides a PostMessage connection between Brackets and a live browser preview.

define(function (require, exports, module) {
    "use strict";

    var Launcher = require("./launcher");

    var _iframeRef,
        connId = 1;
    
    var EventDispatcher         = brackets.getModule("utils/EventDispatcher"),
        LiveDevMultiBrowser     = brackets.getModule("LiveDevelopment/LiveDevMultiBrowser");
    
    // The script that will be injected into the previewed HTML to handle the other side of the post message connection.
    var PostMessageTransportRemote = require("text!lib/PostMessageTransportRemote.js");

    EventDispatcher.makeEventDispatcher(module.exports);
    
    /**
     * Saves a reference of the iframe element to a local variable
     * @param {DOM element reference to an iframe}
     */
    function setIframe(iframeRef) {
        if(iframeRef) {
            _iframeRef = iframeRef;
        }
    }

    /**
    * Message event listener
    */
    function _listener(event){
        var msgObj;
        try {
            msgObj = JSON.parse(event.data);
        } catch (e) {
            return;
        }

        if(msgObj.type === "message"){
            //trigger message event
            module.exports.trigger("message", [connId, msgObj.message]);
        }
    }

    /**
    * Initializes the post message connection
    */
    function start(){
        window.addEventListener("message", _listener);
    }

    /**
     * Sends a transport-layer message via post message.
     * @param {number|Array.<number>} idOrArray A client ID or array of client IDs to send the message to.
     * @param {string} msgStr The message to send as a JSON string.
     */
    function send(idOrArray, msgStr){
        var win = _iframeRef.contentWindow;

        // Parse msgStr and check to see if it's a reload command.
        // If so, trigger launcher.launch and return
        var msg = JSON.parse(msgStr);

        if(msg.method === "Page.reload" || msg.method === "Page.navigate") {
            reload();
            return;
        }

        win.postMessage(msgStr,"*");
    }

    /**
    * Removes the message event listener
    */
    function close(clientId){
        window.removeEventListener("message", _listener);
    }

    /**
     * Returns the script that should be injected into the browser to handle the other end of the transport.
     * @return {string}
     */
    function getRemoteScript() {
        return "<script>\n" +
            PostMessageTransportRemote +
            "</script>\n";
    }

    function reload() {
        var launcher = Launcher.getCurrentInstance();
        var liveDoc  = LiveDevMultiBrowser._getCurrentLiveDoc();

        if(liveDoc.doc.language.getId() === "html"){
            launcher.launch(liveDoc.doc.file.fullPath);
        }
    }
    
    // Exports
    module.exports.getRemoteScript = getRemoteScript;
    module.exports.setIframe       = setIframe;
    module.exports.start           = start;
    module.exports.send            = send;
    module.exports.close           = close;
    module.exports.reload          = reload;
});
