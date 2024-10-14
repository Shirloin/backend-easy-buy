import { DB_NAME, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } from "../config";

export const dbConnection = {
    url: `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
}