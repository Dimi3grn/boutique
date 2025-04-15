const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // replace with your MySQL username if different
  password: '',  // replace with your MySQL password if you have one
  database: 'roberto'  // your database name
});

module.exports = pool;