var mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateKolkata = moment.tz(Date.now(), process.env.TZ);

var TechnologySchema = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    resources: [{
        type: String,
        default: ''
    }],
    status: {
        type: Number,
        default: 1
    },
    created_date: {
        type: Date,
        default: dateKolkata
    },
    updated_date: {
        type: Date,
        default: dateKolkata
    },
    deleted: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('technologies', TechnologySchema);