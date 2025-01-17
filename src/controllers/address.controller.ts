import { NextFunction, Request, Response } from "express";
import AddressRepository from "../repositories/address.repository";
import UserRepository from "../repositories/user.repository";
import { IAddress, ICreateAddress } from "../interfaces/address.interface";

export default class AddressController {
    private addressRespository = AddressRepository.getInstance()
    private userRepository = UserRepository.getInstance();

    public createAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { address }: { address: ICreateAddress } = req.body
            address.user = user
            const newAddress = await this.addressRespository.createAddress(address)
            return res.status(200).json({ address: newAddress, message: "Address successfully inserted" })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    public getUserAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const addresses = await this.addressRespository.getAddressByUser(user._id)
            return res.status(200).json({ addresses: addresses })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    public updateAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { address }: { address: IAddress } = req.body
            const updatedAddress = await this.addressRespository.updateAddress(address)
            return res.status(200).json({ address: updatedAddress, message: "Address updated" })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    public deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { addressId } = req.params
            const deletedAddress = await this.addressRespository.deleteAddress(addressId)
            return res.status(200).json({ address: deletedAddress, message: "Address deleted" })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}