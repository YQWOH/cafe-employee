jest.mock('../../db', () => ({
    initializeDB: jest.fn(() => mockPool),
}));

const mockPool = {
    query: jest.fn(),
};

import { cafeModel } from '../../models/cafe.model';

describe('cafeModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getAll should return a list of cafes', async () => {
        const mockCafes = [{ id: 1, name: 'Cafe A' }, { id: 2, name: 'Cafe B' }];
        mockPool.query.mockResolvedValue([mockCafes, []]);

        const cafes = await cafeModel.getAll();
        expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM cafes');
        expect(cafes).toEqual(mockCafes);
    });

    test('getById should return a cafe by ID', async () => {
        const mockCafe = { id: 1, name: 'Cafe A' };
        mockPool.query.mockResolvedValue([[mockCafe], []]);

        const cafe = await cafeModel.getById('1');

        expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM cafes WHERE id = ?', ['1']);
        expect(cafe).toEqual(mockCafe);
    });

    test('create should insert a new cafe and return the cafe with ID', async () => {
        const newCafe = { name: 'New Cafe', description: 'Description', location: 'Location', logo: 'logo.png' };
        const mockInsertId = 1;
        mockPool.query.mockResolvedValue([{ insertId: mockInsertId }, []]);

        const result = await cafeModel.create(newCafe);

        expect(mockPool.query).toHaveBeenCalledWith(
            'INSERT INTO cafes (name, description, location, logo) VALUES (?, ?, ?, ?)',
            [newCafe.name, newCafe.description, newCafe.location, newCafe.logo]
        );
        expect(result).toEqual({ id: mockInsertId, ...newCafe });
    });

    test('update should update the cafe and return updated cafe data', async () => {
        const updatedCafeData = { name: 'Updated Cafe', description: 'Updated Description', location: 'Updated Location', logo: 'updated-logo.png' };
        mockPool.query.mockResolvedValue([{ affectedRows: 1 }, []]);

        const result = await cafeModel.update('1', updatedCafeData);

        expect(mockPool.query).toHaveBeenCalledWith(
            'UPDATE cafes SET name = ?, description = ?, location = ?, logo = ? WHERE id = ?',
            [updatedCafeData.name, updatedCafeData.description, updatedCafeData.location, updatedCafeData.logo, '1']
        );
        expect(result).toEqual({ id: '1', ...updatedCafeData });
    });

    test('deleteEmployeesByCafe should delete employees associated with the cafe', async () => {
        mockPool.query.mockResolvedValue([[], []]);

        await cafeModel.deleteEmployeesByCafe('1');

        expect(mockPool.query).toHaveBeenCalledWith(
            'DELETE FROM employees WHERE id IN (SELECT employee_id FROM employee_cafe WHERE cafe_id = ?)',
            ['1']
        );
    });

    test('delete should delete the cafe and return true if successful', async () => {
        mockPool.query.mockResolvedValue([{ affectedRows: 1 }, []]);

        const result = await cafeModel.delete('1');

        expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM cafes WHERE id = ?', ['1']);
        expect(result).toBe(true);
    });

    test('delete should return false if no cafe is deleted', async () => {
        mockPool.query.mockResolvedValue([{ affectedRows: 0 }, []]);

        const result = await cafeModel.delete('1');

        expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM cafes WHERE id = ?', ['1']);
        expect(result).toBe(false);
    });
});
