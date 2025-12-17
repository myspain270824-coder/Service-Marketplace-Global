// serviceRequestsModel.js
const db = require('../db');

// Создание новой заявки
async function createServiceRequest(data) {
  const { name, phone, email, service_id, description } = data;

  const query = `
    INSERT INTO service_requests (name, phone, email, service_id, description, status)
    VALUES ($1, $2, $3, $4, $5, 'new')
    RETURNING id;
  `;

  const values = [name, phone, email, service_id, description];
  const result = await db.query(query, values);
  return result.rows[0].id;
}

// Получить все заявки (с фильтрацией по статусу)
async function getAllServiceRequests(status = 'all') {
  let query = `
    SELECT r.id, r.name, r.phone, r.email, r.description, r.status,
           s.name AS service_name
    FROM service_requests r
    JOIN services s ON s.id = r.service_id
  `;

  const params = [];

  if (status !== 'all') {
    query += ` WHERE r.status = $1`;
    params.push(status);
  }

  query += ` ORDER BY r.id DESC;`;

  const result = await db.query(query, params);
  return result.rows;
}

// Получить одну заявку по id
async function getServiceRequestById(id) {
  const query = `
    SELECT r.id, r.name, r.phone, r.email, r.description, r.status,
           s.name AS service_name
    FROM service_requests r
    JOIN services s ON s.id = r.service_id
    WHERE r.id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
}

// Обновить статус заявки
async function updateServiceRequestStatus(id, status) {
  const query = `
    UPDATE service_requests
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [status, id]);
  return result.rows[0];
}

module.exports = {
  createServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceRequestStatus,
};
