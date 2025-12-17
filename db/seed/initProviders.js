// initProviders.js
// Чистая версия: создаёт таблицы providers и provider_services, добавляет тестовых провайдеров

const client = require('..');

async function initProviders() {
  try {
    console.log('=== ИНИЦИАЛИЗАЦИЯ ПРОВАЙДЕРОВ ===');

    // Безопасно удаляем старые таблицы (если они есть)
    console.log('Удаляем старые таблицы (если существуют)...');
    await client.query(`
      DROP TABLE IF EXISTS provider_services CASCADE;
      DROP TABLE IF EXISTS providers CASCADE;
    `);

    // Создаём таблицу провайдеров
    console.log('Создаём таблицу providers...');
    await client.query(`
      CREATE TABLE providers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        city TEXT,
        contact TEXT,
        rating NUMERIC(2,1) DEFAULT 4.5,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        active BOOLEAN DEFAULT TRUE
      );
    `);

    // Создаём таблицу связей провайдер ↔ услуга
    console.log('Создаём таблицу provider_services...');
    await client.query(`
      CREATE TABLE provider_services (
        id SERIAL PRIMARY KEY,
        provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
        service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        price NUMERIC(10,2),
        is_primary BOOLEAN DEFAULT FALSE,
        UNIQUE(provider_id, service_id)
      );
    `);

    console.log('Таблицы созданы.');

    // Добавляем тестовых провайдеров
    console.log('Добавляем тестовых провайдеров...');
    const providersResult = await client.query(`
      INSERT INTO providers (name, description, city, contact, rating)
      VALUES
        ('Мастер Иван', 'Плитка, сантехника, полный ремонт ванных', 'Alicante', '+34600111222', 4.9),
        ('Клининг Профи', 'Генеральная и глубокая уборка', 'Torrevieja', '+34600333444', 4.7),
        ('WebDev Studio', 'Создание сайтов и лендингов', 'Alicante', '+34600555666', 4.8)
      RETURNING id;
    `);

    const [ivan, cleaning, web] = providersResult.rows;

    // Привязываем провайдеров к существующим услугам
    // id 1-3 — плитка/ремонт ванных (у тебя их много)
    // id 4 — глубокая уборка квартиры
    // id 5-6 — разработка сайта
    console.log('Привязываем услуги к провайдерам...');
    await client.query(`
      INSERT INTO provider_services (provider_id, service_id, price, is_primary)
      VALUES
        (${ivan.id}, 1, 450.00, true),
        (${ivan.id}, 2, 380.00, true),
        (${ivan.id}, 10, 420.00, true),
        (${cleaning.id}, 4, 120.00, true),
        (${cleaning.id}, 7, 140.00, true),
        (${web.id}, 5, 350.00, true),
        (${web.id}, 6, 320.00, true);
    `);

    console.log('Провайдеры и их услуги успешно добавлены!');
    console.log(`Добавлено провайдеров: ${providersResult.rowCount}`);
  } catch (err) {
    console.error('Ошибка инициализации провайдеров:', err);
  } finally {
    await client.end();
    console.log('Соединение с БД закрыто.');
  }
}

// Запуск
initProviders();