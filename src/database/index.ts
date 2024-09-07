import { DB_NAME, DB_HOST, DB_PORT } from "../config";

export const dbConnection = {
    url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
    }
}