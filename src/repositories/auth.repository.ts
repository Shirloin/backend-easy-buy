import { ICreateUser, IUser } from "../interfaces/user.interface.ts";
import User from "../models/user.model.ts";
import bcrypt from "bcryptjs";

class AuthRepository {
  public user = User;

  public async register(user_data: ICreateUser): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(user_data.password, 10);
    const newUser: IUser = await this.user.create({
      ...user_data,
      password: hashedPassword,
    });
    return newUser;
  }
}

export default AuthRepository;
