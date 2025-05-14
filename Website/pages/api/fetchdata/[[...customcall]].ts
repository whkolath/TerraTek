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

// Conversion functions
const convertToImperial = (value: number, units: string): number | null => {
    switch (units) {
        case '°C': return (value * 9 / 5) + 32; // Celsius to Fahrenheit
        case 'mm': return value * 0.0393701;   // Millimeters to inches
        case 'kPa': return value * 0.2953;     // Kilopascals to inHg
        case 'kph': return value * 0.621371;    // Kilometers per hour to Miles per hour
        case '°': return (value + 180) % 360;    // invert direction
        default: return value;                // No conversion needed
    }
};

const convertDefault = (value: number, units: string): number => {
    switch (units) {
        case '°': return (value + 180) % 360;    // invert direction
        default: return value;                   // No conversion needed
    }
};

// Cache for sensor units
const unitCache: { [key: number]: string } = {};

async function getSensorUnits(sensorId: number): Promise<string> {
    if (unitCache[sensorId]) return unitCache[sensorId];
    const [unitsResult] = await db.execute<mysql.RowDataPacket[]>(
        'SELECT Units FROM Sensors WHERE Sensor_ID = ?;',
        [sensorId]
    );
    const units = unitsResult[0]?.Units || '';
    unitCache[sensorId] = units;
    return units;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const { timeframe, sensor, board, start, end, calc, timeinterval, unit_conversion } = req.query;

        // Validate sensor ID
        const sensorId = parseInt(sensor as string);
        if (isNaN(sensorId)) {
            return res.status(400).json({ error: 'Invalid sensor ID. Must be a number.' });
        }

        // Validate board ID
        const boardId = board as string;
        if (!boardId || typeof boardId !== 'string') {
            return res.status(400).json({ error: 'Invalid board ID. Must be a string.' });
        }

        // Validate calculation method
        const allowedCalculations = ['AVG', 'MIN', 'MAX', 'SUM', 'MEDIAN'];
        const calculationMethod = allowedCalculations.includes(calc as string) ? calc as string : 'AVG';

        // Validate time interval (default: hourly)
        const allowedIntervals = ['All', 'Hourly', 'Daily'];
        const interval = allowedIntervals.includes(timeinterval as string) ? timeinterval as string : 'Hourly';

        // Validate unit conversion (default: 0/imperial)
        const useImperial = unit_conversion;

        // Validate and parse timeframe (default: last 24 hours)
        const range = parseInt(timeframe as string) || 24;

        // Validate and parse start and end timestamps
        let startTime, endTime;
        if (start && end) {
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
            endTime = new Date();
            startTime = new Date();
            startTime.setHours(endTime.getHours() - range);
        }

        // Format timestamps for MySQL
        const startTimeFormatted = startTime.toISOString().slice(0, 19).replace('T', ' ');
        const endTimeFormatted = endTime.toISOString().slice(0, 19).replace('T', ' ');

        // First query to get sensor units
        const units = await getSensorUnits(sensorId);
        if (!units) {
            return res.status(404).json({ error: 'Sensor units not found.' });
        }

        // Main query to get readings
        let sqlQuery: string;
        if (interval === 'All') {
            sqlQuery = `
                SELECT 
                    r.Sensor_Timestamp AS Interval_Timestamp,
                    r.Sensor_Value AS Calculated_Reading
                FROM Readings r
                WHERE r.Sensor_ID = ?
                  AND r.Board_ID = ?
                  AND r.Sensor_Timestamp BETWEEN ? AND ?
                  AND r.Error_ID = 0;
            `;
        } else if (calculationMethod === 'MEDIAN') {
            if (interval === 'Hourly') {
                sqlQuery = `
                    SELECT 
                        r.Hourly_Timestamp AS Interval_Timestamp,
                        SUBSTRING_INDEX(SUBSTRING_INDEX(GROUP_CONCAT(r.Sensor_Value ORDER BY r.Sensor_Value), ',', CEIL(COUNT(*) / 2)), ',', -1) AS Calculated_Reading
                    FROM Readings r
                    WHERE r.Sensor_ID = ?
                      AND r.Board_ID = ?
                      AND r.Sensor_Timestamp BETWEEN ? AND ?
                      AND r.Error_ID = 0
                    GROUP BY r.Hourly_Timestamp;
                `;
            } else { // Daily
                sqlQuery = `
                    SELECT 
                        r.Daily_Timestamp AS Interval_Timestamp,
                        SUBSTRING_INDEX(SUBSTRING_INDEX(GROUP_CONCAT(r.Sensor_Value ORDER BY r.Sensor_Value), ',', CEIL(COUNT(*) / 2)), ',', -1) AS Calculated_Reading
                    FROM Readings r
                    WHERE r.Sensor_ID = ?
                      AND r.Board_ID = ?
                      AND r.Sensor_Timestamp BETWEEN ? AND ?
                      AND r.Error_ID = 0
                    GROUP BY r.Daily_Timestamp;
                `;
            }
        } else {
            if (interval === 'Hourly') {
                sqlQuery = `
                    SELECT 
                        r.Hourly_Timestamp AS Interval_Timestamp,
                        ${calculationMethod}(r.Sensor_Value) AS Calculated_Reading
                    FROM Readings r
                    WHERE r.Sensor_ID = ?
                      AND r.Board_ID = ?
                      AND r.Sensor_Timestamp BETWEEN ? AND ?
                      AND r.Error_ID = 0
                    GROUP BY r.Hourly_Timestamp;
                `;
            } else { // Daily
                sqlQuery = `
                    SELECT 
                        r.Daily_Timestamp AS Interval_Timestamp,
                        ${calculationMethod}(r.Sensor_Value) AS Calculated_Reading
                    FROM Readings r
                    WHERE r.Sensor_ID = ?
                      AND r.Board_ID = ?
                      AND r.Sensor_Timestamp BETWEEN ? AND ?
                      AND r.Error_ID = 0
                    GROUP BY r.Daily_Timestamp;
                `;
            }
        }

        // Execute the query
        const [results] = await db.execute<mysql.RowDataPacket[]>(sqlQuery, [sensorId, boardId, startTimeFormatted, endTimeFormatted]);

        const convertedResults = results.map(row => {
            const calculatedReading = row.Calculated_Reading ?? 0;
            let convertedValue = calculatedReading;

            if (useImperial !== '0') {
                convertedValue = convertToImperial(calculatedReading, units);
            } else {
                convertedValue = convertDefault(calculatedReading, units);
            }

            if (sensorId == 10) {
                if (boardId == "0xa8610a3436268316") {
                    convertedValue = ((145 - (calculatedReading - 40)) / 145 * 100);
                } else {
                    convertedValue = ((145 - (calculatedReading - 60)) / 145 * 100);
                }
            }

            return {
                ...row,
                Calculated_Reading: convertedValue,
                Units: useImperial !== '0' ? getImperialUnit(units) : units
            };
        });

        // Return the results
        res.status(200).json(convertedResults);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Helper functions for unit labels
function getImperialUnit(metricUnit: string): string {
    switch (metricUnit) {
        case '°C': return '°F';
        case 'kPa': return 'inHg';
        case 'kph': return 'mph';
        case 'mm': return 'in';
        default: return metricUnit;
    }
}