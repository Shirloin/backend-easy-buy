import { Websocket } from "./websocket";


export default class ChatSocket {

    constructor(io: Websocket) {
        this.connect(io)
    }
    private connect(io: Websocket) {
        io.on("connection", (socket) => {
            console.log('user is connected: ', socket.id)
            socket.on("join_room", (room) => {
                console.log(`User joined room: ${room}: ${socket.id}`);
                socket.join(room);
            });

            socket.on("leave_room", (room) => {
                console.log(`User left room: ${room}`);
                socket.leave(room);
            });

            socket.on("send_message", (data) => {
                console.log(`Message received: ${data.message} in room: ${data.room} : ${socket.id}`);
                socket.to(data.room).emit("receive_message", data.message);
            });

            socket.on('disconnect', () => {
                console.log('🔥: A user disconnected');
            });
        })
    }
}