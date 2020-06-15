import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let doctorSchema = new Schema({
    name: { type: String, required: [true, 'The name is required.'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'Hospital Id is a mandatory field'] }
});

module.exports = mongoose.model('Doctor', doctorSchema);