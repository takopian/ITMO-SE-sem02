const roomDAO = require('../dao/roomDAO');
const DurakGame = require('../models/Durak/DurakGame')
const User = require('../models/User');
const GameFactory = require('./GameFactory')

class RoomPageSocketListener {
    socket;
    games;
    io;
    roomIO

    async startGame({roomId}) {
        console.log("start game");
        let room = await roomDAO.getRoomById(roomId);
        const factory = new GameFactory();
        const gameConstructor = factory.createGame(room.game);
        let game = new gameConstructor(room);
        game.startUp();
        const message = {text:"Козырь: " + game.bestCard.suit, name: "Дурак", pic: ''};
        await roomDAO.addMessage(roomId, message);
        this.games[roomId] = game;
        room = await roomDAO.getRoomById(roomId);
        this.roomIO.to(roomId).emit('game started');
        this.roomIO.to(roomId).emit('info', {room});
    }

    async roomInfo({roomId}) {
        console.log('room info');
        this.socket.join(roomId);
        const room = await roomDAO.getRoomById(roomId);
        this.roomIO.to(roomId).emit('info', {room});
        if (this.games[roomId] !== undefined) {
            this.roomIO.to(roomId).emit('game started');
        }
    }

    async continueAsPlayer({roomId, userId}) {
        console.log('continue as player');
        await roomDAO.leaveRoom(roomId, userId);
        const user = await User.findOne({_id: userId});
        await roomDAO.joinRoomAsPlayer(roomId, user);
        const room = await roomDAO.getRoomById(roomId);
        this.roomIO.to(roomId).emit('info', {room});
    }

    async leaveRoom({roomId, userId}) {
        console.log("leave room");
        const isSpectator = await roomDAO.leaveRoom(roomId, userId);
        const room = await roomDAO.getRoomById(roomId);
        this.roomIO.to(roomId).emit('info', {room});
        this.roomIO.to(roomId).emit('user left room', {userId});
        if (this.games[roomId] && !isSpectator) {
            this.roomIO.to(roomId).emit('user left game', {userId});
        }
    }

    continueWithoutUser({roomId, userId}) {
        console.log(`continue without ${userId}`);
        if (this.games[roomId]) {
            this.games[roomId].leaveGame(userId);
            this.roomIO.to(roomId).emit('game started');
        }
    }

    async deleteRoom({roomId, userId}) {
        console.log("delete room");
        await roomDAO.deleteRoom(roomId, userId);
        this.roomIO.to(roomId).emit('delete room', {roomId});
    }

    cleanBoard({roomId}) {
        console.log("clean board");
        delete this.games[roomId];
        this.roomIO.to(roomId).emit('board cleaned');
    }

    async sendMessage({roomId, userId, text}) {
        console.log('send message ', text);
        const user = await User.findOne({_id: userId});
        const message = {text, name: user.name, pic: user.pic};
        await roomDAO.addMessage(roomId, message);
        const room = await roomDAO.getRoomById(roomId);
        this.roomIO.to(roomId).emit('info', {room});
    }

    constructor(socket,roomIO, games) {
        this.socket = socket;
        this.roomIO = roomIO;
        this.games = games;
        this.startGame = this.startGame.bind(this);
        this.cleanBoard = this.cleanBoard.bind(this);
        this.continueAsPlayer = this.continueAsPlayer.bind(this);
        this.continueWithoutUser = this.continueWithoutUser.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.roomInfo = this.roomInfo.bind(this);
        this.sendMessage =this.sendMessage.bind(this);
        this.listen = this.listen.bind(this);
    }

    async listen() {
        console.log("New room socket connection.");

        this.socket.on('disconnect', () => {
            console.log('User had left room.');
        });

        this.socket.on('start game', this.startGame);
        this.socket.on('room info', this.roomInfo);
        this.socket.on('continue as player', this.continueAsPlayer);
        this.socket.on("leave room", this.leaveRoom);
        this.socket.on("continue without user", this.continueWithoutUser);
        this.socket.on("delete room", this.deleteRoom);
        this.socket.on("clean board", this.cleanBoard);
        this.socket.on('send message', this.sendMessage);
    }

}

module.exports = RoomPageSocketListener;