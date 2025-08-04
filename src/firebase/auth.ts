import { app } from "./config";
import type { FirebaseApp } from "firebase/app";

// Only initialize auth if Firebase is available
let auth: unknown = null;

if (app) {
  try {
    import("firebase/auth")
      .then(({ getAuth }) => {
        auth = getAuth(app as unknown as FirebaseApp);
      })
      .catch((error) => {
        console.warn("Firebase Auth initialization failed:", error);
      });
  } catch (error) {
    console.warn("Firebase Auth initialization failed:", error);
  }
}

export { auth };
