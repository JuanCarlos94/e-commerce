const Product = require('../models/Product');
const Category = require('../models/Category');
const { body, validationResult } = require('express-validator');

module.exports = {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ message: errors.array()[0].msg });
        }
        const product = new Product(req.body);
        const category = await Category.findById(req.body.category._id, (err) => {
            if (err)
                return res.status(205).json({ message: 'Category not found' })
        });
        product.category = category;
        await product.save();
        res.status(201).json(product);
    },
    async find(req, res) {
        Product.findById(req.params.id, (err, doc) => {
            return res.status(200).json(doc);
        });
    },
    async list(req, res) {
        const products = await Product.find();
        res.json(products);
    },
    async update(req, res){
        Product.findOneAndUpdate({_id: req.params.id }, req.body, {new: true}, (err, doc) => {
            if(err) return res.status(404).json({message: err});
            return res.status(200).json(doc);
        })
    },
    fieldValidation() {
        return [
            body('name').notEmpty(),
            body('category').notEmpty(),
            body('unitValue').isNumeric(),
            body('count').isNumeric()
        ];
    }
}