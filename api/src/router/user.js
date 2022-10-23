module.exports = function (app) {
    let userController = require("../controllers/userController");
    let { authenticateToken } = require("../utils/auth");

    app
        .post("/sign-up", userController.sign_up)

        .post("/sign-in", userController.sign_in)

        // Users
        .get("/me", [], authenticateToken, userController.current_user)

};
