import { Router } from "express";
import { Routes } from "../interfaces/auth.interface.ts";
import AuthController from "../controllers/auth.controller.ts";
import { ValidateUserLogin, ValidateUserRegister } from "../validators/auth.validator.ts";
import { validate_token } from "../middleware/index.ts";
import { IRequest } from "../interfaces/request.interface.ts";

class AuthRoute implements Routes {
  public router = Router();
  public auth_controller = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", ValidateUserRegister, this.auth_controller.register);
    this.router.post("/login", ValidateUserLogin, this.auth_controller.login);
    this.router.get("/logout", this.auth_controller.logout);
  }
}

export default AuthRoute;
