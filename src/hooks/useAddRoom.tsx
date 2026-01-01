import {
  useMutation,
  type UseMutationResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
import type { AxiosError } from "axios";

interface IResponse {
      message: string,
}

export interface IRoomCreate{
  imgs: File[];
  facilities: string[];
  discount: string;
  price: string;
  roomNumber: string;
  capacity: string;


}
export const createNewAds = async (data:IRoomCreate): Promise<IResponse> => {
  const res = await axiosPrivateInstance.post<IResponse>(
    Admin.addRoom
  ,data);
  return res.data;
};

//mutation takes 3 things
//1-response
//2-error
//3-data that we have to post 

export const useAddRoom = (): UseMutationResult<IResponse,AxiosError<{message:string}>,IRoomCreate> => {
  return useMutation({
   mutationFn:createNewAds
  });
};
