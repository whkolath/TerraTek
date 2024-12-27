import mysql from 'mysql2/promise';
import type { NextApiRequest, NextApiResponse } from 'next';

let db: mysql.Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // 10 seconds
});
    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 10000, // 10 seconds
    });


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    try {
        const sensor_id = req.query.sensor;
        const [results] = await db.execute<mysql.RowDataPacket[]>('SELECT r.* FROM Readings r JOIN Sensors s ON r.Sensor_ID = s.Sensor_ID WHERE r.Sensor_ID = ? ORDER BY r.Sensor_Timestamp DESC LIMIT 36', [sensor_id]);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error connecting to the database or fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}