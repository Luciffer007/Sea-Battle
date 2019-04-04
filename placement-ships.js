const getRandomInt = require('./randomizer');

/* Placement of ships on the field */
function placementShips() {
    let battleField = [];
    for (let i = 0; i < 10; i++) {
        battleField[i] = new Array(10);
    }
    let ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    let completeFlag;
    let rowIndex;
    let columnIndex;
    let direction;
    let indexShipBuffer;
    let indexBuffer; //One-cell zone around the ship

    ships.forEach(function(ship) {
        completeFlag = false;
        outer: while (completeFlag == false) {
            rowIndex = getRandomInt(0, 9);
            columnIndex = getRandomInt(0, 9);
            direction = getRandomInt(0, 1);
            indexShipBuffer = [];
            indexBuffer = [];

            if (direction == 0) {
                if (columnIndex < (ship - 1)) {
                    if (placementShip(ship,  battleField, rowIndex, columnIndex, indexShipBuffer, indexBuffer, 0, 1)) continue outer;
                } else {
                    if (placementShip(ship,  battleField, rowIndex, columnIndex, indexShipBuffer, indexBuffer, 0, -1)) continue outer;
                }
            } else {
                if (rowIndex < (ship - 1)) {
                    if (placementShip(ship,  battleField, rowIndex, columnIndex, indexShipBuffer, indexBuffer, 1, 0)) continue outer;
                } else {
                    if (placementShip(ship,  battleField, rowIndex, columnIndex, indexShipBuffer, indexBuffer, -1, 0)) continue outer;
                }
            }

            indexShipBuffer.forEach(function(indexShip) {
                battleField[indexShip[0]][indexShip[1]] = 'ship';
            });
            indexBuffer = indexBuffer.filter(function(indexArray) {
                if ((indexArray[0] >= 0) && (indexArray[0] < 10) && (indexArray[1] >= 0) && (indexArray[1] < 10)) return true;
                else return false;
            })
            indexBuffer.forEach(function(indexArray) {
                if (battleField[indexArray[0]][indexArray[1]] != 'ship')
                    battleField[indexArray[0]][indexArray[1]] = 'notTouch';
            });
            completeFlag = true;
        }
    })
    return battleField;
}

function placementShip(ship,  battleField, rowIndex, columnIndex, indexShipBuffer, indexBuffer, rowCoef, columnCoef) {
    let cellBattleField;

    for (let i = 0; i < ship; i++) {
        cellBattleField = battleField[rowIndex + i * rowCoef][columnIndex + i * columnCoef];
        if (cellBattleField == 'ship' || cellBattleField == 'notTouch') return true;
        indexShipBuffer.push([rowIndex + i * rowCoef, columnIndex + i * columnCoef]);
        getOneCellZone(indexBuffer, battleField, rowIndex + i * rowCoef, columnIndex + i * columnCoef);
    }
    return false;
}

function getOneCellZone(indexBuffer, battleField, rowIndex, columnIndex) {
    indexBuffer.push([rowIndex-1, columnIndex]);
    indexBuffer.push([rowIndex+1, columnIndex]);
    indexBuffer.push([rowIndex, columnIndex+1]);
    indexBuffer.push([rowIndex, columnIndex-1]);
    indexBuffer.push([rowIndex-1, columnIndex+1]);
    indexBuffer.push([rowIndex-1, columnIndex-1]);
    indexBuffer.push([rowIndex+1, columnIndex-1]);
    indexBuffer.push([rowIndex+1, columnIndex+1]);
}

module.exports = placementShips;