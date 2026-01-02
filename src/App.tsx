import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./shared/authLayout/AuthLayout";
import Login from "./components/auth/Login";
import Home from "./components/Home/Home";
import { Toaster } from "react-hot-toast";
import Register from "./components/auth/Reister";
import Forget from "./components/auth/Forget";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { getTheme } from "./ThemeProvider";
import { useMode } from "./context/DarkTheme";
import AdminLayout from "./shared/adminLayout/AdminLayout";
import Users from "./components/admin/Users/Users";
import Rooms from "./components/admin/Rooms/Rooms";
import Ads from "./components/admin/Ads/Ads";
import Booking from "./components/admin/Booking/Booking";
import Facilities from "./components/admin/Facilities/Facilities";
import { useTranslation } from "react-i18next";
import ProtectedRoutes from "./shared/adminLayout/ProtectedRoutes";
import RoomData from "./components/admin/Rooms/RoomData";
import Reset from "./components/auth/Reset";
import Change from "./components/auth/Change";
import FacilitiesData from "./components/admin/Facilities/FaciliyiesData";
import UserLayout from "./shared/userLayout/UserLayout";
import UserHome from "./components/user/UserHome/UserHome";
import Explore from "./components/user/Explore/Explore";
import UserBooking from "./components/user/Booking/Booking";
import RoomDetails from "./components/user/UserHome/RoomDetails";
import Fav from "./components/user/Favourites/Fav";
import Pay from "./components/user/Payment/Pay";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'
import Profile from "./components/user/Profile/Profile";

const stripe=loadStripe("pk_test_51OTjURBQWp069pqTmqhKZHNNd3kMf9TTynJtLJQIJDOSYcGM7xz3DabzCzE7bTxvuYMY0IX96OHBjsysHEKIrwCK006Mu7mKw8");

function App() {

  const { mode } = useMode();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserLayout/>,
      children:[
        {path:"",element:<UserHome/>,index:true},
        {path:"explore",element:<Explore/>},
        {path:"booking",element:<UserBooking/>},
        {path:"room-detail/:id",element:<RoomDetails/>},
        {path:"profile",element:<Profile/>},
        {path:"fav",element:<Fav/>},
        {path:"checkOut/:bookingId",element:<Elements stripe={stripe}>
          
          <Pay/>
          </Elements>
        },
      ]
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgot", element: <Forget /> },
        { path: "reset", element: <Reset /> },
        { path: "forgot", element: <Change /> },
      ],
    },
    {
      path: "/dashboard",
      element: <ProtectedRoutes><AdminLayout /></ProtectedRoutes>,
      children: [
        { path: "", element: <Home /> },
        { path: "users", element: <Users /> },
        { path: "rooms", element: <Rooms /> },
        { path: "rooms-data", element: <RoomData /> },
        { path: "rooms-data/:id", element: <RoomData /> },
        { path: "ads", element: <Ads /> },
        { path: "bookings", element: <Booking /> },
        { path: "facilities", element: <Facilities /> },
        { path: "facilities-data", element: <FacilitiesData /> },
      ],
    },
  ]);
const {i18n}=useTranslation()
const isArabic=i18n.language==='ar'
  return (
    <>
      <ThemeProvider theme={getTheme(mode,isArabic)}>
        <CssBaseline />
        <RouterProvider router={router}/>
        <Toaster position="top-center" />
      </ThemeProvider>
    </>
  );
}

export default App;
