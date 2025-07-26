import { getAuth } from "firebase/auth";
import { app } from "./config"; // You may need to export 'app' from config.ts


export const auth = getAuth(app);