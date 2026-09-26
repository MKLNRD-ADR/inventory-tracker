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

const getItems = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .query('SELECT * FROM Items ORDER BY id DESC');

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, sku, category, quantity, price, low_stock_threshold } = req.body;

  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('sku', sql.VarChar, sku)
      .input('category', sql.VarChar, category)
      .input('quantity', sql.Int, quantity)
      .input('price', sql.Decimal(10, 2), price)
      .input('low_stock_threshold', sql.Int, low_stock_threshold || 5)
      .query(`
        UPDATE Items
        SET
          name = @name,
          sku = @sku,
          category = @category,
          quantity = @quantity,
          price = @price,
          low_stock_threshold = @low_stock_threshold,
          updated_at = GETDATE()
        WHERE id = @id
      `);

    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Items WHERE id = @id');

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createItem, getItems, updateItem, deleteItem };