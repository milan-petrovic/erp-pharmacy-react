import axios from 'axios';
import { BaseRoutes } from '../constants/routes/AppRoutes';

export const axiosInstance = axios.create({
    baseURL: BaseRoutes.ApiUrl,
    responseType: 'json',
});
