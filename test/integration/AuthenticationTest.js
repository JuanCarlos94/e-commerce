const app = require('../../app');
const request = require('supertest');
const assert = require('chai').assert;
const User = require('../../src/models/User');
const msg = require('../../src/config/Messages');

describe('Authentication module', function () {
    before(async () => {
        await User.deleteMany((err) => {
            if(err) assert.fail(err);
        });
        const today = new Date();
        const user = new User({
            name: 'test',
            email: 'test@mail.com',
            cellphone: '99988223311',
            createdAt: today.toString(),
            updatedAt: today.toString()
        });
        user.setPassword('test123');
        await user.save(err => {
            if(err) assert.fail(err);
        });
    })

    it('Should login without error', (done) => {
        const credentials = { email: 'test@mail.com', password: 'test123' }
        request(app)
            .post('/login')
            .send(credentials)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                done();
            })
            .catch(err => {
                done(err);
            });
    })

    it('Should not login', (done) => {
        const credentials = { email: 'error@email.com', password: '12345' };
        request(app)
            .post('/login')
            .send(credentials)
            .expect('Content-Type', /json/)
            .then(res => {
                assert.equal(res.body.message, msg.Authorization.USER_NOT_FOUND);
                done();
            })
            .catch(err => {
                done(err);
            });
    })

    it('Should not login with wrong password', (done) => {
        const credentials = { email: 'test@mail.com', password: '123' };
        request(app)
            .post('/login')
            .send(credentials)
            .expect('Content-Type', /json/)
            .then(res => {
                assert.equal(res.body.message, msg.Authorization.WRONG_PASSWORD);
                done();
            })
            .catch(err => {
                done(err);
            });
    })

    it('Should logout', (done) => {
        request(app)
            .post('/logout')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                done();
            })
            .catch(err => {
                done(err);
            });
    })

    after((done) => {
        User.deleteMany(err => {
            if (err) done(err);
            done();
        });
    })
});