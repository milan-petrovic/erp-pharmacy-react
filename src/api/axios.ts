import axios from 'axios';
import { BaseRoutes } from '../constants/routes/AppRoutes';

export const axiosInstance = axios.create({
    baseURL: BaseRoutes.ApiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    responseType: 'json',
});
