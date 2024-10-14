import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getCafes, getCafeById, deleteCafe, createOrUpdateCafe } from '../../services/cafeService';

// Create a mock instance of axios
const mock = new MockAdapter(axios);

describe('cafeService', () => {
    afterEach(() => {
        mock.reset(); // Reset the mock after each test
    });

    test('getCafes should fetch a list of cafes', async () => {
        const mockCafes = [
            { id: '1', name: 'Cafe A', description: 'A great cafe' },
            { id: '2', name: 'Cafe B', description: 'Another great cafe' },
        ];

        // Mock the GET request for fetching cafes
        mock.onGet('http://localhost:8800/api/cafes').reply(200, mockCafes);

        const cafes = await getCafes();
        expect(cafes).toEqual(mockCafes); // Expect the returned data to match the mock data
    });

    test('getCafeById should fetch a cafe by ID', async () => {
        const mockCafe = { id: '1', name: 'Cafe A', description: 'A great cafe' };

        // Mock the GET request for fetching a cafe by ID
        mock.onGet('http://localhost:8800/api/cafe/1').reply(200, mockCafe);

        const cafe = await getCafeById('1');
        expect(cafe).toEqual(mockCafe); // Expect the returned data to match the mock data
    });

    test('deleteCafe should send a DELETE request to remove a cafe', async () => {
        // Mock the DELETE request
        mock.onDelete('http://localhost:8800/api/cafe/1').reply(200);

        await deleteCafe('1');

        // Verify that the DELETE request was made with the correct URL
        expect(mock.history.delete[0].url).toBe('http://localhost:8800/api/cafe/1');
    });

    test('createOrUpdateCafe should send a POST request for creating a new cafe', async () => {
        const newCafe = { name: 'New Cafe', description: 'A new cafe' };

        // Mock the POST request for creating a new cafe
        mock.onPost('http://localhost:8800/api/cafe').reply(201);

        await createOrUpdateCafe(newCafe);

        // Verify that the POST request was made with the correct URL and data
        expect(mock.history.post[0].url).toBe('http://localhost:8800/api/cafe');
        expect(mock.history.post[0].data).toEqual(JSON.stringify(newCafe));
    });

    test('createOrUpdateCafe should send a PUT request for updating an existing cafe', async () => {
        const existingCafe = { id: '1', name: 'Updated Cafe', description: 'An updated cafe' };

        // Mock the PUT request for updating an existing cafe
        mock.onPut('http://localhost:8800/api/cafe/1').reply(200);

        await createOrUpdateCafe(existingCafe);

        // Verify that the PUT request was made with the correct URL and data
        expect(mock.history.put[0].url).toBe('http://localhost:8800/api/cafe/1');
        expect(mock.history.put[0].data).toEqual(JSON.stringify(existingCafe));
    });
});
