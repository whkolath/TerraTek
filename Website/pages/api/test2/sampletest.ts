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
        const { Board_ID } = req.query;
        console.log('Board_ID:', Board_ID);

        if (!Board_ID) {
            res.status(400).json({ error: 'Board_ID is required' });
            return;
        }
        
        const boardID = Board_ID.toString();

        const [results] = await db.execute<mysql.RowDataPacket[]>(
            `SELECT 
    S.Sensor_ID, 
    S.Sensor_Description, 
    S.Units,
    R.Sensor_Timestamp,
    R.Sensor_Value
FROM 
    Readings R
JOIN 
    Sensors S ON R.Sensor_ID = S.Sensor_ID
WHERE 
    R.Board_ID REGEXP ?
    AND R.Sensor_Timestamp >= DATE_SUB(NOW(), INTERVAL 5 HOUR)
ORDER BY 
    R.Sensor_Timestamp DESC;;`, [boardID]);

        console.log('Query Results:', results);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error connecting to the database or fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}