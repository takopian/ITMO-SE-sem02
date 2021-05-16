import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import React from "react";


export const RoomTable = ({availableRooms, joinRoom, loading}) => {

    return (
        <div className={"room-table-container"}>
            <h1>Доступные комнаты</h1>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Название комнаты</th>
                <th>Игра</th>
                <th>Создатель</th>
                <th>Количество игроков</th>
                <th>Подключиться</th>
            </tr>
            </thead>
            <tbody>
            {availableRooms.map((room, i) =>
                <tr key={room._id}>
                    <td>{room.name}</td>
                    <td>{room.game}</td>
                    <td>{room.owner.name}</td>
                    <td>{room.players.length}</td>
                    <td>
                        <Button
                            className="btn waves-effect waves-light"
                            onClick={() => {joinRoom(room._id)}}
                            disabled={loading}
                        >
                            Join
                        </Button>
                    </td>
                </tr>)
            }
            </tbody>
        </Table>
        </div>
    );
}