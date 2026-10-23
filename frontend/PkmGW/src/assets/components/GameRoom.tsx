import '.././css/GameRoom.css';
import GameCard from '../components/GameCard';
import { useRef ,useState, useEffect, useCallback } from 'react';
import AnswerModal from './AnswerModal';
import SecretSelectionModal from './SecretSelectionModal';
import axios from 'axios';
import OutcomeModal from './OutcomeModal';

type Pokemon = {
    id : number,
    name : string,
    sprite : string
    types : string[]
}

interface Room {
    player : "Player1" | "Player2",
    turn : boolean,
    secretPokemon ?: string
}

type Message = {
    index : number,
    activePlayer :  "Player1" | "Player2",
    msg : string
}

function GameRoom(){
    type Action = "INITIAL" | "SELECTION" | "CHOICE" | "OPPONENT";
    const [action, setAction] = useState<Action>("INITIAL");
    const [isSecretSelectionOpen, setIsSecretSelectionOpen] = useState<boolean>(true);
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
    const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState<boolean>(false);
    const [finalPkmn, setFinalPkmn] = useState<Pokemon>();
    const [selectedPkmn, setSelectedPkmn] = useState<string>("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [remaining, setRemaining] = useState<number>(24);
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [room, setRoom] = useState<Room[]>([]);    
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [msgCounter, setMsgCounter] = useState<number>(0);
    const [activePlayer, setActivePlayer] = useState<string>("");
    const [winner, setWinner] = useState<string>("");

    const [toggledP1Cards, setToggledP1Cards] = useState<number[]>([]);
    const [toggledP2Cards, setToggledP2Cards] = useState<number[]>([]);



    const textAreaRef = useRef<HTMLTextAreaElement>(null);


    const getPlayers = async()=>{
        const response  = await axios.get('http://localhost:3000/getPlayers');
        setRoom(response.data);
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
        response.data[0].turn === true ? setActivePlayer(room[0].player) : setActivePlayer(room[1].player);
    }

    const sendPokemonFunc = async(name : string, players : Room[]) =>{
        const response = await axios.post('http://localhost:3000', {name : name, players: players});
        console.log(response.data);
        setRoom(response.data);
    }; 

    const fetchPokemon = useCallback(async () =>{
        try{
            const response = await axios.get('http://localhost:3000/getRandomizedPokemon');
            setPokemon(response.data);
        }catch (error){
            console.error("Error found! Data was not sent", error);
        }
    }, []);



    const sendMessage = () =>{
        if(inputValue !== ""){
            let activePlay : "Player1" | "Player2" | ""  = "";
            room[0].turn === true ? activePlay = "Player1"  : activePlay = "Player2" ;

            let newMsg : Message = {
                index : msgCounter,
                activePlayer : activePlay,
                msg : inputValue
            }

            setMsgCounter(msgCounter => msgCounter + 1);        
            setInputValue("");
            setMessages([...messages, newMsg]);
        }
    }


    useEffect(() =>{
        getPlayers();
    }, []);

    useEffect(()=>{
        fetchPokemon();
    },[fetchPokemon]);

    useEffect(()=>{
        const textArea = textAreaRef.current;
        if(textArea){
            textArea.style.height = "auto";
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    },[inputValue]);

    function selectPokemon(index:number, action: Action, name: string, room: Room[], sprite: string, types: string[]){
        switch (action){
        case "INITIAL":
            if(room[0].secretPokemon !== undefined || room[1].secretPokemon !== undefined){
                setAction("SELECTION");
            }
            setSelectedPkmn(name);

            sendPokemonFunc(name, room);
            break;

        case "SELECTION":
            if(room[0].turn === true  && room[1].turn === false){
                if(toggledP1Cards.find(item => item === index)){
                    setToggledP1Cards(toggledP1Cards.filter(i => i !== index));
                    setRemaining(remaining => remaining + 1);
                }else{
                    setToggledP1Cards([...toggledP1Cards, index]);
                    setRemaining(remaining => remaining - 1);
                                        console.log(name);

                }   
            }    
        
            else if(room[1].turn === true && room[0].turn === false){
                if(toggledP2Cards.find(item => item === index)){
                    setToggledP2Cards(toggledP2Cards.filter(i => i !== index));
                    setRemaining(remaining => remaining + 1);
                    console.log(name);
                }else{
                    setToggledP2Cards([...toggledP2Cards, index]);
                    setRemaining(remaining => remaining - 1);
                                    console.log(name);

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
            { room && room.length > 0  ?
            <div className={room[0].turn === true ? "player1-div vs-div" : "player2-div vs-div" }>
                <div className={room[0].turn === true ? "player1 left-glow" : "player1"}>
                    <h1>{room[0].turn === true ? "Player 1's Turn" : "Player 1"}</h1>
                </div>
                <div className="vs">
                    <h1>V.S.</h1>
                </div>
                <div className={room[0].turn === false ? "player2 right-glow" : "player2"}>
                    <h1>{room[0].turn === false ? "Player 2's Turn" : "Player 2"}</h1>
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
                         {room && room.length > 0 ? <h2 className="chosen-pkmn-text">Your Secret Pokemon: {room[0].turn === true ? room[0].secretPokemon : room[1].secretPokemon} </h2>
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
                        <button onClick={()=>{setAction("SELECTION") ; setIsDisabled(false)}} disabled={!isDisabled}>Select/Deselect Pokemon</button>
                        <button onClick={()=>{setAction("CHOICE") ; setIsDisabled(true)}} disabled={isDisabled}>Select Final Answer</button>
                        <button onClick={()=>{endTurn()}}>End Turn 👁️🫦👁️</button>
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
                            <div className={ m.activePlayer === activePlayer ? "activePlayer msgs" : "otherPlayer msgs"} key={index}>
                                {m.msg}
                            </div>
                        )
                        : <div></div>}
                    </div>
                    <div className="message-input">
                        <textarea ref={textAreaRef} rows={1} cols={100} value={inputValue} onChange={(e) =>{setInputValue(e.target.value)}} placeholder='Enter Question'></textarea>
                        <button onClick={()=> sendMessage()}>Send</button>
                    </div>
                </div>
            </div>
        </div>    
    </>
    )
}


export default GameRoom;