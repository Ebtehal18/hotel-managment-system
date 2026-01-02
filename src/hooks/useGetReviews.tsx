import {
  useQuery,
  type UseQueryResult
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
export interface IRoomRef {
  _id: string;
  roomNumber: string;
}

export interface IUserRef {
  _id: string;
  userName: string;
  profileImage: string;
}

export interface IReview {
  _id: string;
  room: IRoomRef;
  user: IUserRef;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}


interface IResponse {
  data:{
roomReviews: IReview[],
  }
}


export const getDataRoom = async(id:string|null): Promise<IResponse> => {
     if(!id){
            throw new Error("Facility ID is required to delete");

    }
  const res = await axiosPrivateInstance.get<IResponse>(Admin.getReviews(id));
  return res.data;
};

export const useGetReviews= (id:string|null,enable:boolean): UseQueryResult<IResponse> => {
  console.log(id)
  return useQuery<IResponse>({
    queryKey: ['roomReviews',id],
    queryFn: () => getDataRoom(id),
    enabled:!!id&&enable,
    staleTime: 5 * 60 * 1000,



  });
};
