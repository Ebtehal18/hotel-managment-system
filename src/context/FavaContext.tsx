import { createContext, useContext,  type ReactNode } from "react";
import { useGetFav, type IRoom } from "../hooks/useGetFav";
import { useAddFavRoom } from "../hooks/useAddFavRoom";
import { useDeleteFavRoom } from "../hooks/useRemoveFav";
import toast from "react-hot-toast";
import { UseAuth } from "./AuthContext";
// import { useQueryClient } from "@tanstack/react-query";

interface IFav{
favRooms:IRoom[],
toggleFav:(id:string)=>void,
isFav:(id:string)=>boolean
totalFav:number
}
const FavContext=createContext<null|IFav>(null)

export const FavProvider=({children}:{children:ReactNode})=>{
  const { isAuthenticated, isUser } = UseAuth();

  // Only enable the query if user is authenticated
  const enabled = !!isAuthenticated && !!isUser;
const {data}=useGetFav(enabled)
console.log(data?.data)
const {mutate:Add}=useAddFavRoom()
const {mutate:deleteFvRoom}=useDeleteFavRoom()
// const [isFav,setIsFav]=useState(false)

const favRooms=data?.data?.favoriteRooms[0]?.rooms??[]
const totalFav=data?.data.favoriteRooms[0]?.rooms.length??0
const isFav=(id:string)=>favRooms.some((room: IRoom) => room._id === id)

console.log(favRooms)
const toggleFav = (id: string) => {
    const isFav = favRooms.some((room: IRoom) => room._id === id);
    // setIsFav(isFav)

console.log(isFav,favRooms)
    if (isFav) {
      deleteFvRoom(id,{
         onSuccess:(res)=>{
          toast.success(res.message)
              // queryClient.invalidateQueries({queryKey:['favRooms']})


        }
      });
    } else {
      Add({
        roomId:id
      },{
        onSuccess:(res)=>{
          toast.success(res.message)
              // queryClient.invalidateQueries({queryKey:['favRooms']})


        }
        ,
        
      });
    }
  };
    return <FavContext.Provider value={{favRooms,toggleFav,isFav,totalFav}}>
{children}
    </FavContext.Provider>
}
export const UseFavorite=()=>{
    const context=useContext(FavContext)
    if(!context){
        throw new Error("err")
    }
    return context
}