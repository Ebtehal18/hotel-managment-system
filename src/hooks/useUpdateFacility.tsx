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
export const updateFacility = async (data:Idata,id:string|null): Promise<IResponse> => {
if (!id) {
    throw new Error("Facility ID is required to update");
  }
   const res = await axiosPrivateInstance.put<IResponse>(
    Admin.updateFacility(id)
  ,data);
  return res.data;
};

//mutation takes 3 things
//1-response
//2-error
//3-data that we have to post 

export const useUpdateFacility = (id:string|null): UseMutationResult<IResponse,AxiosError<{message:string}>,Idata> => {
  return useMutation({
   mutationFn:(data)=>updateFacility(data,id)
  });
};
