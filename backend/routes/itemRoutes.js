const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createItem } = require('../controllers/itemController');

router.post('/', authMiddleware, createItem);

module.exports = router;