const { Router } = require("express");
const router = Router({ mergeParams: true });

const jwt = require('jsonwebtoken');
const JSONSECRET = 'kyleSecret';

const postParlay = [];
router.post("/", postParlay, async(req, res, next) => {
    console.log("Post Parlay");
});


//const getParlays = [];
//router.get("/", getParlays, async(req, res, next) => {
//    console.log("Get ALL Parlays");
//});

const getParlay = [];
router.get("/:id", getParlay, async(req, res, next) => {
    console.log("Get Single Parlay");
});

const editParlay = [];
router.put("/:id", editParlay, async(req, res, next) => {
    console.log("Edit Single Parlay");
});

const deleteParlay = [];
router.delete("/:id", deleteParlay, async(req, res, next) => {
    console.log("Delete Single Parlay");
});

module.exports = router;