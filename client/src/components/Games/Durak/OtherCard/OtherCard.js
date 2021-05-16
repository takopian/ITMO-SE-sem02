import React from "react";
import Card from "react-bootstrap/Card";
import './OtherCard.css'


export const OtherCard = () => {
    return (
        <div className="otherCardContainer">
            <Card className="otherCard"
                border="secondary"
            >
                <Card.Img src="https://static7.depositphotos.com/1257959/746/v/600/depositphotos_7461846-stock-illustration-playing-card-back-side-60x90.jpg" alt="Card image"/>
                <Card.ImgOverlay>
                </Card.ImgOverlay>
            </Card>
        </div>
    )
}