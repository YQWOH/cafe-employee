import axios from 'axios';

export const getCafes = async () => {
    const response = await axios.get('http://localhost:8800/api/cafes');  // Update the URL to match your backend
    return response.data;
};

export const getCafeById = async (id: string) => {
    const response = await axios.get(`http://localhost:8800/api/cafe/${id}`);
    return response.data;
};


export const deleteCafe = async (id: string) => {
    await axios.delete(`http://localhost:8800/api/cafe/${id}`);
};

export const createOrUpdateCafe = async (cafe: any): Promise<void> => {
    if (cafe.id) {
        await axios.put(`http://localhost:8800/api/cafe/${cafe.id}`, cafe);
    } else {
        await axios.post('http://localhost:8800/api/cafe', cafe);
    }
};
