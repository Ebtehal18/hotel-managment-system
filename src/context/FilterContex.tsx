import type { Dayjs } from "dayjs";
import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

interface IFilter{
//    interface FilterContextType {
  capacity: number;
  setCapacity: Dispatch<SetStateAction<number>>;
  startDate: Dayjs | null;
  setStartDate: Dispatch<SetStateAction<string | null>>;
  endDate: Dayjs | null;
  setEndDate: Dispatch<SetStateAction<string| null>>;
// }
}
const FilterContext=createContext<null|IFilter>(null)
export const FilterContextProvider=({children}:{children:ReactNode})=>{
    const [capacity,setCapacity]=useState<number>(0)
   const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
    return <FilterContext.Provider value={{capacity,setCapacity,startDate,setStartDate,endDate,setEndDate}}>
        {children}
    </FilterContext.Provider>
}

export const UseFilter=()=>{
    const context=useContext(FilterContext)
    if(!context){
        throw new Error("err")
    }
    return context
}