import { createContext } from "react";

export interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);
