'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../auth/middleware');

router.get('/books', auth, handleGetAll);
router.get('/books/:id', auth, handleGetOne);

// Route Handlers
/**
 * Gets all books in database
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 */
function handleGetAll(req, res, next) {
  let books = {
    count: 3,
    results: [
      { title:'Moby Dick' },
      { title:'Little Women' },
      { title: 'Eloquent Javascript' },
    ],
  };
  res.status(200).json(books);
}

/**
 * Get one book out of database
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
function handleGetOne(req, res, next) {
  let book = {
    title:'Moby Dick',
  };
  res.status(200).json(book);
}

module.exports = router;


