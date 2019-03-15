const express = require('express');
const app = express();

app.use('/public', express.static('public'));

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
    console.log('Server is running');
});