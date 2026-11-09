import '.././css/GameRoom.css';
import GameCard from '../components/GameCard';
import { useRef ,useState, useEffect, useCallback } from 'react';
import AnswerModal from './AnswerModal';
import SecretSelectionModal from './SecretSelectionModal';
import axios from 'axios';
import OutcomeModal from './OutcomeModal';
import { useLocation, useParams } from "react-router";
import { createSocket } from '../../socket';

interface Pokemon {
    id : number,
    name : string,
    sprite : string
    types : string[]
}

export interface Player {
    playerId ?: string,
    playerName ?: string,
    turn ?: boolean
    secretPokemon ?: string
}

export interface Room {
    roomId : string,
    players ?: [Player, Player],
    turn ?: boolean,
    pokeList : Pokemon[]
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
    //const { roomIdValue } = roomId;
    const location = useLocation();
    const playerName = location.state?.playerName;
    const currentRoom = location.state?.room;
    const [room, setRoom] = useState<Room>(currentRoom);    

    const [currentPlayer,setCurrentPlayer] = useState(currentRoom.currentPlayerId);
    const [activePlayerId, setActivePlayerId] = useState<string>();

    const [pokemon, setPokemon] = useState<Pokemon[]>(room.pokeList);


    type Action = "INITIAL" | "SELECTION" | "CHOICE" | "OPPONENT";
    const [action, setAction] = useState<Action>("INITIAL");
    const [isSecretSelectionOpen, setIsSecretSelectionOpen] = useState<boolean>(true);
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
    const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState<boolean>(false);
    const [finalPkmn, setFinalPkmn] = useState<Pokemon>();
    const [isDisabled, setIsDisabled] = useState(false);
    const [remaining, setRemaining] = useState<number>(24);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [msgCounter, setMsgCounter] = useState<number>(0);
    const [winner, setWinner] = useState<string>("");

    const [toggledP1Cards, setToggledP1Cards] = useState<number[]>([]);
    const [toggledP2Cards, setToggledP2Cards] = useState<number[]>([]);

