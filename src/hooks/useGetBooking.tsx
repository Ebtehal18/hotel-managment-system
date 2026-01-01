import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
export interface IRoomBooking{

                    _id: string,
                    roomNumber: string
         
}
export interface IBooking {

                _id: string,
                startDate: string,
                endDate: string,
            totalPrice: number,
                user: {
                    _id: string,
                    userName: string
                },
                room: IRoomBooking,
                status: "completed"|"pending",
                createdAt: string,
                updatedAt: string,
                stripeChargeId: string
     
}

interface IResponse {
  data: {
    booking: IBooking[];
    totalCount: number;
  };
}

export const getDataBooking = async (page: number): Promise<IResponse> => {
  const res = await axiosPrivateInstance.get<IResponse>(Admin.booking(page, 5));
  return res.data;
};

export const useGetBooking= (page: number): UseQueryResult<IResponse> => {
  return useQuery<IResponse>({
    queryKey: ["booking", page],
    queryFn: () => getDataBooking(page),
    staleTime: 5 * 60 * 1000,
    //Old data stays while new page loads → no white flash
    placeholderData: keepPreviousData,
  });
};
