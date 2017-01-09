var expect = require('chai').expect;
var request = require('supertest');
var app = require('./server');
var handler = require('./userhandler');

describe('Morse webapp', function () {

    beforeEach(function () {
        app.init();
    });

    describe('GET',  () => {
        it('should return index.html for path: /',  (done) => {
            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                    done();
                });
        });

        describe('/users', () => {
            it('should return 200 with the list of users', (done) => {

                request(app)
                    .post('/users/')
                    .send('username=bob')
                    .end(function (err, res1) {
                        request(app)
                            .get('/users')
                            .expect(200)
                            .end(function (err, res2){
                                if(err) throw err;
                                expect(res2.body).to.eql([{username : 'bob', name : ''}])
                                done();
                            });
                    });
            });
        });

        describe('/users/:username/messages', () => {
            it('should return 401 if X-Auth is missing or not belongs to any user', (done) => {
                request(app)
                    .post('/users/')
                    .send('username=bob')
                    .end(function (err, res) {
                        request(app)
                            .get('/users/bob/messages')
                            .set({ 'X-Auth': 'NONEXISTENTSOMETHING' })
                            .expect(401)
                            .end(function (err, res) {
                                if (err) throw err;
                                done();
                            });
                    });
            });

            it('should return 403 if someone tries to read other users message(s)', (done) => {
                request(app)
                    .post('/users')
                    .send('username=bob')
                    .end(function (err, res) {
                        request(app)
                            .post('/users')
                            .send('username=john')
                            .end(function (err, res) {
                                request(app)
                                    .get('/users/bob/messages')
                                    .set({ 'X-Auth': handler.encodeUserName('john') })
                                    .expect(403)
                                    .end(function (err, res) {
                                        if (err) throw err;
                                        done();
                                    });
                            });
                    });
            });

            it('should return 200 and the messages array in the body if someone is trying to read his own messages', (done) => {
                request(app)
                    .post('/users')
                    .send('username=bob')
                    .end(function (err, res1) {
                        request(app)
                            .post('/users')
                            .send('username=john&name=John Doe')
                            .end(function (err, res2) {
                                request(app)
                                    .get('/users/john/messages')
                                    .set({ 'X-Auth': handler.encodeUserName('john') })
                                    .expect(200)
                                    .end(function (err, res) {
                                        if (err) throw err;
                                        expect(res.body).to.eql([]);
                                    });
                                request(app)
                                    .post('/users/bob/messages')
                                    .set({ 'X-Auth': res2.body.token })
                                    .send('message=.... . .-.. .-.. ---')
                                    .end(function (err, res) {
                                        if (err) throw err;
                                        request(app)
                                            .get('/users/john/messages')
                                            .set({ 'X-Auth': handler.encodeUserName('john') })
                                            .expect(200)
                                            .end(function (err, res) {
                                                if (err) throw err;
                                                expect(res.body).to.eql([{from : 'John Doe', to : 'bob', message : '.... . .-.. .-.. ---' }]);
                                                done();
                                            });

                                    });
                            });
                    });
            })
        });
    });

    describe('POST', function () {

        describe('/users', function () {

            it('should return 200 with a unique token for path: /users without name', (done) => {
                request(app)
                    .post('/users')
                    .send('username=asd')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) throw err;
                        expect(res.body).to.eql({ 'token': 'K3N' });
                        done();
                    });
            });

            it('should return 200 with a unique token for path: /users with name', (done) => {
                request(app)
                    .post('/users')
                    .send('username=asd&name=Han Solo')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) throw err;
                        expect(res.body).to.eql({ 'token': 'K3N' });
                        done();
                    });

            });

            it('should return 400 for path: /users if name already exists', (done) => {

                request(app)
                    .post('/users')
                    .send('username=asd')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) throw err;
                        request(app)
                            .post('/users')
                            .send('username=asd')
                            .expect(400)
                            .end(function (err, res) {
                                done();
                            });
                    });
            });
        });


        describe('/users/:username/messages', function () {
            it('should return 202 for path: /users/:username/messages if username exists', (done) => {
                request(app)
                    .post('/users')
                    .send('username=alice')
                    .end(function (err, res1) {
                        if (err) throw err;
                        request(app)
                            .post('/users')
                            .send('username=bob')
                            .end(function (err, res2) {
                                request(app)
                                    .post('/users/bob/messages')
                                    .set({ 'X-Auth': res1.body.token })
                                    .send('message=.... . .-.. .-.. ---')
                                    .expect(202)
                                    .end(function (err, res) {
                                        if (err) throw err;
                                        done();
                                    });
                            });
                    });
            });

            it('should return 404 for path: /users/:username/messages if username doesn\'t exists', (done) => {

                request(app)
                    .post('/users')
                    .send('username=alice')
                    .end(function (err, res1) {
                        if (err) throw err;
                        request(app)
                            .post('/users/bob/messages')
                            .set({ 'X-Auth': res1.body.token })
                            .send('message=.... . .-.. .-.. ---')
                            .expect(404)
                            .end(function (err, res) {
                                if (err) throw err;
                                done();
                            });
                    });
            });
        });

        it('should return 401 for path: /users/:username/messages if x-auth is non existent, or doesn\'t match', (done) => {

            request(app)
                .post('/users')
                .send('username=alice')
                .end(function (err, res) {
                    if (err) throw err;
                    request(app)
                        .post('/users/bob/messages')
                        .send('message=.... . .-.. .-.. ---')
                        .expect(401)
                        .end(function (err, res) {
                            if (err) throw err;
                        });
                });
            request(app)
                .post('/users/bob/messages')
                .set({ 'X-Auth': 'BOB' })
                .send('message=.... . .-.. .-.. ---')
                .expect(401)
                .end(function (err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });

});
