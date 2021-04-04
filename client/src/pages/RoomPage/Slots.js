import React, {useEffect, useState} from "react";
import {Slot} from "./Slot";
import CardGroup from "react-bootstrap/CardGroup";


export const Slots = ({slots}) => {
    const [toRender, setToRender] = useState(slots);


    useEffect(() => {
        setToRender(slots)
    }, [slots])

    return(
        <div>
            <CardGroup>
            {slots.map((slot, ind) => (
                <Slot
                slot={slot}
                key={ind}
                >
                </Slot>
            ))}
            </CardGroup>
        </div>
    )
}