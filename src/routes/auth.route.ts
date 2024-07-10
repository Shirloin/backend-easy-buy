import { Router } from "express";
import { Routes } from "../interfaces/auth.interface.ts";
import AuthController from "../controllers/auth.controller.ts";
import { ValidateUserLogin, ValidateUserRegister } from "../validators/auth.validator.ts";

class AuthRoute implements Routes {
  public router = Router();
  public auth_controller = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", ValidateUserRegister, this.auth_controller.register);
    this.router.post("/login", ValidateUserLogin, this.auth_controller.login);
  }
}

export default AuthRoute;
