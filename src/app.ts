import express from "express";
import cors from "cors";
import { connect, set } from "mongoose";
import { dbConnection } from "./database/index.ts";
import { ORIGIN, CREDENTIALS, SECRET_KEY } from "./config/index.ts";
import AuthRoute from "./routes/auth.route.ts";
import ErrorHandling from "./error/index.ts";
import ShopRoute from "./routes/shop.route.ts";
import session from "express-session";
import ProductRoute from "./routes/product.route.ts";
import CartRoute from "./routes/cart.route.ts";
import TransationRoute from "./routes/transaction.route.ts";
import AddressRoute from "./routes/address.route.ts";
import { createServer } from "http";
import { Websocket } from "./websocket/websocket.ts";
import ChatSocket from "./websocket/chat.socket.ts";
import ChatRoute from "./routes/chat.route.ts";
class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public ws: string | number;
  private httpServer: any

  constructor() {
    this.app = express();
    this.env = "development";
    this.port = 3000;
    this.ws = 5000;

    this.connectToDatabase();
    this.initializeWebsocket()
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  public listen() {
    this.httpServer.listen(this.port, () => {
      console.info(`=================================`);
      console.info(`======= ENV: ${this.env} =======`);
      console.info(`🚀 App listening on the port ${this.port}`);
      console.info(`=================================`);
    });
  }

  private async connectToDatabase() {
    if (this.env !== "production") {
      set("debug", true);
    }
    await connect(dbConnection.url);
  }

  private initializeMiddlewares() {
    this.app.use(
      session({
        secret: SECRET_KEY || "SECRET_KEY",
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 20 * 60 * 1000,
          secure: this.env === "production",
          httpOnly: true,
          sameSite: "lax",
        },
      })
    );
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }))
  }

  private initializeRoutes() {
    this.app.use("/api", new AuthRoute().router);
    this.app.use("/api", new ShopRoute().router);
    this.app.use("/api", new ProductRoute().router);
    this.app.use("/api", new CartRoute().router)
    this.app.use("/api", new TransationRoute().router)
    this.app.use("/api", new AddressRoute().router)
    this.app.use("/api", new ChatRoute().router)
    this.app.use(ErrorHandling);
  }

  private initializeWebsocket() {
    this.httpServer = createServer(this.app)
    Websocket.getInstance(this.httpServer);
    new ChatSocket()
  }
}

const app = new App();
app.listen();
