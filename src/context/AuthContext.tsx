import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { axiosPrivateInstance } from "../services/api/apiInstance";
import { Auth } from "../services/api/apiConfig";

interface IAuth {
  userName: string;
  profileImage: string;
  _id: string;
  email: string;
}

interface IAuthData {
  fillData: IAuth | null;
  isAuthenticated: boolean;
  getImageNameUser: () => Promise<void>;
  logout: () => void;        // Add logout function
}

const AuthContext = createContext<IAuthData | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [fillData, setFillData] = useState<IAuth | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // This will be true only if we have a valid token AND user data loaded
  const isAuthenticated = !!fillData ;

  // Sync with localStorage changes (e.g., from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        setToken(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getImageNameUser = async () => {
    const currentToken = localStorage.getItem("token");

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
      // If profile fetch fails (e.g. token invalid), consider user not authenticated
      setFillData(null);
      // Optionally: localStorage.removeItem("token"); setToken(null);
    }
  };

  // Re-fetch profile when token changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getImageNameUser();
  }, [token]);

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