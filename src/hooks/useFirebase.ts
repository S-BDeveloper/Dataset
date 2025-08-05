import { useContext } from "react";
import { FirebaseContext } from "../contexts/FirebaseContextDef";
import type { FirebaseContextType } from "../contexts/FirebaseContextDef";

// Custom hook to use Firebase context
export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
