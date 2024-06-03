
const Parlay = require("../models/parlay");

module.exports = {};

module.exports.createParlay = async(parlayObj) => {
    try{
        return await Parlay.create(parlayObj);

    } catch (e) {
        return e;
    }
};

module.exports.getAllParlays = async() =>{
    try{
        return await Parlay.find().lean();

    } catch (e) {
        return e;
    }
};

module.exports.getSingleParlay = async(parlayId) => {
    try{
        return await Parlay.findOne( {_id : parlayId}).lean();

    } catch (e) {
        return e;
    }
};

module.exports.getUserParlay = async(userId) => {
    try{
        return await Parlay.aggregate([{$match: {parlayInitiator: userId}}]);
    } catch (e) {
        return e;
    }
};

module.exports.deleteParlay = async(parlayId) => {
    try {
        return await Parlay.deleteOne( { _id: parlayId } );

    } catch (e) {
        return e;
    }
}