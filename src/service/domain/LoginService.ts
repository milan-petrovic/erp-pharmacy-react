import { axiosInstance } from '../../api/axios';
import { Admin, Farmaceut, LoginModel } from '../../constants/types';
import { AxiosResponse } from 'axios';

export const farmaceutLogin = (requestData: LoginModel): Promise<AxiosResponse<Farmaceut>> => {
    return axiosInstance.post('/farmaceuti/login', requestData);
};

export const adminLogin = (requestData: LoginModel): Promise<AxiosResponse<Admin>> => {
    return axiosInstance.post('/admini/login', requestData);
};
