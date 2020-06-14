require('express');

const errors = (res, stat, msg, err) => {
    return res.status(stat).json({
        ok: false,
        message: msg,
        errors: err
    });
};

const success = (res, stat, resultObj, prop) => {
    return res.status(stat).json({
        ok: true,
        [prop]: resultObj
    });
};

module.exports = { errors, success };