import { AxiosResponse } from 'axios';
import { Kategorija } from '../../constants/types';
import { axiosInstance } from '../../api/axios';

export const getKategorijaById = (kategorijaId: number): Promise<AxiosResponse<Kategorija>> => {
    return axiosInstance.get<Kategorija>(`/kategorije/${kategorijaId}`);
};

export const getAllKategorije = (): Promise<AxiosResponse<Kategorija[]>> => {
    return axiosInstance.get<Kategorija[]>('/kategorije');
};

export const postKategorija = (requestData: Kategorija) => {
    return axiosInstance.post('/kategorije', requestData);
};

export const deleteKategorija = (kategorijaId: number) => {
    return axiosInstance.delete(`/kategorije/${kategorijaId}`);
};

export const putKategorija = (requestData: Kategorija) => {
    return axiosInstance.put('/kategorije', requestData);
};
