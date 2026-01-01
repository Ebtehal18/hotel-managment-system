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

export interface ICommentCreate{
   roomId:string,
    comment:string


}
export const createNewAds = async (data:ICommentCreate): Promise<IResponse> => {
  const res = await axiosPrivateInstance.post<IResponse>(
    Admin.createComment
  ,data);
  return res.data;
};

//mutation takes 3 things
//1-response
//2-error
//3-data that we have to post 

export const useCreateComment= (): UseMutationResult<IResponse,AxiosError<{message:string}>,ICommentCreate> => {
  return useMutation({
   mutationFn:createNewAds
  });
};
