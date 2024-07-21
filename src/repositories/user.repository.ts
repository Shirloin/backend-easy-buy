import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";

class UserRepository{
    static instance: UserRepository;
    public user = User

    constructor(){
        if(UserRepository.instance){
            throw new Error("Use User Repository Get Instance Singleton")
        }
        UserRepository.instance = this;
    }

    static getInstance(){
        if(!UserRepository.instance){
            UserRepository.instance = new UserRepository()
        }
        return UserRepository.instance
    }

    public async getUserByUsername(username: String){
        const user = await this.user.findOne({username: username})
        return user
    }
    public async getUserByEmail(email: String){
        const user = await this.user.findOne({email: email})
        return user
    }

    public async getUserById(id: string){
        const user = await this.user.findById(id)
        return user
    }
}

export default UserRepository