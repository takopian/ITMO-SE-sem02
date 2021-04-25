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
    discardedCards;
    finishedPlayers;

    constructor(room) {
        this.room = room;
        this.deque = new DurakDeque();
        this.lastLost = false;
        this.board = [];
        this.countToTake = 0;
        this.countToNextTurn = 0;
        this.winner = null;
        this.loser = null;
        this.discardedCards = [];
        this.finishedPlayers = new Set();
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

    leaveGame(userId) {
        let ind = this.room.players.findIndex((element, index, array) =>
            (element._id.toString() === userId.toString()));
        if (ind !== -1) { this.room.players.splice(ind, 1); }
        this.discardHand(userId);
    }

    attack(userId, card) {
        if (this.board.length < 6) {
            const ind = this.hands[userId].findIndex((element, index, array) => (element.suit === card.suit && element.value === card.value));
            this.hands[userId].splice(ind, 1);
            this.board.push({key: this.board.length, bottom: {userId, card}, top: null});
            if (this.winner === null && this.deque.length === 0 && this.hands[userId].length === 0) {
                const winnerInd = this.room.players.findIndex((element, index, array) => (element._id === userId));
                this.winner = this.room.players[winnerInd]._id;
            }
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
        if (this.hands[playerId].length === 0) {
            if (this.winner === null) {
                this.winner = playerId;
            }
            this.finishedPlayers.add(playerId);
        }
    }

    refillHands() {
        const finalInd = this.room.players.findIndex((element, index, array) => (element._id === this.defendingPlayer._id));
        let curInd = (finalInd - 1) < 0 ? this.room.players.length - 1 : (finalInd - 1);
        for (let i = 0; i < this.room.players.length; i++) {
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

    discardBoard(){
        for (let slot of this.board) {
            this.discardedCards.push(slot.bottom.card);
            if (slot.top !== null) { this.discardedCards.push(slot.top.card);}
        }
        this.board = [];
    }

    discardHand(userId) {
        for (let card of this.hands[userId]) {
            this.discardedCards.push(card);
        }
        delete this.hands[userId];
    }

    endOfTurn() {
        this.refillHands();
        this.discardBoard();
        let loser = this.checkGameEnd();
        if (loser !== null) {
            this.loser = loser;
            return;
        }
        let ind = this.lastLost ? 2 : 1;
        let nextDefInd = (this.room.players.findIndex((element, index, array) => element._id === this.defendingPlayer._id) + ind) % this.room.players.length;
        let nextDef = this.room.players[nextDefInd];
        while (this.finishedPlayers.has(nextDef._id)){
            nextDefInd = (nextDefInd + 1) %  this.room.players.length;
            nextDef = this.room.players[nextDefInd];
        }
        this.defendingPlayer = nextDef;
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