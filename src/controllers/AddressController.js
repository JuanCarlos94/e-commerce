const { create } = require('../models/Address');
const Address = require('../models/Address');
const User = require('../models/User');

module.exports = {
    async create(req, res){
        const user = await User.findById(req.params.userId);
        const address = new Address(req.body);
        address.owner = user;
        await address.save();
        user.addresses.push(address);
        await user.save();
        res.status(201).json(address);
    }
}