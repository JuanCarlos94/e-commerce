const { create } = require('../models/Address');
const Address = require('../models/Address');
const User = require('../models/User');

module.exports = {
    async create(req, res){
        Address.create(req.body).then(savedAddress => {
            User.findByIdAndUpdate(
                req.params.userId,
                {$push: {addresses: savedAddress._id}}
            )
            res.json(savedAddress)
        })
    }
}