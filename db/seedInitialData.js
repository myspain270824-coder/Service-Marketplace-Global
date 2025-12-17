const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Gwagjaw4924529', // замени на свой пароль от PostgreSQL
  database: 'servicedb'
});

async function seed() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // Добавляем категории
    await client.query(`
      INSERT INTO categories (name, description)
      VALUES
      ('Ремонт и строительство', 'Услуги ремонта квартир, домов и отделочные работы'),
      ('Уборка и клининг', 'Профессиональная уборка домов, квартир и офисов'),
      ('IT и разработка', 'Создание сайтов, программ и IT-поддержка');
    `);

    // Добавляем подкатегории
    await client.query(`
      INSERT INTO subcategories (category_id, name, description)
      VALUES
      (1, 'Ремонт ванных комнат', 'Комплексный ремонт санузлов под ключ'),
      (1, 'Покраска и отделка', 'Малярные работы, отделка и шпаклевка'),
      (2, 'Генеральная уборка', 'Полная уборка квартир, домов и офисов'),
      (3, 'Создание сайтов', 'Разработка сайтов, лендингов и интернет-магазинов');
    `);

    console.log("Initial data inserted successfully");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await client.end();
  }
}

seed();
