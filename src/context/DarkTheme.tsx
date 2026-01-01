import { createContext, useContext,  useState, type ReactNode } from "react";

interface dark{
    mode:'light'|'dark',
    toggleMode:()=>void,
}
const DarkContext=createContext<null|dark>(null)

export const DarkThemeProvider=({children}:{children:ReactNode})=>{

    const [mode,setDarkMode]=useState<'light'|'dark'>('light')
    const toggleMode=()=>setDarkMode(prev=>prev==='light'?"dark":"light")



    return <DarkContext.Provider value={{mode,toggleMode}}>
        {children}
    </DarkContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useMode= () => {
  const context = useContext(DarkContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};


