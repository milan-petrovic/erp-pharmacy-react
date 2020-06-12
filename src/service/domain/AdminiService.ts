import { AxiosResponse } from 'axios';
import { Admin } from '../../constants/types';
import { axiosInstance } from '../../api/axios';

export const getAllAdmini = (): Promise<AxiosResponse<Admin[]>> => {
    return axiosInstance.get<Admin[]>('/admini');
};

export const postAdmin = (requestData: Admin) => {
    return axiosInstance.post('/admini', requestData);
};

export const putAdmin = (requestData: Admin) => {
    return axiosInstance.put('/admini', requestData);
};

export const deleteAdmin = (adminId: number) => {
    return axiosInstance.delete(`/admini/${adminId}`);
};

export const getAdminById = (adminId: number) => {
    return axiosInstance.get(`/admini/${adminId}`);
};
