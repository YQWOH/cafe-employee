import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getEmployees, deleteEmployee, createOrUpdateEmployee, getEmployeeById, getCafes } from '../../services/employeeService';

describe('employeeService', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    test('getEmployees should return a list of employees', async () => {
        const mockData = [{ id: '1', name: 'John Doe' }];
        mock.onGet('http://localhost:8800/api/employees').reply(200, mockData);

        const employees = await getEmployees();
        expect(employees).toEqual(mockData);
    });

    test('getEmployeeById should return employee data', async () => {
        const mockData = { id: '1', name: 'John Doe' };
        const employeeId = '1';
        mock.onGet(`http://localhost:8800/api/employee/${employeeId}`).reply(200, mockData);

        const employee = await getEmployeeById(employeeId);
        expect(employee).toEqual(mockData);
    });

    test('deleteEmployee should send a DELETE request', async () => {
        const employeeId = '1';
        mock.onDelete(`http://localhost:8800/api/employee/${employeeId}`).reply(200);

        await deleteEmployee(employeeId);
        expect(mock.history.delete.length).toBe(1);
        expect(mock.history.delete[0].url).toBe(`http://localhost:8800/api/employee/${employeeId}`);
    });

    test('createOrUpdateEmployee should send a POST request if no id is provided', async () => {
        const newEmployee = { name: 'Jane Doe' };
        mock.onPost('http://localhost:8800/api/employee').reply(200);

        await createOrUpdateEmployee(newEmployee);
        expect(mock.history.post.length).toBe(1);
        expect(mock.history.post[0].url).toBe('http://localhost:8800/api/employee');
        expect(mock.history.post[0].data).toBe(JSON.stringify(newEmployee));
    });

    test('createOrUpdateEmployee should send a PUT request if id is provided', async () => {
        const existingEmployee = { id: '1', name: 'John Doe' };
        mock.onPut(`http://localhost:8800/api/employee/${existingEmployee.id}`).reply(200);

        await createOrUpdateEmployee(existingEmployee);
        expect(mock.history.put.length).toBe(1);
        expect(mock.history.put[0].url).toBe(`http://localhost:8800/api/employee/${existingEmployee.id}`);
        expect(mock.history.put[0].data).toBe(JSON.stringify(existingEmployee));
    });

    test('getCafes should return a list of cafes', async () => {
        const mockData = [{ id: '1', name: 'Cafe A' }];
        mock.onGet('http://localhost:8800/api/cafes').reply(200, mockData);

        const cafes = await getCafes();
        expect(cafes).toEqual(mockData);
    });
});
