module.exports = function (app) {
    let technologyController = require("../controllers/technologyController");
    let { authenticateToken } = require("../utils/auth");

    app
        .post("/technology", authenticateToken, technologyController.add_technology)

        .get("/technologies", authenticateToken, technologyController.technology_list)

};
