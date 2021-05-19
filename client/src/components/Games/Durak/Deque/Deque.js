import React from "react";
import {OtherCard} from "../OtherCard/OtherCard";
import {GameCard} from "../Card/Card";
import './Deque.css'

export const Deque = ({numberOfCards, bestCard}) => {

    const deque = Array(numberOfCards - 1).fill(0);

    return (
        <div className="innerDequeContainer">
            {bestCard ? (
                <div className="bestCard">
                    <GameCard
                        card={bestCard}
                        clickHandler={() => {}}
                    >
                    </GameCard>
                </div>
            ) : (
                <></>
            ) }

            {deque.map((card, index) => (
                <div key={index} className="deque">
                    {index !== deque.length - 1 ? (
                        <OtherCard>
                        </OtherCard>
                    ) : (
                        <></>
                    ) }
                </div>
            ))}
        </div>
    );
}