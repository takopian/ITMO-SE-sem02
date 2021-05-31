import React from "react";
import {GameCard} from "../Card/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card";
import './Hand.css'
import {OtherCard} from "../OtherCard/OtherCard";


export const Hand = ({player, cards, attack, chooseCard, isDefending, isTaking, numberOfCards, isOwn}) => {
    const color = isDefending === true ? "#03a9f4" : "black";

    const clickHandler = (card) => {
        isDefending ? chooseCard(card): attack(card) ;
    }

    if (isOwn) {
        return (
            <div className="handOuterContainer">
                <div className="infoContainer">
                    <div className="playerName">
                        <h9>
                            {player}
                        </h9>
                    </div>
                    <div className="takingCardMessage">
                        {isTaking ?
                            (
                                <Card className="card"
                                >
                                    <Card.Body>
                                        <Card.Text className="cardText">
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
                </div>
                <div className="card-group">
                        { cards.map(
                            ((card, ind) => (
                                <div key={card.value + card.suit}>
                                <GameCard
                                    clickHandler={clickHandler}
                                    card={card}
                                >
                                </GameCard>
                                </div>
                            )))
                        }
                </div>
            </div>
        );
    } else {
        return (
            <div className="otherHandOuterContainer">
                <div className="infoContainer">
                    <div className="playerName">
                        <h9>
                            {player.name}
                        </h9>
                    </div>
                    <div className="takingCardMessage">
                        {isTaking ?
                            (
                                <Card
                                    className="card"
                                >
                                    <Card.Body>
                                        <Card.Text className="cardText">
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
                </div>
                <div className="card-group">

                        {[...Array(numberOfCards)].map((value, index) => (
                            <OtherCard/>
                        ))
                        }

                </div>
            </div>
        );
    }

}