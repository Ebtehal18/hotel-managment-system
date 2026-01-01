import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";

export interface IAvailableRoom {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: string[]; // or IFacility[] if you have a facility interface
  createdBy: IRoomCreator;
  images: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface IRoomCreator {
  _id: string;
  userName: string;
}


interface IResponse {
  data: {
    rooms: IAvailableRoom[];
    totalCount: number;
  };
}

export const getDataRooms = async (page: number,size:number=8,startDate?:string,endDate?:string,capacity?:number): Promise<IResponse> => {
  const res = await axiosPrivateInstance.get<IResponse>(Admin.roomAvaliable(page, size,startDate,endDate,capacity));
  return res.data;
};

export const useGetAvailableRooms= (page: number,size=8,startDate?:string,endDate?:string,capacity?:number): UseQueryResult<IResponse> => {
  return useQuery<IResponse>({
    queryKey: [
  "availableRooms",
  page,
  size,
  startDate,
  endDate,
  capacity
],

 queryFn: () => getDataRooms(page,size,startDate,endDate,capacity),
    staleTime: 5 * 60 * 1000,
    //Old data stays while new page loads → no white flash
    placeholderData: keepPreviousData,
  });
};
