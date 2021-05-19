const mongoose = require('mongoose')
const User = require('./User')

const roomSchema = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, auto: true},
    owner: User.schema,
    name: String,
    game: String,
    players: [User.schema],
    spectators: [User.schema],
    isPrivate: Boolean,
    chatHistory: [Object],
    expire_at: {type: Date, default: Date.now, expires: 72000}
});

module.exports = mongoose.model('Room', roomSchema)