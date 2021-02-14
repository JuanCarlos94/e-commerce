const Coupon = require('../models/Coupon');
const MSG = require('../config/Messages');
const { validationResult } = require('express-validator');

module.exports = {
    async create(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ message: errors.array()[0].msg });
        }
        const coupon = new Coupon(req.body);
        await coupon.save(err => {
            if(err) return res.status(500).json({message: MSG.COUPON.ERROR_WHEN_CREATED});
        });
        return res.status(201).json(coupon);
    },
    async find(req, res){
        const coupon = await Coupon.findById(req.params.id);
        if(!coupon) return res.status(404).json({message: MSG.COUPON.NOT_FOUND});
        return res.status(200).json(coupon);
    },
    async delete(req, res) {
        return await Coupon.deleteOne({_id: req.params.id}, (err) => {
            if(err) return res.status(500).json({message: MSG.COUPON.ERROR_WHEN_DELETING});
            return res.status(200).json({message: MSG.COUPON.DELETED});
        });
    },
    async list(req, res){
        const coupons = await Coupon.find();
        return res.json(coupons);
    }
}
