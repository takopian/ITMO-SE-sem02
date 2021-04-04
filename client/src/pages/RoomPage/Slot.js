import React, {useEffect} from "react";
import {GameCard} from "./Card";


export const Slot = ({slot}) => {

    useEffect(() => {

        },[slot])

    return(
        <div>
            <GameCard
            card={slot.bottom.card}
            >
            </GameCard>
        </div>
    )
}