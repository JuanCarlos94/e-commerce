const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        cellphone: {type: String, required: true},
        addresses: [{
            type: Schema.Types.ObjectId,
            ref: "Address"
        }]
    },
    {collection: 'user'})

module.exports = mongoose.model('User', UserSchema)