import React from "react";
import {GameCard} from "./Card";
import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card";


export const Hand = ({player, cards, attack, chooseCard, isDefending, isTaking}) => {

    const color = isDefending === true ? "#03a9f4" : "black";

    const clickHandler = (card) => {
        isDefending ? chooseCard(card): attack(card) ;
    }

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{color: color, marginBottom: 10}}>
                <h9>
                    {player}
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