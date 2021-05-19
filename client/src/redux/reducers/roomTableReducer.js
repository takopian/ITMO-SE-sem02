export const roomTableReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADDPLAYER': {
            let newState = [...state];
            newState.push({name: action.name, _id: action._id, wins: new Set(), isCurrent: false, isSpectator: action.isSpectator});
            return newState;
        }
        case 'DELETEPLAYER': {
            const ind = state.findIndex((element, ind, arr) => element._id === action._id);
            let newState = [...state];
            if (ind !== -1) {
                newState.splice(ind, 1);
            }
            return newState;
        }
        case 'SETWINNER': {
            let newState = [...state];
            let ind = newState.findIndex((value, index, obj) => value._id === action.playerId);
            newState[ind].wins.add(action.gameId);
            return newState;
        }
        case 'SETCURRENT': {
            let newState = [...state];
            let oldInd = newState.findIndex((value, index, obj) => value.isCurrent === true);
            if (oldInd !== -1) {
                newState[oldInd].isCurrent = false;
            }
            let ind = newState.findIndex((value, index, obj) => value._id === action.playerId);
            newState[ind].isCurrent = true;
            return newState;
        }
        case 'CLEARTABLE': {
            state = [];
            return state;
        }
        default:
            return state;

    }
}