import { ICreateUser, IUser } from "../interfaces/user-interface.ts";
import User from "../models/user.model.ts";
// import bcrypt from "bcryptjs"

class AuthRepository{
    public user = User
    
    public async register(userData: ICreateUser): Promise<IUser>{
        // const hashedPassword = bcrypt.hash(userData.password, 10)
        const newUser: IUser = await this.user.create({...userData,  password: userData.password})
        return newUser
    }
}

export default AuthRepository