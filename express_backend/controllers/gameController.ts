import type { NextFunction, Request, Response } from "express";
import {type Room, endGameCondition, setTurns, setSecretPokemon, setRoomService, joinGameService } from '../services/gameService.ts';


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


export const setSecret =  (name : string, room : Room) => {
    try{
        const playerRoom = setSecretPokemon(room.roomId, name);
        return playerRoom;
    }catch(error){
        console.log(error);
    }
}

export const endTurn = (room : Room) =>{
    try{
        let updatedRoom = setTurns(room);
        return updatedRoom;
    }catch(error){
        console.log(error);
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


