import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import io from 'socket.io-client';
import {CreateRoom} from "./createRoom"
import {RoomTable} from "./roomTable";
import {useHistory} from "react-router-dom";
let socket;

export const MainPage = () => {
    const auth = useContext(AuthContext);
    const {loading, error, request} = useHttp();
    const ENDPOINT = 'localhost:5000';
    const [user, setUser] = useState();
    const [roomId, setRoomId] = useState();
    const [availableRooms, setAvailableRooms] = useState([]);
    const [name, setName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [game, setGame] = useState("Дурак");
    const history = useHistory();

    const logout = async () => {
        try {
            await request('/logout');
            auth.logout();
        } catch (e) {
            console.log(e)
        }
    }
    const createRoom = () => {
        if (user){
            socket.emit('create room', {name, user, game, isPrivate });
        } else {
            alert("???")
        }
    }

    const joinRoom = (roomId_) => {
        if (user){
            auth.join(roomId_);
            socket.emit('join room', {user, roomId: roomId_});
            setRoomId(roomId_);
            socket.disconnect();
            history.push('/room');
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        console.log(socket);
        request('/profile')
            .then((user) => {
                setUser(user);
            });
        return () => {};
    }, [ENDPOINT])


    useEffect(() => {
        socket.on('roomsData', ({rooms}) => {
            setAvailableRooms(rooms);
        });
    }, []);

    useEffect(() => {
        socket.on('room created', (room) => {
            setRoomId(room);
        });
    }, []);

    useEffect(() => {
        if (roomId) {
            auth.join(roomId)
            socket.disconnect();
            history.push('/room');
        }
    },[roomId]);

    return (
        <div className="container" style={{display: 'flex', flexDirection: 'row'}}>
            <div className="userInfo" style={{display: 'flex', flexDirection: 'column', width: '20%'}}>
            <div >
                <div>
                    {(user) ? user.name : null}
                </div>
                <img
                    style={{ width: "40%", margin: "20px 0" }}
                    src={(user) ? user.pic : ''}
                    sizes={0.5}
                    alt="new"
                />
            </div>
                <div>
                    <CreateRoom
                        setName_={setName}
                        setGame_={setGame}
                        setIsPrivate_={setIsPrivate}
                        createRoom={createRoom}
                    >
                    </CreateRoom>
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
                <RoomTable
                    availableRooms={availableRooms}
                    joinRoom={joinRoom}
                    loading={loading}
                >
                </RoomTable>
            </div>
        </div>)
}