import { AxiosResponse } from 'axios';
import { Farmaceut } from '../../constants/types';
import { axiosInstance } from '../../api/axios';

export const getAllFarmaceuti = (): Promise<AxiosResponse<Farmaceut[]>> => {
    return axiosInstance.get('/farmaceuti');
};

export const postFarmaceut = (requestData: Farmaceut): Promise<AxiosResponse<Farmaceut>> => {
    return axiosInstance.post('/farmaceuti', requestData);
};
