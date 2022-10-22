var mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");
var StateSchema = mongoose.Schema({
    id: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        default: ""
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'countries',
        default: null
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
module.exports = mongoose.model('states', StateSchema);