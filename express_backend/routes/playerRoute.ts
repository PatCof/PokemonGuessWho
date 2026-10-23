import {Router} from "express";
import { setBoardGame } from "../controllers/gameController.ts";

export const playerRoute = Router();

playerRoute.get("/", setBoardGame);


