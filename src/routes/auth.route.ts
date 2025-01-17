import { Router } from "express";
import { Routes } from "../interfaces/auth.interface";
import AuthController from "../controllers/auth.controller";
import {
  ValidateUserLogin,
  ValidateUserRegister,
} from "../validators/auth.validator";

class AuthRoute implements Routes {
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      ValidateUserRegister,
      this.authController.register
    );
    this.router.post("/login", ValidateUserLogin, this.authController.login);
    this.router.get("/logout", this.authController.logout);
    this.router.get("/validate-token", this.authController.validateToken);
  }
}

export default AuthRoute;
