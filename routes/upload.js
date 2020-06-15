import express from 'express';
const app = express();
const router = express.Router();

import { errors, success } from './responses';
import User from '../models/user';
import Doctor from '../models/doctor';
import Hospital from '../models/hospital';
import { TokenAuthentication, ManageRoles } from '../middlewares';
import fileUpload from 'express-fileupload';
import fs from 'fs';

router.use(fileUpload());

const extensions = ['png', 'jpg', 'gif', 'jpeg'];
const collections = ['user', 'hospital', 'doctor'];
const RESULT_PROP = 'upload';

/****************************************
    update image
 ****************************************/
router.put('/:type/:id', TokenAuthentication, async(req, res, next) => {

    try {
        const files = req.files;
        const type = req.params.type;
        const id = req.params.id;

        if (collections.indexOf(type) < 0) {
            return errors(res, 400, 'No valid type collection', { message: `The valid types are: ${collections.join(', ')} .` });
        }

        if (!files) {
            return errors(res, 400, 'No file selected', { message: 'You must select an image.' });
        }

        const file = files.image;
        const splitedName = file.name.split('.');
        const fileExt = splitedName[splitedName.length - 1];

        if (extensions.indexOf(fileExt) < 0) {
            return errors(res, 400, 'No valid extension', { message: `The valid extensions are: ${extensions.join(', ')} .` });
        }

        splitedName.pop();
        let fileName = `${splitedName.join('-')}-${new Date().getMilliseconds()}.${fileExt}`;

        const result = await loadByType(type, id, fileName, res);
        if (result) {
            var path = await DirectoryValidation(`./uploads/${type}/${id}`) + fileName;
            await file.mv(path);
            success(res, 200, result, type);
        }
    } catch (err) {
        errors(res, 400, `We got an error while trying to ${RESULT_PROP} your file.`, err);
    }
});

const DirectoryValidation = async(path) => {
    let exists = fs.existsSync(path);
    if (!exists) {
        fs.mkdirSync(path);
    }

    path += '/';

    return path;
};

const loadByType = async(type, id, fileName, res) => {
    var model = undefined;

    switch (type) {
        case 'user':
            model = await User.findById(id);
            break;
        case 'hospital':
            model = await Hospital.findById(id);
            break;
        case 'doctor':
            model = await Doctor.findById(id);
            break;
    }

    if (!model) {
        errors(res, 400, `Collection's Id does not exists:  ${id}.`, { message: `Collection's Id does not exists:  ${id}.` });
        return null;
    }

    const oldPath = `./uploads/${type}/${id}/${model.img}`;

    if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
    }

    model.img = fileName;
    const newModel = await model.save();

    return newModel;
};

module.exports = router;