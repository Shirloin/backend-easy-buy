import { IAddress, ICreateAddress } from "../interfaces/address.interface"
import Address from "../models/address.model"
import User from "../models/user.model"

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
        return await this.address.create(addressData)
    }

    public async getAddressByUser(userId: string) {
        return await this.address.find({ user: userId }).populate("user")
    }

    public async updateAddress(addressData: IAddress) {
        return await this.address.findOneAndUpdate({ _id: addressData._id }, addressData)
    }

    public async deleteAddress(addressId: string) {
        return await this.address.findOneAndDelete({ _id: addressId })
    }
}