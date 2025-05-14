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

        const [results] = await db.execute<mysql.RowDataPacket[]>(`SELECT 
                                                                    s.Sensor_Description, 
                                                                    b.Board_Description, 
                                                                    r.Count, 
                                                                CASE 
                                                                    WHEN r.lastFive = 1 AND HasSuccess = 1 THEN 1 
                                                                    ELSE 0 
                                                                    END AS Online,
                                                                CASE 
                                                                    WHEN r.HasError = 1 THEN 1 
                                                                    ELSE 0 
                                                                    END AS Error    
                                                                FROM (
                                                                    SELECT 
                                                                    r.Sensor_ID, 
                                                                    r.Board_ID, 
                                                                    COUNT(*) AS Count, 
                                                                    MAX(CASE WHEN r.Sensor_Timestamp > NOW() - INTERVAL 5 MINUTE THEN 1 ELSE 0 END) AS lastFive,
                                                                    MAX(CASE WHEN r.Sensor_Timestamp >= NOW() - INTERVAL 12 HOUR AND r.Error_ID > 0 THEN 1 ELSE 0 END) AS HasError,
                                                                    MAX(CASE WHEN r.Sensor_Timestamp >= NOW() - INTERVAL 12 HOUR AND r.Error_ID = 0 THEN 1 ELSE 0 END) AS HasSuccess

                                                                FROM Readings r
                                                                    WHERE r.Sensor_Timestamp >= NOW() - INTERVAL 168 HOUR
                                                                    GROUP BY r.Sensor_ID, r.Board_ID
                                                                    ) r
                                                                JOIN Sensors s ON r.Sensor_ID = s.Sensor_ID
                                                                JOIN Boards b ON r.Board_ID = b.Board_ID;`);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error connecting to the database or fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}