// import {useState, useCallback, useEffect} from 'react'
// import io from "socket.io-client";
//
// const ENDPOINT = 'localhost:5000';
// let socket = io(ENDPOINT, {path: "/room"});
//
// export const useDurak = () => {
//
//     const [gameInfo, setGameInfo] = useState(null);
//
//     const startGame_ = useCallback((roomId, userId) => {
//         socket.emit('start game', {roomId, userId});
//     }, [])
//
//     useEffect(() => {
//         socket.on('game state', ({gameInfo}) => {
//         console.log(gameInfo);
//         setGameInfo(gameInfo);
//     });
//     },[])
//
//     return { gameInfo, startGame_ }
// }