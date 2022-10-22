module.exports = function (app) {
    var AdminController = require("../controllers/AdminController");

    const { check } = require("express-validator");
    const jwt = require("jsonwebtoken");
    const JWT_SECRET = process.env.JWT_SECRET;

    function generateAccessToken(key) {
        // expires after half and hour (1800 seconds = 30 minutes)
        const accessToken = jwt.sign({ mobile: key }, JWT_SECRET, { expiresIn: "180000s" });
        return accessToken;
    }

    function authenticateToken(req, res, next) {
        // Gather the jwt access token from the request header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[0];

        //console.log(authHeader.split(' '));
        if (token == null) return res.sendStatus(401); // if there isn't any token

        jwt.verify(token, process.env.JWT_SECRET, (err, mobile) => {
            if (err) return res.sendStatus(401);
            req.token = generateAccessToken(mobile);
            next(); // pass the execution off to whatever request the client intended
        });
    }

    app

        /// Create Admin
        .post("/admin/create-super-admin", [], AdminController.create_admin)

        .post("/admin/change-password", [], authenticateToken, AdminController.change_password)

        .post(
            "/admin/login",
            [
                check("email").trim().isLength({ min: 1 }).withMessage("Enter email address").isEmail().withMessage("Invalid email address"),
                check("password").trim().isLength({ min: 1 }).withMessage("Enter password"),
            ],
            AdminController.login
        )

        .post(
            "/admin/two-step-verification",
            [
                check("email").trim().isLength({ min: 1 }).withMessage("Enter email address").isEmail().withMessage("Invalid email address"),
                check("otp").trim().isLength({ min: 1 }).withMessage("Enter otp"),
            ],
            AdminController.complete_2_step
        )

        .post(
            "/admin/resend-otp",
            [
                check("email").trim().isLength({ min: 1 }).withMessage("Enter email address").isEmail().withMessage("Invalid email address")
            ],
            AdminController.resend_otp
        )

        // Users
        .post("/admin/add-user", [], authenticateToken, AdminController.add_user)

        .post("/admin/update-user", [], authenticateToken, AdminController.update_user)

        .post("/admin/simple-user-update", [], authenticateToken, AdminController.simple_user_update)

        .post("/admin/users", [], authenticateToken, AdminController.user_list)

        .post("/admin/user", [], authenticateToken, AdminController.single_user)

        .post("/admin/delete-user", [], authenticateToken, AdminController.delete_user)

        // Country
        .post("/admin/add-country", [
                check("code").trim().isLength({ min: 1 }).withMessage("Enter country code."),
                check("name").trim().isLength({ min: 1 }).withMessage("Enter country name.")
        ], authenticateToken, AdminController.add_country)

        .post("/admin/countries", [], authenticateToken, AdminController.country_list)

        .post("/admin/delete-country", [], authenticateToken, AdminController.delete_country)

        // State
        .post("/admin/add-state", [
            check("name").trim().isLength({ min: 1 }).withMessage("Enter state name."),
            check("country").trim().isLength({ min: 1 }).withMessage("Enter country."),
        ], authenticateToken, AdminController.add_state)

        .post("/admin/states", [], authenticateToken, AdminController.state_list)

        .post("/admin/delete-state", [], authenticateToken, AdminController.delete_state)

        // City
        .post("/admin/add-city", [
            check("name").trim().isLength({ min: 1 }).withMessage("Enter city name."),
            check("state").trim().isLength({ min: 1 }).withMessage("Enter state."),
            check("country").trim().isLength({ min: 1 }).withMessage("Enter country."),
        ], authenticateToken, AdminController.add_city)

        .post("/admin/cities", [], authenticateToken, AdminController.city_list)

        .post("/admin/delete-city", [], authenticateToken, AdminController.delete_city)

        // Building
        .post("/admin/add-building", [
            check("name").trim().isLength({ min: 1 }).withMessage("Enter building name."),
            check("city").trim().isLength({ min: 1 }).withMessage("Enter city."),
            check("state").trim().isLength({ min: 1 }).withMessage("Enter state."),
            check("country").trim().isLength({ min: 1 }).withMessage("Enter country."),
        ], authenticateToken, AdminController.add_building)

        .post("/admin/buildings", [], authenticateToken, AdminController.building_list)

        .post("/admin/delete-building", [], authenticateToken, AdminController.delete_building)

        // Floor
        .post("/admin/add-floor", [
            check("name").trim().isLength({ min: 1 }).withMessage("Enter floor name."),
            check("building").trim().isLength({ min: 1 }).withMessage("Enter building."),
            check("city").trim().isLength({ min: 1 }).withMessage("Enter city."),
            check("state").trim().isLength({ min: 1 }).withMessage("Enter state."),
            check("country").trim().isLength({ min: 1 }).withMessage("Enter country."),
        ], authenticateToken, AdminController.add_floor)

        .post("/admin/floors", [], authenticateToken, AdminController.floor_list)

        .post("/admin/delete-floor", [], authenticateToken, AdminController.delete_floor)

        // Screen
        .post("/admin/add-screen", [
            check("name").trim().isLength({ min: 1 }).withMessage("Enter screen name."),
            check("floor").trim().isLength({ min: 1 }).withMessage("Enter floor."),
            check("building").trim().isLength({ min: 1 }).withMessage("Enter building."),
            check("city").trim().isLength({ min: 1 }).withMessage("Enter city."),
            check("state").trim().isLength({ min: 1 }).withMessage("Enter state."),
            check("country").trim().isLength({ min: 1 }).withMessage("Enter country."),
        ], authenticateToken, authenticateToken, AdminController.add_screen)

        .post("/admin/screens", [], authenticateToken, AdminController.screen_list)

        .post("/admin/delete-screen", [], authenticateToken, AdminController.delete_screen)
        
};
