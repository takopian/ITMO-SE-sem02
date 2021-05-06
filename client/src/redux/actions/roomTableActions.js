export const addPlayer = (name, _id) => {
    return {
        type: "ADDPLAYER",
        name,
        _id
    }
}

export const incrementWinnerCounter = (gameId, playerId) => {
    return {
        type: "SETWINNER",
        gameId,
        playerId
    }
}

export const setCurrent = (playerId) => {
    return {
        type: "SETCURRENT",
        playerId
    }
}

export const clearTable = () => {
    return {
        type: "CLEARTABLE",
    }
}