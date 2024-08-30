import { Server as HttpServer } from "http";
import { Server } from "socket.io";

const WEBSOCKET_CORS = {
    origin: "*",
    methods: ["GET", "POST"]
}
export class Websocket extends Server {
    private static io: Websocket

    constructor(httpServer: HttpServer) {
        super(httpServer, {
            cors: WEBSOCKET_CORS
        })
    }

    public static getInstance(httpServer?: HttpServer): Websocket {
        if (!Websocket.io && httpServer) {
            Websocket.io = new Websocket(httpServer)
        }
        return Websocket.io
    }
}