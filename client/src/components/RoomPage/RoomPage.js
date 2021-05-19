import React, {useContext, useState, useEffect, useCallback} from "react";
import {AuthContext} from "../../context/AuthContext";
import io from 'socket.io-client';
import {Helmet} from 'react-helmet';
import Button from "react-bootstrap/Button";
import {useHistory} from "react-router-dom";
import {GameFactory, getMinPlayers} from "./GameFactory";
import {PlayersTable} from "./PlayersTable/PlayersTable";
import {useDispatch, useSelector} from "react-redux";
import {clearTable, deletePlayer} from "../../redux/actions/roomTableActions";
import {Chat} from "../Chat/Chat";
import {PlayerLeftModal} from "./PlayerLeftModal/PlayerLeftModal";
import './RoomPage.css'

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
    const [isSpectator, setIsSpectator] = useState(false);
    const table = useSelector(state => state.roomTableReducer);
    const dispatch = useDispatch();

    const startGame = useCallback(() => {
        socket.emit('start game', {roomId});
        setChooseIfRestart(false);
        setUserToLeave(null);
    },[roomId]);

    const continueAsPlayer = useCallback(() => {
        socket.emit('continue as player', {roomId, userId});
        let ind = table.findIndex((element, ind, arr) => (element._id === userId));
        table[ind].isSpectator = false;
        setIsSpectator(false);
    },[table, roomId, userId]);

    const leaveRoom = useCallback(() => {
        console.log("leave room", isSpectator);
        socket.emit("leave room", ({roomId, userId}));
        auth.leave();
        history.push('/profile');
        dispatch(clearTable());
    }, [roomId, userId]);

    const deleteRoom = useCallback(() => {
        dispatch(clearTable());
        socket.emit("delete room", ({roomId, userId}));
    }, [roomId, userId]);

    const chooseContinue = useCallback(() => {
        socket.emit("continue without user", ({roomId, userId: userToLeave}));
        setChooseIfRestart(false);
        setUserToLeave(null);
    }, [roomId, userToLeave]);

    const endGame = useCallback(() => {
        socket.emit("clean board", ({roomId}));
        setChooseIfRestart(false);
        setUserToLeave(null);
    }, [roomId]);

    const sendMessage = useCallback(
        (text) => {
            socket.emit('send message', {roomId, userId, text});
        }, [roomId, userId]);

    useEffect(() => {
        socket = io(ENDPOINT, {path: "/room"});
        setRoomId(auth.roomId);
        setUserId(auth.userId);
        socket.emit('room info', { roomId: auth.roomId });
        return () => {
            socket.disconnect();
        }
    }, [ENDPOINT]);

    useEffect(() => {
        socket.on('info', ({room}) => {
            console.log(room);
            if (room !== null) {
                setRoom(room);
                let min = getMinPlayers(room.game);
                setMinPlayers(min);
                let ind = room.spectators.findIndex((element, ind, arr) => (element._id.toString() === auth.userId.toString()));
                if (ind !== -1) {
                    setIsSpectator(true);
                }
            }
        });
        return () => {}
    },[userId]);

    useEffect(() => {
        socket.on('game started', () => {
            setGameStarted(false);
            setGameFinished(false);
            setGameStarted(true);
        });

        socket.on("delete room", () => {
            dispatch(clearTable());
            auth.leave();
            history.push('/profile');
        });

        socket.on("game finished", () => {
            console.log("game finished");
            setGameFinished(true);
            setGameStarted(false);
        });

        socket.on("board cleaned", () => {
            setGameFinished(false);
            setGameStarted(false);
        });

        socket.on("user left game", ({userId}) => {
            setChooseIfRestart(true);
            setUserToLeave(userId);
        });

        socket.on("user left room", ({userId}) => {
            dispatch(deletePlayer(userId));
        });

        return () => {}
    },[]);

    return(
        <div className="roomOuterContainer">
            <Helmet>
                <style>{'body { background-color: green; }'}</style>
            </Helmet>
            <div className="roomInnerContainer">
                <div className="roomName">
                {room ? (
                    <div>
                    <h1> {room.name} </h1>
                    </div>
                ) : (
                    <></>
                )}
                </div>
                <div className="startGameButton">
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
                <div className="leaveRoomButton">
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
                <div className="deleteRoomButton">
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
                <div className="continueAsPlayerButton">
                    { room && !gameStarted && isSpectator ? (
                        <Button
                            onClick={continueAsPlayer}
                        >
                            Join as player
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="playersTable">
                    { room ? (
                        <PlayersTable
                            room={room}
                        >
                        </PlayersTable>
                    ) : (
                        <></>
                    )}
                </div>
                {room ? (
                    <div className={"roomChat"}>
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
            <div className="gameContainer">
                { gameStarted || gameFinished ? (
                    <GameFactory
                        room={room}
                        userId={userId}
                    >
                    </GameFactory>
                ) : (
                    <></>
                )}
            </div>
            <div className="playerLeftModal">
                {room && room.owner._id === userId ? (
                    <PlayerLeftModal
                        chooseIfRestart={chooseIfRestart}
                        chooseContinue={chooseContinue}
                        startGame={startGame}
                        endGame={endGame}
                        disabled={room.players.length < minPlayers}
                    />
                ) : (<></>)
                }
            </div>
        </div>
    )
}