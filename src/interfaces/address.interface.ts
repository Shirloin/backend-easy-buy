import { IUser } from "./user.interface"

export interface IAddress {
    _id: string
    receiverName: string
    receiverPhone: string
    addressLabel: string
    address: string
    user: IUser
}

export interface ICreateAddress {
    receiverName: string
    receiverPhone: string
    addressLabel: string
    address: string
    user: IUser
}