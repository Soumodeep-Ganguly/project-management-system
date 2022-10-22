var mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");
var CountrySchema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    code: {
        type: String,
        default: ""
    },
    created_date: {
        type: Date, default: dateKolkata
    },
    update_date: {
        type: Date, default: dateKolkata
    },
    deleted: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('countries', CountrySchema);