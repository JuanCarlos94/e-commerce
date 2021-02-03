const User = require('../models/User');
const msg = require('../config/Messages');

module.exports = {
    async create(data) {
        const userRegistered = await User.findOne({ email: data.email }).exec();
        if (userRegistered) {
            return msg.USERS.EMAIL_REGISTERED;
        }
        if(data.password !== data.confirmPassword){
            return msg.USERS.PASSWORD_NOT_MATCH;
        }
        let user = User(data);
        user.setPassword(data.password);
        const today = new Date();
        user.createdAt = today.toString();
        user.updatedAt = today.toString();
        const userSaved = await user.save();
        return userSaved;
    },
    find: async function (id) {
        return User.findById(id, 'name email cellphone addresses permission', (err, user) => {
            if (err) return null;
            user.populate('addresses');
            return user;
        });
    },
    async remove(id){
        return await User.remove({ _id: id});
    },
    async removeAll(){
        await User.deleteMany({});
    }
}