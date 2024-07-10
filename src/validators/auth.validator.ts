import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user.model";

export const ValidateUserRegister = [
  check("username")
    .trim()
    .notEmpty()
    .withMessage("Username must be filled")
    .isLength({ min: 3 })
    .withMessage("Username length must be at least 3 characters")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ username: value });
      if (user != null) {
        return Promise.reject("Username already exists");
      }
    }),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email must be filled")
    .isEmail()
    .withMessage("Email must be a email type")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user != null) {
        return Promise.reject("Email already exists");
      }
    }),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password must be filled")
    .isLength({ min: 3 })
    .withMessage("Password length must be at least 3 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

export const ValidateUserLogin = [
  check("username").trim().notEmpty().withMessage("Username must be filled"),
  check("password").trim().notEmpty().withMessage("Password must be filled"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
