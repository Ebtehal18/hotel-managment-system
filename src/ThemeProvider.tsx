
import { createTheme, type ThemeOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface Theme {
    customShadows: {
      btn: string;
    };
  }
  interface ThemeOptions {
    customShadows?: {
      btn?: string;
    };
  }
   interface PaletteColor {
    100?: string;
    200?: string;
    900?: string;
  }

  interface SimplePaletteColorOptions {
    100?: string;
    200?: string;
    900?: string;
  }
}

export const getTheme = (mode: "light" | "dark",isArabic:boolean) => {

  const themeOptions: ThemeOptions = {
    direction:isArabic?'rtl':"ltr",
    palette: {
      mode,
      primary: { main: "#3252DF", light: "#fff",dark:"#1A1B1E",contrastText:"#fff" ,"100":"#5368F0","900":"#9D57D5","200":"#35C2FD"},
      info:{main:"#203FC7",light:"#203FC733"},
      common:{white:"#fff"},

      secondary: { main: "#4D4D4D",light:"#E2E5EB" },
      error: { main: "#EB5148" },
      warning:{main:"#54D14D"},
      background: {
        default: mode === "dark" ? "#121212" : "#F5F5F5",
        paper: mode === "dark" ? "#1E1E1E" : "#fff",
        

      },
      text: {
        primary: mode === "dark" ? "#fff" : "#000",
        secondary: mode === "dark" ? "#B0B0B0" : "#4D4D4D",
        disabled:mode==='dark'?"#fff":"#152C5B"

      },
    },
     components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
    typography: { fontFamily: '"Rubik", "Tahoma", "Arial", sans-serif' },
  };

  return createTheme(themeOptions);
};

