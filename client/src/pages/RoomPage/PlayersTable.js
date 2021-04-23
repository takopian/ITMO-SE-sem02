import React from "react";
import Table from "react-bootstrap/Table";

export const PlayersTable = ({room}) => {

    return (
        <Table s striped bordered hover>
            <thead>
            <tr>
                <th>Игроки</th>
            </tr>
            </thead>
            <tbody>
            {room.players.map((player, i ) =>
                <tr key={i}>
                    <td>{player.name}</td>
                </tr>)}
            </tbody>
        </Table>
    )
}