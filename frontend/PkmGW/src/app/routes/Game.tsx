import GameRoom from "../../assets/components/GameRoom";
import { useParams } from "react-router";


export default function Game(){
    const params  = useParams();

    if (!params.roomId) {
        return <p>Room ID is missing.</p>;
    }

    return <GameRoom roomId={params.roomId}></GameRoom>
}