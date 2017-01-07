var expect = require('chai').expect;
var request = require('supertest');
var app = require('./server');

describe('Morse webapp', function() {
	describe('GET', function() {
		it('it should return index.html', function(done) {
            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(function(err, res){
                    if (err) throw err;
                    done();
                });
		});
	});
});
