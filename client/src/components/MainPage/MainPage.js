import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import {CreateRoom} from "./CreateRoom/CreateRoom"
import {RoomTable} from "./RoomTable/RoomTable";
import {useHistory} from "react-router-dom";
import {useMainPageSocket} from "../../hooks/socket.main.hook";
import Button from "react-bootstrap/Button";
import './MainPage.css'

export const MainPage = () => {
    const auth = useContext(AuthContext);
    const {loading, error, request} = useHttp();
    const {rooms_, roomId_, joinRoom_, createRoom_} = useMainPageSocket()
    const [user, setUser] = useState();
    const [name, setName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [game, setGame] = useState("Дурак");
    const history = useHistory();

    const logout = useCallback(async () => {
        try {
            await request('/logout');
            auth.logout();
        } catch (e) {
            console.log(e)
        }
    },[])

    const createRoom = useCallback( () => {
        if (user){
            createRoom_(name, user, game, isPrivate);
        } else {
            alert("???")
        }
    }, [name, user, game, isPrivate])

    const joinRoom = useCallback((roomId_) => {
        if (user){
            joinRoom_(user, roomId_)
            auth.join(roomId_);
            // socket.disconnect();
            history.push('/room');
        }
    }, [user])

    useEffect(() => {
        let cleanupFunction = false;
        request('/profile')
            .then((user) => {
                try {
                    if(!cleanupFunction) {setUser(user);}
                } catch (e) {
                    console.error(e.message);
                }
            });
        return () => {
            cleanupFunction = true;
        };
    },[])


    useEffect(() => {
        if (roomId_) {
            auth.join(roomId_)
            //socket.disconnect();
            history.push('/room');
        }
        return () => {};
    },[roomId_]);

    return (
        <div className="container">
            <div className="controls">
                <div className="userInfo">
                    <img className="profilePic"
                        src={(user) ? user.pic : ''}
                        sizes={0.5}
                        alt="new"
                    />
                    <div className="userName">
                        <h5> {(user) ? user.name : null} </h5>
                    </div>
                </div>
                <div className="createRoom">
                    <CreateRoom
                        setName_={setName}
                        setGame_={setGame}
                        setIsPrivate_={setIsPrivate}
                        createRoom={createRoom}
                    />
                </div>
                <div className="logout-button-container">
                    <Button
                        className="logout-button"
                        onClick={logout}
                        disabled={loading}
                    >
                        Выйти
                    </Button>
                </div>
            </div>
            <div className="room-table">
                <RoomTable
                    availableRooms={rooms_}
                    joinRoom={joinRoom}
                    loading={loading}
                />
            </div>
        </div>
    )
}