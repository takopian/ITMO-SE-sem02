import React from "react";
import Card from "react-bootstrap/Card";
import './OtherCard.css'


export const OtherCard = () => {
    return (
        <div className="otherCardContainer">
            <Card className="otherCard"
                border="secondary"
            >
                <Card.Img src={process.env.PUBLIC_URL + '/durak/PNG/gray_back.png'} alt="Card image"/>
            </Card>
        </div>
    )
}