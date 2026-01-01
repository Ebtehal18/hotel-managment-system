import * as React from 'react';
import { styled, useTheme, type Theme, type CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar,  Stack, useMediaQuery } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import ClassIcon from '@mui/icons-material/Class';
import BusinessIcon from '@mui/icons-material/Business';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import SwitchLng from '../../components/switchLng/SwitchLng';
import { useMode } from '../../context/DarkTheme';
import LogoutIcon from '@mui/icons-material/Logout';
import  { UseAuth } from '../../context/AuthContext';


const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => {
  const isRTL = theme.direction === 'rtl';
  return {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    ...(open && {
      marginLeft: isRTL ? 0 : drawerWidth,
      marginRight: isRTL ? drawerWidth : 0,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  };
});


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function AdminLayout() {
  const theme = useTheme();
  const {t}=useTranslation()
  // const isArabic=i18n.language==='ar'
  const [open, setOpen] = React.useState(false);
   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleMode } = useMode();
  const{fillData} =UseAuth()
// const location=useLocation()

  const handelToggleMode = () => {
    toggleMode();
  };


  const handleDrawerOpen = () =>   setOpen(true);
  

  const handleDrawerClose = () =>   setOpen(false);
  

  const toggleDrawer = (newOpen: boolean) => () =>  setOpen(newOpen);
  

  const items=[
    {path:"/dashboard",Icon:HomeIcon,name:t("dashboard.home")},
    {path:"/dashboard/users",Icon:PeopleIcon,name:t("dashboard.users")},
    {path:"/dashboard/rooms",Icon:BedroomParentIcon,name:t("dashboard.rooms")},
    {path:"/dashboard/ads",Icon:FeaturedVideoIcon,name:t("dashboard.ads")},
    {path:"/dashboard/bookings",Icon:ClassIcon,name:t("dashboard.bookings")},
    {path:"/dashboard/facilities",Icon:BusinessIcon,name:t("dashboard.facilities")},
    {path:"",Icon:LogoutIcon,name:t("dashboard.logout")},
  ]

const navigate=useNavigate()
  const handelLogOut=()=>{
  navigate("/auth/login")
  localStorage.removeItem("token")
  }

  // const handelHeader=()=>{
  //   switch(location.pathname){
  //     case '/dashboard/users' :
  //       return <>
  //       <Typography sx={{fontWeight:500,fontSize:"1.25rem"}}>

  //         {t("dashboard.users")} {t('dashboard.tableDetails')}
  //       </Typography> 
  //       <Typography sx={{fontSize:"0.875rem",color:theme.palette.secondary.main}}> {t('dashboard.Youcancheck')}</Typography>
  //       </>

  //     case '/dashboard/rooms' :
  //       return <>
  //       <Typography sx={{fontWeight:500,fontSize:"1.25rem"}}>

  //         {t("dashboard.rooms")} {t('dashboard.tableDetails')}
  //       </Typography> 
  //       <Typography sx={{fontSize:"0.875rem",color:theme.palette.secondary.main}}> {t('dashboard.Youcancheck')}</Typography>
  //       </>

  //     case '/dashboard/ads' :
  //       return  <>
  //       <Typography sx={{fontWeight:500,fontSize:"1.25rem"}}>

  //         { t("dashboard.ads")} {t('dashboard.tableDetails')}
  //       </Typography> 
  //       <Typography sx={{fontSize:"0.875rem",color:theme.palette.secondary.main}}> {t('dashboard.Youcancheck')}</Typography>
  //       </>
       
  //     case '/dashboard/bookings' :
  //       return <>
  //       <Typography sx={{fontWeight:500,fontSize:"1.25rem"}}>

  //         {t("dashboard.bookings")} {t('dashboard.tableDetails')}
  //       </Typography> 
  //       <Typography sx={{fontSize:"0.875rem",color:theme.palette.secondary.main}}> {t('dashboard.Youcancheck')}</Typography>
  //       </>
       
        
  //     case '/dashboard/facilities' :
  //       return<>
  //       <Typography sx={{fontWeight:500,fontSize:"1.25rem"}}>

  //         {t("dashboard.facilities")} {t('dashboard.tableDetails')}
  //       </Typography> 
  //       <Typography sx={{fontSize:"0.875rem",color:theme.palette.secondary.main}}> {t('dashboard.Youcancheck')}</Typography>
  //       </>
       
  //       default:
  //         return ''
  //   }
  // }
  // const handelShowBtn=()=>{
  //   switch(location.pathname){
  //     case '/dashboard/rooms':
  //       return <Button component={Link} to={'/dashboard/rooms-data'} variant='contained'>
  //       {  t("dashboard.addNewRoom")} 
  //       </Button>
  //     case '/dashboard/ads':
  //       return <Button variant='contained'>
  //       {  t("dashboard.addNewAds")}
  //       </Button>
  //     case '/dashboard/facilities':
  //       return <Button variant='contained' component={Link} to={'/dashboard/facilities-data'} >
  //        { t("dashboard.addNewFacility")}
  //       </Button>
  //   }
  // }
  return (
    <>
    {isMobile?
    
    <>
  <Stack direction={'row'} sx={{px:2,py:1,backgroundColor:theme.palette.primary.main}}>
         <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
             
                open && { display: 'none' },
            ]}
            >
            <MenuIcon />
          </IconButton>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{width:"100%"}}>
             <Typography variant="h6" noWrap component="div" >
           {t("Staycation")}
          </Typography>
          
       
         
 
        <Stack direction={'row'} sx={{direction:"ltr"}} gap={1} alignItems={'center'}>
         <Avatar sx={{width:50,height:50}} src={fillData?.profileImage??""}/>         <Typography>{fillData?.userName}</Typography>  

       </Stack>
        </Stack>

  </Stack>
          
      <MuiDrawer open={open} onClose={()=>toggleDrawer(false)}   PaperProps={{
    sx: {
      background: theme.palette.primary.main,
      color: "#fff",
    }
  }} >
          <Box sx={{ width: 250 }} role="presentation"  >
      <List >
        <Box sx={{display:"flex",width:"100%",justifyContent:"flex-end"}}>
                  <IconButton onClick={handleDrawerClose} ><CloseIcon sx={{color:"#fff"}}/></IconButton>

        </Box>
             <Stack direction={"row"} justifyContent={'center'} >
              <SwitchLng />
              {/* dark mode */}
              <IconButton onClick={
                handelToggleMode
              }>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Stack>
        {items.map(({Icon,name,path}) => (
          <ListItem key={name} disablePadding component={Link} to={path} sx={{color:'#fff',  "&:hover":{
          color:"#fff",
          textDecoration:"none"
        }}}>
            <ListItemButton>
              <ListItemIcon>
                <Icon sx={{color:"#fff"}}/>
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
      </MuiDrawer>
        <Box component="main" sx={{ flexGrow: 1}}>


<Box sx={{p:3}}>
    <Outlet/>
</Box>
      </Box>
    </>
    :
  <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}   >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
                {
                    marginRight: 5,
                },
                open && { display: 'none' },
            ]}
            >
            <MenuIcon />
          </IconButton>
        <Stack direction={'row'} justifyContent={'space-between'} sx={{width:"100%"}}>
       <Stack direction={'row'} alignItems={'center'}>
             <Typography variant="h6" noWrap component="div" sx={{mx:2}}>
           {t("Staycation")}
          </Typography>
            <Stack direction={"row"} gap={1}>
              <SwitchLng />
              {/* dark mode */}
              <IconButton onClick={handelToggleMode}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Stack>
       </Stack>
       <Stack direction={'row'} sx={{direction:"ltr"}} gap={1} alignItems={'center'}>
         <Avatar sx={{width:50,height:50}} src={fillData?.profileImage??""}/>         <Typography>{fillData?.userName}</Typography>  

       </Stack>
        </Stack>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent"   anchor={theme.direction === 'rtl' ? 'right' : 'left'}
 open={open} PaperProps={{
    sx: {
      background: theme.palette.primary.main,
      color: "#fff",
    }
  }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon sx={{color:theme.palette.primary.contrastText}} /> : <ChevronLeftIcon sx={{color:theme.palette.primary.contrastText}}  />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {items.map(({Icon,name,path}) => (
          <ListItem key={name}  disablePadding component={ !path?'div': NavLink} end onClick={!path?handelLogOut:undefined}  to={path} sx={{color:'#fff', 
            direction:"ltr",
            "&.active": {
          backgroundColor: '#1A1B1E2B',
          borderLeft: "4px solid #152C5B",
        },
        "&:hover":{
          color:"#fff",
          textDecoration:"none"
        }
        }}>
            <ListItemButton>
              <ListItemIcon>
                <Icon sx={{color:theme.palette.primary.contrastText}} />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
        </List>
    
      </Drawer>
      {/* outlet based on the path */}
      <Box component="main" sx={{ flexGrow: 1}}>
        {/* This creates empty space equal to AppBar height */}
        <DrawerHeader />
<Box sx={{p:3}}>
{/* <Box sx={{display:"flex",justifyContent:"space-between"}}>
  <Stack>
 {handelHeader()}
</Stack>
{handelShowBtn()}
</Box> */}

  <Outlet/>
</Box>
      </Box>
    </Box>
    
  </>
        }
          </>
  );
}