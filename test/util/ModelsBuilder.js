const User = require('../../src/models/User');
const Product = require('../../src/models/Product');
const Category = require('../../src/models/Category');
const Coupon = require('../../src/models/Coupon');
const Discount = require('../../src/models/Discount');
const jwt = require('jsonwebtoken');

module.exports = {
    async buildUser(permission){
        const now = new Date();
        const user = new User({
            name: 'user' + now.getTime(),
            email: 'user' + now.getTime() + '@mail.com',
            cellphone: '1234567890',
            permission: permission,
            createdAt: now.toString(),
            updatedAt: now.toString()
        });
        user.setPassword('123')
        return await user.save();
    },
    async buildCategory() {
        const now = new Date();
        const category = new Category({name: 'Category_' + now.getTime(), key: 'CATEGORY_' + now.getTime()});
        return await category.save();
    },
    async buildProduct(){
        const now = new Date();
        const category = await this.buildCategory();
        const product = new Product({
            name: 'Product' + now.getTime(),
            description: 'Product description',
            count: Math.ceil(Math.random() * 5),
            unitValue: Math.ceil(Math.random() * 5),
            category: category._id
        });
        return await product.save();
    },
    async buildCoupon(){
        const product = await this.buildProduct();
        const now = new Date();
        const twoDaysLater = new Date(now.getFullYear(), now.getMonth(), now.getDay() + 2);
        const coupon = new Coupon({
            name: 'Coupon' + now.getTime(),
            code: 'CODE',
            products: [product._id],
            value: Math.ceil(Math.random() * 5),
            expiresAt: twoDaysLater.toString(),
            percentage: true
        });
        return await coupon.save();
    },
    buildTokenAccess(user){
        const id = user._id;
        const token = jwt.sign({ id }, process.env.SECRET, {expiresIn: 10000});
        return token;
    },
    async buildDiscount(expiresAt){
        const product = await this.buildProduct();
        const now = new Date();
        const discount = new Discount({
            name: 'Discount test ' + now.getTime(),
            products: [product._id],
            value: 10,
            expiresAt: expiresAt.toString(),
            percentage: true
        });
        return await discount.save();
    }
}