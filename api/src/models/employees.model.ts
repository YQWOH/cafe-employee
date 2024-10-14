import { initializeDB } from '../db';

let pool: any; // Declare pool globally

// Initialize pool asynchronously
const getPool = async () => {
    if (!pool) {
        pool = await initializeDB();
    }
    return pool;
};

export const employeesModel = {
    // Get employees filtered by cafe (if provided) and sorted by days worked
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

        // If a cafe is specified, add a WHERE clause to filter by the cafe
        if (cafe) {
            query += ' WHERE cafes.name = ?';
            params.push(cafe);
        }

        query += ' ORDER BY days_worked DESC';

        // Execute the query and return the result
        const [rows]: any = await pool.query(query, params);
        return rows;
    },
};
