import  { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoutes({children}:{children:ReactNode}) {
 if(localStorage.getItem("token")){
    return children
 }else {
  return  <Navigate to={'/auth/login'}/>
 }

}
