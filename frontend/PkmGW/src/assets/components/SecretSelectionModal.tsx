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
                    <div className="modal-text">
                        <h2>
                            Select your Secret Pokemon by clicking on a Pokemon Card!
                        </h2>
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