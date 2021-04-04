import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)
    const [token, setToken] = useState(null)
    const [roomId, setRoomId] = useState(null)

    const login = useCallback((token_, id) => {
        setToken(token_)
        setUserId(id)
        localStorage.setItem(storageName, JSON.stringify({
            userId: id,
            token: token_
        }))
    }, [])


    const logout = useCallback(() => {
        setUserId(null)
        setToken(null)
        localStorage.removeItem(storageName)
    }, [])

    const join = useCallback((roomId_) =>{
        setRoomId(roomId_)
        localStorage.setItem('room', JSON.stringify({roomId : roomId_}))
    }, [])

    const leave = useCallback(() => {
        setRoomId(null)
        localStorage.removeItem('room')
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        const room = JSON.parse(localStorage.getItem('room'))

        if (data && data.token) {
            login(data.token, data.userId)
        }

        if (room && room.roomId) {
            join(room.roomId)
        }
        setReady(true)
    }, [login, join])


    return { token, login, logout, userId, roomId, ready, join, leave }
}