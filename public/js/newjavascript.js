"use strict";

(function () {
    function createField(fieldID) {
        var field = document.getElementById(fieldID);

        /* Create top header */
        field.insertAdjacentHTML('beforeEnd', '<div class="header"></div>');
        for (let i = 65; i < 75; i++) {
            field.insertAdjacentHTML('beforeEnd', '<div class="header">' + String.fromCharCode(i) + '</div>');
        }


        /* Create the rest part of the field */
        for (let i = 0; i < 110; i++) {
            if (i % 11) {
                field.insertAdjacentHTML('beforeEnd', '<div class="not-checked" id="' + fieldID + '-' + Math.trunc(i / 11) + (i % 11 - 1) + '"></div>');
            } else {
                field.insertAdjacentHTML('beforeEnd', '<div class="header">' + Math.trunc(i / 11 + 1) + '</div>');
            }
        }

        /* Installing an event handler */
        field.addEventListener('click', checkCell);
    }

    function checkCell(event) {
        if (event.target.getAttribute('class') == 'not-checked') {
            if (event.target.hasAttribute('ship')) {
                /* Hit */
                event.target.removeAttribute('class');
                event.target.setAttribute('class', 'ship');
                event.target.insertAdjacentHTML('beforeEnd', '<div class="hit"></div>');
            } else {
                /* Miss */
                event.target.removeAttribute('class');
                event.target.setAttribute('class', 'sea');
                event.target.insertAdjacentHTML('beforeEnd', '<div class="miss"></div>');
            }
        }
    }

    /* Placement of ships on the field */
    function putShips(fieldID) {
        let ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
        let tempFlag = false;
        let rowIndex;
        let columnIndex;
        let direction;

        while (tempFlag == false) {
            rowIndex = getRandomInt(0, 9);
            columnIndex = getRandomInt(0, 9);
            direction = getRandomInt(0, 1);
            tempFlag = putShip(4, fieldID, rowIndex, columnIndex, direction);
        }
    }

    function putShip(typeShip, fieldID, rowIndex, columnIndex, direction) {
        let cellField = getCellField(fieldID, rowIndex, columnIndex);
        if (cellField.hasAttribute('ship')) return false;
        cellField.setAttribute('ship', '');

        if (typeShip > 1) {
            if (direction == 0) {
                if (columnIndex < (typeShip - 1)) {
                    for (let i = 0; i < (typeShip - 1); i++) {
                        getCellField(fieldID, rowIndex, ++columnIndex).setAttribute('ship', '');
                    }
                } else {
                    for (let i = 0; i < (typeShip - 1); i++) {
                        getCellField(fieldID, rowIndex, --columnIndex).setAttribute('ship', '');
                    }
                }
            } else {
                if (rowIndex < (typeShip - 1)) {
                    for (let i = 0; i < (typeShip - 1); i++) {
                        getCellField(fieldID, ++rowIndex, columnIndex).setAttribute('ship', '');
                    }
                } else {
                    for (let i = 0; i < (typeShip - 1); i++) {
                        getCellField(fieldID, --rowIndex, columnIndex).setAttribute('ship', '');
                    }
                }
            }
        }
        return true;
    }

    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCellField(fieldID, rowIndex, columnIndex) {
        let cellID = fieldID + '-' + String(rowIndex) + String(columnIndex);
        return document.getElementById(cellID);
    }

    createField('my-fleet');
    putShips('my-fleet');

    createField('enemy-fleet');
    putShips('enemy-fleet');
}());






