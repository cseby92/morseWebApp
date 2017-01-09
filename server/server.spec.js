var expect = require('chai').expect;
var request = require('supertest');
var app = require('./server');
var handler = require('./userhandler');

describe('Morse webapp', function () {

    beforeEach(function () {
        app.init();
    });

    describe('GET', function () {


        it('should return index.html for path: /', function (done) {
            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                    done();
                });
        });

        /*it('should return the 0 messages for the specified user with 0 messages', function(done){ //folytat
             request(app)
                 .post('/users')
                 .send('username=bob')
                 .end(function(err,res){
                     request(app)
                     .get('/users/bob/messages')
                     .set({'X-Auth' : handler.encodeUserName('bob')})
                     .expect(200)
                     .end(function(err, res){
                         if(err) throw err;
                         expect(res.body.messages).to.eql([]);
                         done();
                     });
                 });
 
         }); */
    });

    describe('POST', function () {

        describe('/users', function () {

            it('should return 200 with a unique token for path: /users without name', function (done) {
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

            it('should return 200 with a unique token for path: /users with name', function (done) {
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

            it('should return 400 for path: /users if name already exists', function (done) {

                request(app)
                    .post('/users')
                    .send('username=asd')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) throw err;
                        request(app)
                            .post('/users')
                            .send('username=asd')
                            .expect(400);
                        done();
                    });
            });
        });


        describe('/users/:username/messages', function () {
            it('should return 202 for path: /users/:username/messages if username exists', function (done) {
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

            it('should return 404 for path: /users/:username/messages if username doesn\'t exists', function (done) {

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

        it('should return 401 for path: /users/:username/messages if x-auth is non existent, or doesn\'t match', function (done) {

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
