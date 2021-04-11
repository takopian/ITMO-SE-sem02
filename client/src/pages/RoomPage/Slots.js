import React, {useEffect, useState} from "react";
import {Slot} from "./Slot";
import CardGroup from "react-bootstrap/CardGroup";
import {GameCard} from "./Card";


export const Slots = ({defend, slots, isDefending, chosenCard}) => {
    const [toRender, setToRender] = useState(slots);
    const [left, setLeft] = useState(["40%", "45%", "50%"])
    const clickHandler = (ind, slot) => {
        if (isDefending && slot.bottom && !slot.top && chosenCard) {
            defend(ind, chosenCard);
        }
    }

    useEffect(() => {
        setToRender(slots)
    }, [slots])

    return(
        <div>
            {slots.map((slot, ind) => (
                <div>
                    <div style={{position: "fixed", top: ind <= 2 ? "40%": "55%", left: left[ind % 3]}}>
                    <GameCard
                        card={slot.bottom.card}
                        clickHandler={() => clickHandler(ind, slot)}
                    >
                    </GameCard>
                    </div>
                    {slot.top ? (
                            <div style={{position: "fixed", top: ind <= 2 ? "45%": "60%", left: left[ind % 3]}}>
                            <GameCard
                                card={slot.top.card}
                                clickHandler={() => {}}
                            >
                            </GameCard>
                            </div>
                        )
                        :
                        (<></>)}
                </div>
            ))}
        </div>
    )
}