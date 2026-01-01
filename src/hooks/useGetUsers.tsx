import {
  keepPreviousData,
  useQuery,
  type UseQueryResult
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
export interface IUser{

                _id:string,
                userName: string,
                email: string,
                phoneNumber: number,
                country: string,
                role: string,
                profileImage:string,
            
     
}
interface IResponse {
  data:{
users: IUser[],
totalCount:number
  }
}
export const getDataUsers = async(page:number): Promise<IResponse> => {
  const res = await axiosPrivateInstance.get<IResponse>(Admin.users(page,5));
  return res.data;
};

export const useGetUsers = (page:number): UseQueryResult<IResponse> => {
  return useQuery<IResponse>({
    queryKey: ['users',page],
    queryFn: () => getDataUsers(page),
    staleTime: 5 * 60 * 1000,
//Old data stays while new page loads → no white flash
placeholderData: keepPreviousData

  });
};
