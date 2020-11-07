const User = require('../models/User')

module.exports = {
    async all(req, res){
        const user = await User.find();
        res.json(user);
    },
    async create(req, res){
        let newUser = await User(req.body);
        let savedUser = await newUser.save();
        res.json(savedUser);
    }
}