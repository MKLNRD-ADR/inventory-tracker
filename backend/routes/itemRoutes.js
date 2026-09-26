const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth');

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  getLowStockReport
} = require('../controllers/itemController');

router.get('/report/low-stock', authMiddleware, getLowStockReport);

router.get('/', authMiddleware, getItems);

router.post('/', authMiddleware, createItem);

router.put('/:id', authMiddleware, updateItem);

router.delete('/:id', authMiddleware, deleteItem);

module.exports = router;