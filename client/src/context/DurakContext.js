import {createContext} from 'react'

function noop() {}

export const DurakContext = createContext({
    gameInfo: null,
    startGame_: noop
})