import type { NextFunction, Request, Response } from "express";
import {type Room, players ,endGameCondition, setTurns, setGame, setSecretPokemon, generateRandomPokemon } from '../services/gameService.ts';




export const getRandomizedPokemon = async (req: Request, res: Response, next : NextFunction) =>{
    try{
        const pokemon = await generateRandomPokemon();
        res.status(200).json(pokemon);
    }catch(error){
        next(error);
    }
};

export const setBoardGame = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        setGame();
        console.log(players);
        res.status(200).json(players);
    }catch(error){
        next(error);
    }
};


export const setSecret = async (req: Request, res: Response, next: NextFunction) => {
    try{
        console.log(req.body.name);
        let player = setSecretPokemon(players, req.body.name);
        res.status(200).json(player);
    }catch(error){
        next(error);
    }
}

export const endTurn = (req: Request, res: Response, next: NextFunction) =>{
    try{
        let player = setTurns(players);
        console.log(player);
        res.status(200).json(player);
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


