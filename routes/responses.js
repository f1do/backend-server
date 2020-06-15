require('express');

const errors = (res, stat, msg, err) => {
    return res.status(stat).json({
        ok: false,
        message: msg,
        errors: err
    });
};

const success = (res, stat, resultObj, prop) => {
    var _response = {
        ok: true
    };

    if (Array.isArray(prop)) {
        for (const p of prop) {
            _response[p] = resultObj[prop.indexOf(p)];
        }
    } else {
        _response[prop] = resultObj;
    }

    return res.status(stat).json(_response);
};

module.exports = { errors, success };