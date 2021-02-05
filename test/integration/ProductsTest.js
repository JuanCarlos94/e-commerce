const app = require('../../app');
const assert = require('chai').assert;
const request = require('supertest');
const Category = require('../../src/models/Category');
const Product = require('../../src/models/Product');
const msg = require('../../src/config/Messages');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');
const UserPermissions = require('../../src/models/UserPermission');

describe('Product module test', function () {
    let token = null;
    let category = null;

    before((done) => {
        Category.deleteMany((err) => {
            if (err)
                console.log('Category delete', err);
        });
        Product.deleteMany();
        const today = new Date();
        const user = new User({
            'name': 'admin',
            'email': 'admin@mail.com',
            'cellphone': '9999888888',
            'permission': UserPermissions.ADMIN,
            createdAt: today.toString(),
            updatedAt: today.toString()
        });
        user.setPassword('admin123');

        // Create user ADMIN
        user.save((err, element) => {
            const id = element._id;
            // Generate token to Authorization
            this.token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: 10000
            });

            // Create category Furniture
            new Category({
                'name': 'Electronics',
                'key': 'ELECTRONICS'
            }).save((err, created) => {
                this.category = created;
                done();
            })
        });
    });

    it('Should create a product without error', (done) => {
        const payload = {
            "name": "Desk",
            "description": "Desk 50",
            "unitValue": 22.00,
            "count": 15,
            "category": this.category
        };
        request(app)
            .post('/admin/products')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.token)
            .expect(201)
            .then(res => {
                assert.equal(res.body.name, payload.name);
                assert.equal(res.body.description, payload.description);
                assert.equal(res.body.unitValue, payload.unitValue);
                assert.equal(res.body.count, payload.count);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('Product not created: name not informed', (done) => {
        const payload = {};
        request(app)
            .post('/admin/products')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.token)
            .expect(500)
            .then(res => {
                assert.equal(res.body.message, msg.PRODUCTS.NAME_NOT_INFORMED);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('Product not created: description not informed', (done) => {
        const payload = {
            name: 'TV'
        };
        request(app)
            .post('/admin/products')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.token)
            .expect(500)
            .then(res => {
                assert.equal(res.body.message, msg.PRODUCTS.DESCRIPTION_NOT_INFORMED);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('Product not created: count not informed', (done) => {
        const payload = {
            name: 'TV',
            description: 'TV 50'
        };
        request(app)
            .post('/admin/products')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.token)
            .expect(500)
            .then(res => {
                assert.equal(res.body.message, msg.PRODUCTS.COUNT_NOT_INFORMED);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('Product not created: unit value not informed', (done) => {
        const payload = {
            name: 'TV',
            description: 'TV 50',
            count: 10
        };
        request(app)
            .post('/admin/products')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.token)
            .expect(500)
            .then(res => {
                assert.equal(res.body.message, msg.PRODUCTS.UNIT_VALUE_NOT_INFORMED);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('Product not created: user has not permission', (done) => {
        const today = new Date();
        const user = new User({
            name: 'user',
            email: 'user@mail.com',
            cellphone: '99988223311',
            permission: UserPermissions.USER,
            createdAt: today.toString(),
            updatedAt: today.toString()
        });
        const product = {
            name: 'TV',
            description: 'TV 50',
            count: 10,
            unitValue: 5000.0
        };
        user.setPassword('user123');
        user.save((err, userSaved) => {
            const id = userSaved._id;
            const tokenUser = jwt.sign({ id }, process.env.SECRET, { expiresIn: 1000});
            request(app)
            .post('/admin/products')
            .send(product)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + tokenUser)
            .expect(401)
            .then(res => {
                assert.equal(res.body.message, msg.Authorization.PERMISSION_DENIED);
                done();
            })
            .catch(error => {
                done(error);
            });
        });
    });

    it('Find product without error', (done) => {
        const product = new Product({
            name: 'TV SIMPLES',
            description: 'TV 42',
            count: 10,
            unitValue: 5000.0
        });
        const token = this.token;
        product.save((err, productSaved) => {
            request(app)
            .get('/products/' + productSaved._id)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then(res => {
                assert.equal(res.body._id, productSaved._id);
                done();
            })
            .catch(error => {
                done(error);
            });
        });
    })

    it('Should list products without error', async () => {
        const products = [
            {
                name: 'LAMP',
                description: 'LAMP 1',
                count: 20,
                unitValue: 100.0
            },
            {
                name: 'LAPTOP',
                description: 'LAPTOP 13',
                count: 4,
                unitValue: 5000.0
            }
        ];
        for(prod in products){
            let product = new Product(products[prod]);
            await product.save((err) => {
                if(err) console.error(err);
            });
        }
        const token = this.token;
        request(app)
        .get('/admin/products')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
            assert.isAbove(res.body.length, 0, 'List of products is return empty.');
        })
        .catch(error => {
            assert.fail(error);
        });
    })

    it('Update product without error', (done) => {
        const product = new Product({
            name: 'Sofa',
            description: 'Big sofa',
            count: 10,
            unitValue: 300.0
        });
        const productChanges = {
            name: 'Black sofa',
            description: 'Black Big Sofa',
            count: 5,
            unitValue: 500.0
        };
        const token = this.token;
        product.save((err, obj) => {
            request(app)
            .put('/admin/products/' + obj._id)
            .send(productChanges)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then(res => {
                assert.equal(res.body.name, productChanges.name);
                assert.equal(res.body.description, productChanges.description);
                assert.equal(res.body.count, productChanges.count);
                assert.equal(res.body.unitValue, productChanges.unitValue);
                done();
            })
            .catch(error => {
                done(error);
            })
        })
    })

    it('Should not update, product not found', (done) => {
        const productsChanges = {
            name: 'Black sofa',
            description: 'Black Big Sofa',
            count: 5,
            unitValue: 500.0
        }
        request(app)
        .put('/admin/products/222')
        .send(productsChanges)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
        .expect(404)
        .then(res => {
            done();
        })
        .catch(err => {
            done(err);
        })
    })

    after((done) => {
        Category.deleteMany((err) => {
            if (err)
                console.log('Category delete error', err);
        });
        Product.deleteMany((err) => {
            if (err)
                console.log('Product delete many error', err);
        });
        done();
    })
})