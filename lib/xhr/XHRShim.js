/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, forin: true, maxerr: 50, regexp: true */
/* global DOMParser */
(function(global) {
    "use strict";

    // This script requires access to the transport to send
    // file requests to the editor as commands
    var transport = global._Brackets_LiveDev_Transport;

    var XMLHttpRequest = global.XMLHttpRequest;
    if(!XMLHttpRequest) {
        return;
    }

    function sendMessage(msg) {
        if(!transport || !transport.send) {
            console.error("[Brackets LiveDev] No transport set");
            return;
        }

        transport.send(JSON.stringify(msg));
    }

    function XMLHttpRequestLiveDev() {
        var self = new XMLHttpRequest();
        var requestUrl;
        var abortCalled = false;

        var open = self.open;
        // The async parameter for XHRs to the local file system
        // is ignored as we cannot support synchronous requests
        // and async is implicit
        self.open = function(method, url, async, user, password) {
            if(url.indexOf("//") === -1) {
                requestUrl = url;
                abortCalled = false;
            } else {
                open.apply(self, arguments);
            }
        };

        var send = self.send;
        self.send = function() {
            if(!requestUrl) {
                send.apply(self, arguments);
                return;
            }

            function handleError(error) {
                if(typeof self.onerror === "function") {
                    return self.onerror(error);
                }
                console.error("[Brackets LiveDev] XMLHttpRequest error: ", error);
            }

            function setResponse(data) {
                if(data.error && !abortCalled) {
                    return handleError(data.error);
                }

                delete self.readyState;
                delete self.status;
                delete self.statusText;
                delete self.response;
                delete self.responseText;

                self.readyState = 4;
                self.status = 200;
                self.statusText = "OK";

                var responseType = self.responseType;
                if(!responseType || responseType === "") {
                    responseType = "text";
                }

                switch(responseType) {
                case "text":
                    self.response = data.content;
                    self.responseText = self.response;
                    break;
                case "document":
                    self.response = new DOMParser(data.content, data.mimeType);
                    break;
                case "json":
                    try {
                        self.response = JSON.parse(data.content);
                    } catch(e) {
                        handleError(e);
                        return;
                    }
                    break;
                default:
                    // TODO: We should support arraybuffers and blobs
                    handleError("Response type of " + responseType + " is not supported. Response type must be `text`, `document` or `json`.");
                    return;
                }

                if(typeof self.onreadystatechange === "function" && !abortCalled) {
                    self.onreadystatechange();
                }
                if(typeof self.onload === "function" && !abortCalled) {
                    // TODO: deal with addEventListener
                    self.onload();
                }
            }

            window.addEventListener("message", function(event) {
                var data = event.data;

                try {
                    data = JSON.parse(data);
                } catch(e) {
                    return;
                }

                if(data.method === "XMLHttpRequest") {
                    setResponse(data);
                }
            });

            sendMessage({
                method: "XMLHttpRequest",
                path: requestUrl
            });
        };

        var abort = self.abort;
        self.abort = function() {
            if(!requestUrl) {
                abort.apply(self);
                return;
            }

            abortCalled = true;
        };

        return self;
    }

    global.XMLHttpRequest = XMLHttpRequestLiveDev;

}(this));
