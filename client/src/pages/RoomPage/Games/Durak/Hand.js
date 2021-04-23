import React, {useState} from "react";
import {GameCard} from "./Card";
import CardGroup from "react-bootstrap/CardGroup";


export const Hand = ({cards, attack, chooseCard, isDefending}) => {

    const clickHandler = (card) => {
        isDefending ? chooseCard(card): attack(card) ;
    }

    return (
        <div>
            <CardGroup>
            { cards.map(
                ((card, ind) => (
                    <GameCard
                        clickHandler={clickHandler}
                        card={card}
                    >
                    </GameCard>
                    )))}
            </CardGroup>
        </div>
    );
}