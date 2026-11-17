import "../css/AnswerModal.css"

interface Pokemon {
    id : number,
    name : string,
    sprite : string
    types : string[]
}

interface Player {
    playerId ?: string,
    playerName ?: string,
    turn ?: boolean
    secretPokemon ?: string
    action : "INITIAL" | "SELECTION" | "CHOICE" | "OPPONENT";
}

interface Room {
    roomId : string,
    players ?: [Player, Player],
    pokeList ?: Pokemon[],
    currentPlayerId ?: string,
    turnCounter : number
}


interface props {
    onClose: ()=>void;
    winner: string;
    finalPkmn ?: Pokemon,
    p1Pokemon ?: Pokemon,
    p2Pokemon ?: Pokemon,
    room: Room
}

function OutcomeModal({finalPkmn, winner, onClose, p1Pokemon, p2Pokemon, room} : props){
    return(
        <>
            <div className="backdrop-modal">
                <div className="selection-modal">
                    <div className="close-modal">
                        <button type="button" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-text">
                        <h1>
                            {winner}
                        </h1>
                        <div className="game-result">
                            <div className="p1-div">
                                <h2>{room.players![0].playerName} chose: </h2>
                                <img className="img-sprite" src={p1Pokemon?.sprite}></img>
                                <h3>{p1Pokemon?.name}</h3>
                            </div>
                            <div className="p2-div">
                                <h2>{room.players![1].playerName} chose: </h2>
                                <img className="img-sprite" src={p2Pokemon?.sprite}></img>
                                <h3>{p2Pokemon?.name}</h3>
                            </div>
                        </div>
                        
                        <div className="buttons-div">
                            <button onClick={onClose}>Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}





export default OutcomeModal