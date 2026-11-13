import axios from "axios";

export let roomMap : Map<string, Room> = new Map();
export let playerSet : Set<string> = new Set();
export let randomizedPokemonRoom : Map<string, Pokemon[]> = new Map();


export type Pokemon = {
    id : number,
    name : string,
    sprite : string
    types : string[]
}

export interface Player {
    playerId ?: string,
    playerName ?: string,
    turn : boolean
    secretPokemon ?: string
    action : "INITIAL" | "SELECTION" | "CHOICE" | "OPPONENT";
}

export interface Room {
    roomId : string,
    players ?: [Player, Player],
    currentPlayerId ?: string,
    pokeList ?: Pokemon[]
}


export function setRoomId(){
    const createdId = createId();
    while(roomMap.has(createdId)){
        const createdId = createId();
        if(!roomMap.has(createdId)){
            let room = {
                roomId : createdId,
            }
            roomMap.set(createdId, room);
            break;
        }
    }
    return createdId;
}

export function setPlayerId(){
    const createdId = createId();
    while(playerSet.has(createdId)){
        const createdId = createId();
        if(!playerSet.has(createdId)){
            playerSet.add(createdId);
            break;
        }
    }
    return createdId;  
}

function createId(){
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let createdId = "";
    for(let i = 0; i < 6; i++){
        createdId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return createdId;
}


    export async function setRoomService(playerName: string){
        let roomId = setRoomId();
        let playerId = setPlayerId(); 

        const player1 : Player = {    
            playerId: playerId,
            playerName: playerName,
            turn : true,
            action: "INITIAL" 
        }
        const player2 : Player = {
            turn : false,
            action: "OPPONENT"
        }
        const room: Room = {
            roomId,
            players: [player1, player2],
            currentPlayerId: playerId,
            pokeList: await generateRandomPokemon()
        };

        roomMap.set(roomId, room);

        return room;
    }


export function joinGameService(roomId : string, playerName: string){
    if(roomMap.has(roomId)){
        let playerId = setPlayerId();
        const player2 : Player = {playerId : playerId, playerName : playerName, turn: false, action: "OPPONENT"};
        let room = roomMap.get(roomId);
        room!.roomId = roomId;
        if(room){
            room.players = [room.players![0] , player2] 
            room.currentPlayerId = playerId;
        }
        return room;
    }
}




export function endGameCondition(room : Room, finalPkmn : Pokemon){
    if(roomMap.has(room.roomId)){
        let players = room!.players!;
        const checkSecretPokemon = Boolean(players[0].secretPokemon && players[1].secretPokemon);

        if(players[0].turn === true && checkSecretPokemon){
            if(players[1].secretPokemon === finalPkmn.name){
                return `Player 1 ${players[0].playerName} Wins`
            }else if(players[1].secretPokemon !== finalPkmn.name){
                return `Player 2 ${players[1].playerName} Wins`;
            }
        }else if(players[0].turn === false && checkSecretPokemon){
            if(players[0].secretPokemon === finalPkmn.name){
                return `Player 2 ${players[1].playerName} Wins`
            }else if(players[0].secretPokemon !== finalPkmn.name){
                return `Player 1 ${players[0].playerName} Wins`;
            }
        }
    }
}

export function setSecretPokemon(roomId : string, secret: string){
    if(roomMap.has(roomId)){
        let room = roomMap.get(roomId);
        let player = room!.players!;
        (player[0].turn === true && !player[0].secretPokemon) ? player[0].secretPokemon = secret : "";
        (player[0].turn === false && !player[1].secretPokemon) ? player[1].secretPokemon = secret : "";
        room = setTurns(room!);

        return room;
    }
}

export function setTurns(room : Room){
    let players = room!.players!;
    if(players[0].turn === true){
        if(players[1].action === "OPPONENT") players[1].action = "INITIAL";
        players[0].action = "SELECTION";

        players[0].turn = false;
        players[1].turn = true;
        room!.currentPlayerId = players[1].playerId;
        console.log("Player2 Turn");   
    }else{
        players[1].action = "SELECTION";
        players[0].turn = true;
        players[1].turn = false;
        room!.currentPlayerId = players[0].playerId;
        console.log("Player1 Turn");
    }
    return room;
}


async function  generateRandomPokemon(){
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