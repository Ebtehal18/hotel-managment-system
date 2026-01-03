import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";

export interface IFacility {
  _id: string;
  name: string;
  createdAt: string;
   createdBy: {
                    // "_id": "6800c854662a988e021f3f3d",
                    userName: string
                },
                updatedAt:string
}

interface IResponse {
  data: {
    facilities: IFacility[];
    totalCount: number;
  };
}

export const getDataFacilities = async (page: number,size:number=5): Promise<IResponse> => {
  const res = await axiosPrivateInstance.get<IResponse>(
    Admin.facilities(page, size)
  );
  return res.data;
};

export const useGetFacilities = (page: number,size=5,options?: Partial<UseQueryOptions<IResponse>>): UseQueryResult<IResponse> => {
  return useQuery<IResponse>({
    queryKey: ["facilities", page,size],
    queryFn: () => getDataFacilities(page,size),
    staleTime: 5 * 60 * 1000,
    ...options,
    //Old data stays while new page loads → no white flash
    placeholderData: keepPreviousData,
  });
};
