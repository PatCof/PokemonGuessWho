import {Router} from "express";
import { endTurn } from "../controllers/gameController.ts";

export const turnRoute = Router();

turnRoute.post("/", endTurn);