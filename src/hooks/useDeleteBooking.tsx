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


export const deleteNewFacility = async (id:string|null): Promise<IResponse> => {
    if(!id){
            throw new Error("Facility ID is required to delete");

    }
  const res = await axiosPrivateInstance.delete<IResponse>(
    Admin.deleteBooking(id));
  return res.data;
};

//mutation takes 3 things
//1-response
//2-error
//3-data that we have to post 

export const useDeleteBooking = (id:string|null): UseMutationResult<IResponse,AxiosError<{message:string}>> => {
  return useMutation({
   mutationFn:()=>deleteNewFacility(id)
  });
};
