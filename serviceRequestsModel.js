// serviceRequestsModel.js
const client = require('./db');

// создать новую заявку
async function createServiceRequest(data) {
  const { service_id, customer_name, customer_contact, city, comment } = data;

  const query = `
    INSERT INTO service_requests
      (service_id, customer_name, customer_contact, city, comment)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;

  const values = [service_id, customer_name, customer_contact, city, comment];
  const result = await client.query(query, values);
  return result.rows[0].id;
}

// получить список заявок (с фильтром по статусу)
async function getAllServiceRequests(status) {
  let query = `
    SELECT
      r.id,
      r.service_id,
      r.customer_name,
      r.customer_contact,
      r.city,
      r.comment,
      r.status,
      r.created_at,
      s.name AS service_name
    FROM service_requests r
    JOIN services s ON s.id = r.service_id
  `;

  const params = [];

  if (status && status !== 'all') {
    params.push(status);
    query += ` WHERE r.status = $1`;
  }

  query += ` ORDER BY r.created_at DESC`;

  const result = await client.query(query, params);
  return result.rows;
}

// получить одну заявку по id (для окна "Подробнее")
async function getServiceRequestById(id) {
  const query = `
    SELECT
      r.id,
      r.service_id,
      r.customer_name,
      r.customer_contact,
      r.city,
      r.comment,
      r.status,
      r.created_at,
      s.name        AS service_name,
      s.description AS service_description
    FROM service_requests r
    JOIN services s ON s.id = r.service_id
    WHERE r.id = $1
  `;

  const result = await client.query(query, [id]);
  return result.rows[0] || null;
}

// обновить статус заявки
async function updateServiceRequestStatus(id, status) {
  const query = `
    UPDATE service_requests
    SET status = $2
    WHERE id = $1
    RETURNING *;
  `;

  const result = await client.query(query, [id, status]);
  return result.rows[0] || null;
}

module.exports = {
  createServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceRequestStatus,
};
