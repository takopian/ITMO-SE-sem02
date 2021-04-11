function genDurakInitDeque() {
    let result = [];
    const suits = ['\u2664', '\u2665', '\u2667', '\u2666'];
    const values = ['6', '7', '8', '9', '10',  'Jack', 'Queen', 'King', 'Ace'];
    for (let suit of suits) {
        for (let value of values) {
            result.push({suit, value});
        }
    }
    return result;
}

module.exports = genDurakInitDeque;