import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import ProductRepository from "../repositories/product.repository";
import { IProductVariant } from "../interfaces/product-variant.interface";

export const ValidateAddToCart = [
    check("quantity").isInt({ gt: 0 }).withMessage("Quantity must be at least 1"),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ message: errors.array()[0].msg });
        }
        const { variantId, shopId, quantity } = req.body
        const variant = await ProductRepository.getInstance().getProductVariantById(variantId)
        if (variant!.stock < quantity) {
            return res.status(422).json({ message: "Quantity must be lower or equal to total stock" })
        }
        next();
    }
]

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