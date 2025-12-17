const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'servicedb',
  password: 'Gwagjaw4924529',
  port: 5432,
});

async function seed() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // --- Категории ---
    await client.query(`
      INSERT INTO categories (id, name, description, active) VALUES
        (1, 'Строительство и ремонт', 'Ремонт, отделочные и сантехнические работы', TRUE),
        (2, 'Уборка и клининг', 'Уборка квартир, домов и офисов', TRUE),
        (3, 'IT и цифровые услуги', 'Сайты, лендинги и другие цифровые сервисы', TRUE)
      ON CONFLICT (id) DO NOTHING;
    `);

    // --- Подкатегории ---
    // ID подкатегорий подогнаны под существующие услуги:
    // 1, 2, 3, 4 — уже используются в таблице services
    await client.query(`
      INSERT INTO subcategories (id, category_id, name, description, active) VALUES
        (1, 1, 'Ремонт ванных и санузлов', 'Плитка, сантехника, комплексный ремонт санузла', TRUE),
        (2, 1, 'Отделочные работы', 'Покраска стен и потолков, подготовка поверхностей', TRUE),
        (3, 2, 'Уборка квартир', 'Генеральная и глубокая уборка квартир', TRUE),
        (4, 3, 'Разработка сайтов', 'Лендинги и простые сайты для бизнеса', TRUE)
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('Categories and subcategories seeded successfully');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await client.end();
  }
}

seed();
