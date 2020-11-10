const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = mongoose.Schema(
    {
        address: { type: String, required: true },
        number: { type: String, required: true },
        neighborhood: { type: String, required: true },
        zipcode: String,
        complement: String,
        city: { type: String, required: true },
        state: { type: String, required: true, minlength: 2, maxlength: 2 },
        default: { type: Boolean, default: false },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    });

module.exports = mongoose.model('Address', AddressSchema);