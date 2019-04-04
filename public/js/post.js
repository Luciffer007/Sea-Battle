"use strict";

export default function post(url, data = '') {
    return new Promise(function(success, error) {
        let request = new XMLHttpRequest();
        request.open("POST", url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("load", function() {
            if (request.status < 400)
                success(request.response);
            else
                error(new Error("Request failed: " + request.statusText));
        });
        request.addEventListener("error", function() {
            error(new Error("Network error"));
        });
        request.send(data);
    });
}