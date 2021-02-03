const User = require('../models/User');
const jwt = require('jsonwebtoken');
const msg = require('../config/Messages');

module.exports = {
    async login(req, res, next) {
        User.findOne({ email: req.body.email}, function(err, user){
            if(user === null){
                return res.status(400).send({
                    message: msg.Authorization.USER_NOT_FOUND
                });
            } else {
                if(user.validPassword(req.body.password)){
                    const id = user._id;
                    const payload = { id }
                    const token = jwt.sign(payload, process.env.SECRET, {
                        expiresIn: 10000
                    });
                    return res.json({ auth: true, token: token });
                } else {
                    return res.status(400).json({
                        message: msg.Authorization.WRONG_PASSWORD
                    })
                }
            }
        });
    },
    async logout(req, res) {
        res.status(200).json({ auth: false, token: null });
    }
}