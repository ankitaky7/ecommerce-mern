import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ecommerce-mern-kkvj.onrender.com/api'
});

export default api;