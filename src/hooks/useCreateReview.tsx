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

export interface IReviewCreate{
   roomId: string;
  rating: number | null;
  review: string | null;


}
export const createNewAds = async (data:IReviewCreate): Promise<IResponse> => {
  const res = await axiosPrivateInstance.post<IResponse>(
    Admin.createReview
  ,data);
  return res.data;
};

//mutation takes 3 things
//1-response
//2-error
//3-data that we have to post 

export const useCreateReview= (): UseMutationResult<IResponse,AxiosError<{message:string}>,IReviewCreate> => {
  return useMutation({
   mutationFn:createNewAds
  });
};
