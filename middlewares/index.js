import response from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { errors } from '../routes/responses';

const TokenAuthentication = async(req, res, next) => {
    const token = req.get('token');

    try {
        const tokenDecoded = await jwt.verify(token || '', process.env.JWT_SEED);
        req.user = tokenDecoded.user;
        next();
    } catch (err) {
        errors(res, 401, 'Invalid token', err);
    }
};

const ManageRoles = async(req, res, next) => {
    const email = req.user.email;

    try {
        const userDB = await User.findOne({ email });

        if (userDB && userDB.role === 'ADMIN_ROLE') {
            next();
        } else {
            errors(res, 401, 'Invalid user', err);
        }
    } catch (err) {
        errors(res, 401, 'Invalid user', err);
    }

};

const VerifySameUser = async(req, res, next) => {
    const email = req.user.email;
    const id = req.params.id;

    try {
        const userDB = await User.findOne({ email });
        if ((userDB && userDB.role === 'ADMIN_ROLE') || userDB._id == id) {
            next();
        } else {
            errors(res, 401, 'Invalid user', err);
        }
    } catch (err) {
        errors(res, 401, 'Invalid user', err);
    }

};

module.exports = { TokenAuthentication, ManageRoles, VerifySameUser };