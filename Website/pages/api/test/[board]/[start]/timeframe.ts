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

        const range = req.query.start;
        const sensor_id = req.query.board; 
        const [results] = await db.execute<mysql.RowDataPacket[]>(`SELECT 
                                                                        d.TIMESTAMP AS Hourly_Timestamp, r.Average_Reading
                                                                    FROM
                                                                        Dates d
                                                                            LEFT JOIN
                                                                        (SELECT 
                                                                            AVG(r.Sensor_Value) AS Average_Reading,
                                                                                DATE_FORMAT(r.Sensor_Timestamp, '%Y-%m-%d %H:00:00') AS Hourly_Timestamp
                                                                        FROM
                                                                            Readings r
                                                                        WHERE
                                                                            r.Board_ID = ?
                                                                            AND r.Sensor_Timestamp BETWEEN (NOW() - INTERVAL ? HOUR) AND NOW()
                                                                        GROUP BY Hourly_Timestamp) r ON d.TIMESTAMP = r.Hourly_Timestamp
                                                                    WHERE
                                                                        d.TIMESTAMP BETWEEN (NOW() - INTERVAL ? HOUR) AND NOW()
                                                                    ORDER BY d.TIMESTAMP DESC;`, [sensor_id, range, range]);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error connecting to the database or fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}