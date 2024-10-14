// Mock the pool and its query function
jest.mock('../../db', () => ({
    initializeDB: jest.fn(() => mockPool),
}));

const mockPool = {
    query: jest.fn(),
};

import { employeesModel } from '../../models/employees.model';

// Helper function to normalize SQL queries by removing extra spaces and line breaks
const normalizeSQL = (query: string) => query.replace(/\s+/g, ' ').trim();

describe('employeesModel', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear previous mocks before each test
    });

    test('getEmployees should return a list of employees without filtering', async () => {
        const mockEmployees = [
            { id: '1', name: 'John Doe', email_address: 'john@example.com', phone_number: '12345678', days_worked: 10, cafe: 'Cafe A' },
            { id: '2', name: 'Jane Smith', email_address: 'jane@example.com', phone_number: '87654321', days_worked: 5, cafe: 'Cafe B' },
        ];

        mockPool.query.mockResolvedValue([mockEmployees, []]); // Mock query result

        const employees = await employeesModel.getEmployees();

        const expectedQuery = `SELECT employees.id, employees.name, employees.email_address, employees.phone_number, 
            DATEDIFF(CURDATE(), employee_cafe.start_date) AS days_worked, 
            cafes.name AS cafe
            FROM employees
            LEFT JOIN employee_cafe ON employees.id = employee_cafe.employee_id
            LEFT JOIN cafes ON cafes.id = employee_cafe.cafe_id
            ORDER BY days_worked DESC`;

        expect(normalizeSQL(mockPool.query.mock.calls[0][0])).toEqual(normalizeSQL(expectedQuery)); // Normalize both the expected and actual SQL
        expect(employees).toEqual(mockEmployees);
    });

    test('getEmployees should return employees filtered by cafe', async () => {
        const mockEmployees = [
            { id: '1', name: 'John Doe', email_address: 'john@example.com', phone_number: '12345678', days_worked: 10, cafe: 'Cafe A' }
        ];

        mockPool.query.mockResolvedValue([mockEmployees, []]); // Mock query result

        const employees = await employeesModel.getEmployees('Cafe A');

        const expectedQuery = `SELECT employees.id, employees.name, employees.email_address, employees.phone_number, 
            DATEDIFF(CURDATE(), employee_cafe.start_date) AS days_worked, 
            cafes.name AS cafe
            FROM employees
            LEFT JOIN employee_cafe ON employees.id = employee_cafe.employee_id
            LEFT JOIN cafes ON cafes.id = employee_cafe.cafe_id
            WHERE cafes.name = ? 
            ORDER BY days_worked DESC`;

        expect(normalizeSQL(mockPool.query.mock.calls[0][0])).toEqual(normalizeSQL(expectedQuery)); // Normalize both the expected and actual SQL
        expect(employees).toEqual(mockEmployees);
    });
});
