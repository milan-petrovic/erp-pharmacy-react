import { AxiosResponse } from 'axios';
import { Recept } from '../../constants/types';
import { axiosInstance } from '../../api/axios';

export const getAllRecepti = (): Promise<AxiosResponse<Recept[]>> => {
    return axiosInstance.get<Recept[]>('/recepti');
};

export const getReceptById = (receptId: number): Promise<AxiosResponse<Recept>> => {
    return axiosInstance.get<Recept>(`/recepti/${receptId}`);
};

export const postRecept = (requestData: Recept) => {
    return axiosInstance.post('/recepti', requestData);
};

export const putRecept = (requestData: Recept) => {
    return axiosInstance.put('/recepti', requestData);
};

export const deleteReceptById = (receptId: number) => {
    return axiosInstance.delete(`/recepti/${receptId}`);
};

export const pretragaRecepti = (kljucPretrage: string, vrijednost: string) => {
    return axiosInstance.get(`/recepti/pretraga?${kljucPretrage}=${vrijednost}`);
};
