import express from "express";
import { createServer } from 'http'
import { Server } from "socket.io";
import cors from 'cors'
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}))
const port = 3000
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
})
io.on('connection', (socket) => {
    console.log("User Connected", socket.id);

    socket.on("message", ({room,message}) => {
        console.log("message", message)
        // io.emit("sabko",message,room)
        // socket.broadcast.emit('sirfKisiKo',message)
        socket.to(room).emit('recieve',message)
    })
    socket.on("set-room-name",(roomname)=>{
        socket.join(roomname);
        console.log(`User joined room ${roomname}`);
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
})
server.listen(port, () => {
    console.log("app is running on ", port)
})