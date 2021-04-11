import React, {useState} from "react";
import Card from "react-bootstrap/Card";

let styles = {
    mouseOff: {
        marginBottom: 0,
        width: '3rem',
        height: '4rem',
        fontSize: '11px'
    },
    mouseOn: {
        marginBottom: 30,
        color: "blue",
        width: '3rem',
        height: '4rem',
        fontSize: '11px'
    },
}

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
        <div onClick={() => clickHandler(card)} onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
            {mouseOn ? (
                <Card
                    style={styles.mouseOn}
                    className="mb-sm-n1"
                >
                    <Card.Body>
                        <Card.Title style={{position: 'absolute', top: 0, left: 0, fontSize:'12px'}}>{card.value}</Card.Title>
                        <Card.Text>
                            {card.suit}
                        </Card.Text>
                    </Card.Body>
                </Card>

            ) : (
                <Card
                    style={styles.mouseOff}
                    className="mb-2"
                >
                    <Card.Body>
                        <Card.Title style={{position: 'absolute', top: 0, left: 0, fontSize:'12px'}}> {card.value} </Card.Title>
                        <Card.Text>
                            {card.suit}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}

        </div>
    )
}