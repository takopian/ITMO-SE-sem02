import React, {useEffect} from "react";
import Table from "react-bootstrap/Table";
import {useSelector, useDispatch} from "react-redux";
import {addPlayer} from "../../../redux/actions/roomTableActions";

export const PlayersTable = ({room}) => {
    const table = useSelector(state => state.roomTableReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        room.players.map((player, i ) =>
        {
            let ind = table.findIndex((element, index, array) => element._id === player._id);
            if (ind === -1) {
                dispatch(addPlayer(player.name, player._id, false));
            }
        });
        room.spectators.map((spec, i ) =>
        {
            let ind = table.findIndex((element, index, array) => element._id === spec._id);
            if (ind === -1) {
                dispatch(addPlayer(spec.name, spec._id, true));
            }
        })
    },[room.players])

    return (
        <Table s striped bordered hover>
            <thead>
            <tr>
                <th>Игроки</th>
                <th>Количество побед</th>
            </tr>
            </thead>
            <tbody>
            {
                table.map((player, i ) => {
                    if (!player.isSpectator) {
                        return (
                            <tr key={player._id}>
                                <td>{player.name}</td>
                                <td>{player.wins.size}</td>
                                <td>{player.isCurrent.toString()}</td>
                            </tr>
                        )
                    }
                })
            }
            </tbody>
        </Table>
    )
}

// const mapStateToProps = state => {
//     return {
//         table : state.roomTableReducer()
//     }
// }
// const mapDispatchToProps = dispatch => {
//     return {
//         addPlayer: (name, _id) => dispatch(addPlayer(name, _id))
//     }
// }


// export default connect(mapStateToProps, mapDispatchToProps)(PlayersTable)