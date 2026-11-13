import type { NextFunction, Request, Response } from "express";
import {type Room, endGameCondition, setTurns, setSecretPokemon, setRoomService, joinGameService, type Pokemon } from '../services/gameService.ts';


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


export const endGame = (finalPkmn: Pokemon, room: Room) => {
    try{
        let winner = endGameCondition(room, finalPkmn);
        console.log(winner);
        return winner;
    }catch(error){
        console.log(error);
    }
}


