var express = require('express');
var mongoose = require('mongoose');


var app = express();

mongoose.connect('mongodb://localhost:27017/hospital-db', { useNewUrlParser: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) {
            throw err;
        }
        console.log('Mongo DB running successfully - \x1b[32m%s\x1b[0m', 'Online');
    });

app.get('/', (req, res, next) => {
    res.json({
        ok: true,
        mensaje: 'Successful call'
    });
});

app.listen(3000, () => {
    console.log('Express server running over port 3000 - \x1b[32m%s\x1b[0m', 'Online');
});