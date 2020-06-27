import express from 'express';
const router = express.Router();

import path from 'path';
import { errors } from './responses';
import { TokenAuthentication } from '../middlewares';
import fs from 'fs';

const RESULT_PROP = 'file';

/**********************************************************
    Get an image related to a user, doctor or hospital
 **********************************************************/
router.post('/', async(req, res, next) => {

    try {
        let { type, img, id } = req.body;

        await GetAnImage(type, img, id, res);
    } catch (err) {
        errors(res, 400, `Cannot get the ${RESULT_PROP}.`, err);
    }
});

const GetAnImage = async(type, img, id, res) => {
    const pathImage = path.resolve(__dirname, `../uploads/${type}/${id}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        res.sendFile(path.resolve(__dirname, `../assets/no-img.jpg`));
    }
};

router.get('/:type/:id/:img', async(req, res, next) => {

    try {
        const type = req.params.type;
        const img = req.params.img;
        const id = req.params.id;

        await GetAnImage(type, img, id, res);
    } catch (err) {
        errors(res, 400, `Cannot get the ${RESULT_PROP}.`, err);
    }
});


module.exports = router;