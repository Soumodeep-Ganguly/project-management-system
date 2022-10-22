// Required Libraries
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const moment = require("moment");
const nodemailer = require("nodemailer");

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
moment().format();
moment.suppressDeprecationWarnings = true;

// Required Models
const User = require("../models/UserModel");
const Country = require("../models/CountryModel");
const State = require("../models/StateModel");
const City = require("../models/CityModel");
const Building = require("../models/BuildingModel");
const Floor = require("../models/FloorModel");
const Screen = require("../models/ScreenModel");

const SMTP_HOST = "smtp.sendgrid.net";
const SMTP_PORT = "587";
const SMTP_USERNAME = "apikey";
const SMTP_PASSWORD = "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";
const EMAIL_FROM = "support@tastes2plate.online";

async function send_email(to, subject, message) {
    let userDetails = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        //secure: process.env.SMTP_SECURE, // true for 465, false for other ports
        auth: {
            user: SMTP_USERNAME, // generated ethereal user
            pass: SMTP_PASSWORD, // generated ethereal password
        },
    });

    userDetails
        .sendMail({
            from: EMAIL_FROM, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
        })
        .then((success) => {
            console.log(success);
        })
        .catch((error) => {
            console.log(error);
        });
}

module.exports = {
    // User login
    login: async function (req, res) {
        try {
            const errors = validationResult(req);
            // Checking fields validation errors
            
            if (Object.keys(errors.array()).length > 0) return res.status(200).send({ status: "validation_error", errors: errors.array() });
            
            console.log(req.body.email);
            var where = {};
            where["email"] = req.body.email;
            let user = await User.findOne(where)
            if(!user) return res.status(200).send({ status: "error", message: "User does not exist." })
            if (user.active == 0) return res.status(200).send({ status: "error", message: "Account is inactive" });
            var otp = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
            // Validating password
            bcryptjs.compare(req.body.password, user.password, async function (err, result) {
                if (result != true) return res.status(200).send({ status: "error", message: "Invalid password" });
                res.status(200).send({ status: "success", message: "OTP sent", email: req.body.email });
                
                await User.findOneAndUpdate({ _id: user._id }, { otp: otp }, { new: true })
                send_email(user.email, "Login OTP", `Your Login OTP is ${otp}`).catch(console.error)
            });
        } catch (err) {
            console.log("LOGIN CATCH ", e)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    complete_2_step: async function (req, res) {
        try {
            const errors = validationResult(req);
            // Checking fields validation errors
            
            if (Object.keys(errors.array()).length > 0) return res.status(200).send({ status: "validation_error", errors: errors.array() });
            
            console.log(req.body.email);
            var where = {};
            where["email"] = req.body.email;
            let user = await User.findOne(where)
            if(!user) return res.status(200).send({ status: "error", message: "User does not exist." })
            if (user.active == 0) return res.status(200).send({ status: "error", message: "Account is inactive." });
            if(req.body.otp != user.otp) return res.status(200).send({ status: "error", message: "Invalid OTP." });
            
            const accessToken = jwt.sign({
                    _id: user._id,
                    email: user.email,
                },
                JWT_SECRET,
                { expiresIn: "31000000s" });

            res.status(200).send({ status: "success", message: "Logged in", token: accessToken });
            await User.findOneAndUpdate({ _id: user._id }, { otp: '' }, { new: true })
        } catch (err) {
            console.log("2STEP CATCH ", e)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    resend_otp: async function (req, res) {
        try {
            const errors = validationResult(req);
            // Checking fields validation errors
            
            if (Object.keys(errors.array()).length > 0) return res.status(200).send({ status: "validation_error", errors: errors.array() });
            
            console.log(req.body.email);
            var where = {};
            where["email"] = req.body.email;
            let user = await User.findOne(where)
            if(!user) return res.status(200).send({ status: "error", message: "User does not exist." })
            var otp = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;

            res.status(200).send({ status: "success", message: "Sent OTP" });
            await User.findOneAndUpdate({ _id: user._id }, { otp: otp }, { new: true })
            send_email(user.email, "Login OTP", `Your Login OTP is ${otp}`).catch(console.error)
        } catch (err) {
            console.log("RESENT OTP CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    // Create User
    create_admin: function (req, res) {
        var where = {};
        where["mobile"] = req.body.mobile;
        // Checking user mobile number
        User.findOne(where)
            .then((response) => {
                if (response != null) {
                    res.status(200).send({
                        status: "error",
                        message: "Mobile already in use.",
                    });
                } else {
                    var where = {};
                    where["email"] = req.body.email;
                    // Checking user email
                    User.findOne(where)
                        .then((response) => {
                            if (response != null) {
                                res.status(200).send({
                                    status: "error",
                                    message: "Email address already in use.",
                                });
                            } else {
                                // // Generating password salt
                                bcryptjs.genSalt(saltRounds, (err, salt) => {
                                    // Hashing password
                                    bcryptjs.hash(req.body.password, salt, (err, hash) => {
                                        var userData = new User({
                                            first_name: req.body.first_name,
                                            last_name: req.body.last_name,
                                            email: req.body.email,
                                            mobile: req.body.mobile,
                                            password: hash,
                                            created_date: moment().format(),
                                        });

                                        userData.save(function (err, savedUser) {
                                            if (err) {
                                                res.status(200).send({ status: "error", message: err });
                                            } else {
                                                res.status(200).send({ status: "success", message: "Account has been created successfully." });
                                            }
                                        });
                                    });
                                });
                            }
                        })
                        .catch((error) => {
                            res.status(200).send({ status: "error", message: "Invalid email" });
                        });
                }
            })
            .catch((error) => {
                res.status(200).send({ status: "error", message: "Invalid mobile" });
            });
    },

    add_user: async function (req, res) {
        try {
            if(req.body['location.country'] != "") req.body['location.country'] = req.body['location.country'].split(',');
            else req.body['location.country'] = []
            
            if(req.body['location.state'] != "") req.body['location.state'] = req.body['location.state'].split(',');
            else req.body['location.state'] = []
    
            if(req.body['location.city'] != "") req.body['location.city'] = req.body['location.city'].split(',');
            else req.body['location.city'] = []
    
            if(req.body['location.building'] != "") req.body['location.building'] = req.body['location.building'].split(',');
            else req.body['location.building'] = []
    
            if(req.body['location.floor'] != "") req.body['location.floor'] = req.body['location.floor'].split(',');
            else req.body['location.floor'] = []
    
            if(req.body['location.screen'] != "") req.body['location.screen'] = req.body['location.screen'].split(',');
            else req.body['location.screen'] = []
    
            req.body['user_type'] = "user"
            req.body['created_date'] = moment().format()
            req.body['updated_date'] = moment().format()

            let whereMobile = { mobile: req.body.mobile, deleted: 0 }
            let userMobile = await User.findOne(whereMobile)
            if(userMobile) return res.status(200).send({ status: "error", message: "Mobile already in use." });
    
            let whereEmail = { email: req.body.email, deleted: 0 }
            let userEmail = await User.findOne(whereEmail)
            if(userEmail) return res.status(200).send({ status: "error", message: "Email already in use." });
    
            bcryptjs.genSalt(saltRounds, (err, salt) => {
                // Hashing password
                bcryptjs.hash(req.body.password, salt, (err, hash) => {
                    req.body['password'] = hash
                    var userData = new User(req.body);
                    userData.save(function (err, savedUser) {
                        if (err) {
                            res.status(200).send({ status: "error", message: err });
                        } else {
                            res.status(200).send({ status: "success", message: "User added successfully." });
                        }
                    });
                });
            });
        } catch (err) {
            console.log("USER ADD CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." });
        }
    },

    update_user: async function (req, res) {
        try {
            if(req.body['location.country'] != "") req.body['location.country'] = req.body['location.country'].split(',');
            else req.body['location.country'] = []
            
            if(req.body['location.state'] != "") req.body['location.state'] = req.body['location.state'].split(',');
            else req.body['location.state'] = []
    
            if(req.body['location.city'] != "") req.body['location.city'] = req.body['location.city'].split(',');
            else req.body['location.city'] = []
    
            if(req.body['location.building'] != "") req.body['location.building'] = req.body['location.building'].split(',');
            else req.body['location.building'] = []
    
            if(req.body['location.floor'] != "") req.body['location.floor'] = req.body['location.floor'].split(',');
            else req.body['location.floor'] = []
    
            if(req.body['location.screen'] != "") req.body['location.screen'] = req.body['location.screen'].split(',');
            else req.body['location.screen'] = []
    
            req.body['updated_date'] = moment().format()
    
            let whereMobile = { mobile: req.body.mobile, deleted: 0 }
            let userMobile = await User.findOne(whereMobile)
            if(userMobile && userMobile._id != req.body.id) return res.status(200).send({ status: "error", message: "Mobile already in use." });
    
            let whereEmail = { email: req.body.email, deleted: 0 }
            let userEmail = await User.findOne(whereEmail)
            if(userEmail && userEmail._id != req.body.id) return res.status(200).send({ status: "error", message: "Email already in use." });
    
            if(req.body.password && req.body.password != "") {
                bcryptjs.genSalt(saltRounds, (err, salt) => {
                    // Hashing password
                    bcryptjs.hash(req.body.password, salt, async (err, hash) => {
                        if(err) {
                            delete req.body['password']
                            await User.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true })
                            return res.status(200).send({ status: "error", message: "Unable to change password." });
                        }
                        req.body['password'] = hash
                        await User.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true })
                        res.status(200).send({ status: "success", message: "User updated successfully." });
                    });
                });
            } else {
                delete req.body['password']
                await User.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true })
                res.status(200).send({ status: "success", message: "User updated successfully." });
            }
        } catch (err) {
            console.log("USER UPDATE CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." });
        }
    },

    simple_user_update: async function (req, res) {
        try {
            req.body['updated_date'] = moment().format()
            await User.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true })
            res.status(200).send({ status: "success", message: "User updated successfully." });
        } catch (err) {
            console.log("USER UPDATE CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." });
        }
    },

    user_list: async function (req, res) {
        try {
            let where = { deleted: 0, user_type: "user" }
            if (req.body.search && req.body.search != "") {
                where['$or'] = [{
                    first_name: { $regex: ".*" + req.body.search, $options: "i" },
                    last_name: { $regex: ".*" + req.body.search, $options: "i" },
                    email: { $regex: ".*" + req.body.search, $options: "i" },
                    mobile: { $regex: ".*" + req.body.search, $options: "i" },
                    employee_code: { $regex: ".*" + req.body.search, $options: "i" },
                }]
            }
            if (req.body.country && req.body.country != "" && req.body.country != "null" && req.body.country != "undefined") where["location.country"] = { $in: req.body.country.split(',') };
            if (req.body.state && req.body.state != "" && req.body.state != "null" && req.body.state != "undefined") where["location.state"] = { $in: req.body.state.split(',') };
            if (req.body.city && req.body.city != "" && req.body.city != "null" && req.body.city != "undefined") where["location.city"] = { $in: req.body.city.split(',') };
            if (req.body.building && req.body.building != "" && req.body.building != "null" && req.body.building != "undefined") where["location.building"] = { $in: req.body.building.split(',') };
            if (req.body.floor && req.body.floor != "" && req.body.floor != "null" && req.body.floor != "undefined") where["location.floor"] = { $in: req.body.floor.split(',') };
            if (req.body.screen && req.body.screen != "" && req.body.screen != "null" && req.body.screen != "undefined") where["location.screen"] = { $in: req.body.screen.split(',') };

            let users = await User.find(where, null, { limit: parseInt(req.body.limit), skip: parseInt(req.body.page) }).sort({ created_date: -1 })
                                    .populate('location.country')
                                    .populate('location.state')
                                    .populate('location.city')
                                    .populate('location.building')
                                    .populate('location.floor')
                                    .populate('location.screen')
            let totalCount = await User.find(where).countDocuments()
            res.status(200).send({ status: "success", message: "Users obtained successfully.", result: users, totalCount })
        } catch (err) {
            console.log("USER LIST CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    single_user: async function (req, res) {
        try {
            let user = await User.findOne({ _id: req.body.id })
                .populate('location.country')
                .populate('location.state')
                .populate('location.city')
                .populate('location.building')
                .populate('location.floor')
                .populate('location.screen')
            if(!user) return res.status(200).send({ status: "error", message: "User not found." })
            user.password = null
            res.status(200).send({ status: "success", message: "Users obtained successfully.", result: user })
        } catch (err) {
            console.log("SINGLE USER CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    delete_user: async function (req, res) {
        try {
            await User.findOneAndUpdate({ _id: req.body.id }, { deleted: 1 }, { new: true })
            res.status(200).send({ status: "success", message: "User deleted successfully." })
        } catch (err) {
            console.log("USER DELETE CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    // Change admin password
    change_password: function (req, res) {
        var where = {};
        where["_id"] = req.body.id;

        var updateData = {};
        updateData["updated_date"] = moment().format();

        bcryptjs.genSalt(saltRounds, (err, salt) => {
            bcryptjs.hash(req.body.password, salt, (err, hash) => {
                if (req.body.password != "") {
                    updateData["password"] = hash;
                }

                User.findOneAndUpdate(where, updateData, {
                    new: true,
                })
                    .exec()
                    .then((response) => {
                        res.status(200).send({ status: "success", message: "Password updated successfully", token: req.token });
                    })
                    .catch((error) => {
                        res.status(200).send({ status: "error", message: "Something went wrong", token: req.token });
                    });
            });
        });
    },

    current_user: async function (req, res) {
        try {
            let user = await User.findOne({ _id: req.token._id, deleted: 0 })
            if(!user) return res.status(200).send({ status: "error", message: "Could not get user." })
            user.password = null
            user.user_type = null
            res.status(200).send({ status: "success", message: "User obtained successfully.", result: user })
        } catch (err) {
            console.log("CURRENT USER CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    // Country
    add_country: async function (req, res) {
        try {
            const errors = validationResult(req);
            // Checking fields validation errors
            if (Object.keys(errors.array()).length > 0) return res.status(200).send({ status: "validation_error", errors: errors.array() });
            
            let country = await Country.findOne({ code: req.body.code, deleted: 0 })
            if(country) return res.status(200).send({ status: "error", message: "Country already exist." })
            
            var countryData = new Country({
                name: req.body.name,
                code: req.body.code,
                created_date: moment().format(),
                updated_date: moment().format()
            });

            countryData.save(function (err, response) {
                if (err) return res.status(200).send({ status: "error", message: err })
                res.status(200).send({ status: "success", message: "Country added successfully." });
            })
        } catch (err) {
            console.log("COUNTRY ADD CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    country_list: async function (req, res) {
        try {
            let where = { deleted: 0 }
            if (req.body.search && req.body.search != "") {
                where["name"] = { $regex: ".*" + req.body.search, $options: "i" };
            }
            let countries = await Country.find(where, null, { limit: parseInt(req.body.limit), skip: parseInt(req.body.page) }).sort({ created_date: -1 })
            let totalCount = await Country.find(where).countDocuments()
            res.status(200).send({ status: "success", message: "Countries obtained successfully.", result: countries, totalCount })
        } catch (err) {
            console.log("COUNTRY LIST CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    delete_country: async function (req, res) {
        try {
            await Country.findOneAndUpdate({ _id: req.body.id }, { deleted: 1 }, { new: true })
            res.status(200).send({ status: "success", message: "Country deleted successfully." })
        } catch (err) {
            console.log("COUNTRY DELETE CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    // State
    add_state: async function (req, res) {
        try {
            const errors = validationResult(req);
            // Checking fields validation errors
            if (Object.keys(errors.array()).length > 0) return res.status(200).send({ status: "validation_error", errors: errors.array() });
            let id = 1
            let state = await State.findOne({}).sort({ created_date: -1 })
            if(state) id = state.id + 1
            
            var stateData = new State({
                id,
                name: req.body.name,
                country: req.body.country,
                created_date: moment().format(),
                updated_date: moment().format()
            });

            stateData.save(function (err, response) {
                if (err) return res.status(200).send({ status: "error", message: err })
                res.status(200).send({ status: "success", message: "State added successfully." });
            })
        } catch (err) {
            console.log("STATE ADD CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    state_list: async function (req, res) {
        try {
            let where = { deleted: 0 }
            if (req.body.search && req.body.search != "") {
                where["name"] = { $regex: ".*" + req.body.search, $options: "i" };
            }
            if (req.body.country && req.body.country != "" && req.body.country != "null" && req.body.country != "undefined") where["country"] = { $in: req.body.country.split(',') };
            
            let states = await State.find(where, null, { limit: parseInt(req.body.limit), skip: parseInt(req.body.page) }).sort({ created_date: -1 }).populate("country")
            let totalCount = await State.find(where).countDocuments()
            res.status(200).send({ status: "success", message: "States obtained successfully.", result: states, totalCount })
        } catch (err) {
            console.log("STATE LIST CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    delete_state: async function (req, res) {
        try {
            await State.findOneAndUpdate({ _id: req.body.id }, { deleted: 1 }, { new: true })
            res.status(200).send({ status: "success", message: "State deleted successfully." })
        } catch (err) {
            console.log("STATE DELETE CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    // City
    add_city: async function (req, res) {
        try {
            const errors = validationResult(req);
            // Checking fields validation errors
            if (Object.keys(errors.array()).length > 0) return res.status(200).send({ status: "validation_error", errors: errors.array() });
            let id = 1
            let city = await City.findOne({}).sort({ created_date: -1 })
            if(city) id = city.id + 1
            
            var cityData = new City({
                id,
                name: req.body.name,
                country: req.body.country,
                state: req.body.state,
                created_date: moment().format(),
                updated_date: moment().format()
            });

            cityData.save(function (err, response) {
                if (err) return res.status(200).send({ status: "error", message: err })
                res.status(200).send({ status: "success", message: "City added successfully." });
            })
        } catch (err) {
            console.log("CITY ADD CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    city_list: async function (req, res) {
        try {
            let where = { deleted: 0 }
            if (req.body.search && req.body.search != "") {
                where["name"] = { $regex: ".*" + req.body.search, $options: "i" };
            }
            if (req.body.country && req.body.country != "" && req.body.country != "null" && req.body.country != "undefined") where["country"] = { $in: req.body.country.split(',') };
            if (req.body.state && req.body.state != "" && req.body.state != "null" && req.body.state != "undefined") where["state"] = { $in: req.body.state.split(',') };

            let cities = await City.find(where, null, { limit: parseInt(req.body.limit), skip: parseInt(req.body.page) }).sort({ created_date: -1 })
                .populate("country")
                .populate("state")
            let totalCount = await City.find(where).countDocuments()
            res.status(200).send({ status: "success", message: "Cities obtained successfully.", result: cities, totalCount })
        } catch (err) {
            console.log("CITY LIST CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    delete_city: async function (req, res) {
        try {
            await City.findOneAndUpdate({ _id: req.body.id }, { deleted: 1 }, { new: true })
            res.status(200).send({ status: "success", message: "City deleted successfully." })
        } catch (err) {
            console.log("CITY DELETE CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    // Building
    add_building: async function (req, res) {
        try {
            const errors = validationResult(req);
            // Checking fields validation errors
            if (Object.keys(errors.array()).length > 0) return res.status(200).send({ status: "validation_error", errors: errors.array() });
            let id = 1
            let building = await Building.findOne({}).sort({ created_date: -1 })
            if(building) id = building.id + 1
            
            var buildingData = new Building({
                id,
                name: req.body.name,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                created_date: moment().format(),
                updated_date: moment().format()
            });

            buildingData.save(function (err, response) {
                if (err) return res.status(200).send({ status: "error", message: err })
                res.status(200).send({ status: "success", message: "Building added successfully." });
            })
        } catch (err) {
            console.log("BUILDING ADD CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    building_list: async function (req, res) {
        try {
            let where = { deleted: 0 }
            if (req.body.search && req.body.search != "") {
                where["name"] = { $regex: ".*" + req.body.search, $options: "i" };
            }
            if (req.body.country && req.body.country != "" && req.body.country != "null" && req.body.country != "undefined") where["country"] = { $in: req.body.country.split(',') };
            if (req.body.state && req.body.state != "" && req.body.state != "null" && req.body.state != "undefined") where["state"] = { $in: req.body.state.split(',') };
            if (req.body.city && req.body.city != "" && req.body.city != "null" && req.body.city != "undefined") where["city"] = { $in: req.body.city.split(',') };

            let buildings = await Building.find(where, null, { limit: parseInt(req.body.limit), skip: parseInt(req.body.page) }).sort({ created_date: -1 })
                .populate("country")
                .populate("state")
                .populate("city")
            let totalCount = await Building.find(where).countDocuments()
            res.status(200).send({ status: "success", message: "Buildings obtained successfully.", result: buildings, totalCount })
        } catch (err) {
            console.log("BUILDING LIST CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    delete_building: async function (req, res) {
        try {
            await Building.findOneAndUpdate({ _id: req.body.id }, { deleted: 1 }, { new: true })
            res.status(200).send({ status: "success", message: "Building deleted successfully." })
        } catch (err) {
            console.log("BUILDING DELETE CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    // Floor
    add_floor: async function (req, res) {
        try {
            const errors = validationResult(req);
            // Checking fields validation errors
            if (Object.keys(errors.array()).length > 0) return res.status(200).send({ status: "validation_error", errors: errors.array() });
            let id = 1
            let floor = await Floor.findOne({}).sort({ created_date: -1 })
            if(floor) id = floor.id + 1
            
            var floorData = new Floor({
                id,
                name: req.body.name,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                building: req.body.building,
                created_date: moment().format(),
                updated_date: moment().format()
            });

            floorData.save(function (err, response) {
                if (err) return res.status(200).send({ status: "error", message: err })
                res.status(200).send({ status: "success", message: "Floor added successfully." });
            })
        } catch (err) {
            console.log("FLOOR ADD CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    floor_list: async function (req, res) {
        try {
            let where = { deleted: 0 }
            if (req.body.search && req.body.search != "") {
                where["name"] = { $regex: ".*" + req.body.search, $options: "i" };
            }
            if (req.body.country && req.body.country != "" && req.body.country != "null" && req.body.country != "undefined") where["country"] = { $in: req.body.country.split(',') };
            if (req.body.state && req.body.state != "" && req.body.state != "null" && req.body.state != "undefined") where["state"] = { $in: req.body.state.split(',') };
            if (req.body.city && req.body.city != "" && req.body.city != "null" && req.body.city != "undefined") where["city"] = { $in: req.body.city.split(',') };
            if (req.body.building && req.body.building != "" && req.body.building != "null" && req.body.building != "undefined") where["building"] = { $in: req.body.building.split(',') };

            let floors = await Floor.find(where, null, { limit: parseInt(req.body.limit), skip: parseInt(req.body.page) }).sort({ created_date: -1 })
                .populate("country")
                .populate("state")
                .populate("city")
                .populate("building")
            let totalCount = await Floor.find(where).countDocuments()
            res.status(200).send({ status: "success", message: "Floors obtained successfully.", result: floors, totalCount })
        } catch (err) {
            console.log("FLOOR LIST CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    delete_floor: async function (req, res) {
        try {
            await Floor.findOneAndUpdate({ _id: req.body.id }, { deleted: 1 }, { new: true })
            res.status(200).send({ status: "success", message: "Floor deleted successfully." })
        } catch (err) {
            console.log("FLOOR DELETE CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    // Screen
    add_screen: async function (req, res) {
        try {
            const errors = validationResult(req);
            // Checking fields validation errors
            if (Object.keys(errors.array()).length > 0) return res.status(200).send({ status: "validation_error", errors: errors.array() });
            let id = 1
            let screen = await Screen.findOne({}).sort({ created_date: -1 })
            if(screen) id = screen.id + 1
            
            var screenData = new Screen({
                id,
                name: req.body.name,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                building: req.body.building,
                floor: req.body.floor,
                created_date: moment().format(),
                updated_date: moment().format()
            });

            screenData.save(function (err, response) {
                if (err) return res.status(200).send({ status: "error", message: err })
                res.status(200).send({ status: "success", message: "Screen added successfully." });
            })
        } catch (err) {
            console.log("SCREEN ADD CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    screen_list: async function (req, res) {
        try {
            let where = { deleted: 0 }
            if (req.body.search && req.body.search != "") {
                where["name"] = { $regex: ".*" + req.body.search, $options: "i" };
            }
            if (req.body.country && req.body.country != "" && req.body.country != "null" && req.body.country != "undefined") where["country"] = { $in: req.body.country.split(',') };
            if (req.body.state && req.body.state != "" && req.body.state != "null" && req.body.state != "undefined") where["state"] = { $in: req.body.state.split(',') };
            if (req.body.city && req.body.city != "" && req.body.city != "null" && req.body.city != "undefined") where["city"] = { $in: req.body.city.split(',') };
            if (req.body.building && req.body.building != "" && req.body.building != "null" && req.body.building != "undefined") where["building"] = { $in: req.body.building.split(',') };
            if (req.body.floor && req.body.floor != "" && req.body.floor != "null" && req.body.floor != "undefined") where["floor"] = { $in: req.body.floor.split(',') };

            let screens = await Screen.find(where, null, { limit: parseInt(req.body.limit), skip: parseInt(req.body.page) }).sort({ created_date: -1 })
                .populate("country")
                .populate("state")
                .populate("city")
                .populate("building")
                .populate("floor")
            let totalCount = await Screen.find(where).countDocuments()
            res.status(200).send({ status: "success", message: "Screens obtained successfully.", result: screens, totalCount })
        } catch (err) {
            console.log("SCREEN LIST CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },

    delete_screen: async function (req, res) {
        try {
            await Screen.findOneAndUpdate({ _id: req.body.id }, { deleted: 1 }, { new: true })
            res.status(200).send({ status: "success", message: "Screen deleted successfully." })
        } catch (err) {
            console.log("SCREEN DELETE CATCH ", err)
            res.status(200).send({ status: "error", message: "Internal server error." })
        }
    },
};
