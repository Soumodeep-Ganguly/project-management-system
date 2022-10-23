// Required Libraries
const moment = require("moment");

moment().format();
moment.suppressDeprecationWarnings = true;

// Required Models
const Technology = require("../models/TechnologyModel");

module.exports = {
    add_technology: async function (req, res) {
        try {
            req.body['created_date'] = moment().format()
            req.body['updated_date'] = moment().format()
    
            var technologyData = new Technology(req.body);
            technologyData.save(function (err, savedTechnology) {
                if (err) return res.status(422).send({ status: "error", message: err });
                res.send({ status: "success", message: "Technology added successfully." });
            });
        } catch (err) {
            console.log("TECHNOLOGY ADD CATCH ", err)
            res.status(500).send({ status: "error", message: "Internal server error." });
        }
    },

    technology_list: async function (req, res) {
        try {
            let technologies = await Technology.find({})
            res.send({ status: "success", result: technologies });
        } catch (err) {
            console.log("TECHNOLOGY ADD CATCH ", err)
            res.status(500).send({ status: "error", message: "Internal server error." });
        }
    },
};
