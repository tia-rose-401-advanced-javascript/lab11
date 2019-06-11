'use strict';

const User = require('./users-model.js');

module.exports = (req, res, next) => {

  try {

    let [authType, encodedString] = req.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
      case 'basic':
        return _authBasic(encodedString);
      default:
        // return _authError();
        _authError();
    }

  } catch(e) {
    // return _authError();
    _authError();
  }

  /**
   * Decodes the user hash string
   * @param {String} encodedString 
   */

  function _authBasic(encodedString) {
    let base64Buffer = Buffer.from(encodedString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
    let auth = {username,password};  // {username:"john", password:"mysecret"}

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }

  /**
   * Generates a token for the user
   * @param {Object} user 
   */

  function _authenticate(user) {
    if ( user ) {
      req.user = user;
      req.token = user.generateToken();
      next();
    }
    else {
      _authError();
    }
  }

  /**
   * Returns error message if no user or password present
   */

  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};

