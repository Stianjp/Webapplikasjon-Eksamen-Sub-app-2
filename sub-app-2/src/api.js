import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Replace with your backend's URL

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

export const createProduct = async (product) => {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
};
