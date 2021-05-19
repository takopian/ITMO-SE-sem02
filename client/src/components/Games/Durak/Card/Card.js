import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import './Card.css'

export const GameCard = ({ card, clickHandler}) => {
    const [mouseOn, setMouseOn] = useState(false);
    let cardPath = card.value + card.suit;

    const mouseEnterHandler = () => {
        setMouseOn(true);
        console.log("enter");
    }

    const mouseLeaveHandler = () => {
        setMouseOn(false);
        console.log("leave");
    }

    return (
        <div className="cardContainer"
             onClick={() => clickHandler(card)}
             onMouseEnter={mouseEnterHandler}
             onMouseLeave={mouseLeaveHandler}>
            {mouseOn ? (
                <Card className="mouseOn">
                    <Card.Body>
                        <Card.Img style={{position: "absolute", top: 0, left:0}}
                                  src={process.env.PUBLIC_URL + '/durak/PNG/' + cardPath +'.png'} alt="Card image"/>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="mouseOff">
                    <Card.Body>
                        <Card.Img style={{position: "absolute", top: 0, left:0}}
                                  src={process.env.PUBLIC_URL + '/durak/PNG/' + cardPath +'.png'} alt="Card image"/>
                    </Card.Body>
                </Card>
            )}

        </div>
    )
}