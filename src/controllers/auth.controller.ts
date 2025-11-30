import { CookieOptions, NextFunction, Request, Response } from "express";
import { ICreateUser, IUser } from "../interfaces/user.interface";
import AuthRepository from "../repositories/auth.repository";
import UserRepository from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/index";
import { validateHeaderName } from "http";
import logger from "../utils/logger";

class AuthController {
  public authRepository = new AuthRepository();
  public userRepository = UserRepository.getInstance();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("AuthController.register - Starting user registration", {
        username: req.body.username,
      });
      const userData: ICreateUser = req.body;
      const user: IUser = await this.authRepository.register(userData);
      logger.info("AuthController.register - User registered successfully", {
        userId: user._id,
        username: user.username,
      });
      res.status(200).send({ message: "User registered successfully" });
    } catch (error) {
      logger.error("AuthController.register - Error registering user", {
        username: req.body.username,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("AuthController.login - Starting user login", {
        username: req.body.username,
      });
      const { username, password } = req.body;
      const user: IUser | null = await this.userRepository.getUserByUsername(
        username
      );
      if (!user) {
        logger.warn("AuthController.login - User not found", { username });
        return res.status(404).send({ message: "User not found" });
      }
      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        logger.warn("AuthController.login - Invalid password", {
          username,
          userId: user._id,
        });
        return res.status(401).send({ message: "Wrong password" });
      }
      const options: CookieOptions = {
        maxAge: 20 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };
      var token = jwt.sign(
        {
          id: user._id,
        },
        SECRET_KEY || "SECRET_KEY",
        { expiresIn: 86400 }
      );
      (req.session as any).user = user;
      logger.info("AuthController.login - User logged in successfully", {
        userId: user._id,
        username: user.username,
      });
      res.status(200).json({
        user: user,
        message: "Login successfull",
        token: token,
        session: req.session,
      });
    } catch (error) {
      logger.error("AuthController.login - Error during login", {
        username: req.body.username,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("AuthController.logout - Starting user logout", {
        userId: (req.session as any).user?.id,
      });
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        logger.warn("AuthController.logout - No authorization header");
        return res.status(204);
      }
      const token = authHeader.split(" ")[1];
      const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY";

      res.setHeader("Clear-Site-Data", "authorization");
      logger.info("AuthController.logout - User logged out successfully", {
        userId: (req.session as any).user?.id,
      });
      res.status(200).json({ message: "You are logged out" });
    } catch (error) {
      logger.error("AuthController.logout - Error during logout", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  };
  public validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.info("AuthController.validateToken - Validating token");
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      logger.warn("AuthController.validateToken - No token provided");
      return res.sendStatus(401);
    }
    jwt.verify(token, SECRET_KEY as string, async (err: any, payload: any) => {
      if (err) {
        logger.warn("AuthController.validateToken - Token verification failed", {
          error: err.message,
        });
        return res.status(403);
      }
      const id = payload.id;
      const validateUser = await this.userRepository.getUserById(id);
      if (validateUser != null) {
        (req.session as any).user = validateUser;
        logger.info("AuthController.validateToken - Token validated successfully", {
          userId: id,
        });
        return res.status(200).json({ user: validateUser });
      } else {
        logger.warn("AuthController.validateToken - User not found", { userId: id });
        return res.status(403);
      }
      next();
    });
  };
}

export default AuthController;
