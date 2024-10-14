// Mock the pool and its query function
jest.mock('../../db', () => ({
    initializeDB: jest.fn(() => mockPool), // Mock the initialization of the pool
}));

const mockPool = {
    query: jest.fn(), // Mock the query function
};

import { cafesModel } from '../../models/cafes.model'; // Import after mocking

describe('cafesModel', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear any previous mock calls
    });

    test('getCafes should return a list of cafes', async () => {
        const mockCafes = [
            { id: 1, name: 'Cafe A', description: 'Great place', logo: 'logo1.png', location: 'City A', employees: 5 },
            { id: 2, name: 'Cafe B', description: 'Another great place', logo: 'logo2.png', location: 'City B', employees: 3 },
        ];
        mockPool.query.mockResolvedValue([mockCafes, []]); // Mock query result

        const cafes = await cafesModel.getCafes();

        expect(mockPool.query).toHaveBeenCalledWith(
            'SELECT cafes.id, cafes.name, cafes.description, cafes.logo, cafes.location, COUNT(employee_cafe.employee_id) AS employees FROM cafes LEFT JOIN employee_cafe ON cafes.id = employee_cafe.cafe_id GROUP BY cafes.id ORDER BY employees DESC',
            []
        );
        expect(cafes).toEqual(mockCafes);
    });

    test('getCafes should return cafes filtered by location', async () => {
        const location = 'City A';
        const mockCafes = [
            { id: 1, name: 'Cafe A', description: 'Great place', logo: 'logo1.png', location: 'City A', employees: 5 }
        ];
        mockPool.query.mockResolvedValue([mockCafes, []]); // Mock query result

        const cafes = await cafesModel.getCafes(location);

        expect(mockPool.query).toHaveBeenCalledWith(
            'SELECT cafes.id, cafes.name, cafes.description, cafes.logo, cafes.location, COUNT(employee_cafe.employee_id) AS employees FROM cafes LEFT JOIN employee_cafe ON cafes.id = employee_cafe.cafe_id WHERE cafes.location = ? GROUP BY cafes.id ORDER BY employees DESC',
            [location]
        );
        expect(cafes).toEqual(mockCafes);
    });
});

