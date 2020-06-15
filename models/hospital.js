import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let hospitalSchema = new Schema({
    name: { type: String, required: [true, 'The hospital name is mandatory'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { collection: 'hospitals' });


module.exports = mongoose.model('Hospital', hospitalSchema);