import "../css/AnswerModal.css"

type Pokemon = {
    id : number,
    name : string,
    sprite : string
    types : string[]
}

interface props {
    pkmn: Pokemon | undefined;
    onClose: ()=>void;
    onSend: ()=> void;
}

function AnswerModal({pkmn , onClose, onSend} : props){
    return(
        <>
            <div className="backdrop-modal">
                <div className="modal">
                    <div className="close-modal">
                        <button type="button" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-text">
                        <h1>
                            Send {pkmn ? pkmn.name : ""} as Final Answer?
                        </h1>
                        <div className="sprite-div">
                            <img className="img-sprite" src={pkmn ? pkmn.sprite : ""}></img>
                        </div>
                        <div className="buttons-div">
                            <button onClick={onSend}>Send</button>
                            <button onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}





export default AnswerModal