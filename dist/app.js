"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const index_js_1 = require("./database/index.js");
const index_js_2 = require("./config/index.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_js_1 = __importDefault(require("./routes/auth.route.js"));
class App {
    app;
    env;
    port;
    constructor() {
        this.app = (0, express_1.default)();
        this.env = 'development';
        this.port = 3000;
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.info(`=================================`);
            console.info(`======= ENV: ${this.env} =======`);
            console.info(`🚀 App listening on the port ${this.port}`);
            console.info(`=================================`);
        });
    }
    async connectToDatabase() {
        if (this.env !== 'production') {
            (0, mongoose_1.set)('debug', true);
        }
        await (0, mongoose_1.connect)(index_js_1.dbConnection.url);
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)({ origin: index_js_2.ORIGIN, credentials: index_js_2.CREDENTIALS }));
        this.app.use(express_1.default.json());
        this.app.use((0, cookie_parser_1.default)());
    }
    initializeRoutes() {
        this.app.use('/', new auth_route_js_1.default().router);
    }
}
const app = new App();
app.listen();
