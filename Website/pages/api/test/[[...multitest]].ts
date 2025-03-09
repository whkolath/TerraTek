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

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { timeframe, sensor, board, start, end, calc, timeinterval } = req.query;

        // Validate that at least one of sensor or board is provided
        if (!sensor && !board) {
            return res.status(400).json({ error: 'Either sensor ID or board ID must be provided.' });
        }

        // Validate sensor ID (if provided)
        const sensorId = sensor ? parseInt(sensor as string) : null;
        if (sensor && isNaN(sensorId!)) {
            return res.status(400).json({ error: 'Invalid sensor ID. Must be a number.' });
        }

        // Validate board ID (if provided)
        const boardId = board as string;
        if (board && typeof boardId !== 'string') {
            return res.status(400).json({ error: 'Invalid board ID. Must be a string.' });
        }

        // Validate calculation method
        const allowedCalculations = ['AVG', 'MIN', 'MAX', 'SUM', 'MEDIAN'];
        const calculationMethod = allowedCalculations.includes(calc as string) ? calc as string : 'AVG';

        // Validate time interval (default: hourly)
        const allowedIntervals = ['halfhour', 'hourly', 'daily'];
        const interval = allowedIntervals.includes(timeinterval as string) ? timeinterval as string : 'hourly';

        // Validate and parse timeframe (default: last 24 hours)
        const range = parseInt(timeframe as string) || 24;

        // Validate and parse start and end timestamps
        let startTime, endTime;
        if (start && end) {
            // Append time to start and end dates if only the date portion is provided
            const startDateStr = start as string;
            const endDateStr = end as string;

            startTime = new Date(startDateStr.includes('T') ? startDateStr : `${startDateStr}T00:00:00`);
            endTime = new Date(endDateStr.includes('T') ? endDateStr : `${endDateStr}T23:59:59`);

            if (isNaN(startTime.getTime())) {
                return res.status(400).json({ error: 'Invalid start time format.' });
            }
            if (isNaN(endTime.getTime())) {
                return res.status(400).json({ error: 'Invalid end time format.' });
            }
        } else {
            // Use default timeframe if no start/end is provided
            endTime = new Date();
            startTime = new Date();
            startTime.setHours(endTime.getHours() - range);
        }

        // Format timestamps for MySQL
        const startTimeFormatted = startTime.toISOString().slice(0, 19).replace('T', ' ');
        const endTimeFormatted = endTime.toISOString().slice(0, 19).replace('T', ' ');

        // Determine the DATE_FORMAT based on the selected interval
        let dateFormat: string;
        switch (interval) {
            case 'halfhour':
                dateFormat = '%Y-%m-%d %H:%i:00'; // Group by half-hour
                break;
            case 'hourly':
                dateFormat = '%Y-%m-%d %H:00:00'; // Group by hour
                break;
            case 'daily':
                dateFormat = '%Y-%m-%d 00:00:00'; // Group by day
                break;
            default:
                dateFormat = '%Y-%m-%d %H:00:00'; // Default to hourly
        }

        // Construct SQL query based on provided parameters
        let sqlQuery: string;
        const queryParams: (string | number)[] = [];

        // Base WHERE clause
        let whereClause = 'WHERE r.Sensor_Timestamp BETWEEN ? AND ?';
        queryParams.push(startTimeFormatted, endTimeFormatted);

        // Add sensor ID condition (if provided)
        if (sensorId) {
            whereClause += ' AND r.Sensor_ID = ?';
            queryParams.push(sensorId);
        }

        // Add board ID condition (if provided)
        if (boardId) {
            whereClause += ' AND r.Board_ID = ?';
            queryParams.push(boardId);
        }

        // Construct the final query
        if (calculationMethod === 'MEDIAN') {
            sqlQuery = `
                SELECT 
                    DATE_FORMAT(r.Sensor_Timestamp, '${dateFormat}') AS Interval_Timestamp,
                    SUBSTRING_INDEX(SUBSTRING_INDEX(GROUP_CONCAT(r.Sensor_Value ORDER BY r.Sensor_Value), ',', CEIL(COUNT(*) / 2)), ',', -1) AS Calculated_Reading,
                    r.Sensor_ID,
                    r.Board_ID
                FROM Readings r
                ${whereClause}
                GROUP BY Interval_Timestamp, r.Sensor_ID, r.Board_ID
                ORDER BY Interval_Timestamp DESC;
            `;
        } else {
            sqlQuery = `
                SELECT 
                    DATE_FORMAT(r.Sensor_Timestamp, '${dateFormat}') AS Interval_Timestamp,
                    ${calculationMethod}(r.Sensor_Value) AS Calculated_Reading,
                    r.Sensor_ID,
                    r.Board_ID
                FROM Readings r
                ${whereClause}
                GROUP BY Interval_Timestamp, r.Sensor_ID, r.Board_ID
                ORDER BY Interval_Timestamp DESC;
            `;
        }

        // Execute the query
        const [results] = await db.execute<mysql.RowDataPacket[]>(sqlQuery, queryParams);

        // Return the results
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}