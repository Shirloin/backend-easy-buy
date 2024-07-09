"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_repository_js_1 = __importDefault(require("../repositories/auth.repository.js"));
class AuthController {
    auth_repository = new auth_repository_js_1.default();
    register = async (req, res, next) => {
        try {
            const userData = req.body;
            const user = await this.auth_repository.register(userData);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        res.status(200).json({ message: 'Login' });
    };
}
exports.default = AuthController;
