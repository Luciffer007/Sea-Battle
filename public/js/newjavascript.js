"use strict";

(function () {
    function createField(fieldID, side) {
        var field = document.getElementById(fieldID);

        /* Create top header */
        field.insertAdjacentHTML('beforeEnd', '<div class="header"></div>');
        for (let i = 65; i < 75; i++) {
            field.insertAdjacentHTML('beforeEnd', '<div class="header">' + String.fromCharCode(i) + '</div>');
        }


        /* Create the rest part of the field */
        for (let i = 0; i < 110; i++) {
            if (i % 11) {
                if (side == 0)
                    field.insertAdjacentHTML('beforeEnd', '<div class="sea" id="' + fieldID + '-' + Math.trunc(i / 11) + (i % 11 - 1) + '"></div>');
                else
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
        let completeFlag;
        let rowIndex;
        let columnIndex;
        let direction;
        ships.forEach(function(ship) {
            completeFlag = false;
            while (completeFlag == false) {
                rowIndex = getRandomInt(0, 9);
                columnIndex = getRandomInt(0, 9);
                direction = getRandomInt(0, 1);
                completeFlag = putShip(ship, fieldID, rowIndex, columnIndex, direction);
            }
        })
    }

    function putShip(typeShip, fieldID, rowIndex, columnIndex, direction) {
        let cellField = getCellField(fieldID, rowIndex, columnIndex);
        let cellShipBuffer = [];
        /* One-cell zone around the ship */
        let cellBuffer = [];

        if (cellField.hasAttribute('ship') || cellField.hasAttribute('notTouch')) return false;
        cellShipBuffer.push(cellField);
        getOneCellZone(cellBuffer, fieldID, rowIndex, columnIndex);

        if (typeShip > 1) {
            if (direction == 0) {
                if (columnIndex < (typeShip - 1)) {
                    for (let i = 0; i < (typeShip - 1); i++) {
                        cellField = getCellField(fieldID, rowIndex, ++columnIndex);
                        if (cellField.hasAttribute('ship') || cellField.hasAttribute('notTouch')) return false;
                        cellShipBuffer.push(cellField);
                        getOneCellZone(cellBuffer, fieldID, rowIndex, columnIndex);
                    }
                } else {
                    for (let i = 0; i < (typeShip - 1); i++) {
                        cellField = getCellField(fieldID, rowIndex, --columnIndex);
                        if (cellField.hasAttribute('ship') || cellField.hasAttribute('notTouch')) return false;
                        cellShipBuffer.push(cellField);
                        getOneCellZone(cellBuffer, fieldID, rowIndex, columnIndex);
                    }
                }
            } else {
                if (rowIndex < (typeShip - 1)) {
                    for (let i = 0; i < (typeShip - 1); i++) {
                        cellField = getCellField(fieldID, ++rowIndex, columnIndex);
                        if (cellField.hasAttribute('ship') || cellField.hasAttribute('notTouch')) return false;
                        cellShipBuffer.push(cellField);
                        getOneCellZone(cellBuffer, fieldID, rowIndex, columnIndex);
                    }
                } else {
                    for (let i = 0; i < (typeShip - 1); i++) {
                        cellField = getCellField(fieldID, --rowIndex, columnIndex);
                        if (cellField.hasAttribute('ship') || cellField.hasAttribute('notTouch')) return false;
                        cellShipBuffer.push(cellField);
                        getOneCellZone(cellBuffer, fieldID, rowIndex, columnIndex);
                    }
                }
            }
        }

        cellShipBuffer.forEach(function(cellShip) {
            cellShip.setAttribute('ship', '');
        });
        cellBuffer.forEach(function(cell) {
            if (cell == null || cell.hasAttribute('ship')) return;
            cell.setAttribute('notTouch', '');
        });
        return true;
    }

    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getOneCellZone(bufferArray, fieldID, rowIndex, columnIndex) {
        bufferArray.push(getCellField(fieldID, rowIndex-1, columnIndex));
        bufferArray.push(getCellField(fieldID, rowIndex+1, columnIndex));
        bufferArray.push(getCellField(fieldID, rowIndex, columnIndex+1));
        bufferArray.push(getCellField(fieldID, rowIndex, columnIndex-1));
        bufferArray.push(getCellField(fieldID, rowIndex-1, columnIndex+1));
        bufferArray.push(getCellField(fieldID, rowIndex-1, columnIndex-1));
        bufferArray.push(getCellField(fieldID, rowIndex+1, columnIndex-1));
        bufferArray.push(getCellField(fieldID, rowIndex+1, columnIndex+1));
        return bufferArray;
    }

    function getCellField(fieldID, rowIndex, columnIndex) {
        let cellID = fieldID + '-' + String(rowIndex) + String(columnIndex);
        return document.getElementById(cellID);
    }

    createField('my-fleet', 0);
    putShips('my-fleet');

    createField('enemy-fleet', 1);
    putShips('enemy-fleet');
}());






