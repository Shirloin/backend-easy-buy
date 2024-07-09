import express from 'express'
import cors from 'cors'
import { connect, set } from 'mongoose'
import { dbConnection } from './database/index.js'
import { CREDENTIALS, ORIGIN } from './config/index.js'
import cookieParser from 'cookie-parser'
import { Routes } from './interfaces/auth.interface.js'
import AuthRoute from './routes/auth.route.js'
class App {
    public app: express.Application
    public env: string
    public port: string | number

    constructor() {
        this.app = express()
        this.env = 'development'
        this.port = 3000

        this.connectToDatabase()
        this.initializeMiddlewares()
        this.initializeRoutes()
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.info(`=================================`);
            console.info(`======= ENV: ${this.env} =======`);
            console.info(`🚀 App listening on the port ${this.port}`);
            console.info(`=================================`);
        });
    }

    private async connectToDatabase() {
        if (this.env !== 'production') {
            set('debug', true)
        }
        await connect(dbConnection.url)
    }

    private initializeMiddlewares() {
        this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }))
        this.app.use(express.json())
        this.app.use(cookieParser())
    }

    private initializeRoutes() {
        this.app.use('/', new AuthRoute().router)
    }
}

const app = new App()
app.listen()