import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import './Card.css'

export const GameCard = ({ card, clickHandler}) => {
    const [mouseOn, setMouseOn] = useState(false)

    const mouseEnterHandler = () => {
        setMouseOn(true);
        console.log("enter");
    }

    const mouseLeaveHandler = () => {
        setMouseOn(false);
        console.log("leave");
    }

    return (
        <div className="cardContainer" onClick={() => clickHandler(card)} onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
            {mouseOn ? (
                        <Card className="mouseOn">
                            <Card.Body>
                                <Card.Title className="cardTitle">
                                    {card.value}
                                </Card.Title>
                                <Card.Text>
                                    {card.suit}
                                </Card.Text>
                            </Card.Body>
                        </Card>
            ) : (
                <Card className="mouseOff" style={{width:'150'}}>
                    <Card.Body>
                        <Card.Title className="cardTitle"
                        >
                            {card.value}
                        </Card.Title>
                        <Card.Text>
                            {card.suit}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}

        </div>
    )
}