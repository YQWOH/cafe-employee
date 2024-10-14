import { initializeDB } from '../db';

let pool: any; // Declare pool globally

// Initialize pool asynchronously
const getPool = async () => {
    if (!pool) {
        pool = await initializeDB();
    }
    return pool;
};

export const cafesModel = {
    // Get all cafes
    getCafes: async (location?: string) => {
        const pool = await getPool();
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

        // Wait for the pool to initialize and execute the query
        const [rows]: any = await pool.query(query, params);

        return rows;
    },
};