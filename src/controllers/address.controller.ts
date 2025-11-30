import { NextFunction, Request, Response } from "express";
import AddressRepository from "../repositories/address.repository";
import UserRepository from "../repositories/user.repository";
import { IAddress, ICreateAddress } from "../interfaces/address.interface";
import logger from "../utils/logger";

export default class AddressController {
    private addressRespository = AddressRepository.getInstance()
    private userRepository = UserRepository.getInstance();

    public createAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("AddressController.createAddress - Creating address", {
                userId: (req.session as any).user?.id,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("AddressController.createAddress - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { address }: { address: ICreateAddress } = req.body
            address.user = user
            const newAddress = await this.addressRespository.createAddress(address)
            logger.info("AddressController.createAddress - Address created successfully", {
                addressId: newAddress._id,
                userId: user._id,
            });
            return res.status(200).json({ address: newAddress, message: "Address successfully inserted" })
        } catch (error) {
            logger.error("AddressController.createAddress - Error creating address", {
                userId: (req.session as any).user?.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

    public getUserAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("AddressController.getUserAddress - Fetching user addresses", {
                userId: (req.session as any).user?.id,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("AddressController.getUserAddress - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const addresses = await this.addressRespository.getAddressByUser(user._id)
            logger.info("AddressController.getUserAddress - User addresses fetched successfully", {
                userId: user._id,
                addressCount: addresses.length,
            });
            return res.status(200).json({ addresses: addresses })
        } catch (error) {
            logger.error("AddressController.getUserAddress - Error fetching user addresses", {
                userId: (req.session as any).user?.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }

    public updateAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("AddressController.updateAddress - Updating address", {
                userId: (req.session as any).user?.id,
                addressId: req.body.address?._id,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("AddressController.updateAddress - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { address }: { address: IAddress } = req.body
            const updatedAddress = await this.addressRespository.updateAddress(address)
            logger.info("AddressController.updateAddress - Address updated successfully", {
                addressId: updatedAddress?._id,
            });
            return res.status(200).json({ address: updatedAddress, message: "Address updated" })
        } catch (error) {
            logger.error("AddressController.updateAddress - Error updating address", {
                addressId: req.body.address?._id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
    public deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("AddressController.deleteAddress - Deleting address", {
                userId: (req.session as any).user?.id,
                addressId: req.params.addressId,
            });
            const sessionUser = (req.session as any).user;
            const user = await this.userRepository.getUserById(sessionUser.id);
            if (!user) {
                logger.warn("AddressController.deleteAddress - User not found", {
                    userId: sessionUser.id,
                });
                return res.status(404).json({ message: "User not found" });
            }
            const { addressId } = req.params
            const deletedAddress = await this.addressRespository.deleteAddress(addressId)
            logger.info("AddressController.deleteAddress - Address deleted successfully", {
                addressId,
            });
            return res.status(200).json({ address: deletedAddress, message: "Address deleted" })
        } catch (error) {
            logger.error("AddressController.deleteAddress - Error deleting address", {
                addressId: req.params.addressId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            next(error)
        }
    }
}