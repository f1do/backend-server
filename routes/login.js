import express from 'express';
const router = express.Router();

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.CLIENT_ID);

import { errors, success } from './responses';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const RESULT_PROP = 'user';

const createToken = (obj, res) => {
    let _token = jwt.sign({ user: obj }, process.env.JWT_SEED, { expiresIn: process.env.JWT_TIME });
    return success(res, 200, [obj, _token, getMenu(obj.role)], [RESULT_PROP, 'token', 'menu']);
};

/****************************************
    Normal Authentication
 ****************************************/
router.post('/', async(req, res, next) => {
    const { email, password } = req.body;

    try {
        const userDb = await User.findOne({ email });
        if (userDb) {
            if (bcrypt.compareSync(password, userDb.password)) {
                return createToken(userDb, res);
            }
        }

        errors(res, 400, 'Error trying to authenticate the user.', { message: 'User/Password does not match our records' });
    } catch (err) {
        errors(res, 400, 'Error trying to authenticate the user.', err);
    }
});

/****************************************
    Google Authentication
 ****************************************/
router.post('/google', async(req, res, next) => {
    const token = req.get('token');

    try {

        var usrGoogle = await verify(token);
        const usrApp = await User.findOne({ email: usrGoogle.email });

        if (usrApp) {
            if (usrApp.google === false) {
                return errors(res, 400, 'This email cannot be authenticated by google method.', err);
            } else {
                return createToken(usrApp, res);
            }
        } else {
            usrGoogle.password = '***;)***';
            const userDb = await User.create(usrGoogle);
            return createToken(userDb, res);
        }
    } catch (err) {
        errors(res, 403, 'Error authenticating the user.', err);
    }
});

const verify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

const getMenu = (role) => {
    let menu = [{
            title: 'Main',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'ProgressBar', url: '/progress' },
                { title: 'Graphics', url: '/graphics' },
                { title: 'Promises', url: '/promises' },
                { title: 'RXJS', url: '/rxjs' }
            ]
        },
        {
            title: 'Maintenance',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                // { title: 'Users', url: '/user' },
                { title: 'Hospitals', url: '/hospital' },
                { title: 'Doctors', url: '/doctor' }
            ]
        }
    ];

    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ title: 'Users', url: '/user' });
    }

    return menu;
};


module.exports = router;