import { initializeDB } from '../db';
import logger from '../utils/logger';

let pool: any;

const getPool = async () => {
    if (!pool) {
        logger.info('Initializing database connection pool');
        pool = await initializeDB();
    }
    return pool;
};

export const cafesModel = {
    getCafes: async (location?: string) => {
        try {
            const pool = await getPool();
            logger.info(`Fetching cafes. Filter by location: ${location || 'none'}`);
            let query = `
                SELECT cafes.id, cafes.name, cafes.description, cafes.logo, cafes.location, COUNT(employee_cafe.employee_id) AS employees
                FROM cafes
                LEFT JOIN employee_cafe ON cafes.id = employee_cafe.cafe_id
            `;

            const params: string[] = [];

            if (location) {
                query += ' WHERE cafes.location = ?';
                params.push(location);
            }

            query += ' GROUP BY cafes.id ORDER BY employees DESC';

            query = query.replace(/\s+/g, ' ').trim();

            const [rows]: any = await pool.query(query, params);
            logger.info(`Fetched ${rows.length} cafes`);
            return rows;
        } catch (error: any) {
            logger.error(`Error fetching cafes: ${error.message}`);
            throw error;
        }
    },
};