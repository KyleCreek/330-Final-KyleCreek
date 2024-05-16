
const Bet = require("../models/bet");

module.exports = {};

module.exports.createBet = async (betObj) => {
    try{
        // Insert More Information here
        return await Bet.create(betObj);
    } catch (e) {
        return e;
    }
}
