const roomDAO = require('../dao/roomDAO');

class MainPageSocketListener {
    socket;
    games;
    io;
    roomIO

    async createRoom({name, user, game, isPrivate}) {
        console.log('create room');
        const newRoomId = await roomDAO.createRoom(name, user, game, isPrivate);
        this.socket.join(newRoomId);
        this.io.to(newRoomId).emit('room created', newRoomId);
        console.log("room created.");
        const rooms = await roomDAO.getRooms();
        this.io.to('common room').emit('roomsData', {rooms});
    }

    async joinRoom({user, roomId}) {
        let room;
        if (this.games[roomId] !== undefined) {
            room = await roomDAO.joinRoomAsSpectator(roomId, user);
            this.games[roomId].joinAsSpectator(user);
        } else {
            room = await roomDAO.joinRoomAsPlayer(roomId, user);
        }
        console.log(`user ${user._id} joined ${roomId}`);
        this.roomIO.to(roomId).emit('info', {room});
        const rooms = await roomDAO.getRooms();
        this.io.to('common room').emit('roomsData', {rooms});
    }

    disconnect() {
        console.log('User had left main page.');
    }

    constructor(socket, io, roomIO, games) {
        this.socket = socket;
        this.io = io;
        this.roomIO = roomIO;
        this.games = games;
        this.createRoom = this.createRoom.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.listen = this.listen.bind(this);
    }

    async listen() {
        console.log("New socket connection.");
        this.socket.join('common room');
        const rooms = await roomDAO.getRooms();
        this.io.to('common room').emit('roomsData', {rooms});

        this.socket.on('create room', this.createRoom);
        this.socket.on('join room', this.joinRoom);
        this.socket.on('disconnect', this.disconnect);
    }

}

module.exports = MainPageSocketListener;