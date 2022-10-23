// Required Libraries
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const moment = require("moment");

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
moment().format();
moment.suppressDeprecationWarnings = true;

// Required Models
const User = require("../models/UserModel");

module.exports = {
    // Sign Up
    sign_up: async function (req, res) {
        try {
            req.body['created_date'] = moment().format()
            req.body['updated_date'] = moment().format()
    
            let whereEmail = { email: req.body.email, deleted: 0 }
            let userEmail = await User.findOne(whereEmail)
            if(userEmail) return res.status(409).send({ status: "error", message: "Email already in use." });
    
            bcryptjs.genSalt(saltRounds, (err, salt) => {
                // Hashing password
                bcryptjs.hash(req.body.password, salt, (err, hash) => {
                    req.body['password'] = hash
                    var userData = new User(req.body);
                    userData.save(function (err, savedUser) {
                        if (err) return res.status(422).send({ status: "error", message: err });
                        const accessToken = jwt.sign({ _id: savedUser._id, email: savedUser.email }, JWT_SECRET, { expiresIn: "31000000s" });
                        res.send({ status: "success", message: "User created successfully.",  token: accessToken });
                    });
                });
            });
        } catch (err) {
            console.log("USER SIGNUP CATCH ", err)
            res.status(500).send({ status: "error", message: "Internal server error." });
        }
    },

    // Sign In
    sign_in: async function (req, res) {
        try {
            const errors = validationResult(req);
            // Checking fields validation errors
            if (Object.keys(errors.array()).length > 0) return res.status(200).send({ status: "validation_error", errors: errors.array() });
            
            console.log(req.body.email);
            var where = { deleted: 0 };
            where["email"] = req.body.email;
            let user = await User.findOne(where)
            if(!user) return res.status(404).send({ status: "error", message: "User does not exist." })

            // Validating password
            bcryptjs.compare(req.body.password, user.password, async function (err, result) {
                if (result != true) return res.status(422).send({ status: "error", message: "Invalid password" });
                const accessToken = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "31000000s" });

                res.send({ status: "success", message: "Logged in successfully.", token: accessToken });
            });
        } catch (err) {
            console.log("SIGNIN CATCH ", e)
            res.status(500).send({ status: "error", message: "Internal server error." })
        }
    },

    current_user: async function (req, res) {
        try {
            let user = await User.findOne({ _id: req.token._id, deleted: 0 })
            if(!user) return res.status(404).send({ status: "error", message: "Could not get user." })
            user.password = null
            user.user_type = null
            res.send({ status: "success", message: "User obtained successfully.", result: user })
        } catch (err) {
            console.log("CURRENT USER CATCH ", err)
            res.status(500).send({ status: "error", message: "Internal server error." })
        }
    },
};
