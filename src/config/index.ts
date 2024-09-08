import { config } from "dotenv"

config({ path: `.env` })
export const CREDENTIALS = process.env.CREDENTIALS === 'true'
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_NAME, SECRET_KEY, ORIGIN, } = process.env