var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var bcrypt = require('bcrypt');

module.exports = new UserManager();

/**
 * UserManager constructor
 *
 * @constructor
 */

function UserManager() {
  this.BC_LEVEL = 10;
  this.db = null;
  this.users = null;
  this.url = 'mongodb://localhost:27017/test';
  MongoClient.connect(this.url, (err, database) => {
    if(!err) {
      this.db = database;
      this.users = this.db.collection('users');
    }
  });
}

/**
 * Login function
 *
 * @api public
 * @param {string} username
 * @param {string} password
 * @param {function} cb
 */

UserManager.prototype.login = function(username, password, cb) {
  if(!this.db || !this.users) {
    return cb(new Error('No db connection'));
  }
  var users = this.users;
  async.waterfall([
    function(callback) {
      users.findOne({'user': username}, (err, docs) => {
        if(!docs) {
          return callback(new Error('No such user'));
        }
        callback(err, docs);
      });
    },
    function(docs, callback) {
      bcrypt.compare(password, docs.pass, (err, result) => {
        callback(err, result, docs);
      });
    }
  ], cb);
};

/**
 * Register new user function
 *
 * @api public
 * @param {string} username
 * @param {string} password
 * @param {function} cb callback to be called with cb(err, result)
 */

UserManager.prototype.register = function(username, password, cb) {
  if(!this.db) {
    return cb(new Error('No db connection'));
  }
  var users = this.users;
  var BC_LEVEL = this.BC_LEVEL;
  async.waterfall([
    function(callback) {
      users.findOne({'user': username}, (err, docs) => {
        // If search returns results, error.
        if(docs) {
          return callback(new Error('User exists'));
        }
        callback(err);
      });
    },
    function(callback) {
      bcrypt.hash(password, BC_LEVEL, (err, hash) => {
        if(err) {
          return callback(err);
        }
        callback(err, hash);
      });
    },
    function(hash, callback) {
      users.insertOne({'user': username, 'pass': hash}, callback);
    }
  ], cb);
};

/**
 * Delete existing user function
 *
 * @api public
 * @param {string} username
 * @param {string} password
 * @param {function} cb
 */

UserManager.prototype.delete = function(username, password, cb) {
  if(!this.db) {
    return cb(new Error('No db connection'));
  }
  var users = this.users;
  async.waterfall([
    function(callback) {
      users.findOne({'user': username}, (err, docs) => {
        if(!docs) {
          return callback(new Error('No such user'));
        }
        callback(err, docs);
      });
    },
    function(docs, callback) {
      bcrypt.compare(password, docs.pass, (err, result) => {
        callback(err, docs, result);
      });
    },
    function(docs, result, callback) {
      users.removeOne(docs, callback);
    }
  ], cb);
};
