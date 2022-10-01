const troller = require('../index');
const express = require('express');
const app = express();

app.use(
    troller()
);

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.listen(3000)