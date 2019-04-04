const express = require('express');
const captainNames = require('./json/name-AI.json');
const placementShips = require('./placement-ships');
const getRandomInt = require('./randomizer');
const app = express();
const jsonParser = express.json();

let player1Field;
let player2Field;

app.use('/public', express.static('public'));

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

app.post('/start-game', function (request, response) {
    player1Field = placementShips();
    player2Field = placementShips();
    response.json(captainNames[getRandomInt(0, 18)]);
});

app.post('/preparation', function (request, response) {
    response.json(player1Field);
});

app.post('/shot', jsonParser, function (request, response) {
    let responseObj = {};
    let flag = true;

    /* Processing the result of shot */
    if (player2Field[request.body.rowIndex][request.body.columnIndex] == 'ship') {
        responseObj.resultShot = 'hit';
        player2Field[request.body.rowIndex][request.body.columnIndex] = 'hit';
        responseObj.isWin = checkWinCondition(player2Field);
    } else {
        responseObj.resultShot = 'miss';
    }

    /* Processing the result of enemy shot */
    while (flag) {
        responseObj.rowIndex = getRandomInt(0, 9);
        responseObj.columnIndex = getRandomInt(0, 9);
        if (player1Field[responseObj.rowIndex][responseObj.columnIndex] != 'check') {
            if (player1Field[responseObj.rowIndex][responseObj.columnIndex] == 'ship') {
                responseObj.resultEnemyShot = 'hit';
            } else {
            responseObj.resultEnemyShot = 'miss';
            }
            player1Field[responseObj.rowIndex][responseObj.columnIndex] = 'check';
            responseObj.isLose = checkWinCondition(player1Field);
            flag = false;
        }
    }
    response.json(responseObj);
});

app.listen(3000, function () {
    console.log('Server is running');
});

function checkWinCondition(battleField) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (battleField[i][j] == 'ship') return false;
        }
    }
    return true;
}