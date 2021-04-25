import React from "react";
import CardGroup from "react-bootstrap/CardGroup";
import {OtherCard} from "./OtherCard";
import Card from "react-bootstrap/Card";

export const OtherHand = ({player, numberOfCards, isTaking}) => {

    const color = player.isDefending === true ? "#03a9f4" : "black";

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{color: color, marginBottom: 10}}>
            <h9>
                {player.name}
            </h9>
            </div>
            {isTaking ?
                (
                    <Card style={{marginLeft: 20, width: '3rem', height: '2rem'}}
                          className="mb-sm-n1">
                        <Card.Body>
                            <Card.Text style={{position: 'absolute', top: '10%', left: '15%', fontSize:'14px'}}>
                                Беру
                            </Card.Text>

                        </Card.Body>
                    </Card>
                )
                : (
                    <></>
                )
            }
            </div>

            <CardGroup>
                {[...Array(numberOfCards)].map((value, index) => (
                            <OtherCard>
                            </OtherCard>
                ))
                }
            </CardGroup>
        </div>
    );
}