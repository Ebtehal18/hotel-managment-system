import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import login from "../../assets/login.png";
import register from "../../assets/register.png";
import forget from "../../assets/forget.png";
import reset from "../../assets/reset.png";
import { useTranslation } from "react-i18next";
import SwitchLng from "../../components/switchLng/SwitchLng";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useMode } from "../../context/DarkTheme";

export default function AuthLayout() {
  const location = useLocation();
  //get image based on the path
  const getImage = () => {
    switch (location.pathname) {
      case "/auth/login":
        return login;
      case "/auth/register":
        return register;
      case "/auth/forgot":
        return forget;
      case "/auth/reset":
        return reset;
    }
  };

  //getpage title
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/auth/login":
        return t("login.signIn");
      case "/auth/register":
        return t("login.signUp");
      case "/auth/forgot":
        return t("login.forgotPassword");
      case "/auth/reset":
        return t("login.resetPassword");
    }
  };

  const theme = useTheme();
  const { t ,i18n} = useTranslation();
  const isArabic=i18n.language==='ar'
  const isLoginPage = location.pathname === "/auth/login";
  const { mode, toggleMode } = useMode();
  const handelToggleMode = () => {
    toggleMode();
  };

  return (
    <>
   <Grid
  container
  sx={{
    height: "100vh",        // Changed from maxHeight to fixed height
    // overflow: "hidden",     // Prevent whole page overflow
  }}
>
  <Grid size={{ xs: 12, sm: 6 }} sx={{ p: 3 }}>
    {/* Scrollable wrapper for the entire left content */}
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",    // Scroll only the left side if content is long
        pr: 2,                // Optional: padding-right to avoid scrollbar overlapping content
      }}
    >
      {/* title + switch lng + switch theme */}
      <Stack
        direction={"row"}
        alignSelf={"flex-start"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ width: "100%" }}
      >
        <Typography
          sx={{
            color: theme.palette.text.disabled,
            fontSize: "1.625rem",
            fontWeight: 500,
          }}
        >
          <span style={{ color: theme.palette.primary.main }}>
            {t("Staycation").slice(0, 3)}
          </span>
          {t("Staycation").slice(3)}
        </Typography>
        <Stack direction={"row"} gap={1}>
          <SwitchLng />
          {/* dark mode */}
          <IconButton onClick={handelToggleMode}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ p: 4 }}>
        <Typography sx={{ fontSize: "1.875rem", fontWeight: 500, mb: 2 }}>
          {getPageTitle()}
        </Typography>
        <Typography>
          {isLoginPage ? t("login.donnotHave") : t("login.doHave")}
        </Typography>
        <Typography>
          {t("login.youCan")}
          <Button
            to={isLoginPage ? "/auth/register" : "/auth/login"}
            sx={{
              color: isLoginPage
                ? theme.palette.primary.dark
                : theme.palette.error.main,
            }}
            component={Link}
          >
            {isLoginPage ? t("login.registerHere") : t("login.loginHere")}
          </Button>
        </Typography>

        {/* outlet - now scrolls inside the left column if too long */}
        <Box sx={{ mt: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  </Grid>

  {/* image - hidden on mobile, full height on desktop */}
  <Grid
    size={{ xs: 12, sm: 6 }}
    sx={{ display: { xs: "none", sm: "block",position:"fixed",top:0,right:!isArabic?0:'none',left:isArabic?0:'none' } }}
  >
    <Box
      component="img"
      src={getImage()}
      alt="Background"
      sx={{
        width: "100%",
        height: "100vh",          // Already full viewport height
        objectFit: "cover",
        objectPosition: "bottom",
        borderRadius: "0.5rem",
        p: 2,
      }}
    />
  </Grid>
</Grid>
    </>
  );
}
