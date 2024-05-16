const { Router } = require("express");
const router = Router({ mergeParams: true });

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JSONSECRET = 'kyleSecret';

const postSignup = [];
router.post("/signup", postSignup, async(req, res, next) => {
    console.log("Post Signup");
});


const postLogin = [];
router.post("/login", postLogin, async(req, res, next) => {
    console.log("Post Login");
});