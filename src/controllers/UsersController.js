const User = require('../models/User');
const UserPermissions = require('../models/UserPermission');
const service = require('../services/UserServices');
const AutheticationServices = require('../services/AuthorizationServices');
const { validationResult } = require('express-validator');
const msg = require('../config/Messages');

module.exports = {
    async create(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ message: errors.array()[0].msg });
        }
        req.body.permission = UserPermissions.USER;
        const result = await service.create(req.body);
        if(typeof result === 'string'){
            return res.status(500).json({message: result});
        }
        return res.status(201).json({"id": result._id});
    },
    async update(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ message: errors.array().map((e) => { return e.msg; }) });
        const userId = await AutheticationServices.getUserIdFromToken(req.headers['authorization']);
        if (userId != data._id)
            return res.status(500).json({ message: msg.USERS.USER_ID_INVALID });
        const today = new Date();
        const userUpdated = await User.findOneAndUpdate(userId, { name: req.body.name, cellphone: req.body.cellphone, updatedAt: today.toString()});
        return res.status(200).json(userUpdated);
    },
    async me(req, res, next) {
        const token = req.headers['authorization'];
        const user = await AutheticationServices.searchUserOwnerToken(token);
        if(!user) return res.status(404).json({message: msg.USERS.USER_NOT_FOUND});
        return res.status(200).json(user);
    }
}