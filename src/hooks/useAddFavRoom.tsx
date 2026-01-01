import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
import type { AxiosError } from "axios";
import type { IRoom } from "./useGetRooms";
import toast from "react-hot-toast";
// import type { IResponseRooms } from "./useGetFav";

interface IResponse {
      message: string,
       data: {
        favoriteRoom: {
            _id: string,
          rooms: string[]}
}
}


export interface IResponseRooms {
  success: boolean;
  message: string;
  data: {
    favoriteRooms: [
      {
        _id: string;
        user: { _id: string; userName: string };
        rooms: IRoom[];
        createdAt: string;
        updatedAt: string;
      }
    ];
    totalCount: number;
  };
}

export interface Idata{
 roomId:string
}
export const createNewAds = async (data:Idata): Promise<IResponse> => {
  const res = await axiosPrivateInstance.post<IResponse>(
    Admin.addFavRoom
  ,data);
  return res.data;
};

//mutation takes 3 things
//1-response
//2-error
//3-data that we have to post 
// const queryClient=useQueryClient()
export const useAddFavRoom = (): UseMutationResult<IResponse,AxiosError<{message:string}>,Idata> => {
  const queryClient=useQueryClient()
  return useMutation({
   mutationFn:createNewAds,
  onMutate: async (newTodo) => {
    console.log(newTodo)
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: ['favRooms'] })

    // Snapshot the previous value
    const previousTodos = queryClient.getQueryData(['favRooms'])
console.log(previousTodos)
    // Optimistically update to the new value
    queryClient.setQueryData(['favRooms'], (old:IResponseRooms) =>{
    if (!old) return old;

        // Create a new copy of the favoriteRooms array
        const updatedFavoriteRooms = [...old.data.favoriteRooms]; //favrooms [{;l;l,rooms:[]}]
        console.log(updatedFavoriteRooms)
        // Add the new room (minimal object with _id is enough for isFav check)
        updatedFavoriteRooms[0] = {
          ...updatedFavoriteRooms[0],
          rooms: [
            ...updatedFavoriteRooms[0].rooms,
            { _id: newTodo.roomId } as IRoom  // This is enough for .some(_id === id)
          ]
        };

        // Return the FULL new structure
        return {
          ...old,
          data: {
            ...old.data,
            favoriteRooms: updatedFavoriteRooms
          }
        };
      });
      return { previousTodos }

    // Return a context object with the snapshotted value
  },
  onError: (err, _, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(["favRooms"], context.previousTodos);
      }
      toast.error("Failed to add favorite");
    },

    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["favRooms"] });
    },
 
  });

};
