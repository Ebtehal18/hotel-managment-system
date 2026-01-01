import {
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
export interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: string[];
  createdBy: string; // ✅ userId ONLY
  images: string[];
  createdAt: string;
  updatedAt: string;
}


interface IResponse {
  data: {
    room: Room;
  };
}

export const getDataBooking = async (id:string): Promise<IResponse> => {
  const res = await axiosPrivateInstance.get<IResponse>(Admin.roomDetails(id));
  return res.data;
};

export const useGetRoomDetails= (id:string): UseQueryResult<IResponse> => {
  return useQuery<IResponse>({
    queryKey: ["roomDetails",id],
    queryFn: () => getDataBooking(id),
    enabled:!!id,
    staleTime: 5 * 60 * 1000,
    //Old data stays while new page loads → no white flash
    // placeholderData: keepPreviousData,
  });
};
