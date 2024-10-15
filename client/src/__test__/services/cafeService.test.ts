import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getCafes, getCafeById, deleteCafe, createOrUpdateCafe } from '../../services/cafeService';
import API_ENDPOINTS from '../../config';

const mock = new MockAdapter(axios);

describe('cafeService', () => {
    afterEach(() => {
        mock.reset();
    });

    test('getCafes should fetch a list of cafes', async () => {
        const mockCafes = [
            { id: '1', name: 'Cafe A', description: 'A great cafe' },
            { id: '2', name: 'Cafe B', description: 'Another great cafe' },
        ];

        mock.onGet(API_ENDPOINTS.CAFES).reply(200, mockCafes);

        const cafes = await getCafes();
        expect(cafes).toEqual(mockCafes);
    });

    test('getCafeById should fetch a cafe by ID', async () => {
        const mockCafe = { id: '1', name: 'Cafe A', description: 'A great cafe' };

        mock.onGet(`${API_ENDPOINTS.CAFE}/1`).reply(200, mockCafe);

        const cafe = await getCafeById('1');
        expect(cafe).toEqual(mockCafe);
    });

    test('deleteCafe should send a DELETE request to remove a cafe', async () => {
        mock.onDelete(`${API_ENDPOINTS.CAFE}/1`).reply(200);

        await deleteCafe('1');

        expect(mock.history.delete[0].url).toBe(`${API_ENDPOINTS.CAFE}/1`);
    });

    test('createOrUpdateCafe should send a POST request for creating a new cafe', async () => {
        const newCafe = { name: 'New Cafe', description: 'A new cafe' };

        mock.onPost(API_ENDPOINTS.CAFE).reply(201);

        await createOrUpdateCafe(newCafe);

        expect(mock.history.post[0].url).toBe(API_ENDPOINTS.CAFE);
        expect(mock.history.post[0].data).toEqual(JSON.stringify(newCafe));
    });

    test('createOrUpdateCafe should send a PUT request for updating an existing cafe', async () => {
        const existingCafe = { id: '1', name: 'Updated Cafe', description: 'An updated cafe' };

        mock.onPut(`${API_ENDPOINTS.CAFE}/1`).reply(200);

        await createOrUpdateCafe(existingCafe);

        expect(mock.history.put[0].url).toBe(`${API_ENDPOINTS.CAFE}/1`);
        expect(mock.history.put[0].data).toEqual(JSON.stringify(existingCafe));
    });
});
