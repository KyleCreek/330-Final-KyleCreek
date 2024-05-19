const User = require("../models/user");

module.exports = {};

module.exports.createUser = async (userObj) => {
    try{
        userObj['roles'] = ['user'];
        userObj['accountBalance'] = 0;
        console.log('user obj prior to commit', userObj);
        return await User.create(userObj);
    } catch (e) {
        return e;
    }
}

// Should get a user record using their email
module.exports.getUser = async (email) => {
    try{
        return await User.findOne( {email: email}).lean();
    } catch (e) {
        return e;
    }
}