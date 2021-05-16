const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, auto: true},
    uid: String,
    email: String,
    name: String,
    pic: String,
    isOnline: Boolean,
    joinedRoom: String
});

module.exports = mongoose.model('User', UserSchema)