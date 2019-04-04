"use strict";

export default class ModalWindow {
    constructor(content, buttonContent, buttonHandler) {
        this.content = content;
        this.buttonContent = buttonContent;
        this.buttonHandler = buttonHandler.bind(this);
    }

    create() {
        document.body.insertAdjacentHTML('afterBegin', '<div id="modal-window">' +
            '<div id="content">' + this.content + '</div>' +
            '<div id="button-panel">' +
            '<span id="button">' + this.buttonContent + '</span>' +
            '</div>' +
            '</div>' +
            '<div id="overlay"></div>');
        document.getElementById('button').addEventListener('click', this.buttonHandler);
    }

    destroy() {
        document.getElementById('modal-window').remove();
        document.getElementById('overlay').remove();
    }
}