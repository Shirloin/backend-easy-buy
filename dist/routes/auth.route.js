"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = __importDefault(require("../controllers/auth.controller.js"));
class AuthRoute {
    router = (0, express_1.Router)();
    auth_controller = new auth_controller_js_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/register', this.auth_controller.register);
        this.router.get('/login', this.auth_controller.login);
    }
}
exports.default = AuthRoute;
