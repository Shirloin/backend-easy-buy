import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Server } from "socket.io";
import { NODE_ENV, ORIGIN } from "../config";

const WEBSOCKET_CORS = {
    origin: NODE_ENV === "production" ? ORIGIN : "*",
    methods: ["GET", "POST"],
}
export class Websocket extends Server {
    private static io: Websocket

    constructor(server: HttpServer | HttpsServer) {
        super(server, {
            cors: WEBSOCKET_CORS,
            transports: ["websocket"]
        })
    }

    public static getInstance(server?: HttpServer | HttpsServer): Websocket {
        if (!Websocket.io && server) {
            Websocket.io = new Websocket(server)
        }
        return Websocket.io
    }
}