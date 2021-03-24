import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import io from 'socket.io-client';
import 'materialize-css'
let socket;

export const MainPage = () => {
    const auth = useContext(AuthContext)
    const {loading, error, request} = useHttp()
    const ENDPOINT = 'localhost:5000'
    const [userID, setUserId] = useState(auth.userId)
    const [user, setUser] = useState({})
    const [room, setRoom] = useState({})
    // const [roomToJoin, setRoomToJoin] = useState()
    const [availableRooms, setAvailableRooms] = useState([])

    const logout = async () => {
        try {
            await request('/logout')
            console.log("pepe")
            auth.logout()
        } catch (e) {
            console.log(e)
        }
    }
    const createRoom = () => {
        if (user){
            console.log("pepe")
            socket.emit('create room', user);
        }
    }

    const joinRoom = (ind) => {
        if (user){
            socket.emit('join room', {user, room: availableRooms[ind]});
            setRoom(availableRooms[ind]);
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT)
        request('/profile')
            .then((user) => {
                setUser(user);
            });
    }, [ENDPOINT])


    useEffect(() => {
        socket.on('roomsData', ({rooms}) => {
            setAvailableRooms(rooms);
        });
    }, []);



    return (
        <div className="container" style={{display: 'flex', flexDirection: 'row'}}>
            <div className="userInfo" style={{display: 'flex', flexDirection: 'column', width: '20%'}}>
            <div >
                <div>
                    {user.name}
                </div>
                <img
                    style={{ width: "40%", margin: "20px 0" }}
                    src={user.pic}
                    sizes={0.5}
                    alt="new"
                />
            </div>
                <div>
                    <button
                        className="btn waves-effect waves-light"
                        onClick={createRoom}
                        disabled={loading}
                    >
                        Создать комнату
                    </button>
                </div>
            <div>
                <button
                    style={{width: '40%'}}
                    className="btn waves-effect waves-light"
                    onClick={logout}
                    disabled={loading}
                >
                    Выйти
                </button>
            </div>
            </div>
            <div style={{width: '70%'}}>

            <ul className="collection with-header" >
                <li className="collection-header"><h4>Available rooms.</h4></li>
                <li className="collection-header">
                    <div style={{display: 'flex', flexDirection: 'row', margin:'10px'}}>
                        <div style={{padding:'0 15px'}} > Название комнаты </div>
                        <div style={{padding:'0 15px'}}>
                            Игра
                        </div>
                        <div style={{padding:'0 40px'}}>
                            Создатель
                        </div>
                        <div style={{padding:'0 15px'}}>
                            Количество игроков
                        </div>
                    </div>
                </li>
                {availableRooms.map((room, i ) =>
                    <li  className="collection-item" key={i}>
                        <div style={{display: 'flex', flexDirection: 'row', margin:'10px'}}>
                            <div style={{padding:'0 60px'}} > {room.name}</div>
                            <div style={{padding:'0 15px'}}>
                                {room.game}
                            </div>
                            <div style={{padding:'0 15px'}}>
                                {room.owner.name}
                            </div>
                            <div style={{padding:'0 15px'}}>
                                {room.players.length}
                            </div>
                            <div>
                                <button
                                    className="btn waves-effect waves-light"
                                    onClick={() => {joinRoom(i)}}
                                    disabled={loading}
                                    >
                                    Join
                                </button>
                            </div>
                        </div>
                    </li>)}
            </ul>

            </div>
        </div>)
}