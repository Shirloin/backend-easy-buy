import ChatController from "../controllers/chat.controller";
import { Websocket } from "./websocket";


export default class ChatSocket {

    private chatController = new ChatController()
    private io = Websocket.getInstance()
    constructor() {
        this.connect()
    }
    private connect() {
        this.io.on("connection", (socket) => {
            console.log('user is connected: ', socket.id)

            socket.on("connect_error", (error) => {
                console.error("WebSocket connection error:", error);
            });
            socket.on("join_room", (room) => {
                console.log(`User joined room: ${room}: ${socket.id}`);
                socket.join(room);
            });

            socket.on("leave_room", (room) => {
                console.log(`User left room: ${room}`);
                socket.leave(room);
            });

            socket.on('disconnect', () => {
                console.log('🔥: A user disconnected');
            });
            socket.on("error", (error) => {
                console.error("Socket error:", error);
            });
        })
    }
}