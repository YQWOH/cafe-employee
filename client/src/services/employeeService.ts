import axios from 'axios';

export const getEmployees = async () => {
    const response = await axios.get('http://localhost:8800/api/employees');  // Update the URL to match your backend
    return response.data;
};

export const deleteEmployee = async (id: string) => {
    await axios.delete(`http://localhost:8800/api/employee/${id}`);
};

export const createOrUpdateEmployee = async (employee: any): Promise<void> => {
    if (employee.id) {
        await axios.put(`http://localhost:8800/api/employee/${employee.id}`, employee);
    } else {
        await axios.post('http://localhost:8800/api/employee', employee);
    }
};

export const getEmployeeById = async (id: string) => {
    const response = await axios.get(`http://localhost:8800/api/employee/${id}`);  // Update the URL to match your backend
    return response.data;
}

export const getCafes = async () => {
    const response = await axios.get('http://localhost:8800/api/cafes');  // Update the URL to match your backend
    return response.data;
};