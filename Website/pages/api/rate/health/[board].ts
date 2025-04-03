import mysql from 'mysql2/promise';
import type { NextApiRequest, NextApiResponse } from 'next';

const db: mysql.Pool = mysql.createPool({
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
        const board_id = req.query.board;
        const [results] = await db.execute<mysql.RowDataPacket[]>(`SELECT
            MAX(r.Sensor_Timestamp) AS LastTimestamp,
            SUM(CASE WHEN r.Sensor_Timestamp >= NOW() - INTERVAL 1 HOUR THEN 1 ELSE 0 END) AS Number_Reading,
            MAX(CASE WHEN r.Sensor_Timestamp > NOW() - INTERVAL 5 MINUTE THEN 1 ELSE 0 END) AS Online
            
        FROM
            Readings r
        WHERE
            r.Board_ID = ?
    `, [board_id]);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error connecting to the database or fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}