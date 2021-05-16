import React from "react";
import {Durak} from "../Games/Durak/Durak";

export const GameFactory = ({room, userId}) => {
    switch (room.game) {
        case "Дурак":
            return (
                <Durak
                    room={room}
                    userId={userId}
                />
                );

        default:
            throw new RangeError();
    }
}

export const getMinPlayers = (game) => {
    switch (game) {
        case "Дурак":
            return 2;
        default:
            throw new RangeError();
    }
}