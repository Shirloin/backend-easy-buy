"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_js_1 = __importDefault(require("../models/user.model.js"));
class AuthRepository {
    user = user_model_js_1.default;
    async register(userData) {
        const hashedPassword = bcryptjs_1.default.hash(userData.password, 10);
        const newUser = await this.user.create({ ...userData, password: hashedPassword });
        return newUser;
    }
}
exports.default = AuthRepository;
