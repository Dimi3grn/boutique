const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Read sneakers data from data.json
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json'), 'utf8'));
const sneakers = data.sneakers;

async function importData() {
  // Create connection with your database
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tempora_sneakers' // Use your existing database name
  });

  try {
    console.log('Connected to the database');
    console.log(`Preparing to import ${sneakers.length} sneakers...`);
    
    // Clear existing data if needed (optional)
    await connection.query('TRUNCATE TABLE sneakers');
    console.log('Table cleared, ready for fresh data');
    
    // Insert data from JSON file
    for (const sneaker of sneakers) {
      await connection.query(
        `INSERT INTO sneakers 
        (id, name, price, release_date, colors, delivery_time, delivery_price, 
        reduction, img_1, img_2, img_3, available, sizes) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sneaker.id,
          sneaker.name,
          sneaker.price,
          sneaker.release_date,
          sneaker.colors,
          sneaker.delivery_time,
          sneaker.delivery_price,
          sneaker.reduction,
          sneaker.img_1,
          sneaker.img_2,
          sneaker.img_3,
          sneaker.available ? 1 : 0,
          sneaker.sizes
        ]
      );
      console.log(`Imported sneaker: ${sneaker.name}`);
    }
    
    console.log(`Successfully imported ${sneakers.length} sneakers into the database`);
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

// Run the import
importData();