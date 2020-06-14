import response from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { errors } from '../routes/responses';

const TokenAuthentication = async(req, res, next) => {
    const token = req.get('token');

    try {
        const tokenDecoded = await jwt.verify(token || '', process.env.JWT_SEED);
        req.user = tokenDecoded;
        next();
    } catch (err) {
        errors(res, 401, 'Invalid token', err);
    }
};

const ManageRoles = async(req, res, next) => {
    var email = req.user.email;

    try {
        const userDB = await User.findOne({ email });

        if (userDB && userDB.role === 'ADMIN_ROLE') {
            next();
        }
        errors(res, 401, 'Invalid user', err);
    } catch (err) {
        errors(res, 401, 'Invalid user', err);
    }

};

module.exports = { TokenAuthentication, ManageRoles };