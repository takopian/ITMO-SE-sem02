import React, {useContext, useState, useEffect} from "react";
import {AuthContext} from "../../context/AuthContext";
import io from 'socket.io-client';
import {Helmet} from 'react-helmet';
import Button from "react-bootstrap/Button";
import {Hand} from "./Hand";
import {Slots} from "./Slots";
import CardGroup from "react-bootstrap/CardGroup";
import {Slot} from "./Slot";

let socket;

export const RoomPage = () => {
    const ENDPOINT = 'localhost:5000';
    const auth = useContext(AuthContext);
    const [userId, setUserId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [room, setRoom] = useState();
    const [game, setGame] = useState();
    const [gameStarted, setGameStarted] = useState(false);
    const [slots, setSlots] = useState([])
    const [clicked, setClicked] = useState(false)

    const startGame = () => {
        setGameStarted(true);
        socket.emit('start game', {roomId});
    }


    useEffect(() => {
        console.log(auth.userId, auth.roomId);

        socket = io(ENDPOINT, {path: "/room"});
        setRoomId(auth.roomId);
        setUserId(auth.userId);
        socket.emit('room info', { roomId: auth.roomId });
    }, [ENDPOINT]);

    useEffect(() => {
        socket.on('info', ({room}) => {
            console.log(room);
            setRoom(room);
        });
    },[]);

    useEffect(() => {
        socket.on('game state', ({game}) => {
            console.log(game);
            setGame(game);
        });
    },[]);

    useEffect(() => {
        console.log(slots, "jopa");
    }, [slots])

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
                    {! gameStarted ? (
                        <Button
                        onClick={startGame}
                        >
                            Start
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{marginLeft: '20%', position: "fixed", top: '40%', width:'13%'}}>
                    <div>
                        <Slots
                        slots={slots}
                        >
                        </Slots>
                    </div>
                </div>
                <div style={{marginLeft: '20%', position: "fixed", bottom: '10%', width:'40%'}}>
                { game && game.hands? (
                    <Hand
                        owner={userId}
                        cards={game.hands[userId]}
                        slots={slots}
                        setSlots={setSlots}
                    >
                    </Hand>
                )
                    :
                    (<></>)
                }
                </div>
            </div>
        </div>

    )
}