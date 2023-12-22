import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api';

export const fetchData = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});