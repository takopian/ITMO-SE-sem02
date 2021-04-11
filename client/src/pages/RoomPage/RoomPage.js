import React, {useContext, useState, useEffect} from "react";
import {AuthContext} from "../../context/AuthContext";
import io from 'socket.io-client';
import {Helmet} from 'react-helmet';
import Button from "react-bootstrap/Button";
import {Hand} from "./Hand";
import {Slots} from "./Slots";
import {useHistory} from "react-router-dom";

let socket;

export const RoomPage = () => {
    const ENDPOINT = 'localhost:5000';
    const auth = useContext(AuthContext);
    const history = useHistory();
    const [userId, setUserId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [room, setRoom] = useState();
    const [game, setGame] = useState();
    const [gameStarted, setGameStarted] = useState(false);
    const [slots, setSlots] = useState([]);
    const [defending, setDefending] = useState();
    const [chosenCard, setChosenCard] = useState(null);
    const [countToTake, setCountToTake] = useState(0);
    const [countToNextTurn, setCountToNextTurn] = useState(0);
    const [clickedNextTurn, setClickedNextTurn] = useState(false);
    const [clickedTakeCards, setClickedTakeCards] = useState(false);

    const startGame = () => {
        socket.emit('start game', {roomId, userId});
    }

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
        console.log(auth.userId, auth.roomId);
        socket = io(ENDPOINT, {path: "/room"});
        setRoomId(auth.roomId);
        setUserId(auth.userId);
        socket.emit('room info', { roomId: auth.roomId });

        return () => {}
    }, [ENDPOINT]);

    useEffect(() => {
        socket.on('info', ({room}) => {
            console.log(room);
            setRoom(room);
        });
    },[]);

    useEffect(() => {
        socket.on("delete room", () => {
            auth.leave();
            history.push('/profile');
        })
    })

    useEffect(() => {
        socket.on('game state', ({game}) => {
            setDefending(game.defendingPlayer);
            console.log(game);
            setGame(game);
            setSlots(game.board)
            setGameStarted(true);
            setCountToTake(game.countToTake);
            setCountToNextTurn(game.countToNextTurn);
            if (game.countToTake === 0) { setClickedNextTurn(false); }
            if (game.countToTake === 0) { setClickedTakeCards(false); }
        });
    },[]);


    return(
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Helmet>
                <style>{'body { background-color: green; }'}</style>
            </Helmet>
            <div style={{width: '20%'}}>
                <div>
                {room ? (
                    <div>
                    <h1> {room.name} </h1>
                    </div>
                ) : (
                    <></>
                )}
                </div>
                <div>
                    {!gameStarted && room && room.owner._id ===userId ? (
                        <Button
                        onClick={startGame}
                        >
                            Start
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
                <div>
                    { room && userId !== room.owner._id ? (
                        <Button
                            onClick={leaveRoom}
                        >
                            Leave room
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
                <div>
                    { room && userId === room.owner._id && !gameStarted ? (
                        <Button
                            onClick={deleteRoom}
                        >
                            Delete room
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
            </div>

                { gameStarted ? (
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <h2>Defending player - {game.defendingPlayer.name}</h2>
                        <div style={{marginLeft: '20%', position: "fixed", top: '40%', width:'13%'}}>
                            <div>
                                <Slots
                                    slots={slots}
                                    defend={defend}
                                    isDefending={userId === defending._id}
                                    chosenCard={chosenCard}
                                >
                                </Slots>
                            </div>
                        </div>
                        <div style={{marginLeft: '20%', position: "fixed", bottom: '10%', width:'40%'}}>
                        { game && game.hands? (
                                <Hand
                                    cards={game.hands[userId]}
                                    attack={attack}
                                    chooseCard={chooseCard}
                                    isDefending={userId === defending._id}
                                >
                                </Hand>
                            )
                            :
                            (<></>)
                        }
                        </div>
                        <div style={{position: "fixed", left: "30%", bottom: '5%', width:'40%'}}>
                            {defending._id === userId && slots.length > 0 ? (
                                <div>
                                    <Button
                                    onClick={takeBoardCards}
                                    disabled={countToTake > 0}
                                    >
                                        Take cards
                                    </Button>
                                </div>
                            ) : (
                                <></>
                            )}
                            {defending._id !== userId && slots.length > 0 && countToTake === 0 ? (
                                <div>
                                    <Button
                                        onClick={nextTurn}
                                        disabled={clickedNextTurn}
                                    >
                                        End turn
                                    </Button>
                                </div>
                            ) : (
                                <></>
                            )}
                            {defending._id !== userId && slots.length > 0 && countToTake > 0 ? (
                                <div>
                                    <Button
                                        onClick={takeBoardCards}
                                        disabled={clickedTakeCards}
                                    >
                                        Ok
                                    </Button>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                ) : (
                    <></>
                )}
        </div>

    )
}