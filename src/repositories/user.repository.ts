import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";

class UserRepository{
    public user = User

    public async getUserByUsername(username: String){
        const user = await this.user.findOne({username: username})
        return user
    }
    public async getUserByEmail(email: String){
        const user = await this.user.findOne({email: email})
        return user
    }
}

export default UserRepository