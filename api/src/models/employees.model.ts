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

export const employeesModel = {
    getEmployees: async (cafe?: string) => {
        try {
            const pool = await getPool();

            let query = `
                SELECT employees.id, employees.name, employees.email_address, employees.phone_number, 
                       DATEDIFF(CURDATE(), employee_cafe.start_date) AS days_worked, 
                       cafes.name AS cafe
                FROM employees
                LEFT JOIN employee_cafe ON employees.id = employee_cafe.employee_id
                LEFT JOIN cafes ON cafes.id = employee_cafe.cafe_id
            `;

            const params: string[] = [];
            if (cafe) {
                query += ' WHERE cafes.name = ?';
                params.push(cafe);
                logger.info(`Fetching employees filtered by cafe: ${cafe}`);
            } else {
                logger.info('Fetching all employees');
            }

            query += ' ORDER BY days_worked DESC';

            const [rows]: any = await pool.query(query, params);
            logger.info(`Fetched ${rows.length} employees`);
            return rows;
        } catch (error) {
            logger.error('Error fetching employees: ', error);
            throw error;
        }
    },
};
