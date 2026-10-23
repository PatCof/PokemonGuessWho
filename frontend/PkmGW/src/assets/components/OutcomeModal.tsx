import "../css/AnswerModal.css"

interface props {
    onClose: ()=>void;
    winner: string;
}

function OutcomeModal({winner, onClose} : props){
    return(
        <>
            <div className="backdrop-modal">
                <div className="modal">
                    <div className="close-modal">
                        <button type="button" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-text">
                        <h1>
                            {winner}
                        </h1>
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