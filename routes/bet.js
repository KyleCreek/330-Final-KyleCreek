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

// Validate Bet Input - Terms
async function termsValidate (req, res, next) {
    if ('terms' in req.body === false) {
        res.status(400).send("Terms are required to Place a Bet");
    } else if (req.body['terms'] === '') {
        res.status(400).send("Terms cannot be an empty string");
    } else {
        next();
    }
};

// Validate Bet Input - Price
async function priceValidate (req, res, next) {
    if ("price" in req.body === false) {
        res.status(400).send("Terms are required to Place a Bet");
    } else if (isNaN(parseInt(req.body['price']))) {
        res.status(400).send("This is Not an Actual Number Doofus")
    } else if (parseInt(req.body['price']) <= 0) {
        res.status(400).send("Need to have a positive integer")
    } else {
        next();
    }
}

// Validate a Bet Actually Exists
async function checkBet (req, res, next) {
    try {
        const betResponse = await betDAO.getSingleBet(req.params.id);
        if (betResponse) {
            next();
        } else {
            res.status(404).send("Bet Does Not Exist")
        }
    } catch(e){
        console.log(e);
        return e;
    }
};

const postBets = [ isAuthorized, userSearch, termsValidate, priceValidate ];
// - Note 5/23: Need to Detemine how to handle Rejections
// Doea it happen in the DAO or in the Route. 
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

const getBet = [ isAuthorized, checkBet ];
router.get("/:id", getBet, async(req, res, next) => {
    try {
        if (req.body.roles.includes('admin')){
            const returnBet = await betDAO.getSingleBet(req.params.id);
            res.json(returnBet);
            res.status(200);
        } else {
            const returnBet = await betDAO.getSingleBet(req.params.id);
            if (req.body.id === returnBet.betInitiator.toString()){
                res.json(returnBet);
                res.status(200);
            } else if (returnBet.betAcceptor) { 
                if (req.body.id === returnBet.betAcceptor.toString()){
                    res.json(returnBet);
                    res.status(200);
                } else {
                    res.status(403);
                }

            } else {
                res.status(403).send("Unauthorized");
            };
        }
    } catch (e){
        res.status(404);
    }
});

// Note: Only Admin Users should be allowed to edit and delete Bets.
// in a practical environment, a User would not be able to edit or delete their bet
// Once posted. That's life baby. 
const editBet = [ isAuthorized, checkBet ];
router.put("/:id", editBet, async(req, res, next) => {
    if (req.body.roles.includes('admin')){
        console.log("admin User");
    } else {
        res.status(403).send("Unauthorized");
    };
});

const deleteBet = [ isAuthorized, checkBet ];
router.delete("/:id", deleteBet, async(req, res, next) => {
    try {
        if (req.body.roles.includes('admin')){
                console.log("admin User");
            } else {
                res.status(403).send("Unauthorized");
            };
    } catch(e) {
        return e;
    }
});

module.exports = router;