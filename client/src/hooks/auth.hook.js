import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)
    const [token, setToken] = useState(null)

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

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.userId)
        }
        setReady(true)
    }, [login])


    return { token, login, logout, userId, ready }
}