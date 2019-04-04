"use strict";

export default class BattleField {
    constructor(fieldID, sideConflict) {
        this.sideConflict = sideConflict;
        this.fieldElement = document.getElementById(fieldID);
    }

    create (shotHandler) {
        /* Create top header */
        this.fieldElement.insertAdjacentHTML('beforeEnd', '<div class="header"></div>');
        for (let i = 65; i < 75; i++) {
            this.fieldElement.insertAdjacentHTML('beforeEnd', '<div class="header">' + String.fromCharCode(i) + '</div>');
        }

        /* Create the rest part of the field */
        for (let i = 0; i < 110; i++) {
            if (i % 11) {
                if (this.sideConflict == 'friend')
                    this.fieldElement.insertAdjacentHTML('beforeEnd', '<div class="sea" rowIndex="' + Math.trunc(i / 11) + '" columnIndex="' + (i % 11 - 1) + '"></div>');
                else
                    this.fieldElement.insertAdjacentHTML('beforeEnd', '<div class="not-checked" rowIndex="' + Math.trunc(i / 11) + '" columnIndex="' + (i % 11 - 1) + '"></div>');
            } else {
                this.fieldElement.insertAdjacentHTML('beforeEnd', '<div class="header">' + Math.trunc(i / 11 + 1) + '</div>');
            }
        }

        /* Installing an event handler */
        if (this.sideConflict == 'enemy') {
            this.fieldElement.setAttribute('status', 'enable');
            this.fieldElement.addEventListener('click', shotHandler);
        }
    }

    placementShips (battleField) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (battleField[i][j] == 'ship')
                    this.fieldElement.querySelector('div[rowIndex="' + i + '"][columnIndex="' + j + '"]').setAttribute('class', 'ship');
            }
        }
    }

    update () {
        if (this.sideConflict == 'friend') {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let cell = this.fieldElement.querySelector('div[rowIndex="' + i + '"][columnIndex="' + j + '"]');
                    cell.innerHTML = '';
                    cell.setAttribute('class', 'sea');
                }
            }
        } else {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let cell = this.fieldElement.querySelector('div[rowIndex="' + i + '"][columnIndex="' + j + '"]');
                    cell.innerHTML = '';
                    cell.setAttribute('class', 'not-checked');
                }
            }
        }
    }
}