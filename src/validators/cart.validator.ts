import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

export const ValidateUpdateCartQuantity = [
    check("quantity").isInt({ gt: 0 }).withMessage("Quantity must be at least 1"),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ message: errors.array()[0].msg });
        }
        next();
    },
]