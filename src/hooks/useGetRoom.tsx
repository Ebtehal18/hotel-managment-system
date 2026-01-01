import {
  useQuery,
  type UseQueryResult
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
 interface IFacility{
     
                        _id: string,
                        name: string
            
}
export interface ICreatedBy{
    userName:string;
    _id:string
}
export interface IRoom{

            _id: string,
                roomNumber: string,
                price: number,
                capacity: number,
                discount: number,
                facilities: IFacility[],
                images:string[],
                createdBy:ICreatedBy
            
     
}


interface IResponse {
  data:{
room: IRoom,
  }
}


export const getDataRoom = async(id:string|null): Promise<IResponse> => {
     if(!id){
            throw new Error("Facility ID is required to delete");

    }
  const res = await axiosPrivateInstance.get<IResponse>(Admin.room(id));
  return res.data;
};

export const useGetRoom = (id:string|null): UseQueryResult<IResponse> => {
  console.log(id)
  return useQuery<IResponse>({
    queryKey: ['room',id],
    queryFn: () => getDataRoom(id),
    enabled:!!id,
    staleTime: 5 * 60 * 1000,



  });
};
