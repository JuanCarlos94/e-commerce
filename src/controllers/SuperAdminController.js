const service = require('../services/UserServices');
const User = require('../models/User');

module.exports = {
    async index(req, res, next){
        await User.find((err, users) => {
            if(err) return res.status(500).json({message: err});
            return res.status(200).json(users);
        });
    },
    async find(req, res, next){
        try{
            let user = await service.find(req.params.id);
            return res.json(user.populate('addresses'));
        } catch(err){
            return res.status(500).json({message: err});
        }
    },
    async create(req, res, next){
        try{
            const user = await service.create(req.body);
            return res.status(201).json(user);
        } catch(err){
            return res.status(500).json({message: err});
        }
    },
    async update(req, res, next){
        User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, obj) => {
            if(err) return res.status(500).json({message: err});
            return res.status(200).json(obj);
        })
    },
    remove(req, res, next){
        User.findByIdAndRemove(req.params.id, (err, obj) => {
            if(err) return res.status(500).json({message: err});
            return res.status(200).json(obj);
        })
    }
}