import '.././css/GameRoom.css';
import '../css/AnswerModal.css'
import GameCard from '../components/GameCard';
import { useRef ,useState, useEffect } from 'react';
import AnswerModal from './AnswerModal';
import SecretSelectionModal from './SecretSelectionModal';
import OutcomeModal from './OutcomeModal';
import { useLocation, useNavigate } from "react-router";
import { createSocket } from '../../socket';
import { PulseLoader } from 'react-spinners';
import { type KeyboardEvent } from 'react';
interface Pokemon {
    id : number,
    name : string,
    sprite : string
    types : string[]
}

type Action = "INITIAL" | "SELECTION" | "CHOICE" | "OPPONENT";


export interface Player {
    playerId ?: string,
    playerName ?: string,
    turn ?: boolean
    secretPokemon ?: string
    action : "INITIAL" | "SELECTION" | "CHOICE" | "OPPONENT";
}

export interface Room {
    roomId : string,
    players ?: [Player, Player],
    pokeList ?: Pokemon[],
    currentPlayerId ?: string
}

interface Message {
    roomId: string,
    index : number,
    activePlayer :  string,
    msg : string
}
interface RoomId{roomId : string};
const socket = createSocket();

function GameRoom({roomId} : RoomId){
    const location = useLocation();
    const currentRoom = location.state?.room;
    const [room, setRoom] = useState<Room>(currentRoom);    
    const [currentPlayer,setCurrentPlayer] = useState<string>("");

    const [pokemon, setPokemon] = useState<Pokemon[] | null>(null);
    const [player1, setPlayer1] = useState<string>("");
    const [player2, setPlayer2] = useState<string>("");

    const [isSecretSelectionOpen, setIsSecretSelectionOpen] = useState<boolean>(true);
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
    const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState<boolean>(false);
    const [finalPkmn, setFinalPkmn] = useState<Pokemon>();
    const [action, setAction] = useState<Action>("INITIAL");
    const [remaining, setRemaining] = useState<number>(24);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [msgCounter, setMsgCounter] = useState<number>(0);
    const [winner, setWinner] = useState<string>("");

    const [toggledP1Cards, setToggledP1Cards] = useState<number[]>([]);

    const selectButtonRef = useRef<HTMLButtonElement>(null);
    const finalButtonRef = useRef<HTMLButtonElement>(null);
    const endButtonRef = useRef<HTMLButtonElement>(null);
    const yesButtonRef = useRef<HTMLButtonElement>(null);
    const noButtonRef = useRef<HTMLButtonElement>(null);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const anchorRef = useRef<HTMLDivElement>(null);

    const [isSelectEnabled, setIsSelectEnabled] = useState<boolean>(true);
    const [isButtonEnabled, setButtonEnabled] = useState<boolean>(true);
    const [isFinalEnabled, setIsFinalEnabled] = useState<boolean>(true);

    const disableButtons = () =>{
        setIsSelectEnabled(true);
        setButtonEnabled(true);
        setIsFinalEnabled(true);
    }

    const sendAnswer = () =>{
        const pokemonData = {
            finalPkmn: finalPkmn,
            room: room
        }
        socket.emit("final_answer", pokemonData);
    };

    const endTurn = () =>{
        setAction("SELECTION");
        socket.emit("end_turn", room);
    };

    const sendPokemonFunc = (name : string, room : Room)=>{
        const pokemonData = {
            name: name,
            room: room
        }
        socket.emit("send_pokemon", pokemonData);

    };

    const generateMessage = (source: string) =>{
            let activePlay : string = currentPlayer;
            switch(source){
                case "SEND":
                    return {
                         roomId: roomId,
                         index : msgCounter,
                         activePlayer : activePlay,
                         msg : inputValue
                    }
                break;
                case "YES":
                    return {
                        roomId: roomId,
                        index : msgCounter,
                        activePlayer : activePlay,
                        msg : "Yes"
                    }

                case "NO":
                    return {
                        roomId: roomId,
                        index : msgCounter,
                        activePlayer : activePlay,
                        msg : "No"
                    }
                
                default:
                    throw new Error(`Invalid message source: ${source}`);
            }
    }

    const sendMessage = (source: string) =>{
        if((source === "SEND" && inputValue.trim() !== "") || source === "YES" || source === "NO"){
            let newMsg = generateMessage(source);
            setMsgCounter(msgCounter => msgCounter + 1);        
            setInputValue("");
            setMessages(messages => [...messages, newMsg]);

            socket.emit('chat_message', newMsg);
        }
    }


    useEffect(()=>{
        const textArea = textAreaRef.current;
        if(textArea){
            textArea.style.height = "auto";
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    },[inputValue]);

    useEffect(()=>{

        socket.on("connect", () => {

        });

        socket.on("joined_room", (data)=>{
            setRoom(data);
            setPlayer1(data.players![0].playerName);
            setPlayer2(data.players![1].playerName);
        });

        socket.on("receive_message", (data)=>{
            console.log(data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on("connection_err", (err)=>{
            console.error(err.message);
        });

        socket.on("receive_pokemon", (pokemonData)=>{
            setRoom(pokemonData);
        });

        socket.on("receive_turn_change", (room)=>{
            setRoom(room);
        });

        socket.on("receive_final", (data)=>{
            console.log(data);
            setWinner(data);
            setIsAnswerModalOpen(false);
            setIsOutcomeModalOpen(true);
            console.log(data);
        });

        socket.connect();


        return () => {
            socket.off("connect");
            socket.off("receive_message");
            socket.off("connection_err");
            socket.off("joined_room");
            socket.off("receive_pokemon");
            socket.off("receive_turn_change");
            socket.off("receive_final");
            socket.disconnect();
        }
    }, []);

    useEffect(()=>{
        socket.emit("join_room", room);
    }, [currentRoom!.roomId]);

    useEffect(()=>{
        setPokemon(room.pokeList!);
        setCurrentPlayer(room.currentPlayerId!);
    },[]);

    useEffect(()=>{
        disableButtons();
    },[]);

    useEffect(()=>{
        disableButtons();

        if (!room?.players) return;
        const bothSelected =
        room.players[0].secretPokemon != null &&
        room.players[1].secretPokemon != null;

        if (!bothSelected) return;

        if (room!.currentPlayerId === currentPlayer) {
            setIsSelectEnabled(true);
            setButtonEnabled(false);
            setIsFinalEnabled(false);
        }
    
    },[room, room!.currentPlayerId]);

    useEffect(()=>{
        anchorRef.current?.scrollIntoView({ behavior: "smooth" });
    },[messages]);

    function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault();
        
      }
    }

    function selectPokemon(index:number, action: Action, name: string, room: Room, sprite: string, types: string[]){
        switch (action){
        case "INITIAL":
            const player = room.players?.find(
                p => p.playerId === currentPlayer
            );

            if (!player || player.action !== "INITIAL") return;

            sendPokemonFunc(name, room);
            setAction("SELECTION");
            break;


        case "SELECTION":
            // if(room!.players![0].turn === true){
                if(toggledP1Cards.find(item => item === index)){
                    setToggledP1Cards(toggledP1Cards.filter(i => i !== index));
                    setRemaining(remaining => remaining + 1);
                }else{
                    setToggledP1Cards([...toggledP1Cards, index]);
                    setRemaining(remaining => remaining - 1);
                }   

            break;
        
        case "CHOICE":
            let pkmn :Pokemon = {
                id: index,
                name: name,
                sprite: sprite,
                types : types
            }
            setFinalPkmn(pkmn);
            setIsAnswerModalOpen(true);
            break;
        
        case "OPPONENT":
            break;
        }

    }
    const navigate = useNavigate();

    const closeAnswerModal = () => setIsAnswerModalOpen(false);
    const closeSecretSelectionModal = () => setIsSecretSelectionOpen(false);
    const closeOutcomeModal = () => {setIsOutcomeModalOpen(false); navigate("/");};

    return(
    <>
    { room!.players![1].playerId === undefined
        ?
        <div>
            <div className="backdrop-modal">
            <div className="modal">  
                <div className="modal-text">
                    <h1>Waiting for Player 2:</h1>
                    <h2 className="modal-text-id">Your Room Id: </h2>
                    <h2>{roomId}</h2>
                    <PulseLoader></PulseLoader>
                </div>
            </div>
            </div>
        </div>
        :
        <div className="main-game-room">
            {isOutcomeModalOpen && <OutcomeModal onClose={closeOutcomeModal} winner={winner}></OutcomeModal>}
            {isSecretSelectionOpen && <SecretSelectionModal onClose={closeSecretSelectionModal}></SecretSelectionModal>}
            {isAnswerModalOpen && <AnswerModal onSend={sendAnswer} onClose={closeAnswerModal} pkmn={finalPkmn}></AnswerModal>}
            <div className="text-div">
                <div className="nav-bar">
                    <a>Leave Match</a>
                </div>
            </div>
            { room && room.players && room.players.length >= 1 ?
            <div className={room.players![0].turn === true ? "player1-div vs-div" : "player2-div vs-div" }>
                <div className={room.players![0].turn === true ? "player1 left-glow" : "player1"}>
                    {currentPlayer === room.players![0].playerId ? 
                        <h1>{room.players![0].turn === true ? `${player1}'s Turn (You)` : `${player1} (You)`}</h1>
                    :
                        <h1>{room.players![0].turn === true ? `${player1}'s Turn` : `${player1}`}</h1>
                    }
                    
                    
                </div>
                <div className={room.players![0].turn === false ? "player2 right-glow" : "player2"}>
                    { currentPlayer === room.players![1].playerId 
                        ?
                        <h1>{room.players![0].turn === false ? `${player2}'s Turn (You)` : `${player2} (You)`}</h1>
                        :
                        <h1>{room.players![0].turn === false ? `${player2}'s Turn` : `${player2}`}</h1>
                    }
               </div>
            </div>
            :
            <div></div>
            }
            <div className="game-components-div">
                <div className="game-board">
                    <div className="info-div">
                        <div className="chosen-pkmn-div">
                         {room?.players && room.players.length >= 2 ?
                          <h2 className="chosen-pkmn-text">Your Secret Pokemon: {currentPlayer === room.players![0].playerId ? room.players![0].secretPokemon : room.players![1].secretPokemon} </h2>
                         : <div></div>}
                        <div className="remaining-pkmn-div">
                            <p>{remaining}/24</p>
                        </div>
                        </div>
                    </div>
                    <div className="board-div">
                        {/* {pokemon && pokemon.map((pk, index)=><GameCard name={pk.name} sprite={pk.sprite} key={index} index={pk.id} action={action} types={pk.types} room={room} onClick={selectPokemon} isP1Toggled={toggledP1Cards} isP2Toggled={toggledP2Cards}></GameCard>)} */}
                        {pokemon && pokemon.map((pk, index)=><GameCard name={pk.name} sprite={pk.sprite} key={index} index={pk.id} action={action} types={pk.types} room={room} onClick={selectPokemon} isP1Toggled={toggledP1Cards}></GameCard>)}

                    </div>  
                    <div className="buttons-div">
                        <button ref={selectButtonRef} onClick={()=>{setAction("SELECTION") ; setIsSelectEnabled(true); setIsFinalEnabled(false);}} disabled={isSelectEnabled}>Select/Deselect Pokemon</button>
                        <button ref={finalButtonRef} onClick={()=>{setAction("CHOICE")  ; setIsSelectEnabled(false); setIsFinalEnabled(true);}} disabled={isFinalEnabled}>Select Final Answer</button>
                        <button ref={endButtonRef} onClick={()=>{endTurn()}} disabled={isButtonEnabled}>End Turn</button>
                    </div>
                    <div className="whitespace"></div>
                </div>
                <div className="game-chat-div">
                    <div className="message-history">
                        <h1>Question History</h1>
                    </div>
                    <div className="message-div">
                        {messages && messages.length > 0 ?
                            messages.map((m, index) => 
                            <div className={ m.activePlayer === currentPlayer ? "activePlayer msgs" : "otherPlayer msgs"} key={index}>
                                {m.msg}
                            </div>
                        )
                        
                        : <div></div>}
                        <div className="anchor" ref={anchorRef}></div>
                    </div>
                    { action !== "OPPONENT" ?
                        <div className="message-input">
                            <textarea onKeyDown={(event) => {if(event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing){
                                event.preventDefault();
                                sendMessage("SEND");
                            }}} ref={textAreaRef} rows={1} cols={100} value={inputValue} onChange={(e) =>{setInputValue(e.target.value)}} placeholder='Enter Question'></textarea>
                            <button onClick={()=> sendMessage("SEND")}>Send</button>
                        </div>
                        :
                        <div className="answer-input">
                            <button ref={yesButtonRef} onClick={()=>sendMessage("YES")}>YES</button>
                            <button ref={noButtonRef} onClick={()=>sendMessage("NO")}>NO</button>
                        </div>
                    }
                </div>
            </div>
        </div>
        }    
    </>
    )
}


export default GameRoom;