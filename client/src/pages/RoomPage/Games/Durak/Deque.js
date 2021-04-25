import React from "react";
import {OtherCard} from "./OtherCard";
import {GameCard} from "./Card";

export const Deque = ({deque}) => {
    return (
        <div
            style={{display: 'flex', flexDirection: 'column'}}
        >
            <div style={{marginBottom:15}}>
            <GameCard
                card={deque[deque.length - 1]}
                clickHandler={() => {}}
            >
            </GameCard>
            </div>
            {deque.map((card, index) => (
                <div style={{marginTop: -51.5}}>
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