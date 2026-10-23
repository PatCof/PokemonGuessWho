import axios from "axios";

// export let secretPokemon : string = "";
// export interface Player{
//     roomId ?: number,
//     name ?: string,
//     secretPokemon : string;
// };

export type Pokemon = {
    id : number,
    name : string,
    sprite : string
    types : string[]
}


export interface Room {
    player : "Player1" | "Player2",
    turn : boolean,
    secretPokemon ?: string
}

export let players : Room[];


export function setGame(){
    const player1 : Room = {player : "Player1", turn: true};
    const player2 : Room = {player : "Player2", turn: false};
    players = [player1, player2];
    return players;
}

export function endGameCondition(finalPkmn : Pokemon, players : Room[]){
    if(players[0].turn === true && players[1].turn === false && players[0].secretPokemon && players[1].secretPokemon){
        if(players[1].secretPokemon === finalPkmn.name){
            return "Player 1 Wins";
        }
        return "Player 2 Wins"
    }else if(players[0].turn === false && players[1].turn === true && players[0].secretPokemon && players[1].secretPokemon){
        if(players[0].secretPokemon === finalPkmn.name){
            return "Player 2 Wins";
        }
        return "Player 1 Wins";
    }
}

export function setSecretPokemon(players : Room[], secret: string){
    (players[0].turn === true && players[1].turn === false && !players[0].secretPokemon) ? players[0].secretPokemon = secret : "";
    (players[0].turn === false && players[1].turn === true && !players[1].secretPokemon) ? players[1].secretPokemon = secret : "";
    
    setTurns(players);
    return players;
}

export function setTurns(players : Room[]){
    if(players[0].turn === true && players[1].turn === false ){
        players[0].turn = false;
        players[1].turn = true;
        console.log("Player2 Turn");   
    }else{
        // simulateP2(players); 
        players[0].turn = true;
        players[1].turn = false;
        console.log("Player1 Turn");
    }
    console.log(players);
    return players;
}

// export function simulateP2(players : Room[]){
//     for(let i = 10; i > 0; i--){
//           console.log(i);
//     }
// }


export async function  generateRandomPokemon(){
    let randomizedIds = new Set();

    while(randomizedIds.size < 24){
        let randomId = Math.floor(Math.random() * 1025) + 1;
        randomizedIds.add(randomId);
    }
 const randomizedRequests = Array.from(randomizedIds).map(async(id) => await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`));
    const responses = await Promise.all(randomizedRequests);
    const pokemonData = responses.map((res)=>({
        id: res.data.id,
        name: res.data.name.toUpperCase(),
        types: res.data.types.map((type: { type: { name: string } }) => type.type.name),
        sprite: res.data.sprites.front_default
    }));
    return pokemonData;
}