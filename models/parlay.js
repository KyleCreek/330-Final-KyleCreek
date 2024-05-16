const mongoose = require("mongoose");

const parlaySchema = new mongoose.Schema({
    parlayInitiator: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    parlayBets: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "bet" }],
        required: true,
    },
    parlayCost: { type: Number, required: true},
});

module.exports = mongoose.model("parlays", parlaySchema);