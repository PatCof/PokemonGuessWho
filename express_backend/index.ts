import express, {type Express} from 'express';
import cors from 'cors';
import {randomizedRoute} from "./routes/randomizedRoute.ts"
import {secretRoute} from "./routes/secretRoute.ts";
import {playerRoute} from "./routes/playerRoute.ts";
import {turnRoute} from "./routes/turnRoute.ts";
import { winnerRoute } from './routes/winnerRoute.ts';
const app :Express = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

app.use("/", randomizedRoute);

app.use("/", secretRoute);

app.use("/getPlayers", playerRoute);

app.use("/endTurn", turnRoute);

app.use("/sendAnswer", winnerRoute);

app.listen(port, () =>{
    console.log(`Listening to port ${port}`);
});