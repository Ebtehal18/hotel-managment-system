import {  IconButton, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import { useLocation } from "react-router-dom";
import { useMode } from "../../context/DarkTheme";

export default function SwitchLng() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  //close the icon + change the lng
  const handelChangeLng = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    setAnchorEl(null);
  };
const location=useLocation()
  //get the lng from localstorage then 
  useEffect(()=>{
    const lng=localStorage.getItem("lng")
     i18n.changeLanguage(lng??"en")
 const direction = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = lng??"en";

  },[i18n])
  const {mode}=useMode()
  return (
    <>
      <IconButton id="basic-button" onClick={handleClick}>
        <LanguageIcon  sx={{color:location.pathname.includes('/dashboard')||location.pathname.includes("/auth")&&mode==='dark'?
          '#FFf':"rgba(0, 0, 0, 0.54)"}}/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handelChangeLng}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={() => handelChangeLng("ar")}>العربية</MenuItem>
        <MenuItem onClick={() => handelChangeLng("en")}>English</MenuItem>
      </Menu>
    </>
  );
}