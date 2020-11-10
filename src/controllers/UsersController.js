const User = require('../models/User')

module.exports = {
    async all(req, res){
        const user = await User.find();
        res.json(user);
    },
    async create(req, res){
        let user = await User(req.body);
        await user.save();
        res.json(user);
    },
    async find(req, res){
        let user = await User.findById(req.params.id).populate('addresses');
        res.json(user);
    }
}