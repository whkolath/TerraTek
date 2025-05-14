import mysql from 'mysql2/promise';

import type { NextApiRequest, NextApiResponse } from 'next';

// type responseItemType = {
//     id: string;
//     name: string;
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 10000, // 10 seconds
    });

    try {

        const [results] = await db.execute<mysql.RowDataPacket[]>('SELECT r.* FROM Readings r JOIN Sensors s ON r.Sensor_ID = s.Sensor_ID WHERE r.Sensor_ID = 2');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error connecting to the database or fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



// // Create a connection pool
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   connectTimeout: 10000, // 10 seconds
//   acquireTimeout: 10000, // 10 seconds
// });

// // Route to fetch data from Readings table
// app.get('/readings-data', (req, res, next) => {
//   const query = 'SELECT * FROM Readings';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching readings data:', err);
//       return next(err);
//     }
//     res.json(results);
//   });
// });
