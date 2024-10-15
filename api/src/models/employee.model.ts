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

export const employeeModel = {
    generateUniqueId: async () => {
        const prefix = 'UI';
        const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let idExists = true;
        let uniqueId = '';

        while (idExists) {
            let randomPart = '';
            for (let i = 0; i < 7; i++) {
                randomPart += alphanumericChars.charAt(Math.floor(Math.random() * alphanumericChars.length));
            }
            uniqueId = prefix + randomPart;

            try {
                const pool = await getPool();
                const [rows] = await pool.query('SELECT COUNT(*) as count FROM employees WHERE id = ?', [uniqueId]);
                if (rows[0].count === 0) {
                    idExists = false;
                    logger.info(`Generated unique employee ID: ${uniqueId}`);
                }
            } catch (err) {
                logger.error('Error querying database for unique ID: ', err);
                throw err;
            }
        }

        return uniqueId;
    },

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
            }

            query += ' ORDER BY days_worked DESC';

            const [rows]: any = await pool.query(query, params);
            return rows;
        } catch (error) {
            logger.error('Error fetching employees: ', error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const pool = await getPool();
            logger.info(`Fetching employee by ID: ${id}`);
            const [rows]: any = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
            const [employeeCafe]: any = await pool.query('SELECT * FROM employee_cafe WHERE employee_id = ?', [id]);
            return { ...rows[0], cafe_id: employeeCafe[0]?.cafe_id, start_date: employeeCafe[0]?.start_date };
        } catch (error) {
            logger.error(`Error fetching employee by ID ${id}: `, error);
            throw error;
        }
    },

    create: async (employeeData: { name: string; email_address: string; phone_number: string; gender: string }) => {
        try {
            const pool = await getPool();
            const { name, email_address, phone_number, gender } = employeeData;
            const id = await employeeModel.generateUniqueId();
            logger.info(`Creating employee with ID: ${id}`);
            await pool.query(
                'INSERT INTO employees (id, name, email_address, phone_number, gender) VALUES (?, ?, ?, ?, ?)',
                [id, name, email_address, phone_number, gender]
            );
            logger.info(`Employee with ID: ${id} created successfully`);
            return { ...employeeData, id };
        } catch (error) {
            logger.error('Error creating employee: ', error);
            throw error;
        }
    },

    assignToCafe: async (employee_id: string, cafe_id: number, start_date: string) => {
        try {
            const pool = await getPool();
            const [rows]: any = await pool.query('SELECT * FROM employee_cafe WHERE employee_id = ?', [employee_id]);

            if (rows.length > 0) {
                await pool.query(
                    'UPDATE employee_cafe SET cafe_id = ?, start_date = ? WHERE employee_id = ?',
                    [cafe_id, start_date, employee_id]
                );
                logger.info(`Updated employee ${employee_id} with cafe ${cafe_id}`);
            } else {
                await pool.query(
                    'INSERT INTO employee_cafe (employee_id, cafe_id, start_date) VALUES (?, ?, ?)',
                    [employee_id, cafe_id, start_date]
                );
                logger.info(`Assigned employee ${employee_id} to cafe ${cafe_id}`);
            }
        } catch (error) {
            logger.error(`Error assigning employee ${employee_id} to cafe ${cafe_id}: `, error);
            throw error;
        }
    },

    update: async (id: string, employeeData: { name?: string; email_address?: string; phone_number?: string; gender?: string }) => {
        try {
            const pool = await getPool();
            const { name, email_address, phone_number, gender } = employeeData;
            const [result]: any = await pool.query(
                'UPDATE employees SET name = ?, email_address = ?, phone_number = ?, gender = ? WHERE id = ?',
                [name, email_address, phone_number, gender, id]
            );
            if (result.affectedRows) {
                logger.info(`Employee with ID: ${id} updated successfully`);
                return { id, ...employeeData };
            } else {
                logger.warn(`Employee with ID: ${id} not found`);
                return null;
            }
        } catch (error) {
            logger.error(`Error updating employee with ID ${id}: `, error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            const pool = await getPool();
            logger.info(`Deleting employee with ID: ${id}`);
            const [result]: any = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
            if (result.affectedRows) {
                logger.info(`Employee with ID: ${id} deleted successfully`);
                return true;
            } else {
                logger.warn(`Employee with ID: ${id} not found`);
                return false;
            }
        } catch (error) {
            logger.error(`Error deleting employee with ID ${id}: `, error);
            throw error;
        }
    },
};
