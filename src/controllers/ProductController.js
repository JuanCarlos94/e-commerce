const Product = require('../models/Product');

module.exports = {
    async create(req, res){
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    },
    async find(req, res){
        const product = Product.findById(req.params.id);
        res.status(201).json(product);
    },
    async list(req, res){
        const products = await Product.find();
        res.json(products);
    }
}