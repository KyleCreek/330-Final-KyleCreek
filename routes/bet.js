const { Router } = require("express");
const router = Router({ mergeParams: true });

const jwt = require('jsonwebtoken');
const JSONSECRET = 'kyleSecret';

const postBets = [];
router.post("/", postBets, async(req, res, next) => {
    console.log("Post ALL Bets");
});


const getBets = [];
router.get("/", getBets, async(req, res, next) => {
    console.log("Get ALL Bets");
});

const getBet = [];
router.get("/:id", getBet, async(req, res, next) => {
    console.log("Get Single Bet");
});

const editBet = [];
router.put("/:id", editBet, async(req, res, next) => {
    console.log("Edit Single Bet");
});

const deleteBet = [];
router.delete("/:id", deleteBet, async(req, res, next) => {
    console.log("Delete Single Bet");
});

module.exports = router;