const express = require('express');
const captainNames = require('./json/name-AI.json');
const placementShips = require('./placement-ships');
const processShots = require('./shot-handler');
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
    let battleField = [];
    for (let i = 0; i < 10; i++) {
        battleField[i] = new Array(10);
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            battleField[i][j] = player1Field[i][j][0];
        }
    }
    response.json(battleField);
});

app.post('/shot', jsonParser, function (request, response) {
    response.json(processShots(request.body.rowIndex, request.body.columnIndex, player1Field, player2Field));
});

app.listen(3000, function () {
    console.log('Server is running');
});

