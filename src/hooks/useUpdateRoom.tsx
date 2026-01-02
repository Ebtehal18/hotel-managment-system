import {
  useMutation,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
// import type { AxiosError } from "axios";

interface IResponse {
      message: string,
}

// interface Idata{
//   isActive: boolean|string,
//     discount: number
// }
export const updateRoomData = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<IResponse> => {
  const res = await axiosPrivateInstance.put<IResponse>(Admin.updateRoom(id), formData,{
    headers: {
      'Content-Type': 'multipart/form-data',  // ← ADD THIS
    }});
  return res.data;
};

export const useUpdateRoom = (id: string | null) => {
  return useMutation({
    mutationFn: (formData: FormData) => updateRoomData({ id: id!, formData }),
  });
};
// export const updateFacility = async (data:Idata,id:string|null): Promise<IResponse> => {
// if (!id) {
//     throw new Error("Facility ID is required to update");
//   }
//    const res = await axiosPrivateInstance.put<IResponse>(
//     Admin.updateRoom(id)
//   ,data);
//   return res.data;
// };

// //mutation takes 3 things
// //1-response
// //2-error
// //3-data that we have to post 

// export const useUpdateRoom= (id:string|null): UseMutationResult<IResponse,AxiosError<{message:string}>,Idata> => {
//   return useMutation({
//    mutationFn:(data)=>updateFacility(data,id)
//   });
// };
