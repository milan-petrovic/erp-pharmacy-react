import { AxiosResponse } from "axios";
import { Pacijent } from "../../constants/types";
import { axiosInstance } from "../../api/axios";

export const getAllPacijenti = (): Promise<AxiosResponse<Pacijent[]>> => {
    return axiosInstance.get<Pacijent[]>('/pacijenti');
};

export const postPacijent = (requestData: Pacijent) => {
    return axiosInstance.post('/pacijenti', requestData);
};

export const getPacijentById = (pacijentId: number) => {
  return axiosInstance.get(`/pacijenti/${pacijentId}`);
};

export const putPacijent = (requestData: Pacijent) => {
  return axiosInstance.put('/pacijenti', requestData);
};

export const deletePacijent = (pacijentId: number) => {
  return axiosInstance.delete(`pacijenti/${pacijentId}`);
};