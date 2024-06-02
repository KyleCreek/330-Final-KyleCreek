
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

module.exports.getSingleParlay = async(parlayId) =>{
    try{
        return await Parlay.findOne( {_id : parlayId}).lean();

    } catch (e) {
        return e;
    }
};