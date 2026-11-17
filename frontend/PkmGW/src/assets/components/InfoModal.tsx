import "../css/InfoModal.css"

interface props {
    onClose : () => void;
}

function InfoModal({onClose} : props){
    return(
        <>
            <div className="backdrop-modal">
                <div className="info-modal">
                    <div className="info-title">
                        <h1>Notice to users!</h1>
                        <div className="info-close-modal">
                            <button type="button" onClick={onClose}>&times;</button>
                        </div>
                    </div>
                    <div className="modal-text">
                        <div>
                            <h1>⚠️ Due to the Limitations of Render (where the backend is uploaded), it will take at least 1 minute to start the backend⚠️</h1>
                        </div>
                        <button onClick={onClose}>Close </button>
                    </div>
                </div>
            </div>
        </>
    )
}





export default InfoModal;