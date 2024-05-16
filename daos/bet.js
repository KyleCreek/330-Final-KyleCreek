
const Bet = require("../models/bet");

const userDAO = ("../daos/user");

module.exports = {};

module.exports.createBet = async (betObj) => {
    try{
        // Insert More Information here
        //return await Bet.create(betObj);

        // Get the User Object ID By Searching for User
        // Must Complete this!
        const idObject = await userDAO.getUserById(betObj['betInitiator']);

        // Complete the Bet Object.
        betObj['betInitiator'] = idObject;
        betObj['betAcceptor'] = null;
        return await Bet.create(betObj);
        
    } catch (e) {
        return e;
    }
}
