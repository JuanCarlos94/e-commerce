const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = {
    async search(req, res){
        const search = String(req.query.search);
        const categories = await Category.find(
            {name: { $regex: new RegExp(search)}}
        );
        let products = [];
        if(categories.length !== 0) {
            products = await Product.find({ category: categories[0]._id}).populate('category');
        } else {
            products = await Product.find( { $text: { $search: search, $diacriticSensitive: true}} ).populate('category');
        }
        return res.status(200).json(products);
    },
    async topSold(req, res){
        const products = await Product.find({}, null, {limit: 10, sort: {sold: -1}}).exec();
        return res.status(200).json(products);
    }
}