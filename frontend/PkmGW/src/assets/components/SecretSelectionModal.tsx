import "../css/SecretModal.css";

interface props {
    onClose : ()=> void;
}

function SecretSelectionModal({onClose} : props){
    return(
        <>
        <div className="backdrop-modal">
                <div className="modal">
                    <div className="title">
                        <h1>Tutorial:</h1>
                        <div className="close-modal">
                            <button type="button" onClick={onClose}>&times;</button>
                        </div>
                    </div>
                    <div className="secret-modal-text">
                        <h3>
                            1. Once the board loads, Players take turns choosing their Secret pokemon by pressing on a Pokemon Card. 
                        </h3>
                        <h3>
                            2. The game will start with Players asking one Yes/No question and toggling Pokemon that does not fit that question. 
                        </h3>
                        <h3>
                            3. After their turn, Press the "End Turn" button to proceed with the next Player
                        </h3>
                        <h3>
                            4. Once a Player thinks they know their opponent's Secret Pokemon, they can press "Select Final Pokemon" button and select their final answer.
                        </h3>
                        <h3>
                            5. Sending the Final Answer ends the game and a Winner will be chosen based on the Player's answer.
                        </h3>
                        <div className="buttons-div">
                            <button onClick={onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default  SecretSelectionModal;