jest.mock('../../db', () => ({
    initializeDB: jest.fn(() => mockPool),
}));

const mockPool = {
    query: jest.fn(),
};

import { employeeModel } from '../../models/employee.model';

describe('employeeModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('generateUniqueId should return a unique ID', async () => {
        mockPool.query.mockResolvedValueOnce([[{ count: 0 }], []]);

        const uniqueId = await employeeModel.generateUniqueId();

        expect(mockPool.query).toHaveBeenCalledWith('SELECT COUNT(*) as count FROM employees WHERE id = ?', [expect.any(String)]);
        expect(uniqueId).toMatch(/^UI[A-Za-z0-9]{7}$/);
    });

    test('getEmployees should return employees filtered by cafe', async () => {
        const mockEmployees = [
            { id: '1', name: 'John', email_address: 'john@example.com', phone_number: '12345678', days_worked: 100, cafe: 'Cafe A' }
        ];
        mockPool.query.mockResolvedValue([mockEmployees, []]);

        const employees = await employeeModel.getEmployees('Cafe A');

        expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), ['Cafe A']);
        expect(employees).toEqual(mockEmployees);
    });

    test('getById should return an employee by ID', async () => {
        const mockEmployee = { id: '1', name: 'John' };
        const mockEmployeeCafe = { cafe_id: 1, start_date: '2023-01-01' };
        mockPool.query.mockResolvedValueOnce([[mockEmployee], []]);
        mockPool.query.mockResolvedValueOnce([[mockEmployeeCafe], []]);

        const employee = await employeeModel.getById('1');

        expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM employees WHERE id = ?', ['1']);
        expect(employee).toEqual({ ...mockEmployee, cafe_id: mockEmployeeCafe.cafe_id, start_date: mockEmployeeCafe.start_date });
    });

    test('create should insert a new employee and return the employee with ID', async () => {
        const newEmployee = { name: 'Jane', email_address: 'jane@example.com', phone_number: '98765432', gender: 'Female' };
        const mockId = 'UI1234567';
        jest.spyOn(employeeModel, 'generateUniqueId').mockResolvedValue(mockId);
        mockPool.query.mockResolvedValue([{}, []]);

        const result = await employeeModel.create(newEmployee);

        expect(mockPool.query).toHaveBeenCalledWith(
            'INSERT INTO employees (id, name, email_address, phone_number, gender) VALUES (?, ?, ?, ?, ?)',
            [mockId, newEmployee.name, newEmployee.email_address, newEmployee.phone_number, newEmployee.gender]
        );
        expect(result).toEqual({ ...newEmployee, id: mockId });
    });

    test('assignToCafe should assign or update an employee to a cafe', async () => {
        const mockRows = [{ employee_id: '1' }];
        mockPool.query.mockResolvedValueOnce([mockRows, []]);

        await employeeModel.assignToCafe('1', 1, '2023-01-01');

        expect(mockPool.query).toHaveBeenCalledWith('UPDATE employee_cafe SET cafe_id = ?, start_date = ? WHERE employee_id = ?', [1, '2023-01-01', '1']);
    });

    test('delete should remove an employee by ID', async () => {
        mockPool.query.mockResolvedValue([{ affectedRows: 1 }, []]);

        const result = await employeeModel.delete('1');

        expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM employees WHERE id = ?', ['1']);
        expect(result).toBe(true);
    });
});
