import express from 'express';
const router = express.Router();

import { errors, success } from './responses';
import Doctor from '../models/doctor';
import _ from 'underscore';
import { TokenAuthentication, ManageRoles } from '../middlewares';

const RESULT_PROP = 'doctor';

/****************************************
    Get all the Doctors
 ****************************************/
router.get('/', TokenAuthentication, async(req, res, next) => {

    try {
        const from = Number(req.query.from) || 0;

        const dCount = await Doctor.count();
        const doctorDB = await Doctor.find().skip(from).limit(5).populate('hospital').populate('user');
        success(res, 200, [doctorDB, dCount], [RESULT_PROP, 'total']);
    } catch (err) {
        errors(res, 400, `Cannot get the ${RESULT_PROP}s.`, err);
    }
});

/****************************************
    Get a Doctor
 ****************************************/
router.get('/:id', TokenAuthentication, async(req, res, next) => {

    const id = req.params.id;

    try {
        const doctorDB = await Doctor.findById(id).populate('hospital').populate('user');
        if (doctorDB) {
            return success(res, 200, doctorDB, RESULT_PROP);
        }
        errors(res, 400, `${RESULT_PROP} not found.`, err);
    } catch (err) {
        errors(res, 400, `Cannot get the ${RESULT_PROP}.`, err);
    }
});

/****************************************
    Create new Doctor
 ****************************************/
router.post('/', [TokenAuthentication], async(req, res, next) => {

    const body = req.body;
    body.user = req.user._id;

    try {
        const doctorDB = await Doctor.create(body);
        if (doctorDB) {
            return success(res, 201, doctorDB, RESULT_PROP);
        }

        errors(res, 400, 'Doctor cannot be created.', { message: 'Doctor cannot be created.' });
    } catch (err) {
        errors(res, 400, `Error creating ${RESULT_PROP}.`, err);
    }
});

/****************************************
    Update an existing Doctor
 ****************************************/
router.put('/:id', TokenAuthentication, async(req, res, next) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'img']);

    try {
        let doctorDB = await Doctor.findById(id);

        if (!doctorDB) {
            return errors(res, 400, `Doctor ${id} does not exists.`, { message: 'That Id does not exists in the database.' });
        }

        const doctorUpdated = await Doctor.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        success(res, 200, doctorUpdated, RESULT_PROP);

    } catch (err) {
        errors(res, 400, `Error creating ${RESULT_PROP}.`, err);
    }
});

/****************************************
    Delete an existing Doctor
 ****************************************/
router.delete('/:id', TokenAuthentication, async(req, res, next) => {
    const id = req.params.id;
    try {
        const doctorDeleted = await Doctor.findByIdAndDelete(id);

        if (!doctorDeleted) {
            return errors(res, 400, `Doctor ${id} does not exists.`, { message: 'That Id does not exists in the database.' });
        }
        success(res, 200, doctorDeleted, RESULT_PROP);

    } catch (err) {
        errors(res, 400, `Error deleting ${RESULT_PROP}.`, err);
    }
});

module.exports = router;