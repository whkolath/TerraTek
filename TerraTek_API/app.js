require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
});
app.use(limiter);

// Validate environment variables
['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'].forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
  acquireTimeout: 10000, // 10 seconds
});

// Define a route to serve the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Route to fetch data from Boards table
app.get('/boards-data', (req, res, next) => {
  const query = 'SELECT * FROM Boards';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching boards data:', err);
      return next(err); // Forward to global error handler
    }
    res.json(results);
  });
});

// Route to fetch data from Sensors table
app.get('/sensors-data', (req, res, next) => {
  const query = 'SELECT * FROM Sensors';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sensors data:', err);
      return next(err);
    }
    res.json(results);
  });
});

// Route to fetch data from Readings table
app.get('/readings-data', (req, res, next) => {
  const query = 'SELECT * FROM Readings';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching readings data:', err);
      return next(err);
    }
    res.json(results);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('An internal server error occurred');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
