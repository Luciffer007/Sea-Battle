"use strict";

export default class BattleField {
    constructor(fieldID, sideConflict) {
        this.fieldID = fieldID;
        this.sideConflict = sideConflict;
    }

    create () {
        let field = document.getElementById(this.fieldID);

        /* Create top header */
        field.insertAdjacentHTML('beforeEnd', '<div class="header"></div>');
        for (let i = 65; i < 75; i++) {
            field.insertAdjacentHTML('beforeEnd', '<div class="header">' + String.fromCharCode(i) + '</div>');
        }


        /* Create the rest part of the field */
        for (let i = 0; i < 110; i++) {
            if (i % 11) {
                if (this.sideConflict == 0)
                    field.insertAdjacentHTML('beforeEnd', '<div class="sea" rowIndex="' + Math.trunc(i / 11) + '" columnIndex="' + (i % 11 - 1) + '"></div>');
                else
                    field.insertAdjacentHTML('beforeEnd', '<div class="not-checked" rowIndex="' + Math.trunc(i / 11) + '" columnIndex="' + (i % 11 - 1) + '"></div>');
            } else {
                field.insertAdjacentHTML('beforeEnd', '<div class="header">' + Math.trunc(i / 11 + 1) + '</div>');
            }
        }

        /* Installing an event handler */
        if (this.sideConflict == 1)
            field.addEventListener('click', makeShot);
    }

    placementShips () {
        /* Request to the server about the placement of friendly ships*/
        let fieldID = this.fieldID;
        let request = new XMLHttpRequest();
        request.open('POST', '/preparation', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            let battleField = JSON.parse(request.responseText);
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (battleField[i][j] == 'ship')
                        document.querySelector('#' + fieldID + ' div[rowIndex="' + i + '"][columnIndex="' + j + '"]').setAttribute('class', 'ship');
                }
            }
        });
        request.send();
    }
}

function makeShot(event) {
    let target = event.target;
    if (target.getAttribute('class') == 'not-checked') {
        /* Sending shot coordinates to server */
        let coordinates = JSON.stringify({rowIndex: target.getAttribute('rowIndex'), columnIndex: target.getAttribute('columnIndex')});

        let request = new XMLHttpRequest();
        request.open('POST', '/shot', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            /* Processing the result of the shot */
            let result = JSON.parse(request.responseText);
            if (result == 'hit') {
                /* Hit */
                target.removeAttribute('class');
                target.setAttribute('class', 'ship');
                target.insertAdjacentHTML('beforeEnd', '<div class="hit"></div>');
            } else {
                /* Miss */
                target.removeAttribute('class');
                target.setAttribute('class', 'sea');
                target.insertAdjacentHTML('beforeEnd', '<div class="miss"></div>');
            }
        });
        request.send(coordinates);
    }
}






