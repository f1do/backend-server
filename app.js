require('./config');
import express from 'express';

import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

var app = express();

mongoose.connect('mongodb://localhost:27017/hospital-db', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
    (err, res) => {

        if (err) {
            throw err;
        }
        console.log('Mongo DB running successfully - \x1b[32m%s\x1b[0m', 'Online');
    }
);
mongoose.set('useCreateIndex', true);

// Middlewares
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(require('./routes'));

app.listen(3000, () => {
    console.log('Express server running over port 3000 - \x1b[32m%s\x1b[0m', 'Online');
});