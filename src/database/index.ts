import { DB_DATABASE, DB_HOST, DB_PORT } from "../config";

export const dbConnection = {
    // url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    url: `mongodb://127.0.0.1:27017/comxmart`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
}