import React, {useContext, useState, useEffect} from "react";
import {AuthContext} from "../../context/AuthContext";
import io from 'socket.io-client';
import {Helmet} from 'react-helmet';
import Button from "react-bootstrap/Button";
import {useHistory} from "react-router-dom";
import {GameFactory, getMinPlayers} from "./Games/GameFactory";
import {PlayersTable} from "./PlayersTable";
import Modal from "react-bootstrap/Modal";
import {useDispatch, useSelector} from "react-redux";
import {clearTable} from "../../redux/actions/roomTableActions";
import {Chat} from "./Chat";

let socket;

export const RoomPage = () => {
    const ENDPOINT = 'localhost:5000';
    const auth = useContext(AuthContext);
    const history = useHistory();
    const [userId, setUserId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [room, setRoom] = useState();
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [chooseIfRestart, setChooseIfRestart] = useState(false);
    const [userToLeave, setUserToLeave] = useState(null);
    const [minPlayers, setMinPlayers] = useState(null);
    const dispatch = useDispatch();

    const startGame = () => {
        socket.emit('start game', {roomId});
        setChooseIfRestart(false);
        setUserToLeave(null);
    }

    const leaveRoom = () => {
        socket.emit("leave room", ({roomId, userId}));
        auth.leave();
        history.push('/profile');
        dispatch(clearTable());
    }

    const deleteRoom = () => {
        socket.emit("delete room", ({roomId, userId}));
    }

    const chooseContinue = () => {
        socket.emit("continue without user", ({roomId, userId: userToLeave}));
        setChooseIfRestart(false);
        setUserToLeave(null);
    }

    const endGame = () => {
        socket.emit("clean board", ({roomId}));
        setChooseIfRestart(false);
        setUserToLeave(null);
    }

    const sendMessage = (text) => {
        socket.emit('send message', {roomId, userId, text});
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
            let min = getMinPlayers(room.game);
            setMinPlayers(min);
        });
    },[]);

    useEffect(() => {
        socket.on('game started', () => {
            setGameStarted(false);
            setGameFinished(false);
            setGameStarted(true);
        });
    },[]);

    useEffect(() => {
        socket.on("delete room", () => {
            auth.leave();
            history.push('/profile');
        });
    }, []);

    useEffect(() => {
        socket.on("game finished", () => {
            setGameFinished(true);
            setGameStarted(false);
        });
    }, []);

    useEffect(() => {
        socket.on("board cleaned", () => {
            setGameFinished(false);
            setGameStarted(false);
        });
    }, []);

    useEffect(() => {
        socket.on("user left game", ({userId}) => {
            setChooseIfRestart(true);
            setUserToLeave(userId);
        });
    }, []);


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
                <div style={{marginTop: 90}}>
                    { room ? (
                        <PlayersTable
                            room={room}
                        >
                        </PlayersTable>
                    ) : (
                        <></>
                    )}
                </div>
                <div style={{marginTop: 50}}>
                    {(!gameStarted || gameFinished) && room && room.owner._id ===userId ? (
                        <Button
                            onClick={startGame}
                            disabled={room.players.length < minPlayers}
                        >
                            Start
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
                <div style={{marginTop: 20}}>
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
                <div style={{marginTop: 10}}>
                    { room && userId === room.owner._id && !gameStarted ? (
                        <Button
                            onClick={deleteRoom}
                        >
                            Close room
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
                {room ? (
                    <div style={{marginTop: -50}}>
                        <Chat
                            sendMessage={sendMessage}
                            chatHistory={room.chatHistory}
                        >
                        </Chat>
                    </div>
                ) : (
                    <></>
                )}

            </div>

                { gameStarted || gameFinished ? (
                    <GameFactory
                        room={room}
                        userId={userId}
                    >
                    </GameFactory>
                ) : (
                    <></>
                )}

            {room && room.owner._id === userId ? (
                <Modal animation={false} show={chooseIfRestart}>
                    <Modal.Body>
                        User left. Continue?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={chooseContinue} disabled={room.players.length < minPlayers}>
                            Continue
                        </Button>
                        <Button variant="primary" onClick={startGame} disabled={room.players.length < minPlayers}>
                            Restart
                        </Button>
                        <Button variant="secondary" onClick={endGame}>
                            End game
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (<></>)}
        </div>
    )
}