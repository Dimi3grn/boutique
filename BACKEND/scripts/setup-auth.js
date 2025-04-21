const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupAuthTables() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',  // replace with your MySQL username if different
      password: '',  // replace with your MySQL password if you have one
      database: 'roberto'  // your database name
    });

    console.log('Connected to MySQL database');

    // Read SQL file
    const sqlFilePath = path.join(__dirname, '../sql/users.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split SQL statements
    const statements = sqlContent.split(';').filter(statement => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      await connection.execute(statement);
      console.log('Executed SQL statement successfully');
    }

    console.log('Authentication tables set up successfully');
    await connection.end();
    
  } catch (error) {
    console.error('Error setting up authentication tables:', error);
    process.exit(1);
  }
}

// Run the setup
setupAuthTables();