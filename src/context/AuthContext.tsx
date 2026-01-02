import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Auth } from "../services/api/apiConfig";

interface IAuth {
  userName: string;
  profileImage: string;
  _id: string;
  email: string;
  role:string
  verified:boolean,
  phoneNumber:number
  country:string
  createdAt:string
}

interface IAuthData {
  fillData: IAuth | null;
  isAuthenticated: boolean;
  getImageNameUser: () => Promise<void>;
  logout: () => void;     
  isUser:boolean
}

const AuthContext = createContext<IAuthData | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [fillData, setFillData] = useState<IAuth | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // This will be true only if we have a valid token AND user data loaded
  const isAuthenticated = !!fillData && !!token;
  const isUser = fillData?.role === "user";

  // Sync with localStorage changes (e.g., from another tab)

  const getImageNameUser = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
setToken(currentToken)
    if (!currentToken) {
      setFillData(null);
      setToken(null);
      return;
    }

    try {
      const decoded = jwtDecode<{ _id: string }>(currentToken);
      const res = await axiosPrivateInstance.get(Auth.profile(decoded._id));
      setFillData(res.data.data.user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setFillData(null);
    }
  },[]);

  // Re-fetch profile when token changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getImageNameUser();
  }, [token,getImageNameUser]);

  // Login function (call this after successful login)

  // Logout function (call this on logout)
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setFillData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        fillData,
        isAuthenticated,
        getImageNameUser,
        logout,
        isUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("UseAuth must be used within an AuthProvider");
  }
  return context;
};