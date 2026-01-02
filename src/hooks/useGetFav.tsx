import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
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
 interface IResponseRooms {
  data: {
    favoriteRooms: [{rooms:IRoom[]}]
    
 
    totalCount: number;
  };
}

export const getDataFav = async (): Promise<IResponseRooms> => {
  const res = await axiosPrivateInstance.get<IResponseRooms>(Admin.getFavRooms);
  
  return res.data;
};

export const useGetFav= (enable?:boolean): UseQueryResult<IResponseRooms> => {
  return useQuery<IResponseRooms>({
    queryKey: ["favRooms"],
    queryFn:  getDataFav,
    enabled:enable,
    staleTime: 5 * 60 * 1000,
    //Old data stays while new page loads → no white flash
    placeholderData: keepPreviousData,
  });
};
