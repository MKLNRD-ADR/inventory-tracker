const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth');

const {
  createItem,
  getItems,
  updateItem
} = require('../controllers/itemController');

router.get('/', authMiddleware, getItems);

router.post('/', authMiddleware, createItem);

router.put('/:id', authMiddleware, updateItem);

module.exports = router;