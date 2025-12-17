// ====== КАТЕГОРИИ ======
app.get('/api/categories', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DISTINCT ON (name) id, name, description, active
      FROM categories
      ORDER BY name, id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения категорий:', err);
    res.status(500).json({ error: 'Ошибка получения категорий' });
  }
});
