const mongoose = require('mongoose')
const User = require('./User')

const roomSchema = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, auto: true},
    owner: User.schema,
    name: String,
    game: String,
    players: [User.schema],
    isPrivate: Boolean,
    chatHistory: [Object]
});

module.exports = mongoose.model('Room', roomSchema)