import React from "react";
import Card from "react-bootstrap/Card";


export const OtherCard = () => {
    return (
        <Card
            style={{
                marginRight: -15,
                border: 1,
                width: '2.5rem',
                height: '3.5rem',
            }}
            className="mb-sm-n1"
            border="secondary"
        >
            <Card.Img src="https://static7.depositphotos.com/1257959/746/v/600/depositphotos_7461846-stock-illustration-playing-card-back-side-60x90.jpg" alt="Card image"/>
            <Card.ImgOverlay>
            </Card.ImgOverlay>
        </Card>
    )
}