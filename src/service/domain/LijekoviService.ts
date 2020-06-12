import { AxiosResponse } from 'axios';
import { Lijek } from '../../constants/types';
import { axiosInstance } from '../../api/axios';

export const getAllLijekovi = (): Promise<AxiosResponse<Lijek[]>> => {
    return axiosInstance.get<Lijek[]>('/lijekovi');
};
