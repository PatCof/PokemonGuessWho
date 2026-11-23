import "../css/TurnPopup.css";

interface props {
    playerName : string | undefined;
}

function TurnPopup({playerName} : props){
    return(
        <>
        <div className="backdrop-modal">
            <div className="turn-modal">
                <div className="modal-text">
                    <h2>
                        {playerName}'s Turn
                    </h2>
                </div>
            </div>
        </div>
        </>
    )
}


export default  TurnPopup;