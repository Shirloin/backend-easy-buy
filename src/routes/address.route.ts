import { Router } from "express"
import { Routes } from "../interfaces/auth.interface"
import { authMiddleware } from "../middleware"
import AddressController from "../controllers/address.controller"

export default class AddressRoute implements Routes {
    public router = Router()

    public addressController = new AddressController()

    constructor() {
        this.initializeRoutes()
    }
    private initializeRoutes() {
        this.router.get("/address", authMiddleware, this.addressController.getUserAddress)
        this.router.post("/address", authMiddleware, this.addressController.createAddress)
        this.router.put("/address", authMiddleware, this.addressController.updateAddress)
        this.router.delete("/address/:addressId", authMiddleware, this.addressController.deleteAddress)
    }
}