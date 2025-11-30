import { ICreateUser, IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import logger from "../utils/logger";

class AuthRepository {
  public user = User;

  public async register(userData: ICreateUser): Promise<IUser> {
    logger.info("AuthRepository.register - Registering new user", {
      username: userData.username,
      email: userData.email,
    });
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser: IUser = await this.user.create({
      ...userData,
      password: hashedPassword,
    });
    logger.info("AuthRepository.register - User registered successfully", {
      userId: newUser._id,
      username: newUser.username,
    });
    return newUser;
  }
}

export default AuthRepository;
