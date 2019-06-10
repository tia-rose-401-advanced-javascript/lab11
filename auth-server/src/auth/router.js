'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');

/**
 * @method POST - creates a new user on signup route
 */

authRouter.post('/signup', (req, res, next) => {
  console.log(req.body);
  let user = new User(req.body);
  user.save()
  .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    }).catch(next);
});

/**
 * @method GET - signs in a user
 */

authRouter.get('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

module.exports = authRouter;
