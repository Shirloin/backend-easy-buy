import { IAddress, ICreateAddress } from "../interfaces/address.interface"
import Address from "../models/address.model"
import User from "../models/user.model"
import logger from "../utils/logger"

export default class AddressRepository {
    static instance: AddressRepository
    private address = Address
    private user = User

    constructor() {
        if (AddressRepository.instance) {
            throw new Error("Use Address Repository Get Instance Singleton")
        }
        AddressRepository.instance = this
    }

    static getInstance() {
        if (!AddressRepository.instance) {
            AddressRepository.instance = new AddressRepository()
        }
        return AddressRepository.instance
    }

    public async createAddress(addressData: ICreateAddress) {
        logger.info("AddressRepository.createAddress - Creating address", {
            userId: addressData.user?._id || addressData.user,
        });
        const newAddress = await this.address.create(addressData)
        logger.info("AddressRepository.createAddress - Address created successfully", {
            addressId: newAddress._id,
        });
        return newAddress
    }

    public async getAddressByUser(userId: string) {
        logger.info("AddressRepository.getAddressByUser - Fetching addresses by user", { userId });
        const addresses = await this.address.find({ user: userId }).populate("user")
        logger.info("AddressRepository.getAddressByUser - Addresses fetched successfully", {
            userId,
            count: addresses.length,
        });
        return addresses
    }

    public async updateAddress(addressData: IAddress) {
        logger.info("AddressRepository.updateAddress - Updating address", {
            addressId: addressData._id,
        });
        const updatedAddress = await this.address.findOneAndUpdate({ _id: addressData._id }, addressData)
        logger.info("AddressRepository.updateAddress - Address updated successfully", {
            addressId: addressData._id,
        });
        return updatedAddress
    }

    public async deleteAddress(addressId: string) {
        logger.info("AddressRepository.deleteAddress - Deleting address", { addressId });
        const deletedAddress = await this.address.findOneAndDelete({ _id: addressId })
        logger.info("AddressRepository.deleteAddress - Address deleted successfully", { addressId });
        return deletedAddress
    }
}