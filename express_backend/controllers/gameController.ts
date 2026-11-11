import type { NextFunction, Request, Response } from "express";
import {endGameCondition, setTurns, setSecretPokemon, setRoomService, joinGameService } from '../services/gameService.ts';


export const setBoardGame = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        let room = await setRoomService(req.body.playerName);
        res.status(200).json(room);
    }catch(error){
        next(error);
    }
};

export const joinGame = async(req: Request, res: Response, next: NextFunction) => {
    try{
        let room = joinGameService(req.body.roomId, req.body.playerName);
        res.status(200).json(room);
    }catch(error){
        next(error);
    }
}


export const setSecret = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let player = setSecretPokemon(req.body.roomId, req.body.name);
        res.status(200).json(player);
    }catch(error){
        next(error);
    }
}

export const endTurn = (req: Request, res: Response, next: NextFunction) =>{
    try{
        let room = setTurns(req.body.room);
        res.status(200).json(room);
    }catch(error){
        next(error);
    }
}


export const endGame = (req : Request, res: Response, next: NextFunction) => {
    try{
        let winner = endGameCondition(req.body.finalPkmn, req.body.room);
        console.log(winner);
        res.status(200).json(winner);
    }catch(error){
        next(error);
    }
}


