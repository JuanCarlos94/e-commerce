const request = require('supertest');
const assert = request('chai').assert
const app = require('../../app');
const User = require('../../src/models/User');
const msg = require('../../src/config/Messages');

describe('Authentication module', function () {
    before(async () => {
        await User.deleteMany();
        const user = new User({
            name: 'test',
            email: 'test@mail.com',
            cellphone: '99988223311'
        });
        user.setPassword('test123');
        await user.save();
    })

    it('Should login without error', (done) => {
        const credentials = { email: 'test@mail.com', password: 'test123' }
        request(app)
            .post('/login')
            .send(credentials)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                done();
            });
    })

    it('Should not login', (done) => {
        const credentials = {email: 'error@email.com', password: '12345'};
        request(app)
        .post('/login')
        .send('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            res.body.message = msg.Authorization.USER_NOT_FOUND
        })
        .end((err, res) => {
            if(err) done(err);
            done();
        })
    })

    it('Should not login with wrong password', (done) => {
        const credentials = {email: 'test@mail.com', password: '123'};
        request(app)
        .post('/login')
        .send('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            res.body.message = msg.Authorization.WRONG_PASSWORD
        })
        .end((err, res) => {
            if(err) done(err);
            done();
        })
    })

    it('Should logout', (done) => {
        request(app)
            .post('/logout')
            .send()
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if(err) done(err);
                done();
            })
    })

    after(async (done) => {
        User.deleteMany();
        done();
    })
});