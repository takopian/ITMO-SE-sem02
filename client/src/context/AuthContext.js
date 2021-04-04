import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    roomId: null,
    login: noop,
    logout: noop,
    join: noop,
    leave: noop,
    isAuthenticated: false
})