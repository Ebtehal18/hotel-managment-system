import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";

export interface IRoomAds{
     
                  _id: string,
                    roomNumber: string,
                    price: 2000,
                    capacity: 5,
                    discount: 8,
                    facilities: string[],
                    images: string[],
             
                
            
}
export interface IAds {
  _id: string;
  isActive: boolean;
  room: IRoomAds;
  createdAt:string;
    createdBy: {
                    userName: string
                },
}


interface IResponse {
  data: {
    ads: IAds[];
    totalCount: number;
  };
}

export const getDataAds = async (page: number): Promise<IResponse> => {
  const res = await axiosPrivateInstance.get<IResponse>(Admin.ads(page, 5));
  return res.data;
};

export const useGetAds = (page: number): UseQueryResult<IResponse> => {
  return useQuery<IResponse>({
    queryKey: ["ads", page],
    queryFn: () => getDataAds(page),
    staleTime: 5 * 60 * 1000,
    //Old data stays while new page loads → no white flash
    placeholderData: keepPreviousData,
  });
};
