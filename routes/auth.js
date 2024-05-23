const { Router } = require("express");
const router = Router({ mergeParams: true });

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JSONSECRET = 'kyleSecret';

const userDAO = require('../daos/user');

// Middleware to verify they are currently a User
async function isUser(req, res, next) {
    // Verify the User is in the Database
    const userCheck = await userDAO.getUser(req.body['email']);
    // Send a 401 if the User does not exist
    if (!userCheck) {
        res.status(401).send("User Does Not Exist");
    } else {
        next();
    }
}

// Verifies a Password Is Not Provided or Empty
async function emptyPassword (req, res, next) {
    if ('password' in req.body === false) {
        res.status(400).send("Password Is Required and Cannot be Empty");
    } else if (req.body['password'] === '') {
        res.status(400).send("Password Is Required and Cannot be Empty");
    } else {
        next();
    }
};

const postSignup = [ emptyPassword ];
router.post("/signup", postSignup, async(req, res, next) => {
    const userObj = req.body;

    try{
        // Create a Hash of the password
        const hashPass = await bcrypt.hash(userObj['password'], 1);
        userObj['password'] = hashPass;
        const newUser = await userDAO.createUser(userObj);
        res.json(newUser);
        res.status(200);
    // 409 Error Comes from the USER DAO for Duplicate Email. 
    } catch(e) {
        res.sendStatus(409)
    }
});


const postLogin = [ isUser, emptyPassword ];
router.post("/login", postLogin, async(req, res, next) => {
    try {
        const userObj = req.body;
        // Make the Call to get the user and compare passwords
        const user = await userDAO.getUser(userObj['email']);
        // Validate the Passwords Match with bcrypt
        bcrypt.compare(req.body['password'], user['password']).then(async result => {
            // If the passwords Match, we need to generate an additional Token. 
            if (result) {
                // Note to self - may need to review the generation of this secret. 
                const data = {"_id": user["_id"], "email": user["email"], "accountBalance": user["accountBalance"], "roles": user["roles"]}
                console.log("here is json Data", data);
                const token = jwt.sign(data, JSONSECRET);
                const tokenJSON = { "token": token}
                res.json(tokenJSON);
                res.status(200);
            // Should Return a 401 when a password Doesn't Match
            } else {
                res.sendStatus(401);
            }
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;