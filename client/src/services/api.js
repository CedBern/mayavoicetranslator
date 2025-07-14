import axios from 'axios';
import { AdminApi, Configuration, CorrectionsApi, TasksApi } from '../api';

const BASE_PATH = 'http://localhost:3000/v1';

let token = localStorage.getItem('token');

const configuration = new Configuration({
    basePath: BASE_PATH,
    accessToken: token,
});

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export const setToken = (newToken) => {
    token = newToken;
    if (newToken) {
        localStorage.setItem('token', newToken);
    } else {
        localStorage.removeItem('token');
    }
    // Update the configuration for subsequent API calls
    configuration.accessToken = newToken;
};


export const tasksApi = new TasksApi(configuration, BASE_PATH, axiosInstance);
export const correctionsApi = new CorrectionsApi(configuration, BASE_PATH, axiosInstance);
export const adminApi = new AdminApi(configuration, BASE_PATH, axiosInstance);
