const Product = require('../models/Product');

module.exports = {
    async find(id){
        const product = Product.findById(id, (err) => {
            if(err) return null;
        });
        return product;
    }
}