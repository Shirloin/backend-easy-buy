import ShopRepository from "../repositories/shop.repository";
import UserRepository from "../repositories/user.repository";

export default class ChatController {
    public shopRepository = ShopRepository.getInstance();
    public userRepository = UserRepository.getInstance();

}