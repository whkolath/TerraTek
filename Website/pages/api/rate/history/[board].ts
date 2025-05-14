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

        const board_ID = req.query.board;
        const [results] = await db.execute<mysql.RowDataPacket[]>(`SELECT 
            d.TIMESTAMP AS Hourly_Timestamp, 
            COALESCE(r.Number_Reading, 0) AS Number_Reading
        FROM Dates d
        LEFT JOIN (
            SELECT 
                COUNT(r.Sensor_Value) AS Number_Reading,
                r.Hourly_Timestamp
            FROM Readings r
            WHERE r.Sensor_Timestamp BETWEEN (NOW() - INTERVAL 720 HOUR) AND NOW()
              AND r.Board_ID = ?
            GROUP BY r.Hourly_Timestamp
        ) r ON d.TIMESTAMP = r.Hourly_Timestamp
        WHERE d.TIMESTAMP BETWEEN (NOW() - INTERVAL 720 HOUR) AND NOW();`,
            [board_ID]);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error connecting to the database or fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}