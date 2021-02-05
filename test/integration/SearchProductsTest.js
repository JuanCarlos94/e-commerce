const app = require('../../app');
const assert = require('chai').assert;
const request = require('supertest');
const Product = require('../../src/models/Product');
const Category = require('../../src/models/Category');

describe('Search products tests', () => {
    before(async () => {
        await Category.deleteMany(err => {
            if (err) console.error(err);
        });
        await Product.deleteMany(err => {
            if (err) console.error(err);
        });

        const tech = new Category({
            name: 'Tech',
            key: 'TECH'
        });
        await tech.save();

        const notebook = new Product({
            name: 'Notebook',
            description: 'Notebook Acer full hd',
            unitValue: 2000,
            count: 10,
            sold: 10
        });
        notebook.category = tech._id;
        await notebook.save();

        const telephone = new Category({
            name: 'Telephone',
            key: 'TELEPHONE'
        });
        await telephone.save();
    
        const iphone = new Product({
            name: 'Iphone',
            description: 'Iphone 10',
            unitValue: 4000,
            count: 100,
            sold: 2
        });
        iphone.category = telephone._id;
        await iphone.save();

        const samsung = new Product({
            name: 'Samsung',
            description: 'Samsung A3',
            unitValue: 999.99,
            count: 100,
            sold: 30
        });
        samsung.category = telephone._id;
        await samsung.save();

        const kitchen = new Category({
            name: 'Kitchen',
            key: 'KITCHEN'
        });
        await kitchen.save();

        const fridge = new Product({
            name: 'Fridge',
            description: 'Fridge Electro',
            unitValue: 3000,
            count: 20,
            sold: 1
        });
        fridge.category = kitchen._id;
        await fridge.save();
    })

    it('Should return product by name', (done) => {
        const search = 'Electro';
        request(app)
        .get('/products?search=' + search)
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(res => {
            assert.equal(res.body.length, 1);
            done();
        })
        .catch(err => {
            done(err);
        });
    });

    it('Should return product by description phrase', (done) => {
        const search = 'full hd';
        request(app)
        .get('/products?search=' + search)
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(res => {
            assert.equal(res.body.length, 1);
            done();
        })
        .catch(err => {
            done(err);
        });
    });

    it('Should return two products by category name', (done) => {
        const search = 'Tele';
        request(app)
        .get('/products?search=' + search)
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(res => {
            assert.equal(res.body.length, 2);
            done();
        })
        .catch(err => {
            done(err);
        });
    });

    it('return top sold product', (done) => {
        request(app)
        .get('/top-sold-products')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(res => {
            console.log('top products', res.body);
            assert.isAbove(res.body.length, 0);
            done();
        })
        .catch(err => {
            done(err);
        });
    });

    after((done) => {
        Category.deleteMany(err => {
            if (err) done(err);
            Product.deleteMany(err => {
                if (err) done(err);
                done();
            });
        });        
    });
});