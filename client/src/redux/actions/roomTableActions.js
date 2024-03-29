export const addPlayer = (name, _id, isSpectator) => {
    return {
        type: "ADDPLAYER",
        name,
        _id,
        isSpectator
    }
}

export const deletePlayer = (_id) => {
    return {
        type: "DELETEPLAYER",
        _id,
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