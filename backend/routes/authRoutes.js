import express from "express"
import { handleLogin, handleLogout, handleRegister } from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/register", handleRegister);
authRouter.post("/login", handleLogin);
authRouter.post("/logout", handleLogout);

export default authRouter;