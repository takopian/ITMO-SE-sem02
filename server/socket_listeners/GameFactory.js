const DurakGame = require('../models/Durak/DurakGame')

class GameFactory {
    gameMap;
    constructor() {
        this.gameMap = new Map([["Дурак", DurakGame]]);
    }

    createGame(gameName) {
        if (this.gameMap.get(gameName)) {
            return this.gameMap.get(gameName);
        }
        throw new RangeError("Unknown game");
    }
}

module.exports = GameFactory