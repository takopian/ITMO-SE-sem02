const Room = require('../models/Room');
const User = require('../models/User')


async function getRooms () {
    const rooms = await Room.find({});
    return rooms;
}

async function getRoomById (roomId) {
    const room = await Room.findOne({_id: roomId});
    return room;
}

async function getPlayers (roomId) {
    const room = await Room.findOne({_id: roomId});
    return room.players;
}

async function joinRoom (roomId, user) {
    let room = await Room.findOne({_id: roomId});
    let ind = room.players.findIndex((element, index, array) => (element._id.toString() === user._id));
    if (ind === -1) {
        // await Room.findOneAndUpdate(
        //     { _id: roomId },
        //     { $push: { players: user }}
        // );
        room.players.push(user);
        room.save()
        const filter = {_id : user._id};
        const update = {joinedRoom : roomId};
        await User.findOneAndUpdate(filter, update);
    }
    return room;
}

async function leaveRoom (roomId, userId) {
    let room = await Room.findOne({_id: roomId});
    let ind = room.players.findIndex((element, index, array) => (element._id.toString() === userId));
    if (ind !== -1) {
        room.players.splice(ind, 1);
        room.save();
        const filter = {_id : userId};
        const update = {joinedRoom : null};
        await User.findOneAndUpdate(filter, update);
    }
}

async function createRoom (name, owner, game, isPrivate) {
    const room = new Room();
    room.name = name;
    room.owner = owner;
    room.game = game;
    room.isPrivate = isPrivate;
    room.players = [owner];
    const roomId = room._id;
    room.save(function( err, res) {
        if (err) {
            throw err;
        }
    });
    const filter = {_id : owner._id};
    const update = {joinedRoom : roomId};
    await User.findOneAndUpdate(filter, update);
    return roomId;
}

async function deleteRoom (roomId, owner) {
    const filter = {_id : owner._id};
    const update = {joinedRoom : null};
    await User.findOneAndUpdate(filter, update);
    await Room.deleteOne({_id: roomId});
}

async function addMessage(roomId, message) {
    await Room.findOneAndUpdate(
        { _id: roomId },
        { $push: { chatHistory: message }}
    );
}

module.exports = {getRooms, getPlayers, joinRoom, leaveRoom, createRoom, deleteRoom, getRoomById, addMessage}