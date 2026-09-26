const { sql, poolPromise } = require('../config/db');

const createItem = async (req, res) => {
  const { name, sku, category, quantity, price, low_stock_threshold } = req.body;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('name', sql.VarChar, name)
      .input('sku', sql.VarChar, sku)
      .input('category', sql.VarChar, category)
      .input('quantity', sql.Int, quantity)
      .input('price', sql.Decimal(10, 2), price)
      .input('low_stock_threshold', sql.Int, low_stock_threshold || 5)
      .query(`
        INSERT INTO Items (name, sku, category, quantity, price, low_stock_threshold)
        VALUES (@name, @sku, @category, @quantity, @price, @low_stock_threshold)
      `);

    res.status(201).json({ message: 'Item created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createItem };