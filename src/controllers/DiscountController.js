const Discount = require('../models/Discount');
const MSG = require('../config/Messages');
const { validationResult } = require('express-validator');

module.exports = {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ message: errors.array()[0].msg });
        }
        const discount = new Discount(req.body);
        await discount.save((err, saved) => {
            if (err) return res.status(500).json({ message: MSG.DISCOUNT.ERROR_WHEN_CREATING });
            return res.status(201).json(saved);
        });
    },
    async list(req, res){
        const discounts = await Discount.find();
        return res.json(discounts);
    },
    async find(req, res) {
        const discount = await Discount.findById(req.params.id);
        return res.json(discount);
    },
    async update(req, res){
        const discount = await Discount.findOneAndUpdate(req.params.id, req.body);
        return res.status(200).json(discount);
    },
    async delete(req, res){
        await Discount.deleteOne({_id: req.params.id}, (err) => {
            if(err) return res.status(500);
            return res.status(200).json({message: MSG.DISCOUNT.DELETED});
        });
    }
}