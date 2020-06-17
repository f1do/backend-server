import express from 'express';
const router = express.Router();

import { errors, success } from './responses';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import _ from 'underscore';
import { TokenAuthentication, ManageRoles } from '../middlewares';

const RESULT_PROP = 'user';

/****************************************
    Get all users
 ****************************************/
router.get('/', TokenAuthentication, async(req, res, next) => {

    try {
        const from = Number(req.query.from) || 0;

        const uCount = await User.count();
        let usersDB = await User.find().skip(from).limit(5);

        success(res, 200, [usersDB, uCount], [RESULT_PROP, 'total']);
    } catch (err) {
        errors(res, 400, `Cannot get the ${RESULT_PROP}s.`, err);
    }
});

/****************************************
    Create new user
 ****************************************/
router.post('/', async(req, res, next) => {

    const body = req.body;
    body.password = bcrypt.hashSync(body.password, 10);

    try {
        const userDB = await User.create(body);
        if (userDB) {
            return success(res, 201, userDB, RESULT_PROP);
        }

        errors(res, 400, 'User cannot be created.', { message: 'User cannot be created.' });
    } catch (err) {
        errors(res, 400, `Error creating ${RESULT_PROP}.`, err);
    }
});

/****************************************
    Update an existing user
 ****************************************/
router.put('/:id', TokenAuthentication, async(req, res, next) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'email', 'role', 'active']);

    try {
        let userDB = await User.findById(id);

        if (!userDB) {
            return errors(res, 400, `User ${id} does not exists.`, { message: 'That Id does not exists in the database.' });
        }

        const userUpdated = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        success(res, 200, userUpdated, RESULT_PROP);

    } catch (err) {
        errors(res, 400, `Error creating ${RESULT_PROP}.`, err);
    }
});

/****************************************
    Delete an existing user
 ****************************************/
router.delete('/:id', TokenAuthentication, async(req, res, next) => {
    const id = req.params.id;
    try {
        const userDeleted = await User.findByIdAndDelete(id);

        if (!userDeleted) {
            return errors(res, 400, `User ${id} does not exists.`, { message: 'That Id does not exists in the database.' });
        }
        success(res, 200, userDeleted, RESULT_PROP);

    } catch (err) {
        errors(res, 400, `Error deleting ${RESULT_PROP}.`, err);
    }
});

module.exports = router;