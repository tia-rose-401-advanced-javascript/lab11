'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * user object
 */
const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required:true, default:'user', enum:['admin','editor','user'] },
});

/**
 * Encrypts user information
 */
users.pre('save', function(next) {
  bcrypt.hash(this.password,10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch( error => {throw error;} );
});

/**
 * Seeing if user is in database
 */
users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
  .then(user => {
    if(user && user.comparePassword(auth.password)){
      console.log(user);
      return user;
    }
  })
    .catch(console.error);
};

/**
 * Compares password in database from user input
 */

// Compare a plain text password against the hashed one we have saved
users.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
  .then(valid => valid ? this : null);
};

/**
 * Creates Web Token
 */
// Generate a JWT from the user id and a secret
users.methods.generateToken = function() {
  let tokenData = {
    id:this._id,
    capabilities: this.role,
  };
  return jwt.sign(tokenData, process.env.SECRET || 'changeit' );
};

module.exports = mongoose.model('users', users);
