const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth');

const {
  createItem,
  getItems,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

router.get('/', authMiddleware, getItems);

router.post('/', authMiddleware, createItem);

router.put('/:id', authMiddleware, updateItem);

router.delete('/:id', authMiddleware, deleteItem);

module.exports = router;