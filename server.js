// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const client = require('./db');

const {
  createServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceRequestStatus,
} = require('./serviceRequestsModel');

const app = express();
const PORT = 3000;

// ===== МИДДЛВАРЫ =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== HEALTHCHECK =====
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Service Marketplace API работает' });
});

// ===== КАТЕГОРИИ =====
app.get('/api/categories', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT id, name, description, active FROM categories ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Ошибка получения категорий' });
  }
});

// ===== ПОДКАТЕГОРИИ =====
app.get('/api/subcategories', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT id, category_id, name, description, active FROM subcategories ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    res.status(500).json({ error: 'Ошибка получения подкатегорий' });
  }
});

// ===== УСЛУГИ (список) =====
app.get('/api/services', async (req, res) => {
  try {
    const result = await client.query(
      `SELECT id, subcategory_id, name, description, contact, base_price, active
       FROM services
       ORDER BY id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Ошибка получения услуг' });
  }
});

// ===== УСЛУГА по id =====
app.get('/api/services/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      `SELECT id, subcategory_id, name, description, contact, base_price, active
       FROM services
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Услуга не найдена' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching service by id:', err);
    res.status(500).json({ error: 'Ошибка получения услуги' });
  }
});

// ===== УСЛУГИ по категории =====
app.get('/api/services/by-category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  try {
    const query = `
      SELECT
        s.id,
        s.name,
        s.description,
        s.contact,
        s.base_price,
        s.active,
        sc.id    AS subcategory_id,
        sc.name  AS subcategory_name,
        c.id     AS category_id,
        c.name   AS category_name
      FROM services s
      JOIN subcategories sc ON sc.id = s.subcategory_id
      JOIN categories c ON c.id = sc.category_id
      WHERE c.id = $1
      ORDER BY sc.id, s.id;
    `;

    const result = await client.query(query, [categoryId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching services by category:', err);
    res.status(500).json({ error: 'Ошибка получения услуг по категории' });
  }
});

// ===== УСЛУГИ по подкатегории =====
app.get('/api/services/by-subcategory/:subcategoryId', async (req, res) => {
  const { subcategoryId } = req.params;

  try {
    const query = `
      SELECT
        s.id,
        s.name,
        s.description,
        s.contact,
        s.base_price,
        s.active,
        s.subcategory_id
      FROM services s
      WHERE s.subcategory_id = $1
      ORDER BY s.id;
    `;

    const result = await client.query(query, [subcategoryId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching services by subcategory:', err);
    res.status(500).json({ error: 'Ошибка получения услуг по подкатегории' });
  }
});

// ===== СОЗДАНИЕ услуги (запасной эндпоинт) =====
app.post('/api/services', async (req, res) => {
  const { subcategory_id, name, description, contact, base_price, active = true } =
    req.body;

  try {
    const query = `
      INSERT INTO services
        (subcategory_id, name, description, contact, base_price, active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [subcategory_id, name, description, contact, base_price, active];

    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ error: 'Ошибка создания услуги' });
  }
});

// ===== ЗАЯВКИ КЛИЕНТОВ =====

// Создать новую заявку (клиентская форма)
app.post('/api/requests', async (req, res) => {
  try {
    const requestId = await createServiceRequest(req.body);
    res.status(201).json({ success: true, request_id: requestId });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ error: 'Ошибка создания заявки' });
  }
});

// Получить список заявок (для админки), с фильтром по статусу
app.get('/api/requests', async (req, res) => {
  const { status } = req.query; // new | in_progress | done | canceled | all

  try {
    const requests = await getAllServiceRequests(status);
    res.json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Ошибка получения заявок' });
  }
});

// Получить одну заявку (для "Подробнее")
app.get('/api/requests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = await getServiceRequestById(id);
    if (!request) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }
    res.json(request);
  } catch (err) {
    console.error('Error fetching request by id:', err);
    res.status(500).json({ error: 'Ошибка получения заявки' });
  }
});

// Обновить статус заявки
app.patch('/api/requests/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Не передан статус' });
  }

  try {
    const updated = await updateServiceRequestStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }
    res.json({ success: true, request: updated });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ error: 'Ошибка обновления статуса заявки' });
  }
});

// ===== ЗАПУСК СЕРВЕРА =====
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
