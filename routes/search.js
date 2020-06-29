import express from 'express';
const router = express.Router();

import { errors, success } from './responses';
import { TokenAuthentication, ManageRoles } from '../middlewares';
import Hospital from '../models/hospital';
import User from '../models/user';
import Doctor from '../models/doctor';

const RESULT_PROP = 'search';

/****************************************
    Search in all collections
 ****************************************/
router.get('/all/:find', TokenAuthentication, async(req, res, next) => {

    try {
        const _find = req.params.find;
        const regex = new RegExp(_find, 'i');

        let [usersDB, hospitalDB, doctorDB] = await Promise.all([
            User.find().or([{ 'name': regex }, { 'email': regex }]),
            Hospital.find({ name: regex }).populate('user'),
            Doctor.find({ name: regex }).populate('user').populate('hospital')
        ]);

        success(res, 200, [usersDB, doctorDB, hospitalDB], ['user', 'doctor', 'hospital']);
    } catch (err) {
        errors(res, 400, 'Cannot get the information.', err);
    }
});

/****************************************
    Search by collection
 ****************************************/
router.get('/collection/:table/:find', TokenAuthentication, async(req, res, next) => {

    try {
        const _find = req.params.find;
        const _collection = req.params.table;
        const regex = new RegExp(_find, 'i');
        var result = {};

        switch (_collection) {
            case 'doctor':
                result = await Doctor.find({ name: regex }).populate('user').populate('hospital');
                break;
            case 'user':
                result = await User.find().or([{ 'name': regex }, { 'email': regex }]);
                break;
            case 'hospital':
                result = await Hospital.find({ name: regex }).populate('user');
                break;
            default:
                result = { message: `The collection \'${_collection}\' does not exists.` };
                return errors(res, 400, 'You only can use \'user\', \'doctor\' and \'hospital\' as collection parameter.', result);
        }

        success(res, 200, result, _collection);
    } catch (err) {
        errors(res, 400, 'Cannot get the information.', err);
    }
});

module.exports = router;