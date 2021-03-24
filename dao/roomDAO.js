
const Room = require('../models/Room');

async function getRooms () {
    const rooms = await Room.find({});
    return rooms;
}

async function getPlayers (roomId) {
    const room = await Room.findOne({_id: roomId});
    return room.players;
}

async function joinRoom (roomId, user) {
    await Room.findOneAndUpdate(
        { _id: roomId },
        { $push: { players: user }}
    );
}

async function leaveRoom (roomId, user) {
    await Room.findOneAndUpdate(
        { _id: roomId },
        { $pull: { players: user }}
    );
}

async function createRoom (name, owner, game, isPrivate) {
    const room = new Room();
    room.name = name;
    room.owner = owner;
    room.game = game;
    room.isPrivate = isPrivate;
    room.players = [owner];
    room.save(function(err) {
        if (err)
            throw err;
    });
}

async function deleteRoom (roomId) {
    await Room.deleteOne({_id: roomId});
}

module.exports = {getRooms, getPlayers, joinRoom, leaveRoom, createRoom, deleteRoom}