export interface IUser{
    _id: string
    username: string
    email: string
    password: string
    dob: Date
    gender: string
    image_url: string
    phone: string
}

export interface ICreateUser{
    username: string
    email: string
    password: string
}