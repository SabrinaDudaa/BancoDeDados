const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'GrupoBD',
  password: 'serverBD2025', // Adicione a senha correta do seu banco
  database: 'sistemaong',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
