class DurakSocketListener {
    socket;
    durakIO;
    roomIO;
    games;

    sendInfo(game) {
        let gameInfo = {...game, discardedCards: game.discardedCards.length, deque: game.deque.cards.length, hands: {}}
        for (let player of game.room.players) {
            gameInfo.hands[player._id] = game.hands[player._id].length;
        }

        for (let spec of game.room.spectators) {
            this.durakIO.to(spec._id.toString()).emit('game state', {game: gameInfo});
        }

        for (let player of game.room.players) {
            gameInfo.hands[player._id] = game.hands[player._id];
            this.durakIO.to(player._id.toString()).emit('game state', {game: gameInfo});
            gameInfo.hands[player._id] = game.hands[player._id].length;
        }
    }

    gameInfo({roomId, userId}) {
        console.log("game info");
        this.socket.join(userId);
        this.socket.join(roomId);
        this.sendInfo(this.games[roomId]);
    }

    attack({roomId, userId, card}) {
        console.log("attack", roomId, userId, card);
        this.games[roomId].attack(userId, card);
        this.sendInfo(this.games[roomId]);
    }

    defend({roomId, key, topCard}) {
        console.log("defend");
        this.games[roomId].defend(key, topCard);
        this.sendInfo(this.games[roomId]);
    }

    takeBoardCards({roomId}) {
        console.log("take board cards");
        this.games[roomId].countToTake += 1;
        if (this.games[roomId].countToTake === this.games[roomId].room.players.length) {
            this.games[roomId].takeBoardCards();
        }
        this.sendInfo(this.games[roomId]);
    }

    nextTurn({roomId}) {
        console.log("next turn");
        this.games[roomId].countToNextTurn += 1;
        if (this.games[roomId].countToNextTurn === this.games[roomId].room.players.length - 1) {
            this.games[roomId].endOfTurn();
        }
        this.sendInfo(this.games[roomId]);
    }

    gameFinished({roomId}) {
        console.log("game finished");
        this.roomIO.to(roomId).emit("game finished", ({roomId}));
    }

    constructor(socket, durakIO, roomIO, games) {
        this.socket = socket;
        this.durakIO = durakIO;
        this.roomIO = roomIO;
        this.games = games;

        this.gameInfo = this.gameInfo.bind(this);
        this.attack = this.attack.bind(this);
        this.defend = this.defend.bind(this);
        this.takeBoardCards = this.takeBoardCards.bind(this);
        this.nextTurn = this.nextTurn.bind(this);
        this.gameFinished = this.gameFinished.bind(this);
    }

    async listen() {
        console.log("New durak socket connection.");
        this.socket.on('disconnect', () => {
            console.log('User had left durak game.')
        });

        this.socket.on('game info', this.gameInfo);
        this.socket.on('attack', this.attack);
        this.socket.on('defend', this.defend);
        this.socket.on('take board cards', this.takeBoardCards);
        this.socket.on('next turn', this.nextTurn);
        this.socket.on('game finished', this.gameFinished);
    }
}

module.exports = DurakSocketListener;
