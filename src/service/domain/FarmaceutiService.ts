import { AxiosResponse } from 'axios';
import { Farmaceut } from '../../constants/types';
import { axiosInstance } from '../../api/axios';

export const getAllFarmaceuti = (): Promise<AxiosResponse<Farmaceut[]>> => {
    return axiosInstance.get('/farmaceuti');
};

export const postFarmaceut = (requestData: Farmaceut): Promise<AxiosResponse<Farmaceut>> => {
    return axiosInstance.post('/farmaceuti', requestData);
};

export const getFarmaceutById = (farmaceutId: number) => {
    return axiosInstance.get(`/farmaceuti/${farmaceutId}`);
};

export const deleteFarmaceutById = (farmaceutId: number) => {
    return axiosInstance.delete(`/farmaceuti/${farmaceutId}`);
};

export const putFarmaceut = (requestData: Farmaceut) => {
    return axiosInstance.put('/farmaceuti', requestData);
};
