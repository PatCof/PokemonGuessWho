import {Router} from "express";
import { joinGame } from "../controllers/gameController.ts";

export const roomRoute = Router();

roomRoute.post("/", joinGame);

