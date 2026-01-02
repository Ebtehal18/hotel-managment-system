import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n.ts";
import { Toaster } from "react-hot-toast";
import { DarkThemeProvider } from "./context/DarkTheme.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "react-image-gallery/styles/css/image-gallery.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from "./App.tsx";
import "./index.css";
import 'rsuite/dist/rsuite.min.css';

const savedLng = localStorage.getItem("lng") || "en";
document.documentElement.lang = savedLng;
document.documentElement.dir = savedLng === "ar" ? "rtl" : "ltr";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { FilterContextProvider } from "./context/FilterContex.tsx";
import { FavProvider } from "./context/FavaContext.tsx";
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>  
      <DarkThemeProvider>
        <AuthProvider>
          <FavProvider>                          {/* ← FavProvider is still inside AuthProvider */}
            <FilterContextProvider>
              <Toaster position="top-center" />
              <App />                            {/* Contains all routes & layouts */}
            </FilterContextProvider>
          </FavProvider>
        </AuthProvider>
      </DarkThemeProvider>
    </I18nextProvider>
  </QueryClientProvider>
</StrictMode>
 
);
