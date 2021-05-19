function genDurakInitDeque() {
    let result = [];
    const suits = ['S', 'H', 'C', 'D'];
    const values = ['6', '7', '8', '9', '10',  'J', 'Q', 'K', 'A'];
    for (let suit of suits) {
        for (let value of values) {
            result.push({suit, value});
        }
    }
    return result;
}

module.exports = genDurakInitDeque;