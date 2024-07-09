import bcrypt from 'bcryptjs'
import { ICreateUser, IUser } from "../interfaces/user.interface.js";
import User from "../models/user.model.js";

class AuthRepository{
    public user = User
    
    public async register(userData: ICreateUser): Promise<IUser>{
        const hashedPassword = bcrypt.hash(userData.password, 10)
        const newUser: IUser = await this.user.create({...userData,  password: hashedPassword})
        return newUser
    }
}

export default AuthRepository