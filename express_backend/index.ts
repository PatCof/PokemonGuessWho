import express, {type Express} from 'express';
import cors from 'cors';
// import {randomizedRoute} from "./routes/randomizedRoute.ts"
import {secretRoute} from "./routes/secretRoute.ts";
import {playerRoute} from "./routes/playerRoute.ts";
import {turnRoute} from "./routes/turnRoute.ts";
import { winnerRoute } from './routes/winnerRoute.ts';
import { roomRoute } from './routes/roomRoute.ts';
import {Server} from "socket.io";
import { createServer } from 'node:http';



const app :Express = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }});


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

// app.use("/", randomizedRoute);

app.use("/", secretRoute);

app.use("/createRoom", playerRoute);

app.use("/endTurn", turnRoute);

app.use("/sendAnswer", winnerRoute);

app.use("/joinRoom", roomRoute);


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    socket.on("join_room",(roomId)=>{
        console.log(roomId);
        socket.join(roomId);
    });

    socket.on("chat_message", (data) => {
        console.log("Received chat_message:", data);

        socket.to(data.roomId).emit("receive_message", data);

        console.log("Emitted receive_message");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(port, () =>{
    console.log(`Listening to port ${port}`);
});