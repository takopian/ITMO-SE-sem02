import React, {useState, useEffect, useCallback} from "react";
import io from 'socket.io-client';
import Button from "react-bootstrap/Button";
import {Hand} from "./Hand/Hand";
import {Slots} from "./Slots/Slots";
import {Deque} from "./Deque/Deque";
import Card from "react-bootstrap/Card";
import {useDispatch, useSelector} from "react-redux";
import {incrementWinnerCounter} from "../../../redux/actions/roomTableActions";
import {setCurrent} from "../../../redux/actions/roomTableActions";
import './Durak.css'

let socket;

export const Durak = ({room, userId}) => {
    const ENDPOINT = 'localhost:5000';
    const [game, setGame] = useState();
    const [slots, setSlots] = useState([]);
    const [defendingPlayer, setDefendingPlayer] = useState();
    const [chosenCard, setChosenCard] = useState(null);
    const [countToTake, setCountToTake] = useState(0);
    const [countToNextTurn, setCountToNextTurn] = useState(0);
    const [clickedNextTurn, setClickedNextTurn] = useState(false);
    const [clickedTakeCards, setClickedTakeCards] = useState(false);
    const [winner, setWinner] = useState(null);
    const [loser, setLoser] = useState(null);
    const [otherHands, setOtherHands] = useState([]);
    const [otherHandsStyles, setOtherHandsStyles] = useState([]);
    const [cardsBeaten, setCardsBeaten] = useState(0);
    const [isSpectator, setIsSpectator] = useState(false);
    const table = useSelector(state => state.roomTableReducer);
    const dispatch = useDispatch();


    const attack = useCallback((card) => {
        if (userId !== defendingPlayer._id) {
            socket.emit("attack", {roomId: room._id, userId, card});
        }
    }, [defendingPlayer])

    const chooseCard = useCallback((card) => {
            if (chosenCard && chosenCard === card) {
                setChosenCard(null);
                return;
            }
            setChosenCard(card);
        }, [chosenCard])

    const defend = useCallback((key, topCard) => {
        if (userId === defendingPlayer._id && chosenCard) {
            socket.emit("defend", {roomId: room._id, key, topCard});
        }
    }, [defendingPlayer, chosenCard])

    const takeBoardCards = useCallback(() => {
        if (slots.length > 0) {
            setClickedTakeCards(true);
            socket.emit("take board cards", {roomId: room._id});
        }
    }, [slots])

    const nextTurn = useCallback(() => {
        setClickedNextTurn(true);
        socket.emit("next turn", {roomId: room._id});
    }, [])

    const angleToStyle = (angle) => {
        const rad = 25;
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
            setDefendingPlayer(game.defendingPlayer);
            setCardsBeaten(game.cardsBeaten);
            setSlots(game.board)
            setCountToTake(game.countToTake);
            setCountToNextTurn(game.countToNextTurn);
            if (game.countToNextTurn === 0) { setClickedNextTurn(false); }
            if (game.countToTake === 0) { setClickedTakeCards(false); }
            setWinner(game.winner);
            if (game.winner !== null) {
                let ind = table.findIndex((element, index, array) => element._id === game.winner);
                if (!table[ind].wins.has(game._id)) {
                    dispatch(incrementWinnerCounter(game._id, game.winner));
                }
            }
            let defendingInd = game.room.players.findIndex(((value, index, obj) => value._id === game.defendingPlayer._id));
            let attackingInd = (defendingInd + 1) % game.room.players.length;
            dispatch(setCurrent(game.room.players[attackingInd]._id.toString()));
            setLoser(game.loser);
            setIsSpectator(game.room.players.findIndex(((value, index, obj) => value._id === userId)) === -1);
            setGame(game);
        });
    },[]);

    useEffect(() => {
        if (loser) {
            socket.emit("game finished", ({roomId: room._id}));
        }
    }, [loser])

    useEffect(() => {
        if (game) {
            let curIndPlayers = game.room.players.findIndex(
                (element, index, array) => (element._id === userId));
            let alterInd = game.room.players.findIndex(
                (element, index, array) => (element._id.toString() === game.room.owner._id.toString()));
            let curInd = curIndPlayers === -1 ? (alterInd + 1) % game.room.players.length : (curIndPlayers + 1) % game.room.players.length;
            const angleStep = 360 / game.room.players.length;
            let curAngle = angleStep;
            let newOtherHands = []
            let newOtherHandsStyles = []
            for (let i = 0; i < game.room.players.length - 1; i++) {
                console.log(game.room.owner.name);
                newOtherHands.push({player: {_id: game.room.players[curInd]._id,
                        name: game.room.players[curInd].name,
                        isDefending: defendingPlayer._id === game.room.players[curInd]._id},
                    numberOfCards: game.hands[game.room.players[curInd]._id]});
                let newStyle = angleToStyle(curAngle);
                newStyle.left = newStyle.left.toString() + '%';
                newStyle.bottom = newStyle.bottom.toString() + '%';
                newOtherHandsStyles.push(newStyle);
                setOtherHands(newOtherHands);
                setOtherHandsStyles(newOtherHandsStyles);
                curInd = (curInd + 1) % game.room.players.length;
                curAngle += angleStep;
            }
        }
    }, [game]);

    useEffect(() => {

    },[])

    return (
        <div className="durakOuterContainer">
        { game ? (
                <div className="durakInnerContainer">
                    <div  className="gameBoardContainer">
                        <Slots
                            slots={slots}
                            defend={defend}
                            isDefending={userId === defendingPlayer._id}
                            chosenCard={chosenCard}
                        >
                        </Slots>
                    </div>
                    { game.deque > 0 ? (
                        <div className="dequeContainer">
                            <Deque
                                numberOfCards={game.deque}
                                bestCard={game.bestCard}
                            >
                            </Deque>
                        </div>
                    ) :(
                        <></>
                    )}
                    {otherHands.map((hand, index) => (
                        <div className="otherHandContainer" style={{...otherHandsStyles[index]}}>
                            <Hand
                            player={hand.player}
                            numberOfCards={hand.numberOfCards}
                            isTaking={hand.player._id === defendingPlayer._id && countToTake > 0}
                            isOwn={false}
                            >
                            </Hand>
                        </div>
                    ))}
                    <div className="handContainer">
                        { game && game.hands && game.room.players.findIndex(
                            (element, index, array) => (element._id === userId)) !== -1 ? (
                                <Hand
                                    player={game.room.players[game.room.players.findIndex(
                                        (element, index, array) => (element._id === userId))].name}
                                    cards={game.hands[userId]}
                                    attack={attack}
                                    chooseCard={chooseCard}
                                    isDefending={userId === defendingPlayer._id}
                                    isTaking={userId === defendingPlayer._id && countToTake > 0}
                                    isOwn={true}
                                />
                            )
                            :
                            (<Hand
                                player={game.room.owner}
                                numberOfCards={game.hands[game.room.owner._id]}
                                isTaking={game.room.owner._id === defendingPlayer._id && countToTake > 0}
                                isOwn={false}
                            />)
                        }
                    </div>
                    <div className="buttonGroup">
                        {defendingPlayer._id === userId && slots.length > 0 ? (
                            <div className="takeCardsButtonContainer">
                                <Button
                                    onClick={takeBoardCards}
                                    disabled={countToTake > 0 || isSpectator}
                                >
                                    Take cards
                                </Button>
                            </div>
                        ) : (
                            <></>
                        )}
                        {defendingPlayer._id !== userId && slots.length > 0 && countToTake === 0 ? (
                            <div className="endTurnButtonContainer">
                                <Button
                                    onClick={nextTurn}
                                    disabled={clickedNextTurn || cardsBeaten < slots.length || isSpectator}
                                >
                                    End turn
                                </Button>
                            </div>
                        ) : (
                            <></>
                        )}
                        {defendingPlayer._id !== userId && slots.length > 0 && countToTake > 0 ? (
                            <div className="confirmEndTurnButtonContainer">
                                <Button
                                    onClick={takeBoardCards}
                                    disabled={clickedTakeCards || isSpectator}
                                >
                                    Ok
                                </Button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    { loser && winner ? (
                        <div className="endGameInfo">
                            <Card className="cardStyle">
                                <Card.Body>
                                    <Card.Text>
                                        Игра окончена. Победитель - {game.room.players[game.room.players.findIndex(
                                        (element, index, array) => (element._id === winner))].name}
                                    </Card.Text>
                                    <Card.Text>
                                        Проигравший - {game.room.players[game.room.players.findIndex(
                                        (element, index, array) => (element._id === loser))].name}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ) : (<></>)
                    }
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}