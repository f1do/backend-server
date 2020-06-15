import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

const VALID_ROLES = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '\'{VALUE}\' is not valid role'
};

let userSchema = new Schema({
    name: { type: String, required: [true, 'Name is mandatory'] },
    email: { type: String, unique: true, required: [true, 'Email is mandatory'] },
    password: { type: String, required: [true, 'Password is mandatory'] },
    created: { type: Date, default: Date.now },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: VALID_ROLES },
    active: { type: Boolean, default: true }
});

userSchema.plugin(uniqueValidator, { message: 'The {PATH} must be unique' });

userSchema.methods.toJSON = function() {
    let usrObj = this.toObject();
    delete usrObj.password;
    delete usrObj.created;
    return usrObj;
};

module.exports = mongoose.model('User', userSchema);