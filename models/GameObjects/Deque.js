
class Deque {
    cards;

    constructor() {
        this.cards = [];
    }

    shuffleDeque(){
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    getTopCard(){
        if (this.cards.length > 0) {
            return this.cards.pop();
        }
        return null;
    }

    peekTopCard(){
        if (this.cards.length > 0) {
            return this.cards[this.cards.length - 1];
        }
        return  null;
    }

    addCard(card) {
        this.cards.push(card);
    }

    getSize() {
        return this.cards.length;
    }
}

module.exports = Deque;