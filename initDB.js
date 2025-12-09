const { Client } = require('pg');

// ⚠️ ОБЯЗАТЕЛЬНО: впиши свой реальный пароль от PostgreSQL
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Gwagjaw4924529',
  database: 'servicedb',
});

async function init() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // 1. Таблица категорий
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT TRUE
      );
    `);

    // 2. Таблица подкатегорий
    await client.query(`
      CREATE TABLE IF NOT EXISTS subcategories (
        id SERIAL PRIMARY KEY,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT TRUE
      );
    `);

    // 3. Таблица услуг
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        description TEXT,
        contact TEXT,
        base_price NUMERIC,
        active BOOLEAN DEFAULT TRUE
      );
    `);

    // 4. Таблица заявок клиентов
    await client.query(`
      CREATE TABLE IF NOT EXISTS service_requests (
        id SERIAL PRIMARY KEY,
        service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        customer_name TEXT,
        customer_contact TEXT,
        city TEXT,
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        status TEXT DEFAULT 'new'
      );
    `);

    console.log('All tables ensured (categories, subcategories, services, service_requests)');
  } catch (err) {
    console.error('Init error:', err);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

init();
