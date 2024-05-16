
const Bet = require("../models/bet");



module.exports = {};

module.exports.createBet = async (betObj) => {
    try{
        betObj['betAcceptor'] = null;
        return await Bet.create(betObj);

    } catch (e) {
        return e;
    }
}
