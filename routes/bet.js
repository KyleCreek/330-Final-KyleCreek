const { Router } = require("express");
const router = Router({ mergeParams: true });

const jwt = require('jsonwebtoken');
const JSONSECRET = 'kyleSecret';

const betDAO = require('../daos/bet');
const userDAO = require('../daos/user');

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
            req.body.email = decoded['email'];
            req.body.id = decoded['_id'];
            req.body.roles = decoded['roles'];
            req.body.accountBalance = decoded['accountBalance'];
            next();
        }
    } else {
        res.status(401).send("token is not present");
    }

}

// Appends the User Information to the Request Body
async function userSearch (req, res, next) {
    try {
        const user = await userDAO.getUser(req.body.email);
        req.body.user = user;
        next();

    } catch (e){
        return e
    }

}

const postBets = [ isAuthorized, userSearch ];
router.post("/", postBets, async(req, res, next) => {
    try{
        // Create a Bet Object to Send to the DAO
        const betObj = {
            "betInitiator": req.body.user._id,
            "terms": req.body.terms,
            "price": req.body.price
        }
        const betResponse = await betDAO.createBet(betObj);
        res.json(betResponse);
        res.status(200);

    } catch(e) {
        console.log(e);

    }

});


const getBets = [ isAuthorized, userSearch ];
router.get("/", getBets, async(req, res, next) => {
    if (req.body.roles.includes('admin')){
        const adminBets = await betDAO.getAllBets();
        res.json(adminBets);
        res.status(200);

    } else {
        const returnBets = await betDAO.getUserBets(req.body.user._id)
        res.json(returnBets);
        res.status(200);
    }
});

const getBet = [ isAuthorized ];
router.get("/:id", getBet, async(req, res, next) => {
    try {
        if (req.body.roles.includes('admin')){
            const returnBet = await betDAO.getSingleBet(req.params.id);
            res.json(returnBet);
            res.status(200);
        } else {
            const returnBet = await betDAO.getSingleBet(req.params.id);
            // *** Need to add Bet Acceptor as an Option. 
            if (req.body.id === returnBet.betInitiator.toString()){
                res.json(returnBet);
                res.status(200);
            } else {
                res.status(403)
            }
        }

    } catch (e){
        res.status(404);
    }
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