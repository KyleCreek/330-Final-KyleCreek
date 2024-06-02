const { Router } = require("express");
const router = Router({ mergeParams: true });

const jwt = require('jsonwebtoken');
const JSONSECRET = 'kyleSecret';

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

}

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
        for (let i=0; i < req.body.length; i++) {
            console.log(req.body[i]);
        }
        res.status(200);
    }

});


const getParlays = [ isAuthorized ];
router.get("/", getParlays, async(req, res, next) => {
    console.log("Get ALL Parlays");
});

const getParlay = [ isAuthorized ];
router.get("/:id", getParlay, async(req, res, next) => {
    console.log("Get Single Parlay");
});

const editParlay = [ isAuthorized ];
router.put("/:id", editParlay, async(req, res, next) => {
    console.log("Edit Single Parlay");
});

const deleteParlay = [ isAuthorized ];
router.delete("/:id", deleteParlay, async(req, res, next) => {
    console.log("Delete Single Parlay");
});

module.exports = router;