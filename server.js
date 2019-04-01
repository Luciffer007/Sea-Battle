const express = require('express');
const placementShips = require('./placement-ships');
const app = express();
const jsonParser = express.json();

let player1Field;
let player2Field;

app.use('/public', express.static('public'));

app.get('/', function (request, response) {
});

app.get('/game', function (request, response) {
    response.sendFile(__dirname + '/index.html');
    player1Field = placementShips();
    player2Field = placementShips();
});

app.post('/preparation', function (request, response) {
    response.json(player1Field);
});

app.post('/shot', jsonParser, function (request, response) {
    if (player2Field[request.body.rowIndex][request.body.columnIndex] == 'ship')
        response.json("hit");
    else
        response.json("miss");
});

app.listen(3000, function () {
    console.log('Server is running');
});