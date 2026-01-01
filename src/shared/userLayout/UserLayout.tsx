import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Avatar, Button, IconButton, Stack, useTheme,Badge, Menu, MenuItem } from '@mui/material';
import { UseAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import SwitchLng from '../../components/switchLng/SwitchLng';
import { useMode } from '../../context/DarkTheme';
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Footer from '../../components/Footer/Footer';
import { UseFavorite } from '../../context/FavaContext';
import { useState } from 'react';
// import { Badge } from 'rsuite';

export default function UserLayout() {
      const{fillData,setFillData} =UseAuth()
      const {t}=useTranslation()
      const theme=useTheme()
       const { mode, toggleMode } = useMode();
         const token=localStorage.getItem('token')
// const {}=UseAuth()
         const {favRooms}=UseFavorite()
         console.log(favRooms.length)
const navStyle = ({ isActive }:{isActive:boolean}) => ({
  textDecoration: "none",
  color: isActive ? theme.palette.primary.main : "#152C5B",
});
      // const location=useLocation()
      
        const handelToggleMode = () => toggleMode();
          const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

    
const navigate=useNavigate()
// const {}=UseAuth()
  const handelLogOut=()=>{
  navigate("/")
  localStorage.removeItem("token")
setFillData(null)
  
  }


  return (
    <>
       <Box sx={{ flexGrow: 1}}>
      <AppBar position="static" sx={{backgroundColor:theme.palette.common.white}}>
        <Toolbar>
       
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{width:"100%"}}>
             <Typography variant="h6" noWrap component="div" sx={{color:theme.palette.primary.main}} >
           {t("Staycation")}
          </Typography>
          
       
  <Stack direction={'row'} sx={{direction:"ltr"}} gap={1} alignItems={'center'}>
      <Stack direction={'row'} gap={3}>
              <NavLink to={'/'}
 style={navStyle}>{t("user.home")}</NavLink>
            <NavLink to={'/explore'} style={navStyle}>{t("user.explore")}</NavLink>
            <NavLink to={'/booking'} style={navStyle}>{t("user.booking")}</NavLink>

            {
              token?
              
              <Badge showZero badgeContent={favRooms?.length===0?0:favRooms?.length} color='error'>
                <NavLink style={navStyle} to={'/fav'}>{t("user.favorites")}</NavLink>
</Badge>
              :""
            }
      </Stack>

       </Stack>
   <Stack gap={2} direction={'row'} alignItems={'center'}>
    <Stack direction={"row"} justifyContent={'center'}  >
              <SwitchLng />
              {/* dark mode */}
              <IconButton onClick={handelToggleMode}>
                {mode === "light" ? <DarkModeIcon sx={{color:"rgba(0, 0, 0, 0.54)"}} /> : <LightModeIcon sx={{color:"#d5b740"}} />}
              </IconButton>
            </Stack>
            {!token?<>
            <Button component={Link} variant='contained' to={'/auth/login'}>{t("login.loginNow")}</Button>
            <Button component={Link} variant='contained'  to={'/auth/register'}>{t("login.register")}</Button>
          </>:         
         <>
         
          <Avatar         onClick={handleClick}
 component={'button'} sx={{width:50,height:50}} src={fillData?.profileImage??""}/> 
         <Menu
  id="basic-menu"
  anchorEl={anchorEl}
  open={open}
  onClose={handleClose}
  MenuListProps={{
    'aria-labelledby': 'basic-button',
  }}
  // ← Add these positioning props
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',  // Align menu's right edge with avatar's right edge
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',  // Menu grows from its right edge
  }}

  
  slotProps={{
    paper: {
      style: {
        marginTop: 8, // optional: small gap below avatar
      },
    },
  }}
>
 
  <MenuItem onClick={handleClose}>{t("user.myProfile")}</MenuItem>
   <MenuItem onClick={()=>{
    handleClose()
    handelLogOut()
  }}>{t("user.Logout")}</MenuItem>
</Menu>
           <Typography>{fillData?.userName}</Typography>
         </>
        
  
            }      
   </Stack>
        </Stack>
        </Toolbar>
      </AppBar>
    </Box>
    <Outlet/>
   <Box sx={{borderTop:"1px solid #e5e5e5"}}>
     <Footer/>
   </Box>
    </>
  )
}
