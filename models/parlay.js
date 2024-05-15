const mongoose = require("mongoose");

const parlaySchema = new mongoose.Schema({});

module.exports = mongoose.model("parlays", parlaySchema);