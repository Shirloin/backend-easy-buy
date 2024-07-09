"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const index_js_1 = require("../config/index.js");
exports.dbConnection = {
    url: `mongodb://${index_js_1.DB_HOST}:${index_js_1.DB_PORT}/${index_js_1.DB_DATABASE}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
};
