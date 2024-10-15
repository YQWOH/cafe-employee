import axios from 'axios';
import API_ENDPOINTS from '../config';

export const getEmployees = async () => {
    const response = await axios.get(API_ENDPOINTS.EMPLOYEES);
    return response.data;
};

export const deleteEmployee = async (id: string) => {
    await axios.delete(`${API_ENDPOINTS.EMPLOYEE}/${id}`);
};

export const createOrUpdateEmployee = async (employee: any): Promise<void> => {
    if (employee.id) {
        await axios.put(`${API_ENDPOINTS.EMPLOYEE}/${employee.id}`, employee);
    } else {
        await axios.post(API_ENDPOINTS.EMPLOYEE, employee);
    }
};

export const getEmployeeById = async (id: string) => {
    const response = await axios.get(`${API_ENDPOINTS.EMPLOYEE}/${id}`);
    return response.data;
}

export const getCafes = async () => {
    const response = await axios.get(API_ENDPOINTS.CAFES);
    return response.data;
};