
class Hand {
    cards;

    constructor() {
        this.cards = [];
    }

    getCard(ind) {
        const result = this.cards[ind];
        this.cards.splice(ind, 1);
        return result;
    }
}