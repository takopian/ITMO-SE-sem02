let Game = require("../GameObjects/Game")
let DurakDeque = require("./DurakDeque")

// import {Game} from "../GameObjects/Game";
// import {DurakDeque} from "./DurakDeque";

class DurakGame extends Game {
    room;
    deque;
    bestCard;
    hands;
    defendingPlayer;
    lastLost;

    constructor(room) {
        super();
        this.room = room;
        this.deque = new DurakDeque();
        this.lastLost = false;
    }

    startUp() {
        super.startUp();
        this.deque.shuffleDeque();
        this.bestCard = this.deque.cards[0];
        let hands = {};
        this.defendingPlayer = this.room.players[Math.floor(Math.random() * this.room.players.length)];
        for (let player of this.room.players){
            hands[player._id] = [];
        }
        this.hands = hands;
        this.refillHands();
    }

    refillHands() {
        super.refillHands();
        for (let userId in this.hands) {
            while (this.hands[userId].length < 6 && this.deque.getSize() > 0){
                this.hands[userId].push(this.deque.getTopCard());
            }
        }
    }

    endOfTurn() {
        super.endOfTurn();
        this.refillHands();
        let ind = this.lastLost ? 2 : 1;
        this.defendingPlayer = (this.room.players.findIndex(p => p._id === this.defendingPlayer) + ind) % this.room.players.length;
    }

    checkLoser() {
        super.checkLoser();
        let checkHands = this.hands.filter(({hand}) => hand.length !== 0);
        if (checkHands.length === 1){
            return checkHands[0];
        }
        return null;
    }
}

module.exports = DurakGame;