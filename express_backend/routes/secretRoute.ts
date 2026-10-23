import {Router} from "express";
import {setSecret} from "../controllers/gameController.ts"

export const secretRoute = Router();

secretRoute.post("/", setSecret);
