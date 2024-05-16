const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    betInitiator: {type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    betAcceptor: {type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
    price: { type: Number, required: true},
});

module.exports = mongoose.model("bets", betSchema);