import { ICart } from "../interfaces/cart.interface";
import { IShop } from "../interfaces/shop.interface";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import logger from "../utils/logger";

class UserRepository {
  static instance: UserRepository;
  public user = User;

  constructor() {
    if (UserRepository.instance) {
      throw new Error("Use User Repository Get Instance Singleton");
    }
    UserRepository.instance = this;
  }

  static getInstance() {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  public async getUserByUsername(username: String) {
    const user = await this.user
      .findOne({ username: username })
      .populate("shop");
    return user;
  }
  public async getUserByEmail(email: String) {
    const user = await this.user.findOne({ email: email });
    return user;
  }

  public async getUserById(id: string) {
    const user = await this.user.findById(id).populate("shop");
    return user;
  }

  public async updateUser(userId: string, update: any) {
    return await this.user.findOneAndUpdate({ _id: userId }, update, { new: true })
  }

  public async removeCartFromUser(userId: string, cartIds: string[]) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { carts: { $in: cartIds } } },
      { new: true }
    );
  }

}

export default UserRepository;
