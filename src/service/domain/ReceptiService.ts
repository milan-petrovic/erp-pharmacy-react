import { AxiosResponse } from 'axios';
import { Recept } from '../../constants/types';
import { axiosInstance } from '../../api/axios';

export const getAllRecepti = (): Promise<AxiosResponse<Recept[]>> => {
    return axiosInstance.get<Recept[]>('/recepti');
};
