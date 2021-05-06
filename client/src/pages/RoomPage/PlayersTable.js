import React from "react";
import Table from "react-bootstrap/Table";
import {useSelector, useDispatch, connect} from "react-redux";
import {addPlayer} from "../../redux/actions/roomTableActions";

export const PlayersTable = ({room}) => {
    const table = useSelector(state => state.roomTableReducer);
    const dispatch = useDispatch();

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
                room.players.map((player, i ) =>
                {
                    console.log(table);
                    let ind = table.findIndex((element, index, array) => element._id === player._id);
                    if (ind === -1) {
                        dispatch(addPlayer(player.name, player._id));
                        ind = table.findIndex((element, index, array) => element._id === player._id);
                    }
                    if (ind !== -1) {
                        return (
                            <tr key={i}>
                                <td>{table[ind].name}</td>
                                <td>{table[ind].wins.size}</td>
                                <td>{table[ind].isCurrent.toString()}</td>
                            </tr>
                        )
                    }
                    return (<></>)

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