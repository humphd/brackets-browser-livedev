/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, forin: true, maxerr: 50, regexp: true */
/*global define */

// This transport provides a PostMessage connection between Brackets and a live browser preview.

define(function (require, exports, module) {
    "use strict";

    var _iframeRef;
    
    var EventDispatcher = require("utils/EventDispatcher");
    
    // The script that will be injected into the previewed HTML to handle the other side of the post message connection.
    var PostMessageTransportRemote = require("text!PostMessageTransportRemote.js");

    EventDispatcher.makeEventDispatcher(exports);
    
    /**
     * Saves a reference of the iframe element to a local variable
     * @param {jQuery reference}
     */
    function setIframe($ref){
        if($ref)
            _iframeRef = $ref;
    }

    /**
    * Initializes the post message connection
    */
    function start(){
        var win = _iframeRef.get(0).contentWindow;

        _iframeRef.on("load", function() {
            win.postMessage("initial message", "*");
        });

        window.addEventListener("message", function(event){
            var msgObj;
            try {
                msgObj = JSON.parse(event.data);
            } catch (e) {
                console.error("PostMessageTransport: Error parsing message: " + event.data);
                return;
            }
            
            if(msgObj.type === "connect"){
                if (!msgObj.url) {
                console.error("PostMessageTransport: Malformed connect message: " + event.data);
                return;
                }

                //trigger connect event
                exports.emitEvent("PostMessageTransport", "connect", [1, msgObj.url]);
            }else if(msgObj.type === "message"){

                //trigger message event
                exports.emitEvent("PostMessageTransport", "message", [1, msgObj.message]);
            }
        });
    }

    /**
     * Sends a transport-layer message via post message.
     * @param {number|Array.<number>} idOrArray A client ID or array of client IDs to send the message to.
     * @param {string} msgStr The message to send as a JSON string.
     */
    function send(idOrArray, msgStr){
        var win = _iframeRef.get(0).contentWindow;
        _iframeRef.on("load", function() {
            win.postMessage(
            msgStr,
            "*"
            );
        });
    }

    /**
    * Closes the connection
    */
    function close(clientId){
        //empty
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
    
    // Exports
    exports.getRemoteScript = getRemoteScript;
    exports.setIframe       = setIframe;
    exports.start           = start;
    exports.send            = send;
    exports.close           = close;
});
