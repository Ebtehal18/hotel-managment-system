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

export interface CreatedByUser {
  _id: string;
  userName: string;
}

export interface RoomMostPopular {
  _id: string;
  isActive: boolean;
  room: Room;
  createdBy: CreatedByUser; // ✅ populated user object
  createdAt: string;
  updatedAt: string;
}
interface IResponse {
  data: {
    ads: RoomMostPopular[];
    totalCount: number;
  };
}

export const getDataBooking = async (): Promise<IResponse> => {
  const res = await axiosPrivateInstance.get<IResponse>(Admin.mostPopular);
  return res.data;
};

export const useGetMostPopularAds= (): UseQueryResult<IResponse> => {
  return useQuery<IResponse>({
    queryKey: ["mostPopularAds"],
    queryFn: () => getDataBooking(),
    staleTime: 5 * 60 * 1000,
    //Old data stays while new page loads → no white flash
    // placeholderData: keepPreviousData,
  });
};
