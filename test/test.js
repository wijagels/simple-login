var assert = require('assert');

describe('UserManager', function() {
  var um = require('../lib/index.js');
  before(function(done) {
    setTimeout(function() {
      um.users.remove({}, function(err) {
        done();
      });
    }, 100);
  });
  describe('#register()', function() {
    it('should not produce an error if the user does not exist', function(done) {
      um.register('test', 'test', function(err, result) {
        assert.equal(undefined, err);
        assert.equal(1, result.result.ok);
        done();
      });
    });
    it('should produce an error if the user exists', function(done) {
      um.register('test', 'test', function(err, result) {
        assert.notEqual(undefined, err);
        assert.equal(undefined, result);
        done();
      });
    });
  });
  describe('#login()', function() {
    it('should not produce an error if the login is correct', function(done) {
      um.login('test', 'test', function(err, result) {
        assert.equal(undefined, err);
        assert.equal(true, result);
        done();
      });
    });
    it('should deny incorrect passwords', function(done) {
      um.login('test', 'wrong-password', function(err, result) {
        assert.equal(undefined, err);
        assert.equal(false, result);
        done();
      });
    });
    it('should error if the username does not exist', function(done) {
      um.login('not-a-user', 'test', function(err, result) {
        assert.notEqual(undefined, err);
        assert.notEqual(true, result);
        done();
      });
    });
  });
  describe('#delete()', function() {
    it('should not produce an error if the user exists', function(done) {
      um.delete('test', 'test', function(err, result) {
        assert.equal(undefined, err);
        assert.equal(1, result.result.ok);
        done();
      });
    });
    it('should not delete if the password is wrong', function(done) {
      um.delete('test', 'wrong-password', function(err, result) {
        assert.notEqual(undefined, err);
        assert.equal(undefined, result);
        done();
      });
    });
  });
  after(function(done) {
    um.users.drop(function() {
      um.db.close(done);
    });
  });
});

