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

export const cafeModel = {
    getAll: async () => {
        try {
            const pool = await getPool();
            logger.info('Fetching all cafes');
            const [rows]: any = await pool.query('SELECT * FROM cafes');
            logger.info(`Fetched ${rows.length} cafes`);
            return rows;
        } catch (error: any) {
            logger.error(`Error fetching cafes: ${error.message}`);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const pool = await getPool();
            logger.info(`Fetching cafe with ID: ${id}`);
            const [rows]: any = await pool.query('SELECT * FROM cafes WHERE id = ?', [id]);
            if (rows.length > 0) {
                logger.info(`Cafe found with ID: ${id}`);
                return rows[0];
            } else {
                logger.warn(`Cafe with ID: ${id} not found`);
                return null;
            }
        } catch (error: any) {
            logger.error(`Error fetching cafe with ID: ${id}, ${error.message}`);
            throw error;
        }
    },

    create: async (cafeData: { name: string; description: string; location: string; logo?: string }) => {
        try {
            const pool = await getPool();
            const { name, description, location, logo } = cafeData;
            logger.info(`Creating a new cafe: ${name}`);
            const [result]: any = await pool.query(
                'INSERT INTO cafes (name, description, location, logo) VALUES (?, ?, ?, ?)',
                [name, description, location, logo || null]
            );
            logger.info(`Cafe created with ID: ${result.insertId}`);
            return { id: result.insertId, ...cafeData };
        } catch (error: any) {
            logger.error(`Error creating cafe: ${error.message}`);
            throw error;
        }
    },

    update: async (id: string, cafeData: { name?: string; description?: string; location?: string; logo?: string }) => {
        try {
            const pool = await getPool();
            const { name, description, location, logo } = cafeData;
            logger.info(`Updating cafe with ID: ${id}`);
            const [result]: any = await pool.query(
                'UPDATE cafes SET name = ?, description = ?, location = ?, logo = ? WHERE id = ?',
                [name, description, location, logo || null, id]
            );
            if (result.affectedRows) {
                logger.info(`Cafe updated with ID: ${id}`);
                return { id, ...cafeData };
            } else {
                logger.warn(`Cafe with ID: ${id} not found for update`);
                return null;
            }
        } catch (error: any) {
            logger.error(`Error updating cafe with ID: ${id}, ${error.message}`);
            throw error;
        }
    },

    deleteEmployeesByCafe: async (cafeId: string) => {
        try {
            const pool = await getPool();
            logger.info(`Deleting employees associated with cafe ID: ${cafeId}`);
            await pool.query('DELETE FROM employees WHERE id IN (SELECT employee_id FROM employee_cafe WHERE cafe_id = ?)', [cafeId]);
            logger.info(`Employees associated with cafe ID: ${cafeId} deleted`);
        } catch (error: any) {
            logger.error(`Error deleting employees for cafe ID: ${cafeId}, ${error.message}`);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            const pool = await getPool();
            logger.info(`Deleting cafe with ID: ${id}`);
            const [result]: any = await pool.query('DELETE FROM cafes WHERE id = ?', [id]);
            if (result.affectedRows > 0) {
                logger.info(`Cafe deleted with ID: ${id}`);
                return true;
            } else {
                logger.warn(`Cafe with ID: ${id} not found for deletion`);
                return false;
            }
        } catch (error: any) {
            logger.error(`Error deleting cafe with ID: ${id}, ${error.message}`);
            throw error;
        }
    },
};
