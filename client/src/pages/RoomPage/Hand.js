import React, {useState} from "react";
import {GameCard} from "./Card";
import CardGroup from "react-bootstrap/CardGroup";


export const Hand = ({cards, slots, owner, setSlots}) => {
    const [clickedCard, setClickedCard] = useState();

    const clickHandler = (card) => {
        console.log("click", card);
        setClickedCard(card);
        let copySlots = [...slots];
        if (copySlots.length < 6) {
            let newKey = copySlots.length;
            copySlots.push({key: newKey, bottom: {owner, card}});
            const ind = cards.indexOf(card);
            cards.splice(ind, 1);
            setSlots(copySlots);
            console.log(slots);
        }
    }

    return (
        <div>
            <CardGroup>
            { cards.map(
                ((card, ind) => (
                    <GameCard
                        clickHandler={clickHandler}
                        key={ind}
                        card={card}
                    >
                    </GameCard>
                    )))}
            </CardGroup>
        </div>
    );
}