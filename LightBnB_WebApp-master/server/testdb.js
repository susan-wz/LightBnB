const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'vagrant',
  password: '123',
  database: 'lightbnb'
})

const getUserWithEmail = function (email) {
  pool.query(`SELECT * FROM users
  WHERE users.email = $1`, [email])
  .then(res => res.rows)
  // .then(console.log)
};

getUserWithEmail('alainajames@gmail.com')