    const selectButtonRef = useRef<HTMLButtonElement>(null);
    const finalButtonRef = useRef<HTMLButtonElement>(null);
    const endButtonRef = useRef<HTMLButtonElement>(null);
    const yesButtonRef = useRef<HTMLButtonElement>(null);
    const noButtonRef = useRef<HTMLButtonElement>(null);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);


    const disableButtons = () =>{
        if(selectButtonRef.current) selectButtonRef.current.disabled = true;
        if(finalButtonRef.current) finalButtonRef.current.disabled = true;
        if(endButtonRef.current) endButtonRef.current.disabled = true;
        if(yesButtonRef.current) yesButtonRef.current.disabled = true;
        if(noButtonRef.current) noButtonRef.current.disabled = true;
    }

    const enableButtons = () =>{
        if(finalButtonRef.current) finalButtonRef.current.disabled = false;
        if(endButtonRef.current) endButtonRef.current.disabled = false;
        if(yesButtonRef.current) yesButtonRef.current.disabled = false;
        if(noButtonRef.current) noButtonRef.current.disabled = false;
    }


    const sendAnswer = async () =>{
        const response = await axios.post('http://localhost:3000/sendAnswer', {finalPkmn : finalPkmn, room: room});
        setWinner(response.data);
        setIsAnswerModalOpen(false);
        setIsOutcomeModalOpen(true);
        console.log(response.data);
    }

    const endTurn = async()=>{
        const response = await axios.post('http://localhost:3000/endTurn', {room: room});
        console.log(response.data);
        setRoom(response.data);
        //response.data[0].turn === true ? setActivePlayer(room!.players![0]) : setActivePlayer(room!.players![1]);
        action === "SELECTION" ? setAction("OPPONENT") : setAction("SELECTION");

    }

    const sendPokemonFunc = async(name : string, room : Room) =>{
        const response = await axios.post('http://localhost:3000', {name : name, players: room});
        console.log(response.data);
        setRoom(response.data);
    }; 


    // useEffect(()=>{
    //     const pokeData = async () =>{
    //         const pokemonList: Pokemon[] = await currentRoom.pokeList;
    //         setPokemon(pokemonList);
    //     }
    //     pokeData();
    // }, []);

    
    const generateMessage = (source: string) =>{
            let activePlay : string = currentPlayer;
            //room.players![0].turn === true ? activePlay = room.players![0].playerId!  : activePlay = room.players![1].playerId! ;
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


    useEffect(() =>{
        disableButtons();
    }, []);

    // useEffect(()=>{
    //     fetchPokemon();
    // },[fetchPokemon]);

    useEffect(()=>{
        const textArea = textAreaRef.current;
        if(textArea){
            textArea.style.height = "auto";
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    },[inputValue]);

    useEffect(()=>{

        socket.connect();

        socket.on("join_room", ()=>{
            socket.emit("join_room",roomId);
            
        });


        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        socket.on("receive_message", (data)=>{
            console.log(data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on("connection_err", (err)=>{
            console.error(err.message);
        });
        return () => {
            socket.off("connect");
            socket.off("receive_message");
            socket.off("connection_err");
            socket.disconnect();
        
        }
    }, []);


    function selectPokemon(index:number, action: Action, name: string, room: Room, sprite: string, types: string[]){
        switch (action){
        case "INITIAL":
            if(room!.players![0].secretPokemon !== undefined || room!.players![1].secretPokemon !== undefined){
                setAction("SELECTION");
                enableButtons();
            }
            console.log(room);
            sendPokemonFunc(name, room);

            break;

        case "SELECTION":
            if(room.players![0].turn === true  && room.players![1].turn === false){
                if(toggledP1Cards.find(item => item === index)){
                    setToggledP1Cards(toggledP1Cards.filter(i => i !== index));
                    setRemaining(remaining => remaining + 1);
                }else{
                    setToggledP1Cards([...toggledP1Cards, index]);
                    setRemaining(remaining => remaining - 1);
                }   
            }    
        
            else if(room.players![1].turn === true && room.players![0].turn === false){
                if(toggledP2Cards.find(item => item === index)){
                    setToggledP2Cards(toggledP2Cards.filter(i => i !== index));
                    setRemaining(remaining => remaining + 1);
                }else{
                    setToggledP2Cards([...toggledP2Cards, index]);
                    setRemaining(remaining => remaining - 1);
                }   
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

    const closeAnswerModal = () => setIsAnswerModalOpen(false);
    const closeSecretSelectionModal = () => setIsSecretSelectionOpen(false);
    const closeOutcomeModal = () => setIsOutcomeModalOpen(false);

    return(
    <>
        <div className="main-game-room">
            {isOutcomeModalOpen && <OutcomeModal onClose={closeOutcomeModal} winner={winner}></OutcomeModal>}
            {isSecretSelectionOpen && <SecretSelectionModal onClose={closeSecretSelectionModal}></SecretSelectionModal>}
            {isAnswerModalOpen && <AnswerModal onSend={sendAnswer} onClose={closeAnswerModal} pkmn={finalPkmn}></AnswerModal>}
            <div className="text-div">
                <div className="nav-bar">
                    <a>Leave Match</a>
                </div>
            </div>
            { room?.players && room.players.length >= 2 ?
            <div className={room.players![0].turn === true ? "player1-div vs-div" : "player2-div vs-div" }>
                <div className={room.players![0].turn === true ? "player1 left-glow" : "player1"}>
                    <h1>{room.players![0].turn === true ? `${room.players[0].playerName}'s Turn` : `${room.players[0].playerName}`}</h1>
                </div>
                <div className="vs">
                    <h1>V.S.</h1>
                </div>
                <div className={room.players![0].turn === false ? "player2 right-glow" : "player2"}>
                    <h1>{room.players![0].turn === false ? `${room.players[1].playerName}` : `${room.players[1].playerName}`}</h1>
                </div>
            </div>

            :
            <div></div>
            }
            <div className="game-components-div">
                <div className="game-board">
                    <div className="info-div">
                        <div className="chosen-pkmn-div">
                            {/* <h2>Your Secret Pokemon: {room && room[] ? room[0].secretPokemon : room[1].secretPokemon} </h2> */}
                         {room?.players && room.players.length >= 2 ?
                          <h2 className="chosen-pkmn-text">Your Secret Pokemon: {room.players![0].turn === true ? room.players![0].secretPokemon : room.players![1].secretPokemon} </h2>
                         : <div></div>}
                        <div className="remaining-pkmn-div">
                            <p>{remaining}/24</p>
                        </div>
                        </div>
                    </div>
                    <div className="board-div">
                        {pokemon.map((pk, index)=><GameCard name={pk.name} sprite={pk.sprite} key={index} index={pk.id} action={action} types={pk.types} room={room} onClick={selectPokemon} isP1Toggled={toggledP1Cards} isP2Toggled={toggledP2Cards}></GameCard>)}

                    </div>  
                    <div className="buttons-div">
                        <button ref={selectButtonRef} onClick={()=>{setAction("SELECTION") ; setIsDisabled(false)}} disabled={!isDisabled}>Select/Deselect Pokemon</button>
                        <button ref={finalButtonRef} onClick={()=>{setAction("CHOICE") ; setIsDisabled(true)}} disabled={isDisabled}>Select Final Answer</button>
                        <button ref={endButtonRef} onClick={()=>{endTurn()}}>End Turn</button>
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
                    </div>
                    { action !== "OPPONENT" ?
                        <div className="message-input">
                            <textarea ref={textAreaRef} rows={1} cols={100} value={inputValue} onChange={(e) =>{setInputValue(e.target.value)}} placeholder='Enter Question'></textarea>
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
    </>
    )
}


export default GameRoom;