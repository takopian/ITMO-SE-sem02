import React, {useEffect} from "react";
import {GameCard} from "./Card";


export const Slot = ({key, slot}) => {

    useEffect(() => {

        },[slot])

    return(
        <div>
            <GameCard
                key={key}
                card={slot.bottom.card}
            >
            </GameCard>
        </div>
    )
}