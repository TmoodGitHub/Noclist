const request = require('supertest')('http://localhost:8888');
const falseRequest = require('supertest')('http://localhost:8889');
const { default: fetch } = require('node-fetch');
const { assert } = require('chai');
const index = require('./index');

describe('GET /auth', function () {
  let authToken = '';

  before(function (done) {
    request.get('/auth').end(function (err, res) {
      authToken = res.headers['badsec-authentication-token'];
      done();
    });
  });

  it('should fail without proper checksum value sent', function (done) {
    request.get('/users').expect(500, done);
  });

  it('should pass with proper checksum value sent', function (done) {
    request.get('/users').set('X-Request-Checksum', index.sha256(authToken)).expect(200, done);
  });
});
