import express, {type Express} from 'express';
import cors from 'cors';
import {secretRoute} from "./routes/secretRoute.ts";
import {playerRoute} from "./routes/playerRoute.ts";
import {turnRoute} from "./routes/turnRoute.ts";
import { winnerRoute } from './routes/winnerRoute.ts';
import { roomRoute } from './routes/roomRoute.ts';
import {Server} from "socket.io";
import { createServer } from 'node:http';
import {endGame, endTurn, setSecret} from './controllers/gameController.ts';


const app :Express = express();
const PORT = process.env.PORT || 3000;


const allowedOrigins = [
    "http://localhost:5173",
    "https://pokemon-guess-who-delta.vercel.app",
    "https://pokemon-guess-who-git-main-patrick-cofreros-projects.vercel.app",
    "https://pokemon-guess-g104h8v2w-patrick-cofreros-projects.vercel.app",
    "https://pokemon-guess-bnfr29ji9-patrick-cofreros-projects.vercel.app",
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


const server = createServer(app);

const io = new Server(server,{
  cors: {
    origin: ["http://localhost:5173",
    "https://pokemon-guess-who-delta.vercel.app",
    "https://pokemon-guess-who-git-main-patrick-cofreros-projects.vercel.app",
    "https://pokemon-guess-g104h8v2w-patrick-cofreros-projects.vercel.app",
    "https://pokemon-guess-bnfr29ji9-patrick-cofreros-projects.vercel.app",
],
    methods: ["GET", "POST"]
  }});



app.use("/", secretRoute);

app.use("/createRoom", playerRoute);

app.use("/endTurn", turnRoute);

app.use("/sendAnswer", winnerRoute);

app.use("/joinRoom", roomRoute);


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    socket.on("join_room",(room)=>{
        console.log("HELLO");
        console.log(room.roomId);
        socket.join(room.roomId);
        io.to(room.roomId).emit("joined_room", room);
    });

    socket.on("send_pokemon", (pokemonData) => {
        const playerRoom = setSecret(pokemonData.name, pokemonData.room);
        io.to(pokemonData.room.roomId).emit("receive_pokemon",playerRoom);
    });

    socket.on("end_turn", (room)=>{
        const turnChangedRoom = endTurn(room);
        io.to(room.roomId).emit("receive_turn_change", turnChangedRoom);
    });

    socket.on("final_answer", (pokemonData)=>{
        const finalAnswer = endGame(pokemonData.finalPkmn, pokemonData.room);
        io.to(pokemonData.room.roomId).emit("receive_final", finalAnswer);
    });
    
    socket.on("chat_message", (data) => {
        console.log("Received chat_message:", data);

        socket.to(data.roomId).emit("receive_message", data);

        console.log("Emitted receive_message");
    });

    socket.on("typing_start", (data) => {
        socket.to(data).emit("user_typing", {
            activePlayer: data.activePlayer
        });
    });

    socket.on("typing_stop", (data) => {
        socket.to(data).emit("user_stopped_typing");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(PORT, () =>{
    console.log(`Listening to port ${PORT}`);
});