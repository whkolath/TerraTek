import mysql from 'mysql2/promise';
import type { NextApiRequest, NextApiResponse } from 'next';

// Create a MySQL connection pool
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
        const { timeframe, sensor } = req.query;

        // Ensure timeframe is correctly extracted and defaults to 24 if missing
        const range = parseInt(timeframe as string) || 24;
        console.log('Timeframe:', timeframe, 'Range:', range);

        // Validate sensor input
        const sensorId = parseInt(sensor as string);
        if (isNaN(sensorId) || sensorId < 1 || sensorId > 10) {
            return res.status(400).json({ error: 'Invalid sensor ID. Must be between 1 and 10.' });
        }
        console.log('Sensor ID:', sensorId);

        const [results] = await db.execute<mysql.RowDataPacket[]>(`
            SELECT 
                d.TIMESTAMP AS Hourly_Timestamp, 
                r.Average_Reading
            FROM Dates d
            LEFT JOIN (
                SELECT 
                    AVG(r.Sensor_Value) AS Average_Reading,
                    DATE_FORMAT(r.Sensor_Timestamp, '%Y-%m-%d %H:00:00') AS Hourly_Timestamp
                FROM Readings r
                WHERE r.Sensor_ID = ?
                AND r.Sensor_Timestamp BETWEEN (NOW() - INTERVAL ? HOUR) AND NOW()
                GROUP BY Hourly_Timestamp
            ) r ON d.TIMESTAMP = r.Hourly_Timestamp
            WHERE d.TIMESTAMP BETWEEN (NOW() - INTERVAL ? HOUR) AND NOW()
            ORDER BY d.TIMESTAMP DESC;
        `, [sensorId, range, range]);

        console.log('Query Results:', results);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error connecting to the database or fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}