import { Prodaja, Racun } from '../../constants/types';
import { axiosInstance } from '../../api/axios';
import { AxiosResponse } from 'axios';

export const postRacun = (requestData: Racun) => {
    return axiosInstance.post('/racuni', requestData);
};

export const getLastRacun = () => {
    return axiosInstance.get('/racuni/poslednji');
};

export const postProdaja = (requestData: Prodaja) => {
    return axiosInstance.post('/prodaje', requestData);
};

export const getAllRacuni = (): Promise<AxiosResponse<Racun[]>> => {
    return axiosInstance.get('/racuni');
};

export const getProdaje = (racunId: number) => {
    return axiosInstance.get(`/prodaje/${racunId}`);
};
