import express from 'express';
const app = express();

app.use('/user', require('./user'));
app.use('/login', require('./login'));

module.exports = app;