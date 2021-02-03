const app = require('../../app');
const assert = require('chai').assert;
const request = require('supertest');
const User = require('../../src/models/User');
const msg = require('../../src/config/Messages');
const jwt = require('jsonwebtoken');

describe('User module', function () {

    before(() => {
        User.deleteMany();
    });

    it('Should sign up user without error', (done) => {
        const user = {
            name: 'Teste',
            email: 'teste@gmail.com',
            password: 'teste123',
            confirmPassword: 'teste123',
            cellphone: '11111111111'
        };
        request(app)
            .post('/signup')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                assert.isNotEmpty(res.body.id);
                done();
            })
            .catch(err => {
                done(err);
            })
    })

    it('Not sign up: email registered', (done) => {
        const payload = {
            name: 'Teste',
            email: 'teste@gmail.com',
            password: 'teste123',
            confirmPassword: 'teste123',
            cellphone: '11111111111'
        };
        const user = new User(payload);
        user.save((err, userCreated) => {
            request(app)
                .post('/signup')
                .send(payload)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500)
                .then(res => {
                    assert.equal(res.body.message, msg.USERS.EMAIL_REGISTERED);
                    done();
                })
                .catch(error => {
                    done(error);
                });
        })
    })

    it('Not sign up by password not match', (done) => {
        const payload = {
            name: 'Teste3',
            email: 'teste3@gmail.com',
            password: 'teste12',
            confirmPassword: 'teste123',
            cellphone: '11111111111'
        };
        const user = new User(payload);
        user.save((err, userCreated) => {
            request(app)
                .post('/signup')
                .send(payload)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500)
                .then(res => {
                    assert.equal(res.body.message, msg.USERS.PASSWORD_NOT_MATCH);
                    done();
                })
                .catch(error => {
                    done(error);
                });
        })
    });

    it('Not sign up: name not informed', (done) => {
        let payload = {};
        request(app)
            .post('/signup')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
            .then(res => {
                assert.equal(res.body.message, msg.USERS.NAME_NOT_INFORMED);
                done();
            })
            .catch(error => {
                done(error);
            });
    })

    it('Not sign up email not informed', (done) => {
        let payload = {
            name: 'Teste4'
        };
        request(app)
            .post('/signup')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
            .then(res => {
                assert.equal(res.body.message, msg.USERS.EMAIL_NOT_INFORMED);
                done();
            })
            .catch(err => {
                done(err);
            });
    })

    it('Not sign up: cellphone not informed', (done) => {
        let payload = {
            name: 'Teste4',
            email: 'test4@mail.com'
        };
        request(app)
            .post('/signup')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
            .then(res => {
                assert.equal(res.body.message, msg.USERS.CELLPHONE_NOT_INFORMED);
                done();
            })
            .catch(err => {
                done(err);
            });
    })

    it('Not sign up: password not informed', (done) => {
        let payload = {
            name: 'Teste4',
            email: 'test4@mail.com',
            cellphone: '11111111111'
        };
        request(app)
            .post('/signup')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
            .then(res => {
                assert.equal(res.body.message, msg.USERS.PASSWORD_NOT_INFORMED)
                done();
            })
            .catch(err => {
                done(err);
            });
    })

    it('should find user sign in', (done) => {
        const today = new Date();
        const user = new User({
            name: 'Teste2',
            email: 'teste2@gmail.com',
            cellphone: '11111111111',
            createdAt: today.toString(),
            updatedAt: today.toString()
        });
        user.setPassword('teste123');
        user.save((err, user) => {
            if (err) done(err);
            const id = user._id;
            const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 1000 });
            request(app)
                .get('/me')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .then(res => {
                    assert.equal(res.body._id, user._id);
                    assert.equal(res.body.name, user.name);
                    assert.equal(res.body.email, user.email);
                    assert.equal(res.body.cellphone, user.cellphone);
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });
    })

    after((done) => {
        User.deleteMany((err) => {
            if (err) done(err);
            done();
        });
    });
})