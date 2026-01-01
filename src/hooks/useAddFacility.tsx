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

interface Idata{
  name:string
}
export const createNewFacility = async (data:Idata): Promise<IResponse> => {
  const res = await axiosPrivateInstance.post<IResponse>(
    Admin.addFacility
  ,data);
  return res.data;
};

//mutation takes 3 things
//1-response
//2-error
//3-data that we have to post 

export const useAddFacility = (): UseMutationResult<IResponse,AxiosError<{message:string}>,Idata> => {
  return useMutation({
   mutationFn:createNewFacility
  });
};
