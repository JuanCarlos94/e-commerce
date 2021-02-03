const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const UserPermissions = require('./UserPermission')

const UserSchema = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        salt: {type: String, required: true},
        cellphone: {type: String, required: true},
        addresses: [{
            type: Schema.Types.ObjectId,
            ref: "Address"
        }],
        permission: {type: String, required: true, default: UserPermissions.USER},
        createdAt: {type: Date, required: true},
        updatedAt: {type: Date, required: true}
    });

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');

    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
}

UserSchema.methods.validPassword = function(password){
    var password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.password === password;
}



module.exports = mongoose.model('User', UserSchema);