import React from "react";
import {Durak} from "./Durak/Durak";

export const GameFactory = ({room, userId}) => {
    switch (room.game) {
        case "Дурак":
            console.log(room.game);
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