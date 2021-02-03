const UserPermissions = require('../../src/models/UserPermission');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const assert = require('chai').assert;
const request = require('supertest');
const User = require('../../src/models/User');

describe('Users super admin module', () => {
    let adminToken = null;
    let basicUser = null;

    before((done) => {
        const today = new Date();
        const adminUser = new User({
            name: 'Admin',
            email: 'admin2@mail.com',
            cellphone: '22222222222',
            permission: UserPermissions.SUPER_ADMIN,
            createdAt: today.toString(),
            updatedAt: today.toString()
        });
        adminUser.setPassword('admin123');

        const basicUser1 = new User({
            name: 'Teste 4',
            email: 'teste4@gmail.com',
            cellphone: '22222222222',
            createdAt: today.toString(),
            updatedAt: today.toString()
        });
        basicUser1.setPassword('basic1');

        const basicUser2 = new User({
            name: 'Teste 5',
            email: 'teste5@gmail.com',
            cellphone: '11111111111',
            createdAt: today.toString(),
            updatedAt: today.toString()
        });
        basicUser2.setPassword('basic2');

        User.deleteMany((err) => {
            if(err) done(err);
            adminUser.save((err, obj) => {
                if(err) done(err);
                const id = obj._id;
                this.adminToken = jwt.sign({ id }, process.env.SECRET, { expiresIn: 1000 });
                basicUser1.save((err) => {
                    if(err) done(err);
                    basicUser2.save((err, saved) => {
                        if(err) done(err);
                        this.basicUser = saved;
                        done();
                    });
                });
            });
        });
        
    });

    it('Should return a list of users', (done) => {
        const token = this.adminToken;
        request(app)
        .get('/super-admin/users')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
            assert.isAbove(res.body.length, 0, 'User list is not greater than 0');
            done();
        })
        .catch(err => {
            done(err);
        });
    })

    it('Should return a user by find', (done) => {
        const token = this.adminToken;
        request(app)
        .get('/super-admin/users/' + this.basicUser._id)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
            assert.equal(res.body.name, this.basicUser.name);
            assert.equal(res.body.cellphone, this.basicUser.cellphone);
            assert.equal(res.body.email, this.basicUser.email);
            done();
        })
        .catch(err => {
            done(err);
        })
    })

    it('Should delete a user registered', (done) => {
        const token = this.adminToken;
        const today = new Date();
        const user = new User({
            name: 'Teste delete',
            email: 'testedelete@gmail.com',
            cellphone: '11111111111',
            createdAt: today.toString(),
            updatedAt: today.toString()
        })
        user.setPassword('teste231');
        user.save((err, obj) => {
            request(app)
            .delete('/super-admin/users/' + obj._id)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then(res => {
                assert.equal(res.body._id, user._id);
                done();
            })
            .catch(error => {
                done(error);
            })
        })
    })

    it('Should update user without erros', (done) => {
        const token = this.adminToken;
        const today = new Date();
        const user = new User({
            name: 'teste update user',
            email: 'update@mail.com',
            cellphone: '998281921',
            createdAt: today.toString(),
            updatedAt: today.toString()
        });
        user.setPassword('teste123');

        const update = {
            name: 'teste updated user',
            email: 'updated@mail.com',
            cellphone: '99982918291'
        };

        user.save((err, obj) => {
            request(app)
            .put('/super-admin/users/' + obj._id)
            .send(update)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token) 
            .expect(200)
            .then(res => {
                assert.equal(res.body._id, obj._id);
                assert.equal(res.body.name, update.name);
                assert.equal(res.body.cellphone, update.cellphone);
                done();
            })
            .catch(error => {
                done(error);
            })
        })
    })

    it('Should create a user without error', (done) => {
        const token = this.adminToken;
        const user = {
            name: 'User create',
            email: 'create@mail.com',
            cellphone: '12345453242',
            permission: 'admin',
            password: 'admin123',
            confirmPassword: 'admin123'
        };
        request(app)
        .post('/super-admin/users')
        .send(user)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token) 
            .expect(201)
            .then(res => {
                assert.equal(res.body.name, user.name);
                assert.equal(res.body.cellphone, user.cellphone);
                assert.equal(res.body.permission, user.permission);
                done();
            })
            .catch(error => {
                done(error);
            })
    })

    after((done) => {
        User.deleteMany((err) => {
            if (err) done(err);
            done();
        });
    });
})