import {Router} from "express";
import { endGame } from "../controllers/gameController.ts";

export const winnerRoute = Router();

winnerRoute.post("/", endGame);