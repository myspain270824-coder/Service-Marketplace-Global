const { Client } = require('pg');
const services = require('../servicesData'); // твой массив услуг

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Gwagjaw4924529',
  database: 'servicedb'
});

async function seed() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    for (const s of services) {
      await client.query(
        `INSERT INTO services (subcategory_id, name, description, contact, base_price, active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [s.subcategory_id, s.name, s.description, s.contact, s.base_price, s.active]
      );
    }

    console.log("Services seeded successfully");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await client.end();  // ← обязательное закрытие подключения !!!
  }
}

seed();
