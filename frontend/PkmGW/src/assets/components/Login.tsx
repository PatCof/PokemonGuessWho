import "./../css/Login.css";
import axios from "axios";
import { redirect, useNavigate } from "react-router";
import { useState } from "react";

function Login(){
    const [playerName , setPlayerName] = useState<string>("");
    const [roomIdValue , setRoomId] = useState<string>("");

    const navigate = useNavigate();

    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setPlayerName(event.target.value);
    }

    const handleRoomChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setRoomId(event.target.value);
    }


    const createRoom =async() =>{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/createRoom`, {playerName : playerName});
        const roomId:string = response.data.roomId;
        console.log(response.data);
        navigate(`/Game/${roomId}`, {state: {room: response.data}});
    }

    const joinRoom = async () =>{
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
        <div className="main-page">
            <div className="outer-login">
                <h1>Pokemon Guess Who</h1>
                <input className="name-input" type="text" placeholder="Enter Display Name" value={playerName} onChange={handleChange}></input>
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
                    </div>
                </div>
            </div>
        </div>
    </>
);
}


export default Login