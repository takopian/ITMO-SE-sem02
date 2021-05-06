import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import {CreateRoom} from "./createRoom"
import {RoomTable} from "./roomTable";
import {useHistory} from "react-router-dom";
import {useMainPageSocket} from "../../hooks/socket.main.hook";

export const MainPage = () => {
    const auth = useContext(AuthContext);
    const {loading, error, request} = useHttp();
    const {rooms_, roomId_, joinRoom_, createRoom_} = useMainPageSocket()
    const [user, setUser] = useState();
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
            createRoom_(name, user, game, isPrivate);
        } else {
            alert("???")
        }
    }

    const joinRoom = (roomId_) => {
        if (user){
            joinRoom_(user, roomId_)
            auth.join(roomId_);
            // socket.disconnect();
            history.push('/room');
        }
    }

    useEffect(() => {
        let cleanupFunction = false;
        request('/profile')
            .then((user) => {
                try {
                    console.log(user);
                    if(!cleanupFunction) {setUser(user);}
                } catch (e) {
                    console.error(e.message);
                }
            });
        return () => {cleanupFunction = true;};
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
                    availableRooms={rooms_}
                    joinRoom={joinRoom}
                    loading={loading}
                >
                </RoomTable>
            </div>
        </div>)
}