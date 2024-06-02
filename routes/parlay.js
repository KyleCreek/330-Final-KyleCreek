const { Router } = require("express");
const router = Router({ mergeParams: true });

const jwt = require('jsonwebtoken');
const JSONSECRET = 'kyleSecret';

// Data Access Objects
const betDAO = require("../daos/bet");
const parlayDAO = require("../daos/parlay");

// -- Middleware Functions
// Verifies a user is authorized
async function isAuthorized (req, res, next){
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')){
        // Extract Token
        const token = authHeader.split(' ')[1];
        // Decode Token
        const decoded = jwt.decode(token);
        //console.log("here is decoded", decoded);
        if (!decoded){
            res.status(401).send("Invalid Token Provided");
        } else {
            // Need to make an Object here because of the Strings that represent the bets. 
            const user = {
                email: decoded['email'],
                userId: decoded['_id'],
                roles: decoded['roles'],
                accountBalance: decoded['accountBalance']
            }
            req.body.user = user;
            next();
        }
    } else {
        res.status(401).send("token is not present");
    }

};

// Verifies if a parlay exists in the database
async function checkParlay (req, res, next) {
    try{
        const parlayResponse = await parlayDAO.getSingleParlay(req.params.id);
        if (parlayResponse) {
            req.body.parlay = parlayResponse;
            next();
        } else {
            res.status(404).send("Parlay ID Does Not Exist");
        }

    } catch (e) {
        return e;
    }
};
const postParlay = [ isAuthorized ];
router.post("/", postParlay, async(req, res, next) => {
    // Reject Parlays with only One bet
    if (req.body.length <= 1) {
        res.status(400).send("Parlays Require more than one bet");
    } else {
        // Validate that all the IDs sent are actual IDs
        // Testing has determined that the Body.length knows that the User Object is Different
        // Not Sure how or Why but it works. 
        let betList = []
        let betObject;
        let parlayCost = 0;
        let flag = true;
        for (let i=0; i < req.body.length; i++) {
            try{
                betObject = await betDAO.getSingleBet(req.body[i]);
                if (betObject){
                    parlayCost += betObject.price;
                    betList.push(betObject);
                } else {
                    flag = false;
                }
            } catch (e) {
                return e;
            }
        }
        if (!flag) {
            res.status(404).send("Invalid BetID Detected");
        } else{
            const parlayObj = {
                parlayInitiator: req.body.user.userId,
                parlayBets: betList,
                parlayCost: parlayCost
            }
            const parlayResponse = await parlayDAO.createParlay(parlayObj);
            res.json(parlayResponse);
            res.status(200);
        }
    };
});


const getParlays = [ isAuthorized ];
router.get("/", getParlays, async(req, res, next) => {
    if (req.body.user.roles.includes('admin')){
        const response = await parlayDAO.getAllParlays();
        res.json(response);
        res.status(200);
    } else {
        res.status(400).send("Not Done Developing THis yet");
    }
});

const getParlay = [ isAuthorized, checkParlay ];
router.get("/:id", getParlay, async(req, res, next) => {
    console.log("Body in GET/ID", req.body);
    res.status(200);
});

const editParlay = [ isAuthorized, checkParlay ];
router.put("/:id", editParlay, async(req, res, next) => {
    console.log("in Put route", req.body);
    if (req.body.user.roles.includes('admin')){
        const response = await parlayDAO.getAllParlays();
        res.json(response);
        res.status(200);
    } else {
        res.status(401).send("Unathorized");
    }
});

const deleteParlay = [ isAuthorized, checkParlay ];
router.delete("/:id", deleteParlay, async(req, res, next) => {
    if (req.body.user.roles.includes('admin')){
        const response = await parlayDAO.getAllParlays();
        res.json(response);
        res.status(200);
    } else {
        res.status(401).send("Unauthorized");
    }
});

module.exports = router;