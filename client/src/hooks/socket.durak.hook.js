import {useState, useCallback, useEffect} from 'react'
import io from "socket.io-client";

const ENDPOINT = 'localhost:5000';
let socket;

export const useDurakSocket = () => {

    const [game, setGame] = useState(null);
    const [userId, setUserId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [room, setRoom] = useState();
    const [gameStarted, setGameStarted] = useState(false);
    const [slots, setSlots] = useState([]);
    const [defending, setDefending] = useState();
    const [chosenCard, setChosenCard] = useState(null);
    const [countToTake, setCountToTake] = useState(0);
    const [countToNextTurn, setCountToNextTurn] = useState(0);
    const [clickedNextTurn, setClickedNextTurn] = useState(false);
    const [clickedTakeCards, setClickedTakeCards] = useState(false);

    const startGame_ = useCallback((roomId, userId) => {
        socket.emit('start game', {roomId, userId});
    }, [])

    const attack = (card) => {
        if (userId !== defending._id) {
            socket.emit("attack", {roomId, userId, card});
        }
    }

    const chooseCard = (card) => {
        if (chosenCard && chosenCard === card) {
            setChosenCard(null);
            return;
        }
        setChosenCard(card);
    }

    const defend = (key, topCard) => {
        if (userId === defending._id && chosenCard) {
            socket.emit("defend", {roomId, key, topCard});
        }
    }

    const takeBoardCards = () => {
        if (slots.length > 0) {
            setClickedTakeCards(true);
            socket.emit("take board cards", {roomId});
        }
    }

    const nextTurn = () => {
        setClickedNextTurn(true);
        socket.emit("next turn", {roomId});
    }

    const leaveRoom = () => {
        socket.emit("leave room", ({roomId, userId}));
        auth.leave();
        history.push('/profile');
    }

    const deleteRoom = () => {
        socket.emit("delete room", ({roomId, userId}));
    }

    useEffect(() => {
        socket = io(ENDPOINT, {path: "/room"});
    },[ENDPOINT])

    useEffect(() => {
        socket.on('game state', ({game}) => {
            setDefending(game.defendingPlayer);
            console.log(game);
            setGame(game);
            setSlots(game.board)
            setGameStarted(true);
            setCountToTake(game.countToTake);
            setCountToNextTurn(game.countToNextTurn);
            if (game.countToNextTurn === 0) { setClickedNextTurn(false); }
            if (game.countToTake === 0) { setClickedTakeCards(false); }
        });
    },[])

    return { game, startGame_ }
}