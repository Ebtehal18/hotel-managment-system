import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Admin } from "../services/api/apiConfig";
import type { AxiosError } from "axios";
// import type { IRoom } from "./useGetRooms";
import toast from "react-hot-toast";
import type { IResponseRooms } from "./useAddFavRoom";

interface IResponse {
      message: string,
}


export const deleteNewFacility = async (id:string|null): Promise<IResponse> => {
    if(!id){
            throw new Error("Facility ID is required to delete");

    }
  const res = await axiosPrivateInstance.delete<IResponse>(
    Admin.removeFavRoom(id),{
       data: {
        'roomId':id}
    });
  return res.data;
};

//mutation takes 3 things
//1-response
//2-error
//3-data that we have to post 

export const useDeleteFavRoom = (): UseMutationResult<  IResponse,
  AxiosError<{ message: string }>,
  string,
  { previousData: IResponseRooms | undefined }> => {
  const queryClient=useQueryClient()


  return useMutation({
   mutationFn:(id:string)=>deleteNewFacility(id),


 onMutate: async (roomId) => {
      // Cancel any outgoing ref    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)etches
  await queryClient.cancelQueries({ queryKey: ["favRooms"] });
    // Snapshot the previous value

  const previousData = queryClient.getQueryData<IResponseRooms>(["favRooms"]);

  queryClient.setQueryData<IResponseRooms>(["favRooms"], (old) => {
 if (!old) {
      return old;
    }
    // Make a deep copy and update only the rooms array
    //copy
    const updatedFavoriteRooms = [...old.data.favoriteRooms];
    //distruct what inside the copy
    updatedFavoriteRooms[0] = {
      ...updatedFavoriteRooms[0],
      rooms: updatedFavoriteRooms[0].rooms.filter((room) => room._id !== roomId) 
    };

    // Return the FULL structure
    return {
      ...old,
      data: {
              ...old.data,

        favoriteRooms: updatedFavoriteRooms as [typeof old.data.favoriteRooms[0]]
      }
    };
// return {
//   ...old,                          // ← Copy level 1: the whole response object
//   data: {
//     ...old.data,                   // ← Copy level 2: the data object inside
//     favoriteRooms: [
//       {
//         ...old.data.favoriteRooms[0],  // ← Copy level 3: the single favorite document
//         rooms: old.data.favoriteRooms[0].rooms.filter(
//           (room) => room._id !== roomId
//         ),                             // ← Copy level 4: the rooms array (filter creates new array)
//       },
//     ],
//   },
// };
  });

  return { previousData }; // for rollback on error
},

    onError: (_err, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["favRooms"], context.previousData);
      }
      toast.error( "Failed to remove favorite");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favRooms"] });
    },
  });
};
// {
//     "success": true,
//     "message": "success",
//     "data": {
//         "favoriteRooms": [
//             {
//                 "_id": "694c1067ea9c441346499dfb",
//                 "rooms": [],
//                 "user": {
//                     "_id": "694c0fb5ea9c441346499db0",
//                     "userName": "ebtehal"
//                 },
//                 "createdAt": "2025-12-24T16:10:15.167Z",
//                 "updatedAt": "2025-12-25T12:05:20.198Z"
//             }
//         ],
//         "totalCount": 1
//     }
//   }


// const oldArray = [
//   { id: 1, name: "Room 101", price: 100 }
// ];

// // Make a copy and add something
// const newArray = [...oldArray, { id: 2, name: "Room 202" }];

// console.log(oldArray); // Still [{ id: 1, ... }] → unchanged!
// console.log(newArray); // [{ id: 1, ... }, { id: 2, ... }] → new array with 2 items