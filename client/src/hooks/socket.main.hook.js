import {useState, useEffect, useCallback} from 'react'
import io from "socket.io-client";

const ENDPOINT = 'localhost:5000';
let socket;

export const useMainPageSocket = () => {

    const [rooms_, setRooms_] = useState([]);
    const [roomId_, setRoomId_] = useState();


    const createRoom_ = useCallback((name, user, game, isPrivate) => {
        socket.emit('create room', {name, user, game, isPrivate });
    }, [])

    const joinRoom_ = useCallback((user, roomId) => {
            socket.emit('join room', {user, roomId});
    },[])

    useEffect(() => {
        socket = io(ENDPOINT);
        return () => {};
    },[ENDPOINT])

    useEffect(() => {
        socket.on('roomsData', ({rooms}) => {
            setRooms_(rooms);
        });
    }, []);

    useEffect(() => {
        socket.on('room created', (room) => {
            setRoomId_(room);
        });
    }, []);
    

    return { rooms_, roomId_, createRoom_, joinRoom_ }
}