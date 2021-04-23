let DurakDeque = require("./DurakDeque")


class DurakGame{
    room;
    deque;
    bestCard;
    hands;
    defendingPlayer;
    lastLost;
    board;
    countToTake;
    countToNextTurn;
    winner;
    loser;

    constructor(room) {
        this.room = room;
        this.deque = new DurakDeque();
        this.lastLost = false;
        this.board = [];
        this.countToTake = 0;
        this.countToNextTurn = 0;
        this.winner = null;
        this.loser = null;
    }

    startUp() {
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

    leaveGame(userId, newRoom) {
        delete this.hands[userId]
        this.room = newRoom;
    }

    attack(userId, card) {
        if (this.board.length < 6) {
            const ind = this.hands[userId].findIndex((element, index, array) => (element.suit === card.suit && element.value === card.value));
            console.log(this.hands[userId], card, ind);
            this.hands[userId].splice(ind, 1);
            this.board.push({key: this.board.length, bottom: {userId, card}, top: null});
        }
        this.countToNextTurn = 0;
    }

    defend(key, topCard) {
        const ind = this.hands[this.defendingPlayer._id].findIndex((element, index, array) => (element.suit === topCard.suit && element.value === topCard.value));
        this.hands[this.defendingPlayer._id].splice(ind, 1);
        this.board[key].top = {userId: this.defendingPlayer._id, card: topCard};
    }

    refillHand(playerId) {
        while (this.hands[playerId].length < 6 && this.deque.getSize() > 0){
            this.hands[playerId].push(this.deque.getTopCard());
        }
        if (this.winner === null && this.hands[playerId].length === 0) {
            this.winner = this.room.players[playerId];
        }
    }
    refillHands() {
        const finalInd = this.room.players.findIndex((element, index, array) => (element._id === this.defendingPlayer._id));
        let curInd = (finalInd - 1) < 0 ? this.room.players.length - 1 : (finalInd - 1);
        for (let i = 0; i < this.room.players.length - 1; i++) {
            if (curInd === finalInd) {
                curInd = (curInd + 1) % this.room.players.length;
                continue;
            }
            let curId = this.room.players[curInd]._id
            this.refillHand(curId);
            curInd = (curInd + 1) % this.room.players.length;
        }

        let finalId = this.room.players[finalInd]._id
        this.refillHand(finalId);
    }

    takeBoardCards() {
        for (let slot of this.board) {
            this.hands[this.defendingPlayer._id].push(slot.bottom.card);
            if (slot.top !== null) {
             this.hands[this.defendingPlayer._id].push(slot.top.card);
            }
        }
        this.lastLost = true;
        this.endOfTurn();
    }

    endOfTurn() {
        this.refillHands();
        this.board = [];
        let loser = this.checkGameEnd();
        if (loser !== null) {
            this.loser = loser;
        }
        let ind = this.lastLost ? 2 : 1;
        this.defendingPlayer = this.room.players[(this.room.players.findIndex((element, index, array) => element._id === this.defendingPlayer._id) + ind) % this.room.players.length];
        this.countToNextTurn = 0;
        this.countToTake = 0;
        this.lastLost = false;
    }

    checkGameEnd() {
        if (this.deque.length > 0) {
            return null;
        }
        let notEmptyHands = [];
        for (let userId in this.hands) {
            if (this.hands[userId].length > 0) {
                notEmptyHands.push(userId);
            }
        }
        if (notEmptyHands.length === 1){
            return notEmptyHands[0];
        }
        return null;
    }
}

module.exports = DurakGame;