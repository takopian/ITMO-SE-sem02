import React, {useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import {useSelector, useDispatch} from "react-redux";
import {addPlayer} from "../../../redux/actions/roomTableActions";
import Card from "react-bootstrap/Card";

export const PlayersTable = ({room}) => {
    const table = useSelector(state => state.roomTableReducer);
    const [tableCopy, setTableCopy] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(room);
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
        setTableCopy(table)
        console.log(table);
        return () => {}
    },[room])

    return (
        <Table striped bordered hover >
            <thead style={{backgroundColor:"#006600", color: 'white'}}>
            <tr>
                <th>Игроки</th>
                <th>Количество побед</th>
            </tr>
            </thead>
            <tbody style={{backgroundColor:"#006600"}}>
            {
                table.map((player, i ) => {
                    if (!player.isSpectator) {
                        return (
                            <tr key={player._id}>
                                <td style={{color: 'white'}}>{player.name}</td>
                                <td style={{color: 'white'}}>{player.wins.size}</td>
                                {player.isCurrent ? (<td>{<img src={process.env.PUBLIC_URL + '/room-table/your-turn.jpg'} style={{width: 60}} alt="Card image" />}</td>) : (<></>)}
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