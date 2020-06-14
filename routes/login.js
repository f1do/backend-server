import express from 'express';
const router = express.Router();

import { errors, success } from './responses';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const RESULT_PROP = 'user';

router.post('/', async(req, res, next) => {
    const { email, password } = req.body;

    try {
        const userDb = await User.findOne({ email });
        if (userDb) {
            if (bcrypt.compareSync(password, userDb.password)) {
                let token = jwt.sign({ user: userDb }, process.env.JWT_SEED, { expiresIn: process.env.JWT_TIME });
                return success(res, 200, { userDb, token }, RESULT_PROP);
            }
        }

        errors(res, 400, 'Error trying to authenticate the user.', { message: 'User/Password does not match our records' });
    } catch (err) {
        errors(res, 400, 'Error trying to authenticate the user.', err);
    }
});

module.exports = router;