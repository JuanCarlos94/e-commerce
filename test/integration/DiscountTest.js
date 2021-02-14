const app = require('../../app');
const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('supertest');
const Discount = require('../../src/models/Discount');
const User = require('../../src/models/User');
const Category = require('../../src/models/Category');
const Product = require('../../src/models/Product');
const UserPermissions = require('../../src/models/enums/UserPermission');
const jwt = require('jsonwebtoken');
const MSG = require('../../src/config/Messages');
const Builder = require('../util/ModelsBuilder');


describe('Discount module test', () => {

    before(async () => {
        await Discount.deleteMany(err => {
            if(err) console.error(err);
        });
        await Category.deleteMany(err => {
            if(err) console.error(err);
        });
        await Product.deleteMany(err => {
            if(err) console.error(err);
        });
        await User.deleteMany(err => {
            if(err) console.error(err);
        });
    });

    it('create discount without error', async () => {
        const today = new Date();
        const twoDaysLater = new Date(today.getFullYear(), today.getMonth(), today.getDay() + 2);
        const product1 = await Builder.buildProduct();
        const admin = await Builder.buildUser(UserPermissions.ADMIN);
        const token = await Builder.buildTokenAccess(admin);

        const data = {
            name: 'Discount test',
            products: [product1._id],
            value: 100,
            expiresAt: twoDaysLater.toString(),
            percentage: false
        };
        request(app)
        .post('/discounts')
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .then(res => {
            assert.equal(res.body.name, data.name);
            assert.equal(res.body.value, data.value);
            assert.equal(res.body.products[0], data.products[0]);
            assert.equal(res.body.expiresAt, twoDaysLater.toISOString());
            assert.equal(res.body.percentage, data.percentage);
        })
        .catch(err => {
            assert.fail(err);
        });
    });

    it('find one discount', async () => {
        const today = new Date();
        const twoDaysLater = new Date(today.getFullYear(), today.getMonth(), today.getDay() + 2);
        const discount = await Builder.buildDiscount(twoDaysLater);
        const superAdmin = await Builder.buildUser(UserPermissions.SUPER_ADMIN);
        const token = Builder.buildTokenAccess(superAdmin);

        await request(app)
        .get('/discounts/' + discount._id)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
            assert.equal(res.body.active, discount.active);
            assert.equal(res.body.name, discount.name);
            assert.equal(res.body.value, discount.value);
            assert.equal(res.body.products[0], discount.products[0]);
            assert.equal(res.body.expiresAt, twoDaysLater.toISOString());
            assert.equal(res.body.percentage, discount.percentage);
        })
        .catch(err => {
            assert.fail(err);
        });
    });

    it('delete one discount', async () => {
        const twoDaysLater = new Date();
        const discount = await Builder.buildDiscount(twoDaysLater);
        const superAdmin = await Builder.buildUser(UserPermissions.SUPER_ADMIN);
        const token = Builder.buildTokenAccess(superAdmin);
        await request(app)
        .delete('/discounts/' + discount._id)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
            assert.equal(res.body.message, MSG.DISCOUNT.DELETED)
        })
        .catch(err => {
            assert.fail(err);
        });
    });

    it('list discounts', async () => {
        const product = await Builder.buildProduct();
        const today = new Date();
        const admin = await Builder.buildUser(UserPermissions.ADMIN);
        const token = Builder.buildTokenAccess(admin);
        Discount.insertMany([
            {active: true, name: 'discount test 1', products: [product._id], value: 50, expiresAt: today.toString(), percentage: false},
            {active: true, name: 'discount test 2', products: [product._id], value: 50, expiresAt: today.toString(), percentage: false},
            {active: true, name: 'discount test 3', products: [product._id], value: 50, expiresAt: today.toString(), percentage: false},
            {active: true, name: 'discount test 4', products: [product._id], value: 50, expiresAt: today.toString(), percentage: false},
            {active: true, name: 'discount test 4', products: [product._id], value: 10, expiresAt: today.toString(), percentage: true}
        ]);
        request(app)
        .get('/discounts')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
            assert.isAbove(res.body.length, 5);
        })
        .catch(err => {
            assert.fail(err);
        });
    });

    after(async () => {
        await Discount.deleteMany(err => {
            if(err) console.error(err);
        });
        await Category.deleteMany(err => {
            if(err) console.error(err);
        });
        await Product.deleteMany(err => {
            if(err) console.error(err);
        });
        await User.deleteMany(err => {
            if(err) console.error(err);
        });
    });

})