let Deque = require('../GameObjects/Deque')
let durak = require('../GameObjects/initDeque')
// import {Deque} from '../GameObjects/Deque'
// import {durak} from "../GameObjects/initDeque";

class DurakDeque extends Deque {
    constructor() {
        super();
        this.cards = durak;
    }
}

module.exports = DurakDeque;