import axios from 'axios';
import API_ENDPOINTS from '../config';

export const getCafes = async () => {
    const response = await axios.get(API_ENDPOINTS.CAFES);
    return response.data;
};

export const getCafeById = async (id: string) => {
    const response = await axios.get(`${API_ENDPOINTS.CAFE}/${id}`);
    return response.data;
};


export const deleteCafe = async (id: string) => {
    await axios.delete(`${API_ENDPOINTS.CAFE}/${id}`);
};

export const createOrUpdateCafe = async (cafe: any): Promise<void> => {
    if (cafe.id) {
        await axios.put(`${API_ENDPOINTS.CAFE}/${cafe.id}`, cafe);
    } else {
        await axios.post(API_ENDPOINTS.CAFE, cafe);
    }
};
