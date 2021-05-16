const mongoose = require('mongoose');
const User = require('../User');
const Room = require('../Room');
const Card = require('../Card')

const durakSchema = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, auto: true},
    room: Room.schema,
    deque: [Card.schema],
    bestCard: Card.schema,
    hands: Object,
    defendingPlayer: User.schema,
    lastLost: Boolean,
    board: [Object]
});

module.exports = mongoose.model('Durak', durakSchema)