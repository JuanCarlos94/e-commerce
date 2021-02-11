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

        const tech = new Category({name: 'Tech', key: 'TECH'});
        await tech.save(err => {
            if(err) console.error(err);
        });

        this.notebook = new Product({
            name: 'Notebook',
            description: 'Notebook test',
            count: 10,
            unitValue: 5000.0,
            category: tech._id
        });
        await this.notebook.save((err) => {
            if(err) console.error(err);
        });

        this.pc = new Product({
            name: 'PC',
            description: 'PC test',
            count: 5,
            unitValue: 10000.0,
            category: tech._id
        });
        await this.pc.save((err) => {
            if(err) console.error(err);
        });

        this.today = new Date();
        this.admin = new User({
            name: 'admin',
            email: 'admin@mail.com',
            cellphone: '9999888888',
            permission: UserPermissions.ADMIN,
            createdAt: this.today.toString(),
            updatedAt: this.today.toString()
        });
        this.admin.setPassword('admin123');
        await this.admin.save(err => {
            if(err) console.error(err);
        });
        const id = this.admin._id;
        this.token = jwt.sign({ id }, process.env.SECRET, {expiresIn: 1000});
    });

    it('create discount without error', (done) => {
        const twoDaysLater = new Date(2021, 02, 12);
        const data = {
            name: 'Discount test',
            products: [this.notebook._id, this.pc._id],
            value: 100,
            expiresAt: twoDaysLater.toString(),
            percentage: false
        };
        request(app)
        .post('/discounts')
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
        .expect(201)
        .then(res => {
            assert.equal(res.body.name, data.name);
            assert.equal(res.body.value, data.value);
            assert.equal(res.body.expiresAt, twoDaysLater.toISOString());
            assert.equal(res.body.percentage, data.percentage);
            done();
        })
        .catch(err => {
            done(err);
        });
    });

    it('find one discount', async () => {
        const twoDaysLater = new Date(2021, 02, 12);
        const discount = new Discount({
            active: true,
            name: 'Discount test 2',
            products: [this.pc._id],
            value: 10,
            expiresAt: twoDaysLater.toString(),
            percentage: true
        });
        await discount.save(err => {
            if(err) console.error(err);
        });
        await request(app)
        .get('/discounts/' + discount._id)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
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
        const twoDaysLater = new Date(2021, 02, 12);
        const discount = new Discount({
            active: true,
            name: 'Discount test 3',
            products: [this.notebook._id],
            value: 10,
            expiresAt: twoDaysLater.toString(),
            percentage: true
        });
        await discount.save(err => {
            if(err) console.error(err);
        });
        await request(app)
        .delete('/discounts/' + discount._id)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
        .expect(200)
        .then(res => {
            assert.equal(res.body.message, MSG.DISCOUNT.DELETED)
        })
        .catch(err => {
            assert.fail(err);
        });
    });

    it('list discounts', (done) => {
        Discount.insertMany([
            {active: true, name: 'discount test 1', products: [this.notebook._id], value: 50, expiresAt: this.today.toString(), percentage: false},
            {active: true, name: 'discount test 2', products: [this.pc._id], value: 50, expiresAt: this.today.toString(), percentage: false},
            {active: true, name: 'discount test 3', products: [this.notebook._id], value: 50, expiresAt: this.today.toString(), percentage: false},
            {active: true, name: 'discount test 4', products: [this.pc._id], value: 50, expiresAt: this.today.toString(), percentage: false},
            {active: true, name: 'discount test 4', products: [this.notebook._id, this.pc._id], value: 10, expiresAt: this.today.toString(), percentage: true}
        ]);
        request(app)
        .get('/discounts')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
        .expect(200)
        .then(res => {
            assert.isAbove(res.body.length, 5);
            done();
        })
        .catch(err => {
            done(err);
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