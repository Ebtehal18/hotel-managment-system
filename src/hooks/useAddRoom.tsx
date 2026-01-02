

export interface IRoomCreate{
  imgs: File[];
  facilities: string[];
  discount: string;
  price: string;
  roomNumber: string;
  capacity: string;

}

import {
  useMutation,
  type UseMutationResult,
} from "@tanstack/react-query";
import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
import type { AxiosError } from "axios";

interface IResponse {
  success: boolean;
  message: string;
  // data?: any;
}

// We no longer use IRoomCreate as input — we use FormData for file upload
export const createNewRoom = async (formData: FormData): Promise<IResponse> => {
  console.log(formData)
  const res = await axiosPrivateInstance.post<IResponse>(Admin.addRoom, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',  // ← ADD THIS
    }});
  return res.data;
};

export const useAddRoom = (): UseMutationResult<
  IResponse,
  AxiosError<{ message: string }>,
  FormData  // ← Changed from IRoomCreate to FormData
> => {
  return useMutation({
    mutationFn: createNewRoom,
  });
};