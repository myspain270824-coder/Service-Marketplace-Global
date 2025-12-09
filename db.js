const { Client } = require('pg');

const client = new Client({
  user: 'postgres',          // пользователь PostgreSQL
  host: 'localhost',         // база на этом же компьютере
  database: 'servicedb',     // имя базы
  password: 'Gwagjaw4924529', // твой пароль от PostgreSQL
  port: 5432,                // стандартный порт
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = client;

