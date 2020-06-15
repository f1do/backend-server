import express from 'express';
const router = express.Router();

import { errors, success } from './responses';
import Hospital from '../models/hospital';
import _ from 'underscore';
import { TokenAuthentication, ManageRoles } from '../middlewares';

const RESULT_PROP = 'hospital';

/****************************************
    Get all the hospitals
 ****************************************/
router.get('/', TokenAuthentication, async(req, res, next) => {

    try {
        const from = Number(req.query.from) || 0;

        const hCount = await Hospital.count();
        const hospitalDB = await Hospital.find().skip(from).limit(5).populate('user');
        success(res, 200, [hospitalDB, hCount], [RESULT_PROP, 'total']);
    } catch (err) {
        errors(res, 400, `Cannot get the ${RESULT_PROP}s.`, err);
    }
});

/****************************************
    Get a hospital
 ****************************************/
router.get('/:id', TokenAuthentication, async(req, res, next) => {

    const id = req.params.id;

    try {
        const hospitalDB = await Hospital.findById(id).populate('user');
        if (hospitalDB) {
            return success(res, 200, hospitalDB, RESULT_PROP);
        }
        errors(res, 400, `${RESULT_PROP} not found.`, err);
    } catch (err) {
        errors(res, 400, `Cannot get the ${RESULT_PROP}.`, err);
    }
});

/****************************************
    Create new hospital
 ****************************************/
router.post('/', [TokenAuthentication], async(req, res, next) => {

    const body = req.body;
    body.user = req.user._id;
    console.log(req.user);

    try {
        const hospitalDB = await Hospital.create(body);
        if (hospitalDB) {
            return success(res, 201, hospitalDB, RESULT_PROP);
        }

        errors(res, 400, 'Hospital cannot be created.', { message: 'Hospital cannot be created.' });
    } catch (err) {
        errors(res, 400, `Error creating ${RESULT_PROP}.`, err);
    }
});

/****************************************
    Update an existing hospital
 ****************************************/
router.put('/:id', TokenAuthentication, async(req, res, next) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'img']);

    try {
        let hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return errors(res, 400, `Hospital ${id} does not exists.`, { message: 'That Id does not exists in the database.' });
        }

        const hospitalUpdated = await Hospital.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        success(res, 200, hospitalUpdated, RESULT_PROP);

    } catch (err) {
        errors(res, 400, `Error creating ${RESULT_PROP}.`, err);
    }
});

/****************************************
    Delete an existing Hospital
 ****************************************/
router.delete('/:id', TokenAuthentication, async(req, res, next) => {
    const id = req.params.id;
    try {
        const hospitalDeleted = await Hospital.findByIdAndDelete(id);

        if (!hospitalDeleted) {
            return errors(res, 400, `Hospital ${id} does not exists.`, { message: 'That Id does not exists in the database.' });
        }
        success(res, 200, hospitalDeleted, RESULT_PROP);

    } catch (err) {
        errors(res, 400, `Error deleting ${RESULT_PROP}.`, err);
    }
});

module.exports = router;