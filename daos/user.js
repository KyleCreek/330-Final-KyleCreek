const User = require("../models/user");

module.exports = {};

module.exports.createUser = async (userObj) => {
    userObj['roles'] = ['user'];
    userObj['accountBalance'] = 0;
    return await User.create(userObj);
}

// Should get a user record using their email
module.exports.getUser = async (email) => {
    try{
        return await User.findOne( {email: email}).lean();
    } catch (e) {
        return e;
    }
}