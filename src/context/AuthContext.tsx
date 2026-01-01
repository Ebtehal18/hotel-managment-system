import  { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { jwtDecode } from "jwt-decode";
import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Auth } from "../services/api/apiConfig";

interface IAuth {

            userName: string,
         
            profileImage: string,
            _id:string
      
  
}


interface IAuthData {
  fillData: null | IAuth;
  isAuthenticated:boolean,
  setFillData:Dispatch<SetStateAction<IAuth | null>>
}

const AuthContext = createContext<null | IAuthData>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [fillData, setFillData] = useState<null |IAuth>(null);
  
  
  const isAuthenticated=!!fillData
  
  //runs every reload
  useEffect(() => {
    // if (!token) return;
  
  const getImageNameUser=async()=>{
      const token=localStorage.getItem('token')
    if(!token) {
      setFillData(null)
      return
    }
  try {
    const user=jwtDecode<{_id:string}>(token??"")
    console.log(user)
    const res=await axiosPrivateInstance(Auth.profile(user._id))
    console.log(res)
    setFillData(res.data.data.user)
  } catch (error) {
    console.log(error)
  }
}
  getImageNameUser();

}, []);
  return (
    <AuthContext.Provider value={{ fillData,isAuthenticated,setFillData}}>
      {children}
    </AuthContext.Provider>
  );
};



export const UseAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
