import { AxiosResponse } from 'axios';
import { NacinPlacanja } from '../../constants/types';
import { axiosInstance } from '../../api/axios';

export const getAllNaciniPlacanja = (): Promise<AxiosResponse<NacinPlacanja[]>> => {
    return axiosInstance.get<NacinPlacanja[]>('/naciniPlacanja');
};

export const deleteNaciniPlacanja = (nacinPlacanjaId: number) => {
    return axiosInstance.delete(`/naciniPlacanja/${nacinPlacanjaId}`);
};

export const postNacinPlacanja = (requestData: NacinPlacanja) => {
    return axiosInstance.post('/naciniPlacanja', requestData);
};

export const putNacinPlacanja = (requestData: NacinPlacanja) => {
    return axiosInstance.put('/naciniPlacanja', requestData);
};

export const getNacinPlacanjaById = (nacinPlacanjaId: number) => {
    return axiosInstance.get(`/naciniPlacanja/${nacinPlacanjaId}`);
};
