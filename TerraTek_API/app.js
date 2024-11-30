require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use the PORT from .env or default to 3000

// Use CORS to allow cross-origin requests
app.use(cors());

// Create a connection to the MySQL database using the environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Define a route to serve the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Define a route to fetch data from Boards table
app.get('/boards-data', (req, res) => {
  const query = 'SELECT * FROM Boards'; // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Define a route to fetch data from Sensors table
app.get('/sensors-data', (req, res) => {
    const query = 'SELECT * FROM Sensors'; // Replace with your table name
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Error fetching data');
      } else {
        res.json(results);
      }
    });
  });

  // Define a route to fetch data from Readings table
app.get('/readings-data', (req, res) => {
    const query = 'SELECT * FROM Readings'; // Replace with your table name
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Error fetching data');
      } else {
        res.json(results);
      }
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
