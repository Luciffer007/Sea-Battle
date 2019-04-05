const getRandomInt = require('./randomizer');

function processShots(rowIndex, columnIndex, playerField, AIField) {
    let responseObj = {};
    let endFlag = true;

    /* Processing the result of shot */
    processShot(responseObj, AIField, rowIndex, columnIndex, 'resultShot', 'isEnemyDestroy', 'indexesEnemyOneCellZone', 'isWin');

    /* Processing the result of enemy shot */
    while (endFlag) {
        responseObj.rowIndex = getRandomInt(0, 9);
        responseObj.columnIndex = getRandomInt(0, 9);
        if (playerField[responseObj.rowIndex][responseObj.columnIndex] != 'check') {
            processShot(responseObj, playerField, responseObj.rowIndex, responseObj.columnIndex, 'resultEnemyShot', 'isDestroy', 'indexesOneCellZone', 'isLose');
            endFlag = false;
        }
    }

    return responseObj;
}

function processShot(responseObj, battleField, rowIndex, columnIndex, result, isDestroy, indexesOneCellZone, isWin) {
    if (battleField[rowIndex][columnIndex][0] == 'ship') {
        let idShip;
        let bufferIndexesOneCellZone = [];

        responseObj[result] = 'hit';
        idShip = battleField[rowIndex][columnIndex][1];
        battleField[rowIndex][columnIndex] = 'check';

        responseObj[isDestroy] = checkShipDestruction(battleField, idShip, bufferIndexesOneCellZone);
        responseObj[indexesOneCellZone] = bufferIndexesOneCellZone;

        if (responseObj[isDestroy]) {
            bufferIndexesOneCellZone.forEach(function (indexes) {
                battleField[indexes[0]][indexes[1]] = 'check';
            });
        }
    } else {
        responseObj[result] = 'miss';
        battleField[rowIndex][columnIndex] = 'check';
    }

    responseObj[isWin] = checkWinCondition(battleField);
}

function checkShipDestruction(battleField, idShip, indexesOneCellZone) {
    /* Check the destruction of the ship */
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (battleField[i][j][1] == idShip && battleField[i][j][0] == 'ship') return false;
        }
    }

    /* Recording a single zone around the destroyed ship */
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if ( battleField[i][j][0] == 'notTouch')
                if (battleField[i][j][1].has(idShip))
                    indexesOneCellZone.push([i, j]);
        }
    }
    return true;
}

function checkWinCondition(battleField) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (battleField[i][j][0] == 'ship') return false;
        }
    }
    return true;
}

module.exports = processShots;