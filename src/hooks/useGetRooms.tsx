import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
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
rooms: IRoom[],
totalCount:number,
  }
}


export const getDataRooms = async(page:number,size:number=5): Promise<IResponse> => {
  const res = await axiosPrivateInstance.get<IResponse>(Admin.rooms(page,size));
  return res.data;
};

export const useGetRooms = (page:number,size?:number,options?: Partial<UseQueryOptions<IResponse>>): UseQueryResult<IResponse> => {
  return useQuery<IResponse>({
    queryKey: ['rooms',page,size],
    queryFn: () => getDataRooms(page,size),
    staleTime: 5 * 60 * 1000,
//Old data stays while new page loads → no white flash
placeholderData: keepPreviousData,
...options


  });
};
