import express from "express";
import cors from "cors";
import { connect, set } from "mongoose";
import { dbConnection } from "./database/index";
import { ORIGIN, CREDENTIALS, SECRET_KEY, NODE_ENV, PORT } from "./config/index";
import AuthRoute from "./routes/auth.route";
import ErrorHandling from "./error/index";
import ShopRoute from "./routes/shop.route";
import session from "express-session";
import ProductRoute from "./routes/product.route";
import CartRoute from "./routes/cart.route";
import TransationRoute from "./routes/transaction.route";
import AddressRoute from "./routes/address.route";
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import { Websocket } from "./websocket/websocket";
import ChatSocket from "./websocket/chat.socket";
import ChatRoute from "./routes/chat.route";
import ReviewRoute from "./routes/review.route";
class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  private server: any

  constructor() {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || "3000";

    this.connectToDatabase();
    this.initializeWebsocket()
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  public listen() {
    this.server.listen(this.port, () => {
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
    console.log(dbConnection.url)
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
    this.app.use("/api", new ReviewRoute().router)
    this.app.use(ErrorHandling);
  }

  private initializeWebsocket() {
    this.server = createHttpServer(this.app)
    Websocket.getInstance(this.server);
    new ChatSocket()
  }
}

const app = new App();
app.listen();
