const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = {
    async login(req, res){
        const {email, password} = req.body;
        const user = await User.findOne({email: email, password: password});
        if(user){
            const id = user._id;
            const token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: 300
            });
            return res.json({auth: true, token: token});
        }
        res.status(500).json({message: 'Login inválido.'});
    },
    async logout(req, res){
        res.json({auth: false, token: null});
    }
}