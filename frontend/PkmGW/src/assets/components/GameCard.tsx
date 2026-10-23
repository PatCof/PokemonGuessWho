import '../css/GameCard.css';
import { useState } from 'react';

type Action = "INITIAL" | "SELECTION" | "CHOICE" | "OPPONENT";
interface Room {
    player : "Player1" | "Player2",
    turn : boolean,
    secretPokemon ?: string
}


interface props{
    name: string;
    index: number;
    action: Action;
    sprite: string;
    types: string[];
    room: Room[];
    isP1Toggled: number[];
    isP2Toggled: number[];
    onClick(index: Number, action : Action, name: String, room : Room[], sprite: string, types: string[]) : void;
}

function GameCard({name, index, action, sprite, types, room, onClick, isP1Toggled, isP2Toggled}: props){

    return(
        <>
            { room && room[0].turn === true && room[1].turn === false?
            <div onClick={()=>{onClick(index, action, name, room, sprite, types)}} className={!isP1Toggled.includes(index) ? "selected-main-card cards" : "deselected-main-card cards"}>
                <p className={!isP1Toggled.includes(index)? "selected-pkmn-name" : "deselected-pkmn-name"}>{name}</p>
                <div className="inner-card">
                    <img src={sprite}></img>
                    <div className="type-div">
                        {types.map((type, index)=>(<div className="type-cards" key={index}>{type}</div>))}
                    </div>
                </div>
            </div>

            :

            <div onClick={()=>{onClick(index, action, name, room, sprite, types)}} className={!isP2Toggled.includes(index) ? "selected-main-card cards" : "deselected-main-card cards"}>
                <p className={!isP2Toggled.includes(index) ? "selected-pkmn-name" : "deselected-pkmn-name"}>{name}</p>
                <div className="inner-card">
                    <img src={sprite}></img>
                    <div className="type-div">
                        {types.map((type, index)=>(<div className="type-cards" key={index}>{type}</div>))}
                    </div>
                </div>
            </div>
            }
        </>
    )
}


export default GameCard