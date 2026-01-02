import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Button,
  IconButton,
  Stack,
  useTheme,
  Badge,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Divider,
} from "@mui/material";
import { UseAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import SwitchLng from "../../components/switchLng/SwitchLng";
import { useMode } from "../../context/DarkTheme";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Footer from "../../components/Footer/Footer";
import { UseFavorite } from "../../context/FavaContext";
import { useState } from "react";
// import { Badge } from 'rsuite';
import MenuIcon from "@mui/icons-material/Menu";
import { useQueryClient } from "@tanstack/react-query";

export default function UserLayout() {
  const { fillData,logout } = UseAuth();
  const { t ,i18n} = useTranslation();
  const theme = useTheme();
  const { mode, toggleMode } = useMode();
  const token = localStorage.getItem("token");
  // const {}=UseAuth()
  const { totalFav } = UseFavorite();
  const navStyle = ({ isActive }: { isActive: boolean }) => ({
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

  const navigate = useNavigate();
  // const {}=UseAuth()
  const queryClient=useQueryClient()
  const handelLogOut = () => {
    navigate("/");
    queryClient.clear()
logout()
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuOpen = () => setMobileMenuOpen(true);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: theme.palette.common.white }}
        >
          <Toolbar>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: "100%",px:{xs:0,md:10} }}
            >
              {/* Logo */}
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ color: theme.palette.primary.main }}
              >
                {t("Staycation")}
              </Typography>

              {/* Desktop Navigation + Actions */}
              <Stack
                direction="row"
                alignItems="center"
                gap={2}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                {/* Navigation Links */}
                <Stack direction="row" gap={3}>
                  <NavLink to="/" style={navStyle}>
                    {t("user.home")}
                  </NavLink>
                  <NavLink to="/explore" style={navStyle}>
                    {t("user.explore")}
                  </NavLink>
                  <NavLink to="/booking" style={navStyle}>
                    {t("user.booking")}
                  </NavLink>
                  {token && (
                    <Badge
                      showZero
                      badgeContent={totalFav}
                      color="error"
                    >
                      <NavLink to="/fav" style={navStyle}>
                        {t("user.favorites")}
                      </NavLink>
                    </Badge>
                  )}
                </Stack>

             
              </Stack>
   {/* Language + Theme + Auth */}
                <Stack direction="row" alignItems="center" gap={1}    sx={{ display: { xs: "none", md: "flex" } }}>
                  <SwitchLng />
                  <IconButton onClick={handelToggleMode}>
                    {mode === "light" ? (
                      <DarkModeIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                    ) : (
                      <LightModeIcon sx={{ color: "rgb(250, 175, 0)" }} />
                    )}
                  </IconButton>

                  {!token ? (
                    <>
                      <Button
                        component={Link}
                        variant="contained"
                        to="/auth/login"
                            sx={{"&:hover":{
                          color:"#fff"
                        }}}
                      >
                        {t("login.loginNow")}
                      </Button>
                      <Button
                        component={Link}
                        variant="contained"
                        to="/auth/register"
                        sx={{"&:hover":{
                          color:"#fff"
                        }}}
                      >
                        {t("login.register")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Avatar
                        onClick={handleClick}
                        component="button"
                        sx={{ width: 40, height: 40, cursor: "pointer" }}
                        src={fillData?.profileImage || ""}
                      />
                      <Typography variant="body2" sx={{ minWidth: 80 }}>
                        {fillData?.userName}
                      </Typography>
                    </>
                  )}
                </Stack>


              {/* Mobile Menu Button */}
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
                sx={{
                  display: { xs: "flex", md: "none" },
                  color: theme.palette.primary.main,
                }}
              >
                <MenuIcon />
              </IconButton>
            </Stack>
          </Toolbar>

          {/* Mobile Drawer Menu */}
          <Drawer
            anchor={i18n.language=='ar'?"left":"right"}
            open={mobileMenuOpen}
            onClose={handleMobileMenuClose}
            sx={{
    "& .MuiDrawer-paper": {
      width: 280,
      backgroundColor: theme.palette.common.white,
      boxShadow: theme.shadows[8], // nicer shadow
    },
  }}
          >
            <Box sx={{ p: 2 }}>
              {/* User info at top if logged in */}
              {token && (
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={2}
                  sx={{
                    mb: 3,
                    pb: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Avatar
                    src={fillData?.profileImage || ""}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      {fillData?.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {fillData?.email}
                    </Typography>
                  </Box>
                </Stack>
              )}

              {/* Navigation Links */}
              <List>
                <ListItem
                  component={NavLink}
sx={{"&.active": {
      color: theme.palette.primary.main,
      fontWeight: "bold",
      backgroundColor: theme.palette.action.selected,
    },
   "&:hover":{
        textDecoration:"none"
      }}}
                  to="/"
                  onClick={handleMobileMenuClose}
                >
                  <ListItemText sx={{      textAlign:i18n.language==='ar'?"justify":"start"
}} primary={t("user.home")} />
                </ListItem>
                <ListItem
                  component={NavLink}
sx={{"&.active": {
      color: theme.palette.primary.main,
      fontWeight: "bold",
      backgroundColor: theme.palette.action.selected,
    },
   "&:hover":{
        textDecoration:"none"
      }
  }}
                  to="/explore"
                  onClick={handleMobileMenuClose}
                >
                  <ListItemText sx={{      textAlign:i18n.language==='ar'?"justify":"start"
}} primary={t("user.explore")} />
                </ListItem>
                <ListItem
                  component={NavLink}
                  to="/booking"
sx={{"&.active": {
      color: theme.palette.primary.main,
      fontWeight: "bold",
      backgroundColor: theme.palette.action.selected,
    },
   "&:hover":{
        textDecoration:"none"
      }
  }}
                  onClick={handleMobileMenuClose}
                >
                  <ListItemText sx={{      textAlign:i18n.language==='ar'?"justify":"start"
}} primary={t("user.booking")} />
                </ListItem>
                {token && (
                  <ListItem
                    component={NavLink}
                    to="/fav"
                    onClick={handleMobileMenuClose}
          sx={{"&.active": {
      color: theme.palette.primary.main,
      fontWeight: "bold",
      backgroundColor: theme.palette.action.selected,
    },
   "&:hover":{
        textDecoration:"none"
      }
  }}
                  >
                    <Badge badgeContent={totalFav} color="error">
                      <ListItemText
                        primary={t("user.favorites")}
                    sx={{      textAlign:i18n.language==='ar'?"justify":"start"
}}
                      />
                    </Badge>
                  </ListItem>
                )}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Settings */}
              <Stack gap={2} sx={{ px: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography sx={{color:theme.palette.primary.main}}>{t("user.language")}</Typography>
                  <SwitchLng />
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography sx={{color:theme.palette.primary.main}}>{t("user.theme")}</Typography>
                  <IconButton onClick={handelToggleMode}>
                    {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                  </IconButton>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Auth Actions */}
              {!token ? (
                <Stack gap={2} sx={{ px: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    component={Link}
                    to="/auth/login"
                    sx={{"&:hover":{
                          color:"#fff"
                        }}}
                    onClick={handleMobileMenuClose}
                  >
                    {t("login.loginNow")}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    to="/auth/register"
                  
                    onClick={handleMobileMenuClose}
                  >
                    {t("login.register")}
                  </Button>
                </Stack>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    handleMobileMenuClose();
                    handelLogOut();
                  }}
                  sx={{ mt: 2 }}
                >
                  {t("user.Logout")}
                </Button>
              )}
            </Box>
          </Drawer>

          {/* Avatar Menu (for desktop logged-in user) */}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{ paper: { style: { marginTop: 8 } } }}
          >
            <MenuItem onClick={()=>{
              handleClose()
              navigate("/profile")
            }}>{t("user.myProfile")}</MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handelLogOut();
              }}
            >
              {t("user.Logout")}
            </MenuItem>
          </Menu>
        </AppBar>
      </Box>
      <Box sx={{px:{xs:0,md:10}}}>
              <Outlet />

      </Box>
      <Box sx={{ borderTop: "1px solid #e5e5e5" ,px:{xs:0,md:10}}}>
        <Footer />
      </Box>
    </>
  );
}
