import React from "react";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import {OtherCard} from "./OtherCard";

export const OtherHand = ({player, numberOfCards}) => {
    return (
        <CardGroup>
            {[...Array(numberOfCards)].map((value, index) => (
                        <OtherCard>
                        </OtherCard>
            ))
            }
        </CardGroup>
    );
}