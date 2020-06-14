import { AxiosResponse } from 'axios';
import { Lijek } from '../../constants/types';
import { axiosInstance } from '../../api/axios';

export const getAllLijekovi = (): Promise<AxiosResponse<Lijek[]>> => {
    return axiosInstance.get<Lijek[]>('/lijekovi');
};

export const postLijek = (requestData: Lijek) => {
    return axiosInstance.post('/lijekovi', requestData);
};

export const getLijekById = (lijekId: number) => {
    return axiosInstance.get(`/lijekovi/${lijekId}`);
};

export const deleteLijek = (lijekId: number) => {
    return axiosInstance.delete(`/lijekovi/${lijekId}`);
};

export const putLijek = (requestData: Lijek) => {
    return axiosInstance.put('/lijekovi', requestData);
};

export const pretragaLijek = (kljucPretrage: string, vrijednost: string) => {
    return axiosInstance.get(`/lijekovi/pretraga?${kljucPretrage}=${vrijednost}`);
};
