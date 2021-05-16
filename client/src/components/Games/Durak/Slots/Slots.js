import React, {useEffect, useState} from "react";
import {GameCard} from "../Card/Card";
import './Slots.css'


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
        <div className="slotsContainer">
            {slots.map((slot, ind) => (
                <div>
                    <div
                        className="bottomCard"
                        style={{position: "fixed", top: ind <= 2 ? "40%": "55%", left: left[ind % 3]}}
                    >
                        <GameCard
                            card={slot.bottom.card}
                            clickHandler={() => clickHandler(ind, slot)}
                        />
                    </div>
                    {slot.top ? (
                            <div
                                className="topCard"
                                style={{position: "fixed", top: ind <= 2 ? "45%": "60%", left: left[ind % 3]}}
                            >
                                <GameCard
                                    card={slot.top.card}
                                    clickHandler={() => {}}
                                />
                            </div>
                        )
                        :
                        (<></>)}
                </div>
            ))}
        </div>
    )
}