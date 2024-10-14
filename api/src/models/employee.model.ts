import { initializeDB } from '../db';

let pool: any; // Declare pool globally

// Initialize pool asynchronously
const getPool = async () => {
    if (!pool) {
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
                }
            } catch (err) {
                console.error('Error querying database: ', err);
                throw err; // Rethrow the error so we can catch it elsewhere
            }
        }

        return uniqueId;
    },

    // Get employees filtered by cafe and sorted by days worked
    getEmployees: async (cafe?: string) => {
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
    },

    // Get employee by ID
    getById: async (id: string) => {
        const pool = await getPool();
        const [rows]: any = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
        const [employeeCafe]: any = await pool.query('SELECT * FROM employee_cafe WHERE employee_id = ?', [id]);
        return { ...rows[0], cafe_id: employeeCafe[0].cafe_id, start_date: employeeCafe[0].start_date };
    },

    // Create a new employee
    create: async (employeeData: { name: string; email_address: string; phone_number: string; gender: string }) => {
        const pool = await getPool();
        const { name, email_address, phone_number, gender } = employeeData;

        try {
            const id = await employeeModel.generateUniqueId();

            // Insert employee data without capturing the result
            await pool.query(
                'INSERT INTO employees (id, name, email_address, phone_number, gender) VALUES (?, ?, ?, ?, ?)',
                [id, name, email_address, phone_number, gender]
            );

            // Return the inserted employee data
            return { ...employeeData, id };
        } catch (error) {
            console.error('Error in create method: ', error);
            throw error;
        }
    },

    // Assign an employee to a cafe
    assignToCafe: async (employee_id: string, cafe_id: number, start_date: string) => {
        const pool = await getPool();
        const [rows]: any = await pool.query('SELECT * FROM employee_cafe WHERE employee_id = ?', [employee_id]);

        if (rows.length > 0) {
            await pool.query(
                'UPDATE employee_cafe SET cafe_id = ?, start_date = ? WHERE employee_id = ?',
                [cafe_id, start_date, employee_id]
            );
        } else {
            await pool.query(
                'INSERT INTO employee_cafe (employee_id, cafe_id, start_date) VALUES (?, ?, ?)',
                [employee_id, cafe_id, start_date]
            );
        }
    },

    // Update an employee
    update: async (id: string, employeeData: { name?: string; email_address?: string; phone_number?: string; gender?: string }) => {
        const pool = await getPool();
        const { name, email_address, phone_number, gender } = employeeData;
        const [result]: any = await pool.query(
            'UPDATE employees SET name = ?, email_address = ?, phone_number = ?, gender = ? WHERE id = ?',
            [name, email_address, phone_number, gender, id]
        );
        return result.affectedRows ? { id, ...employeeData } : null;
    },

    // Delete an employee by ID
    delete: async (id: string) => {
        const pool = await getPool();
        const [result]: any = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
        return result.affectedRows ? true : false;
    },
};
