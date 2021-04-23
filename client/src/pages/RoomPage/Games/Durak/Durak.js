import React, {useState, useEffect} from "react";
import io from 'socket.io-client';
import Button from "react-bootstrap/Button";
import {Hand} from "./Hand";
import {Slots} from "./Slots";
import {OtherHand} from "./OtherHand";
import {Deque} from "./Deque";

let socket;

export const Durak = ({room, userId}) => {
    const ENDPOINT = 'localhost:5000';
    const [game, setGame] = useState();
    const [slots, setSlots] = useState([]);
    const [defending, setDefending] = useState();
    const [chosenCard, setChosenCard] = useState(null);
    const [countToTake, setCountToTake] = useState(0);
    const [countToNextTurn, setCountToNextTurn] = useState(0);
    const [clickedNextTurn, setClickedNextTurn] = useState(false);
    const [clickedTakeCards, setClickedTakeCards] = useState(false);
    const [winner, setWinner] = useState(null);
    const [loser, setLoser] = useState(null);
    const [otherHands, setOtherHands] = useState([]);
    const [otherHandsStyles, setOtherHandsStyles] = useState([]);


    const attack = (card) => {
        if (userId !== defending._id) {
            socket.emit("attack", {roomId: room._id, userId, card});
        }
    }

    const chooseCard = (card) => {
        if (chosenCard && chosenCard === card) {
            setChosenCard(null);
            return;
        }
        setChosenCard(card);
    }

    const defend = (key, topCard) => {
        if (userId === defending._id && chosenCard) {
            socket.emit("defend", {roomId: room._id, key, topCard});
        }
    }

    const takeBoardCards = () => {
        if (slots.length > 0) {
            setClickedTakeCards(true);
            socket.emit("take board cards", {roomId: room._id});
        }
    }

    const nextTurn = () => {
        setClickedNextTurn(true);
        socket.emit("next turn", {roomId: room._id});
    }

    const angleToStyle = (angle) => {
        const rad = 20;
        const leftVal = 40;
        const bottomVal = 50;
        if (angle > 0 && angle < 90){
            const left = leftVal - rad * Math.sin(angle * Math.PI / 180);
            const bottom = bottomVal - rad * Math.cos(angle * Math.PI / 180);
            return {left, bottom};
        }
        if (angle === 90) {
            return {left: leftVal - rad, bottom: bottomVal};
        }
        if (angle > 90 && angle < 180){
            const left = leftVal - rad * Math.sin((180 - angle) * Math.PI / 180);
            const bottom = bottomVal + rad * Math.cos((180 - angle) * Math.PI / 180);
            return {left, bottom};
        }
        if (angle === 180) {
            return {left: leftVal, bottom: bottomVal + rad};
        }
        if (angle > 180 && angle < 270){
            const left = leftVal + rad * Math.sin((angle - 180) * Math.PI / 180);
            const bottom = bottomVal + rad * Math.cos((angle - 180) * Math.PI / 180);
            return {left, bottom};
        }
        if (angle === 270) {
            return {left: leftVal + rad, bottom: bottomVal};
        }
        if (angle > 270 && angle < 360){
            const left = leftVal + rad * Math.sin((360 - angle) * Math.PI / 180);
            const bottom = bottomVal - rad * Math.cos((360 - angle) * Math.PI / 180);
            return {left, bottom};
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT, {path: "/game/durak"});
        socket.emit("game info", ({roomId: room._id, userId}));
        return () => {}
    }, [ENDPOINT]);


    useEffect(() => {
        socket.on('game state', ({game}) => {
            console.log(game);
            setDefending(game.defendingPlayer);
            setSlots(game.board)
            setCountToTake(game.countToTake);
            setCountToNextTurn(game.countToNextTurn);
            if (game.countToNextTurn === 0) { setClickedNextTurn(false); }
            if (game.countToTake === 0) { setClickedTakeCards(false); }
            setWinner(game.winner);
            setLoser(game.loser);
            setGame(game);
        });
    },[]);

    useEffect(() => {
        if (game) {
            let curInd = (game.room.players.findIndex(
                (element, index, array) => (element._id === userId)) + 1) % game.room.players.length;
            const angleStep = 360 / game.room.players.length;
            let curAngle = angleStep;
            let newOtherHands = []
            let newOtherHandsStyles = []
            for (let i = 0; i < game.room.players.length - 1; i++) {
                console.log(curInd, game.room.players, game.room.players[curInd]);
                newOtherHands.push({name: game.room.players[curInd].name, numberOfCards: game.hands[game.room.players[curInd]._id]});
                let newStyle = angleToStyle(curAngle);
                newStyle.left = newStyle.left.toString() + '%';
                newStyle.bottom = newStyle.bottom.toString() + '%';
                newOtherHandsStyles.push(newStyle);
                setOtherHands(newOtherHands);
                setOtherHandsStyles(newOtherHandsStyles);
                curInd = curInd + 1 % game.room.players.length;
                curAngle += angleStep;
            }
            console.log(otherHands, otherHandsStyles);
        }
    }, [game]);

    return (
        <div>
        { game ? (
                <div style={{display: 'flex', flexDirection: 'column'}}>

                    <div>
                        {countToTake ?
                            (<h2>{game.defendingPlayer.name} is taking cards</h2>) :
                            (<h2>Defending player - {game.defendingPlayer.name}</h2>)
                        }
                    </div>
                    <div style={{marginLeft: '20%', position: "fixed", top: '40%', width:'13%'}}>
                        <div>
                            <Slots
                                slots={slots}
                                defend={defend}
                                isDefending={userId === defending._id}
                                chosenCard={chosenCard}
                            >
                            </Slots>
                        </div>
                    </div>
                    { game.deque.cards.length > 0 ? (
                        <div style={{marginLeft: '10%', position: "fixed", top: '40%', width:'13%'}}>
                            <Deque
                                deque={game.deque.cards}
                            >
                            </Deque>
                        </div>
                    ) :(
                        <></>
                    )}
                    <div style={{marginLeft: '20%', position: "fixed", top: '40%', width:'13%'}}>
                        <div>
                            <Slots
                                slots={slots}
                                defend={defend}
                                isDefending={userId === defending._id}
                                chosenCard={chosenCard}
                            >
                            </Slots>
                        </div>
                    </div>
                        {otherHands.map((hand, index) => (
                            <div style={{...otherHandsStyles[index], position: "fixed"}}>
                                <OtherHand
                                player={hand.name}
                                numberOfCards={hand.numberOfCards}
                                >
                                </OtherHand>
                            </div>
                        ))}
                    <div style={{marginLeft: '20%', position: "fixed", bottom: '10%', width:'40%'}}>
                        { game && game.hands? (
                                <Hand
                                    cards={game.hands[userId]}
                                    attack={attack}
                                    chooseCard={chooseCard}
                                    isDefending={userId === defending._id}
                                >
                                </Hand>
                            )
                            :
                            (<></>)
                        }
                    </div>
                    <div style={{position: "fixed", left: "30%", bottom: '5%', width:'40%'}}>
                        {defending._id === userId && slots.length > 0 ? (
                            <div>
                                <Button
                                    onClick={takeBoardCards}
                                    disabled={countToTake > 0}
                                >
                                    Take cards
                                </Button>
                            </div>
                        ) : (
                            <></>
                        )}
                        {defending._id !== userId && slots.length > 0 && countToTake === 0 ? (
                            <div>
                                <Button
                                    onClick={nextTurn}
                                    disabled={clickedNextTurn}
                                >
                                    End turn
                                </Button>
                            </div>
                        ) : (
                            <></>
                        )}
                        {defending._id !== userId && slots.length > 0 && countToTake > 0 ? (
                            <div>
                                <Button
                                    onClick={takeBoardCards}
                                    disabled={clickedTakeCards}
                                >
                                    Ok
                                </Button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}