// initProviders.js
//
// Скрипт для:
// - создания таблицы providers (исполнители)
// - создания таблицы provider_services (связь исполнитель ↔ услуга)
// - добавления колонок в service_requests: provider_id, assigned_at

const client = require('./db');

async function init() {
  try {
    console.log('Создаю таблицу providers...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        phone TEXT,
        email TEXT,
        city TEXT,
        country TEXT,
        rating NUMERIC(3,2) DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Создаю таблицу provider_services...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS provider_services (
        id SERIAL PRIMARY KEY,
        provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
        service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        price_from NUMERIC(10,2),
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (provider_id, service_id)
      );
    `);

    console.log('Добавляю колонки в service_requests (если их ещё нет)...');

    await client.query(`
      ALTER TABLE service_requests
      ADD COLUMN IF NOT EXISTS provider_id INTEGER REFERENCES providers(id);
    `);

    await client.query(`
      ALTER TABLE service_requests
      ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ;
    `);

    console.log('✅ Миграция providers / provider_services успешно выполнена.');
  } catch (err) {
    console.error('❌ Ошибка миграции:', err);
  } finally {
    await client.end();
    console.log('Соединение с БД закрыто.');
  }
}

init();
