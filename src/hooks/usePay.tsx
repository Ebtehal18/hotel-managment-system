import {
  useMutation,
  type UseMutationResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
import type { AxiosError } from "axios";

interface IResponse {
      message: string,
//       data: {
//     booking: {_id:string}
// }
}
export interface Idata{
token:string
}
export const createNewAds = async (data:Idata,bookId:string): Promise<IResponse> => {
  const res = await axiosPrivateInstance.post<IResponse>(
    Admin.payBooking(bookId)
  ,data);
  return res.data;
};

//mutation takes 3 things
//1-response
//2-error
//3-data that we have to post 

export const usePay = (bookId:string): UseMutationResult<IResponse,AxiosError<{message:string}>,Idata> => {
  return useMutation({
   mutationFn:(data)=>createNewAds(data,bookId)
  });
};
