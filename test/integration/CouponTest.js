const Coupon = require('../../src/models/Coupon');
const User = require('../../src/models/User');
const Product = require('../../src/models/Product');
const Category = require('../../src/models/Category');
const UserPermissions = require('../../src/models/enums/UserPermission');
const app = require('../../app');
const assert = require('chai').assert;
const request = require('supertest');
const MSG = require('../../src/config/Messages');
const Builder = require('../util/ModelsBuilder');

describe('Coupon module test', () => {

    before(async () => {
        await User.deleteMany(err => {
            if(err) assert.fail(err);
        });
        await Coupon.deleteMany(err => {
            if(err) assert.fail(err);
        });
        await Category.deleteMany(err => {
            if(err) assert.fail(err);
        });
        await Product.deleteMany(err => {
            if(err) assert.fail(err);
        });
    });

    it('should create a coupon without error', async () => {
        const now = new Date();
        const product = await Builder.buildProduct();
        const product2 = await Builder.buildProduct();
        const admin = await Builder.buildUser(UserPermissions.ADMIN);
        const token = Builder.buildTokenAccess(admin);
        const data = {
            name: 'Coupon test 1',
            code: 'CODE1',
            products: [product._id, product2._id],
            value: 10,
            expiresAt: now.toString(),
            percentage: false
        };
        await request(app)
        .post('/coupons')
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .then(res => {
            assert.equal(data.name, res.body.name);
            assert.equal(data.code, res.body.code);
            assert.equal(data.value, res.body.value);
            assert.equal(data.products[0], res.body.products[0]);
            assert.equal(data.products[1], res.body.products[1]);
            assert.equal(data.percentage, res.body.percentage);
        })
        .catch(err => {
            assert.fail(err);
        });
    });

    it('should find one coupon by id', async () => {
        const coupon = await Builder.buildCoupon();
        const admin = await Builder.buildUser(UserPermissions.ADMIN);
        const token = Builder.buildTokenAccess(admin);
        await request(app)
        .get('/coupons/' + coupon._id)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
            assert.equal(coupon.name, res.body.name);
            assert.equal(coupon.code, res.body.code);
            assert.equal(coupon.value, res.body.value);
            assert.equal(coupon.products[0], res.body.products[0]);
            assert.equal(coupon.percentage, res.body.percentage);
        })
        .catch(err => {
            assert.fail(err);
        });
    });

    it('should list all coupons', async () => {
        const admin = await Builder.buildUser(UserPermissions.ADMIN);
        const token = Builder.buildTokenAccess(admin);
        for(var i = 0; i < 5; i++){
            await Builder.buildCoupon();
        }
        await request(app)
        .get('/coupons')
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

    it('should delete a coupon', async () => {
        const coupon = await Builder.buildCoupon();
        const superAdmin = await Builder.buildUser(UserPermissions.SUPER_ADMIN);
        const token = Builder.buildTokenAccess(superAdmin);
        await request(app)
        .delete('/coupons/' + coupon._id)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
            assert.equal(MSG.COUPON.DELETED, res.body.message);
        })
        .catch(err => {
            assert.fail(err);
        });
    });

    after(async () => {
        await Coupon.deleteMany(err => {
            if(err) assert.fail(err);
        });
        await Category.deleteMany(err => {
            if(err) assert.fail(err);
        });
        await Product.deleteMany(err => {
            if(err) assert.fail(err);
        });
        await User.deleteMany(err => {
            if(err) assert.fail(err);
        });
    });

});