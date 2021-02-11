const app = require('../../app');
const assert = require('chai').assert;
const request = require('supertest');
const msg = require('../../src/config/Messages');
const Category = require('../../src/models/Category');
const Product = require('../../src/models/Product');
const ProductEvaluation = require('../../src/models/ProductEvaluation');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');
const UsersPermissions = require('../../src/models/enums/UserPermission');

describe('Product Evaluations module test', function () {
    let token = null;
    let productID = null;
    let userID = null;

    before((done) => {
        const category = new Category({
            name: 'Furniture',
            key: 'FURNITURE'
        });

        const product = new Product({
            category: category._id,
            name: 'Sofa',
            description: 'Big Sofa',
            count: 5,
            unitValue: 500.0
        });
        const today = new Date();
        const user = new User({
            name: 'user_test',
            email: 'userteste@mail.com',
            cellphone: '99999999999',
            permission: UsersPermissions.USER,
            createdAt: today.toString(),
            updatedAt: today.toString()
        });
        user.setPassword('user_test123');

        Category.deleteMany((err) => {
            if (err) done(err);
            Product.deleteMany((err) => {
                if (err) done(err);
                User.deleteMany((err) => {
                    if (err) done(err);
                    category.save((err) => {
                        if (err) done(err);
                        product.save((err) => {
                            if (err) done(err);
                            user.save((err) => {
                                if (err) done(err);
                                const id = user._id;
                                this.userID = id;
                                this.token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 100000 });
                                this.productID = product._id;
                                done();
                            });
                        });
                    });
                });
            });
        });
    })

    it('Should create a evaluation without error', (done) => {
        const payload = {
            productId: this.productID,
            rating: '10',
            message: 'Very nice'
        };
        request(app)
        .post('/products-evaluation')
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
        .expect(201)
        .then(res => {
            assert.equal(payload.rating, res.body.rating);
            assert.equal(payload.message, res.body.message);
            assert.equal(payload.productId, res.body.product);
            done();
        })
        .catch(err => {
            done(err);
        });
    });

    it('Should not save product evaluation, product not informed', (done) => {
        const payload = {
            productId: null,
            rating: '10',
            message: 'Very nice'
        };
        request(app)
        .post('/products-evaluation')
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
        .expect(404)
        .then(res => {
            assert.equal(msg.PRODUCTS_EVALUATIONS.PRODUCT_NOT_FOUND, res.body.message);
            done();
        })
        .catch(err => {
            done(err);
        });
    });

    it('Should not save product evaluation, user not found', (done) => {
        const payload = {
            productId: this.productID,
            rating: '10',
            message: 'Very nice'
        };
        request(app)
        .post('/products-evaluation')
        .send(payload)
        .set('Content-Type', 'application/json')
        .expect(401)
        .then(res => {
            assert.equal(msg.Authorization.ACCESS_DENIED, res.body.message);
            done();
        })
        .catch(err => {
            done(err);
        });
    });

    it('Should return a evaluation', (done) => {
        const today = new Date();
        const evaluation = new ProductEvaluation({
            user: this.userID,
            product: this.productID,
            rating: 10,
            date: today.toString(),
            message: 'Very good'
        });
        evaluation.save((err, saved) => {
            if(err) done(err);
            request(app)
            .get('/products-evaluation/' + saved._id)
            .set('Content-Type', 'application/json')
            .expect(200)
            .then(res => {
                assert.equal(saved._id, res.body._id);
                assert.equal(saved.user, res.body.user);
                assert.equal(saved.product, res.body.product);
                assert.equal(saved.date.toISOString(), res.body.date);
                assert.equal(saved.message, res.body.message);
                done();
            })
            .catch(err => {
                done(err);
            });
        })
    })

    it('Should return a list of evaluations by product', async () => {
        const today = new Date();
        for(let i = 0; i <= 20; i++){
            const evaluation = new ProductEvaluation({
                user: this.userID,
                product: this.productID,
                rating: Math.floor(Math.random() * 11),
                date: today.toString(),
                message: 'Very good'
            });
            await evaluation.save((err) => {
                if(err) console.error(err);
            });
        }
        await request(app)
        .get('/products-evaluation/' + this.productID + '/1/by-product')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(res => {
            assert.equal(res.body.length, 10);
            assert.isAbove(parseInt(res.headers['x-total']), 20);
        })
        .catch(err => {
            console.error(err);
        });
        await request(app)
        .get('/products-evaluation/' + this.productID + '/2/by-product')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(res => {
            assert.equal(res.body.length, 10);
            assert.isAbove(parseInt(res.headers['x-total']), 20);
        })
        .catch(err => {
            console.error(err);
        });
    })

    after((done) => {
        Category.deleteMany((err) => {
            if (err) done(err);
            Product.deleteMany((err) => {
                if (err) done(err);
                User.deleteMany((err) => {
                    if (err) done(err);
                    done();
                });
            });
        });
    });

})