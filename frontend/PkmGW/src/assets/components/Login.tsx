import "./../css/Login.css";
import axios from "axios";
import { redirect, useNavigate } from "react-router";
import { useState } from "react";
import InfoModal from "./InfoModal";
import sideImage from "../images/01.png";
function Login(){
    const [playerName , setPlayerName] = useState<string>("");
    const [roomIdValue , setRoomId] = useState<string>("");
    const [isInfoModalOpen, setInfoModalOpen] = useState<boolean>(true);
    const [isNameEmpty, setIsNameEmpty] = useState<boolean>(false);
    const [isIdEmpty, setIsIdEmpty] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setPlayerName(event.target.value);
    }

    const handleRoomChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setRoomId(event.target.value);
    }

    const onClose = () => {setInfoModalOpen(false)};

    const createRoom =async() =>{
        if (playerName.trim() === ""){
                setIsNameEmpty(true);
                return;
        }
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/createRoom`, {playerName : playerName});
        const roomId:string = response.data.roomId;
        navigate(`/Game/${roomId}`, {state: {room: response.data}});
    }

    const joinRoom = async () =>{
        if(playerName.trim() === "" && roomIdValue.trim() ===""){
            setIsNameEmpty(true);
            setIsIdEmpty(true);
            return;
        }

        if (playerName.trim() === ""){
            setIsNameEmpty(true);
            return;
        }
        if (roomIdValue.trim() === ""){
            setIsIdEmpty(true);
            return;
        }
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/joinRoom`, {roomId: roomIdValue, playerName: playerName});
        if(response.data !== undefined && response.data){
            navigate(`/Game/${roomIdValue}`, {state: {room: response.data}});
        }
        setRoomId("");
        setPlayerName("");
        redirect("/");
    }


    return(
    <>
        {isInfoModalOpen && <InfoModal onClose={onClose}></InfoModal>}
        <div className="main-page">
            <div className="outer-login">
            <div className="side-image">
                <img className="image" src={sideImage}></img>
            </div>
            <div className="login-side">
                <h1 className="title-text">Pokemon Guess Who</h1>
                <input className="name-input" type="text" placeholder="Enter Display Name" value={playerName} onChange={handleChange}></input>
                {isNameEmpty && <h2 className="name-text">Name should be filled!</h2>}
                <div className="inner-login">
                    <div className="room-creation">
                        <h2>Create a Room</h2>
                        <button onClick={createRoom}>Create</button>
                    </div>
                    <div className="vertical-bar"></div>
                    <div className="join-room">
                        <h2>Join Room</h2>
                        <div className="inner-join-room">
                            <input className="join-room-input" type="text" placeholder="Enter Room ID" value={roomIdValue} onChange={handleRoomChange}></input>
                            <button className="join-room-button" onClick={joinRoom}>Join</button>
                        </div>
                        {isIdEmpty && <h2 className="name-text">Room ID should be filled!</h2>}
                    </div>
                </div>
            </div>
            </div>
        </div>
    </>
);
}


export default Login