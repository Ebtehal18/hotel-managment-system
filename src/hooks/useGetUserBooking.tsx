import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";

export interface Booking {
  _id: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  totalPrice: number;
  user: {
    _id: string;
  };
  room: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}


interface IResponse {
  data: {
    myBooking: Booking[];
    totalCount: number;
  };
}

export const getDataMyBooking = async (page: number): Promise<IResponse> => {
  const res = await axiosPrivateInstance.get<IResponse>(Admin.getBooking(page,5));
  return res.data;
};

export const useGetMyBooking = (page: number): UseQueryResult<IResponse> => {
  return useQuery<IResponse>({
    queryKey: ["myBooking", page],
    queryFn: () => getDataMyBooking(page),
    staleTime: 5 * 60 * 1000,
    //Old data stays while new page loads → no white flash
    placeholderData: keepPreviousData,
  });
};
