let Deque = require('../GameObjects/Deque')
let genDurakInitDeque = require('../GameObjects/initDeque')


class DurakDeque extends Deque {
    constructor() {
        super();
        this.cards = genDurakInitDeque();
    }
}

module.exports = DurakDeque;