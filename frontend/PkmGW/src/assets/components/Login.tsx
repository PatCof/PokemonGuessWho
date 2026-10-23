import "./../css/Login.css";

function Login(){
    return(
    <>
        <div className="main-page">
            <div className="outer-login">
                <h1>Pokemon Guess Who</h1>
                <input className="name-input" type="text" placeholder="Enter Display Name"></input>
                <div className="inner-login">
                    <div className="room-creation">
                        <h2>Create a Room</h2>
                        <button>Create...</button>
                    </div>
                    <div className="vertical-bar"></div>
                    <div className="join-room">
                        <h2>Join Room</h2>
                        <input type="text" placeholder="Enter Room ID"></input>
                        <button>Join Room...</button>
                    </div>
                </div>
            </div>
        </div>
    </>
);
}


export default Login