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
        const Board_ID = req.query.boardfetch;
        console.log('Board_ID:', Board_ID);

        const [results] = await db.execute<mysql.RowDataPacket[]>(
            `SELECT 
                r.Board_ID
            FROM
                Boards r
            WHERE 
                Board_ID REGEXP ?;`, [Board_ID]);

        console.log('Query Results:', results);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error connecting to the database or fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}