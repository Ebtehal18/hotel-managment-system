import {
  useQuery,
  type UseQueryResult
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
export interface IComment {
  _id: string;
  room: {
    _id: string;
    roomNumber: string;
  };
  user: {
    _id: string;
    userName: string;
    profileImage: string;
  };
  comment: string;
  createdAt: string;
  updatedAt: string;
}


interface IResponse {
  data:{
roomComments: IComment[],
  }
}


export const getDataRoom = async(id:string|null): Promise<IResponse> => {
     if(!id){
            throw new Error("Facility ID is required to delete");

    }
  const res = await axiosPrivateInstance.get<IResponse>(Admin.getComments(id));
  return res.data;
};

export const useGetComments= (id:string|null): UseQueryResult<IResponse> => {
  console.log(id)
  return useQuery<IResponse>({
    queryKey: ['roomComments',id],
    queryFn: () => getDataRoom(id),
    enabled:!!id,
    staleTime: 5 * 60 * 1000,



  });
};
