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

        const board = req.query.board as string;
        if (!board) {
            res.status(400).json({ error: 'Board parameter is required' });
            return;
        }
        const [results] = await db.execute<mysql.RowDataPacket[]>(`SELECT 
                                                                        COUNT(r.Sensor_Value) AS Number_Reading
                                                                    FROM
                                                                        Readings r
                                                                    WHERE
                                                                        r.Board_ID = ?
                                                                        AND r.Sensor_Timestamp >= CAST(DATE_FORMAT(NOW() - INTERVAL 1 HOUR, '%Y-%m-%d %H:00:00') AS DATETIME)
                                                                        AND r.Sensor_Timestamp < CAST(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00:00') AS DATETIME);`, [board]);
        console.log(board);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error connecting to the database or fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}