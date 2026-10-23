import {Router} from "express";
import {getRandomizedPokemon} from "../controllers/gameController.ts"

export const randomizedRoute = Router();

randomizedRoute.get("/getRandomizedPokemon", getRandomizedPokemon);
