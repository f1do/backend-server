import express from 'express';
const app = express();

app.use('/user', require('./user'));
app.use('/login', require('./login'));
app.use('/hospital', require('./hospital'));
app.use('/doctor', require('./doctor'));
app.use('/search', require('./search'));
app.use('/upload', require('./upload'));
app.use('/img', require('./image'));

module.exports = app;