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

// CORS Options
const whitelist = ['http://localhost:3000', 'http://localhost:4200', 'angular-admin-site.azurewebsites.net']
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || origin === undefined /*OR operator is for postman calls*/ ) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

// Middlewares
app.use(morgan('tiny'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(require('./routes'));

app.set('puerto', process.env.PORT || 3000);

app.listen(app.get('puerto'), () => {
    console.log('Express server running over port 3000 - \x1b[32m%s\x1b[0m', 'Online');
});